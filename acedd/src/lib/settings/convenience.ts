/**
 * Convenience Functions for Settings
 * 
 * Sprint 10: High-level convenience functions for common settings
 * Sprint 11: Content & SEO convenience functions added
 * Sprint 12: Using centralized key management
 */

import { getSetting, getSettings, getSettingValue } from "./getSetting";
import { SITE_CONFIG, CONTACT_INFO } from "../constants";
import type { PageIdentifier, PageContent, PageSEO } from "../types/setting";
import { getContentPrefix, getSeoPrefix, getSeoKey } from "./keys";

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
 * Normalize and validate JSON array fields
 * Sprint 12: JSON field stabilization - ensures arrays are valid and filtered
 */

/**
 * Normalize string array (e.g., requirements)
 * Filters out null, undefined, and empty strings
 */
function normalizeStringArray(value: any): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map(item => item.trim());
}

/**
 * Normalize applicationSteps array
 * Validates: step (number), title (string), description (string)
 */
function normalizeApplicationSteps(value: any): Array<{ step: number; title: string; description: string }> {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is { step: number; title: string; description: string } => {
      return (
        typeof item === "object" &&
        item !== null &&
        typeof item.step === "number" &&
        typeof item.title === "string" &&
        item.title.trim().length > 0 &&
        typeof item.description === "string" &&
        item.description.trim().length > 0
      );
    })
    .map(item => ({
      step: item.step,
      title: item.title.trim(),
      description: item.description.trim(),
    }));
}

/**
 * Normalize stats array (home page)
 * Validates: id, icon, value, label, color (all strings)
 */
function normalizeStatsArray(value: any): Array<{ id: string; icon: string; value: string; label: string; color: string }> {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is { id: string; icon: string; value: string; label: string; color: string } => {
      return (
        typeof item === "object" &&
        item !== null &&
        typeof item.id === "string" &&
        typeof item.icon === "string" &&
        typeof item.value === "string" &&
        typeof item.label === "string" &&
        typeof item.color === "string"
      );
    })
    .map(item => ({
      id: item.id,
      icon: item.icon,
      value: item.value,
      label: item.label,
      color: item.color,
    }));
}

/**
 * Normalize missions/activities array (home page)
 * Validates: id, icon, title, description, color (all strings)
 */
function normalizeMissionsActivitiesArray(value: any): Array<{ id: string; icon: string; title: string; description: string; color: string }> {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is { id: string; icon: string; title: string; description: string; color: string } => {
      return (
        typeof item === "object" &&
        item !== null &&
        typeof item.id === "string" &&
        typeof item.icon === "string" &&
        typeof item.title === "string" &&
        item.title.trim().length > 0 &&
        typeof item.description === "string" &&
        item.description.trim().length > 0 &&
        typeof item.color === "string"
      );
    })
    .map(item => ({
      id: item.id,
      icon: item.icon,
      title: item.title.trim(),
      description: item.description.trim(),
      color: item.color,
    }));
}

/**
 * Normalize trustIndicators array (home page)
 * Validates: id, icon, label (all strings)
 */
function normalizeTrustIndicatorsArray(value: any): Array<{ id: string; icon: string; label: string }> {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is { id: string; icon: string; label: string } => {
      return (
        typeof item === "object" &&
        item !== null &&
        typeof item.id === "string" &&
        typeof item.icon === "string" &&
        typeof item.label === "string" &&
        item.label.trim().length > 0
      );
    })
    .map(item => ({
      id: item.id,
      icon: item.icon,
      label: item.label.trim(),
    }));
}

/**
 * Normalize jobDescriptions/values/goals array (about page)
 * Validates: title (string), description (string)
 */
function normalizeTitleDescriptionArray(value: any): Array<{ title: string; description: string }> {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is { title: string; description: string } => {
      return (
        typeof item === "object" &&
        item !== null &&
        typeof item.title === "string" &&
        item.title.trim().length > 0 &&
        typeof item.description === "string" &&
        item.description.trim().length > 0
      );
    })
    .map(item => ({
      title: item.title.trim(),
      description: item.description.trim(),
    }));
}

