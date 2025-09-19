import React from "react";
import { Metadata } from "next";
import { HeroSection, RequirementsSection, ScholarshipForm } from "./components";

export const metadata: Metadata = {
  title: "Burs Başvurusu",
  description: "Acıpayam ve Çevresi Eğitimi Destekleme Derneği burs başvurusu. Eğitim hayatınızı desteklemek için burs başvurusu yapın.",
};

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
