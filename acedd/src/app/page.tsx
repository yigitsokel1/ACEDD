import React from "react";
import { HeroSection, MissionSection, CTASection, AnnouncementStripSection } from "./(pages)/home/components";

export default function Home() {
  return (
    <div className="bg-white">
      <HeroSection />
      <AnnouncementStripSection />
      <MissionSection />
      <CTASection />
    </div>
  );
}