/**
 * Normalize bankAccounts array (donation page)
 * Validates: currency, bank, accountName, iban (all strings)
 */
function normalizeBankAccountsArray(value: any): Array<{ currency: string; bank: string; accountName: string; iban: string }> {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is { currency: string; bank: string; accountName: string; iban: string } => {
      return (
        typeof item === "object" &&
        item !== null &&
        typeof item.currency === "string" &&
        item.currency.trim().length > 0 &&
        typeof item.bank === "string" &&
        item.bank.trim().length > 0 &&
        typeof item.accountName === "string" &&
        item.accountName.trim().length > 0 &&
        typeof item.iban === "string" &&
        item.iban.trim().length > 0
      );
    })
    .map(item => ({
      currency: item.currency.trim(),
      bank: item.bank.trim(),
      accountName: item.accountName.trim(),
      iban: item.iban.trim(),
    }));
}

/**
 * Normalize missionVision object (about page)
 * Validates: mission and vision objects with title and description
 */
function normalizeMissionVision(value: any): { mission: { title: string; description: string }; vision: { title: string; description: string } } | undefined {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return undefined;
  
  const mission = value.mission;
  const vision = value.vision;
  
  if (
    typeof mission === "object" &&
    mission !== null &&
    typeof mission.title === "string" &&
    mission.title.trim().length > 0 &&
    typeof mission.description === "string" &&
    mission.description.trim().length > 0 &&
    typeof vision === "object" &&
    vision !== null &&
    typeof vision.title === "string" &&
    vision.title.trim().length > 0 &&
    typeof vision.description === "string" &&
    vision.description.trim().length > 0
  ) {
    return {
      mission: {
        title: mission.title.trim(),
        description: mission.description.trim(),
      },
      vision: {
        title: vision.title.trim(),
        description: vision.description.trim(),
      },
    };
  }
  
  return undefined;
}

/**
 * Get page content from settings
 * Sprint 11: Fetch content settings for a specific page
 * Sprint 12: JSON field normalization and validation
 * 
 * @param pageKey - Page identifier (home, scholarship, membership, contact, about, events, donation)
 * @returns PageContent object with all available content fields for that page
 * 
 * @example
 * const content = await getPageContent("home");
 * // Returns: { heroTitle?: string, intro?: string, stats?: Array, missions?: Array, ... }
 */
