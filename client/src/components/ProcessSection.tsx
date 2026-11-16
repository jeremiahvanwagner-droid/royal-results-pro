/*
 * ROYAL RESULTS — HOW IT WORKS SECTION
 * Regal Noir: three gold-numbered steps on dark cards, closing with the free-consultation booking CTA
 */

import { CalendarCheck, MessageSquare, Crown } from "lucide-react";
import { BOOKING_URL } from "@/const";

const steps = [
  {
    icon: MessageSquare,
    title: "Tell Us What You Need",
    text: "Send a message or call. Whether it's a fresh start, a big event, a car that needs care or a website for your business, we listen first.",
  },
  {
    icon: CalendarCheck,
    title: "Book a Free Consultation",
    text: "Pick a time that works for you. In 30 minutes we'll talk through your goals, answer your questions and map out the next step.",
  },
  {
    icon: Crown,
    title: "Get Royal Results",
    text: "We get to work with care, clear communication and a standard of excellence you can see, from the first conversation to the finished result.",
  },
];

export default function ProcessSection() {
  return (
    <section
      id="how-it-works"
      className="relative py-24 overflow-hidden"
      style={{ background: "oklch(0.09 0.016 290)" }}
    >
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "oklch(0.42 0.24 292/0.06)" }}
      />
      <div className="gold-rule absolute top-0 left-0 right-0" />

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16" style={{ background: "oklch(0.72 0.14 82)" }} />
            <span className="section-heading text-xs tracking-[0.3em]" style={{ fontSize: "0.7rem" }}>
              How It Works
            </span>
            <div className="h-px w-16" style={{ background: "oklch(0.72 0.14 82)" }} />
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.94 0.008 80)" }}
          >
            Three Steps to <span className="gradient-gold-text italic">Royal Results</span>
          </h2>
          <p
            className="text-base max-w-lg mx-auto"
            style={{ color: "oklch(0.65 0.01 285)", fontFamily: "'Lato', sans-serif" }}
          >
            Simple, personal and built around you, wherever you are in San Antonio and the surrounding areas.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-14">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-2xl p-8 border"
              style={{ background: "oklch(0.12 0.02 290)", borderColor: "oklch(0.72 0.14 82/0.25)" }}
            >
              <div className="flex items-center gap-4 mb-5">
                <span
                  className="text-3xl font-bold"
                  style={{ fontFamily: "'Cinzel', serif", color: "oklch(0.72 0.14 82)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <step.icon className="w-6 h-6" style={{ color: "oklch(0.72 0.14 82)" }} />
              </div>
              <h3
                className="text-xl font-semibold mb-3"
                style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.94 0.008 80)" }}
              >
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "oklch(0.7 0.01 285)", fontFamily: "'Lato', sans-serif" }}>
                {step.text}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, oklch(0.78 0.14 88), oklch(0.66 0.14 78))",
              color: "oklch(0.12 0.02 290)",
              fontFamily: "'Cinzel', serif",
              letterSpacing: "0.08em",
            }}
          >
            <CalendarCheck className="w-5 h-5" />
            Book Your Free Consultation
          </a>
        </div>
      </div>
    </section>
  );
}
