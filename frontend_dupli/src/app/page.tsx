import React from "react";
import { HeroSection, StatsSection, ServicesSection, CTASection } from "./(pages)/home/components";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <CTASection />
    </div>
  );
}
