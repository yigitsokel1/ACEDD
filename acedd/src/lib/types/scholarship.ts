/**
 * Scholarship Application Types
 * 
 * Sprint 7: Burs başvuruları için domain types
 */

export type ScholarshipApplicationStatus = "PENDING" | "APPROVED" | "REJECTED" | "UNDER_REVIEW";

/**
 * Relative (Akraba) bilgisi
 */
export interface ScholarshipRelative {
  kinship: string;
  name: string;
  surname: string;
  birthDate: string;
  education: string;
  occupation: string;
  job: string;
  healthInsurance: string;
  healthDisability: string;
  income: number;
  phone: string;
  additionalNotes?: string;
}

/**
 * Education History (Eğitim Geçmişi) bilgisi
 */
export interface ScholarshipEducationHistory {
  schoolName: string;
  startDate: string;
  endDate: string;
  graduation: string;
  department: string;
  percentage: number;
}

/**
 * Reference (Referans) bilgisi
 */
export interface ScholarshipReference {
  relationship: string;
  fullName: string;
  isAcddMember: string; // "Evet" | "Hayır"
  job: string;
  address: string;
  phone: string;
}

/**
 * Scholarship Application (Burs Başvurusu)
 */
export interface ScholarshipApplication {
  id: string;
  // Genel Bilgi
  fullName: string;
  email: string;
  phone: string;
  alternativePhone?: string;
  birthDate: string; // ISO 8601
  birthPlace: string;
  tcNumber: string;
  idIssuePlace: string;
  idIssueDate: string; // ISO 8601
  gender: string; // "Erkek" | "Kadın"
  maritalStatus: string; // "Bekar" | "Evli" | "Boşanmış" | "Dul"
  hometown: string;
  permanentAddress: string;
  currentAccommodation: string;
  // Banka Bilgileri
  bankAccount: string;
  ibanNumber: string;
  // Üniversite Bilgileri
  university: string;
  faculty: string;
  department?: string;
  grade: string;
  turkeyRanking?: number;
  // Sağlık ve Engellilik
  physicalDisability: string; // "Hayır" | "Evet"
  healthProblem: string; // "Hayır" | "Evet"
  // Aile Bilgileri
  familyMonthlyIncome: number;
  familyMonthlyExpenses: number;
  scholarshipIncome: string; // "Hayır" | "Evet"
  // Ek Bilgiler
  interests?: string;
  selfIntroduction: string;
  // İlişkili Veriler (JSON parsed)
  relatives?: ScholarshipRelative[];
  educationHistory?: ScholarshipEducationHistory[];
  references?: ScholarshipReference[];
  documents?: string[]; // Dataset ID'leri
  // Durum ve İnceleme
  status: ScholarshipApplicationStatus;
  reviewedBy?: string; // AdminUser ID
  reviewedAt?: string; // ISO 8601
  reviewNotes?: string;
  // Metadata
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

/**
 * Create Scholarship Application Request
 * (Form submission data)
 */
export interface CreateScholarshipApplicationRequest {
  // Genel Bilgi
  name: string;
  surname: string;
  phone: string;
  email: string;
  alternativePhone?: string;
  birthDate: string;
  birthPlace: string;
  tcNumber: string;
  idIssuePlace: string;
  idIssueDate: string;
  gender: string;
  maritalStatus: string;
  hometown: string;
  permanentAddress: string;
  currentAccommodation: string;
  // Banka Bilgileri
  bankAccount: string;
  ibanNumber: string;
  // Üniversite Bilgileri
  university: string;
  faculty: string;
  department?: string;
  grade: string;
  turkeyRanking: number;
  // Sağlık ve Engellilik
  physicalDisability: string;
  healthProblem: string;
  // Aile Bilgileri
  familyMonthlyIncome: number;
  familyMonthlyExpenses: number;
  scholarshipIncome: string;
  // Ek Bilgiler
  interests?: string;
  selfIntroduction: string;
  // İlişkili Veriler
  relatives: ScholarshipRelative[];
  educationHistory: ScholarshipEducationHistory[];
  references: ScholarshipReference[];
  documents?: string[]; // Dataset ID'leri (opsiyonel, ileride eklenebilir)
}

/**
 * Update Scholarship Application Status Request
 * (Admin tarafından durum güncelleme)
 */
export interface UpdateScholarshipApplicationStatusRequest {
  status: "APPROVED" | "REJECTED" | "UNDER_REVIEW";
  reviewNotes?: string;
}
