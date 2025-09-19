"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Header, Footer } from "./index";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Admin sayfaları için header ve footer'ı gizle
  const isAdminPage = pathname.startsWith("/admin");
  
  if (isAdminPage) {
    return <>{children}</>;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
