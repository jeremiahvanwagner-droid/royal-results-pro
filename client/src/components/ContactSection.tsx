/*
 * ROYAL RESULTS — CONTACT SECTION
 * Regal Noir: split layout, gold icon accents, Cinzel labels
 */

import { useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

const contactInfo = [
  {
    icon: Phone,
    label: "Call Us",
    value: "210-859-6838",
    sub: "Mon – Fri, 9am – 6pm",
  },
  {
    icon: Mail,
    label: "Email Us",
    value: "Rahiem@inspirebuildmotivate.com",
    sub: "We respond within 24 hours",
  },
  {
    icon: MapPin,
    label: "Find Us",
    value: "San Antonio & Surrounding Areas",
    sub: "Serving the greater San Antonio region",
  },
];

export default function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    toast.success("Message sent! We'll be in touch shortly. 👑", { duration: 4000 });
    setForm({ name: "", email: "", service: "", message: "" });
  };

  const inputStyle = {
    background: "oklch(0.08 0.015 290)",
    border: "1px solid oklch(0.22 0.025 290)",
    color: "oklch(0.90 0.008 80)",
    fontFamily: "'Lato', sans-serif",
  };

  const labelStyle = {
    fontFamily: "'Cinzel', serif",
    color: "oklch(0.65 0.01 285)",
    fontSize: "0.65rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
  };

  return (
    <section
      id="contact"
      className="relative py-24 overflow-hidden"
      style={{ background: "oklch(0.08 0.015 290)" }}
    >
      {/* Background glow */}
      <div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-8 pointer-events-none"
        style={{ background: "oklch(0.42 0.24 292/0.08)" }}
      />

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16" style={{ background: "oklch(0.72 0.14 82)" }} />
            <span
              className="section-heading text-xs tracking-[0.3em]"
              style={{ fontSize: "0.7rem" }}
            >
              Get In Touch
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
            Let's <span className="gradient-gold-text italic">Connect</span>
          </h2>
          <p
            className="text-base max-w-lg mx-auto"
            style={{ color: "oklch(0.65 0.01 285)", fontFamily: "'Lato', sans-serif" }}
          >
            Ready to elevate your results? Reach out and a member of our royal team will be in touch promptly.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left: Contact Info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {contactInfo.map((item, i) => (
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
                  <item.icon
                    className="w-5 h-5"
                    style={{ color: "oklch(0.72 0.14 82)" }}
                  />
                </div>
                <div>
                  <p
                    className="text-xs tracking-widest uppercase mb-1"
                    style={{
                      fontFamily: "'Cinzel', serif",
                      color: "oklch(0.55 0.01 285)",
                      fontSize: "0.6rem",
                    }}
                  >
                    {item.label}
                  </p>
                  {item.label === "Email Us" ? (
                    <a
                      href={`mailto:${item.value}`}
                      className="text-sm font-semibold mb-0.5 block transition-colors duration-200 hover:underline"
                      style={{ color: "oklch(0.72 0.14 82)", fontFamily: "'Lato', sans-serif" }}
                    >
                      {item.value}
                    </a>
                  ) : item.label === "Call Us" ? (
                    <a
                      href={`tel:${item.value.replace(/[^0-9+]/g, "")}`}
                      className="text-sm font-semibold mb-0.5 block transition-colors duration-200 hover:underline"
                      style={{ color: "oklch(0.72 0.14 82)", fontFamily: "'Lato', sans-serif" }}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p
                      className="text-sm font-semibold mb-0.5"
                      style={{ color: "oklch(0.90 0.008 80)", fontFamily: "'Lato', sans-serif" }}
                    >
                      {item.value}
                    </p>
                  )}
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.55 0.01 285)", fontFamily: "'Lato', sans-serif" }}
                  >
                    {item.sub}
                  </p>
                </div>
              </div>
            ))}

            {/* Social / tagline */}
            <div
              className="p-6 rounded-sm mt-2"
              style={{
                background: "linear-gradient(135deg, oklch(0.28 0.18 290/0.3), oklch(0.16 0.08 290/0.3))",
                border: "1px solid oklch(0.42 0.24 292/0.2)",
              }}
            >
              <p
                className="text-sm italic leading-relaxed"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "oklch(0.72 0.14 82)",
                }}
              >
                "We don't just provide services — we invest in your success, your growth, and your future."
              </p>
              <p
                className="text-xs mt-3 tracking-widest"
                style={{
                  fontFamily: "'Cinzel', serif",
                  color: "oklch(0.55 0.01 285)",
                  fontSize: "0.6rem",
                }}
              >
                — Royal Results Team
              </p>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div
            className="lg:col-span-3 p-8 rounded-sm"
            style={{
              background: "oklch(0.12 0.018 290)",
              border: "1px solid oklch(0.72 0.14 82/0.15)",
            }}
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2" style={labelStyle}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-sm text-sm outline-none transition-all duration-300"
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.14 82/0.6)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "oklch(0.22 0.025 290)")}
                  />
                </div>
                <div>
                  <label className="block mb-2" style={labelStyle}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-sm text-sm outline-none transition-all duration-300"
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.14 82/0.6)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "oklch(0.22 0.025 290)")}
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2" style={labelStyle}>
                  Service of Interest
                </label>
                <select
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                  className="w-full px-4 py-3 rounded-sm text-sm outline-none transition-all duration-300"
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.14 82/0.6)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "oklch(0.22 0.025 290)")}
                >
                  <option value="" style={{ background: "oklch(0.08 0.015 290)" }}>
                    Select a service...
                  </option>
                  <option value="counseling" style={{ background: "oklch(0.08 0.015 290)" }}>
                    Counseling
                  </option>
                  <option value="mentorship" style={{ background: "oklch(0.08 0.015 290)" }}>
                    Mentorship
                  </option>
                  <option value="events" style={{ background: "oklch(0.08 0.015 290)" }}>
                    Event Set-Up
                  </option>
                  <option value="detailing" style={{ background: "oklch(0.08 0.015 290)" }}>
                    Car Detailing
                  </option>
                  <option value="bodyrepair" style={{ background: "oklch(0.08 0.015 290)" }}>
                    Car Body Repair
                  </option>
                  <option value="webdev" style={{ background: "oklch(0.08 0.015 290)" }}>
                    Website Development
                  </option>
                  <option value="other" style={{ background: "oklch(0.08 0.015 290)" }}>
                    Other / General Inquiry
                  </option>
                </select>
              </div>

              <div>
                <label className="block mb-2" style={labelStyle}>
                  Message *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Tell us how we can help you..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-sm text-sm outline-none transition-all duration-300 resize-none"
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.14 82/0.6)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "oklch(0.22 0.025 290)")}
                />
              </div>

              <button
                type="submit"
                className="btn-gold py-4 rounded-sm text-sm flex items-center justify-center gap-2 w-full"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
