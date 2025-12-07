// Genel tip tanımları
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Sprint 6: Kullanılmayan tipler temizlendi
// - User: Kullanılmıyor (AdminUser ve Member kullanılıyor)
// - ScholarshipApplication: Kullanılmıyor (gelecekte burs başvuruları için ayrı tip tanımlanabilir)
// - Event: Kullanılmıyor (Event tipi src/app/(pages)/etkinlikler/constants.ts'de tanımlı)
// - News: Kullanılmıyor (Announcement kullanılıyor)
// - Service: Kullanılmıyor

// Sprint 5: BoardMember artık src/lib/types/member.ts'de tanımlı
// Sprint 6: Eski BoardMember interface'i kaldırıldı (order ve isActive Prisma modelinde yok, TS tipinde de yok - tutarlılık sağlandı)
// export interface BoardMember extends BaseEntity {
//   name: string;
//   position: string;
//   bio: string;
//   imageUrl?: string;
//   order: number;      // Kaldırıldı - Sprint 6
//   isActive: boolean;  // Kaldırıldı - Sprint 6
// }

// Sprint 6: Kullanılmayan tipler temizlendi
// - Statistic: Kullanılmıyor
// - ContactFormData: Kullanılmıyor (src/app/(pages)/iletisim/components/ContactForm.tsx'de local tip var)
// - ApiResponse: Kullanılmıyor (API route'ları NextResponse.json kullanıyor)
// - PaginationParams: Kullanılmıyor
// - PaginatedResponse: Kullanılmıyor

// Announcement types
export * from "./announcement";

// Admin types
export * from "./admin";

// Scholarship types (Sprint 7)
export * from "./scholarship";

// Contact types (Sprint 8)
export * from "./contact";
