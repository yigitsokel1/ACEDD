export const SCHOLARSHIP_FORM_FIELDS = {
  personalInfo: {
    title: "Kişisel Bilgiler",
    fields: {
      fullName: {
        label: "Ad Soyad",
        placeholder: "Adınızı ve soyadınızı girin",
        required: true,
      },
      email: {
        label: "E-posta",
        placeholder: "ornek@email.com",
        required: true,
      },
      phone: {
        label: "Telefon",
        placeholder: "+90 5XX XXX XX XX",
        required: true,
      },
      birthDate: {
        label: "Doğum Tarihi",
        type: "date",
        required: true,
      },
      address: {
        label: "Adres",
        placeholder: "Tam adresinizi girin",
        required: true,
      },
    },
  },
  educationInfo: {
    title: "Eğitim Bilgileri",
    fields: {
      schoolName: {
        label: "Okul Adı",
        placeholder: "Okulunuzun adını girin",
        required: true,
      },
      grade: {
        label: "Sınıf/Seviye",
        placeholder: "9. Sınıf, 1. Sınıf vb.",
        required: true,
      },
      gpa: {
        label: "Not Ortalaması",
        placeholder: "3.50",
        type: "number",
        step: "0.01",
        min: "0",
        max: "4",
        required: true,
      },
      department: {
        label: "Bölüm (Üniversite için)",
        placeholder: "Bölümünüzü girin",
        required: false,
      },
    },
  },
  familyInfo: {
    title: "Aile Bilgileri",
    fields: {
      familyIncome: {
        label: "Aylık Aile Geliri (TL)",
        placeholder: "5000",
        type: "number",
        required: true,
      },
      familyMembers: {
        label: "Aile Üye Sayısı",
        placeholder: "4",
        type: "number",
        required: true,
      },
      workingMembers: {
        label: "Çalışan Aile Üye Sayısı",
        placeholder: "2",
        type: "number",
        required: true,
      },
      familySituation: {
        label: "Aile Durumu",
        placeholder: "Ailenizin durumunu açıklayın",
        required: true,
      },
    },
  },
  motivation: {
    title: "Motivasyon ve Hedefler",
    fields: {
      motivation: {
        label: "Burs Başvuru Nedeniniz",
        placeholder: "Neden burs desteğine ihtiyacınız olduğunu açıklayın...",
        required: true,
        rows: 4,
      },
      goals: {
        label: "Eğitim Hedefleriniz",
        placeholder: "Eğitim hedeflerinizi ve gelecek planlarınızı yazın...",
        required: true,
        rows: 4,
      },
      achievements: {
        label: "Başarılarınız",
        placeholder: "Eğitim hayatınızdaki başarılarınızı yazın...",
        required: false,
        rows: 3,
      },
    },
  },
} as const;

export const SCHOLARSHIP_REQUIREMENTS = [
  "Acıpayam ve çevresinde ikamet etmek",
  "Lise veya üniversite öğrencisi olmak",
  "Not ortalaması 2.5 ve üzeri olmak",
  "Maddi ihtiyaç durumu belgesi sunmak",
  "Aile gelir durumu belgesi sunmak",
  "Kimlik belgesi fotokopisi",
  "Öğrenci belgesi",
  "Son dönem not dökümü",
] as const;

export const APPLICATION_STEPS = [
  {
    step: 1,
    title: "Form Doldurma",
    description: "Başvuru formunu eksiksiz doldurun",
  },
  {
    step: 2,
    title: "Belge Yükleme",
    description: "Gerekli belgeleri yükleyin",
  },
  {
    step: 3,
    title: "Değerlendirme",
    description: "Başvurunuz değerlendirilir",
  },
  {
    step: 4,
    title: "Sonuç",
    description: "Sonuç size bildirilir",
  },
] as const;
