/**
 * Role-Based Access Control (RBAC) Permissions
 * 
 * Sprint 14.7: Merkezi rol izin yönetimi - Tüm rol kuralları tek yerden yönetilir
 * 
 * Bu dosya tüm role-based erişim kurallarını merkezi olarak yönetir.
 * API route'ları, navigation menüleri ve Quick Actions bu dosyadan beslenir.
 */

import type { AdminRole } from "@/lib/types/admin";

/**
 * Page-level permissions
 * Sprint 14.7: Admin sayfaları için rol bazlı erişim kuralları
 */
export const pagePermissions: Record<string, AdminRole[]> = {
  "/admin": ["SUPER_ADMIN", "ADMIN"], // Dashboard
  "/admin/duyurular": ["SUPER_ADMIN", "ADMIN"], // Duyurular
  "/admin/etkinlikler": ["SUPER_ADMIN", "ADMIN"], // Etkinlikler
  "/admin/uyeler": ["SUPER_ADMIN", "ADMIN"], // Üyeler (UI erişimi)
  "/admin/burs-basvurulari": ["SUPER_ADMIN", "ADMIN"], // Burs Başvuruları
  "/admin/iletisim-mesajlari": ["SUPER_ADMIN", "ADMIN"], // İletişim Mesajları
  "/admin/ayarlar": ["SUPER_ADMIN"], // Ayarlar - Sadece SUPER_ADMIN
} as const;

/**
 * Quick Actions permissions
 * Sprint 14.7: Dashboard quick actions için rol bazlı görünürlük kuralları
 * Page permissions ile uyumlu olmalı
 */
export const quickActionPermissions: Record<string, AdminRole[]> = {
  "Yeni Başvuru İncele": ["SUPER_ADMIN", "ADMIN"], // Burs başvuruları
  "Üye Ekle": ["SUPER_ADMIN"], // Üye ekleme sadece SUPER_ADMIN
  "Etkinlik Oluştur": ["SUPER_ADMIN", "ADMIN"], // Etkinlikler
  "Duyuru Yayınla": ["SUPER_ADMIN", "ADMIN"], // Duyurular
  "Ayarları Düzenle": ["SUPER_ADMIN"], // Ayarlar - Sadece SUPER_ADMIN (page permissions ile uyumlu)
} as const;

/**
 * API endpoint permissions
 * Sprint 14.7: API route'ları için rol bazlı erişim kuralları
 * 
 * Format: "METHOD /api/path" => required roles
 */
