import React from "react";
import { Metadata } from "next";
import { HeroSection, ContactInfoSection, ContactForm } from "./components";
import { getContactInfo, getPageContent, getPageSeo } from "@/lib/settings";

// Disable caching to ensure fresh content from settings
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("contact");
  
  return {
    title: seo.title,
    description: seo.description,
  };
}

export default async function ContactPage() {
  // Fetch contact info and content from settings
  const contactInfo = await getContactInfo();
  const content = await getPageContent("contact");

  return (
    <div className="min-h-screen">
      <HeroSection />
      <ContactInfoSection contactInfo={contactInfo} content={content} />
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
