/**
 * Convenience Functions for Settings
 * 
 * Sprint 10: High-level convenience functions for common settings
 * Sprint 11: Content & SEO convenience functions added
 * Sprint 12: Using centralized key management
 */

import { getSetting, getSettings, getSettingValue } from "./getSetting";
import { SITE_CONFIG, CONTACT_INFO } from "../constants";
import { DEFAULT_PAGE_CONTENT } from "../constants/defaultContent";
import type { PageIdentifier, PageContent, PageSEO } from "../types/setting";
import { getContentPrefix, getSeoPrefix, getSeoKey } from "./keys";
import { logErrorSecurely } from "../utils/secureLogging";

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
    logErrorSecurely("[Settings][getFaviconUrlWithTimestamp]", error);
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
function normalizeApplicationSteps(value: any): Array<{ id: string; step: number; icon: string; color: string; title: string; description: string }> {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is any => {
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
    .map((item, index) => ({
      id: typeof item.id === "string" && item.id.trim() ? item.id : `step-${item.step || index + 1}`,
      step: item.step,
      icon: typeof item.icon === "string" && item.icon.trim() ? item.icon : getIconByKeyword(item.title, 'step'),
      color: typeof item.color === "string" && item.color.trim() ? item.color : ['blue', 'green', 'purple', 'emerald'][index % 4],
      title: item.title.trim(),
      description: item.description.trim(),
    }));
}

/**
 * Get appropriate icon based on label/title content (keyword matching)
 * Returns SVG path for Heroicons
 */
function getIconByKeyword(text: string, type: 'stat' | 'mission' | 'activity' | 'trust' | 'value' | 'goal' | 'job' | 'step' | 'contact'): string {
  const lowerText = text.toLowerCase();
  
  // Stats icons
  if (type === 'stat') {
    if (lowerText.includes('bursiyer') || lowerText.includes('öğrenci') || lowerText.includes('üye')) {
      return "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"; // users
    }
    if (lowerText.includes('burs') || lowerText.includes('para') || lowerText.includes('dağıt')) {
      return "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"; // heart
    }
    if (lowerText.includes('deneyim') || lowerText.includes('yıl') || lowerText.includes('süre')) {
      return "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"; // calendar
    }
    if (lowerText.includes('başarı') || lowerText.includes('oran') || lowerText.includes('%')) {
      return "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"; // star
    }
    return "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"; // trending up (default)
  }
  
  // Mission/Activity icons
  if (type === 'mission' || type === 'activity') {
    if (lowerText.includes('burs') || lowerText.includes('destek') || lowerText.includes('yardım')) {
      return "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"; // heart
    }
    if (lowerText.includes('sosyal') || lowerText.includes('etkinlik') || lowerText.includes('topluluk')) {
      return "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"; // users
    }
    if (lowerText.includes('eğitim') || lowerText.includes('öğren') || lowerText.includes('bilgi') || lowerText.includes('bir araya')) {
      return "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"; // book/education
    }
    if (lowerText.includes('farkındalık') || lowerText.includes('bilinç') || lowerText.includes('fikir')) {
      return "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"; // lightbulb
    }
    if (lowerText.includes('kültür') || lowerText.includes('sanat') || lowerText.includes('gezi')) {
      return "M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"; // presentation/event
    }
    return "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"; // check-circle (default)
  }
  
  // Trust indicator icons
  if (type === 'trust') {
    if (lowerText.includes('güven') || lowerText.includes('güvenilir') || lowerText.includes('emniy')) {
      return "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"; // shield-check
    }
    if (lowerText.includes('hızlı') || lowerText.includes('çabuk') || lowerText.includes('sürat')) {
      return "M13 10V3L4 14h7v7l9-11h-7z"; // lightning/zap
    }
    if (lowerText.includes('şeffaf') || lowerText.includes('açık') || lowerText.includes('görünür')) {
      return "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"; // eye
    }
    if (lowerText.includes('topluluk') || lowerText.includes('birlik') || lowerText.includes('grup')) {
      return "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"; // users
    }
    return "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"; // shield (default)
  }
  
  // Values icons (Değerler)
  if (type === 'value') {
    if (lowerText.includes('eğitim') || lowerText.includes('öğren') || lowerText.includes('erişim')) {
      return "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"; // book-open
    }
    if (lowerText.includes('gelişim') || lowerText.includes('kapsamlı') || lowerText.includes('büyü')) {
      return "M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"; // hand-raised/growing
    }
    if (lowerText.includes('toplum') || lowerText.includes('katılım') || lowerText.includes('birlik')) {
      return "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"; // users
    }
    if (lowerText.includes('farkındalık') || lowerText.includes('bilinç') || lowerText.includes('yaratma')) {
      return "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"; // lightbulb
    }
    return "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"; // book (default)
  }
  
  // Goals icons (Hedefler)
  if (type === 'goal') {
    if (lowerText.includes('burs') || lowerText.includes('imkan') || lowerText.includes('maddi')) {
      return "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"; // heart
    }
    if (lowerText.includes('sosyal') || lowerText.includes('kültür') || lowerText.includes('etkinlik')) {
      return "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"; // users
    }
    if (lowerText.includes('gönüllü') || lowerText.includes('bir araya') || lowerText.includes('işbirlik')) {
      return "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"; // users/group
    }
    if (lowerText.includes('farkındalık') || lowerText.includes('bilinç') || lowerText.includes('toplumsal')) {
      return "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"; // lightbulb
    }
    return "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"; // check-circle (default)
  }
  
  // Job descriptions icons (Görev Tanımları)
  if (type === 'job') {
    if (lowerText.includes('genel kurul') || lowerText.includes('üye')) {
      return "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"; // user-group
    }
    if (lowerText.includes('yönetim') || lowerText.includes('kurul')) {
      return "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"; // office-building
    }
    if (lowerText.includes('denetim') || lowerText.includes('kontrol')) {
      return "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"; // search/magnifying-glass
    }
    if (lowerText.includes('başkan') || lowerText.includes('lider')) {
      return "M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"; // user-circle
    }
    if (lowerText.includes('sekreter') || lowerText.includes('yazı')) {
      return "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"; // pencil
    }
    if (lowerText.includes('sayman') || lowerText.includes('mali') || lowerText.includes('gelir')) {
      return "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"; // currency-dollar
    }
    if (lowerText.includes('komisyon') || lowerText.includes('değerlend')) {
      return "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"; // clipboard-list
    }
    if (lowerText.includes('koordinatör') || lowerText.includes('proje') || lowerText.includes('organize')) {
      return "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"; // clipboard
    }
    if (lowerText.includes('takip') || lowerText.includes('izle') || lowerText.includes('rapor')) {
      return "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"; // chart-bar
    }
    if (lowerText.includes('eğitmen') || lowerText.includes('öğret')) {
      return "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"; // academic-cap/book
    }
    return "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"; // briefcase (default)
  }
  
  // Application Step icons
  if (type === 'step') {
    if (lowerText.includes('form') || lowerText.includes('doldur') || lowerText.includes('başvur')) {
      return "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 12h6M9 16h6M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"; // clipboard-list
    }
    if (lowerText.includes('belge') || lowerText.includes('yükle') || lowerText.includes('upload')) {
      return "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"; // upload
    }
    if (lowerText.includes('değerlendirme') || lowerText.includes('incele') || lowerText.includes('kontrol')) {
      return "M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM21 21l-4.35-4.35"; // search
    }
    if (lowerText.includes('sonuç') || lowerText.includes('tamamla') || lowerText.includes('bitir')) {
      return "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3"; // check-circle
    }
    return "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"; // check-circle (default)
  }
  
  // Contact icons
  if (type === 'contact') {
    if (lowerText.includes('adres') || lowerText.includes('konum') || lowerText.includes('yer')) {
      return "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"; // map-pin
    }
    if (lowerText.includes('telefon') || lowerText.includes('ara') || lowerText.includes('phone')) {
      return "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"; // phone
    }
    if (lowerText.includes('email') || lowerText.includes('posta') || lowerText.includes('mail')) {
      return "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6"; // mail
    }
    return "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"; // map-pin (default)
  }
  
  return "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"; // generic check-circle
}

/**
 * Normalize stats array (home page)
 * Validates: id, icon, value, label, color (all strings)
 * Provides defaults for missing technical fields (id, icon, color)
 */
function normalizeStatsArray(value: any): Array<{ id: string; icon: string; value: string; label: string; color: string }> {
  if (!Array.isArray(value)) return [];
  
  // Color cycle for stats
  const colors: Array<'blue' | 'amber' | 'emerald' | 'rose'> = ['blue', 'amber', 'emerald', 'rose'];
  
  return value
    .filter((item): item is any => {
      // Only require value and label - the user-facing fields
      return (
        typeof item === "object" &&
        item !== null &&
        typeof item.value === "string" &&
        item.value.trim().length > 0 &&
        typeof item.label === "string" &&
        item.label.trim().length > 0
      );
    })
    .map((item, index) => ({
      id: typeof item.id === "string" && item.id.trim() ? item.id : `stat-${index}`,
      icon: typeof item.icon === "string" && item.icon.trim() ? item.icon : getIconByKeyword(item.label, 'stat'),
      value: item.value.trim(),
      label: item.label.trim(),
      color: typeof item.color === "string" && item.color.trim() ? item.color : colors[index % colors.length],
    }));
}

/**
 * Normalize missions/activities array (home page)
 * Validates: id, icon, title, description, color (all strings)
 * Provides defaults for missing technical fields (id, icon, color)
 */
function normalizeMissionsActivitiesArray(value: any): Array<{ id: string; icon: string; title: string; description: string; color: string }> {
  if (!Array.isArray(value)) return [];
  
  // Color cycle for missions/activities
  const colors: Array<'blue' | 'amber' | 'emerald' | 'rose'> = ['blue', 'amber', 'emerald', 'rose'];
  
  return value
    .filter((item): item is any => {
      // Only require title and description - the user-facing fields
      return (
        typeof item === "object" &&
        item !== null &&
        typeof item.title === "string" &&
        item.title.trim().length > 0 &&
        typeof item.description === "string" &&
        item.description.trim().length > 0
      );
    })
    .map((item, index) => ({
      id: typeof item.id === "string" && item.id.trim() ? item.id : `mission-${index}`,
      icon: typeof item.icon === "string" && item.icon.trim() ? item.icon : getIconByKeyword(item.title, 'mission'),
      title: item.title.trim(),
      description: item.description.trim(),
      color: typeof item.color === "string" && item.color.trim() ? item.color : colors[index % colors.length],
    }));
}

/**
 * Normalize trustIndicators array (home page)
 * Validates: id, icon, label (all strings)
 * Provides defaults for missing technical fields (id, icon)
 */
function normalizeTrustIndicatorsArray(value: any): Array<{ id: string; icon: string; label: string }> {
  if (!Array.isArray(value)) return [];
  
  return value
    .filter((item): item is any => {
      // Only require label - the user-facing field
      return (
        typeof item === "object" &&
        item !== null &&
        typeof item.label === "string" &&
        item.label.trim().length > 0
      );
    })
    .map((item, index) => ({
      id: typeof item.id === "string" && item.id.trim() ? item.id : `trust-${index}`,
      icon: typeof item.icon === "string" && item.icon.trim() ? item.icon : getIconByKeyword(item.label, 'trust'),
      label: item.label.trim(),
    }));
}

/**
 * Normalize values array (about page - Değerler)
 * Validates: title, description
 * Provides defaults for icon and color based on content
 */
function normalizeValuesArray(value: any): Array<{ id: string; icon: string; title: string; description: string; color: string }> {
  if (!Array.isArray(value)) return [];
  
  // All values cards use indigo color for consistency
  const defaultColor = 'indigo';
  
  return value
    .filter((item): item is any => {
      return (
        typeof item === "object" &&
        item !== null &&
        typeof item.title === "string" &&
        item.title.trim().length > 0 &&
        typeof item.description === "string" &&
        item.description.trim().length > 0
      );
    })
    .map((item, index) => ({
      id: typeof item.id === "string" && item.id.trim() ? item.id : `value-${index}`,
      icon: typeof item.icon === "string" && item.icon.trim() ? item.icon : getIconByKeyword(item.title, 'value'),
      title: item.title.trim(),
      description: item.description.trim(),
      color: defaultColor, // Always use indigo for consistency - ignore stored color
    }));
}

/**
 * Normalize goals array (about page - Hedefler ve Faaliyetler)
 * Validates: title, description
 * Provides defaults for icon and color based on content
 */
function normalizeGoalsArray(value: any): Array<{ id: string; icon: string; title: string; description: string; color: string }> {
  if (!Array.isArray(value)) return [];
  
  // All goals cards use emerald color for consistency
  const defaultColor = 'emerald';
  
  return value
    .filter((item): item is any => {
      return (
        typeof item === "object" &&
        item !== null &&
        typeof item.title === "string" &&
        item.title.trim().length > 0 &&
        typeof item.description === "string" &&
        item.description.trim().length > 0
      );
    })
    .map((item, index) => ({
      id: typeof item.id === "string" && item.id.trim() ? item.id : `goal-${index}`,
      icon: typeof item.icon === "string" && item.icon.trim() ? item.icon : getIconByKeyword(item.title, 'goal'),
      title: item.title.trim(),
      description: item.description.trim(),
      color: typeof item.color === "string" && item.color.trim() ? item.color : defaultColor,
    }));
}

/**
 * Get color for job description based on hierarchical level
 * HTML'deki renk şemasına uygun olarak
 */
function getJobDescriptionColor(title: string): 'purple' | 'blue' | 'green' | 'orange' | 'indigo' | 'pink' {
  const lowerTitle = title.toLowerCase();
  
  // Level 1: Genel Kurul (purple)
  if (lowerTitle.includes('genel kurul')) {
    return 'purple';
  }
  
  // Level 2: Yönetim Kurulu, Denetim Kurulu (blue)
  if (lowerTitle.includes('yönetim kurulu') || lowerTitle.includes('denetim kurulu')) {
    return 'blue';
  }
  
  // Level 3: Dernek Başkanı (green)
  if (lowerTitle.includes('başkan') && !lowerTitle.includes('yardımcı')) {
    return 'green';
  }
  
  // Level 4: Genel Sekreter, Sayman, Komisyon, Koordinatör (orange)
  if (lowerTitle.includes('sekreter') || lowerTitle.includes('sayman') || 
      lowerTitle.includes('komisyon') || lowerTitle.includes('koordinatör')) {
    return 'orange';
  }
  
  // Level 5: Üye İlişkileri, Eğitim Koordinatörü, Takip Ekibi (indigo)
  if (lowerTitle.includes('üye') || lowerTitle.includes('eğitim') || 
      lowerTitle.includes('takip') || lowerTitle.includes('bursiyer')) {
    return 'indigo';
  }
  
  // Level 6: Gönüllü Eğitmenler (pink)
  if (lowerTitle.includes('gönüllü') || lowerTitle.includes('eğitmen')) {
    return 'pink';
  }
  
  // Default: blue
  return 'blue';
}

/**
 * Normalize jobDescriptions array (about page - Görev Tanımları)
 * Validates: title, description
 * Provides defaults for icon and color based on content
 */
function normalizeJobDescriptionsArray(value: any): Array<{ id: string; icon: string; title: string; description: string; color: string }> {
  if (!Array.isArray(value)) return [];
  
  return value
    .filter((item): item is any => {
      return (
        typeof item === "object" &&
        item !== null &&
        typeof item.title === "string" &&
        item.title.trim().length > 0 &&
        typeof item.description === "string" &&
        item.description.trim().length > 0
      );
    })
    .map((item, index) => ({
      id: typeof item.id === "string" && item.id.trim() ? item.id : `job-${index}`,
      icon: typeof item.icon === "string" && item.icon.trim() ? item.icon : getIconByKeyword(item.title, 'job'),
      title: item.title.trim(),
      description: item.description.trim(),
      color: typeof item.color === "string" && item.color.trim() ? item.color : getJobDescriptionColor(item.title),
    }));
}

/**
 * Normalize bankAccounts array (donation page)
 * Validates: id, icon, color, currency, bank, accountName, iban
 */
function normalizeBankAccountsArray(value: any): Array<{ id: string; icon: string; color: string; currency: string; bank: string; accountName: string; iban: string }> {
  if (!Array.isArray(value)) return [];
  const colors: Array<'blue' | 'green' | 'indigo'> = ['blue', 'green', 'indigo'];
  
  return value
    .filter((item): item is any => {
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
    .map((item, index) => ({
      id: typeof item.id === "string" && item.id.trim() ? item.id : `bank-${index}`,
      icon: typeof item.icon === "string" && item.icon.trim() ? item.icon : "M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2M2 16v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2M6 12h.01M10 12h.01M14 12h.01M18 12h.01M7 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM11 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM15 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM19 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0z", // banknote
      color: typeof item.color === "string" && item.color.trim() ? item.color : colors[index % colors.length],
      currency: item.currency.trim(),
      bank: item.bank.trim(),
      accountName: item.accountName.trim(),
      iban: item.iban.trim(),
    }));
}

/**
 * Normalize contactInfoItems array (contact page)
 * Validates: id, icon, color, title, description
 */
function normalizeContactInfoItems(value: any): Array<{ id: string; icon: string; color: string; title: string; description: string }> {
  if (!Array.isArray(value)) return [];
  const colors: Array<'blue' | 'green' | 'purple'> = ['blue', 'green', 'purple'];
  
  return value
    .filter((item): item is any => {
      return (
        typeof item === "object" &&
        item !== null &&
        typeof item.title === "string" &&
        item.title.trim().length > 0
      );
    })
    .map((item, index) => ({
      id: typeof item.id === "string" && item.id.trim() ? item.id : `contact-${index}`,
      icon: typeof item.icon === "string" && item.icon.trim() ? item.icon : getIconByKeyword(item.title, 'contact'),
      color: typeof item.color === "string" && item.color.trim() ? item.color : colors[index % colors.length],
      title: item.title.trim(),
      description: typeof item.description === "string" ? item.description.trim() : "",
    }));
}

/**
 * Normalize missionVision object (about page)
 * Validates: mission and vision objects with id, icon, color, title and description
 */
function normalizeMissionVision(value: any): { mission: { id: string; icon: string; color: string; title: string; description: string }; vision: { id: string; icon: string; color: string; title: string; description: string } } | undefined {
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
        id: typeof mission.id === "string" && mission.id.trim() ? mission.id : "mission-1",
        icon: typeof mission.icon === "string" && mission.icon.trim() ? mission.icon : "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z", // target
        color: typeof mission.color === "string" && mission.color.trim() ? mission.color : "blue",
        title: mission.title.trim(),
        description: mission.description.trim(),
      },
      vision: {
        id: typeof vision.id === "string" && vision.id.trim() ? vision.id : "vision-1",
        icon: typeof vision.icon === "string" && vision.icon.trim() ? vision.icon : "M12 15l-3.5 1.85 0.67-3.9L6.34 10.2l3.94-0.57L12 6l1.72 3.63 3.94 0.57-2.83 2.75 0.67 3.9L12 15zm0-13C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z", // award
        color: typeof vision.color === "string" && vision.color.trim() ? vision.color : "indigo",
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

  // Start with default content for this page (from defaultContent.ts)
  // Settings will override these defaults if they exist
  const defaultContent = DEFAULT_PAGE_CONTENT[pageKey] || {};
  const content: PageContent = { ...defaultContent };

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
        } else if (fieldKey === "values") {
          normalizedValue = normalizeValuesArray(value);
        } else if (fieldKey === "goals") {
          normalizedValue = normalizeGoalsArray(value);
        } else if (fieldKey === "jobDescriptions") {
          normalizedValue = normalizeJobDescriptionsArray(value);
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
            } else if (fieldKey === "values") {
              normalizedValue = normalizeValuesArray(arrayValue);
            } else if (fieldKey === "goals") {
              normalizedValue = normalizeGoalsArray(arrayValue);
            } else if (fieldKey === "jobDescriptions") {
              normalizedValue = normalizeJobDescriptionsArray(arrayValue);
            } else if (fieldKey === "bankAccounts") {
              normalizedValue = normalizeBankAccountsArray(arrayValue);
            } else if (fieldKey === "contactInfoItems") {
              normalizedValue = normalizeContactInfoItems(arrayValue);
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

