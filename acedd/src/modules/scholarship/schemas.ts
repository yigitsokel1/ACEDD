/**
 * Scholarship Application Zod Schemas
 * 
 * Sprint 16 - Block B: Zod Schema Architecture
 * 
 * Single source of truth for form validation and type inference.
 * All schemas use Turkish error messages.
 * 
 * Architecture:
 * - Uses shared common schemas from @/lib/schemas/common
 * - Domain-specific validation rules for scholarship-specific fields
 * - Type-safe form data inference
 */

import { z } from "zod";
import {
  phoneSchema,
  emailSchema,
  tcNumberSchema,
  dateSchema,
  nameSchema,
  citySchema,
  addressSchema,
  positiveFloatSchema,
  percentageSchema,
  ibanSchema,
} from "@/lib/schemas/common";

// ============================================================================
// Dynamic Field Schemas
// ============================================================================

/**
 * Relative (Akraba) Schema
 * 
 * Form field names: kinship, name, surname, birthDate, education, occupation, 
 * healthInsurance, healthDisability, income, phone, additionalNotes
 */
export const RelativeSchema = z.object({
  // Akrabalık derecesi (kinship → degree in DB)
  kinship: z
    .string()
    .min(1, "Akrabalık derecesi gereklidir")
    .max(100, "Akrabalık derecesi en fazla 100 karakter olmalıdır"),
  
  // İsim (name → firstName in DB)
  name: nameSchema,
  
  // Soyisim (surname → lastName in DB)
  surname: nameSchema,
  
  // Doğum tarihi
  birthDate: dateSchema,
  
  // Öğrenim durumu (education → educationStatus in DB)
  education: z
    .string()
    .min(1, "Öğrenim durumu gereklidir")
    .max(100, "Öğrenim durumu en fazla 100 karakter olmalıdır"),
  
  // Meslek (occupation → workplace in DB)
  occupation: z
    .string()
    .min(1, "Meslek gereklidir")
    .max(200, "Meslek en fazla 200 karakter olmalıdır"),
  
  // Sağlık Sigortası
  healthInsurance: z
    .string()
    .min(1, "Sağlık sigortası durumu gereklidir")
    .max(50, "Sağlık sigortası durumu en fazla 50 karakter olmalıdır"),
  
  // Sağlık engeli
  healthDisability: z
    .string()
    .min(1, "Sağlık engeli durumu gereklidir")
    .refine((val) => val === "Evet" || val === "Hayır", {
      message: "Sağlık engeli durumu 'Evet' veya 'Hayır' olmalıdır",
    }),
  
  // Gelir (TL)
  income: positiveFloatSchema,
  
  // Telefon
  phone: phoneSchema,
  
  // Ek notlar (additionalNotes → notes in DB, optional)
  additionalNotes: z
    .string()
    .max(500, "Ek notlar en fazla 500 karakter olmalıdır")
    .optional(),
});

/**
 * Education History (Eğitim Geçmişi) Schema
 * 
 * Form field names: schoolName, startDate, endDate, graduation, department, percentage
 */
