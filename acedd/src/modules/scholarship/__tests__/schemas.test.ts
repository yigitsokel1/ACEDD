/**
 * Scholarship Application Zod Schema Tests
 * 
 * Sprint 16 - Block B: Unit tests for Zod schemas
 * 
 * Tests cover:
 * - Passing valid data
 * - Failing invalid data
 * - Edge cases
 * - Turkish error messages
 */

import { describe, it, expect } from "vitest";
import {
  RelativeSchema,
  EducationHistorySchema,
  ReferenceSchema,
  ScholarshipApplicationStaticSchema,
  ScholarshipApplicationSchema,
} from "../schemas";

// ============================================================================
// RelativeSchema Tests
// ============================================================================

describe("RelativeSchema", () => {
  it("should pass with valid relative data", () => {
    const validRelative = {
      kinship: "Anne",
      name: "Ayşe",
      surname: "Yılmaz",
      birthDate: "1980-01-15",
      education: "Üniversite",
      occupation: "Öğretmen",
      job: "Milli Eğitim Bakanlığı",
      healthInsurance: "SGK",
      healthDisability: "Hayır",
      income: 15000.50,
      phone: "05551234567",
      additionalNotes: "Ek notlar",
    };

    const result = RelativeSchema.safeParse(validRelative);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.kinship).toBe("Anne");
      expect(result.data.name).toBe("Ayşe");
      expect(result.data.income).toBe(15000.50);
    }
  });

  it("should fail with missing required fields", () => {
    const invalidRelative = {
      kinship: "Anne",
      // Missing name, surname, etc.
    };

    const result = RelativeSchema.safeParse(invalidRelative);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(0);
      // Check for error messages (Zod may use "Required" for missing fields, or our custom Turkish messages)
      const errorMessages = result.error.issues.map((issue) => issue.message);
      const hasRelevantError = errorMessages.some(
        (msg) =>
          msg.includes("gereklidir") ||
          msg.includes("Required") ||
          msg.includes("zorunlu") ||
          msg.includes("en az")
      );
      expect(hasRelevantError).toBe(true);
    }
  });

  it("should fail with invalid healthDisability value", () => {
    const invalidRelative = {
      kinship: "Anne",
      name: "Ayşe",
      surname: "Yılmaz",
      birthDate: "1980-01-15",
      education: "Üniversite",
      occupation: "Öğretmen",
      job: "Milli Eğitim Bakanlığı",
      healthInsurance: "SGK",
      healthDisability: "Belki", // Invalid: should be "Evet" or "Hayır"
      income: 15000,
      phone: "05551234567",
    };

    const result = RelativeSchema.safeParse(invalidRelative);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errorMessages = result.error.issues.map((issue) => issue.message);
      expect(
        errorMessages.some((msg) => msg.includes("Evet") && msg.includes("Hayır"))
      ).toBe(true);
    }
  });

  it("should fail with negative income", () => {
    const invalidRelative = {
      kinship: "Anne",
      name: "Ayşe",
      surname: "Yılmaz",
      birthDate: "1980-01-15",
      education: "Üniversite",
      occupation: "Öğretmen",
      job: "Milli Eğitim Bakanlığı",
      healthInsurance: "SGK",
      healthDisability: "Hayır",
      income: -1000, // Invalid: negative
      phone: "05551234567",
    };

    const result = RelativeSchema.safeParse(invalidRelative);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errorMessages = result.error.issues.map((issue) => issue.message);
      expect(errorMessages.some((msg) => msg.includes("0'dan küçük"))).toBe(true);
    }
  });

  it("should fail with invalid phone number", () => {
    const invalidRelative = {
      kinship: "Anne",
      name: "Ayşe",
      surname: "Yılmaz",
      birthDate: "1980-01-15",
      education: "Üniversite",
      occupation: "Öğretmen",
      job: "Milli Eğitim Bakanlığı",
      healthInsurance: "SGK",
      healthDisability: "Hayır",
      income: 15000,
      phone: "123456", // Invalid: too short
    };

    const result = RelativeSchema.safeParse(invalidRelative);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errorMessages = result.error.issues.map((issue) => issue.message);
      expect(errorMessages.some((msg) => msg.includes("telefon"))).toBe(true);
    }
  });

  it("should pass with optional additionalNotes", () => {
    const validRelative = {
      kinship: "Anne",
      name: "Ayşe",
      surname: "Yılmaz",
      birthDate: "1980-01-15",
      education: "Üniversite",
      occupation: "Öğretmen",
      job: "Milli Eğitim Bakanlığı",
      healthInsurance: "SGK",
      healthDisability: "Hayır",
      income: 15000,
      phone: "05551234567",
      // additionalNotes is optional
    };

    const result = RelativeSchema.safeParse(validRelative);
    expect(result.success).toBe(true);
  });
});

