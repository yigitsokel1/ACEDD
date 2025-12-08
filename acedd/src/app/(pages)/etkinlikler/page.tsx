import React from "react";
import { Metadata } from "next";
import { HeroSection, EventsGrid, CTASection } from "./components";
import { getPageSeo } from "@/lib/settings";

// Disable caching to ensure fresh content from settings
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("events");
  
  return {
    title: seo.title,
    description: seo.description,
  };
}

export default function EventsPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <EventsGrid />
      <CTASection />
    </div>
  );
}