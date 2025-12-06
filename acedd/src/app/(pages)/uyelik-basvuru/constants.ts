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

export const MEMBERSHIP_CONTENT = {
  hero: {
    title: "Üyelik Başvurusu",
    description: "Aşağıdaki formu doldurarak bize gönderdiğiniz takdirde mümkün olan en kısa sürede size geri dönüş yapacağız."
  },
  form: {
    title: "Üyelik Başvuru Formu",
    description: "Tüm alanları doldurarak başvurunuzu tamamlayın"
  },
  additionalInfo: {
    title: "Başvuru Hakkında",
    description: "Üyelik başvurunuz değerlendirildikten sonra size e-posta veya telefon ile geri dönüş yapılacaktır. Sorularınız için bizimle iletişime geçebilirsiniz.",
    email: "Acedd@acipayam.org"
  }
};

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

