import React from "react";
import { Metadata } from "next";
import { HeroSection, RequirementsSection, ScholarshipForm } from "./components";
import { getPageSeo } from "@/lib/settings";

// Disable caching to ensure fresh content from settings
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("scholarship");
  
  return {
    title: seo.title,
    description: seo.description,
  };
}

export default function ScholarshipPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <RequirementsSection />
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScholarshipForm />
        </div>
      </section>
    </div>
  );
}
