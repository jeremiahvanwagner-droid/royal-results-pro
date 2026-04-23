/**
 * ROYAL RESULTS — STRIPE INTEGRATION
 * Handles donation checkout sessions and webhook events
 */

import Stripe from "stripe";
import type { Express, Request, Response } from "express";
import express from "express";

let _stripe: Stripe | null = null;
let _warnedMissingKey = false;

function getStripe(): Stripe | null {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    if (!_warnedMissingKey) {
      console.warn(
        "[Stripe] STRIPE_SECRET_KEY is not set — Stripe features are disabled."
      );
      _warnedMissingKey = true;
    }
    return null;
  }
  _stripe = new Stripe(key, { apiVersion: "2026-03-25.dahlia" });
  return _stripe;
}

/**
 * Register the Stripe webhook route.
 * MUST be registered BEFORE express.json() to allow raw body parsing.
 */
export function registerStripeWebhook(app: Express) {
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req: Request, res: Response) => {
      const stripe = getStripe();
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!stripe || !webhookSecret) {
        return res.status(503).send("Stripe is not configured on this server.");
      }

      const sig = req.headers["stripe-signature"] as string;

      let event: Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
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
  const stripe = getStripe();
  if (!stripe) {
    throw new Error(
      "Stripe is not configured — set STRIPE_SECRET_KEY to enable donations."
    );
  }
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
