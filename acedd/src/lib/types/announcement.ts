/**
 * Announcement category types.
 * Supports predefined categories and custom string values for flexibility.
 */
export type AnnouncementCategory =
  | "general"
  | "scholarship"
  | "event"
  | "system"
  | string; // Allow future/custom categories

/**
 * Announcement interface matching Prisma model.
 * Dates are represented as ISO 8601 strings for frontend compatibility.
 */
export interface Announcement {
  id: string;
  title: string;
  summary?: string | null;
  content: string;
  category: AnnouncementCategory;
  startsAt?: string | null; // ISO 8601 string
  endsAt?: string | null; // ISO 8601 string
  isPinned: boolean;
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
}

/**
 * Request body for creating a new announcement.
 */
export interface CreateAnnouncementRequest {
  title: string;
  summary?: string | null;
  content: string;
  category: AnnouncementCategory;
  startsAt?: string | null; // ISO 8601 string
  endsAt?: string | null; // ISO 8601 string
  isPinned?: boolean;
}

/**
 * Request body for updating an existing announcement.
 * All fields are optional (partial update).
 */
export interface UpdateAnnouncementRequest {
  title?: string;
  summary?: string | null;
  content?: string;
  category?: AnnouncementCategory;
  startsAt?: string | null; // ISO 8601 string
  endsAt?: string | null; // ISO 8601 string
  isPinned?: boolean;
}

/**
 * Query parameters for GET /api/announcements
 */
export interface GetAnnouncementsQuery {
  category?: string; // Filter by category
  pinned?: "true" | "false"; // Filter by pinned status
  activeOnly?: "true" | "false"; // Filter only active announcements (based on startsAt/endsAt)
}
