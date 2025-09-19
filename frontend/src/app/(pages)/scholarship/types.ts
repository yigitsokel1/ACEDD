// Burs Başvuru sayfası için özel tipler
export interface ScholarshipFormData {
  adSoyad: string;
  email: string;
  telefon: string;
  universite: string;
  bolum: string;
  sinif: string;
  gpa: string;
  aileGelir: string;
  acilDurum: string;
  motivasyon: string;
}

export interface ScholarshipContent {
  title: string;
  description: string;
  successTitle: string;
  successDescription: string;
}

export interface FormSection {
  id: string;
  title: string;
  fields: FormField[];
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'select' | 'textarea';
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
}
