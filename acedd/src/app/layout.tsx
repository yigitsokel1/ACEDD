import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/constants";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { EventsProvider } from "@/contexts/EventsContext";
import { getSiteName, getSiteDescription, getFaviconUrlWithTimestamp } from "@/lib/settings";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export async function generateMetadata(): Promise<Metadata> {
  // Fetch settings for metadata (with fallback to constants)
  const [siteName, siteDescription, faviconData] = await Promise.all([
    getSiteName(),
    getSiteDescription(),
    getFaviconUrlWithTimestamp(),
  ]);

  const displayName = siteName || SITE_CONFIG.name;
  const displayDescription = siteDescription || SITE_CONFIG.description;
  const faviconUrl = faviconData.url;

  // Use dynamic favicon API route for data URLs, or direct URL for external URLs
  // Add cache-busting query parameter using updatedAt timestamp
  const faviconIcon = faviconUrl 
    ? (faviconUrl.startsWith('data:') 
        ? `/api/favicon?t=${faviconData.timestamp || Date.now()}`
        : faviconUrl)
    : undefined;

  return {
  title: {
      default: displayName,
      template: `%s | ${displayName}`,
  },
    description: displayDescription,
  keywords: ["eğitim", "burs", "dernek", "acıpayam", "öğrenci", "destek"],
    authors: [{ name: displayName }],
    creator: displayName,
    icons: faviconIcon ? {
      icon: faviconIcon,
      shortcut: faviconIcon,
      apple: faviconIcon,
    } : undefined,
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE_CONFIG.url,
      title: displayName,
      description: displayDescription,
      siteName: displayName,
  },
  twitter: {
    card: "summary_large_image",
      title: displayName,
      description: displayDescription,
    creator: "@acedd",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className="font-sans antialiased">
        <EventsProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </EventsProvider>
      </body>
    </html>
  );
}
