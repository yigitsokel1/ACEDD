import { Calendar, MapPin, Users, Clock, Camera, ExternalLink } from "lucide-react";

/**
 * Event interface - matches Prisma Event model
 * 
 * Note: In Prisma, images, requirements, and benefits are stored as JSON strings.
 * They are parsed to arrays when returned from the API.
 */
export interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  date: string; // ISO 8601 string (DateTime in Prisma)
  location: string;
  images: string[]; // Dataset ID'leri (parsed from JSON string in Prisma)
  featuredImage: string | null; // Dataset ID (optional in Prisma)
  isFeatured: boolean;
  requirements?: string[] | null; // Optional, parsed from JSON string in Prisma
  benefits?: string[] | null; // Optional, parsed from JSON string in Prisma
  createdAt: string; // ISO 8601 string (DateTime in Prisma)
  updatedAt: string; // ISO 8601 string (DateTime in Prisma)
}

// Dummy veriler kaldırıldı - artık Context API kullanılıyor

export const CTA_CONTENT = {
  title: "Etkinliklerimize Katılmak İster misiniz?",
  subtitle: "Güncel etkinliklerimizi takip edin ve size uygun olanlara katılın.",
  primaryButton: {
    text: "Etkinlikleri Görüntüle",
    href: "#events",
  },
  secondaryButton: {
    text: "İletişime Geç",
    href: "/iletisim",
  },
} as const;