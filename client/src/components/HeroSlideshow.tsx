/*
 * ROYAL RESULTS — HERO SLIDESHOW
 * Regal Noir: Ken Burns zoom, gold flash transitions, Playfair Display headings
 * Dark overlay with purple ambient glow on text
 */

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663540109243/QoiehgGQf9qBcahXdrELUK/hero-slide1-haRtGf3Z6zPv4y9jmDYaBa.webp",
    tag: "Empowering Excellence",
    headline: "Elevate Your\nPotential",
    subtext:
      "Royal Results provides world-class resources to help individuals and businesses reach their highest level of achievement.",
    cta: "Explore Services",
    ctaHref: "#services",
  },
  {
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663540109243/QoiehgGQf9qBcahXdrELUK/hero-slide2-JMz8CYy6ZG5PGybFTp6NCy.webp",
    tag: "Guidance & Growth",
    headline: "Counseling &\nMentorship",
    subtext:
      "Our dedicated counselors and mentors walk alongside you, providing the clarity and direction to transform your life and career.",
    cta: "Learn More",
    ctaHref: "#services",
  },
  {
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663540109243/QoiehgGQf9qBcahXdrELUK/hero-slide3-bKseXaJbuPctKv7Ba27aRj.webp",
    tag: "Unforgettable Events",
    headline: "Royal Event\nExperiences",
    subtext:
      "From intimate gatherings to grand galas, our event set-up team crafts immersive, flawlessly executed experiences that leave lasting impressions.",
    cta: "Plan Your Event",
    ctaHref: "#contact",
  },
];

export default function HeroSlideshow() {
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
      }, 600);
    },
    [animating]
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length, "next");
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length, "prev");
  }, [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden"
      style={{ height: "100svh", minHeight: "600px" }}
    >
      {/* Background image with Ken Burns */}
      <div className="absolute inset-0">
        <img
          key={current}
          src={slide.image}
          alt={slide.headline}
          className="w-full h-full object-cover ken-burns"
          style={{
            opacity: animating ? 0 : 1,
            transition: "opacity 0.6s ease",
          }}
        />
        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.06 0.015 290/0.88) 0%, oklch(0.10 0.02 290/0.70) 50%, oklch(0.08 0.015 290/0.82) 100%)",
          }}
        />
        {/* Purple ambient glow at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-64"
          style={{
            background:
              "linear-gradient(to top, oklch(0.28 0.18 290/0.5), transparent)",
          }}
        />
      </div>

      {/* Gold top border */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.72 0.14 82), transparent)",
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 h-full flex flex-col justify-center container mx-auto px-4 lg:px-8 max-w-7xl"
        style={{ paddingTop: "6rem" }}
      >
        <div
          className="max-w-3xl"
          style={{
            opacity: animating ? 0 : 1,
            transform: animating
              ? direction === "next"
                ? "translateY(20px)"
                : "translateY(-20px)"
              : "translateY(0)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          {/* Tag */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="h-px w-12"
              style={{ background: "oklch(0.72 0.14 82)" }}
            />
            <span
              className="text-xs tracking-[0.3em] uppercase"
              style={{
                fontFamily: "'Cinzel', serif",
                color: "oklch(0.72 0.14 82)",
              }}
            >
              {slide.tag}
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-5xl md:text-7xl font-bold leading-tight mb-6 whitespace-pre-line"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "oklch(0.97 0.005 80)",
              textShadow: "0 0 60px oklch(0.42 0.24 292/0.4)",
            }}
          >
            {slide.headline.split("\n").map((line, i) =>
              i === 1 ? (
                <span key={i} className="gradient-gold-text block">
                  {line}
                </span>
              ) : (
                <span key={i} className="block">
                  {line}
                </span>
              )
            )}
          </h1>

          {/* Subtext */}
          <p
            className="text-base md:text-lg leading-relaxed mb-10 max-w-xl"
            style={{ color: "oklch(0.80 0.008 80)", fontFamily: "'Lato', sans-serif" }}
          >
            {slide.subtext}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => {
                const el = document.querySelector(slide.ctaHref);
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn-gold px-8 py-4 rounded-sm text-sm"
            >
              {slide.cta}
            </button>
            <button
              onClick={() => {
                const el = document.querySelector("#donate");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn-purple px-8 py-4 rounded-sm text-sm"
            >
              Support Us
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full border transition-all duration-300 hover:scale-110"
        style={{
          borderColor: "oklch(0.72 0.14 82/0.4)",
          background: "oklch(0.08 0.015 290/0.6)",
          color: "oklch(0.72 0.14 82)",
        }}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full border transition-all duration-300 hover:scale-110"
        style={{
          borderColor: "oklch(0.72 0.14 82/0.4)",
          background: "oklch(0.08 0.015 290/0.6)",
          color: "oklch(0.72 0.14 82)",
        }}
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? "next" : "prev")}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === current ? "2rem" : "0.5rem",
              height: "0.5rem",
              background:
                i === current
                  ? "oklch(0.72 0.14 82)"
                  : "oklch(0.72 0.14 82/0.35)",
            }}
          />
        ))}
      </div>

      {/* Bottom gold rule */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.72 0.14 82/0.5), transparent)",
        }}
      />
    </section>
  );
}
