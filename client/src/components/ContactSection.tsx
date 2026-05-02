/*
 * ROYAL RESULTS — CONTACT SECTION
 * Regal Noir: split layout, gold icon accents, Cinzel labels
 */

import { useState } from "react";
import { Phone, Mail, MapPin, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@lib/trpc";

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
    phone: "",
    email: "",
    service: "",
    message: "",
  });

  const submitContact = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success("Message sent! We'll be in touch shortly. 👑", { duration: 4000 });
      setForm({ name: "", phone: "", email: "", service: "", message: "" });
    },
    onError: (err) => {
      toast.error(`Failed to send message: ${err.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    submitContact.mutate({
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      service: form.service || undefined,
      message: form.message,
    });
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

  const isLoading = submitContact.isPending;

  return (
    <section
      id="contact"
      className="relative py-24 overflow-hidden"
      style={{ background: "oklch(0.06 0.012 290)" }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 80% 50%, oklch(0.18 0.06 290 / 0.18) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p
            className="text-xs tracking-[0.3em] uppercase mb-3"
            style={{ fontFamily: "'Cinzel', serif", color: "oklch(0.72 0.14 82)" }}
          >
            Get In Touch
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Cinzel', serif", color: "oklch(0.93 0.008 80)" }}
          >
            Let's{" "}
            <span style={{ color: "oklch(0.72 0.14 82)" }}>Connect</span>
          </h2>
          <p
            className="text-base max-w-xl mx-auto"
            style={{ color: "oklch(0.60 0.01 285)", fontFamily: "'Lato', sans-serif" }}
          >
            Ready to elevate your results? Reach out and a member of our royal team will be in touch promptly.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Contact Info */}
          <div className="flex flex-col gap-8">
            {contactInfo.map((item, i) => (
              <div key={i} className="flex items-start gap-5">
                <div
                  className="w-11 h-11 rounded-sm flex items-center justify-center flex-shrink-0"
                  style={{ background: "oklch(0.12 0.02 290)", border: "1px solid oklch(0.72 0.14 82 / 0.3)" }}
                >
                  <item.icon className="w-5 h-5" style={{ color: "oklch(0.72 0.14 82)" }} />
                </div>
                <div>
                  <p style={labelStyle}>{item.label}</p>
                  {item.label === "Email Us" ? (
                    <a
                      href={`mailto:${item.value}`}
                      className="text-base font-medium hover:opacity-80 transition-opacity"
                      style={{ color: "oklch(0.90 0.008 80)", fontFamily: "'Lato', sans-serif" }}
                    >
                      {item.value}
                    </a>
                  ) : item.label === "Call Us" ? (
                    <a
                      href={`tel:${item.value.replace(/[^0-9+]/g, "")}`}
                      className="text-base font-medium hover:opacity-80 transition-opacity"
                      style={{ color: "oklch(0.90 0.008 80)", fontFamily: "'Lato', sans-serif" }}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p
                      className="text-base font-medium"
                      style={{ color: "oklch(0.90 0.008 80)", fontFamily: "'Lato', sans-serif" }}
                    >
                      {item.value}
                    </p>
                  )}
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "oklch(0.50 0.01 285)", fontFamily: "'Lato', sans-serif" }}
                  >
                    {item.sub}
                  </p>
                </div>
              </div>
            ))}

            {/* Social / tagline */}
            <div
              className="mt-4 p-5 rounded-sm"
              style={{ background: "oklch(0.10 0.018 290)", borderLeft: "3px solid oklch(0.72 0.14 82 / 0.6)" }}
            >
              <p
                className="text-sm italic"
                style={{ color: "oklch(0.65 0.01 285)", fontFamily: "'Lato', sans-serif" }}
              >
                "We don't just provide services — we invest in your success, your growth, and your future."
              </p>
              <p
                className="text-xs mt-2"
                style={{ fontFamily: "'Cinzel', serif", color: "oklch(0.72 0.14 82)" }}
              >
                — Royal Results Team
              </p>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div
            className="p-8 rounded-sm"
            style={{ background: "oklch(0.10 0.018 290)", border: "1px solid oklch(0.18 0.025 290)" }}
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Full Name *</label>
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
                  <label style={labelStyle}>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="(555) 000-0000"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-sm text-sm outline-none transition-all duration-300"
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.14 82/0.6)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "oklch(0.22 0.025 290)")}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Email Address *</label>
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

              <div>
                <label style={labelStyle}>Service of Interest</label>
                <select
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                  className="w-full px-4 py-3 rounded-sm text-sm outline-none transition-all duration-300"
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.14 82/0.6)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "oklch(0.22 0.025 290)")}
                >
                  <option value="" style={{ background: "oklch(0.08 0.015 290)" }}>Select a service...</option>
                  <option value="counseling" style={{ background: "oklch(0.08 0.015 290)" }}>Counseling</option>
                  <option value="mentorship" style={{ background: "oklch(0.08 0.015 290)" }}>Mentorship</option>
                  <option value="events" style={{ background: "oklch(0.08 0.015 290)" }}>Event Set-Up</option>
                  <option value="detailing" style={{ background: "oklch(0.08 0.015 290)" }}>Car Detailing</option>
                  <option value="bodyrepair" style={{ background: "oklch(0.08 0.015 290)" }}>Car Body Repair</option>
                  <option value="webdev" style={{ background: "oklch(0.08 0.015 290)" }}>Website Development</option>
                  <option value="other" style={{ background: "oklch(0.08 0.015 290)" }}>Other / General Inquiry</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Message *</label>
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
                disabled={isLoading}
                className="btn-gold py-4 rounded-sm text-sm flex items-center justify-center gap-2 w-full disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                ) : (
                  <><Send className="w-4 h-4" /> Send Message</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
