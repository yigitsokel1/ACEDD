import React from "react";
import { Metadata } from "next";
import { HeroSection, MissionVisionSection, ValuesSection, TeamSection, HistorySection } from "./components";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Acıpayam ve Çevresi Eğitimi Destekleme Derneği hakkında bilgi edinin. Misyonumuz, vizyonumuz ve değerlerimiz.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <MissionVisionSection />
      <ValuesSection />
      <TeamSection />
      <HistorySection />
    </div>
  );
}
