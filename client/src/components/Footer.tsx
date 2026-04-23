/*
 * ROYAL RESULTS — FOOTER
 * Regal Noir: dark background, gold crown logo, Cinzel typography
 */

const CROWN_IMG = "/manus-storage/royal-crown_c39f0de4.jpg";

const footerLinks = {
  Services: [
    "Counseling",
    "Mentorship",
    "Event Set-Up",
    "Car Detailing",
    "Car Body Repair",
    "Website Development",
  ],
  Company: ["About Us", "Our Mission", "Contact", "Donate"],
};

export default function Footer() {
  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      style={{
        background: "oklch(0.06 0.012 290)",
        borderTop: "1px solid oklch(0.72 0.14 82/0.2)",
      }}
    >
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <img
                src={CROWN_IMG}
                alt="Royal Crown"
                style={{ width: "2.6rem", height: "2.2rem", objectFit: "contain", filter: "drop-shadow(0 0 6px oklch(0.72 0.14 82/0.5))" }}
              />
              <div className="flex flex-col leading-none">
                <span
                  className="font-bold tracking-widest uppercase"
                  style={{
                    fontFamily: "'Cinzel Decorative', serif",
                    color: "oklch(0.72 0.14 82)",
                    fontSize: "1rem",
                  }}
                >
                  Royal
                </span>
                <span
                  className="text-xs tracking-[0.35em] uppercase"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    color: "oklch(0.82 0.12 85)",
                  }}
                >
                  Results
                </span>
              </div>
            </div>
            <p
              className="text-sm leading-relaxed mb-6 max-w-xs"
              style={{ color: "oklch(0.55 0.01 285)", fontFamily: "'Lato', sans-serif" }}
            >
              Your premier resource provider for counseling, mentorship, event set-up, automotive
              excellence, and digital solutions. Proudly serving San Antonio and surrounding areas.
            </p>
            <div className="gold-rule w-24" />
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4
                className="text-xs tracking-[0.25em] uppercase mb-5"
                style={{
                  fontFamily: "'Cinzel', serif",
                  color: "oklch(0.72 0.14 82)",
                  fontSize: "0.65rem",
                }}
              >
                {category}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => {
                        const map: Record<string, string> = {
                          "About Us": "#about",
                          "Our Mission": "#about",
                          Contact: "#contact",
                          Donate: "#donate",
                        };
                        const href = map[link] || "#services";
                        handleNavClick(href);
                      }}
                      className="text-sm transition-colors duration-200 hover:text-gold text-left"
                      style={{
                        color: "oklch(0.55 0.01 285)",
                        fontFamily: "'Lato', sans-serif",
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.color =
                          "oklch(0.72 0.14 82)")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.color =
                          "oklch(0.55 0.01 285)")
                      }
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid oklch(0.22 0.025 290)" }}
        >
          <p
            className="text-xs"
            style={{ color: "oklch(0.45 0.01 285)", fontFamily: "'Lato', sans-serif" }}
          >
            © {new Date().getFullYear()} Royal Results. All rights reserved.
          </p>
          <p
            className="text-xs tracking-widest uppercase"
            style={{
              fontFamily: "'Cinzel', serif",
              color: "oklch(0.45 0.01 285)",
              fontSize: "0.6rem",
            }}
          >
            Elevating Lives · Delivering Results
          </p>
        </div>
      </div>
    </footer>
  );
}
