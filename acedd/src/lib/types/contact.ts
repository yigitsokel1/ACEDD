/**
 * Contact Message Types
 * 
 * Sprint 8: İletişim mesajları için domain types
 */

export type ContactMessageStatus = "NEW" | "READ" | "ARCHIVED";

/**
 * Contact Message (İletişim Mesajı)
 */
export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  ipAddress?: string;
  userAgent?: string;
  status: ContactMessageStatus;
  createdAt: string; // ISO 8601
  readAt?: string; // ISO 8601
  archivedAt?: string; // ISO 8601
}

/**
 * Create Contact Message Request
 * (Form submission data)
 */
export interface CreateContactMessageRequest {
  name: string; // Form'da "name" olarak geliyor, backend'de "fullName" olarak kaydedilecek
  email: string;
  phone?: string;
  subject: string;
  message: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Update Contact Message Status Request
 * (Admin tarafından durum güncelleme)
 */
export interface UpdateContactMessageStatusRequest {
  status: "READ" | "ARCHIVED";
}

