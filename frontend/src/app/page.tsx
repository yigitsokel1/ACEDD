import React from "react";
import { HeroSection, MissionSection, CTASection } from "./(pages)/home/components";

export default function Home() {
  return (
    <div className="bg-white">
      <HeroSection />
      <MissionSection />
      <CTASection />
    </div>
  );
}
