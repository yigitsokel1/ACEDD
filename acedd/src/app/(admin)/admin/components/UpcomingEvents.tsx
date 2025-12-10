"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui";
import { Calendar, MapPin } from "lucide-react";
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
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yaklaşan Etkinlikler</CardTitle>
        <CardDescription>
          Planlanan etkinlikler ve toplantılar
        </CardDescription>
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
          </div>
        ) : (
          <div className="space-y-3">
            {events.slice(0, 5).map((event) => (
              <Link
                key={event.id}
                href={`/admin/etkinlikler?highlight=${event.id}`}
                className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors group min-h-[80px]"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
                    {event.title}
                  </p>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {events.length > 3 && (
              <div className="pt-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/admin/etkinlikler">
                    Tüm Etkinlikleri Görüntüle
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
