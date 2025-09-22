import { Calendar, MapPin, Users, Clock, Camera, ExternalLink } from "lucide-react";

export interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  date: string;
  location: string;
  images: string[]; // Dataset ID'leri
  featuredImage: string; // Dataset ID
  isFeatured: boolean;
  requirements?: string[];
  benefits?: string[];
  createdAt: string;
  updatedAt: string;
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