export const EducationHistorySchema = z
  .object({
    // Okul adı
    schoolName: z
      .string()
      .min(2, "Okul adı en az 2 karakter olmalıdır")
      .max(200, "Okul adı en fazla 200 karakter olmalıdır"),
    
    // Başlama tarihi
    startDate: dateSchema,
    
    // Bitiş tarihi (optional)
    endDate: z
      .union([z.string(), z.date(), z.undefined(), z.null()])
      .optional()
      .nullable()
      .refine(
        (val) => {
          // Allow empty/undefined/null for optional field
          if (val === undefined || val === null || val === "" || (typeof val === "string" && val.trim() === "")) {
            return true;
          }
          // If value provided, validate it's a valid date
          if (val instanceof Date) return !isNaN(val.getTime());
          if (typeof val === "string") {
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
        if (val === undefined || val === null || val === "" || (typeof val === "string" && val.trim() === "")) {
          return undefined;
        }
        if (val instanceof Date) return val;
        if (typeof val === "string") {
          return new Date(val);
        }
        return undefined;
      }),
    
    // Mezuniyet (graduation → isGraduated in DB, boolean)
    graduation: z
      .string()
      .min(1, "Mezuniyet durumu gereklidir")
      .refine((val) => val === "Evet" || val === "Hayır", {
        message: "Mezuniyet durumu 'Evet' veya 'Hayır' olmalıdır",
      }),
    
    // Bölüm
    department: z
      .string()
      .min(1, "Bölüm bilgisi gereklidir")
      .max(200, "Bölüm bilgisi en fazla 200 karakter olmalıdır"),
    
    // Yüzde (percentage → gradePercent in DB, 0-100)
    percentage: percentageSchema,
  })
  .refine(
    (data) => {
      if (!data.endDate) return true; // endDate optional, skip validation if not provided
      return data.endDate >= data.startDate;
    },
    {
      message: "Bitiş tarihi başlama tarihinden önce olamaz",
      path: ["endDate"],
    }
  );

/**
 * Reference (Referans) Schema
 * 
 * Form field names: relationship, fullName, isAcddMember, job, address, phone
 */
export const ReferenceSchema = z.object({
  // İlişki
  relationship: z
    .string()
    .min(1, "İlişki derecesi gereklidir")
    .max(100, "İlişki derecesi en fazla 100 karakter olmalıdır"),
  
  // Ad Soyad (fullName → firstName + lastName in DB, split required)
  fullName: z
    .string()
    .min(2, "Ad soyad en az 2 karakter olmalıdır")
    .max(200, "Ad soyad en fazla 200 karakter olmalıdır")
    .refine(
      (val) => {
        const parts = val.trim().split(/\s+/);
        return parts.length >= 2 && parts.every((part) => part.length >= 2);
      },
      {
        message: "Ad soyad en az 2 kelimeden oluşmalıdır (örn: 'Ahmet Yılmaz')",
      }
    ),
  
  // ACEDD üyesi mi? (isAcddMember → isAceddMember in DB, boolean)
  isAcddMember: z
    .string()
    .min(1, "ACEDD üyeliği durumu seçimi gereklidir")
    .refine((val) => val === "Evet" || val === "Hayır", {
      message: "ACEDD üyeliği durumu 'Evet' veya 'Hayır' olmalıdır",
    }),
  
  // İş/Meslek
  job: z
    .string()
    .min(1, "İş/Meslek bilgisi gereklidir")
    .max(200, "İş/Meslek bilgisi en fazla 200 karakter olmalıdır"),
  
  // Adres (reference address - Sprint 18 B3: max 1000 karakter)
  address: z
    .string()
    .min(10, "Adres en az 10 karakter olmalıdır")
    .max(1000, "Adres en fazla 1000 karakter olmalıdır"),
  
  // Telefon
  phone: phoneSchema,
});

// ============================================================================
// Static Field Schema (ScholarshipApplicationStaticSchema)
// ============================================================================

/**
 * Scholarship Application Static Fields Schema
 * 
 * All static fields from the form (before dynamic arrays)
 */
export const ScholarshipApplicationStaticSchema = z.object({
  // Genel Bilgi (General Information)
  name: nameSchema,
  surname: nameSchema,
  phone: phoneSchema,
  alternativePhone: phoneSchema.optional(),
  email: emailSchema,
  birthDate: dateSchema,
  
  gender: z
    .string()
    .min(1, "Cinsiyet seçimi gereklidir")
    .refine((val) => val === "Erkek" || val === "Kadın", {
      message: "Cinsiyet 'Erkek' veya 'Kadın' olmalıdır",
    }),
  
  birthPlace: citySchema,
  hometown: citySchema,
  
  tcNumber: tcNumberSchema,
  
  idIssueDate: dateSchema,
  
  idIssuePlace: citySchema,
  
  maritalStatus: z
    .string()
    .min(1, "Medeni hal seçimi gereklidir")
    .refine(
      (val) => ["Bekar", "Evli", "Boşanmış", "Dul"].includes(val),
      {
        message: "Medeni hal 'Bekar', 'Evli', 'Boşanmış' veya 'Dul' olmalıdır",
      }
    ),
  
  // Banka Bilgileri (Bank Information)
  bankAccount: z
    .string()
    .min(2, "Banka adı en az 2 karakter olmalıdır")
    .max(100, "Banka adı en fazla 100 karakter olmalıdır"),
  
  ibanNumber: ibanSchema,
  
  // Üniversite Bilgileri (University Information)
  university: z
    .string()
    .min(2, "Üniversite adı en az 2 karakter olmalıdır")
    .max(200, "Üniversite adı en fazla 200 karakter olmalıdır"),
  
  faculty: z
    .string()
    .min(2, "Fakülte en az 2 karakter olmalıdır")
    .max(200, "Fakülte en fazla 200 karakter olmalıdır"),
  
  department: z
    .string()
    .min(2, "Bölüm en az 2 karakter olmalıdır")
    .max(200, "Bölüm en fazla 200 karakter olmalıdır"),
  
  grade: z
    .string()
    .min(1, "Sınıf bilgisi gereklidir")
    .max(10, "Sınıf bilgisi en fazla 10 karakter olmalıdır"),
  
  turkeyRanking: z.coerce
    .number({
      invalid_type_error: "Türkiye sıralaması geçerli bir sayı olmalıdır",
    })
    .int("Türkiye sıralaması tam sayı olmalıdır")
    .min(1, "Türkiye sıralaması en az 1 olmalıdır")
    .max(9999999, "Türkiye sıralaması en fazla 9999999 olmalıdır")
    .optional(),
  
  // Sağlık ve Engellilik (Health & Disability)
  physicalDisability: z
    .string()
    .min(1, "Fiziksel engel durumu seçimi gereklidir")
    .refine((val) => val === "Evet" || val === "Hayır", {
      message: "Fiziksel engel durumu 'Evet' veya 'Hayır' olmalıdır",
    }),
  
  healthProblem: z
    .string()
    .min(1, "Sağlık sorunu durumu seçimi gereklidir")
    .refine((val) => val === "Evet" || val === "Hayır", {
      message: "Sağlık sorunu durumu 'Evet' veya 'Hayır' olmalıdır",
    }),
  
  // Aile Bilgileri (Family Information)
  familyMonthlyIncome: positiveFloatSchema,
  
  familyMonthlyExpenses: positiveFloatSchema,
  
  scholarshipIncome: z
    .string()
    .min(1, "Burs/kredi durumu seçimi gereklidir")
    .refine((val) => val === "Evet" || val === "Hayır", {
      message: "Burs/kredi durumu 'Evet' veya 'Hayır' olmalıdır",
    }),
  
  // Adres Bilgileri (Address Information)
  permanentAddress: addressSchema,
  
  currentAccommodation: z
    .string()
    .min(2, "Konaklama durumu en az 2 karakter olmalıdır")
    .max(500, "Konaklama durumu en fazla 500 karakter olmalıdır"),
  
  // Ek Bilgiler (Additional Information)
  selfIntroduction: z
    .string()
    .min(20, "Kendini tanıt en az 20 karakter olmalıdır")
    .max(2000, "Kendini tanıt en fazla 2000 karakter olmalıdır"),
  
  interests: z
    .string()
    .max(1000, "İlgi alanları en fazla 1000 karakter olmalıdır")
    .optional(),
  
  // Documents (optional, future use)
  documents: z.array(z.string().uuid("Geçerli bir dosya ID'si giriniz")).optional(),
});

// ============================================================================
// Complete Scholarship Application Schema
// ============================================================================

/**
 * Complete Scholarship Application Schema
 * 
 * Combines static fields + dynamic arrays (relatives, educationHistory, references)
 * 
 * This is the single source of truth for form validation.
 * Can be used in both frontend (React Hook Form) and backend (API validation).
 */
export const ScholarshipApplicationSchema = ScholarshipApplicationStaticSchema.extend({
  // Dinamik alanlar (Dynamic Fields)
  relatives: z
    .array(RelativeSchema)
    .min(0, "Akraba bilgisi opsiyoneldir")
    .max(50, "En fazla 50 akraba bilgisi eklenebilir"),
  
  educationHistory: z
    .array(EducationHistorySchema)
    .min(1, "En az 1 eğitim geçmişi bilgisi gereklidir")
    .max(50, "En fazla 50 eğitim geçmişi bilgisi eklenebilir"),
  
  references: z
    .array(ReferenceSchema)
    .min(0, "Referans bilgisi opsiyoneldir")
    .max(20, "En fazla 20 referans bilgisi eklenebilir"),
});

// ============================================================================
// Type Exports
// ============================================================================

/**
 * Form input type inferred from ScholarshipApplicationSchema
 * 
 * Use this type for:
 * - React Hook Form form data
 * - API request body validation
 * - Type-safe form handling
 */
export type ScholarshipApplicationInput = z.infer<typeof ScholarshipApplicationSchema>;

/**
 * Relative input type
 */
export type RelativeInput = z.infer<typeof RelativeSchema>;

/**
 * Education History input type
 */
export type EducationHistoryInput = z.infer<typeof EducationHistorySchema>;

/**
 * Reference input type
 */
export type ReferenceInput = z.infer<typeof ReferenceSchema>;