// ============================================================================
// EducationHistorySchema Tests
// ============================================================================

describe("EducationHistorySchema", () => {
  it("should pass with valid education history data", () => {
    const validEducation = {
      schoolName: "Ankara Üniversitesi",
      startDate: "2015-09-01",
      endDate: "2019-06-30",
      graduation: "Evet",
      department: "Bilgisayar Mühendisliği",
      percentage: 85.5,
    };

    const result = EducationHistorySchema.safeParse(validEducation);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.schoolName).toBe("Ankara Üniversitesi");
      expect(result.data.percentage).toBe(85.5);
    }
  });

  it("should fail when endDate is before startDate", () => {
    const invalidEducation = {
      schoolName: "Ankara Üniversitesi",
      startDate: "2019-09-01",
      endDate: "2015-06-30", // Invalid: before startDate
      graduation: "Evet",
      department: "Bilgisayar Mühendisliği",
      percentage: 85.5,
    };

    const result = EducationHistorySchema.safeParse(invalidEducation);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errorMessages = result.error.issues.map((issue) => issue.message);
      expect(
        errorMessages.some((msg) => msg.includes("Bitiş tarihi") && msg.includes("başlama"))
      ).toBe(true);
    }
  });

  it("should fail with percentage > 100", () => {
    const invalidEducation = {
      schoolName: "Ankara Üniversitesi",
      startDate: "2015-09-01",
      endDate: "2019-06-30",
      graduation: "Evet",
      department: "Bilgisayar Mühendisliği",
      percentage: 150, // Invalid: > 100
    };

    const result = EducationHistorySchema.safeParse(invalidEducation);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errorMessages = result.error.issues.map((issue) => issue.message);
      expect(errorMessages.some((msg) => msg.includes("100"))).toBe(true);
    }
  });

  it("should fail with invalid graduation value", () => {
    const invalidEducation = {
      schoolName: "Ankara Üniversitesi",
      startDate: "2015-09-01",
      endDate: "2019-06-30",
      graduation: "Belki", // Invalid: should be "Evet" or "Hayır"
      department: "Bilgisayar Mühendisliği",
      percentage: 85.5,
    };

    const result = EducationHistorySchema.safeParse(invalidEducation);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errorMessages = result.error.issues.map((issue) => issue.message);
      expect(
        errorMessages.some((msg) => msg.includes("Evet") && msg.includes("Hayır"))
      ).toBe(true);
    }
  });
});

// ============================================================================
// ReferenceSchema Tests
// ============================================================================

