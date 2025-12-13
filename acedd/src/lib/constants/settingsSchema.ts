/**
 * Settings Schema & Validation System
 * 
 * Bu dosya admin panel ayarlar sistemi için:
 * - Field tanımları
 * - Validation kuralları
 * - Default değerler
 * - Örnek formatlar
 * sağlar.
 */

import { DEFAULT_PAGE_CONTENT } from "./defaultContent";
import type { PageIdentifier } from "@/lib/types/setting";

/**
 * Field Types
 */
export type FieldType = 
  | "string" 
  | "text" 
  | "number" 
  | "boolean" 
  | "json-array" 
  | "json-object"
  | "string-array";

/**
 * Validation Rule Types
 */
export interface ValidationRule {
  type: "required" | "minLength" | "maxLength" | "min" | "max" | "pattern" | "custom";
  value?: any;
  message: string;
  validate?: (value: any) => boolean;
}

/**
 * Field Schema Definition
 */
export interface FieldSchema {
  key: string;
  label: string;
  type: FieldType;
  inputType?: "input" | "textarea" | "json";
  rows?: number;
  required?: boolean;
  validation?: ValidationRule[];
  helperText?: string;
  exampleFormat?: string;
  defaultValue?: any;
  placeholder?: string;
  // For JSON fields
  jsonSchema?: {
    type: "array" | "object";
    itemSchema?: Record<string, any>;
    requiredFields?: string[];
    exampleItem?: any;
  };
}

/**
 * Content Page Schema - Only for Content Tab
 * Other tabs (SiteInfo, Contact, Social, SEO) have their own dedicated components
 */
