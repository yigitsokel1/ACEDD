"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui";
import { Calendar, MapPin, Plus } from "lucide-react";
import Link from "next/link";

interface DashboardData {
  events?: {
    upcoming: Array<{
      id: string;
      title: string;
      date: string;
      location: string;
    }>;
  };
}

interface UpcomingEventsProps {
  data: DashboardData | null;
}

export function UpcomingEvents({ data }: UpcomingEventsProps) {
  const events = data?.events?.upcoming || [];

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("tr-TR", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Yaklaşan Etkinlikler</CardTitle>
            <CardDescription>
              Planlanan etkinlikler ve toplantılar
            </CardDescription>
          </div>
          <Link href="/admin/etkinlikler">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Yeni Etkinlik
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {!data ? (
          <div className="text-center py-4">
            <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-xs text-gray-500">Yükleniyor...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">Yaklaşan etkinlik bulunmuyor</p>
            <Link href="/admin/etkinlikler">
              <Button variant="outline" size="sm" className="mt-4">
                <Plus className="h-4 w-4 mr-1" />
                Yeni Etkinlik Oluştur
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {event.title}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(event.date)}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Link href={`/admin/etkinlikler`}>
                    <Button variant="outline" size="sm">
                      Detay
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/admin/etkinlikler">
                <Button variant="outline" className="w-full">
                  Tüm Etkinlikleri Görüntüle
                </Button>
              </Link>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
