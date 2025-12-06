import React from "react";
import { Metadata } from "next";
import { HeroSection, ContactInfoSection, ContactForm } from "./components";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Acıpayam ve Çevresi Eğitimi Destekleme Derneği ile iletişime geçin. Sorularınız, önerileriniz ve destek talepleriniz için bizimle iletişime geçin.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ContactInfoSection />
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
