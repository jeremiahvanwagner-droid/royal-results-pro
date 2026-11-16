/*
 * ROYAL RESULTS — PRIVACY POLICY & TERMS
 * One page, anchored #privacy and #terms, in the Regal Noir palette
 */

import { Link } from "wouter";

const h2 = { fontFamily: "'Playfair Display', serif", color: "oklch(0.94 0.008 80)" };
const body = { color: "oklch(0.72 0.01 285)", fontFamily: "'Lato', sans-serif" };

export default function Legal() {
  return (
    <div className="min-h-screen py-20" style={{ background: "oklch(0.08 0.015 290)" }}>
      <div className="container mx-auto px-4 max-w-3xl space-y-6 text-sm leading-relaxed" style={body}>
        <Link href="/" className="inline-block mb-4" style={{ color: "oklch(0.72 0.14 82)" }}>
          ← Back to Royal Results
        </Link>

        <h1 id="privacy" className="text-4xl font-bold" style={h2}>
          Privacy Policy
        </h1>
        <p>Last updated: November 16, 2026</p>
        <p>
          Royal Results ("we", "us") serves clients in San Antonio and the surrounding areas. This policy explains what
          we collect when you use royalresults.pro and how we use it.
        </p>
        <h3 className="text-lg font-semibold" style={h2}>What we collect</h3>
        <p>
          When you send a message or book a consultation, we collect the details you give us: your name, email address,
          phone number, the service you are interested in and your message. If you make a donation, payment is handled by
          Stripe; we do not see or store your card number.
        </p>
        <h3 className="text-lg font-semibold" style={h2}>How we use it</h3>
        <p>
          We use your information only to respond to your inquiry, schedule and provide services, and send you updates
          you have asked for. We do not sell or rent your personal information.
        </p>
        <h3 className="text-lg font-semibold" style={h2}>Text messages</h3>
        <p>
          If you give us your mobile number and agree to receive texts, we may text you about your inquiry or
          appointment. Message frequency varies. Message and data rates may apply. Reply STOP to opt out at any time or
          HELP for help. Mobile numbers and text opt-in consent are never shared with third parties for marketing.
        </p>
        <h3 className="text-lg font-semibold" style={h2}>Service providers</h3>
        <p>
          We use trusted providers to run this site and our customer records (for example, our hosting provider, our CRM
          and Stripe). They process your information only on our behalf.
        </p>
        <h3 className="text-lg font-semibold" style={h2}>Your choices</h3>
        <p>
          You can ask us to update or delete your information at any time by emailing Rahiem@inspirebuildmotivate.com or
          calling (210) 859-6838.
        </p>

        <h1 id="terms" className="text-4xl font-bold pt-10" style={h2}>
          Terms of Service
        </h1>
        <p>
          By using royalresults.pro you agree to these terms. The information on this site is general and is not
          professional, medical, legal or financial advice. Any service is confirmed only once we have agreed the scope
          and price with you directly.
        </p>
        <p>
          Donations are voluntary and processed securely by Stripe. Content on this site belongs to Royal Results and may
          not be copied without permission. We may update these terms; the version posted here applies.
        </p>
        <p>Questions? Email Rahiem@inspirebuildmotivate.com or call (210) 859-6838.</p>
      </div>
    </div>
  );
}
