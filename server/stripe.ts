/**
 * ROYAL RESULTS — STRIPE INTEGRATION
 * Handles donation checkout sessions and webhook events
 */

import Stripe from "stripe";
import type { Express, Request, Response } from "express";
import express from "express";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

/**
 * Register the Stripe webhook route.
 * MUST be registered BEFORE express.json() to allow raw body parsing.
 */
export function registerStripeWebhook(app: Express) {
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req: Request, res: Response) => {
      const sig = req.headers["stripe-signature"] as string;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      let event: Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret!);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("[Stripe Webhook] Signature verification failed:", message);
        return res.status(400).send(`Webhook Error: ${message}`);
      }

      // Handle test events
      if (event.id.startsWith("evt_test_")) {
        console.log("[Stripe Webhook] Test event detected, returning verification response");
        return res.json({ verified: true });
      }

      console.log(`[Stripe Webhook] Event received: ${event.type} (${event.id})`);

      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          console.log(
            `[Stripe Webhook] Donation completed — session: ${session.id}, amount: $${(session.amount_total ?? 0) / 100}, email: ${session.customer_email}`
          );
          break;
        }
        case "payment_intent.succeeded": {
          const pi = event.data.object as Stripe.PaymentIntent;
          console.log(`[Stripe Webhook] PaymentIntent succeeded: ${pi.id}`);
          break;
        }
        default:
          console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
      }

      return res.json({ received: true });
    }
  );
}

/**
 * Create a Stripe Checkout Session for a donation.
 */
export async function createDonationCheckoutSession({
  amountCents,
  donorName,
  donorEmail,
  message,
  origin,
}: {
  amountCents: number;
  donorName?: string;
  donorEmail?: string;
  message?: string;
  origin: string;
}): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: amountCents,
          product_data: {
            name: "Donation to Royal Results",
            description:
              "Your generous donation supports counseling, mentorship, and community programs in San Antonio.",
            images: [],
          },
        },
        quantity: 1,
      },
    ],
    customer_email: donorEmail || undefined,
    allow_promotion_codes: true,
    metadata: {
      donor_name: donorName || "Anonymous",
      donor_email: donorEmail || "",
      message: message || "",
      source: "royal-results-website",
    },
    success_url: `${origin}/?donation=success`,
    cancel_url: `${origin}/?donation=cancelled`,
  });

  return session.url!;
}
