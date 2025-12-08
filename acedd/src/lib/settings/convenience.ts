/**
 * Convenience Functions for Settings
 * 
 * Sprint 10: High-level convenience functions for common settings
 * Sprint 11: Content & SEO convenience functions added
 */

import { getSetting, getSettings, getSettingValue } from "./getSetting";
import { SITE_CONFIG, CONTACT_INFO } from "../constants";
import type { PageIdentifier, PageContent, PageSEO } from "../types/setting";

/**
 * Get site name from settings (with fallback)
 */
export async function getSiteName(): Promise<string> {
  const settings = await getSettings("site");
  return getSettingValue(settings, "site.name", SITE_CONFIG.shortName);
}

/**
 * Get site description from settings (with fallback)
 */
export async function getSiteDescription(): Promise<string> {
  const settings = await getSettings("site");
  return getSettingValue(
    settings,
    "site.description",
    SITE_CONFIG.description
  );
}

/**
 * Get social media links from settings
 */
export async function getSocialLinks(): Promise<{
  instagram?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  youtube?: string;
  github?: string;
}> {
  const settings = await getSettings("social");

  return {
    instagram: getSettingValue(settings, "social.instagram", undefined) as
      | string
      | undefined,
    twitter: getSettingValue(settings, "social.twitter", undefined) as
      | string
      | undefined,
    facebook: getSettingValue(settings, "social.facebook", undefined) as
      | string
      | undefined,
    linkedin: getSettingValue(settings, "social.linkedin", undefined) as
      | string
      | undefined,
    youtube: getSettingValue(settings, "social.youtube", undefined) as
      | string
      | undefined,
    github: getSettingValue(settings, "social.github", undefined) as
      | string
      | undefined,
  };
}

/**
 * Get contact information from settings
 */
export async function getContactInfo(): Promise<{
  email?: string;
  phone?: string;
  address?: string;
}> {
  const settings = await getSettings("contact");

  return {
    email: getSettingValue(settings, "contact.email", CONTACT_INFO.email) as
      | string
      | undefined,
    phone: getSettingValue(settings, "contact.phone", CONTACT_INFO.phone) as
      | string
      | undefined,
    address: getSettingValue(
      settings,
      "contact.address",
      CONTACT_INFO.address
    ) as string | undefined,
  };
}

/**
 * Get footer text from settings (with fallback)
 */
export async function getFooterText(): Promise<string> {
  const settings = await getSettings("footer");
  return getSettingValue(settings, "footer.text", "");
}

/**
 * Get logo URL from settings (with fallback)
 */
export async function getLogoUrl(): Promise<string | null> {
  const settings = await getSettings("site");
  const logoUrl = getSettingValue(settings, "site.logoUrl", null) as string | null;
  
  // Return null if empty string or null
  return logoUrl && logoUrl.trim() ? logoUrl : null;
}

/**
 * Get favicon URL from settings (with fallback)
 */
export async function getFaviconUrl(): Promise<string | null> {
  const settings = await getSettings("site");
  const faviconUrl = getSettingValue(settings, "site.faviconUrl", null) as string | null;
  
  // Return null if empty string or null
  return faviconUrl && faviconUrl.trim() ? faviconUrl : null;
}

/**
 * Get favicon URL with updatedAt timestamp for cache busting
 */
export async function getFaviconUrlWithTimestamp(): Promise<{ url: string | null; timestamp: number | null }> {
  const { prisma } = await import("../db");
  
  try {
    const faviconSetting = await prisma.setting.findUnique({
      where: { key: 'site.faviconUrl' },
      select: { value: true, updatedAt: true },
    });

    const faviconUrl = faviconSetting?.value && typeof faviconSetting.value === 'string' 
      ? faviconSetting.value 
      : null;

    const timestamp = faviconSetting?.updatedAt 
      ? faviconSetting.updatedAt.getTime() 
      : null;

    return {
      url: faviconUrl && faviconUrl.trim() ? faviconUrl : null,
      timestamp,
    };
  } catch (error) {
    console.error('[getFaviconUrlWithTimestamp] Error:', error);
    return { url: null, timestamp: null };
  }
}

/**
 * Page name mappings for SEO fallbacks
 * Sprint 11: Page names for SEO title generation
 */
const PAGE_NAMES: Record<PageIdentifier, string> = {
  home: "Ana Sayfa",
  scholarship: "Burs Başvurusu",
  membership: "Üyelik Başvurusu",
  contact: "İletişim",
  about: "Hakkımızda",
  events: "Etkinlikler",
  donation: "Bağış Yap",
};

