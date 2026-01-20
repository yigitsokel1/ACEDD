import React from "react";
import { headers } from "next/headers";
import { Header, Footer } from "./index";
import { getSiteName, getLogoUrl } from "@/lib/settings";

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
 */
export async function ConditionalLayout({ children }: ConditionalLayoutProps) {
  // Get pathname from headers (set by proxy)
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  
  // Check if this is an admin page
  // Admin pages have their own layout, so we don't render Header/Footer for them
  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin-login";
  
  // For admin pages, just return children (they have their own layout)
  if (isAdminPage) {
    return <>{children}</>;
  }

  // Fetch site name and logo from settings
  const [siteName, logoUrl] = await Promise.all([
    getSiteName(),
    getLogoUrl(),
  ]);
  
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
