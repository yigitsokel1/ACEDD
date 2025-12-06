import React from "react";
import { Megaphone, Pin, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Announcement } from "@/lib/types/announcement";
import { isAnnouncementActive } from "@/lib/utils/isAnnouncementActive";

interface AnnouncementStripProps {
  announcements: Announcement[];
}

export function AnnouncementStrip({ announcements }: AnnouncementStripProps) {
  // Filter active announcements and sort by pinned first, then by date
  const activeAnnouncements = announcements
    .filter((announcement) => isAnnouncementActive(announcement))
    .sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, 5); // Show max 5 announcements

  if (activeAnnouncements.length === 0) {
    return null; // Don't show anything if no active announcements
  }

  return (
    <div className="bg-orange-50 border-y border-orange-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center space-x-2 mb-3">
          <Megaphone className="w-5 h-5 text-orange-600" />
          <h2 className="text-lg font-semibold text-gray-900">Güncel Duyurular</h2>
        </div>
        <div className="space-y-2">
          {activeAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-orange-100 hover:border-orange-300 transition-colors"
            >
              {announcement.isPinned && (
                <Pin className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  {announcement.title}
                </h3>
                {announcement.summary && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {announcement.summary}
                  </p>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
