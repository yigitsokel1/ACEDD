"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui";
import { Megaphone } from "lucide-react";
import Link from "next/link";

interface DashboardData {
  announcements?: {
    total: number;
    active: number;
    recent: Array<{
      id: string;
      title: string;
      summary: string | null;
      category: string;
      isPinned: boolean;
      isActive: boolean;
      createdAt: string;
    }>;
  };
}

interface AnnouncementsSummaryWidgetProps {
  data: DashboardData | null;
}

export function AnnouncementsSummaryWidget({ data }: AnnouncementsSummaryWidgetProps) {
  // Sprint 14: Server-side data kullanıyoruz - client-side fetch yok
  const announcements = data?.announcements?.recent || [];
  const stats = {
    total: data?.announcements?.total || 0,
    active: data?.announcements?.active || 0,
    pinned: announcements.filter((a) => a.isPinned).length,
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
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
        {!data ? (
          <div className="text-center py-4">
            <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-xs text-gray-500">Yükleniyor...</p>
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
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-700">Son Duyurular</h4>
                </div>
                <ul className="space-y-2">
                  {announcements.slice(0, 2).map((announcement) => (
                    <li key={announcement.id} className="flex items-start space-x-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900 block truncate flex-1">
                            {announcement.title}
                          </span>
                          {announcement.isPinned && (
                            <Badge variant="secondary" className="text-xs flex-shrink-0">
                              Sabit
                            </Badge>
                          )}
                        </div>
                        {announcement.summary && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {announcement.summary}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
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