describe("ReferenceSchema", () => {
  it("should pass with valid reference data", () => {
    const validReference = {
      relationship: "Hoca",
      fullName: "Mehmet Demir",
      isAcddMember: "Evet",
      job: "Profesör",
      address: "Ankara Üniversitesi, Bilgisayar Mühendisliği Bölümü, Ankara",
      phone: "05551234567",
    };

    const result = ReferenceSchema.safeParse(validReference);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.fullName).toBe("Mehmet Demir");
      expect(result.data.isAcddMember).toBe("Evet");
    }
  });

  it("should fail with single-word fullName", () => {
    const invalidReference = {
      relationship: "Hoca",
      fullName: "Mehmet", // Invalid: single word, needs at least 2 words
      isAcddMember: "Evet",
      job: "Profesör",
      address: "Ankara Üniversitesi, Bilgisayar Mühendisliği Bölümü, Ankara",
      phone: "05551234567",
    };

    const result = ReferenceSchema.safeParse(invalidReference);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errorMessages = result.error.issues.map((issue) => issue.message);
      expect(errorMessages.some((msg) => msg.includes("2 kelime"))).toBe(true);
    }
  });

  it("should fail with invalid isAcddMember value", () => {
    const invalidReference = {
      relationship: "Hoca",
      fullName: "Mehmet Demir",
      isAcddMember: "Belki", // Invalid: should be "Evet" or "Hayır"
      job: "Profesör",
      address: "Ankara Üniversitesi, Bilgisayar Mühendisliği Bölümü, Ankara",
      phone: "05551234567",
    };

    const result = ReferenceSchema.safeParse(invalidReference);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errorMessages = result.error.issues.map((issue) => issue.message);
      expect(
        errorMessages.some((msg) => msg.includes("Evet") && msg.includes("Hayır"))
      ).toBe(true);
    }
  });

  it("should fail with short address", () => {
    const invalidReference = {
      relationship: "Hoca",
      fullName: "Mehmet Demir",
      isAcddMember: "Evet",
      job: "Profesör",
      address: "Ankara", // Invalid: too short (< 10 chars)
      phone: "05551234567",
    };

    const result = ReferenceSchema.safeParse(invalidReference);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errorMessages = result.error.issues.map((issue) => issue.message);
      expect(errorMessages.some((msg) => msg.includes("10 karakter"))).toBe(true);
    }
  });
});

// ============================================================================
// ScholarshipApplicationStaticSchema Tests
// ============================================================================

