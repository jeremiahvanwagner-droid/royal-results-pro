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
                const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

                if (!GHL_API_KEY || !GHL_LOCATION_ID) {
                    throw new Error("GHL API credentials not configured");
                }

                const PIPELINE_MAP: Record<string, { pipelineId: string; stageId: string }> = {
                    counseling: { pipelineId: "DZqWkbnMYLR2KsM6CZEI", stageId: "89341beb-8ebd-4c01-aaef-70e79a6ae945" },
                    mentorship: { pipelineId: "TQ4YwWKY0mK0oHBsrMOQ", stageId: "81db76c4-0979-4928-8f80-77881dc70c55" },
                    events:     { pipelineId: "ftTAZgsyqiVYmOY1bxjM", stageId: "b1ef045a-c53f-4f2e-b562-1f0495583974" },
                    detailing:  { pipelineId: "7PX9HoWqvgtdHEQOjC4g", stageId: "fc6efa25-033c-49e2-af7d-56b0d961418a" },
                    bodyrepair: { pipelineId: "7PX9HoWqvgtdHEQOjC4g", stageId: "fc6efa25-033c-49e2-af7d-56b0d961418a" },
                    webdev:     { pipelineId: "96BqPumQUNIcnX4igrA0", stageId: "971e5379-ef03-4959-bae5-17ddc5dfa0c1" },
                };

                const nameParts = input.name.trim().split(/\s+/).filter(Boolean);
                const firstName = nameParts[0] || input.name.trim();
                const lastName = nameParts.slice(1).join(" ");
                const serviceValue = input.service?.trim() || "General";

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
                    tags: [
                        "website-inquiry",
                        serviceValue.toLowerCase().replace(/\s+/g, "-"),
                    ],
                };

                const res = await fetch(
                    "https://services.leadconnectorhq.com/contacts/",
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

                const pipeline = PIPELINE_MAP[input.service ?? ""];
                if (pipeline) {
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
                                pipelineId: pipeline.pipelineId,
                                pipelineStageId: pipeline.stageId,
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
