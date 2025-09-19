import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Acıpayam ve Çevresi Eğitimi Destekleme Derneği - Eğitimde Fırsat Eşitliği",
  description: "Acıpayam ve çevresindeki öğrencilerin eğitim olanaklarını artırmak, kaliteli eğitime erişimlerini sağlamak ve geleceğe hazırlamak amacıyla 2015 yılından bu yana faaliyet gösteriyoruz.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
