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
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
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
          <div className="space-y-3">
            {applications.slice(0, 3).map((application) => (
              <Link
                key={application.id}
                href={`/admin/burs-basvurulari?highlight=${application.id}`}
                className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors group min-h-[80px]"
              >
                <div className="flex-shrink-0">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
                    {application.fullName}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {application.university}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(application.createdAt)}
                  </p>
                </div>
                <Eye className="h-4 w-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
              </Link>
            ))}
            {applications.length > 3 && (
              <div className="pt-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/admin/burs-basvurulari">
                    Tüm Başvuruları Görüntüle
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
