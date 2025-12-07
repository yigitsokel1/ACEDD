import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { FileText, UserCheck, Users, MessageCircle, Calendar } from "lucide-react";

interface DashboardData {
  membership?: {
    total: number;
    pending: number;
  };
  scholarship?: {
    total: number;
    pending: number;
  };
  members?: {
    total: number;
    active: number;
  };
  messages?: {
    unread: number;
  };
  events?: {
    upcomingTotal: number;
  };
}

interface DashboardStatsProps {
  data: DashboardData | null;
}

export function DashboardStats({ data }: DashboardStatsProps) {
  // Calculate stats from real data
  const totalApplications = (data?.membership?.total || 0) + (data?.scholarship?.total || 0);
  const pendingApplications = (data?.membership?.pending || 0) + (data?.scholarship?.pending || 0);
  const activeMembers = data?.members?.active || 0;
  const unreadMessages = data?.messages?.unread || 0;
  const upcomingEvents = data?.events?.upcomingTotal || 0;

  const stats = [
    {
      title: "Toplam Başvuru",
      value: totalApplications.toString(),
      icon: FileText,
    },
    {
      title: "Bekleyen Başvurular",
      value: pendingApplications.toString(),
      icon: UserCheck,
      highlight: pendingApplications > 0,
    },
    {
      title: "Aktif Üyeler",
      value: activeMembers.toString(),
      icon: Users,
    },
    {
      title: "Okunmamış Mesajlar",
      value: unreadMessages.toString(),
      icon: MessageCircle,
      highlight: unreadMessages > 0,
    },
    {
      title: "Yaklaşan Etkinlikler",
      value: upcomingEvents.toString(),
      icon: Calendar,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className={stat.highlight ? "border-2 border-blue-300" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.highlight ? "text-blue-600" : "text-gray-600"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.highlight ? "text-blue-600" : "text-gray-900"}`}>
              {data ? stat.value : "—"}
            </div>
            {!data && (
              <p className="text-xs text-gray-400">Yükleniyor...</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
