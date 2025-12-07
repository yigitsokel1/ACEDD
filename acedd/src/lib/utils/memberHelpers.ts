// Sprint 5: Member helper functions for tags and membership kind
// Sprint 6: BoardMember helper functions for rendering and grouping

import type { Member, MemberTag, BoardMember, BoardRole } from "@/lib/types/member";

/**
 * Check if a member has a specific tag
 */
export function hasTag(member: Member, tag: MemberTag): boolean {
  if (!member.tags || member.tags.length === 0) {
    return false;
  }
  return member.tags.includes(tag);
}

/**
 * Check if member is Honorary President
 */
export function isHonoraryPresident(member: Member): boolean {
  return hasTag(member, "HONORARY_PRESIDENT");
}

/**
 * Check if member is Founding President
 */
export function isFoundingPresident(member: Member): boolean {
  return hasTag(member, "FOUNDING_PRESIDENT");
}

/**
 * Check if member is Founding Member
 */
export function isFoundingMember(member: Member): boolean {
  return hasTag(member, "FOUNDING_MEMBER");
}

/**
 * Check if member is Past President
 */
export function isPastPresident(member: Member): boolean {
  return hasTag(member, "PAST_PRESIDENT");
}

/**
 * Check if member is a volunteer
 */
export function isVolunteer(member: Member): boolean {
  return member.membershipKind === "VOLUNTEER";
}

/**
 * Check if member is a regular member
 */
export function isRegularMember(member: Member): boolean {
  return member.membershipKind === "MEMBER";
}

/**
 * Get all tags for a member
 */
export function getMemberTags(member: Member): MemberTag[] {
  return member.tags || [];
}

/**
 * Valid MemberTag values (single source of truth)
 * Sprint 6: Centralized validation to ensure only legal tags are used
 */
export const VALID_MEMBER_TAGS: readonly MemberTag[] = [
  "HONORARY_PRESIDENT",
  "FOUNDING_PRESIDENT",
  "FOUNDING_MEMBER",
  "PAST_PRESIDENT",
] as const;

/**
 * Validate if a string is a valid MemberTag
 * Sprint 6: Centralized validation helper
 */
export function isValidMemberTag(tag: string): tag is MemberTag {
  return VALID_MEMBER_TAGS.includes(tag as MemberTag);
}

/**
 * Validate an array of tags
 * Returns { valid: true } if all tags are valid, or { valid: false, invalidTags: string[] } if any are invalid
 * Sprint 6: Centralized validation helper for API routes
 */
export function validateMemberTags(tags: unknown): { valid: true } | { valid: false; invalidTags: string[] } {
  if (!Array.isArray(tags)) {
    return { valid: false, invalidTags: [] };
  }

  const invalidTags = tags.filter((tag: unknown) => {
    return typeof tag !== "string" || !isValidMemberTag(tag);
  });

  if (invalidTags.length > 0) {
    return { valid: false, invalidTags: invalidTags as string[] };
  }

  return { valid: true };
}

// ============================================================================
// Sprint 6: BoardMember & Tag Parsing Helpers
// ============================================================================

/**
 * Parse tags from Prisma JSON field (handles both array and JSON string)
 * Sprint 6: Centralized tag parsing logic to avoid duplication
 */
export function parseTags(tags: any): MemberTag[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags as MemberTag[];
  try {
    return JSON.parse(tags as string) as MemberTag[];
  } catch {
    return [];
  }
}

/**
 * Group members by a specific tag
 * Sprint 6: Centralized grouping logic to avoid duplication
 */
export function groupByTag(members: Member[], tag: MemberTag): Member[] {
  return members.filter(member => {
    const tags = parseTags(member.tags);
    return tags.includes(tag);
  });
}

/**
 * Get BoardRole order mapping (single source of truth)
 * Sprint 6: Ensures consistent sorting across admin UI and public UI
 */
export function getBoardRoleOrder(): Record<BoardRole, number> {
  return {
    PRESIDENT: 1,
    VICE_PRESIDENT: 2,
    SECRETARY_GENERAL: 3,
    TREASURER: 4,
    BOARD_MEMBER: 5,
  };
}

/**
 * Sort board members by role (then alphabetically by name)
 * Sprint 6: Centralized sorting logic for consistency
 */
export function sortBoardMembersByRole(boardMembers: BoardMember[]): BoardMember[] {
  const roleOrder = getBoardRoleOrder();
  
  return [...boardMembers].sort((a, b) => {
    // First sort by role
    const roleDiff = (roleOrder[a.role] || 99) - (roleOrder[b.role] || 99);
    if (roleDiff !== 0) return roleDiff;
    
    // If same role, sort alphabetically by name (Turkish locale)
    const nameA = `${a.member.firstName} ${a.member.lastName}`.toLowerCase();
    const nameB = `${b.member.firstName} ${b.member.lastName}`.toLowerCase();
    return nameA.localeCompare(nameB, 'tr');
  });
}

/**
 * Get full name from BoardMember's member
 * Sprint 6: Centralized name extraction to avoid duplication
 */
export function getBoardMemberFullName(boardMember: BoardMember): string {
  return `${boardMember.member.firstName} ${boardMember.member.lastName}`.trim();
}

/**
 * Get Turkish label for BoardRole
 * Sprint 6: Centralized role label mapping
 */
export function getBoardRoleLabel(role: BoardRole): string {
  const roleMap: Record<BoardRole, string> = {
    PRESIDENT: "Başkan",
    VICE_PRESIDENT: "Başkan Yardımcısı",
    SECRETARY_GENERAL: "Genel Sekreter",
    TREASURER: "Sayman",
    BOARD_MEMBER: "Yönetim Kurulu Üyesi",
  };
  return roleMap[role] || role;
}
