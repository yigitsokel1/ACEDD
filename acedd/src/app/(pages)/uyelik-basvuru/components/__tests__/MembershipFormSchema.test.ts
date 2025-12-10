/**
 * MembershipForm Zod schema validation tests
 * Sprint 15.5: Unit tests for form validation schema
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { z } from "zod";

// Import real validation helpers (no mocking - test real implementation)
import { validateTCNumber, validatePhoneNumber, validateEmail } from "@/lib/utils/validationHelpers";

// Import the schema from the form component
// Note: We'll recreate it here for testing since it's not exported
const membershipFormSchema = z.object({
  firstName: z
    .string({
      required_error: "Ad zorunludur",
      invalid_type_error: "Ad geçerli bir metin olmalıdır",
    })
    .min(2, "Ad en az 2 karakter olmalıdır"),
  lastName: z
    .string({
      required_error: "Soyad zorunludur",
      invalid_type_error: "Soyad geçerli bir metin olmalıdır",
    })
    .min(2, "Soyad en az 2 karakter olmalıdır"),
  identityNumber: z
    .string({
      required_error: "TC Kimlik No zorunludur",
      invalid_type_error: "TC Kimlik No geçerli bir metin olmalıdır",
    })
    .min(1, "TC Kimlik No zorunludur")
    .refine((val) => validateTCNumber(val), {
      message: "Geçerli bir TC Kimlik No giriniz (11 haneli)",
    }),
  gender: z
    .string({
      required_error: "Cinsiyet seçimi zorunludur",
      invalid_type_error: "Cinsiyet seçimi zorunludur",
    })
    .refine((val) => val === "erkek" || val === "kadın", {
      message: "Cinsiyet seçimi zorunludur",
    }),
  bloodType: z
    .string({
      required_error: "Kan grubu seçimi zorunludur",
      invalid_type_error: "Kan grubu seçimi zorunludur",
    })
    .refine(
      (val) =>
        val === "A_POSITIVE" ||
        val === "A_NEGATIVE" ||
        val === "B_POSITIVE" ||
        val === "B_NEGATIVE" ||
        val === "AB_POSITIVE" ||
        val === "AB_NEGATIVE" ||
        val === "O_POSITIVE" ||
        val === "O_NEGATIVE",
      {
        message: "Kan grubu seçimi zorunludur",
      }
    ),
  birthPlace: z
    .string({
      required_error: "Doğum yeri zorunludur",
      invalid_type_error: "Doğum yeri geçerli bir metin olmalıdır",
    })
    .min(2, "Doğum yeri en az 2 karakter olmalıdır"),
  birthDate: z
    .string({
      required_error: "Doğum tarihi zorunludur",
      invalid_type_error: "Doğum tarihi geçerli bir tarih olmalıdır",
    })
    .min(1, "Doğum tarihi zorunludur"),
  city: z
    .string({
      required_error: "Şehir zorunludur",
      invalid_type_error: "Şehir geçerli bir metin olmalıdır",
    })
    .min(2, "Şehir en az 2 karakter olmalıdır"),
  phone: z
    .string({
      required_error: "Telefon numarası zorunludur",
      invalid_type_error: "Telefon numarası geçerli bir metin olmalıdır",
    })
    .min(1, "Telefon numarası zorunludur")
    .refine((val) => validatePhoneNumber(val), {
      message: "Geçerli bir telefon numarası giriniz (örn: 05551234567)",
    }),
  email: z
    .string({
      required_error: "E-posta adresi zorunludur",
      invalid_type_error: "E-posta adresi geçerli bir metin olmalıdır",
    })
    .min(1, "E-posta adresi zorunludur")
    .email("Geçerli bir e-posta adresi giriniz")
    .refine((val) => validateEmail(val), {
      message: "Geçerli bir e-posta adresi giriniz",
    }),
  address: z
    .string({
      required_error: "Adres zorunludur",
      invalid_type_error: "Adres geçerli bir metin olmalıdır",
    })
    .min(10, "Adres en az 10 karakter olmalıdır"),
  conditionsAccepted: z
    .boolean({
      required_error: "Şartları kabul etmeniz gerekmektedir",
      invalid_type_error: "Şartları kabul etmeniz gerekmektedir",
    })
    .refine((val) => val === true, {
      message: "Şartları kabul etmeniz gerekmektedir",
    }),
});

describe("MembershipFormSchema Validation", () => {
  // No mocking - using real validation functions
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
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("Ad en az 2 karakter");
      }
    });

    it("should fail with empty string", () => {
      const result = membershipFormSchema.safeParse({
        firstName: "",
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
      expect(result.success).toBe(false);
    });
  });

  describe("lastName", () => {
    it("should pass with valid last name (2+ characters)", () => {
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
        firstName: "Ahmet",
        lastName: "Y",
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
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("Soyad en az 2 karakter");
      }
    });

    it("should fail with empty string", () => {
      const result = membershipFormSchema.safeParse({
        firstName: "Ahmet",
        lastName: "",
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
      expect(result.success).toBe(false);
    });
  });

  describe("identityNumber", () => {
    it("should pass with valid TC number", () => {
      // Using algorithmically valid TC number: 12345678950
      // First 9 digits: 1,2,3,4,5,6,7,8,9
      // Odd positions (1,3,5,7,9): 1+3+5+7+9 = 25
      // Even positions (2,4,6,8): 2+4+6+8 = 20
      // 10th digit: (25*7 - 20) % 10 = 155 % 10 = 5
      // Sum of first 10: 1+2+3+4+5+6+7+8+9+5 = 50
      // 11th digit: 50 % 10 = 0
      // Result: 12345678950
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
      // Real validation will fail for 10-digit number
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
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("TC Kimlik No");
      }
    });

    it("should fail with empty string", () => {
      // Real validation will fail for empty string
      const result = membershipFormSchema.safeParse({
        firstName: "Ahmet",
        lastName: "Yılmaz",
        identityNumber: "",
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

    it("should fail with invalid gender", () => {
      const result = membershipFormSchema.safeParse({
        firstName: "Ahmet",
        lastName: "Yılmaz",
        identityNumber: "12345678950", // Algorithmically valid TC number
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

    it("should fail with invalid phone number", () => {
      // Real validation will fail for phone numbers that don't start with 5
      const result = membershipFormSchema.safeParse({
        firstName: "Ahmet",
        lastName: "Yılmaz",
        identityNumber: "12345678950", // Algorithmically valid TC number
        gender: "erkek",
        bloodType: "A_POSITIVE",
        birthPlace: "Istanbul",
        birthDate: "1990-01-01",
        city: "Istanbul",
        phone: "1234567890", // Invalid (doesn't start with 5)
        email: "ahmet@example.com",
        address: "Test address here",
        conditionsAccepted: true,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const phoneError = result.error.errors.find((e) => e.message.includes("telefon numarası"));
        expect(phoneError).toBeDefined();
      }
    });
  });

  describe("email", () => {
    it("should pass with valid email", () => {
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

    it("should fail with invalid email", () => {
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
        identityNumber: "12345678950", // Algorithmically valid TC number
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
        identityNumber: "12345678950", // Algorithmically valid TC number
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
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("Adres en az 10 karakter");
      }
    });
  });

  describe("conditionsAccepted", () => {
    it("should pass when conditionsAccepted is true", () => {
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

    it("should fail when conditionsAccepted is false", () => {
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
        conditionsAccepted: false,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const conditionsError = result.error.errors.find((e) => e.message.includes("Şartları kabul"));
        expect(conditionsError).toBeDefined();
      }
    });
  });

  describe("bloodType (required)", () => {
    it("should pass with valid blood type", () => {
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

    it("should fail without bloodType field (required)", () => {
      const result = membershipFormSchema.safeParse({
        firstName: "Ahmet",
        lastName: "Yılmaz",
        identityNumber: "12345678950", // Algorithmically valid TC number
        gender: "erkek",
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

  describe("complete valid form", () => {
    it("should pass with all required fields valid", () => {
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