import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui";
import { Plus, FileText, Users, Calendar, Megaphone, Settings } from "lucide-react";

export function QuickActions() {
  const actions = [
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hızlı İşlemler</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-gray-50"
              asChild
            >
              <a href={action.href}>
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <action.icon className="h-4 w-4" />
                  </div>
                  <span className="font-medium">{action.title}</span>
                </div>
                <p className="text-xs text-gray-500 text-left">
                  {action.description}
                </p>
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
