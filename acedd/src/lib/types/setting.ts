/**
 * Settings Types
 * 
 * Sprint 10: Site ayarları için domain types
 * 
 * Settings model uses key-value pattern with dot notation:
 * - site.name, site.description, site.logoUrl
 * - contact.email, contact.phone, contact.address
 * - social.instagram, social.twitter, social.facebook
 * - footer.text
 */

import { Prisma } from "@prisma/client";

/**
 * Setting value can be string, number, boolean, object, or array
 */
export type SettingValue = string | number | boolean | object | any[] | null;

/**
 * Setting key patterns (for type safety and documentation)
 */
export type SettingKey =
  // Site Identity
  | "site.name"
  | "site.description"
  | "site.logoUrl"
  | "site.faviconUrl"
  // Contact Information
  | "contact.email"
  | "contact.phone"
  | "contact.address"
  | "contact.city"
  | "contact.postalCode"
  | "contact.country"
  // Social Media
  | "social.instagram"
  | "social.twitter"
  | "social.facebook"
  | "social.linkedin"
  | "social.youtube"
  | "social.github"
  // Footer
  | "footer.text"
  | "footer.copyright"
  // Future: form.*, seo.*, content.*
  | string; // Allow custom keys for flexibility

/**
 * Setting interface (matches Prisma model)
 */
export interface Setting {
  id: string;
  key: string;
  value: Prisma.JsonValue | null;
  updatedAt: string; // ISO 8601
  updatedBy: string | null; // AdminUser ID
}

/**
 * Create/Update Setting Request
 */
export interface UpsertSettingRequest {
  key: string;
  value: SettingValue;
}

/**
 * Bulk Update Settings Request
 */
export interface BulkUpdateSettingsRequest {
  settings: Array<{
    key: string;
    value: SettingValue;
  }>;
}

/**
 * Settings grouped by category (for UI organization)
 */
export interface SettingsByCategory {
  site: {
    name?: string;
    description?: string;
    logoUrl?: string;
    faviconUrl?: string;
  };
  contact: {
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  social: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    youtube?: string;
    github?: string;
  };
  footer: {
    text?: string;
    copyright?: string;
  };
}