export const PAGE_SCHEMAS: Record<PageIdentifier, FieldSchema[]> = {
  home: [
    {
      key: "heroTitle",
      label: "Hero Başlık",
      type: "string",
      inputType: "input",
      required: true,
      validation: [
        { type: "required", message: "Hero başlık zorunludur" },
        { type: "minLength", value: 3, message: "En az 3 karakter olmalı" }
      ],
      helperText: "Ana sayfanın en üst kısmında görünecek ana başlık",
      defaultValue: DEFAULT_PAGE_CONTENT.home.heroTitle
    },
    {
      key: "intro",
      label: "Hero Açıklama",
      type: "text",
      inputType: "textarea",
      rows: 3,
      helperText: "Hero bölümündeki ana açıklama metni",
      defaultValue: DEFAULT_PAGE_CONTENT.home.intro
    },
    {
      key: "primaryButtonText",
      label: "Birincil Buton Metni",
      type: "string",
      inputType: "input",
      helperText: "Hero bölümündeki birincil buton metni (örn: 'Burs Başvurusu Yap')",
      defaultValue: DEFAULT_PAGE_CONTENT.home.primaryButtonText
    },
    {
      key: "secondaryButtonText",
      label: "İkincil Buton Metni",
      type: "string",
      inputType: "input",
      helperText: "Hero bölümündeki ikincil buton metni (örn: 'Daha Fazla Bilgi')",
      defaultValue: DEFAULT_PAGE_CONTENT.home.secondaryButtonText
    },
    {
      key: "visualCardTitle",
      label: "Görsel Kart Başlığı",
      type: "string",
      inputType: "input",
      helperText: "Hero bölümündeki sağ taraftaki görsel kartın başlığı",
      defaultValue: DEFAULT_PAGE_CONTENT.home.visualCardTitle
    },
    {
      key: "visualCardDescription",
      label: "Görsel Kart Açıklaması",
      type: "string",
      inputType: "input",
      helperText: "Görsel kartın altındaki kısa açıklama metni",
      defaultValue: DEFAULT_PAGE_CONTENT.home.visualCardDescription
    },
    {
      key: "missionTitle",
      label: "Misyon Bölümü Başlığı",
      type: "string",
      inputType: "input",
      helperText: "Misyon kartlarının üstündeki başlık (örn: 'AMACIMIZ')",
      defaultValue: DEFAULT_PAGE_CONTENT.home.missionTitle
    },
    {
      key: "missionDescription",
      label: "Misyon Bölümü Açıklaması",
      type: "text",
      inputType: "textarea",
      rows: 3,
      helperText: "Misyon kartlarının üstündeki açıklama metni",
      defaultValue: DEFAULT_PAGE_CONTENT.home.missionDescription
    },
    {
      key: "missionFooter",
      label: "Misyon Bölümü Alt Metni",
      type: "text",
      inputType: "textarea",
      rows: 2,
      helperText: "Misyon kartlarının altındaki kapanış metni",
      defaultValue: DEFAULT_PAGE_CONTENT.home.missionFooter
    },
    {
      key: "ctaTitle",
      label: "CTA Bölümü Başlığı",
      type: "string",
      inputType: "input",
      helperText: "Sayfa sonundaki CTA (Call to Action) bölümünün başlığı",
      defaultValue: DEFAULT_PAGE_CONTENT.home.ctaTitle
    },
    {
      key: "ctaDescription",
      label: "CTA Bölümü Açıklaması",
      type: "text",
      inputType: "textarea",
      rows: 3,
      helperText: "CTA bölümündeki açıklama metni",
      defaultValue: DEFAULT_PAGE_CONTENT.home.ctaDescription
    },
    {
      key: "ctaPrimaryButtonText",
      label: "CTA Birincil Buton Metni",
      type: "string",
      inputType: "input",
      helperText: "CTA bölümündeki birincil buton metni",
      defaultValue: DEFAULT_PAGE_CONTENT.home.ctaPrimaryButtonText
    },
    {
      key: "ctaSecondaryButtonText",
      label: "CTA İkincil Buton Metni",
      type: "string",
      inputType: "input",
      helperText: "CTA bölümündeki ikincil buton metni",
      defaultValue: DEFAULT_PAGE_CONTENT.home.ctaSecondaryButtonText
    },
    {
      key: "stats",
      label: "İstatistik Kartları",
      type: "json-array",
      inputType: "json",
      required: false,
      helperText: "Ana sayfadaki istatistik kartları. Her kart: value (string), label (string) içermelidir.",
      exampleFormat: `[
  { "value": "500+", "label": "Bursiyer" },
  { "value": "2M+", "label": "Dağıtılan Burs" }
]`,
      jsonSchema: {
        type: "array",
        itemSchema: {
          value: "string",
          label: "string"
        },
        requiredFields: ["value", "label"],
        exampleItem: { value: "500+", label: "Bursiyer" }
      },
      defaultValue: DEFAULT_PAGE_CONTENT.home.stats
    },
    {
      key: "missions",
      label: "Misyon Kartları",
      type: "json-array",
      inputType: "json",
      required: false,
      helperText: "Ana sayfadaki misyon kartları. Her kart: title (string), description (string) içermelidir.",
      exampleFormat: `[
  {
    "title": "Burs Vermek",
    "description": "Maddi imkanları kısıtlı öğrencilere burs sağlamak"
  }
]`,
      jsonSchema: {
        type: "array",
        itemSchema: {
          title: "string",
          description: "string"
        },
        requiredFields: ["title", "description"],
        exampleItem: { title: "Burs Vermek", description: "Maddi imkanları kısıtlı öğrencilere burs sağlamak" }
      },
      defaultValue: DEFAULT_PAGE_CONTENT.home.missions
    },
    {
      key: "activities",
      label: "Aktivite Kartları",
      type: "json-array",
      inputType: "json",
      required: false,
      helperText: "Ana sayfadaki aktivite kartları. Her kart: title (string), description (string) içermelidir.",
      exampleFormat: `[
  {
    "title": "Burs Desteği",
    "description": "Maddi imkanları kısıtlı öğrencilere"
  }
]`,
      jsonSchema: {
        type: "array",
        itemSchema: {
          title: "string",
          description: "string"
        },
        requiredFields: ["title", "description"],
        exampleItem: { title: "Burs Desteği", description: "Maddi imkanları kısıtlı öğrencilere" }
      },
      defaultValue: DEFAULT_PAGE_CONTENT.home.activities
    },
    {
      key: "trustIndicators",
      label: "Güven Göstergeleri",
      type: "json-array",
      inputType: "json",
      required: false,
      helperText: "Ana sayfadaki güven göstergeleri. Her öğe: label (string) içermelidir.",
      exampleFormat: `[
  { "label": "Güvenilir" },
  { "label": "Hızlı" }
]`,
      jsonSchema: {
        type: "array",
        itemSchema: {
          label: "string"
        },
        requiredFields: ["label"],
        exampleItem: { label: "Güvenilir" }
      },
      defaultValue: DEFAULT_PAGE_CONTENT.home.trustIndicators
    },
  ],
  
  scholarship: [
    {
      key: "heroTitle",
      label: "Hero Başlık",
      type: "string",
      inputType: "input",
      required: true,
      validation: [
        { type: "required", message: "Hero başlık zorunludur" }
      ],
      helperText: "Burs başvurusu sayfasının ana başlığı",
      defaultValue: DEFAULT_PAGE_CONTENT.scholarship.heroTitle
    },
    {
      key: "intro",
      label: "Hero Açıklama",
      type: "text",
      inputType: "textarea",
      rows: 4,
      required: true,
      helperText: "Hero bölümündeki açıklama metni",
      defaultValue: DEFAULT_PAGE_CONTENT.scholarship.intro
    },
    {
      key: "requirements",
      label: "Burs Gereksinimleri",
      type: "string-array",
      inputType: "json",
      required: false,
      helperText: "Burs başvurusu gereksinimleri listesi. Her öğe bir string olmalı.",
      exampleFormat: `[
  "Acıpayam ve çevresinde ikamet etmek",
  "Lise veya üniversite öğrencisi olmak"
]`,
      jsonSchema: {
        type: "array",
        exampleItem: "Acıpayam ve çevresinde ikamet etmek"
      },
      defaultValue: DEFAULT_PAGE_CONTENT.scholarship.requirements
    },
    {
      key: "applicationSteps",
      label: "Başvuru Adımları",
      type: "json-array",
      inputType: "json",
      required: false,
      helperText: "Başvuru adımları listesi. Her adım: step (number), title (string), description (string) içermelidir.",
      exampleFormat: `[
  {
    "step": 1,
    "title": "Form Doldurma",
    "description": "Başvuru formunu eksiksiz doldurun"
  }
]`,
      jsonSchema: {
        type: "array",
        itemSchema: {
          step: "number",
          title: "string",
          description: "string"
        },
        requiredFields: ["step", "title", "description"],
        exampleItem: { step: 1, title: "Form Doldurma", description: "Başvuru formunu eksiksiz doldurun" }
      },
      defaultValue: DEFAULT_PAGE_CONTENT.scholarship.applicationSteps
    },
  ],
  
  membership: [
    {
      key: "heroTitle",
      label: "Hero Başlık",
      type: "string",
      inputType: "input",
      required: true,
      helperText: "Üyelik başvurusu sayfasının ana başlığı",
      defaultValue: DEFAULT_PAGE_CONTENT.membership?.heroTitle || "Üyelik Başvurusu"
    },
    {
      key: "intro",
      label: "Hero Açıklama",
      type: "text",
      inputType: "textarea",
      rows: 4,
      required: true,
      helperText: "Hero bölümündeki açıklama metni",
      defaultValue: DEFAULT_PAGE_CONTENT.membership?.intro
    },
    {
      key: "additionalInfoTitle",
      label: "Başvuru Hakkında Başlığı",
      type: "string",
      inputType: "input",
      required: false,
      helperText: "Sayfa altındaki bilgilendirme bölümünün başlığı",
      defaultValue: DEFAULT_PAGE_CONTENT.membership?.additionalInfoTitle
    },
    {
      key: "additionalInfoDescription",
      label: "Başvuru Hakkında Açıklaması",
      type: "text",
      inputType: "textarea",
      rows: 3,
      required: false,
      helperText: "Bilgilendirme bölümündeki açıklama metni",
      defaultValue: DEFAULT_PAGE_CONTENT.membership?.additionalInfoDescription
    },
  ],
  
  about: [
    {
      key: "heroTitle",
      label: "Hero Başlık",
      type: "string",
      inputType: "input",
      required: true,
      helperText: "Hakkımızda sayfasının ana başlığı",
      defaultValue: DEFAULT_PAGE_CONTENT.about?.heroTitle || "Hakkımızda"
    },
    {
      key: "intro",
      label: "Hero Açıklama",
      type: "text",
      inputType: "textarea",
      rows: 4,
      helperText: "Hero bölümündeki açıklama metni",
      defaultValue: DEFAULT_PAGE_CONTENT.about?.intro
    },
    {
      key: "missionVisionTitle",
      label: "Misyon/Vizyon Bölümü Başlığı",
      type: "string",
      inputType: "input",
      helperText: "Misyon ve Vizyon bölümünün başlığı",
      defaultValue: DEFAULT_PAGE_CONTENT.about?.missionVisionTitle
    },
    {
      key: "missionVisionSubtitle",
      label: "Misyon/Vizyon Bölümü Alt Başlığı",
      type: "string",
      inputType: "input",
      helperText: "Misyon ve Vizyon bölümünün alt başlığı",
      defaultValue: DEFAULT_PAGE_CONTENT.about?.missionVisionSubtitle
    },
    {
      key: "missionVision",
      label: "Misyon ve Vizyon",
      type: "json-object",
      inputType: "json",
      helperText: "Misyon ve vizyon bilgileri. Yapı: { mission: { title, description }, vision: { title, description } }. Icon ve color otomatik eklenir.",
      exampleFormat: `{
  "mission": {
    "title": "Misyonumuz",
    "description": "..."
  },
  "vision": {
    "title": "Vizyonumuz",
    "description": "..."
  }
}`,
      defaultValue: DEFAULT_PAGE_CONTENT.about?.missionVision
    },
    {
      key: "valuesTitle",
      label: "Değerler Bölümü Başlığı",
      type: "string",
      inputType: "input",
      helperText: "Değerler bölümünün başlığı",
      defaultValue: DEFAULT_PAGE_CONTENT.about?.valuesTitle
    },
    {
      key: "valuesSubtitle",
      label: "Değerler Bölümü Alt Başlığı",
      type: "text",
      inputType: "textarea",
      rows: 2,
      helperText: "Değerler bölümünün alt başlığı/açıklaması",
      defaultValue: DEFAULT_PAGE_CONTENT.about?.valuesSubtitle
    },
    {
      key: "valuesFooter",
      label: "Değerler Bölümü Alt Metni",
      type: "text",
      inputType: "textarea",
      rows: 2,
      helperText: "Değerler bölümünün altındaki kapanış metni",
      defaultValue: DEFAULT_PAGE_CONTENT.about?.valuesFooter
    },
    {
      key: "values",
      label: "Değerler",
      type: "json-array",
      inputType: "json",
      helperText: "Temel değerler listesi. Her değer: title (string), description (string). Icon ve color otomatik eklenir.",
      exampleFormat: `[
  {
    "title": "Eğitime Erişim",
    "description": "Maddi imkanları kısıtlı öğrencilere burs ve destek sağlayarak eğitime erişimlerini kolaylaştırıyoruz."
  }
]`,
      jsonSchema: {
        type: "array",
        itemSchema: {
          title: "string",
          description: "string"
        },
        requiredFields: ["title", "description"],
        exampleItem: { title: "Eğitime Erişim", description: "..." }
      },
      defaultValue: DEFAULT_PAGE_CONTENT.about?.values
    },
    {
      key: "goalsTitle",
      label: "Hedefler Bölümü Başlığı",
      type: "string",
      inputType: "input",
      helperText: "Hedefler bölümünün başlığı",
      defaultValue: DEFAULT_PAGE_CONTENT.about?.goalsTitle
    },
    {
      key: "goalsSubtitle",
      label: "Hedefler Bölümü Alt Başlığı",
      type: "string",
      inputType: "input",
      helperText: "Hedefler bölümünün alt başlığı",
      defaultValue: DEFAULT_PAGE_CONTENT.about?.goalsSubtitle
    },
    {
      key: "goalsMainTitle",
      label: "Ana Hedef Başlığı",
      type: "string",
      inputType: "input",
      helperText: "Ana hedef kartının başlığı",
      defaultValue: DEFAULT_PAGE_CONTENT.about?.goalsMainTitle
    },
    {
      key: "goalsMainDescription",
      label: "Ana Hedef Açıklaması",
      type: "text",
      inputType: "textarea",
      rows: 3,
      helperText: "Ana hedef kartının açıklama metni",
      defaultValue: DEFAULT_PAGE_CONTENT.about?.goalsMainDescription
    },
    {
      key: "goalsActivitiesTitle",
      label: "Faaliyetler Alt Başlığı",
      type: "string",
      inputType: "input",
      helperText: "Faaliyetler listesinin üstündeki başlık",
      defaultValue: DEFAULT_PAGE_CONTENT.about?.goalsActivitiesTitle
    },
    {
      key: "goalsActivitiesSubtitle",
      label: "Faaliyetler Alt Başlık Açıklaması",
      type: "string",
      inputType: "input",
      helperText: "Faaliyetler listesinin üstündeki açıklama",
      defaultValue: DEFAULT_PAGE_CONTENT.about?.goalsActivitiesSubtitle
    },
    {
      key: "goalsFooter",
      label: "Hedefler Bölümü Alt Metni",
      type: "text",
      inputType: "textarea",
      rows: 2,
      helperText: "Hedefler bölümünün altındaki kapanış metni",
      defaultValue: DEFAULT_PAGE_CONTENT.about?.goalsFooter
    },
    {
      key: "goals",
      label: "Hedefler",
      type: "json-array",
      inputType: "json",
      helperText: "Hedefler listesi. Her hedef: title (string), description (string). Icon ve color otomatik eklenir.",
      exampleFormat: `[
  {
    "title": "Burs İmkanları Sunmak",
    "description": "..."
  }
]`,
      jsonSchema: {
        type: "array",
        itemSchema: {
          title: "string",
          description: "string"
        },
        requiredFields: ["title", "description"],
        exampleItem: { title: "Burs İmkanları Sunmak", description: "..." }
      },
      defaultValue: DEFAULT_PAGE_CONTENT.about?.goals
    },
    {
      key: "jobDescriptionsTitle",
      label: "Görev Tanımları Başlığı",
      type: "string",
      inputType: "input",
      helperText: "Görev tanımları kartlarının üstündeki başlık",
      defaultValue: DEFAULT_PAGE_CONTENT.about?.jobDescriptionsTitle
    },
    {
      key: "jobDescriptions",
      label: "Görev Tanımları",
      type: "json-array",
      inputType: "json",
      helperText: "Görev tanımları listesi. Her görev: title (string), description (string). Icon ve color otomatik eklenir.",
      exampleFormat: `[
  {
    "title": "Genel Kurul",
    "description": "Derneğin en yetkili karar organıdır, tüm üyeleri kapsar."
  }
]`,
      jsonSchema: {
        type: "array",
        itemSchema: {
          title: "string",
          description: "string"
        },
        requiredFields: ["title", "description"],
        exampleItem: { title: "Genel Kurul", description: "..." }
      },
      defaultValue: DEFAULT_PAGE_CONTENT.about?.jobDescriptions
    },
    {
      key: "organizationStructureTitle",
      label: "Organizasyon Yapımız Başlığı",
      type: "string",
      inputType: "input",
      helperText: "Organizasyon yapısı bölümünün başlığı",
      defaultValue: DEFAULT_PAGE_CONTENT.about?.organizationStructureTitle
    },
    {
      key: "organizationStructureDescription",
      label: "Organizasyon Yapımız Açıklaması",
      type: "text",
      inputType: "textarea",
      rows: 3,
      helperText: "Organizasyon yapısı bölümündeki açıklama metni",
      defaultValue: DEFAULT_PAGE_CONTENT.about?.organizationStructureDescription
    },
  ],
  
  contact: [
    {
      key: "heroTitle",
      label: "Hero Başlık",
      type: "string",
      inputType: "input",
      required: true,
      helperText: "İletişim sayfasının ana başlığı",
      defaultValue: DEFAULT_PAGE_CONTENT.contact?.heroTitle || "İletişim"
    },
    {
      key: "intro",
      label: "Hero Açıklama",
      type: "text",
      inputType: "textarea",
      rows: 4,
      helperText: "Hero bölümündeki açıklama metni",
      defaultValue: DEFAULT_PAGE_CONTENT.contact?.intro
    },
    {
      key: "infoSectionTitle",
      label: "İletişim Bilgileri Bölümü Başlığı",
      type: "string",
      inputType: "input",
      helperText: "İletişim bilgileri kartlarının üstündeki başlık",
      defaultValue: DEFAULT_PAGE_CONTENT.contact?.infoSectionTitle
    },
    {
      key: "infoSectionDescription",
      label: "İletişim Bilgileri Bölümü Açıklaması",
      type: "text",
      inputType: "textarea",
      rows: 2,
      helperText: "İletişim bilgileri kartlarının üstündeki açıklama metni",
      defaultValue: DEFAULT_PAGE_CONTENT.contact?.infoSectionDescription
    },
    {
      key: "contactInfoItems",
      label: "İletişim Kartları",
      type: "json-array",
      inputType: "json",
      helperText: "İletişim bilgileri kartları. Her kart: title (string), description (string). Icon ve color otomatik eklenir.",
      exampleFormat: `[
  {
    "title": "Adres",
    "description": "Dernek merkezimiz Acıpayam'da bulunmaktadır"
  },
  {
    "title": "Telefon",
    "description": "Bizimle iletişime geçin"
  }
]`,
      jsonSchema: {
        type: "array",
        itemSchema: {
          title: "string",
          description: "string"
        },
        requiredFields: ["title"],
        exampleItem: { title: "Adres", description: "Dernek merkezimiz Acıpayam'da bulunmaktadır" }
      },
      defaultValue: DEFAULT_PAGE_CONTENT.contact?.contactInfoItems
    },
  ],
  
  events: [
    {
      key: "heroTitle",
      label: "Hero Başlık",
      type: "string",
      inputType: "input",
      required: true,
      helperText: "Etkinlikler sayfasının ana başlığı",
      defaultValue: DEFAULT_PAGE_CONTENT.events?.heroTitle || "Etkinliklerimiz"
    },
    {
      key: "intro",
      label: "Hero Açıklama",
      type: "text",
      inputType: "textarea",
      rows: 3,
      helperText: "Hero bölümündeki açıklama metni",
      defaultValue: DEFAULT_PAGE_CONTENT.events?.intro
    },
    {
      key: "ctaTitle",
      label: "CTA Bölümü Başlığı",
      type: "string",
      inputType: "input",
      helperText: "Sayfa sonundaki CTA bölümünün başlığı",
      defaultValue: DEFAULT_PAGE_CONTENT.events?.ctaTitle
    },
    {
      key: "ctaSubtitle",
      label: "CTA Bölümü Alt Başlığı",
      type: "string",
      inputType: "input",
      helperText: "CTA bölümündeki alt başlık",
      defaultValue: DEFAULT_PAGE_CONTENT.events?.ctaSubtitle
    },
    {
      key: "ctaPrimaryButtonText",
      label: "CTA Birincil Buton Metni",
      type: "string",
      inputType: "input",
      helperText: "CTA bölümündeki birincil buton metni",
      defaultValue: DEFAULT_PAGE_CONTENT.events?.ctaPrimaryButtonText
    },
    {
      key: "ctaSecondaryButtonText",
      label: "CTA İkincil Buton Metni",
      type: "string",
      inputType: "input",
      helperText: "CTA bölümündeki ikincil buton metni",
      defaultValue: DEFAULT_PAGE_CONTENT.events?.ctaSecondaryButtonText
    },
  ],
  
  donation: [
    {
      key: "heroTitle",
      label: "Hero Başlık",
      type: "string",
      inputType: "input",
      required: true,
      helperText: "Bağış yap sayfasının ana başlığı",
      defaultValue: DEFAULT_PAGE_CONTENT.donation?.heroTitle || "Bağış Yap"
    },
    {
      key: "intro",
      label: "Hero Açıklama",
      type: "text",
      inputType: "textarea",
      rows: 3,
      helperText: "Hero bölümündeki açıklama metni",
      defaultValue: DEFAULT_PAGE_CONTENT.donation?.intro
    },
    {
      key: "introduction",
      label: "Giriş Metni",
      type: "text",
      inputType: "textarea",
      rows: 2,
      helperText: "Banka hesapları bölümünün üstündeki giriş metni",
      defaultValue: DEFAULT_PAGE_CONTENT.donation?.introduction
    },
    {
      key: "thankYouTitle",
      label: "Teşekkür Bölümü Başlığı",
      type: "string",
      inputType: "input",
      helperText: "Bağış sonrası teşekkür bölümünün başlığı",
      defaultValue: DEFAULT_PAGE_CONTENT.donation?.thankYouTitle
    },
    {
      key: "thankYouDescription",
      label: "Teşekkür Bölümü Açıklaması",
      type: "text",
      inputType: "textarea",
      rows: 3,
      helperText: "Teşekkür bölümündeki açıklama metni",
      defaultValue: DEFAULT_PAGE_CONTENT.donation?.thankYouDescription
    },
    {
      key: "contactMessage",
      label: "İletişim Mesajı",
      type: "text",
      inputType: "textarea",
      rows: 2,
      helperText: "Teşekkür bölümünün altındaki iletişim mesajı",
      defaultValue: DEFAULT_PAGE_CONTENT.donation?.contactMessage
    },
    {
      key: "bankAccounts",
      label: "Banka Hesapları",
      type: "json-array",
      inputType: "json",
      helperText: "Banka hesap bilgileri. Her hesap: currency, bank, accountName, iban. Icon ve color otomatik eklenir.",
      exampleFormat: `[
  {
    "currency": "TÜRK LİRASI",
    "bank": "Ziraat Bankası",
    "accountName": "ACIPAYAM VE ÇEVRESİ EĞİTİMİ DESTEKLEME DERNEĞİ",
    "iban": "TR 53 0001 0000 8994 7314 5650 01"
  }
]`,
      jsonSchema: {
        type: "array",
        itemSchema: {
          currency: "string",
          bank: "string",
          accountName: "string",
          iban: "string"
        },
        requiredFields: ["currency", "bank", "accountName", "iban"],
        exampleItem: { currency: "TÜRK LİRASI", bank: "Ziraat Bankası", accountName: "...", iban: "TR..." }
      },
      defaultValue: DEFAULT_PAGE_CONTENT.donation?.bankAccounts
    },
  ],
};

