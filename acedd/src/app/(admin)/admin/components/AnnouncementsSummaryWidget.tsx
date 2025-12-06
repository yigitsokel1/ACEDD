"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Megaphone, Pin } from "lucide-react";
import Link from "next/link";
import type { Announcement } from "@/lib/types/announcement";

export function AnnouncementsSummaryWidget() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, active: 0, pinned: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all announcements for stats
        const allResponse = await fetch("/api/announcements");
        if (!allResponse.ok) {
          console.error("Failed to fetch all announcements:", allResponse.status);
        } else {
          const allData: Announcement[] = await allResponse.json();
          const activeData = allData.filter((a) => {
            const now = new Date();
            const startsAt = a.startsAt ? new Date(a.startsAt) : null;
            const endsAt = a.endsAt ? new Date(a.endsAt) : null;
            if (startsAt && now < startsAt) return false;
            if (endsAt && now > endsAt) return false;
            return true;
          });
          
          setStats({
            total: allData.length,
            active: activeData.length,
            pinned: allData.filter((a) => a.isPinned).length,
          });
        }

        // Fetch recent active announcements
        const recentResponse = await fetch("/api/announcements?activeOnly=true");
        if (!recentResponse.ok) {
          console.error("Failed to fetch active announcements:", recentResponse.status);
        } else {
          const recentData: Announcement[] = await recentResponse.json();
          // Sort by pinned first, then by createdAt desc, take first 3
          const sorted = recentData
            .sort((a, b) => {
              if (a.isPinned !== b.isPinned) {
                return a.isPinned ? -1 : 1;
              }
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            })
            .slice(0, 3);
          setAnnouncements(sorted);
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
        setError(error instanceof Error ? error.message : "Veri yüklenirken hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("tr-TR", {
        month: "short",
        day: "numeric",
      }).format(date);
    } catch {
      return "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Megaphone className="w-5 h-5 text-orange-600" />
            <span>Duyurular</span>
          </CardTitle>
          <Link
            href="/admin/duyurular"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Tümünü Gör
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">
            <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-xs text-gray-500">Yükleniyor...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-sm text-red-600 mb-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              Yeniden Dene
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-xs text-gray-500">Toplam</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                <div className="text-xs text-gray-500">Aktif</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{stats.pinned}</div>
                <div className="text-xs text-gray-500">Sabitlenmiş</div>
              </div>
            </div>

            {/* Recent Announcements */}
            {announcements.length > 0 ? (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Son Duyurular</h4>
                <ul className="space-y-2">
                  {announcements.map((announcement) => (
                    <li key={announcement.id} className="flex items-start space-x-2">
                      {announcement.isPinned && (
                        <Pin className="w-3 h-3 text-orange-500 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <Link
                          href="/admin/duyurular"
                          className="text-sm font-medium text-gray-900 hover:text-blue-600 block truncate"
                        >
                          {announcement.title}
                        </Link>
                        <p className="text-xs text-gray-500">
                          {formatDate(announcement.createdAt)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-2">
                <p className="text-sm text-gray-500">Aktif duyuru bulunmuyor</p>
                <Link
                  href="/admin/duyurular"
                  className="text-xs text-blue-600 hover:text-blue-700 mt-1 inline-block"
                >
                  Yeni duyuru oluştur
                </Link>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
