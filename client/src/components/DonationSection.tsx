/*
 * ROYAL RESULTS — DONATION SECTION
 * Regal Noir: gold donation buttons with active fill, large typography, purple ambient
 * Preset amounts: $10, $25, $50, $100 + custom input
 * Stripe Checkout integration for real payment processing
 */

import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const CROWN_IMG = "/manus-storage/royal-crown_c39f0de4.jpg";

const presets = [10, 25, 50, 100];

export default function DonationSection() {
  const [selected, setSelected] = useState<number | null>(25);
  const [custom, setCustom] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const effectiveAmount = custom ? parseFloat(custom) : selected;

  const createCheckout = trpc.donation.createCheckout.useMutation({
    onSuccess: (data) => {
      toast.success("Redirecting you to secure checkout...", { duration: 3000 });
      window.open(data.url, "_blank");
      // Reset form
      setSelected(25);
      setCustom("");
      setName("");
      setEmail("");
      setMessage("");
    },
    onError: (err) => {
      toast.error(`Payment error: ${err.message}`);
    },
  });

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveAmount || effectiveAmount <= 0) {
      toast.error("Please select or enter a donation amount.");
      return;
    }
    if (effectiveAmount < 0.5) {
      toast.error("Minimum donation amount is $0.50.");
      return;
    }

    createCheckout.mutate({
      amountCents: Math.round(effectiveAmount * 100),
      donorName: name || undefined,
      donorEmail: email || undefined,
      message: message || undefined,
      origin: window.location.origin,
    });
  };

  return (
    <section
      id="donate"
      className="relative py-24 overflow-hidden"
      style={{ background: "oklch(0.10 0.016 290)" }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 50%, oklch(0.42 0.24 292/0.08), transparent)",
        }}
      />
      {/* Gold decorative lines */}
      <div className="gold-rule absolute top-0 left-0 right-0" />
      <div className="gold-rule absolute bottom-0 left-0 right-0" />

      <div className="container mx-auto px-4 lg:px-8 max-w-5xl relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16" style={{ background: "oklch(0.72 0.14 82)" }} />
            <img
              src={CROWN_IMG}
              alt="Crown"
              style={{
                width: "2rem",
                height: "1.6rem",
                objectFit: "contain",
                filter: "drop-shadow(0 0 4px oklch(0.72 0.14 82/0.6))",
              }}
            />
            <div className="h-px w-16" style={{ background: "oklch(0.72 0.14 82)" }} />
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "oklch(0.94 0.008 80)",
            }}
          >
            Support Our{" "}
            <span className="gradient-gold-text italic">Mission</span>
          </h2>
          <p
            className="text-base max-w-lg mx-auto"
            style={{ color: "oklch(0.65 0.01 285)", fontFamily: "'Lato', sans-serif" }}
          >
            Your generous donation helps us continue providing vital resources, counseling,
            and mentorship to those who need it most. Every contribution makes a royal difference.
          </p>
        </div>

        {/* Donation Card */}
        <div
          className="rounded-sm p-8 md:p-12"
          style={{
            background: "oklch(0.12 0.018 290)",
            border: "1px solid oklch(0.72 0.14 82/0.2)",
            boxShadow: "0 0 60px oklch(0.42 0.24 292/0.1)",
          }}
        >
          <form onSubmit={handleDonate}>
            {/* Amount Selection */}
            <div className="mb-8">
              <label
                className="block text-xs tracking-[0.2em] uppercase mb-4"
                style={{
                  fontFamily: "'Cinzel', serif",
                  color: "oklch(0.72 0.14 82)",
                }}
              >
                Select Amount
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {presets.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => {
                      setSelected(amount);
                      setCustom("");
                    }}
                    className={`donation-btn py-4 rounded-sm text-lg font-bold transition-all duration-250 ${
                      selected === amount && !custom ? "active" : ""
                    }`}
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      background:
                        selected === amount && !custom
                          ? "oklch(0.72 0.14 82)"
                          : "transparent",
                      color:
                        selected === amount && !custom
                          ? "oklch(0.08 0.015 290)"
                          : "oklch(0.82 0.12 85)",
                      borderColor: "oklch(0.72 0.14 82/0.5)",
                      boxShadow:
                        selected === amount && !custom
                          ? "0 0 20px oklch(0.72 0.14 82/0.4)"
                          : "none",
                    }}
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: "oklch(0.72 0.14 82)",
                  }}
                >
                  $
                </span>
                <input
                  type="number"
                  min="1"
                  placeholder="Other amount"
                  value={custom}
                  onChange={(e) => {
                    setCustom(e.target.value);
                    setSelected(null);
                  }}
                  className="w-full pl-8 pr-4 py-4 rounded-sm text-base outline-none transition-all duration-300 focus:ring-1"
                  style={{
                    background: "oklch(0.08 0.015 290)",
                    border: `1px solid ${custom ? "oklch(0.72 0.14 82)" : "oklch(0.22 0.025 290)"}`,
                    color: "oklch(0.90 0.008 80)",
                    fontFamily: "'Lato', sans-serif",
                  }}
                />
              </div>
            </div>

            {/* Donor Info */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  className="block text-xs tracking-[0.15em] uppercase mb-2"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    color: "oklch(0.65 0.01 285)",
                    fontSize: "0.65rem",
                  }}
                >
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-sm text-sm outline-none transition-all duration-300"
                  style={{
                    background: "oklch(0.08 0.015 290)",
                    border: "1px solid oklch(0.22 0.025 290)",
                    color: "oklch(0.90 0.008 80)",
                    fontFamily: "'Lato', sans-serif",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.14 82/0.6)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "oklch(0.22 0.025 290)")}
                />
              </div>
              <div>
                <label
                  className="block text-xs tracking-[0.15em] uppercase mb-2"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    color: "oklch(0.65 0.01 285)",
                    fontSize: "0.65rem",
                  }}
                >
                  Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-sm text-sm outline-none transition-all duration-300"
                  style={{
                    background: "oklch(0.08 0.015 290)",
                    border: "1px solid oklch(0.22 0.025 290)",
                    color: "oklch(0.90 0.008 80)",
                    fontFamily: "'Lato', sans-serif",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.14 82/0.6)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "oklch(0.22 0.025 290)")}
                />
              </div>
            </div>

            {/* Message */}
            <div className="mb-8">
              <label
                className="block text-xs tracking-[0.15em] uppercase mb-2"
                style={{
                  fontFamily: "'Cinzel', serif",
                  color: "oklch(0.65 0.01 285)",
                  fontSize: "0.65rem",
                }}
              >
                Message (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Leave a message of support..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-sm text-sm outline-none transition-all duration-300 resize-none"
                style={{
                  background: "oklch(0.08 0.015 290)",
                  border: "1px solid oklch(0.22 0.025 290)",
                  color: "oklch(0.90 0.008 80)",
                  fontFamily: "'Lato', sans-serif",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.14 82/0.6)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "oklch(0.22 0.025 290)")}
              />
            </div>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                type="submit"
                disabled={createCheckout.isPending}
                className="btn-gold w-full sm:w-auto px-12 py-4 rounded-sm text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {createCheckout.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4" />
                    Donate{effectiveAmount && effectiveAmount > 0 ? ` $${effectiveAmount}` : ""} Now
                  </>
                )}
              </button>
              <p
                className="text-xs text-center sm:text-left"
                style={{ color: "oklch(0.55 0.01 285)", fontFamily: "'Lato', sans-serif" }}
              >
                Secure payment powered by Stripe. Your generosity directly funds our community programs.
              </p>
            </div>
          </form>
        </div>

        {/* Impact stats */}
        <div className="grid grid-cols-3 gap-6 mt-12 text-center">
          {[
            { value: "500+", label: "Lives Impacted" },
            { value: "6", label: "Core Services" },
            { value: "100%", label: "Community Focused" },
          ].map((stat, i) => (
            <div key={i}>
              <div
                className="text-3xl md:text-4xl font-bold mb-1 gradient-gold-text"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {stat.value}
              </div>
              <div
                className="text-xs tracking-widest uppercase"
                style={{
                  fontFamily: "'Cinzel', serif",
                  color: "oklch(0.55 0.01 285)",
                  fontSize: "0.65rem",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
