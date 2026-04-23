/*
 * ROYAL RESULTS — ABOUT SECTION
 * Regal Noir: asymmetric layout, gold rule accents, Playfair Display headings
 */

import { Star, Users } from "lucide-react";

function CrownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M2 19h20v2H2v-2zm2-3l3-8 5 4 5-4 3 8H4zm8-12a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
    </svg>
  );
}

const pillars = [
  {
    icon: CrownIcon,
    title: "Royal Standard",
    desc: "We hold every service to the highest standard — delivering results that exceed expectations.",
  },
  {
    icon: Users,
    title: "Community First",
    desc: "Our mission is rooted in uplifting individuals and communities through meaningful resources.",
  },
  {
    icon: Star,
    title: "Proven Excellence",
    desc: "Years of trusted service across counseling, automotive, events, and digital solutions.",
  },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative py-24 overflow-hidden"
      style={{ background: "oklch(0.10 0.016 290)" }}
    >
      {/* Background purple glow */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: "oklch(0.42 0.24 292)" }}
      />

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Section Label */}
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px w-16" style={{ background: "oklch(0.72 0.14 82)" }} />
          <span
            className="section-heading text-xs tracking-[0.3em]"
            style={{ fontSize: "0.7rem" }}
          >
            Who We Are
          </span>
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <h2
              className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "oklch(0.94 0.008 80)",
              }}
            >
              Built to Serve.{" "}
              <span className="gradient-gold-text italic">Designed to Elevate.</span>
            </h2>
            <div className="gold-rule mb-8" />
            <p
              className="text-base leading-relaxed mb-5"
              style={{ color: "oklch(0.72 0.01 285)", fontFamily: "'Lato', sans-serif" }}
            >
              Royal Results was founded on a singular belief: that every person deserves access to
              premium resources that empower growth, healing, and success. We are a comprehensive
              resource provider offering a diverse portfolio of services tailored to meet you
              wherever you are in your journey.
            </p>
            <p
              className="text-base leading-relaxed mb-8"
              style={{ color: "oklch(0.72 0.01 285)", fontFamily: "'Lato', sans-serif" }}
            >
              Whether you need personal counseling, professional mentorship, a stunning event
              experience, automotive excellence, or a powerful digital presence — Royal Results
              delivers with integrity, precision, and an unwavering commitment to your success.
            </p>
            <button
              onClick={() => {
                const el = document.querySelector("#services");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn-gold px-8 py-3 rounded-sm text-xs"
            >
              Our Services
            </button>
          </div>

          {/* Right: Pillars */}
          <div className="flex flex-col gap-6">
            {pillars.map((p, i) => (
              <div
                key={i}
                className="flex gap-5 p-6 rounded-sm service-card group"
              >
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-sm flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: "oklch(0.42 0.24 292/0.15)",
                    border: "1px solid oklch(0.42 0.24 292/0.3)",
                  }}
                >
                  <p.icon
                    className="w-5 h-5"
                    style={{ color: "oklch(0.72 0.14 82)" }}
                  />
                </div>
                <div>
                  <h3
                    className="text-sm font-bold mb-1 tracking-wider uppercase"
                    style={{
                      fontFamily: "'Cinzel', serif",
                      color: "oklch(0.82 0.10 80)",
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "oklch(0.65 0.01 285)" }}
                  >
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
