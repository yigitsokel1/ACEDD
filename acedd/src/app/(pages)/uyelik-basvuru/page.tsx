import React from "react";
import { Metadata } from "next";
import { HeroSection, MembershipForm, AdditionalInfoSection } from "./components";
import { getPageSeo } from "@/lib/settings";

// Disable caching to ensure fresh content from settings
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("membership");
  
  return {
    title: seo.title,
    description: seo.description,
  };
}

export default function MembershipApplicationPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <MembershipForm />
      <AdditionalInfoSection />
    </div>
  );
}
