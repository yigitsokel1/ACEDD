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
  
  // All content comes from settings with defaults from defaultContent.ts
  const formTitle = content.formTitle || "Üyelik Başvuru Formu"; // Keep minimal fallback for form
  const formDescription = content.formDescription || "Lütfen aşağıdaki formu doldurarak üyelik başvurunuzu yapın.";
  const membershipConditionsText = content.membershipConditionsText || "";
  
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <MembershipForm 
        formTitle={formTitle} 
        formDescription={formDescription}
        membershipConditionsText={membershipConditionsText}
      />
      <AdditionalInfoSection />
    </div>
  );
}
