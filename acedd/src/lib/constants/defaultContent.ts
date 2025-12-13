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
 * Database'de yoksa bu değerler kullanılır
 * SQL export formatında string olarak saklanır (tırnak işaretleriyle)
 */
export const DEFAULT_SITE_INFO: Record<string, string> = {
  "site.name": "ACEDD",
  "site.description": "Acıpayam ve çevresindeki öğrencilerin eğitimlerini desteklemek için kurulmuş dernek",
  "site.logoUrl": "/images/logo.png",
  "site.faviconUrl": "/favicon.ico",
  "footer.text": "© 2026 ACEDD. Tüm hakları saklıdır.",
};

/**
 * Default Contact Information
 * Database'de yoksa bu değerler kullanılır
 * SQL export formatında string olarak saklanır (tırnak işaretleriyle)
 */
export const DEFAULT_CONTACT_INFO: Record<string, string> = {
  "contact.email": "acedd@acipayam.org",
  "contact.phone": "+90 532 655 40 90",
  "contact.address": "Yukarı Mahalle, Atatürk Bulvarı, No:32, Özcan Plaza, Kat 1, Acıpayam, Denizli, Türkiye",
};

/**
 * Default Social Media Links
 * Database'de yoksa bu değerler kullanılır
 * SQL export formatında string olarak saklanır (tırnak işaretleriyle)
 */
