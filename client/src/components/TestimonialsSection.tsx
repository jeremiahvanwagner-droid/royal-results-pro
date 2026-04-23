/*
 * ROYAL RESULTS — TESTIMONIALS SECTION
 * Regal Noir: auto-advancing carousel, gold star ratings, Playfair Display quotes
 * Dark card layout with purple ambient glow and gold accent borders
 */

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Marcus T.",
    role: "Counseling Client",
    location: "San Antonio, TX",
    stars: 5,
    quote:
      "Royal Results changed my life. The counseling sessions gave me the tools and clarity I needed to overcome years of personal struggles. I walked in broken and walked out with a plan. Truly a royal experience.",
    service: "Counseling",
  },
  {
    name: "Destiny R.",
    role: "Mentorship Client",
    location: "San Antonio, TX",
    stars: 5,
    quote:
      "My mentor through Royal Results helped me land my first corporate position within three months. The guidance, accountability, and genuine care they showed me was unlike anything I'd experienced before.",
    service: "Mentorship",
  },
  {
    name: "James & Keisha W.",
    role: "Event Clients",
    location: "Converse, TX",
    stars: 5,
    quote:
      "Our anniversary gala was absolutely breathtaking. Every detail was handled with precision and elegance. Our guests are still talking about it months later. Royal Results delivered beyond our wildest expectations.",
    service: "Event Set-Up",
  },
  {
    name: "DeShawn P.",
    role: "Car Detailing Client",
    location: "Schertz, TX",
    stars: 5,
    quote:
      "I brought in my truck looking rough and it came back looking showroom-ready. The attention to detail was incredible — every inch was spotless. I won't trust anyone else with my vehicles.",
    service: "Car Detailing",
  },
  {
    name: "Priya M.",
    role: "Web Development Client",
    location: "San Antonio, TX",
    stars: 5,
    quote:
      "Royal Results built my business website from scratch and it looks absolutely stunning. My online bookings increased by 40% in the first month. Professional, responsive, and truly talented team.",
    service: "Website Development",
  },
  {
    name: "Carlos V.",
    role: "Car Body Repair Client",
    location: "Live Oak, TX",
    stars: 5,
    quote:
      "After my accident I was devastated about my car. Royal Results restored it perfectly — you can't even tell it was ever damaged. Fair pricing, fast turnaround, and flawless results. Highly recommend.",
    service: "Car Body Repair",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ color: "oklch(0.72 0.14 82)" }}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const goTo = useCallback(
    (index: number, dir: "next" | "prev" = "next") => {
      if (animating) return;
      setAnimating(true);
      setDirection(dir);
      setTimeout(() => {
        setCurrent(index);
        setAnimating(false);
      }, 400);
    },
    [animating]
  );

  const next = useCallback(() => {
    goTo((current + 1) % testimonials.length, "next");
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + testimonials.length) % testimonials.length, "prev");
  }, [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5500);
    return () => clearInterval(timer);
  }, [next]);

  // Show 3 cards on desktop, 1 on mobile
  const getVisibleIndices = () => {
    const indices = [];
    for (let i = 0; i < 3; i++) {
      indices.push((current + i) % testimonials.length);
    }
    return indices;
  };

  const t = testimonials[current];

  return (
    <section
      id="testimonials"
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
            <span
              className="section-heading text-xs tracking-[0.3em]"
              style={{ fontSize: "0.7rem" }}
            >
              Client Stories
            </span>
            <div className="h-px w-16" style={{ background: "oklch(0.72 0.14 82)" }} />
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "oklch(0.94 0.008 80)",
            }}
          >
            What Our{" "}
            <span className="gradient-gold-text italic">Clients Say</span>
          </h2>
          <p
            className="text-base max-w-lg mx-auto"
            style={{ color: "oklch(0.65 0.01 285)", fontFamily: "'Lato', sans-serif" }}
          >
            Real results from real people across San Antonio and surrounding areas.
          </p>
        </div>

        {/* Desktop: 3-card grid */}
        <div className="hidden lg:grid grid-cols-3 gap-6 mb-10">
          {getVisibleIndices().map((idx, pos) => (
            <TestimonialCard
              key={idx}
              testimonial={testimonials[idx]}
              featured={pos === 0}
              animating={animating && pos === 0}
              direction={direction}
            />
          ))}
        </div>

        {/* Mobile: single card */}
        <div className="lg:hidden mb-10">
          <TestimonialCard
            testimonial={t}
            featured={true}
            animating={animating}
            direction={direction}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={prev}
            className="p-3 rounded-full border transition-all duration-300 hover:scale-110"
            style={{
              borderColor: "oklch(0.72 0.14 82/0.4)",
              background: "oklch(0.12 0.018 290)",
              color: "oklch(0.72 0.14 82)",
            }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? "next" : "prev")}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? "1.5rem" : "0.5rem",
                  height: "0.5rem",
                  background:
                    i === current
                      ? "oklch(0.72 0.14 82)"
                      : "oklch(0.72 0.14 82/0.3)",
                }}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="p-3 rounded-full border transition-all duration-300 hover:scale-110"
            style={{
              borderColor: "oklch(0.72 0.14 82/0.4)",
              background: "oklch(0.12 0.018 290)",
              color: "oklch(0.72 0.14 82)",
            }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
  featured,
  animating,
  direction,
}: {
  testimonial: (typeof testimonials)[0];
  featured: boolean;
  animating: boolean;
  direction: "next" | "prev";
}) {
  return (
    <div
      className="relative p-7 rounded-sm flex flex-col gap-5 h-full"
      style={{
        background: featured
          ? "oklch(0.14 0.022 290)"
          : "oklch(0.12 0.018 290)",
        border: featured
          ? "1px solid oklch(0.72 0.14 82/0.35)"
          : "1px solid oklch(0.22 0.025 290)",
        boxShadow: featured
          ? "0 0 40px oklch(0.42 0.24 292/0.12), inset 0 1px 0 oklch(0.72 0.14 82/0.15)"
          : "none",
        opacity: animating ? 0 : 1,
        transform: animating
          ? direction === "next"
            ? "translateX(20px)"
            : "translateX(-20px)"
          : "translateX(0)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
      }}
    >
      {/* Quote icon */}
      <Quote
        className="w-8 h-8 opacity-30 flex-shrink-0"
        style={{ color: "oklch(0.72 0.14 82)" }}
      />

      {/* Stars */}
      <StarRating count={testimonial.stars} />

      {/* Quote text */}
      <p
        className="text-sm leading-relaxed flex-1 italic"
        style={{
          fontFamily: "'Playfair Display', serif",
          color: "oklch(0.82 0.008 80)",
        }}
      >
        "{testimonial.quote}"
      </p>

      {/* Divider */}
      <div
        className="h-px w-12"
        style={{ background: "oklch(0.72 0.14 82/0.4)" }}
      />

      {/* Author */}
      <div className="flex items-center justify-between">
        <div>
          <p
            className="text-sm font-bold"
            style={{
              fontFamily: "'Cinzel', serif",
              color: "oklch(0.88 0.008 80)",
            }}
          >
            {testimonial.name}
          </p>
          <p
            className="text-xs mt-0.5"
            style={{
              color: "oklch(0.55 0.01 285)",
              fontFamily: "'Lato', sans-serif",
            }}
          >
            {testimonial.role} · {testimonial.location}
          </p>
        </div>
        <span
          className="text-xs px-2.5 py-1 rounded-sm"
          style={{
            fontFamily: "'Cinzel', serif",
            background: "oklch(0.42 0.24 292/0.2)",
            color: "oklch(0.72 0.14 82)",
            border: "1px solid oklch(0.42 0.24 292/0.3)",
            fontSize: "0.6rem",
            letterSpacing: "0.08em",
          }}
        >
          {testimonial.service}
        </span>
      </div>
    </div>
  );
}
