// Site genelinde kullanılacak sabitler
export const SITE_CONFIG = {
  name: "Acıpayam ve Çevresi Eğitimi Destekleme Derneği",
  shortName: "ACEDD",
  description: "Acıpayam ve çevresindeki öğrencilerin eğitimlerini desteklemek için kurulmuş dernek",
  url: "https://acedd.org",
  ogImage: "/og-image.jpg",
  links: {
    twitter: "https://twitter.com/acedd",
    facebook: "https://facebook.com/acedd",
    instagram: "https://instagram.com/acedd",
    linkedin: "https://linkedin.com/company/acedd",
  },
} as const;

export const NAVIGATION_ITEMS = [
  { name: "Ana Sayfa", href: "/" },
  { name: "Hakkımızda", href: "/hakkimizda" },
  { name: "Hizmetlerimiz", href: "/hizmetler" },
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

export const SOCIAL_LINKS = {
  facebook: "https://facebook.com/acedd",
  twitter: "https://twitter.com/acedd",
  instagram: "https://instagram.com/acedd",
  linkedin: "https://linkedin.com/company/acedd",
  youtube: "https://youtube.com/@acedd",
} as const;

export const CONTACT_INFO = {
  address: "Acıpayam, Denizli, Türkiye",
  phone: "+90 258 XXX XX XX",
  email: "info@acedd.org",
  workingHours: "Pazartesi - Cuma: 09:00 - 17:00",
} as const;
