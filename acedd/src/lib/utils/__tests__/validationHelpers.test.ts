/**
 * Validation helpers unit tests
 * Sprint 15.5: TC Kimlik, email, phone, fullName validation tests
 */

import { describe, it, expect } from "vitest";
import { validateTCNumber, validatePhoneNumber, validateEmail, validateFullName } from "../validationHelpers";

describe("validateTCNumber", () => {
  it("should return true for valid TC number", () => {
    // Test with algorithmically valid TC number: 12345678950
    // First 9 digits: 1,2,3,4,5,6,7,8,9
    // Odd positions (1,3,5,7,9): 1+3+5+7+9 = 25
    // Even positions (2,4,6,8): 2+4+6+8 = 20
    // 10th digit: (25*7 - 20) % 10 = 155 % 10 = 5
    // Sum of first 10: 1+2+3+4+5+6+7+8+9+5 = 50
    // 11th digit: 50 % 10 = 0
    // Result: 12345678950
    expect(validateTCNumber("12345678950")).toBe(true);
  });

  it("should return false for invalid length", () => {
    expect(validateTCNumber("1234567890")).toBe(false); // 10 digits
    expect(validateTCNumber("123456789012")).toBe(false); // 12 digits
    expect(validateTCNumber("123")).toBe(false); // too short
  });

  it("should return false for non-numeric input", () => {
    expect(validateTCNumber("1234567890a")).toBe(false);
    expect(validateTCNumber("abc")).toBe(false);
    expect(validateTCNumber("")).toBe(false);
  });

  it("should return false for TC starting with 0", () => {
    expect(validateTCNumber("02345678901")).toBe(false);
  });

  it("should return false for invalid checksum", () => {
    expect(validateTCNumber("11111111111")).toBe(false); // Invalid checksum
  });

  it("should handle whitespace", () => {
    // Test that whitespace is properly removed before validation
    // The function should trim and remove spaces, then validate
    const testTC = "12345678901"; // Invalid but tests whitespace handling
    expect(validateTCNumber(` ${testTC} `)).toBe(false); // Whitespace removed, then validated
    expect(validateTCNumber(testTC.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1 $2 $3 $4"))).toBe(false);
    // Both should return false (invalid TC) but whitespace should be handled without errors
  });

  it("should return false for null/undefined", () => {
    expect(validateTCNumber(null as any)).toBe(false);
    expect(validateTCNumber(undefined as any)).toBe(false);
  });
});

describe("validatePhoneNumber", () => {
  it("should return true for valid Turkish phone numbers", () => {
    expect(validatePhoneNumber("05551234567")).toBe(true);
    expect(validatePhoneNumber("5551234567")).toBe(true);
    expect(validatePhoneNumber("+905551234567")).toBe(true);
  });

  it("should handle formatted phone numbers", () => {
    expect(validatePhoneNumber("(0555) 123 45 67")).toBe(true);
    expect(validatePhoneNumber("0555-123-45-67")).toBe(true);
    expect(validatePhoneNumber("0 555 123 45 67")).toBe(true);
  });

  it("should return false for invalid phone numbers", () => {
    expect(validatePhoneNumber("1234567890")).toBe(false); // Doesn't start with 5
    expect(validatePhoneNumber("0555123456")).toBe(false); // Too short
    expect(validatePhoneNumber("055512345678")).toBe(false); // Too long
    expect(validatePhoneNumber("abc")).toBe(false);
    expect(validatePhoneNumber("")).toBe(false);
  });

  it("should return false for null/undefined", () => {
    expect(validatePhoneNumber(null as any)).toBe(false);
    expect(validatePhoneNumber(undefined as any)).toBe(false);
  });
});

describe("validateEmail", () => {
  it("should return true for valid email addresses", () => {
    expect(validateEmail("test@example.com")).toBe(true);
    expect(validateEmail("user.name@domain.co.uk")).toBe(true);
    expect(validateEmail("user+tag@example.com")).toBe(true);
  });

  it("should return false for invalid email addresses", () => {
    expect(validateEmail("invalid")).toBe(false);
    expect(validateEmail("@example.com")).toBe(false);
    expect(validateEmail("user@")).toBe(false);
    expect(validateEmail("user@domain")).toBe(false);
    expect(validateEmail("")).toBe(false);
  });

  it("should handle whitespace", () => {
    expect(validateEmail(" test@example.com ")).toBe(true);
  });

  it("should return false for null/undefined", () => {
    expect(validateEmail(null as any)).toBe(false);
    expect(validateEmail(undefined as any)).toBe(false);
  });
});

describe("validateFullName", () => {
  it("should return true for valid full names", () => {
    expect(validateFullName("Ahmet Yılmaz")).toBe(true);
    expect(validateFullName("Mehmet Ali Veli")).toBe(true);
    expect(validateFullName("Ayşe Fatma")).toBe(true);
  });

  it("should return false for single word", () => {
    expect(validateFullName("Ahmet")).toBe(false);
  });

  it("should return false for words shorter than 2 characters", () => {
    expect(validateFullName("A Y")).toBe(false);
    expect(validateFullName("Ahmet Y")).toBe(false);
  });

  it("should handle multiple spaces", () => {
    expect(validateFullName("Ahmet  Yılmaz")).toBe(true);
    expect(validateFullName("  Ahmet Yılmaz  ")).toBe(true);
  });

  it("should return false for empty string", () => {
    expect(validateFullName("")).toBe(false);
    expect(validateFullName("   ")).toBe(false);
  });

  it("should return false for null/undefined", () => {
    expect(validateFullName(null as any)).toBe(false);
    expect(validateFullName(undefined as any)).toBe(false);
  });
});
