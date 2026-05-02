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

                const nameParts = input.name.trim().split(" ");
                const firstName = nameParts[0];
                const lastName = nameParts.slice(1).join(" ") || "";

                const noteText = [
                    `Service Interest: ${input.service || "Not specified"}`,
                    `Message: ${input.message}`,
                ].join("\n");

                const res = await fetch(
                    "https://services.leadconnectorhq.com/contacts/",
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${GHL_API_KEY}`,
                            "Content-Type": "application/json",
                            Version: "2021-07-28",
                        },
                        body: JSON.stringify({
                            locationId: GHL_LOCATION_ID,
                            firstName,
                            lastName,
                            email: input.email,
                            phone: input.phone || undefined,
                            source: "Website Contact Form",
                            customField: [
                                {
                                    id: "service_interest",
                                    field_value: input.service || "",
                                },
                            ],
                            tags: ["website-inquiry", input.service || "general"].filter(Boolean),
                        }),
                    }
                );

                if (!res.ok) {
                    const errorBody = await res.text();
                    console.error("GHL API error:", res.status, errorBody);
                    throw new Error("Failed to submit contact to CRM");
                }

                const contactData = await res.json();
                const contactId = contactData?.contact?.id;

                // Add a note with service interest and message
                if (contactId) {
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
                                userId: contactId,
                                body: noteText,
                            }),
                        }
                    ).catch(err => console.error("Failed to add note:", err));
                }

                return { success: true };
            }),
    }),

    // TODO: add feature routers here, e.g.
    // todo: router({
    //   list: protectedProcedure.query(({ ctx }) =>
    //     ctx.db.query.todos.findMany({ where: eq(schema.todos.userId, ctx.user.id) })
    //   ),
    // }),
});
