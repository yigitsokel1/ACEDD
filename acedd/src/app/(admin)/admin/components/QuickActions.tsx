"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui";
import { FileText, Users, Calendar, Megaphone, Settings } from "lucide-react";
import Link from "next/link";
import type { AdminRole } from "@/lib/types/admin";
import { canAccessQuickAction } from "@/lib/auth/rolePermissions";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
}

export function QuickActions() {
  const [userRole, setUserRole] = useState<AdminRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch("/api/admin/me");
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.user?.role || null);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  const allActions: QuickAction[] = [
    {
      title: "Yeni Başvuru İncele",
      description: "Bekleyen başvuruları değerlendir",
      icon: FileText,
      href: "/admin/burs-basvurulari",
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Üye Ekle",
      description: "Yeni dernek üyesi ekle",
      icon: Users,
      href: "/admin/uyeler",
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Etkinlik Oluştur",
      description: "Yeni etkinlik planla",
      icon: Calendar,
      href: "/admin/etkinlikler",
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Duyuru Yayınla",
      description: "Yeni duyuru oluştur",
      icon: Megaphone,
      href: "/admin/duyurular",
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Ayarları Düzenle",
      description: "Sistem ayarlarını güncelle",
      icon: Settings,
      href: "/admin/ayarlar",
      color: "bg-gray-100 text-gray-600",
    },
  ];

  // Sprint 14.7: Merkezi role permissions kullanarak sadece yetkili olduğu aksiyonları göster (görünmezlik)
  const actions = allActions.filter((action) => 
    canAccessQuickAction(action.title, userRole)
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hızlı İşlemler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-xs text-gray-500">Yükleniyor...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hızlı İşlemler</CardTitle>
      </CardHeader>
      <CardContent>
        {actions.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">Yetkili olduğunuz hızlı işlem bulunmuyor</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-gray-50"
              asChild
            >
              <Link href={action.href}>
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <action.icon className="h-4 w-4" />
                  </div>
                  <span className="font-medium">{action.title}</span>
                </div>
                <p className="text-xs text-gray-500 text-left">
                  {action.description}
                </p>
              </Link>
            </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
