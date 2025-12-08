/**
 * Settings Types
 * 
 * Sprint 10: Site ayarları için domain types
 * Sprint 11: Content & SEO ayarları eklendi
 * 
 * Settings model uses key-value pattern with dot notation:
 * 
 * Site Identity:
 * - site.name, site.description, site.logoUrl, site.faviconUrl
 * 
 * Contact Information:
 * - contact.email, contact.phone, contact.address
 * 
 * Social Media:
 * - social.instagram, social.twitter, social.facebook, social.linkedin, social.youtube
 * 
 * Footer:
 * - footer.text
 * 
 * Content (Sprint 11):
 * - content.{page}.heroTitle, content.{page}.intro
 * - Pages: home, scholarship, membership, contact, about, events, donation
 * - Additional fields per page: stats, missions, activities, requirements, etc.
 * 
 * SEO (Sprint 11):
 * - seo.{page}.title, seo.{page}.description
 * - Pages: home, scholarship, membership, contact, about, events, donation
 */

import { Prisma } from "@prisma/client";

/**
 * Setting value can be string, number, boolean, object, or array
 */
export type SettingValue = string | number | boolean | object | any[] | null;

/**
 * Setting key patterns (for type safety and documentation)
 * 
 * Sprint 11: Content & SEO key patterns added
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
  // Content (Sprint 11)
  | `content.home.${string}`
  | `content.scholarship.${string}`
  | `content.membership.${string}`
  | `content.contact.${string}`
  | `content.about.${string}`
  | `content.events.${string}`
  | `content.donation.${string}`
  // SEO (Sprint 11)
  | `seo.home.${"title" | "description"}`
  | `seo.scholarship.${"title" | "description"}`
  | `seo.membership.${"title" | "description"}`
  | `seo.contact.${"title" | "description"}`
  | `seo.about.${"title" | "description"}`
  | `seo.events.${"title" | "description"}`
  | `seo.donation.${"title" | "description"}`
  // Allow custom keys for flexibility
  | string;

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

/**
 * Page identifier for content and SEO settings
 * Sprint 11: Content & SEO page identifiers
 */
export type PageIdentifier = "home" | "scholarship" | "membership" | "contact" | "about" | "events" | "donation";

/**
 * Content settings for a page
 * Sprint 11: Content settings structure
 * 
 * Supports all content fields that can be stored in settings
 * JSON fields (stats, missions, activities, etc.) are returned as objects/arrays
 */
export interface PageContent {
  // Hero section
  heroTitle?: string;
  intro?: string;
  
  // Home page specific
  primaryButtonText?: string;
  secondaryButtonText?: string;
  visualCardTitle?: string;
  visualCardDescription?: string;
  missionTitle?: string;
  missionDescription?: string;
  missionFooter?: string;
  ctaTitle?: string;
  ctaDescription?: string;
  ctaPrimaryButtonText?: string;
  ctaSecondaryButtonText?: string;
  stats?: Array<{ id: string; icon: string; value: string; label: string; color: string }>;
  missions?: Array<{ id: string; icon: string; title: string; description: string; color: string }>;
  activities?: Array<{ id: string; icon: string; title: string; description: string; color: string }>;
  trustIndicators?: Array<{ id: string; icon: string; label: string }>;
  
  // About page specific
  missionVisionTitle?: string;
  missionVisionSubtitle?: string;
  valuesTitle?: string;
  valuesSubtitle?: string;
  valuesFooter?: string;
  goalsTitle?: string;
  goalsSubtitle?: string;
  goalsMainTitle?: string;
  goalsMainDescription?: string;
  goalsActivitiesTitle?: string;
  goalsActivitiesSubtitle?: string;
  goalsFooter?: string;
  jobDescriptionsTitle?: string;
  jobDescriptions?: Array<{ title: string; description: string }>;
  organizationStructureTitle?: string;
  organizationStructureDescription?: string;
  values?: Array<{ title: string; description: string }>;
  goals?: Array<{ title: string; description: string }>;
  missionVision?: { mission: { title: string; description: string }; vision: { title: string; description: string } };
  
  // Membership page specific
  additionalInfoTitle?: string;
  additionalInfoDescription?: string;
  
  // Scholarship page specific
  requirements?: string[];
  applicationSteps?: Array<{ step: number; title: string; description: string }>;
  
  // Donation page specific
  introduction?: string;
  thankYouTitle?: string;
  thankYouDescription?: string;
  contactMessage?: string;
  bankAccounts?: Array<{ currency: string; bank: string; accountName: string; iban: string }>;
  
  // Events page specific
  ctaSubtitle?: string;
  
  // Contact page specific
  infoSectionTitle?: string;
  infoSectionDescription?: string;
  
  // Generic - allows any additional fields
  [key: string]: any;
}

/**
 * SEO settings for a page
 * Sprint 11: SEO settings structure
 */
export interface PageSEO {
  title?: string;
  description?: string;
}

