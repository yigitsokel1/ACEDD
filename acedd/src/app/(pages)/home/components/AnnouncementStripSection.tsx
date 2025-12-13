import React from "react";
import { AnnouncementStrip } from "./AnnouncementStrip";
import { prisma } from "@/lib/db";
import type { Announcement } from "@/lib/types/announcement";
import { logErrorSecurely } from "@/lib/utils/secureLogging";

async function fetchActiveAnnouncements(): Promise<Announcement[]> {
  try {
    // Directly use Prisma in server component instead of API route
    // This is more efficient and avoids HTTP overhead
    const announcements = await prisma.announcement.findMany({
      orderBy: [
        { isPinned: "desc" },
        { createdAt: "desc" },
      ],
    });

    // Convert Prisma DateTime to ISO strings
    const formattedAnnouncements: Announcement[] = announcements.map((announcement) => ({
      id: announcement.id,
      title: announcement.title,
      summary: announcement.summary,
      content: announcement.content,
      category: announcement.category,
      startsAt: announcement.startsAt?.toISOString() ?? null,
      endsAt: announcement.endsAt?.toISOString() ?? null,
      isPinned: announcement.isPinned,
      createdAt: announcement.createdAt.toISOString(),
      updatedAt: announcement.updatedAt.toISOString(),
    }));

    return formattedAnnouncements;
  } catch (error) {
    logErrorSecurely("[AnnouncementStripSection][FETCH]", error);
    return [];
  }
}

export async function AnnouncementStripSection() {
  const announcements = await fetchActiveAnnouncements();

  return <AnnouncementStrip announcements={announcements} />;
}
