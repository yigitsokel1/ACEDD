/**
 * MembershipForm Zod schema validation tests
 * 
 * Updated to use the centralized schema from @/modules/membership/schemas
 * This ensures tests validate the actual schema used in production.
 */

import { describe, it, expect } from "vitest";
import { MembershipApplicationSchema } from "@/modules/membership/schemas";

// Use the centralized schema (single source of truth)
const membershipFormSchema = MembershipApplicationSchema;

describe("MembershipApplicationSchema Validation", () => {
  describe("firstName", () => {
    it("should pass with valid first name (2+ characters)", () => {
      const result = membershipFormSchema.safeParse({
        firstName: "Ahmet",
        lastName: "Yılmaz",
        identityNumber: "12345678950", // Algorithmically valid TC number
        gender: "erkek",
        bloodType: "A_POSITIVE",
        birthPlace: "Istanbul",
        birthDate: "1990-01-01",
        city: "Istanbul",
        phone: "05551234567",
        email: "ahmet@example.com",
        address: "Test address here",
        conditionsAccepted: true,
      });
      expect(result.success).toBe(true);
    });

    it("should fail with single character", () => {
      const result = membershipFormSchema.safeParse({
        firstName: "A",
        lastName: "Yılmaz",
        identityNumber: "12345678950",
        gender: "erkek",
        bloodType: "A_POSITIVE",
        birthPlace: "Istanbul",
        birthDate: "1990-01-01",
        city: "Istanbul",
        phone: "05551234567",
        email: "ahmet@example.com",
        address: "Test address here",
        conditionsAccepted: true,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("en az 2 karakter");
      }
    });

    it("should fail with empty string", () => {
      const result = membershipFormSchema.safeParse({
        firstName: "",
        lastName: "Yılmaz",
        identityNumber: "12345678950",
        gender: "erkek",
        bloodType: "A_POSITIVE",
        birthPlace: "Istanbul",
        birthDate: "1990-01-01",
        city: "Istanbul",
        phone: "05551234567",
        email: "ahmet@example.com",
        address: "Test address here",
        conditionsAccepted: true,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("lastName", () => {
    it("should pass with valid last name (2+ characters)", () => {
      const result = membershipFormSchema.safeParse({
        firstName: "Ahmet",
        lastName: "Yılmaz",
        identityNumber: "12345678950",
        gender: "erkek",
        bloodType: "A_POSITIVE",
        birthPlace: "Istanbul",
        birthDate: "1990-01-01",
        city: "Istanbul",
        phone: "05551234567",
        email: "ahmet@example.com",
        address: "Test address here",
        conditionsAccepted: true,
      });
      expect(result.success).toBe(true);
    });

    it("should fail with single character", () => {
      const result = membershipFormSchema.safeParse({
        firstName: "Ahmet",
        lastName: "Y",
        identityNumber: "12345678950",
        gender: "erkek",
        bloodType: "A_POSITIVE",
        birthPlace: "Istanbul",
        birthDate: "1990-01-01",
        city: "Istanbul",
        phone: "05551234567",
        email: "ahmet@example.com",
        address: "Test address here",
        conditionsAccepted: true,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("en az 2 karakter");
      }
    });
  });

  describe("identityNumber", () => {
    it("should pass with valid TC number", () => {
      const result = membershipFormSchema.safeParse({
        firstName: "Ahmet",
        lastName: "Yılmaz",
        identityNumber: "12345678950",
        gender: "erkek",
        bloodType: "A_POSITIVE",
        birthPlace: "Istanbul",
        birthDate: "1990-01-01",
        city: "Istanbul",
        phone: "05551234567",
        email: "ahmet@example.com",
        address: "Test address here",
        conditionsAccepted: true,
      });
      expect(result.success).toBe(true);
    });

    it("should fail with invalid TC number (wrong length)", () => {
      const result = membershipFormSchema.safeParse({
        firstName: "Ahmet",
        lastName: "Yılmaz",
        identityNumber: "1234567890",
        gender: "erkek",
        bloodType: "A_POSITIVE",
        birthPlace: "Istanbul",
        birthDate: "1990-01-01",
        city: "Istanbul",
        phone: "05551234567",
        email: "ahmet@example.com",
        address: "Test address here",
        conditionsAccepted: true,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("gender", () => {
    it("should pass with valid gender", () => {
      const result = membershipFormSchema.safeParse({
        firstName: "Ahmet",
        lastName: "Yılmaz",
        identityNumber: "12345678950",
        gender: "erkek",
        bloodType: "A_POSITIVE",
        birthPlace: "Istanbul",
        birthDate: "1990-01-01",
        city: "Istanbul",
        phone: "05551234567",
        email: "ahmet@example.com",
        address: "Test address here",
        conditionsAccepted: true,
      });
      expect(result.success).toBe(true);
    });

    it("should fail with invalid gender", () => {
      const result = membershipFormSchema.safeParse({
        firstName: "Ahmet",
        lastName: "Yılmaz",
        identityNumber: "12345678950",
        gender: "invalid",
        bloodType: "A_POSITIVE",
        birthPlace: "Istanbul",
        birthDate: "1990-01-01",
        city: "Istanbul",
        phone: "05551234567",
        email: "ahmet@example.com",
        address: "Test address here",
        conditionsAccepted: true,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("phone", () => {
    it("should pass with valid Turkish phone number", () => {
      const result = membershipFormSchema.safeParse({
        firstName: "Ahmet",
        lastName: "Yılmaz",
        identityNumber: "12345678950",
        gender: "erkek",
        bloodType: "A_POSITIVE",
        birthPlace: "Istanbul",
        birthDate: "1990-01-01",
        city: "Istanbul",
        phone: "05551234567",
        email: "ahmet@example.com",
        address: "Test address here",
        conditionsAccepted: true,
      });
      expect(result.success).toBe(true);
    });

    it("should fail with invalid phone number", () => {
      const result = membershipFormSchema.safeParse({
        firstName: "Ahmet",
        lastName: "Yılmaz",
        identityNumber: "12345678950",
        gender: "erkek",
        bloodType: "A_POSITIVE",
        birthPlace: "Istanbul",
        birthDate: "1990-01-01",
        city: "Istanbul",
        phone: "1234567890",
        email: "ahmet@example.com",
        address: "Test address here",
        conditionsAccepted: true,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("email", () => {
    it("should pass with valid email", () => {
      const result = membershipFormSchema.safeParse({
        firstName: "Ahmet",
        lastName: "Yılmaz",
        identityNumber: "12345678950",
        gender: "erkek",
        bloodType: "A_POSITIVE",
        birthPlace: "Istanbul",
        birthDate: "1990-01-01",
        city: "Istanbul",
        phone: "05551234567",
        email: "ahmet@example.com",
        address: "Test address here",
        conditionsAccepted: true,
      });
      expect(result.success).toBe(true);
    });

    it("should fail with invalid email", () => {
      const result = membershipFormSchema.safeParse({
        firstName: "Ahmet",
        lastName: "Yılmaz",
        identityNumber: "12345678950",
        gender: "erkek",
        bloodType: "A_POSITIVE",
        birthPlace: "Istanbul",
        birthDate: "1990-01-01",
        city: "Istanbul",
        phone: "05551234567",
        email: "invalid-email",
        address: "Test address here",
        conditionsAccepted: true,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("address", () => {
    it("should pass with valid address (10+ characters)", () => {
      const result = membershipFormSchema.safeParse({
        firstName: "Ahmet",
        lastName: "Yılmaz",
        identityNumber: "12345678950",
        gender: "erkek",
        bloodType: "A_POSITIVE",
        birthPlace: "Istanbul",
        birthDate: "1990-01-01",
        city: "Istanbul",
        phone: "05551234567",
        email: "ahmet@example.com",
        address: "Istanbul, Kadıköy, Test Mahallesi",
        conditionsAccepted: true,
      });
      expect(result.success).toBe(true);
    });

    it("should fail with address shorter than 10 characters", () => {
      const result = membershipFormSchema.safeParse({
        firstName: "Ahmet",
        lastName: "Yılmaz",
        identityNumber: "12345678950",
        gender: "erkek",
        bloodType: "A_POSITIVE",
        birthPlace: "Istanbul",
        birthDate: "1990-01-01",
        city: "Istanbul",
        phone: "05551234567",
        email: "ahmet@example.com",
        address: "Short",
        conditionsAccepted: true,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("conditionsAccepted", () => {
    it("should pass when conditionsAccepted is true", () => {
      const result = membershipFormSchema.safeParse({
        firstName: "Ahmet",
        lastName: "Yılmaz",
        identityNumber: "12345678950",
        gender: "erkek",
        bloodType: "A_POSITIVE",
        birthPlace: "Istanbul",
        birthDate: "1990-01-01",
        city: "Istanbul",
        phone: "05551234567",
        email: "ahmet@example.com",
        address: "Test address here",
        conditionsAccepted: true,
      });
      expect(result.success).toBe(true);
    });

    it("should fail when conditionsAccepted is false", () => {
      const result = membershipFormSchema.safeParse({
        firstName: "Ahmet",
        lastName: "Yılmaz",
        identityNumber: "12345678950",
        gender: "erkek",
        bloodType: "A_POSITIVE",
        birthPlace: "Istanbul",
        birthDate: "1990-01-01",
        city: "Istanbul",
        phone: "05551234567",
        email: "ahmet@example.com",
        address: "Test address here",
        conditionsAccepted: false,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("bloodType (required)", () => {
    it("should pass with valid blood type", () => {
      const result = membershipFormSchema.safeParse({
        firstName: "Ahmet",
        lastName: "Yılmaz",
        identityNumber: "12345678950",
        gender: "erkek",
        bloodType: "A_POSITIVE",
        birthPlace: "Istanbul",
        birthDate: "1990-01-01",
        city: "Istanbul",
        phone: "05551234567",
        email: "ahmet@example.com",
        address: "Test address here",
        conditionsAccepted: true,
      });
      expect(result.success).toBe(true);
    });

    it("should pass without bloodType field (optional)", () => {
      // NOTE: bloodType is optional in Prisma schema (BloodType?), so this test verifies it's optional
      const result = membershipFormSchema.safeParse({
        firstName: "Ahmet",
        lastName: "Yılmaz",
        identityNumber: "12345678950",
        gender: "erkek",
        birthPlace: "Istanbul",
        birthDate: "1990-01-01",
        city: "Istanbul",
        phone: "05551234567",
        email: "ahmet@example.com",
        address: "Test address here",
        conditionsAccepted: true,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("complete valid form", () => {
    it("should pass with all required fields valid", () => {
      const result = membershipFormSchema.safeParse({
        firstName: "Ahmet",
        lastName: "Yılmaz",
        identityNumber: "12345678950",
        gender: "erkek",
        bloodType: "A_POSITIVE",
        birthPlace: "Istanbul",
        birthDate: "1990-01-01",
        city: "Istanbul",
        phone: "05551234567",
        email: "ahmet@example.com",
        address: "Istanbul, Kadıköy, Test Mahallesi, No: 123",
        conditionsAccepted: true,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.firstName).toBe("Ahmet");
        expect(result.data.lastName).toBe("Yılmaz");
        expect(result.data.bloodType).toBe("A_POSITIVE");
      }
    });
  });
});
