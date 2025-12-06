import React from "react";
import { Metadata } from "next";
import { AdminAnnouncementsPageContent } from "../components/AdminAnnouncementsPageContent";

export const metadata: Metadata = {
  title: "Duyurular - Admin",
  description: "Dernek duyurularını yönetin",
};

export default function AnnouncementsPage() {
  return <AdminAnnouncementsPageContent />;
}