describe("ScholarshipApplicationStaticSchema", () => {
  it("should pass with valid static fields", () => {
    // Algorithmically valid TC number: 12345678950
    // First 9 digits: 1,2,3,4,5,6,7,8,9
    // Odd positions (1,3,5,7,9): 1+3+5+7+9 = 25
    // Even positions (2,4,6,8): 2+4+6+8 = 20
    // 10th digit: (25*7 - 20) % 10 = 155 % 10 = 5
    // Sum of first 10: 1+2+3+4+5+6+7+8+9+5 = 50
    // 11th digit: 50 % 10 = 0
    // Result: 12345678950
    const validStatic = {
      name: "Ahmet",
      surname: "Yılmaz",
      phone: "05551234567",
      email: "ahmet@example.com",
      birthDate: "2000-01-15",
      gender: "Erkek",
      birthPlace: "Ankara",
      hometown: "Ankara",
      tcNumber: "12345678950",
      idIssueDate: "2018-01-01",
      idIssuePlace: "Ankara",
      maritalStatus: "Bekar",
      bankAccount: "Ziraat Bankası",
      ibanNumber: "TR330006100519786457841326",
      university: "Ankara Üniversitesi",
      faculty: "Mühendislik Fakültesi",
      department: "Bilgisayar Mühendisliği",
      grade: "3",
      turkeyRanking: 5000,
      physicalDisability: "Hayır",
      healthProblem: "Hayır",
      familyMonthlyIncome: 15000.50,
      familyMonthlyExpenses: 12000.25,
      scholarshipIncome: "Hayır",
      permanentAddress: "Ankara, Çankaya, Kızılay Mahallesi, Atatürk Bulvarı No: 123",
      currentAccommodation: "Yurt",
      selfIntroduction: "Merhaba, ben Ahmet Yılmaz. Bilgisayar mühendisliği öğrencisiyim ve yazılım geliştirme konusunda ilgiliyim.",
      interests: "Yazılım, müzik, spor",
    };

    const result = ScholarshipApplicationStaticSchema.safeParse(validStatic);
    expect(result.success).toBe(true);
  });

  it("should fail with invalid TC number", () => {
    const invalidStatic = {
      name: "Ahmet",
      surname: "Yılmaz",
      phone: "05551234567",
      email: "ahmet@example.com",
      birthDate: "2000-01-15",
      gender: "Erkek",
      birthPlace: "Ankara",
      hometown: "Ankara",
      tcNumber: "12345", // Invalid: too short
      idIssueDate: "2018-01-01",
      idIssuePlace: "Ankara",
      maritalStatus: "Bekar",
      bankAccount: "Ziraat Bankası",
      ibanNumber: "TR330006100519786457841326",
      university: "Ankara Üniversitesi",
      faculty: "Mühendislik Fakültesi",
      grade: "3",
      physicalDisability: "Hayır",
      healthProblem: "Hayır",
      familyMonthlyIncome: 15000,
      familyMonthlyExpenses: 12000,
      scholarshipIncome: "Hayır",
      permanentAddress: "Ankara, Çankaya, Kızılay Mahallesi, Atatürk Bulvarı No: 123",
      currentAccommodation: "Yurt",
      selfIntroduction: "Merhaba, ben Ahmet Yılmaz. Bilgisayar mühendisliği öğrencisiyim ve yazılım geliştirme konusunda ilgiliyim.",
    };

    const result = ScholarshipApplicationStaticSchema.safeParse(invalidStatic);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errorMessages = result.error.issues.map((issue) => issue.message);
      // Check for TC Kimlik No related error messages (case-insensitive)
      expect(
        errorMessages.some(
          (msg) =>
            msg.toLowerCase().includes("tc kimlik") ||
            msg.toLowerCase().includes("tc kimlik no")
        )
      ).toBe(true);
    }
  });

  it("should fail with invalid IBAN (not starting with TR)", () => {
    const invalidStatic = {
      name: "Ahmet",
      surname: "Yılmaz",
      phone: "05551234567",
      email: "ahmet@example.com",
      birthDate: "2000-01-15",
      gender: "Erkek",
      birthPlace: "Ankara",
      hometown: "Ankara",
      tcNumber: "12345678950",
      idIssueDate: "2018-01-01",
      idIssuePlace: "Ankara",
      maritalStatus: "Bekar",
      bankAccount: "Ziraat Bankası",
      ibanNumber: "US330006100519786457841326", // Invalid: starts with US
      university: "Ankara Üniversitesi",
      faculty: "Mühendislik Fakültesi",
      grade: "3",
      physicalDisability: "Hayır",
      healthProblem: "Hayır",
      familyMonthlyIncome: 15000,
      familyMonthlyExpenses: 12000,
      scholarshipIncome: "Hayır",
      permanentAddress: "Ankara, Çankaya, Kızılay Mahallesi, Atatürk Bulvarı No: 123",
      currentAccommodation: "Yurt",
      selfIntroduction: "Merhaba, ben Ahmet Yılmaz. Bilgisayar mühendisliği öğrencisiyim ve yazılım geliştirme konusunda ilgiliyim.",
    };

    const result = ScholarshipApplicationStaticSchema.safeParse(invalidStatic);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errorMessages = result.error.issues.map((issue) => issue.message);
      expect(errorMessages.some((msg) => msg.includes("TR ile başlamalıdır"))).toBe(true);
    }
  });

  it("should fail with invalid email", () => {
    const invalidStatic = {
      name: "Ahmet",
      surname: "Yılmaz",
      phone: "05551234567",
      email: "invalid-email", // Invalid: not a valid email
      birthDate: "2000-01-15",
      gender: "Erkek",
      birthPlace: "Ankara",
      hometown: "Ankara",
      tcNumber: "12345678950",
      idIssueDate: "2018-01-01",
      idIssuePlace: "Ankara",
      maritalStatus: "Bekar",
      bankAccount: "Ziraat Bankası",
      ibanNumber: "TR330006100519786457841326",
      university: "Ankara Üniversitesi",
      faculty: "Mühendislik Fakültesi",
      grade: "3",
      physicalDisability: "Hayır",
      healthProblem: "Hayır",
      familyMonthlyIncome: 15000,
      familyMonthlyExpenses: 12000,
      scholarshipIncome: "Hayır",
      permanentAddress: "Ankara, Çankaya, Kızılay Mahallesi, Atatürk Bulvarı No: 123",
      currentAccommodation: "Yurt",
      selfIntroduction: "Merhaba, ben Ahmet Yılmaz. Bilgisayar mühendisliği öğrencisiyim ve yazılım geliştirme konusunda ilgiliyim.",
    };

    const result = ScholarshipApplicationStaticSchema.safeParse(invalidStatic);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errorMessages = result.error.issues.map((issue) => issue.message);
      expect(errorMessages.some((msg) => msg.includes("e-posta"))).toBe(true);
    }
  });

  it("should fail with short selfIntroduction (< 20 chars)", () => {
    const invalidStatic = {
      name: "Ahmet",
      surname: "Yılmaz",
      phone: "05551234567",
      email: "ahmet@example.com",
      birthDate: "2000-01-15",
      gender: "Erkek",
      birthPlace: "Ankara",
      hometown: "Ankara",
      tcNumber: "12345678950",
      idIssueDate: "2018-01-01",
      idIssuePlace: "Ankara",
      maritalStatus: "Bekar",
      bankAccount: "Ziraat Bankası",
      ibanNumber: "TR330006100519786457841326",
      university: "Ankara Üniversitesi",
      faculty: "Mühendislik Fakültesi",
      grade: "3",
      physicalDisability: "Hayır",
      healthProblem: "Hayır",
      familyMonthlyIncome: 15000,
      familyMonthlyExpenses: 12000,
      scholarshipIncome: "Hayır",
      permanentAddress: "Ankara, Çankaya, Kızılay Mahallesi, Atatürk Bulvarı No: 123",
      currentAccommodation: "Yurt",
      selfIntroduction: "Kısa", // Invalid: < 20 chars
    };

    const result = ScholarshipApplicationStaticSchema.safeParse(invalidStatic);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errorMessages = result.error.issues.map((issue) => issue.message);
      expect(errorMessages.some((msg) => msg.includes("20 karakter"))).toBe(true);
    }
  });
});

