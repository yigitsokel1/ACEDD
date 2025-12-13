/**
 * File Lifecycle Constants
 * 
 * Sprint 18 - B2: Centralized entity types and file sources
 * 
 * This prevents string literal typos and makes it easier to add new entity types.
 */

/**
 * Entity types that can have associated files
 */
export const ENTITY_TYPE = {
  EVENT: "EVENT",
  MEMBER_CV: "MEMBER_CV",
  FAVICON: "FAVICON",
  LOGO: "LOGO",
} as const;

/**
 * File source identifiers (stored in Dataset.source field)
 */
export const FILE_SOURCE = {
  EVENT_UPLOAD: "event-upload",
  MEMBER_CV: "member-cv",
  FAVICON: "favicon",
  LOGO: "logo",
  GENERAL: "general",
} as const;

/**
 * Type exports for type-safe usage
 */
export type EntityType = typeof ENTITY_TYPE[keyof typeof ENTITY_TYPE];
export type FileSource = typeof FILE_SOURCE[keyof typeof FILE_SOURCE];

