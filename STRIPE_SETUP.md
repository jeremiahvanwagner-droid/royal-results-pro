# Stripe Donation — Production Activation Guide

The donation form is fully wired up. The **only remaining step** to go live is setting two environment variables on the production server.

---

## Step 1 — Get Your Stripe Keys

1. Log in to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Go to **Developers → API keys**
3. Copy your **Secret key** (`sk_live_...`)
4. Go to **Developers → Webhooks**
5. Click **Add endpoint**
   - Endpoint URL: `https://royalresults.pro/api/stripe/webhook`
   - Events to listen for: `checkout.session.completed`, `payment_intent.succeeded`
6. After saving, copy the **Signing secret** (`whsec_...`)

---

## Step 2 — Set the Variables on the Server

SSH into your Hostinger VPS and edit the `.env` file in the project root:

```bash
nano /path/to/royal-results-pro/.env
```

Add or update these two lines:

```env
STRIPE_SECRET_KEY=sk_live_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
```

Save and exit (`Ctrl+O`, `Ctrl+X`).

---

## Step 3 — Rebuild & Restart

```bash
cd /path/to/royal-results-pro
pnpm install
pnpm build
pm2 restart royalresults
```

That's it. The donation button will be live immediately after restart.

---

## Testing with Stripe Test Mode

To test without real money:

1. Use `sk_test_...` and `whsec_...` from the **Test mode** toggle in Stripe Dashboard
2. In the donation form, use card number `4242 4242 4242 4242`, any future expiry, any CVC
3. Watch `logs/out.log` for `[Stripe Webhook] Donation completed` confirmation

---

## Architecture Notes (for reference)

- **Client → Server:** `DonationSection.tsx` calls `trpc.donation.createCheckout.useMutation()` with `amountCents`, optional name/email/message, and `origin`
- **Server tRPC router:** `server/routers.ts` validates input with Zod and calls `createDonationCheckoutSession()`
- **Stripe session:** `server/stripe.ts` creates a hosted Checkout session and returns the URL
- **Redirect:** Client opens the Stripe-hosted payment page in a new tab
- **Webhook:** After payment, Stripe POSTs to `/api/stripe/webhook`; the server verifies signature and logs the event
- **Success/cancel:** Stripe redirects back to `https://royalresults.pro/?donation=success` or `?donation=cancelled`
- **Webhook registration order:** Stripe webhook is registered in `server/_core/index.ts` **before** `express.json()` — this is required for raw body signature verification and is already correct
