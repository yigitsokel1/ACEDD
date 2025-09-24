import React from "react";
import { Metadata } from "next";
import { HeroSection, BankAccountsSection, ThankYouSection } from "./components";

export const metadata: Metadata = {
  title: "Bağış Yap",
  description: "Acıpayam ve Çevresi Eğitimi Destekleme Derneği'ne bağış yapın. Banka havale ve EFT ile TL, USD, EURO hesaplarımıza bağışta bulunabilirsiniz.",
};

export default function DonationPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <BankAccountsSection />
      <ThankYouSection />
    </div>
  );
}
