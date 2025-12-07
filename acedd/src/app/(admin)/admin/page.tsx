import React from "react";
import { Metadata } from "next";
import { headers } from "next/headers";
import {
  DashboardStats,
  RecentApplications,
  UpcomingEvents,
  QuickActions,
  AnnouncementsSummaryWidget,
} from "./components";
import type { DashboardStats as DashboardStatsType } from "@/lib/dashboard/getDashboardStats";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Acıpayam ve Çevresi Eğitimi Destekleme Derneği admin paneli",
};

// Re-export type for component props
export type DashboardData = DashboardStatsType;

async function fetchDashboardData(): Promise<DashboardData | null> {
  try {
    // Get headers to forward cookies for authentication
    const headersList = await headers();
    const cookieHeader = headersList.get("cookie");

    // Use absolute URL with forwarded cookies
    // In Next.js 15, Server Components need explicit cookie forwarding for internal API calls
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/dashboard`, {
      cache: "no-store", // Always fetch fresh data
      headers: {
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch dashboard data:", response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return null;
  }
}

export default async function AdminDashboard() {
  const dashboardData = await fetchDashboardData();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Dernek yönetim paneline hoş geldiniz. Buradan tüm işlemleri yönetebilirsiniz.
        </p>
      </div>

      <DashboardStats data={dashboardData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <RecentApplications data={dashboardData} />
        <UpcomingEvents data={dashboardData} />
        <AnnouncementsSummaryWidget />
      </div>

      <QuickActions />
    </div>
  );
}
