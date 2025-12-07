"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui";
import { Eye, Clock } from "lucide-react";
import Link from "next/link";

interface DashboardData {
  scholarship?: {
    recent: Array<{
      id: string;
      fullName: string;
      university: string;
      createdAt: string;
    }>;
  };
}

interface RecentApplicationsProps {
  data: DashboardData | null;
}

export function RecentApplications({ data }: RecentApplicationsProps) {
  const applications = data?.scholarship?.recent || [];

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
        <CardTitle>Son Başvurular</CardTitle>
        <CardDescription>
          En son yapılan burs başvuruları
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!data ? (
          <div className="text-center py-4">
            <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-xs text-gray-500">Yükleniyor...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">Henüz başvuru bulunmuyor</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {applications.map((application) => (
                <div
                  key={application.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      <Clock className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {application.fullName}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {application.university}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(application.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Link href={`/admin/burs-basvurulari`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Görüntüle
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/admin/burs-basvurulari">
                <Button variant="outline" className="w-full">
                  Tüm Başvuruları Görüntüle
                </Button>
              </Link>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
