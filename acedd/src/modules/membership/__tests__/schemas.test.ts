/**
 * Membership Application Zod Schema Tests
 * 
 * Sprint 18 - Block C: Test coverage for membership schema (≥90%)
 * 
 * Tests cover:
 * - Passing valid data
 * - Failing invalid data
 * - Edge cases
 * - Turkish error messages
 */

import { describe, it, expect } from "vitest";
import {
  MembershipApplicationSchema,
} from "../schemas";

describe("MembershipApplicationSchema", () => {
  it("should pass with complete valid data", () => {
    const validApplication = {
      firstName: "Ahmet",
      lastName: "Yılmaz",
      identityNumber: "12345678950",
      gender: "erkek" as const,
      bloodType: "A_POSITIVE" as const,
      birthPlace: "Ankara",
      birthDate: "2000-01-15",
      city: "Ankara",
      phone: "05551234567",
      email: "ahmet@example.com",
      address: "Ankara, Çankaya, Kızılay Mahallesi, Atatürk Bulvarı No: 123",
      conditionsAccepted: true,
    };

    const result = MembershipApplicationSchema.safeParse(validApplication);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.firstName).toBe("Ahmet");
      expect(result.data.lastName).toBe("Yılmaz");
      expect(result.data.identityNumber).toBe("12345678950");
      expect(result.data.gender).toBe("erkek");
      expect(result.data.bloodType).toBe("A_POSITIVE");
      expect(result.data.email).toBe("ahmet@example.com");
    }
  });

  it("should pass with optional bloodType as null", () => {
    const validApplication = {
      firstName: "Ayşe",
      lastName: "Demir",
      identityNumber: "12345678950", // Valid TC kimlik number (used in other tests)
      gender: "kadın" as const,
      bloodType: null, // Optional field (nullish)
      birthPlace: "Istanbul",
      birthDate: "1995-05-20",
      city: "Istanbul",
      phone: "05559876543",
      email: "ayse@example.com",
      address: "Istanbul, Beşiktaş, Test Mahallesi No: 45",
      conditionsAccepted: true,
    };

    const result = MembershipApplicationSchema.safeParse(validApplication);
    expect(result.success).toBe(true);
    if (result.success) {
      // union with null allows null and preserves it
      expect(result.data.bloodType).toBeNull();
    }
  });

  it("should fail with missing required firstName", () => {
    const invalidApplication = {
      lastName: "Yılmaz",
      identityNumber: "12345678950",
      gender: "erkek",
      birthPlace: "Ankara",
      birthDate: "2000-01-15",
      city: "Ankara",
      phone: "05551234567",
      email: "ahmet@example.com",
      address: "Ankara, Çankaya",
      conditionsAccepted: true,
    };

    const result = MembershipApplicationSchema.safeParse(invalidApplication);
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.errors.find((e) => e.path.includes("firstName"));
      expect(error).toBeDefined();
    }
  });

  it("should fail with invalid email format", () => {
    const invalidApplication = {
      firstName: "Ahmet",
      lastName: "Yılmaz",
      identityNumber: "12345678950",
      gender: "erkek",
      birthPlace: "Ankara",
      birthDate: "2000-01-15",
      city: "Ankara",
      phone: "05551234567",
      email: "invalid-email", // Invalid email
      address: "Ankara, Çankaya",
      conditionsAccepted: true,
    };

    const result = MembershipApplicationSchema.safeParse(invalidApplication);
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.errors.find((e) => e.path.includes("email"));
      expect(error).toBeDefined();
      expect(error?.message).toMatch(/e-posta|email/i);
    }
  });

  it("should fail with invalid TC identity number (not 11 digits)", () => {
    const invalidApplication = {
      firstName: "Ahmet",
      lastName: "Yılmaz",
      identityNumber: "1234567890", // 10 digits (should be 11)
      gender: "erkek",
      birthPlace: "Ankara",
      birthDate: "2000-01-15",
      city: "Ankara",
      phone: "05551234567",
      email: "ahmet@example.com",
      address: "Ankara, Çankaya",
      conditionsAccepted: true,
    };

    const result = MembershipApplicationSchema.safeParse(invalidApplication);
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.errors.find((e) => e.path.includes("identityNumber"));
      expect(error).toBeDefined();
      expect(error?.message).toMatch(/TC|11/i);
    }
  });

  it("should fail with invalid phone number", () => {
    const invalidApplication = {
      firstName: "Ahmet",
      lastName: "Yılmaz",
      identityNumber: "12345678950",
      gender: "erkek",
      birthPlace: "Ankara",
      birthDate: "2000-01-15",
      city: "Ankara",
      phone: "12345", // Too short
      email: "ahmet@example.com",
      address: "Ankara, Çankaya",
      conditionsAccepted: true,
    };

    const result = MembershipApplicationSchema.safeParse(invalidApplication);
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.errors.find((e) => e.path.includes("phone"));
      expect(error).toBeDefined();
    }
  });

  it("should fail with short address (< 10 characters)", () => {
    const invalidApplication = {
      firstName: "Ahmet",
      lastName: "Yılmaz",
      identityNumber: "12345678950",
      gender: "erkek",
      birthPlace: "Ankara",
      birthDate: "2000-01-15",
      city: "Ankara",
      phone: "05551234567",
      email: "ahmet@example.com",
      address: "Short", // Too short
      conditionsAccepted: true,
    };

    const result = MembershipApplicationSchema.safeParse(invalidApplication);
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.errors.find((e) => e.path.includes("address"));
      expect(error).toBeDefined();
      expect(error?.message).toMatch(/10/i);
    }
  });

  it("should fail with conditionsAccepted as false", () => {
    const invalidApplication = {
      firstName: "Ahmet",
      lastName: "Yılmaz",
      identityNumber: "12345678950",
      gender: "erkek",
      birthPlace: "Ankara",
      birthDate: "2000-01-15",
      city: "Ankara",
      phone: "05551234567",
      email: "ahmet@example.com",
      address: "Ankara, Çankaya, Test Mahallesi No: 123",
      conditionsAccepted: false, // Must be true
    };

    const result = MembershipApplicationSchema.safeParse(invalidApplication);
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.errors.find((e) => e.path.includes("conditionsAccepted"));
      expect(error).toBeDefined();
    }
  });

  it("should fail with invalid gender", () => {
    const invalidApplication = {
      firstName: "Ahmet",
      lastName: "Yılmaz",
      identityNumber: "12345678950",
      gender: "invalid", // Invalid gender
      birthPlace: "Ankara",
      birthDate: "2000-01-15",
      city: "Ankara",
      phone: "05551234567",
      email: "ahmet@example.com",
      address: "Ankara, Çankaya",
      conditionsAccepted: true,
    };

    const result = MembershipApplicationSchema.safeParse(invalidApplication);
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.errors.find((e) => e.path.includes("gender"));
      expect(error).toBeDefined();
    }
  });

  it("should fail with invalid bloodType", () => {
    const invalidApplication = {
      firstName: "Ahmet",
      lastName: "Yılmaz",
      identityNumber: "12345678950",
      gender: "erkek",
      bloodType: "INVALID_TYPE", // Invalid blood type
      birthPlace: "Ankara",
      birthDate: "2000-01-15",
      city: "Ankara",
      phone: "05551234567",
      email: "ahmet@example.com",
      address: "Ankara, Çankaya",
      conditionsAccepted: true,
    };

    const result = MembershipApplicationSchema.safeParse(invalidApplication);
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.errors.find((e) => e.path.includes("bloodType"));
      expect(error).toBeDefined();
    }
  });

  it("should accept valid bloodType values", () => {
    const validBloodTypes = [
      "A_POSITIVE",
      "A_NEGATIVE",
      "B_POSITIVE",
      "B_NEGATIVE",
      "AB_POSITIVE",
      "AB_NEGATIVE",
      "O_POSITIVE",
      "O_NEGATIVE",
    ];

    for (const bloodType of validBloodTypes) {
      const validApplication = {
        firstName: "Ahmet",
        lastName: "Yılmaz",
        identityNumber: "12345678950",
        gender: "erkek" as const,
        bloodType: bloodType as any,
        birthPlace: "Ankara",
        birthDate: "2000-01-15",
        city: "Ankara",
        phone: "05551234567",
        email: "ahmet@example.com",
        address: "Ankara, Çankaya, Test Mahallesi No: 123",
        conditionsAccepted: true,
      };

      const result = MembershipApplicationSchema.safeParse(validApplication);
      expect(result.success).toBe(true);
    }
  });

  it("should accept valid date formats", () => {
    const validDates = [
      "2000-01-15",
      "1995-12-31",
      "1980-06-01",
    ];

    for (const birthDate of validDates) {
      const validApplication = {
        firstName: "Ahmet",
        lastName: "Yılmaz",
        identityNumber: "12345678950",
        gender: "erkek" as const,
        birthPlace: "Ankara",
        birthDate,
        city: "Ankara",
        phone: "05551234567",
        email: "ahmet@example.com",
        address: "Ankara, Çankaya, Test Mahallesi No: 123",
        conditionsAccepted: true,
      };

      const result = MembershipApplicationSchema.safeParse(validApplication);
      expect(result.success).toBe(true);
    }
  });

  it("should trim whitespace from string fields that have trim()", () => {
    const validApplication = {
      firstName: "  Ahmet  ",
      lastName: "  Yılmaz  ",
      identityNumber: "12345678950",
      gender: "erkek" as const,
      birthPlace: "Ankara", // citySchema doesn't have trim, so don't add spaces
      birthDate: "2000-01-15",
      city: "Ankara", // citySchema doesn't have trim
      phone: "05551234567",
      email: "ahmet@example.com", // email validation may reject spaces
      address: "Ankara, Çankaya, Test Mahallesi No: 123", // addressSchema doesn't have trim
      conditionsAccepted: true,
    };

    const result = MembershipApplicationSchema.safeParse(validApplication);
    expect(result.success).toBe(true);
    if (result.success) {
      // firstName and lastName schemas have .trim()
      expect(result.data.firstName).toBe("Ahmet");
      expect(result.data.lastName).toBe("Yılmaz");
    }
  });
});