export async function getPageContent(pageKey: PageIdentifier): Promise<PageContent> {
  const prefix = getContentPrefix(pageKey);
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
        // Normalize and validate arrays based on field type
        let normalizedValue: any = null;
        
        if (fieldKey === "requirements") {
          normalizedValue = normalizeStringArray(value);
        } else if (fieldKey === "applicationSteps") {
          normalizedValue = normalizeApplicationSteps(value);
        } else if (fieldKey === "stats") {
          normalizedValue = normalizeStatsArray(value);
        } else if (fieldKey === "missions" || fieldKey === "activities") {
          normalizedValue = normalizeMissionsActivitiesArray(value);
        } else if (fieldKey === "trustIndicators") {
          normalizedValue = normalizeTrustIndicatorsArray(value);
        } else if (fieldKey === "jobDescriptions" || fieldKey === "values" || fieldKey === "goals") {
          normalizedValue = normalizeTitleDescriptionArray(value);
        } else if (fieldKey === "bankAccounts") {
          normalizedValue = normalizeBankAccountsArray(value);
        } else {
          // Unknown array type - use as-is but ensure it's an array
          normalizedValue = Array.isArray(value) ? value : [];
        }
        
        // Only include non-empty normalized arrays
        if (normalizedValue !== null && Array.isArray(normalizedValue) && normalizedValue.length > 0) {
          (content as Record<string, any>)[fieldKey] = normalizedValue;
        }
        continue;
      }
      // Handle strings (trim empty strings - empty strings are excluded so fallback can be used)
      else if (typeof value === "string") {
        // Check if this field should be an array - if so, skip it (wrong type)
        const arrayFields = [
          "jobDescriptions",
          "requirements",
          "applicationSteps",
          "stats",
          "missions",
          "activities",
          "trustIndicators",
          "values",
          "goals",
          "bankAccounts",
        ];
        if (arrayFields.includes(fieldKey)) {
          // This field should be an array, but we got a string - skip it
          continue;
        }
        
        if (value.trim()) {
          (content as Record<string, any>)[fieldKey] = value;
        }
        continue;
      }
      // Handle objects (JSON fields)
      else if (typeof value === "object" && value !== null) {
        // Check if it's an object that should be converted to array (e.g., {"0": {...}, "1": {...}})
        // This happens when JSON is saved as object instead of array
        const arrayFields = [
          "jobDescriptions",
          "requirements",
          "applicationSteps",
          "stats",
          "missions",
          "activities",
          "trustIndicators",
          "values",
          "goals",
          "bankAccounts",
        ];
        
        if (arrayFields.includes(fieldKey)) {
          const objValue = value as Record<string, any>;
          const keys = Object.keys(objValue);
          // If all keys are numeric strings, convert to array
          if (keys.length > 0 && keys.every(key => /^\d+$/.test(key))) {
            const arrayValue = keys
              .map(key => parseInt(key, 10))
              .sort((a, b) => a - b)
              .map(key => objValue[String(key)]);
            
            // Normalize the converted array
            let normalizedValue: any = null;
            if (fieldKey === "requirements") {
              normalizedValue = normalizeStringArray(arrayValue);
            } else if (fieldKey === "applicationSteps") {
              normalizedValue = normalizeApplicationSteps(arrayValue);
            } else if (fieldKey === "stats") {
              normalizedValue = normalizeStatsArray(arrayValue);
            } else if (fieldKey === "missions" || fieldKey === "activities") {
              normalizedValue = normalizeMissionsActivitiesArray(arrayValue);
            } else if (fieldKey === "trustIndicators") {
              normalizedValue = normalizeTrustIndicatorsArray(arrayValue);
            } else if (fieldKey === "jobDescriptions" || fieldKey === "values" || fieldKey === "goals") {
              normalizedValue = normalizeTitleDescriptionArray(arrayValue);
            } else if (fieldKey === "bankAccounts") {
              normalizedValue = normalizeBankAccountsArray(arrayValue);
            }
            
            if (normalizedValue !== null && Array.isArray(normalizedValue) && normalizedValue.length > 0) {
              (content as Record<string, any>)[fieldKey] = normalizedValue;
            }
            continue;
          } else {
            // This field should be an array, but we got an object that's not array-like - skip it
            continue;
          }
        }
        
        // Handle missionVision object (special case)
        if (fieldKey === "missionVision") {
          const normalized = normalizeMissionVision(value);
          if (normalized !== undefined) {
            (content as Record<string, any>)[fieldKey] = normalized;
          }
          continue;
        }
        
        // Regular object (not array-like, not missionVision) - use as-is
        (content as Record<string, any>)[fieldKey] = value;
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
  const prefix = getSeoPrefix(pageKey);
  const settings = await getSettings(prefix);

  // Get site name for title fallback
  const siteName = await getSiteName();

  // Fallback title: site.name + " | " + page name
  const fallbackTitle = `${siteName} | ${PAGE_NAMES[pageKey]}`;

  // Fallback description: Hard-coded page description
  const fallbackDescription = PAGE_DESCRIPTIONS[pageKey];

  return {
    title: getSettingValue(settings, getSeoKey(pageKey, "title"), fallbackTitle) as string,
    description: getSettingValue(settings, getSeoKey(pageKey, "description"), fallbackDescription) as string,
  };
}

