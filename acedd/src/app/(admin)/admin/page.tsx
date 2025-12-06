import React from "react";
import { Metadata } from "next";
import {
  DashboardStats,
  RecentApplications,
  UpcomingEvents,
  QuickActions,
  AnnouncementsSummaryWidget,
} from "./components";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Acıpayam ve Çevresi Eğitimi Destekleme Derneği admin paneli",
};

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Dernek yönetim paneline hoş geldiniz. Buradan tüm işlemleri yönetebilirsiniz.
        </p>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <RecentApplications />
        <UpcomingEvents />
        <AnnouncementsSummaryWidget />
      </div>

      <QuickActions />
    </div>
  );
}
