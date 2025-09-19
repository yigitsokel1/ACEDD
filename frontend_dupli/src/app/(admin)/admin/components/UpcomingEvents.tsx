import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui";
import { Calendar, MapPin, Users, Plus } from "lucide-react";
import { UPCOMING_EVENTS } from "../constants";

export function UpcomingEvents() {
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
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Yeni Etkinlik
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {UPCOMING_EVENTS.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
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
                      {new Date(event.date).toLocaleDateString("tr-TR")} {event.time}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Users className="h-3 w-3 mr-1" />
                      {event.participants} katılımcı
                    </div>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Detay
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Button variant="outline" className="w-full">
            Tüm Etkinlikleri Görüntüle
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
