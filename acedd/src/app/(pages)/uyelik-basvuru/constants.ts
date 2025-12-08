export interface FormData {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
  birthDate: string;
  academicLevel: string;
  maritalStatus: string;
  hometown: string;
  placeOfBirth: string;
  nationality: string;
  currentAddress: string;
  tcId: string;
  lastValidDate: string;
}

/**
 * Sprint 11: MEMBERSHIP_CONTENT moved to settings
 * Content is now managed via Admin UI (content.membership.*)
 * 
 * FORM_FIELDS remains here as technical configuration (form field definitions)
 */

export const FORM_FIELDS = {
  gender: [
    { value: "", label: "Seçiniz" },
    { value: "erkek", label: "Erkek" },
    { value: "kadın", label: "Kadın" }
  ],
  academicLevel: [
    { value: "", label: "Seçiniz" },
    { value: "ilkokul", label: "İlkokul" },
    { value: "ortaokul", label: "Ortaokul" },
    { value: "lise", label: "Lise" },
    { value: "onlisans", label: "Önlisans" },
    { value: "lisans", label: "Lisans" },
    { value: "yukseklisans", label: "Yüksek Lisans" },
    { value: "doktora", label: "Doktora" }
  ],
  maritalStatus: [
    { value: "", label: "Seçiniz" },
    { value: "bekar", label: "Bekar" },
    { value: "evli", label: "Evli" },
    { value: "dul", label: "Dul" },
    { value: "bosanmis", label: "Boşanmış" }
  ]
};

