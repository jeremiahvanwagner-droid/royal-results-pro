/*
 * ROYAL RESULTS — NAVBAR
 * Regal Noir: sticky gold-bordered nav, Cinzel font, crown logo
 * Fixed: logo given dedicated left column, links centered, CTA right — no overlap
 */

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const CROWN_IMG = "/manus-storage/royal-crown_c39f0de4.jpg";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Donate", href: "#donate" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[oklch(0.08_0.015_290/0.97)] backdrop-blur-md border-b border-[oklch(0.72_0.14_82/0.3)] shadow-[0_4px_30px_oklch(0.08_0.015_290/0.8)]"
          : "bg-[oklch(0.08_0.015_290/0.85)] backdrop-blur-sm"
      }`}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}>
        {/* Main bar — three explicit columns: logo | links | cta */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            alignItems: "center",
            height: "5rem",
            gap: "1rem",
          }}
        >
          {/* ── Column 1: Logo ── */}
          <button
            onClick={() => handleNavClick("#home")}
            className="flex items-center gap-3 group flex-shrink-0"
            style={{ minWidth: 0 }}
          >
            <div className="relative flex-shrink-0">
              <img
                src={CROWN_IMG}
                alt="Royal Crown"
                className="transition-all duration-300 group-hover:scale-110"
                style={{
                  width: "2.4rem",
                  height: "2rem",
                  objectFit: "contain",
                  filter: "drop-shadow(0 0 6px oklch(0.72 0.14 82/0.7))",
                  animation: "crownGlow 2.8s ease-in-out infinite",
                }}
              />
              <style>{`
                @keyframes crownGlow {
                  0%, 100% {
                    filter: drop-shadow(0 0 4px oklch(0.72 0.14 82/0.4)) drop-shadow(0 0 8px oklch(0.72 0.14 82/0.2));
                    transform: scale(1);
                  }
                  50% {
                    filter: drop-shadow(0 0 10px oklch(0.72 0.14 82/0.9)) drop-shadow(0 0 20px oklch(0.72 0.14 82/0.5)) drop-shadow(0 0 30px oklch(0.62 0.18 82/0.3));
                    transform: scale(1.06);
                  }
                }
              `}</style>
            </div>
            <div className="flex flex-col leading-none flex-shrink-0">
              <span
                style={{
                  fontFamily: "'Cinzel Decorative', serif",
                  color: "oklch(0.72 0.14 82)",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                Royal
              </span>
              <span
                style={{
                  fontFamily: "'Cinzel', serif",
                  color: "oklch(0.82 0.12 85)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                Results
              </span>
            </div>
          </button>

          {/* ── Column 2: Nav Links (centered, hidden on mobile) ── */}
          <ul
            className="hidden lg:flex items-center justify-center"
            style={{ gap: "1.5rem", listStyle: "none", margin: 0, padding: 0 }}
          >
            {navLinks.map((link) => (
              <li key={link.label} style={{ flexShrink: 0 }}>
                <button
                  onClick={() => handleNavClick(link.href)}
                  className="relative transition-colors duration-300 group"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    color: "oklch(0.82 0.10 80)",
                    fontSize: "0.7rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    background: "none",
                    border: "none",
                    padding: "0.25rem 0",
                  }}
                >
                  {link.label}
                  <span
                    className="absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full"
                    style={{ background: "oklch(0.72 0.14 82)" }}
                  />
                </button>
              </li>
            ))}
          </ul>

          {/* ── Column 3: CTA + Mobile Toggle ── */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Desktop CTA */}
            <button
              onClick={() => handleNavClick("#contact")}
              className="hidden lg:block btn-gold rounded-sm"
              style={{
                padding: "0.6rem 1.25rem",
                fontSize: "0.65rem",
                whiteSpace: "nowrap",
              }}
            >
              Get Started
            </button>

            {/* Mobile Toggle */}
            <button
              className="lg:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ color: "oklch(0.72 0.14 82)" }}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="lg:hidden border-t"
          style={{
            background: "oklch(0.08 0.015 290/0.98)",
            borderColor: "oklch(0.72 0.14 82/0.3)",
          }}
        >
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1.5rem" }}>
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left py-2.5 border-b transition-colors duration-200"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    color: "oklch(0.82 0.10 80)",
                    fontSize: "0.75rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    borderColor: "oklch(0.22 0.025 290)",
                    background: "none",
                    border: "none",
                    borderBottom: "1px solid oklch(0.22 0.025 290)",
                  }}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => handleNavClick("#contact")}
                className="btn-gold rounded-sm mt-2"
                style={{ padding: "0.75rem 1.5rem", fontSize: "0.7rem" }}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
