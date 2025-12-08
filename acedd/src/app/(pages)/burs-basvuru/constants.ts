export const SCHOLARSHIP_FORM_FIELDS = {
  generalInfo: {
    title: "Genel Bilgi",
    fields: {
      name: {
        label: "İsim",
        placeholder: "Adınızı girin",
        required: true,
      },
      surname: {
        label: "Soyisim",
        placeholder: "Soyadınızı girin",
        required: true,
      },
      phone: {
        label: "Telefon numarası",
        placeholder: "+90 5XX XXX XX XX",
        required: true,
      },
      email: {
        label: "E-posta",
        placeholder: "ornek@email.com",
        required: true,
      },
      birthDate: {
        label: "Doğum Tarihi (Ör: 10.20.2020)",
        placeholder: "mm/dd/yyyy",
        type: "date",
        required: true,
      },
      birthPlace: {
        label: "Doğum yeri",
        placeholder: "Doğum yerinizi girin",
        required: true,
      },
      tcNumber: {
        label: "TC. Kimlik no",
        placeholder: "TC kimlik numaranızı girin",
        required: true,
      },
      idIssuePlace: {
        label: "Verildiği yer",
        placeholder: "Kimliğin verildiği yeri girin",
        required: true,
      },
      idIssueDate: {
        label: "Kimlik veriliş tarihi",
        placeholder: "mm/dd/yyyy",
        type: "date",
        required: true,
      },
      gender: {
        label: "Cinsiyet",
        type: "select",
        options: ["Erkek", "Kadın"],
        required: true,
      },
      maritalStatus: {
        label: "Medeni hal",
        type: "select",
        options: ["Bekar", "Evli", "Boşanmış", "Dul"],
        required: true,
      },
      hometown: {
        label: "Memleket",
        placeholder: "Memleketinizi girin",
        required: true,
      },
      bankAccount: {
        label: "Banka hesabınız",
        placeholder: "Banka hesap bilgilerinizi girin",
        required: true,
      },
      ibanNumber: {
        label: "İBAN NO",
        placeholder: "TR00 0000 0000 0000 0000 0000 00",
        required: true,
      },
      university: {
        label: "Üniversiteniz",
        placeholder: "Üniversite adını girin",
        required: true,
      },
      faculty: {
        label: "Fakülte /Bölüm",
        placeholder: "Fakülte ve bölümünüzü girin",
        required: true,
      },
      grade: {
        label: "Hangi sınıf",
        placeholder: "Sınıfınızı girin",
        required: true,
      },
      turkeyRanking: {
        label: "Türkiye sıralamanız",
        placeholder: "Sıralamanızı girin",
        type: "number",
        required: true,
      },
      physicalDisability: {
        label: "Fiziksel engeliniz var mı?",
        type: "select",
        options: ["Hayır", "Evet"],
        required: true,
      },
      healthProblem: {
        label: "Sağlık sorununuz var mı?",
        type: "select",
        options: ["Hayır", "Evet"],
        required: true,
      },
      familyMonthlyIncome: {
        label: "Ailenizin aylık toplam geliri",
        placeholder: "Aylık gelir miktarını girin",
        type: "number",
        required: true,
      },
      familyMonthlyExpenses: {
        label: "Ailenizin aylık toplam zorunlu gideri",
        placeholder: "Aylık gider miktarını girin",
        type: "number",
        required: true,
      },
      scholarshipIncome: {
        label: "Burs veya kredi geliriniz var mı?",
        type: "select",
        options: ["Hayır", "Evet"],
        required: true,
      },
      alternativePhone: {
        label: "Alternatif iletişim numarası",
        placeholder: "+90 5XX XXX XX XX",
        required: false,
      },
      permanentAddress: {
        label: "Daimi ikamet adresiniz",
        placeholder: "Daimi adresinizi girin",
        required: true,
      },
      currentAccommodation: {
        label: "Mevcut konaklama",
        placeholder: "Konaklama durumunuzu açıklayın",
        required: true,
      },
      interests: {
        label: "İlgi alanları",
        placeholder: "İlgi alanlarınızı yazın",
        required: false,
      },
      selfIntroduction: {
        label: "Kendini tanıt",
        placeholder: "Kendinizi tanıtın",
        type: "textarea",
        rows: 4,
        required: true,
      },
    },
  },
  relativesInfo: {
    title: "Yaşamakta olan akrabalar (Anne, baba, kardeş gibi)",
    fields: {
      kinship: {
        label: "Akrabalık derecesi",
        placeholder: "Anne, baba, kardeş vb.",
        required: true,
      },
      name: {
        label: "İsim",
        placeholder: "Adını girin",
        required: true,
      },
      surname: {
        label: "Soyisim",
        placeholder: "Soyadını girin",
        required: true,
      },
      birthDate: {
        label: "Doğum Tarihi",
        placeholder: "mm/dd/yyyy",
        type: "date",
        required: true,
      },
      education: {
        label: "Öğrenim",
        placeholder: "Eğitim durumunu girin",
        required: true,
      },
      occupation: {
        label: "Meslek",
        placeholder: "Mesleğini girin",
        required: true,
      },
      job: {
        label: "İşi",
        placeholder: "İşini girin",
        required: true,
      },
      healthInsurance: {
        label: "Sağlık Sigortası",
        placeholder: "Sigorta durumunu girin",
        required: true,
      },
      healthDisability: {
        label: "Sağlık engeli",
        placeholder: "Engel durumunu girin",
        required: true,
      },
      income: {
        label: "Gelir",
        placeholder: "Aylık gelirini girin",
        type: "number",
        required: true,
      },
      phone: {
        label: "Telefon",
        placeholder: "+90 5XX XXX XX XX",
        required: true,
      },
      additionalNotes: {
        label: "Eklemek istedikleriniz",
        placeholder: "Ek bilgiler",
        type: "textarea",
        rows: 3,
        required: false,
      },
    },
  },
  educationHistory: {
    title: "Gitmiş olduğunuz okullar",
    fields: {
      schoolName: {
        label: "Gittiğiniz Okul",
        placeholder: "Okul adını girin",
        required: true,
      },
      startDate: {
        label: "Başlama",
        placeholder: "mm/dd/yyyy",
        type: "date",
        required: true,
      },
      endDate: {
        label: "Bitiş",
        placeholder: "mm/dd/yyyy",
        type: "date",
        required: true,
      },
      graduation: {
        label: "Mezuniyet",
        placeholder: "Mezuniyet durumunu girin",
        required: true,
      },
      department: {
        label: "Bölüm",
        placeholder: "Bölümünü girin",
        required: true,
      },
      percentage: {
        label: "Yüzde",
        placeholder: "Başarı yüzdesini girin",
        type: "number",
        required: true,
      },
    },
  },
  references: {
    title: "Referans - (lar)",
    fields: {
      relationship: {
        label: "İlişki",
        placeholder: "İlişki derecesini girin",
        required: true,
      },
      fullName: {
        label: "İsim Soyisim",
        placeholder: "Ad soyadını girin",
        required: true,
      },
      isAcddMember: {
        label: "AÇDD üyesi mi?",
        type: "select",
        options: ["Evet", "Hayır"],
        required: true,
      },
      job: {
        label: "İş",
        placeholder: "Mesleğini girin",
        required: true,
      },
      address: {
        label: "Adres",
        placeholder: "Adresini girin",
        required: true,
      },
      phone: {
        label: "Telefon",
        placeholder: "+90 5XX XXX XX XX",
        required: true,
      },
    },
  },
} as const;

/**
 * Sprint 11: SCHOLARSHIP_REQUIREMENTS and APPLICATION_STEPS moved to settings
 * These are now managed via Admin UI (content.scholarship.requirements, content.scholarship.applicationSteps)
 * 
 * Form field definitions (SCHOLARSHIP_FORM_FIELDS) remain here as they are technical configuration.
 */
