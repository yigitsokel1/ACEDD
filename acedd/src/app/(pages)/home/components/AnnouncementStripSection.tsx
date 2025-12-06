import React from "react";
import { AnnouncementStrip } from "@/components/AnnouncementStrip";
import type { Announcement } from "@/lib/types/announcement";

async function fetchActiveAnnouncements(): Promise<Announcement[]> {
  try {
    // In Next.js server components, we can use relative URLs
    // The fetch will automatically use the same origin
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const url = process.env.NODE_ENV === "production" 
      ? `${baseUrl}/api/announcements?activeOnly=true`
      : `http://localhost:3000/api/announcements?activeOnly=true`;
    
    const response = await fetch(url, {
      cache: "no-store", // Always fetch fresh data
    });

    if (!response.ok) {
      console.error("Failed to fetch announcements");
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return [];
  }
}

export async function AnnouncementStripSection() {
  const announcements = await fetchActiveAnnouncements();

  return <AnnouncementStrip announcements={announcements} />;
}
