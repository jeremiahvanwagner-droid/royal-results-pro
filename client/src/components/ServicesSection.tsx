/*
 * ROYAL RESULTS — SERVICES SECTION
 * Regal Noir: staggered card grid, gold icon borders, hover lift with purple glow
 * 6 Services: Counseling, Mentorship, Event Set-up, Car Detailing, Car Body Repair, Web Dev
 */

import { Heart, Users, CalendarDays, Sparkles, Wrench, Globe } from "lucide-react";

const services = [
  {
    icon: Heart,
    title: "Counseling",
    tag: "Personal Growth",
    description:
      "Compassionate, confidential counseling services to help you navigate life's challenges. Our licensed counselors provide a safe space for healing, clarity, and transformation.",
    features: ["Individual Sessions", "Group Therapy", "Crisis Support", "Life Coaching"],
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663540109243/QoiehgGQf9qBcahXdrELUK/counseling-mentorship-jRcggKx4hTE45GQuFr3gpj.webp",
  },
  {
    icon: Users,
    title: "Mentorship",
    tag: "Career & Leadership",
    description:
      "Connect with experienced mentors who guide you through professional development, leadership growth, and strategic goal-setting to unlock your full potential.",
    features: ["1-on-1 Mentoring", "Career Planning", "Leadership Training", "Goal Setting"],
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663540109243/QoiehgGQf9qBcahXdrELUK/service-mentorship-DdMx2CSszdD6P4B4GeGoAH.webp",
  },
  {
    icon: CalendarDays,
    title: "Event Set-Up",
    tag: "Unforgettable Experiences",
    description:
      "From intimate gatherings to grand corporate events, our expert team handles every detail — décor, logistics, and execution — to create extraordinary experiences.",
    features: ["Corporate Events", "Private Galas", "Community Events", "Full Logistics"],
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663540109243/QoiehgGQf9qBcahXdrELUK/hero-slide3-bKseXaJbuPctKv7Ba27aRj.webp",
  },
  {
    icon: Sparkles,
    title: "Car Detailing",
    tag: "Automotive Excellence",
    description:
      "Premium car detailing services that restore your vehicle to showroom perfection. We use professional-grade products and meticulous techniques for a flawless finish.",
    features: ["Interior Detailing", "Exterior Polish", "Paint Protection", "Ceramic Coating"],
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663540109243/QoiehgGQf9qBcahXdrELUK/car-detailing-UWbfUMBUSWQ9qBy9AvgDXM.webp",
  },
  {
    icon: Wrench,
    title: "Car Body Repair",
    tag: "Precision Restoration",
    description:
      "Expert automotive body repair services using state-of-the-art equipment. From minor dents to major collision damage, we restore your vehicle to its original glory.",
    features: ["Dent Removal", "Collision Repair", "Paint Matching", "Frame Straightening"],
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663540109243/QoiehgGQf9qBcahXdrELUK/service-car-body-repair-eSazfHAirDxsYn7FNzLMQx.webp",
  },
  {
    icon: Globe,
    title: "Website Development",
    tag: "Digital Presence",
    description:
      "Custom, high-performance websites and digital solutions that elevate your brand online. From sleek landing pages to full e-commerce platforms, we build for results.",
    features: ["Custom Design", "E-Commerce", "SEO Optimization", "Mobile-First"],
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663540109243/QoiehgGQf9qBcahXdrELUK/service-web-dev-BWP4a47W3Y5cZVUKGCt8Zg.webp",
  },
];

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="relative py-24 overflow-hidden"
      style={{ background: "oklch(0.08 0.015 290)" }}
    >
      {/* Background decorative elements */}
      <div
        className="absolute top-1/2 left-0 w-80 h-80 rounded-full blur-3xl opacity-5 pointer-events-none"
        style={{ background: "oklch(0.72 0.14 82)", transform: "translateY(-50%)" }}
      />

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16" style={{ background: "oklch(0.72 0.14 82)" }} />
            <span
              className="section-heading text-xs tracking-[0.3em]"
              style={{ fontSize: "0.7rem" }}
            >
              What We Offer
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
            Our <span className="gradient-gold-text italic">Services</span>
          </h2>
          <p
            className="text-base max-w-xl mx-auto"
            style={{ color: "oklch(0.65 0.01 285)", fontFamily: "'Lato', sans-serif" }}
          >
            A comprehensive suite of resources designed to elevate every dimension of your life and business.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <ServiceCard key={i} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) {
  return (
    <div
      className="service-card rounded-sm overflow-hidden group flex flex-col"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Image or gradient header */}
      <div
        className="relative h-40 overflow-hidden flex-shrink-0"
        style={{
          background: service.image
            ? undefined
            : `linear-gradient(135deg, oklch(0.28 0.18 290), oklch(0.16 0.08 290))`,
        }}
      >
        {service.image && (
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        )}
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: service.image
              ? "linear-gradient(to bottom, oklch(0.08 0.015 290/0.3), oklch(0.08 0.015 290/0.7))"
              : undefined,
          }}
        />
        {/* Icon */}
        <div
          className="absolute top-4 left-4 w-10 h-10 rounded-sm flex items-center justify-center"
          style={{
            background: "oklch(0.08 0.015 290/0.8)",
            border: "1px solid oklch(0.72 0.14 82/0.5)",
          }}
        >
          <service.icon
            className="w-5 h-5"
            style={{ color: "oklch(0.72 0.14 82)" }}
          />
        </div>
        {/* Tag */}
        <div
          className="absolute top-4 right-4 px-2 py-1 rounded-sm text-xs tracking-wider"
          style={{
            fontFamily: "'Cinzel', serif",
            background: "oklch(0.42 0.24 292/0.7)",
            color: "oklch(0.90 0.008 80)",
            fontSize: "0.6rem",
          }}
        >
          {service.tag}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3
          className="text-lg font-bold mb-3"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "oklch(0.90 0.008 80)",
          }}
        >
          {service.title}
        </h3>
        <p
          className="text-sm leading-relaxed mb-5 flex-1"
          style={{ color: "oklch(0.65 0.01 285)", fontFamily: "'Lato', sans-serif" }}
        >
          {service.description}
        </p>

        {/* Features */}
        <div className="grid grid-cols-2 gap-1.5 mb-5">
          {service.features.map((f, j) => (
            <div key={j} className="flex items-center gap-1.5">
              <div
                className="w-1 h-1 rounded-full flex-shrink-0"
                style={{ background: "oklch(0.72 0.14 82)" }}
              />
              <span
                className="text-xs"
                style={{ color: "oklch(0.72 0.01 285)", fontFamily: "'Lato', sans-serif" }}
              >
                {f}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => {
            const el = document.querySelector("#contact");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          className="w-full py-2.5 rounded-sm text-xs transition-all duration-300 border"
          style={{
            fontFamily: "'Cinzel', serif",
            color: "oklch(0.72 0.14 82)",
            borderColor: "oklch(0.72 0.14 82/0.3)",
            background: "transparent",
            letterSpacing: "0.08em",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.72 0.14 82)";
            (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.08 0.015 290)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.72 0.14 82)";
          }}
        >
          Inquire Now
        </button>
      </div>
    </div>
  );
}