// ============================================================================
// ScholarshipApplicationSchema (Complete) Tests
// ============================================================================

describe("ScholarshipApplicationSchema", () => {
  it("should pass with complete valid data", () => {
    const validApplication = {
      // Static fields
      name: "Ahmet",
      surname: "Yılmaz",
      phone: "05551234567",
      email: "ahmet@example.com",
      birthDate: "2000-01-15",
      gender: "Erkek",
      birthPlace: "Ankara",
      hometown: "Ankara",
      tcNumber: "12345678950",
      idIssueDate: "2018-01-01",
      idIssuePlace: "Ankara",
      maritalStatus: "Bekar",
      bankAccount: "Ziraat Bankası",
      ibanNumber: "TR330006100519786457841326",
      university: "Ankara Üniversitesi",
      faculty: "Mühendislik Fakültesi",
      department: "Bilgisayar Mühendisliği",
      grade: "3",
      physicalDisability: "Hayır",
      healthProblem: "Hayır",
      familyMonthlyIncome: 15000,
      familyMonthlyExpenses: 12000,
      scholarshipIncome: "Hayır",
      permanentAddress: "Ankara, Çankaya, Kızılay Mahallesi, Atatürk Bulvarı No: 123",
      currentAccommodation: "Yurt",
      selfIntroduction: "Merhaba, ben Ahmet Yılmaz. Bilgisayar mühendisliği öğrencisiyim ve yazılım geliştirme konusunda ilgiliyim.",
      // Dynamic arrays
      relatives: [
        {
          kinship: "Anne",
          name: "Ayşe",
          surname: "Yılmaz",
          birthDate: "1980-01-15",
          education: "Üniversite",
          occupation: "Öğretmen",
          healthInsurance: "SGK",
          healthDisability: "Hayır",
          income: 15000,
          phone: "05551234567",
        },
      ],
      educationHistory: [
        {
          schoolName: "Ankara Üniversitesi",
          startDate: "2018-09-01",
          endDate: "2022-06-30",
          graduation: "Evet",
          department: "Bilgisayar Mühendisliği",
          percentage: 85.5,
        },
      ],
      references: [
        {
          relationship: "Hoca",
          fullName: "Mehmet Demir",
          isAcddMember: "Evet",
          job: "Profesör",
          address: "Ankara Üniversitesi, Bilgisayar Mühendisliği Bölümü, Ankara",
          phone: "05551234567",
        },
      ],
    };

    const result = ScholarshipApplicationSchema.safeParse(validApplication);
    expect(result.success).toBe(true);
  });

  it("should fail with empty educationHistory array (relatives and references are optional)", () => {
    const invalidApplication = {
      // Static fields (minimal valid)
      name: "Ahmet",
      surname: "Yılmaz",
      phone: "05551234567",
      email: "ahmet@example.com",
      birthDate: "2000-01-15",
      gender: "Erkek",
      birthPlace: "Ankara",
      hometown: "Ankara",
      tcNumber: "12345678950",
      idIssueDate: "2018-01-01",
      idIssuePlace: "Ankara",
      maritalStatus: "Bekar",
      bankAccount: "Ziraat Bankası",
      ibanNumber: "TR330006100519786457841326",
      university: "Ankara Üniversitesi",
      faculty: "Mühendislik Fakültesi",
      department: "Bilgisayar Mühendisliği",
      grade: "3",
      physicalDisability: "Hayır",
      healthProblem: "Hayır",
      familyMonthlyIncome: 15000,
      familyMonthlyExpenses: 12000,
      scholarshipIncome: "Hayır",
      permanentAddress: "Ankara, Çankaya, Kızılay Mahallesi, Atatürk Bulvarı No: 123",
      currentAccommodation: "Yurt",
      selfIntroduction: "Merhaba, ben Ahmet Yılmaz. Bilgisayar mühendisliği öğrencisiyim ve yazılım geliştirme konusunda ilgiliyim.",
      // Valid: empty relatives and references (both are optional)
      relatives: [],
      // Invalid: empty educationHistory (required, min 1)
      educationHistory: [],
      references: [],
    };

    const result = ScholarshipApplicationSchema.safeParse(invalidApplication);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errorMessages = result.error.issues.map((issue) => issue.message);
      expect(errorMessages.some((msg) => msg.includes("eğitim geçmişi") || msg.includes("En az 1"))).toBe(true);
    }
  });

  it("should fail with too many relatives (> 50)", () => {
    const invalidApplication = {
      // Static fields (minimal valid)
      name: "Ahmet",
      surname: "Yılmaz",
      phone: "05551234567",
      email: "ahmet@example.com",
      birthDate: "2000-01-15",
      gender: "Erkek",
      birthPlace: "Ankara",
      hometown: "Ankara",
      tcNumber: "12345678950",
      idIssueDate: "2018-01-01",
      idIssuePlace: "Ankara",
      maritalStatus: "Bekar",
      bankAccount: "Ziraat Bankası",
      ibanNumber: "TR330006100519786457841326",
      university: "Ankara Üniversitesi",
      faculty: "Mühendislik Fakültesi",
      department: "Bilgisayar Mühendisliği",
      grade: "3",
      physicalDisability: "Hayır",
      healthProblem: "Hayır",
      familyMonthlyIncome: 15000,
      familyMonthlyExpenses: 12000,
      scholarshipIncome: "Hayır",
      permanentAddress: "Ankara, Çankaya, Kızılay Mahallesi, Atatürk Bulvarı No: 123",
      currentAccommodation: "Yurt",
      selfIntroduction: "Merhaba, ben Ahmet Yılmaz. Bilgisayar mühendisliği öğrencisiyim ve yazılım geliştirme konusunda ilgiliyim.",
      // Invalid: 51 relatives (> 50 max)
      relatives: Array(51).fill({
        kinship: "Kardeş",
        name: "Test",
        surname: "Test",
        birthDate: "2000-01-15",
        education: "Üniversite",
        occupation: "Öğrenci",
        healthInsurance: "SGK",
        healthDisability: "Hayır",
        income: 0,
        phone: "05551234567",
      }),
      educationHistory: [
        {
          schoolName: "Ankara Üniversitesi",
          startDate: "2018-09-01",
          endDate: "2022-06-30",
          graduation: "Evet",
          department: "Bilgisayar Mühendisliği",
          percentage: 85.5,
        },
      ],
      references: [
        {
          relationship: "Hoca",
          fullName: "Mehmet Demir",
          isAcddMember: "Evet",
          job: "Profesör",
          address: "Ankara Üniversitesi, Bilgisayar Mühendisliği Bölümü, Ankara",
          phone: "05551234567",
        },
      ],
    };

    const result = ScholarshipApplicationSchema.safeParse(invalidApplication);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errorMessages = result.error.issues.map((issue) => issue.message);
      expect(errorMessages.some((msg) => msg.includes("50"))).toBe(true);
    }
  });
});

