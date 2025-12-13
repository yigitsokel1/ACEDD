/**
 * Default Content & Settings
 * 
 * Merkezi default content ve settings sistemi
 * Database'de yoksa bu değerler kullanılır
 * 
 * Source: Database export (2025-12-11)
 * Admin panelden güncellenen değerler bu default'ları override eder
 */

import type { PageContent } from "@/lib/types/setting";

/**
 * Default Site Information
 */
export const DEFAULT_SITE_INFO = {
  "site.name": "ACEDD",
  "site.description": "Acıpayam ve çevresindeki öğrencilerin eğitimlerini desteklemek için kurulmuş dernek",
  "site.logoUrl": "/images/logo.png",
  "site.faviconUrl": "/favicon.ico",
  "footer.text": "© 2026 ACEDD. Tüm hakları saklıdır.",
};

/**
 * Default Contact Information
 */
export const DEFAULT_CONTACT_INFO = {
  "contact.email": "acedd@acipayam.org",
  "contact.phone": "+90 532 655 40 90",
  "contact.address": "Yukarı Mahalle, Atatürk Bulvarı, No:32, Özcan Plaza, Kat 1, Acıpayam, Denizli, Türkiye",
};

/**
 * Default Social Media Links
 */
export const DEFAULT_SOCIAL_MEDIA = {
  "social.facebook": "https://facebook.com/acedd",
  "social.twitter": "https://twitter.com/acedd",
  "social.instagram": "https://instagram.com/acedd",
  "social.linkedin": "https://linkedin.com/company/acedd",
  "social.youtube": "https://youtube.com/@acedd",
};

/**
 * Default SEO Settings (per page)
 */
export const DEFAULT_SEO = {
  "seo.home.title": "ACEDD - Acıpayam Eğitim Derneği",
  "seo.home.description": "Acıpayam ve çevresindeki öğrencilerin eğitimlerini desteklemek için kurulmuş dernek",
  "seo.about.title": "Hakkımızda - ACEDD",
  "seo.about.description": "Acıpayam Eğitim Derneği hakkında bilgi edinin",
  "seo.scholarship.title": "Burs Başvurusu - ACEDD",
  "seo.scholarship.description": "Eğitim bursu için başvuru yapın",
  "seo.membership.title": "Üyelik Başvurusu - ACEDD",
  "seo.membership.description": "Derneğimize üye olmak için başvurun",
  "seo.donation.title": "Bağış Yap - ACEDD",
  "seo.donation.description": "Eğitime destek olmak için bağış yapın",
  "seo.contact.title": "İletişim - ACEDD",
  "seo.contact.description": "Bizimle iletişime geçin",
  "seo.events.title": "Etkinlikler - ACEDD",
  "seo.events.description": "Derneğimizin düzenlediği etkinlikler",
};

/**
 * Default content for all pages
 * Exported from database on 2025-12-11
 */
