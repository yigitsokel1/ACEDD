import React from "react";
import { Metadata } from "next";
import { HeroSection, EventsGrid, CTASection } from "./components";

export const metadata: Metadata = {
  title: "Etkinlikler",
  description: "Acıpayam ve Çevresi Eğitimi Destekleme Derneği etkinlikleri. Eğitim seminerleri, sosyal sorumluluk projeleri, motivasyon etkinlikleri ve daha fazlası.",
};

export default function EventsPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <EventsGrid />
      <CTASection />
    </div>
  );
}