/**
 * Convenience Functions for Settings
 * 
 * Sprint 10: High-level convenience functions for common settings
 */

import { getSetting, getSettings, getSettingValue } from "./getSetting";
import { SITE_CONFIG, CONTACT_INFO } from "../constants";

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

