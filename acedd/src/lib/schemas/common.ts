/**
 * Common Zod Schemas
 * 
 * Shared validation schemas used across multiple forms (membership, scholarship, etc.)
 * Single source of truth for common field validations.
 * 
 * All error messages are in Turkish.
 */

import { z } from "zod";
import { validateTCNumber, validatePhoneNumber, validateEmail } from "@/lib/utils/validationHelpers";

// ============================================================================
// Basic Field Schemas
// ============================================================================

/**
 * Turkish phone number validation schema
 * Accepts: +905551234567, 05551234567, 5551234567
 */
export const phoneSchema = z
  .string({
    required_error: "Telefon numarası zorunludur",
    invalid_type_error: "Telefon numarası geçerli bir metin olmalıdır",
  })
  .min(10, "Telefon numarası en az 10 karakter olmalıdır")
  .max(15, "Telefon numarası en fazla 15 karakter olmalıdır")
  .refine(
    (val) => validatePhoneNumber(val),
    "Geçerli bir Türk telefon numarası giriniz (örn: 05551234567)"
  );

/**
 * Email validation schema
 */
export const emailSchema = z
  .string({
    required_error: "E-posta adresi zorunludur",
    invalid_type_error: "E-posta adresi geçerli bir metin olmalıdır",
  })
  .min(1, "E-posta adresi zorunludur")
  .email("Geçerli bir e-posta adresi giriniz")
  .refine(
    (val) => validateEmail(val),
    "Geçerli bir e-posta adresi giriniz"
  );

/**
 * TC Kimlik No validation schema
 * 11 digits, checksum validation
 */
export const tcNumberSchema = z
  .string({
    required_error: "TC Kimlik No alanı zorunludur",
    invalid_type_error: "TC Kimlik No geçerli bir metin olmalıdır",
  })
  .refine(
    (val) => {
      const cleaned = val.trim().replace(/\s/g, "");
      return cleaned.length === 11;
    },
    {
      message: "TC Kimlik No 11 haneli olmalıdır",
    }
  )
  .refine(
    (val) => {
      const cleaned = val.trim().replace(/\s/g, "");
      return /^\d+$/.test(cleaned);
    },
    {
      message: "TC kimlik numarası sadece rakamlardan oluşmalıdır",
    }
  )
  .refine(
    (val) => validateTCNumber(val),
    {
      message: "Geçerli bir TC Kimlik No giriniz (koşulları sağlamıyor)",
    }
  );

/**
 * Date string to Date coercion schema
 * Handles HTML date inputs (YYYY-MM-DD) and ISO strings
 */
export const dateSchema = z
  .union([z.string(), z.date()])
  .refine(
    (val) => {
      if (val === "" || val == null || val === undefined) return false;
      if (val instanceof Date) return !isNaN(val.getTime());
      if (typeof val === "string") {
        if (val.trim() === "") return false;
        const date = new Date(val);
        return !isNaN(date.getTime());
      }
      return false;
    },
    {
      message: "Geçerli bir tarih giriniz",
    }
  )
  .transform((val) => {
    if (val instanceof Date) return val;
    if (typeof val === "string") {
      return new Date(val);
    }
    throw new Error("Geçerli bir tarih giriniz");
  });

/**
 * First name schema
 */
export const firstNameSchema = z
  .string({
    required_error: "Ad alanı zorunludur",
    invalid_type_error: "Ad geçerli bir metin olmalıdır",
  })
  .min(2, "Ad en az 2 karakter olmalıdır")
  .max(50, "Ad en fazla 50 karakter olmalıdır")
  .trim();

/**
 * Last name schema
 */
export const lastNameSchema = z
  .string({
    required_error: "Soyad alanı zorunludur",
    invalid_type_error: "Soyad geçerli bir metin olmalıdır",
  })
  .min(2, "Soyad en az 2 karakter olmalıdır")
  .max(50, "Soyad en fazla 50 karakter olmalıdır")
  .trim();

/**
 * Name schema (generic, for backward compatibility)
 */
export const nameSchema = firstNameSchema;

/**
 * City/Place name schema
 */
export const citySchema = z
  .string({
    required_error: "Şehir zorunludur",
    invalid_type_error: "Şehir geçerli bir metin olmalıdır",
  })
  .min(2, "Şehir en az 2 karakter olmalıdır")
  .max(100, "Şehir en fazla 100 karakter olmalıdır");

/**
 * Address schema (longer text)
 */
export const addressSchema = z
  .string({
    required_error: "Adres zorunludur",
    invalid_type_error: "Adres geçerli bir metin olmalıdır",
  })
  .min(10, "Adres en az 10 karakter olmalıdır")
  .max(1000, "Adres en fazla 1000 karakter olmalıdır");

// ============================================================================
// Enum Schemas
// ============================================================================

/**
 * Gender enum schema (Turkish values)
 */
export const genderSchema = z.enum(["erkek", "kadın"], {
  required_error: "Cinsiyet seçimi zorunludur",
  invalid_type_error: "Cinsiyet seçimi zorunludur",
});

/**
 * Blood type enum schema
 */
export const bloodTypeSchema = z.enum(
  [
    "A_POSITIVE",
    "A_NEGATIVE",
    "B_POSITIVE",
    "B_NEGATIVE",
    "AB_POSITIVE",
    "AB_NEGATIVE",
    "O_POSITIVE",
    "O_NEGATIVE",
  ],
  {
    required_error: "Kan grubu seçimi zorunludur",
    invalid_type_error: "Geçerli bir kan grubu seçiniz",
  }
);

// ============================================================================
// Numeric Schemas
// ============================================================================

/**
 * Positive number schema (Float)
 */
export const positiveFloatSchema = z.coerce
  .number({
    required_error: "Sayı gereklidir",
    invalid_type_error: "Geçerli bir sayı giriniz",
  })
  .min(0, "Sayı 0'dan küçük olamaz");

/**
 * Percentage schema (0-100)
 */
export const percentageSchema = z.coerce
  .number({
    required_error: "Yüzde gereklidir",
    invalid_type_error: "Geçerli bir sayı giriniz",
  })
  .min(0, "Yüzde 0'dan küçük olamaz")
  .max(100, "Yüzde 100'den büyük olamaz");

/**
 * Integer schema
 */
export const integerSchema = z.coerce
  .number({
    required_error: "Sayı gereklidir",
    invalid_type_error: "Geçerli bir sayı giriniz",
  })
  .int("Sayı tam sayı olmalıdır");

// ============================================================================
// IBAN Schema (for scholarship form)
// ============================================================================

/**
 * IBAN validation schema (TR format)
 */
export const ibanSchema = z
  .string({
    required_error: "IBAN numarası zorunludur",
    invalid_type_error: "IBAN numarası geçerli bir metin olmalıdır",
  })
  .min(26, "IBAN numarası en az 26 karakter olmalıdır")
  .max(34, "IBAN numarası en fazla 34 karakter olmalıdır")
  .refine(
    (val) => val.toUpperCase().startsWith("TR"),
    "IBAN numarası TR ile başlamalıdır"
  );

// ============================================================================
// Boolean Schemas
// ============================================================================

/**
 * Conditions accepted schema
 */
export const conditionsAcceptedSchema = z
  .boolean({
    required_error: "Şartları kabul etmeniz gerekmektedir",
    invalid_type_error: "Şartları kabul etmeniz gerekmektedir",
  })
  .refine((val) => val === true, {
    message: "Şartları kabul etmeniz gerekmektedir",
  });

