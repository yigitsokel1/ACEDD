// Site genelinde kullanılacak sabitler
// Site info, contact info ve social media default'ları defaultContent.ts'den gelir
import { DEFAULT_SITE_INFO, DEFAULT_CONTACT_INFO, DEFAULT_SOCIAL_MEDIA } from "./defaultContent";

// Helper function to clean SQL export format strings (remove quotes if present)
const cleanString = (str: string): string => {
  if (!str) return "";
  return str.replace(/^"|"$/g, "");
};

// SITE_CONFIG - defaultContent.ts'den türetilmiş (backward compatibility için)
export const SITE_CONFIG = {
  name: "Acıpayam ve Çevresi Eğitimi Destekleme Derneği", // Full name (not in DB, but used in UI)
  shortName: cleanString(DEFAULT_SITE_INFO["site.name"] || "ACEDD"),
  description: cleanString(DEFAULT_SITE_INFO["site.description"] || ""),
  url: "https://acedd.org",
  ogImage: "/og-image.jpg",
  links: {
    twitter: cleanString(DEFAULT_SOCIAL_MEDIA["social.twitter"] || ""),
    facebook: cleanString(DEFAULT_SOCIAL_MEDIA["social.facebook"] || ""),
    instagram: cleanString(DEFAULT_SOCIAL_MEDIA["social.instagram"] || ""),
    linkedin: cleanString(DEFAULT_SOCIAL_MEDIA["social.linkedin"] || ""),
  },
} as const;

export const NAVIGATION_ITEMS = [
  { name: "Ana Sayfa", href: "/" },
  { name: "Hakkımızda", href: "/hakkimizda" },
  { name: "Etkinlikler", href: "/etkinlikler" },
  { name: "Burs Başvurusu", href: "/burs-basvuru" },
  { name: "İletişim", href: "/iletisim" },
] as const;

export const ADMIN_NAVIGATION_ITEMS = [
  { name: "Dashboard", href: "/admin" },
  { name: "Burs Başvuruları", href: "/admin/burs-basvurulari" },
  { name: "Üyeler", href: "/admin/uyeler" },
  { name: "Etkinlikler", href: "/admin/etkinlikler" },
  { name: "Duyurular", href: "/admin/duyurular" },
  { name: "Ayarlar", href: "/admin/ayarlar" },
] as const;

// SOCIAL_LINKS - defaultContent.ts'den türetilmiş (backward compatibility için)
export const SOCIAL_LINKS = {
  facebook: cleanString(DEFAULT_SOCIAL_MEDIA["social.facebook"] || ""),
  twitter: cleanString(DEFAULT_SOCIAL_MEDIA["social.twitter"] || ""),
  instagram: cleanString(DEFAULT_SOCIAL_MEDIA["social.instagram"] || ""),
  linkedin: cleanString(DEFAULT_SOCIAL_MEDIA["social.linkedin"] || ""),
  youtube: cleanString(DEFAULT_SOCIAL_MEDIA["social.youtube"] || ""),
} as const;

// CONTACT_INFO - defaultContent.ts'den türetilmiş (backward compatibility için)
export const CONTACT_INFO = {
  address: cleanString(DEFAULT_CONTACT_INFO["contact.address"] || ""),
  phone: cleanString(DEFAULT_CONTACT_INFO["contact.phone"] || ""),
  email: cleanString(DEFAULT_CONTACT_INFO["contact.email"] || ""),
  workingHours: "Pazartesi - Cuma: 09:00 - 17:00",
} as const;

export const ROUTES = {
  HOME: "/",
  ABOUT: "/hakkimizda",
  EVENTS: "/etkinlikler",
  CONTACT: "/iletisim",
  SCHOLARSHIP: "/burs-basvuru",
  ADMIN: "/admin",
} as const;
