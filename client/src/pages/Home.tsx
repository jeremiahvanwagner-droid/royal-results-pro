/*
 * ROYAL RESULTS — HOME PAGE
 * Regal Noir: Full single-page layout assembling all sections
 * Sections: Navbar → Hero Slideshow → About → Services → Testimonials → Donation → Contact → Footer
 */

import Navbar from "@/components/Navbar";
import HeroSlideshow from "@/components/HeroSlideshow";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import DonationSection from "@/components/DonationSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.08 0.015 290)" }}
    >
      <Navbar />
      <HeroSlideshow />
      <AboutSection />
      <ServicesSection />
      <TestimonialsSection />
      <DonationSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
