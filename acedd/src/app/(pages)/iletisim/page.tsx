import React from "react";
import { Metadata } from "next";
import { HeroSection, ContactInfoSection, ContactForm } from "./components";
import { getContactInfo, getSiteName } from "@/lib/settings";
import { SITE_CONFIG } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  const siteName = await getSiteName();
  const displayName = siteName || SITE_CONFIG.name;
  
  return {
    title: "İletişim",
    description: `${displayName} ile iletişime geçin. Sorularınız, önerileriniz ve destek talepleriniz için bizimle iletişime geçin.`,
  };
}

export default async function ContactPage() {
  // Fetch contact info from settings
  const contactInfo = await getContactInfo();
  
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ContactInfoSection contactInfo={contactInfo} />
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