export const apiPermissions: Record<string, AdminRole[]> = {
  // Members API
  "GET /api/members": ["SUPER_ADMIN", "ADMIN"], // Üye listesi - Admin sayfasında kullanılıyor
  "GET /api/members/*": ["SUPER_ADMIN", "ADMIN"], // Üye detay - Admin sayfasında kullanılıyor
  "POST /api/members": ["SUPER_ADMIN"], // Üye ekleme
  "PUT /api/members/*": ["SUPER_ADMIN"], // Üye güncelleme
  "DELETE /api/members/*": ["SUPER_ADMIN"], // Üye silme
  
  // Membership Applications API
  "GET /api/membership-applications": ["SUPER_ADMIN", "ADMIN"], // Başvuru listesi - Admin sayfasında kullanılıyor
  "GET /api/membership-applications/*": ["SUPER_ADMIN", "ADMIN"], // Başvuru detay - Admin sayfasında kullanılıyor
  "PUT /api/membership-applications/*": ["SUPER_ADMIN"], // Başvuru durumu güncelleme
  "DELETE /api/membership-applications/*": ["SUPER_ADMIN"], // Başvuru silme
  
  // Board Members API
  // GET /api/board-members - Public (public sayfada kullanılıyor - hakkimizda)
  // GET /api/board-members/* - Public (public sayfada kullanılıyor)
  "POST /api/board-members": ["SUPER_ADMIN"], // Yönetim kurulu ekleme
  "PUT /api/board-members/*": ["SUPER_ADMIN"], // Yönetim kurulu güncelleme
  "DELETE /api/board-members/*": ["SUPER_ADMIN"], // Yönetim kurulu silme
  
  // Scholarship Applications API
  "GET /api/scholarship-applications": ["SUPER_ADMIN", "ADMIN"], // Başvuru listesi
  "GET /api/scholarship-applications/*": ["SUPER_ADMIN", "ADMIN"], // Başvuru detay
  // POST /api/scholarship-applications - Public (public form submission)
  "PUT /api/scholarship-applications/*": ["SUPER_ADMIN", "ADMIN"], // Başvuru durumu güncelleme
  "DELETE /api/scholarship-applications/*": ["SUPER_ADMIN", "ADMIN"], // Başvuru silme
  
  // Membership Applications API - POST (Public form submission)
  // POST /api/membership-applications - Public (public form submission)
  
  // Contact Messages API - POST (Public form submission)
  // POST /api/contact-messages - Public (public form submission)
  
  // Announcements API
  // GET /api/announcements - Public (public sayfada kullanılıyor)
  // GET /api/announcements/[id] - Public (public sayfada kullanılabilir)
  "POST /api/announcements": ["SUPER_ADMIN", "ADMIN"], // Duyuru oluşturma
  "PUT /api/announcements/*": ["SUPER_ADMIN", "ADMIN"], // Duyuru güncelleme
  "DELETE /api/announcements/*": ["SUPER_ADMIN", "ADMIN"], // Duyuru silme
  
  // Events API
  // GET /api/events - Public (public sayfada kullanılıyor)
  // GET /api/events/[id] - Public (public sayfada kullanılabilir)
  "POST /api/events": ["SUPER_ADMIN", "ADMIN"], // Etkinlik oluşturma
  "PUT /api/events/*": ["SUPER_ADMIN", "ADMIN"], // Etkinlik güncelleme
  "DELETE /api/events/*": ["SUPER_ADMIN", "ADMIN"], // Etkinlik silme
  
  // Datasets API
  // GET /api/datasets - Public (şu an kullanılmıyor, admin panelinde kullanılacaksa auth eklenebilir)
  // GET /api/datasets/[id] - Public (şu an kullanılmıyor, admin panelinde kullanılacaksa auth eklenebilir)
  // GET /api/datasets/image/[id] - Public (public sayfada görsel servis etmek için kullanılıyor)
  "POST /api/datasets": ["SUPER_ADMIN", "ADMIN"], // Dosya yükleme
  "PUT /api/datasets/*": ["SUPER_ADMIN", "ADMIN"], // Dosya güncelleme
  "DELETE /api/datasets/*": ["SUPER_ADMIN", "ADMIN"], // Dosya silme
  
  // Upload API
  "POST /api/upload": ["SUPER_ADMIN", "ADMIN"], // Dosya yükleme (admin panelinde kullanılıyor)
  
  // Dashboard API
  "GET /api/dashboard": ["SUPER_ADMIN", "ADMIN"], // Dashboard verileri
  
  // Contact Messages API
  "GET /api/contact-messages": ["SUPER_ADMIN", "ADMIN"], // Mesaj listesi
  "GET /api/contact-messages/*": ["SUPER_ADMIN", "ADMIN"], // Mesaj detay
  "PUT /api/contact-messages/*": ["SUPER_ADMIN", "ADMIN"], // Mesaj durumu güncelleme
  "DELETE /api/contact-messages/*": ["SUPER_ADMIN"], // Mesaj silme - Sadece SUPER_ADMIN
  
  // Scholarship Applications API - POST (Public form submission)
  // POST /api/scholarship-applications - Public (public form submission)
  
  // Settings API
  "GET /api/settings": ["SUPER_ADMIN"], // Ayarlar - Sadece SUPER_ADMIN
  "PUT /api/settings": ["SUPER_ADMIN"], // Ayarlar güncelleme - Sadece SUPER_ADMIN
} as const;

/**
 * Check if a role has access to a page
 * Sprint 14.7: Page-level erişim kontrolü
 */
export function canAccessPage(pagePath: string, userRole: AdminRole | null): boolean {
  if (!userRole) return false;
  
  // SUPER_ADMIN has access to everything
  if (userRole === "SUPER_ADMIN") return true;
  
  // Get required roles for this page
  const requiredRoles = pagePermissions[pagePath];
  if (!requiredRoles) return false;
  
  // Check if user's role is in required roles
  return requiredRoles.includes(userRole);
}

/**
 * Check if a role has access to a quick action
 * Sprint 14.7: Quick action erişim kontrolü
 */
export function canAccessQuickAction(actionTitle: string, userRole: AdminRole | null): boolean {
  if (!userRole) return false;
  
  // SUPER_ADMIN has access to everything
  if (userRole === "SUPER_ADMIN") return true;
  
  // Get required roles for this action
  const requiredRoles = quickActionPermissions[actionTitle];
  if (!requiredRoles) return false;
  
  // Check if user's role is in required roles
  return requiredRoles.includes(userRole);
}

/**
 * Get all quick actions that a user can access
 */
export function getAccessibleQuickActions(userRole: AdminRole | null): string[] {
  if (!userRole) return [];
  
  return Object.keys(quickActionPermissions).filter(actionTitle =>
    canAccessQuickAction(actionTitle, userRole)
  );
}

/**
 * Get required roles for an API endpoint
 * Sprint 14.7: API endpoint erişim kontrolü için helper
 */
export function getRequiredRolesForAPI(method: string, path: string): AdminRole[] | null {
  // Try exact match first (e.g., "POST /api/members")
  const exactKey = `${method} ${path}`;
  if (apiPermissions[exactKey]) {
    return apiPermissions[exactKey];
  }
  
  // Try wildcard match (e.g., "PUT /api/members/123" matches "PUT /api/members/*")
  const wildcardKey = Object.keys(apiPermissions).find(key => {
    if (!key.endsWith("/*")) return false;
    const basePath = key.slice(0, -2); // Remove "/*"
    return path.startsWith(basePath.replace(/^[A-Z]+ /, "")); // Remove method prefix
  });
  
  if (wildcardKey) {
    return apiPermissions[wildcardKey];
  }
  
  return null;
}