/**
 * Page description fallbacks for SEO
 * Sprint 11: Default SEO descriptions for each page
 */
const PAGE_DESCRIPTIONS: Record<PageIdentifier, string> = {
  home: "Acıpayam ve çevresindeki öğrencilerin eğitimlerini desteklemek için kurulmuş dernek",
  scholarship: "Burs başvurusu yapmak için gerekli bilgiler ve başvuru formu",
  membership: "Derneğimize üye olmak için başvuru formu ve bilgiler",
  contact: "Bizimle iletişime geçmek için iletişim bilgileri ve form",
  about: "Derneğimiz hakkında bilgiler, misyonumuz ve vizyonumuz",
  events: "Derneğimizin düzenlediği etkinlikler, toplantılar ve organizasyonlar",
  donation: "Derneğimize bağış yaparak öğrencilerin eğitimlerine destek olun",
};

/**
 * Get page content from settings
 * Sprint 11: Fetch content settings for a specific page
 * 
 * @param pageKey - Page identifier (home, scholarship, membership, contact, about, events, donation)
 * @returns PageContent object with all available content fields for that page
 * 
 * @example
 * const content = await getPageContent("home");
 * // Returns: { heroTitle?: string, intro?: string, stats?: Array, missions?: Array, ... }
 */
export async function getPageContent(pageKey: PageIdentifier): Promise<PageContent> {
  const prefix = `content.${pageKey}`;
  const settings = await getSettings(prefix);

  // Build content object dynamically from all available settings
  const content: PageContent = {};

  // Get all settings for this page prefix
  for (const key in settings) {
    if (key.startsWith(`${prefix}.`)) {
      const fieldKey = key.replace(`${prefix}.`, "");
      const value = settings[key];

      // Skip null/undefined
      if (value === null || value === undefined) {
        continue;
      }

      // Handle arrays first (Array.isArray check must come before typeof === "object" because arrays are also objects)
      if (Array.isArray(value)) {
        // Only include non-empty arrays
        if (value.length > 0) {
          content[fieldKey] = value;
        }
        continue;
      }
      // Handle strings (trim empty strings - empty strings are excluded so fallback can be used)
      else if (typeof value === "string") {
        if (value.trim()) {
          content[fieldKey] = value;
        }
        continue;
      }
      // Handle objects (JSON fields)
      else if (typeof value === "object") {
        // Check if it's an object that should be converted to array (e.g., {"0": {...}, "1": {...}})
        // This happens when JSON is saved as object instead of array
        if (fieldKey === "jobDescriptions" || fieldKey === "requirements" || fieldKey === "applicationSteps") {
          const keys = Object.keys(value);
          // If all keys are numeric strings, convert to array
          if (keys.length > 0 && keys.every(key => /^\d+$/.test(key))) {
            const arrayValue = keys
              .map(key => parseInt(key, 10))
              .sort((a, b) => a - b)
              .map(key => value[String(key)]);
            if (arrayValue.length > 0) {
              content[fieldKey] = arrayValue;
              continue;
            }
          }
        }
        // Regular object (not array-like)
        content[fieldKey] = value;
      }
    }
  }

  return content;
}

/**
 * Get page SEO settings from settings
 * Sprint 11: Fetch SEO settings for a specific page with fallbacks
 * 
 * @param pageKey - Page identifier (home, scholarship, membership, contact, about)
 * @returns PageSEO object with title and description (with fallbacks)
 * 
 * Fallbacks:
 * - title: site.name + " | " + page name
 * - description: Hard-coded page description
 * 
 * @example
 * const seo = await getPageSeo("home");
 * // Returns: { title: "ACEDD | Ana Sayfa", description: "..." }
 */
export async function getPageSeo(pageKey: PageIdentifier): Promise<PageSEO> {
  const prefix = `seo.${pageKey}`;
  const settings = await getSettings(prefix);

  // Get site name for title fallback
  const siteName = await getSiteName();

  // Fallback title: site.name + " | " + page name
  const fallbackTitle = `${siteName} | ${PAGE_NAMES[pageKey]}`;

  // Fallback description: Hard-coded page description
  const fallbackDescription = PAGE_DESCRIPTIONS[pageKey];

  return {
    title: getSettingValue(settings, `${prefix}.title`, fallbackTitle) as string,
    description: getSettingValue(settings, `${prefix}.description`, fallbackDescription) as string,
  };
}

