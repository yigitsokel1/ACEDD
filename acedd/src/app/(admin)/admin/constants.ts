import { Users, FileText, Calendar, Megaphone, Settings, BarChart3, MessageCircle } from "lucide-react";
import type { AdminRole } from "@/lib/types/admin";
import { pagePermissions } from "@/lib/auth/rolePermissions";

export type AdminNavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  roles: AdminRole[]; // Roles that can access this menu item - Sprint 14.7: Merkezi rolePermissions'den alınıyor
};

/**
 * Admin Navigation Items
 * Sprint 14.7: Merkezi rolePermissions'den besleniyor - tutarlılık için
 */
export const ADMIN_NAVIGATION_ITEMS: AdminNavItem[] = [
  { 
    name: "Dashboard", 
    href: "/admin", 
    icon: BarChart3,
    roles: pagePermissions["/admin"] || ["SUPER_ADMIN", "ADMIN"]
  },
  { 
    name: "Duyurular", 
    href: "/admin/duyurular", 
    icon: Megaphone,
    roles: pagePermissions["/admin/duyurular"] || ["SUPER_ADMIN", "ADMIN"]
  },
  { 
    name: "Etkinlikler", 
    href: "/admin/etkinlikler", 
    icon: Calendar,
    roles: pagePermissions["/admin/etkinlikler"] || ["SUPER_ADMIN", "ADMIN"]
  },
  { 
    name: "Üyeler", 
    href: "/admin/uyeler", 
    icon: Users,
    roles: pagePermissions["/admin/uyeler"] || ["SUPER_ADMIN", "ADMIN"]
  },
  { 
    name: "Burs Başvuruları", 
    href: "/admin/burs-basvurulari", 
    icon: FileText,
    roles: pagePermissions["/admin/burs-basvurulari"] || ["SUPER_ADMIN", "ADMIN"]
  },
  { 
    name: "İletişim Mesajları", 
    href: "/admin/iletisim-mesajlari", 
    icon: MessageCircle,
    roles: pagePermissions["/admin/iletisim-mesajlari"] || ["SUPER_ADMIN", "ADMIN"]
  },
  { 
    name: "Ayarlar", 
    href: "/admin/ayarlar", 
    icon: Settings,
    roles: pagePermissions["/admin/ayarlar"] || ["SUPER_ADMIN"] // Only SUPER_ADMIN can access settings
  },
];
