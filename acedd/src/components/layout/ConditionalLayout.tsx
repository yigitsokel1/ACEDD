import React from "react";
import { headers } from "next/headers";
import { Header, Footer } from "./index";
import { getSiteName, getLogoUrl } from "@/lib/settings";
import { SITE_CONFIG } from "@/lib/constants";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

/**
 * Server Component: ConditionalLayout
 *
 * Renders Header and Footer for public pages only.
 * Admin pages use their own layout, so this component checks the pathname
 * and only renders Header/Footer for non-admin pages.
 * Fetches settings from database and passes to Header.
 * Veritabanı veya headers hata verirse sabitlere (SITE_CONFIG) düşer; aynı markup
 * üretilir, hydration uyumsuzluğu önlenir.
 */
export async function ConditionalLayout({ children }: ConditionalLayoutProps) {
  let pathname = "";
  try {
    const headersList = await headers();
    pathname = headersList.get("x-pathname") || "";
  } catch {
    pathname = "";
  }

  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin-login";

  if (isAdminPage) {
    return <>{children}</>;
  }

  let siteName: string = SITE_CONFIG.shortName;
  let logoUrl: string | null = null;
  try {
    [siteName, logoUrl] = await Promise.all([
      getSiteName(),
      getLogoUrl(),
    ]);
  } catch {
    siteName = SITE_CONFIG.shortName;
    logoUrl = null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header siteName={siteName} logoUrl={logoUrl} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
