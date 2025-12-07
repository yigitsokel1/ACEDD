import { describe, it, expect } from "vitest";
import {
  hasTag,
  isHonoraryPresident,
  isFoundingPresident,
  isFoundingMember,
  isPastPresident,
  isVolunteer,
  isRegularMember,
  getMemberTags,
  isValidMemberTag,
  validateMemberTags,
  VALID_MEMBER_TAGS,
} from "../memberHelpers";
import type { Member, MemberTag } from "@/lib/types/member";

describe("memberHelpers", () => {
  const baseMember: Member = {
    id: "1",
    firstName: "Test",
    lastName: "User",
    gender: "erkek",
    email: "test@example.com",
    phone: "1234567890",
    birthDate: "1990-01-01T00:00:00.000Z",
    academicLevel: "lisans",
    maritalStatus: "bekar",
    hometown: "Istanbul",
    placeOfBirth: "Istanbul",
    nationality: "TR",
    currentAddress: "Test Address",
    titles: [],
    status: "active",
    membershipDate: "2020-01-01T00:00:00.000Z",
    membershipKind: "MEMBER",
    createdAt: "2020-01-01T00:00:00.000Z",
    updatedAt: "2020-01-01T00:00:00.000Z",
  };

  describe("hasTag", () => {
    it("should return true if member has the tag", () => {
      const member: Member = {
        ...baseMember,
        tags: ["HONORARY_PRESIDENT", "FOUNDING_MEMBER"],
      };
      expect(hasTag(member, "HONORARY_PRESIDENT")).toBe(true);
      expect(hasTag(member, "FOUNDING_MEMBER")).toBe(true);
    });

    it("should return false if member does not have the tag", () => {
      const member: Member = {
        ...baseMember,
        tags: ["HONORARY_PRESIDENT"],
      };
      expect(hasTag(member, "FOUNDING_PRESIDENT")).toBe(false);
    });

    it("should return false if member has no tags", () => {
      const member: Member = {
        ...baseMember,
        tags: undefined,
      };
      expect(hasTag(member, "HONORARY_PRESIDENT")).toBe(false);
    });

    it("should return false if member has empty tags array", () => {
      const member: Member = {
        ...baseMember,
        tags: [],
      };
      expect(hasTag(member, "HONORARY_PRESIDENT")).toBe(false);
    });
  });

  describe("isHonoraryPresident", () => {
    it("should return true if member is honorary president", () => {
      const member: Member = {
        ...baseMember,
        tags: ["HONORARY_PRESIDENT"],
      };
      expect(isHonoraryPresident(member)).toBe(true);
    });

    it("should return false if member is not honorary president", () => {
      const member: Member = {
        ...baseMember,
        tags: ["FOUNDING_PRESIDENT"],
      };
      expect(isHonoraryPresident(member)).toBe(false);
    });
  });

  describe("isFoundingPresident", () => {
    it("should return true if member is founding president", () => {
      const member: Member = {
        ...baseMember,
        tags: ["FOUNDING_PRESIDENT"],
      };
      expect(isFoundingPresident(member)).toBe(true);
    });

    it("should return false if member is not founding president", () => {
      const member: Member = {
        ...baseMember,
        tags: ["HONORARY_PRESIDENT"],
      };
      expect(isFoundingPresident(member)).toBe(false);
    });
  });

  describe("isFoundingMember", () => {
    it("should return true if member is founding member", () => {
      const member: Member = {
        ...baseMember,
        tags: ["FOUNDING_MEMBER"],
      };
      expect(isFoundingMember(member)).toBe(true);
    });

    it("should return false if member is not founding member", () => {
      const member: Member = {
        ...baseMember,
        tags: ["HONORARY_PRESIDENT"],
      };
      expect(isFoundingMember(member)).toBe(false);
    });
  });

  describe("isPastPresident", () => {
    it("should return true if member is past president", () => {
      const member: Member = {
        ...baseMember,
        tags: ["PAST_PRESIDENT"],
      };
      expect(isPastPresident(member)).toBe(true);
    });

    it("should return false if member is not past president", () => {
      const member: Member = {
        ...baseMember,
        tags: ["HONORARY_PRESIDENT"],
      };
      expect(isPastPresident(member)).toBe(false);
    });
  });

  describe("isVolunteer", () => {
    it("should return true if member is volunteer", () => {
      const member: Member = {
        ...baseMember,
        membershipKind: "VOLUNTEER",
      };
      expect(isVolunteer(member)).toBe(true);
    });

    it("should return false if member is not volunteer", () => {
      const member: Member = {
        ...baseMember,
        membershipKind: "MEMBER",
      };
      expect(isVolunteer(member)).toBe(false);
    });
  });

  describe("isRegularMember", () => {
    it("should return true if member is regular member", () => {
      const member: Member = {
        ...baseMember,
        membershipKind: "MEMBER",
      };
      expect(isRegularMember(member)).toBe(true);
    });

    it("should return false if member is not regular member", () => {
      const member: Member = {
        ...baseMember,
        membershipKind: "VOLUNTEER",
      };
      expect(isRegularMember(member)).toBe(false);
    });
  });

  describe("getMemberTags", () => {
    it("should return tags array if member has tags", () => {
      const member: Member = {
        ...baseMember,
        tags: ["HONORARY_PRESIDENT", "FOUNDING_MEMBER"],
      };
      expect(getMemberTags(member)).toEqual(["HONORARY_PRESIDENT", "FOUNDING_MEMBER"]);
    });

    it("should return empty array if member has no tags", () => {
      const member: Member = {
        ...baseMember,
        tags: undefined,
      };
      expect(getMemberTags(member)).toEqual([]);
    });
  });

  // Sprint 6: MemberTag validation tests
  describe("isValidMemberTag", () => {
    it("should return true for valid MemberTag values", () => {
      expect(isValidMemberTag("HONORARY_PRESIDENT")).toBe(true);
      expect(isValidMemberTag("FOUNDING_PRESIDENT")).toBe(true);
      expect(isValidMemberTag("FOUNDING_MEMBER")).toBe(true);
      expect(isValidMemberTag("PAST_PRESIDENT")).toBe(true);
    });

    it("should return false for invalid tag values", () => {
      expect(isValidMemberTag("INVALID_TAG")).toBe(false);
      expect(isValidMemberTag("")).toBe(false);
      expect(isValidMemberTag("honorary_president")).toBe(false); // case sensitive
    });
  });

  describe("validateMemberTags", () => {
    it("should return valid: true for valid tag arrays", () => {
      expect(validateMemberTags(["HONORARY_PRESIDENT", "FOUNDING_MEMBER"])).toEqual({ valid: true });
      expect(validateMemberTags([])).toEqual({ valid: true });
      expect(validateMemberTags(["PAST_PRESIDENT"])).toEqual({ valid: true });
    });

    it("should return valid: false with invalidTags for invalid tag arrays", () => {
      const result = validateMemberTags(["HONORARY_PRESIDENT", "INVALID_TAG", "ANOTHER_INVALID"]);
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.invalidTags).toContain("INVALID_TAG");
        expect(result.invalidTags).toContain("ANOTHER_INVALID");
        expect(result.invalidTags).not.toContain("HONORARY_PRESIDENT");
      }
    });

    it("should return valid: false for non-array input", () => {
      expect(validateMemberTags("not an array")).toEqual({ valid: false, invalidTags: [] });
      expect(validateMemberTags(null)).toEqual({ valid: false, invalidTags: [] });
      expect(validateMemberTags(undefined)).toEqual({ valid: false, invalidTags: [] });
      expect(validateMemberTags({})).toEqual({ valid: false, invalidTags: [] });
    });

    it("should return valid: false for array with non-string values", () => {
      const result = validateMemberTags(["HONORARY_PRESIDENT", 123, null, true]);
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.invalidTags.length).toBeGreaterThan(0);
      }
    });
  });

  describe("VALID_MEMBER_TAGS", () => {
    it("should contain all valid MemberTag values", () => {
      expect(VALID_MEMBER_TAGS).toContain("HONORARY_PRESIDENT");
      expect(VALID_MEMBER_TAGS).toContain("FOUNDING_PRESIDENT");
      expect(VALID_MEMBER_TAGS).toContain("FOUNDING_MEMBER");
      expect(VALID_MEMBER_TAGS).toContain("PAST_PRESIDENT");
      expect(VALID_MEMBER_TAGS.length).toBe(4);
    });
  });
});
