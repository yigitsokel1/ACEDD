
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

/**
 * Sprint 11: CTA_CONTENT text fields moved to settings
 * Content is now managed via Admin UI (content.events.ctaTitle, content.events.ctaSubtitle, etc.)
 * 
 * Button hrefs remain here as technical data (routing configuration)
 */
export const CTA_BUTTON_HREFS = {
  primary: "#events",
  secondary: "/iletisim",
} as const;