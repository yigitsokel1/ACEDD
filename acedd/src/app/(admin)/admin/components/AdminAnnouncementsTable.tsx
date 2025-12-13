"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Edit2, Trash2, Pin, PinOff } from "lucide-react";
import type { Announcement } from "@/lib/types/announcement";
import { getAnnouncementCategoryLabel } from "@/lib/types/announcement";
import { isAnnouncementActive } from "@/lib/utils/isAnnouncementActive";

interface AdminAnnouncementsTableProps {
  announcements: Announcement[];
  onEdit: (announcement: Announcement) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string, currentPinStatus: boolean) => void;
  isLoading?: boolean;
}

export function AdminAnnouncementsTable({
  announcements,
  onEdit,
  onDelete,
  onTogglePin,
  isLoading = false,
}: AdminAnnouncementsTableProps) {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("tr-TR", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return "-";
    }
  };

  const formatDateRange = (startsAt: string | null | undefined, endsAt: string | null | undefined) => {
    if (!startsAt && !endsAt) return "Süresiz";
    if (startsAt && endsAt) {
      return `${formatDate(startsAt)} - ${formatDate(endsAt)}`;
    }
    if (startsAt) return `Başlangıç: ${formatDate(startsAt)}`;
    if (endsAt) return `Bitiş: ${formatDate(endsAt)}`;
    return "-";
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      general: "bg-blue-100 text-blue-800",
      scholarship: "bg-green-100 text-green-800",
      event: "bg-purple-100 text-purple-800",
      system: "bg-gray-100 text-gray-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Yükleniyor...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (announcements.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <p className="text-gray-600">Henüz duyuru bulunmuyor.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Başlık
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih Aralığı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pinned
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Oluşturulma
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksiyonlar
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {announcements.map((announcement) => {
                const isActive = isAnnouncementActive(announcement);
                return (
                  <tr key={announcement.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        {/* Sprint 14.7: Pin etiketi kaldırıldı - sadece aksiyonlar sütununda gösteriliyor */}
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 mb-1">
                            {announcement.title}
                          </div>
                          {/* Sprint 14.7: Summary ayrı bir alan olarak render edilmeli */}
                          {announcement.summary && (
                            <div className="text-xs text-gray-600 mt-1.5 pt-1.5 border-t border-gray-100">
                              <span className="font-medium text-gray-700 mr-1">Özet:</span>
                              <span className="text-gray-600 line-clamp-2">{announcement.summary}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getCategoryBadgeColor(announcement.category)}>
                        {getAnnouncementCategoryLabel(announcement.category)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateRange(announcement.startsAt, announcement.endsAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Badge variant={isActive ? "success" : "secondary"}>
                          {isActive ? "Aktif" : "Pasif"}
                        </Badge>
                        {!isActive && (
                          <span
                            className="text-xs text-gray-500 cursor-help"
                            title={
                              announcement.startsAt && new Date(announcement.startsAt) > new Date()
                                ? `Duyuru ${formatDate(announcement.startsAt)} tarihinde aktif olacak`
                                : announcement.endsAt && new Date(announcement.endsAt) < new Date()
                                ? `Duyuru ${formatDate(announcement.endsAt)} tarihinde sona erdi`
                                : "Duyuru pasif durumda"
                            }
                          >
                            ℹ️
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onTogglePin(announcement.id, announcement.isPinned)}
                        className="p-1"
                        title={announcement.isPinned ? "Pin'i kaldır" : "Pin'le"}
                      >
                        {announcement.isPinned ? (
                          <Pin className="w-4 h-4 text-orange-500" />
                        ) : (
                          <PinOff className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(announcement.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(announcement)}
                          className="p-1"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(announcement.id)}
                          className="p-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
