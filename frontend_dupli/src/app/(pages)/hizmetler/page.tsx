import React from "react";
import { Metadata } from "next";
import { HeroSection, ServicesGrid, ProcessSection, CTASection, ContactInfoSection } from "./components";

export const metadata: Metadata = {
  title: "Hizmetlerimiz",
  description: "Acıpayam ve Çevresi Eğitimi Destekleme Derneği olarak sunduğumuz hizmetler. Eğitim bursları, kitap yardımları, mentorluk programı ve daha fazlası.",
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ServicesGrid />
      <ProcessSection />
      <CTASection />
      <ContactInfoSection />
    </div>
  );
}