export const DEFAULT_PAGE_CONTENT: Record<string, PageContent> = {
  home: {
    heroTitle: "Acıpayam ve Çevresi Eğitimi Destekleme Derneği",
    intro: "Acıpayam ve çevresindeki öğrencilere eğitim desteği sağlayarak onların bulunmak ve eğitimde fırsat eşitliği konusunda toplumsal farkındalık oluşturmak amacıyla faaliyet gösteriyoruz.",
    primaryButtonText: "Burs Başvurusu Yap",
    secondaryButtonText: "Daha Fazla Bilgi",
    visualCardTitle: "Eğitimde Fırsat Eşitliği",
    visualCardDescription: "Her öğrencinin eşit şansı olmalı",
    missionTitle: "AMACIMIZ",
    missionDescription: "Acıpayam ve çevresindeki öğrencilere eğitim desteği sağlayarak onların gelişimine katkıda bulunmak ve eğitimde fırsat eşitliği konusunda toplumsal farkındalık oluşturmak.",
    missionFooter: "Dernek, hayırseverlerin ve eğitim gönüllülerinin destekleriyle bu faaliyetlerini sürdürerek Acıpayam ve çevresindeki gençlerin daha iyi bir eğitim almalarına ve geleceğe umutla bakmalarına yardımcı olmayı hedeflemektedir.",
    ctaTitle: "Hayırseverlerin ve Eğitim Gönüllülerinin Desteğiyle",
    ctaDescription: "Acıpayam ve çevresindeki gençlerin daha iyi bir eğitim almalarına ve geleceğe umutla bakmalarına yardımcı olmayı hedefliyoruz. Siz de bu hayırlı işe katkıda bulunun.",
    ctaPrimaryButtonText: "Burs Başvurusu Yap",
    ctaSecondaryButtonText: "Destek Ol",
    stats: [
      { value: "500+", label: "Bursiyer" },
      { value: "2M+", label: "Dağıtılan Burs" },
      { value: "15+", label: "Yıllık Deneyim" },
      { value: "95%", label: "Başarı Oranı" }
    ],
    missions: [
      {
        title: "Burs Vermek",
        description: "Maddi imkanları kısıtlı ancak başarılı öğrencilere, özellikle de üniversite öğrencilerine burslar vererek eğitimlerini sürdürmelerine destek olmaktadırlar. Burs miktarları ve koşulları, öğrencilerin ailevi durumları ve başarılarına göre değişiklik gösterebilmektedir."
      },
      {
        title: "Sosyal ve Kültürel Etkinlikler",
        description: "Öğrencilerin sadece akademik olarak değil, sosyal ve kültürel olarak da gelişimlerini desteklemek amacıyla yaz kampları, kariyer seminerleri, kültürel geziler ve sanat etkinlikleri gibi çeşitli organizasyonlar yapmaktadırlar. Bu etkinlikler, öğrencilerin kişisel gelişimlerine katkı sağlamanın yanı sıra farklı tecrübeler edinmelerine ve sosyalleşmelerine olanak tanır."
      },
      {
        title: "Eğitim Sevdalılarını Bir Araya Getirmek",
        description: "Acıpayam'lı iş adamları, bilim adamları, yöneticiler, öğretmenler ve sanatçılar gibi farklı meslek gruplarından insanları bir araya getirerek eğitim konusunda fikir alışverişi yapmalarını ve ortak projeler geliştirmelerini teşvik etmektedirler. Bu sayede Acıpayam'da eğitime verilen desteğin artırılması hedeflenmektedir."
      },
      {
        title: "Farkındalık Oluşturmak",
        description: "\"Parasızlık yüzünden okuyamadım\" diyen hiçbir öğrencinin kalmaması için yola çıkarak, eğitimde fırsat eşitliği konusunda toplumsal farkındalık oluşturmaya çalışmaktadırlar."
      }
    ],
    activities: [
      {
        title: "Burs Desteği",
        description: "Maddi imkanları kısıtlı öğrencilere"
      },
      {
        title: "Sosyal Etkinlikler",
        description: "Yaz kampları ve kariyer seminerleri"
      },
      {
        title: "Farkındalık",
        description: "Eğitimde fırsat eşitliği bilinci"
      }
    ],
    trustIndicators: [
      { label: "Güvenilir" },
      { label: "Hızlı" },
      { label: "Şeffaf" },
      { label: "Topluluk" }
    ],
  },
  
  about: {
    heroTitle: "Hakkımızda",
    intro: "Acıpayam ve çevresindeki öğrencilerin eğitimlerini desteklemek için kurulmuş dernek",
    missionVisionTitle: "Misyonumuz & Vizyonumuz",
    missionVisionSubtitle: "Derneğimizin temel ilkeleri ve hedefleri doğrultusunda hareket ediyoruz",
    missionVision: {
      mission: {
        id: "mission-1",
        icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z",
        color: "blue",
        title: "Misyonumuz",
        description: "Acıpayam ve çevresindeki öğrencilerin eğitim hayatlarına maddi ve manevi destek sağlayarak, potansiyellerini en üst düzeyde gerçekleştirmelerine, topluma faydalı bireyler olarak yetişmelerine ve eğitimde fırsat eşitliğinin sağlanmasına katkıda bulunmak."
      },
      vision: {
        id: "vision-1",
        icon: "M12 15l-3.5 1.85 0.67-3.9L6.34 10.2l3.94-0.57L12 6l1.72 3.63 3.94 0.57-2.83 2.75 0.67 3.9L12 15zm0-13C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z",
        color: "indigo",
        title: "Vizyonumuz",
        description: "Acıpayam ve çevresinde, maddi imkansızlıklar nedeniyle hiçbir öğrencinin eğitimden mahrum kalmadığı, her öğrencinin potansiyelini tam olarak gerçekleştirebildiği, eğitim kalitesinin sürekli yükseldiği ve fırsat eşitliğinin tam olarak sağlandığı aydınlık bir eğitim ortamı yaratmak."
      }
    },
    valuesTitle: "Temel İlkelerimiz",
    valuesSubtitle: "Bu misyonu gerçekleştirmek üzere dernek, aşağıdaki temel ilkeler doğrultusunda hareket eder:",
    valuesFooter: "bu misyonu doğrultusunda, gençlerin aydınlık bir geleceğe sahip olmaları için köprü vazifesi görmeyi ve bölgenin eğitim kalitesini artırmayı hedeflemektedir.",
    values: [
      {
        title: "Eğitime Erişim",
        description: "Maddi imkanları kısıtlı öğrencilere burs ve destek sağlayarak eğitime erişimlerini kolaylaştırıyoruz."
      },
      {
        title: "Kapsamlı Gelişim",
        description: "Öğrencilerin akademik, sosyal, kültürel ve kişisel gelişimlerini destekliyoruz."
      },
      {
        title: "Toplumsal Katılım",
        description: "Gönüllüler, hayırseverler ve paydaşlarla işbirliği yaparak eğitimde dayanışmayı güçlendiriyoruz."
      },
      {
        title: "Farkındalık Yaratma",
        description: "Eğitimdeki engelleri vurgulayarak toplumsal farkındalık oluşturuyor ve öğrenci kayıplarını önlüyoruz."
      }
    ],
    goalsTitle: "Hedefimiz",
    goalsSubtitle: "Acıpayam Çevresi Eğitimi Destekleme Derneği'nin Temel Hedefi",
    goalsMainTitle: "Ana Hedefimiz",
    goalsMainDescription: "Acıpayam ve çevresindeki öğrencilere kapsamlı bir eğitim desteği sunmak ve onların kişisel gelişimlerine katkıda bulunmaktır. Bu hedef doğrultusunda, dernek çeşitli faaliyetler yürüterek gençlerin geleceğe daha umutla bakmalarını sağlamayı amaçlar.",
    goalsActivitiesTitle: "Hedefe Ulaşmak İçin Yürütülen Faaliyetler",
    goalsActivitiesSubtitle: "Dernek, bu büyük hedefi gerçekleştirmek için somut adımlar atıyor:",
    goalsFooter: "Derneğimiz, tüm bu faaliyetlerini hayırseverlerin ve eğitim gönüllülerinin destekleriyle sürdürerek, Acıpayamlı gençlerin daha iyi bir eğitim almalarına ve aydınlık bir geleceğe adım atmalarına yardımcı olmayı kendine hedef edinmiştir.",
    goals: [
      {
        title: "Burs İmkanları Sunmak",
        description: "Maddi imkanları kısıtlı ancak akademik olarak başarılı öğrencilere, özellikle üniversite öğrencilerine burslar sağlayarak eğitim hayatlarını destekliyoruz. Burs miktarları, öğrencinin ailevi durumu ve başarı düzeyi göz önünde bulundurularak belirleniyor."
      },
      {
        title: "Sosyal ve Kültürel Gelişimi Desteklemek",
        description: "Öğrencilerin ders başarılarının yanı sıra sosyal ve kültürel gelişimlerine de önem veriyoruz. Yaz kampları, kariyer seminerleri, kültürel geziler ve sanat etkinlikleri düzenleyerek öğrencilerin kişisel yeteneklerini keşfetmelerine ve sosyal becerilerini geliştirmelerine yardımcı oluyoruz."
      },
      {
        title: "Eğitim Gönüllülerini Bir Araya Getirmek",
        description: "Acıpayam ve çevresinden farklı meslek gruplarından eğitim sevdalılarını bir araya getiriyoruz. Bu buluşmalar, eğitim konusunda fikir alışverişi ve yeni projeler geliştirilmesini teşvik ederek bölgedeki eğitim desteğini artırmayı hedefliyor."
      },
      {
        title: "Toplumsal Farkındalık Oluşturmak",
        description: "Parasızlık yüzünden okuyamayan tek bir öğrencinin bile kalmaması için çabalıyoruz. Eğitimde fırsat eşitliği konusunda toplumsal farkındalık yaratmaya yönelik çalışmalar yürütüyoruz."
      }
    ],
    jobDescriptionsTitle: "Görev Tanımları",
    jobDescriptions: [
      { title: "Genel Kurul", description: "Derneğin en yetkili karar organıdır, tüm üyeleri kapsar." },
      { title: "Yönetim Kurulu", description: "Derneği temsil eder ve faaliyetleri yürütür." },
      { title: "Denetim Kurulu", description: "Mali ve idari işlemleri kontrol eder. (İç denetim)" },
      { title: "Dernek Başkanı", description: "Derneğin yürütmesinden ve temsilinden birinci derecede sorumludur." },
      { title: "Genel Sekreter", description: "Yazışmalar, toplantı tutanakları ve kayıtların tutulmasından sorumludur." },
      { title: "Sayman", description: "Gelir-gider takibi, bütçe hazırlığı ve raporlamadan sorumludur." },
      { title: "Burs Komisyonu", description: "Burs başvurularını değerlendirir, burs verilecek öğrencileri belirler." },
      { title: "Proje Koordinatörü", description: "Eğitim destek projelerini planlar ve yürütür. (Eğitim destek projeleri)" },
      { title: "Üye İlişkileri", description: "Yeni üyelerle iletişim, başvuru yönetimi ve bilgilendirme işlerini yürütür. (Başvurular, iletişim)" },
      { title: "Eğitim Koordinatörü", description: "Gönüllü eğitmenlerle birlikte eğitim faaliyetlerini organize eder." },
      { title: "Bursiyer Takip Ekibi", description: "Burs verilen öğrencilerin gelişim süreçlerini izler, raporlar oluşturur." },
      { title: "Gönüllü Eğitmenler", description: "Eğitim faaliyetlerinde aktif olarak görev alan gönüllü eğitmenler." }
    ],
    organizationStructureTitle: "Organizasyon Yapımız",
    organizationStructureDescription: "Derneğimiz, hiyerarşik bir yapıda organize edilmiş olup, her birim kendi sorumluluk alanında etkin bir şekilde çalışmaktadır. Bu yapı sayesinde eğitim destek faaliyetlerimizi daha verimli ve koordineli bir şekilde yürütmekteyiz.",
  },
  
  scholarship: {
    heroTitle: "Burs Başvurusu",
    intro: "Eğitim hayatınızı desteklemek için burs başvurusu yapabilirsiniz. Başvurunuzu eksiksiz doldurarak değerlendirme sürecine katılın.",
    requirements: [
      "Acıpayam ve çevresinde ikamet etmek",
      "Lise veya üniversite öğrencisi olmak",
      "Not ortalaması 2.5 ve üzeri olmak",
      "Maddi ihtiyaç durumu belgesi sunmak",
      "Aile gelir durumu belgesi sunmak",
      "Kimlik belgesi fotokopisi",
      "Öğrenci belgesi",
      "Son dönem not dökümü"
    ],
    applicationSteps: [
      { 
        id: "step-1",
        step: 1,
        icon: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 12h6M9 16h6M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z",
        color: "blue",
        title: "Form Doldurma",
        description: "Başvuru formunu eksiksiz doldurun"
      },
      { 
        id: "step-2",
        step: 2,
        icon: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
        color: "green",
        title: "Belge Yükleme",
        description: "Gerekli belgeleri yükleyin"
      },
      { 
        id: "step-3",
        step: 3,
        icon: "M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM21 21l-4.35-4.35",
        color: "purple",
        title: "Değerlendirme",
        description: "Başvurunuz değerlendirilir"
      },
      { 
        id: "step-4",
        step: 4,
        icon: "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3",
        color: "emerald",
        title: "Sonuç",
        description: "Sonuç size bildirilir"
      }
    ],
  },
  
  membership: {
    heroTitle: "Üyelik Başvurusu",
    intro: "Aşağıdaki formu doldurarak bize gönderdiğiniz takdirde mümkün olan en kısa sürede size geri dönüş yapacağız.",
    additionalInfoTitle: "Başvuru Hakkında",
    additionalInfoDescription: "Üyelik başvurunuz değerlendirildikten sonra size e-posta veya telefon ile geri dönüş yapılacaktır. Sorularınız için bizimle iletişime geçebilirsiniz.",
    membershipConditionsText: "Deneme",
  },
  
  donation: {
    heroTitle: "Bağış Yap",
    intro: "Acıpayam ve Çevresi Eğitim Destekleme Derneği'ne doğrudan Banka Havale ve EFT ile dilediğiniz tutarda bağışta bulunabilirsiniz.",
    introduction: "Aşağıda yer alan; USD, EURO, TL hesaplarımıza havale/EFT ile bağışta bulunabilirsiniz.",
    thankYouTitle: "Bağışınız İçin Teşekkürler",
    thankYouDescription: "Bağışınız, Acıpayam ve çevresindeki öğrencilerin eğitimlerini desteklemek için kullanılacaktır. Her bağışınız, bir öğrencinin geleceğini aydınlatmaya yardımcı olur.",
    contactMessage: "Bağış konusunda sorularınız için bizimle iletişime geçebilirsiniz.",
    bankAccounts: [
      {
        id: "bank-try",
        icon: "M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2M2 16v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2M6 12h.01M10 12h.01M14 12h.01M18 12h.01M7 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM11 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM15 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM19 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0z",
        color: "blue",
        currency: "TÜRK LİRASI",
        bank: "Ziraat Bankası",
        accountName: "ACIPAYAM VE ÇEVRESİ EĞİTİMİ DESTEKLEME DERNEĞİ",
        iban: "TR 53 0001 0000 8994 7314 5650 01"
      },
      {
        id: "bank-usd",
        icon: "M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2M2 16v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2M6 12h.01M10 12h.01M14 12h.01M18 12h.01M7 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM11 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM15 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM19 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0z",
        color: "green",
        currency: "USD",
        bank: "Ziraat Bankası",
        accountName: "ACIPAYAM VE ÇEVRESİ EĞİTİMİ DESTEKLEME DERNEĞİ",
        iban: "TR 53 0001 0000 8994 7314 5650 02"
      },
      {
        id: "bank-eur",
        icon: "M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2M2 16v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2M6 12h.01M10 12h.01M14 12h.01M18 12h.01M7 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM11 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM15 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM19 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0z",
        color: "indigo",
        currency: "EURO",
        bank: "Ziraat Bankası",
        accountName: "ACIPAYAM VE ÇEVRESİ EĞİTİMİ DESTEKLEME DERNEĞİ",
        iban: "TR 53 0001 0000 8994 7314 5650 03"
      }
    ],
  },
  
  contact: {
    heroTitle: "İletişim",
    intro: "Sorularınız, önerileriniz veya destek talepleriniz için bizimle iletişime geçin.",
    infoSectionTitle: "İletişim Bilgileri",
    infoSectionDescription: "Size en uygun yöntemle bizimle iletişime geçebilirsiniz",
    contactInfoItems: [
      {
        id: "contact-address",
        icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
        color: "blue",
        title: "Adres",
        description: "Dernek merkezimiz Acıpayam'da bulunmaktadır"
      },
      {
        id: "contact-phone",
        icon: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
        color: "green",
        title: "Telefon",
        description: "Bizimle iletişime geçin"
      },
      {
        id: "contact-email",
        icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
        color: "purple",
        title: "E-posta",
        description: "E-posta ile iletişime geçin"
      }
    ],
  },
  
  events: {
    heroTitle: "Etkinliklerimiz",
    intro: "Eğitim, sosyal sorumluluk ve motivasyon etkinlikleri ile toplumumuza değer katıyoruz.",
    ctaTitle: "Etkinliklerimize Katılmak İster misiniz?",
    ctaSubtitle: "Güncel etkinliklerimizi takip edin ve size uygun olanlara katılın.",
    ctaPrimaryButtonText: "Etkinlikleri Görüntüle",
    ctaSecondaryButtonText: "İletişime Geç",
  },
};