export const DEFAULT_SOCIAL_MEDIA: Record<string, string> = {
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
      { id: "stat-0", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", value: "500+", label: "Bursiyer", color: "blue" },
      { id: "stat-1", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", value: "2M+", label: "Dağıtılan Burs", color: "amber" },
      { id: "stat-2", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", value: "15+", label: "Yıllık Deneyim", color: "emerald" },
      { id: "stat-3", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z", value: "95%", label: "Başarı Oranı", color: "rose" }
    ],
    missions: [
      {
        id: "mission-0",
        icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
        title: "Burs Vermek",
        description: "Maddi imkanları kısıtlı ancak başarılı öğrencilere, özellikle de üniversite öğrencilerine burslar vererek eğitimlerini sürdürmelerine destek olmaktadırlar. Burs miktarları ve koşulları, öğrencilerin ailevi durumları ve başarılarına göre değişiklik gösterebilmektedir.",
        color: "blue"
      },
      {
        id: "mission-1",
        icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
        title: "Sosyal ve Kültürel Etkinlikler",
        description: "Öğrencilerin sadece akademik olarak değil, sosyal ve kültürel olarak da gelişimlerini desteklemek amacıyla yaz kampları, kariyer seminerleri, kültürel geziler ve sanat etkinlikleri gibi çeşitli organizasyonlar yapmaktadırlar. Bu etkinlikler, öğrencilerin kişisel gelişimlerine katkı sağlamanın yanı sıra farklı tecrübeler edinmelerine ve sosyalleşmelerine olanak tanır.",
        color: "amber"
      },
      {
        id: "mission-2",
        icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
        title: "Eğitim Sevdalılarını Bir Araya Getirmek",
        description: "Acıpayam'lı iş adamları, bilim adamları, yöneticiler, öğretmenler ve sanatçılar gibi farklı meslek gruplarından insanları bir araya getirerek eğitim konusunda fikir alışverişi yapmalarını ve ortak projeler geliştirmelerini teşvik etmektedirler. Bu sayede Acıpayam'da eğitime verilen desteğin artırılması hedeflenmektedir.",
        color: "emerald"
      },
      {
        id: "mission-3",
        icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
        title: "Farkındalık Oluşturmak",
        description: "\"Parasızlık yüzünden okuyamadım\" diyen hiçbir öğrencinin kalmaması için yola çıkarak, eğitimde fırsat eşitliği konusunda toplumsal farkındalık oluşturmaya çalışmaktadırlar.",
        color: "rose"
      }
    ],
    activities: [
      {
        id: "activity-0",
        icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
        title: "Burs Desteği",
        description: "Maddi imkanları kısıtlı öğrencilere",
        color: "blue"
      },
      {
        id: "activity-1",
        icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
        title: "Sosyal Etkinlikler",
        description: "Yaz kampları ve kariyer seminerleri",
        color: "amber"
      },
      {
        id: "activity-2",
        icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
        title: "Farkındalık",
        description: "Eğitimde fırsat eşitliği bilinci",
        color: "emerald"
      }
    ],
    trustIndicators: [
      { id: "trust-0", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label: "Güvenilir" },
      { id: "trust-1", icon: "M13 10V3L4 14h7v7l9-11h-7z", label: "Hızlı" },
      { id: "trust-2", icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z", label: "Şeffaf" },
      { id: "trust-3", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", label: "Topluluk" }
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
        id: "value-0",
        icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
        title: "Eğitime Erişim",
        description: "Maddi imkanları kısıtlı öğrencilere burs ve destek sağlayarak eğitime erişimlerini kolaylaştırıyoruz.",
        color: "indigo"
      },
      {
        id: "value-1",
        icon: "M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11",
        title: "Kapsamlı Gelişim",
        description: "Öğrencilerin akademik, sosyal, kültürel ve kişisel gelişimlerini destekliyoruz.",
        color: "indigo"
      },
      {
        id: "value-2",
        icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
        title: "Toplumsal Katılım",
        description: "Gönüllüler, hayırseverler ve paydaşlarla işbirliği yaparak eğitimde dayanışmayı güçlendiriyoruz.",
        color: "indigo"
      },
      {
        id: "value-3",
        icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
        title: "Farkındalık Yaratma",
        description: "Eğitimdeki engelleri vurgulayarak toplumsal farkındalık oluşturuyor ve öğrenci kayıplarını önlüyoruz.",
        color: "indigo"
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
        id: "goal-0",
        icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
        title: "Burs İmkanları Sunmak",
        description: "Maddi imkanları kısıtlı ancak akademik olarak başarılı öğrencilere, özellikle üniversite öğrencilerine burslar sağlayarak eğitim hayatlarını destekliyoruz. Burs miktarları, öğrencinin ailevi durumu ve başarı düzeyi göz önünde bulundurularak belirleniyor.",
        color: "emerald"
      },
      {
        id: "goal-1",
        icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
        title: "Sosyal ve Kültürel Gelişimi Desteklemek",
        description: "Öğrencilerin ders başarılarının yanı sıra sosyal ve kültürel gelişimlerine de önem veriyoruz. Yaz kampları, kariyer seminerleri, kültürel geziler ve sanat etkinlikleri düzenleyerek öğrencilerin kişisel yeteneklerini keşfetmelerine ve sosyal becerilerini geliştirmelerine yardımcı oluyoruz.",
        color: "emerald"
      },
      {
        id: "goal-2",
        icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
        title: "Eğitim Gönüllülerini Bir Araya Getirmek",
        description: "Acıpayam ve çevresinden farklı meslek gruplarından eğitim sevdalılarını bir araya getiriyoruz. Bu buluşmalar, eğitim konusunda fikir alışverişi ve yeni projeler geliştirilmesini teşvik ederek bölgedeki eğitim desteğini artırmayı hedefliyor.",
        color: "emerald"
      },
      {
        id: "goal-3",
        icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
        title: "Toplumsal Farkındalık Oluşturmak",
        description: "Parasızlık yüzünden okuyamayan tek bir öğrencinin bile kalmaması için çabalıyoruz. Eğitimde fırsat eşitliği konusunda toplumsal farkındalık yaratmaya yönelik çalışmalar yürütüyoruz.",
        color: "emerald"
      }
    ],
    jobDescriptionsTitle: "Görev Tanımları",
    jobDescriptions: [
      { id: "job-0", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", title: "Genel Kurul", description: "Derneğin en yetkili karar organıdır, tüm üyeleri kapsar.", color: "purple" },
      { id: "job-1", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", title: "Yönetim Kurulu", description: "Derneği temsil eder ve faaliyetleri yürütür.", color: "blue" },
      { id: "job-2", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z", title: "Denetim Kurulu", description: "Mali ve idari işlemleri kontrol eder. (İç denetim)", color: "blue" },
      { id: "job-3", icon: "M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z", title: "Dernek Başkanı", description: "Derneğin yürütmesinden ve temsilinden birinci derecede sorumludur.", color: "green" },
      { id: "job-4", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", title: "Genel Sekreter", description: "Yazışmalar, toplantı tutanakları ve kayıtların tutulmasından sorumludur.", color: "orange" },
      { id: "job-5", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", title: "Sayman", description: "Gelir-gider takibi, bütçe hazırlığı ve raporlamadan sorumludur.", color: "orange" },
      { id: "job-6", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01", title: "Burs Komisyonu", description: "Burs başvurularını değerlendirir, burs verilecek öğrencileri belirler.", color: "orange" },
      { id: "job-7", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", title: "Proje Koordinatörü", description: "Eğitim destek projelerini planlar ve yürütür. (Eğitim destek projeleri)", color: "orange" },
      { id: "job-8", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", title: "Üye İlişkileri", description: "Yeni üyelerle iletişim, başvuru yönetimi ve bilgilendirme işlerini yürütür. (Başvurular, iletişim)", color: "indigo" },
      { id: "job-9", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", title: "Eğitim Koordinatörü", description: "Gönüllü eğitmenlerle birlikte eğitim faaliyetlerini organize eder.", color: "indigo" },
      { id: "job-10", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", title: "Bursiyer Takip Ekibi", description: "Burs verilen öğrencilerin gelişim süreçlerini izler, raporlar oluşturur.", color: "indigo" },
      { id: "job-11", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", title: "Gönüllü Eğitmenler", description: "Eğitim faaliyetlerinde aktif olarak görev alan gönüllü eğitmenler.", color: "pink" }
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

