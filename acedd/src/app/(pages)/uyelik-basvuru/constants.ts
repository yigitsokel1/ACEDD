// Sprint 15.1: Yeni form şeması - constants

/**
 * Form field definitions for membership application
 * Sprint 15.1: Yeni alanlar ile güncellendi
 */
export const MEMBERSHIP_FORM_FIELDS = {
  gender: {
    label: "Cinsiyet",
    type: "select",
    options: [
      { value: "", label: "Seçiniz" },
      { value: "erkek", label: "Erkek" },
      { value: "kadın", label: "Kadın" },
    ],
    required: true,
  },
  bloodType: {
    label: "Kan Grubu",
    type: "select",
    options: [
      { value: "", label: "Seçiniz" },
      { value: "A_POSITIVE", label: "A Rh+" },
      { value: "A_NEGATIVE", label: "A Rh-" },
      { value: "B_POSITIVE", label: "B Rh+" },
      { value: "B_NEGATIVE", label: "B Rh-" },
      { value: "AB_POSITIVE", label: "AB Rh+" },
      { value: "AB_NEGATIVE", label: "AB Rh-" },
      { value: "O_POSITIVE", label: "0 Rh+" },
      { value: "O_NEGATIVE", label: "0 Rh-" },
    ],
    required: true,
  },
} as const;

/**
 * Form data interface
 * Sprint 15.1: Yeni form şeması
 */
export interface MembershipFormData {
  fullName: string;
  identityNumber: string;
  gender: "" | "erkek" | "kadın";
  bloodType: "" | "A_POSITIVE" | "A_NEGATIVE" | "B_POSITIVE" | "B_NEGATIVE" | "AB_POSITIVE" | "AB_NEGATIVE" | "O_POSITIVE" | "O_NEGATIVE";
  birthPlace: string;
  birthDate: string;
  city: string;
  phone: string;
  email: string;
  address: string;
  conditionsAccepted: boolean;
}
