import React from "react";
import { Metadata } from "next";
import { HeroSection, MissionSection, CTASection, AnnouncementStripSection } from "./(pages)/home/components";
import { getPageSeo } from "@/lib/settings";

// Disable caching to ensure fresh content from settings
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("home");
  
  return {
    title: seo.title,
    description: seo.description,
  };
}

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
