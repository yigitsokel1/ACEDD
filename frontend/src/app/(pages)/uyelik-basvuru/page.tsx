import React from "react";
import { Metadata } from "next";
import { HeroSection, MembershipForm, AdditionalInfoSection } from "./components";

export const metadata: Metadata = {
  title: "Üyelik Başvurusu",
  description: "Acıpayam ve Çevresi Eğitimi Destekleme Derneği üyelik başvurusu. Formu doldurarak derneğimize üye olabilirsiniz.",
};

export default function MembershipApplicationPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <MembershipForm />
      <AdditionalInfoSection />
    </div>
  );
}
