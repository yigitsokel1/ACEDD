import React from "react";
import { Metadata } from "next";
import { HeroSection, BankAccountsSection, ThankYouSection } from "./components";
import { getPageSeo } from "@/lib/settings";

// Disable caching to ensure fresh content from settings
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("donation");
  
  return {
    title: seo.title,
    description: seo.description,
  };
}

export default function DonationPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <BankAccountsSection />
      <ThankYouSection />
    </div>
  );
}
