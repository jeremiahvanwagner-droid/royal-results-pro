import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createDonationCheckoutSession } from "./stripe";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
    system: systemRouter,
    auth: router({
        me: publicProcedure.query(opts => opts.ctx.user),
        logout: publicProcedure.mutation(({ ctx }) => {
            const cookieOptions = getSessionCookieOptions(ctx.req);
            ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
            return {
                success: true,
            } as const;
        }),
    }),

    donation: router({
        createCheckout: publicProcedure
            .input(
                z.object({
                    amountCents: z.number().int().min(50),
                    donorName: z.string().optional(),
                    donorEmail: z.string().email().optional(),
                    message: z.string().max(500).optional(),
                    origin: z.string().url(),
                })
            )
            .mutation(async ({ input }) => {
                const url = await createDonationCheckoutSession(input);
                return { url };
            }),
    }),

    contact: router({
        submit: publicProcedure
            .input(
                z.object({
                    name: z.string().min(1),
                    email: z.string().email(),
                    phone: z.string().optional(),
                    service: z.string().optional(),
                    message: z.string().min(1),
                })
            )
            .mutation(async ({ input }) => {
                const GHL_API_KEY = process.env.GHL_API_KEY;

                if (!GHL_API_KEY) {
                    throw new Error("GHL API credentials not configured");
                }

                // Royal Results sub-account IDs (not secrets). Pinned in code so leads can only land
                // in Royal Results: a key for any other location is rejected rather than misrouted.
                const GHL_LOCATION_ID = "wjcXAv9khoXK0UfiGxEp";
                // One "Royal Results Leads" pipeline, entering at "New Inquiry"; the service is
                // carried by a tag and the Service Interest custom field.
                const GHL_PIPELINE_ID = "D5SnCHMSRiFE4vXI0DXn";
                const GHL_PIPELINE_STAGE_ID = "1b58b7b7-03fa-4189-8ba9-a190c74a091b";

                const SERVICE_LABELS: Record<string, string> = {
                    counseling: "Counseling",
                    mentorship: "Mentorship",
                    events: "Event Set-Up",
                    detailing: "Car Detailing",
                    bodyrepair: "Car Body Repair",
                    webdev: "Website Development",
                    other: "Other / General Inquiry",
                };

                const nameParts = input.name.trim().split(/\s+/).filter(Boolean);
                const firstName = nameParts[0] || input.name.trim();
                const lastName = nameParts.slice(1).join(" ");
                const serviceKey = input.service?.trim() || "other";
                const serviceValue = SERVICE_LABELS[serviceKey] ?? "Other / General Inquiry";

                const noteText = [
                    "Website inquiry submitted from royalresults.pro",
                    `Name: ${input.name}`,
                    `Email: ${input.email}`,
                    `Phone: ${input.phone || "Not provided"}`,
                    `Service Interest: ${serviceValue}`,
                    `Message: ${input.message}`,
                ].join("\n");

                const contactPayload = {
                    locationId: GHL_LOCATION_ID,
                    firstName,
                    lastName,
                    email: input.email,
                    phone: input.phone || undefined,
                    source: "Website Contact Form",
                    tags: ["website-inquiry", serviceKey],
                    customFields: [
                        { key: "service_interest", field_value: serviceValue },
                        { key: "inquiry_message", field_value: input.message },
                        { key: "lead_source_detail", field_value: "royalresults.pro contact form" },
                    ],
                };

                // Upsert so a returning visitor updates their record instead of failing on a duplicate.
                const res = await fetch(
                    "https://services.leadconnectorhq.com/contacts/upsert",
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${GHL_API_KEY}`,
                            "Content-Type": "application/json",
                            Version: "2021-07-28",
                        },
                        body: JSON.stringify(contactPayload),
                    }
                );

                if (!res.ok) {
                    const errorBody = await res.text();
                    console.error("GHL contact create error:", res.status, errorBody);
                    throw new Error("Failed to submit contact to CRM");
                }

                const contactData = await res.json();
                const contactId = contactData?.contact?.id ?? contactData?.id;

                if (!contactId) {
                    console.error("GHL contact response missing id:", contactData);
                    throw new Error("Contact created but no contact id returned from CRM");
                }

                await fetch(
                    `https://services.leadconnectorhq.com/contacts/${contactId}/notes`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${GHL_API_KEY}`,
                            "Content-Type": "application/json",
                            Version: "2021-07-28",
                        },
                        body: JSON.stringify({
                            contactId,
                            body: noteText,
                        }),
                    }
                ).then(async noteRes => {
                    if (!noteRes.ok) {
                        const noteError = await noteRes.text();
                        console.error("GHL note create error:", noteRes.status, noteError);
                    }
                }).catch(err => console.error("Failed to add note:", err));

                {
                    await fetch(
                        "https://services.leadconnectorhq.com/opportunities/",
                        {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${GHL_API_KEY}`,
                                "Content-Type": "application/json",
                                Version: "2021-07-28",
                            },
                            body: JSON.stringify({
                                locationId: GHL_LOCATION_ID,
                                pipelineId: GHL_PIPELINE_ID,
                                pipelineStageId: GHL_PIPELINE_STAGE_ID,
                                contactId,
                                name: `${input.name} — ${serviceValue}`,
                                status: "open",
                                source: "Website Contact Form",
                            }),
                        }
                    ).then(async oppRes => {
                        if (!oppRes.ok) {
                            const oppError = await oppRes.text();
                            console.error("GHL opportunity error:", oppRes.status, oppError);
                        }
                    }).catch(err => console.error("Failed to create opportunity:", err));
                }

                return { success: true, contactId };
            }),
    }),

    // TODO: add feature routers here, e.g.
    // todo: router({
    //   list: protectedProcedure.query(({ ctx }) =>
    //     ctx.db.query.todos.findMany({ where: eq(schema.todos.userId, ctx.user.id) })
    //   ),
    // }),
});

export type AppRouter = typeof appRouter;
