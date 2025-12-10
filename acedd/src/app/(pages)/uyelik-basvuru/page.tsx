import React from "react";
import { Metadata } from "next";
import { HeroSection, MembershipForm, AdditionalInfoSection } from "./components";
import { getPageSeo, getPageContent } from "@/lib/settings";

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

export default async function MembershipApplicationPage() {
  const content = await getPageContent("membership");
  
  // Form title and description with fallbacks
  const formTitle = content.formTitle || "Üyelik Başvuru Formu";
  const formDescription = content.formDescription || "Lütfen aşağıdaki formu doldurarak üyelik başvurunuzu yapın. Tüm alanlar zorunludur.";
  
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <MembershipForm formTitle={formTitle} formDescription={formDescription} />
      <AdditionalInfoSection />
    </div>
  );
}