/**
 * Validate a field value against its schema
 */
export function validateField(fieldSchema: FieldSchema, value: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check required
  if (fieldSchema.required && (value === null || value === undefined || value === "")) {
    errors.push(`${fieldSchema.label} zorunludur`);
    return { isValid: false, errors };
  }
  
  // If not required and empty, skip validation
  if (!value && !fieldSchema.required) {
    return { isValid: true, errors: [] };
  }
  
  // Run validation rules
  if (fieldSchema.validation) {
    for (const rule of fieldSchema.validation) {
      switch (rule.type) {
        case "required":
          if (!value) errors.push(rule.message);
          break;
        case "minLength":
          if (typeof value === "string" && value.length < rule.value) {
            errors.push(rule.message);
          }
          break;
        case "maxLength":
          if (typeof value === "string" && value.length > rule.value) {
            errors.push(rule.message);
          }
          break;
        case "pattern":
          if (typeof value === "string" && !new RegExp(rule.value).test(value)) {
            errors.push(rule.message);
          }
          break;
        case "custom":
          if (rule.validate && !rule.validate(value)) {
            errors.push(rule.message);
          }
          break;
      }
    }
  }
  
  // Validate JSON structure
  if (fieldSchema.type === "json-array" && fieldSchema.jsonSchema) {
    if (!Array.isArray(value)) {
      errors.push(`${fieldSchema.label} bir array olmalı`);
    } else {
      // Validate each item
      value.forEach((item, index) => {
        if (fieldSchema.jsonSchema?.requiredFields) {
          for (const requiredField of fieldSchema.jsonSchema.requiredFields) {
            if (!item[requiredField]) {
              errors.push(`${fieldSchema.label} - ${index + 1}. öğe: "${requiredField}" alanı zorunludur`);
            }
          }
        }
      });
    }
  }
  
  return { isValid: errors.length === 0, errors };
}

/**
 * Get default value for a field
 */
export function getFieldDefault(pageKey: PageIdentifier, fieldKey: string): any {
  const pageSchema = PAGE_SCHEMAS[pageKey];
  const fieldSchema = pageSchema?.find(f => f.key === fieldKey);
  
  if (fieldSchema?.defaultValue !== undefined) {
    return fieldSchema.defaultValue;
  }
  
  // Fallback to defaultContent
  const pageContent = DEFAULT_PAGE_CONTENT[pageKey];
  if (pageContent && pageContent[fieldKey] !== undefined) {
    return pageContent[fieldKey];
  }
  
  // Ultimate fallback based on type
  switch (fieldSchema?.type) {
    case "json-array":
    case "string-array":
      return [];
    case "json-object":
      return {};
    case "number":
      return 0;
    case "boolean":
      return false;
    default:
      return "";
  }
}

