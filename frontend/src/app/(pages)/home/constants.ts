import { StatCard, MissionCard, ActivityCard, TrustIndicator, HeroSection } from './types';
import { ROUTES } from '@/lib/constants';

// Ana sayfa hero section verileri
export const HERO_DATA: HeroSection = {
  title: "Acıpayam ve Çevresi Eğitimi Destekleme Derneği",
  description: "Acıpayam ve çevresindeki öğrencilere eğitim desteği sağlayarak onların bulunmak ve eğitimde fırsat eşitliği konusunda toplumsal farkındalık oluşturmak amacıyla faaliyet gösteriyoruz.",
  primaryButton: {
    text: "Burs Başvurusu Yap",
    href: ROUTES.SCHOLARSHIP
  },
  secondaryButton: {
    text: "Daha Fazla Bilgi",
    href: ROUTES.ABOUT
  }
};

// İstatistik kartları
export const STATS_DATA: StatCard[] = [
  {
    id: 'bursiyer',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    value: '500+',
    label: 'Bursiyer',
    color: 'blue'
  },
  {
    id: 'burs',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    value: '2M+',
    label: 'Dağıtılan Burs',
    color: 'amber'
  },
  {
    id: 'deneyim',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    value: '15+',
    label: 'Yıllık Deneyim',
    color: 'emerald'
  },
  {
    id: 'basari',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    value: '95%',
    label: 'Başarı Oranı',
    color: 'rose'
  }
];

// Misyon kartları
export const MISSION_DATA: MissionCard[] = [
  {
    id: 'burs-vermek',
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    title: 'Burs Vermek',
    description: 'Maddi imkanları kısıtlı ancak başarılı öğrencilere, özellikle de üniversite öğrencilerine burslar vererek eğitimlerini sürdürmelerine destek olmaktadırlar. Burs miktarları ve koşulları, öğrencilerin ailevi durumları ve başarılarına göre değişiklik gösterebilmektedir.',
    color: 'blue'
  },
  {
    id: 'sosyal-etkinlikler',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    title: 'Sosyal ve Kültürel Etkinlikler',
    description: 'Öğrencilerin sadece akademik olarak değil, sosyal ve kültürel olarak da gelişimlerini desteklemek amacıyla yaz kampları, kariyer seminerleri, kültürel geziler ve sanat etkinlikleri gibi çeşitli organizasyonlar yapmaktadırlar. Bu etkinlikler, öğrencilerin kişisel gelişimlerine katkı sağlamanın yanı sıra farklı tecrübeler edinmelerine ve sosyalleşmelerine olanak tanır.',
    color: 'amber'
  },
  {
    id: 'egitim-sevdalilari',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    title: 'Eğitim Sevdalılarını Bir Araya Getirmek',
    description: 'Acıpayam\'lı iş adamları, bilim adamları, yöneticiler, öğretmenler ve sanatçılar gibi farklı meslek gruplarından insanları bir araya getirerek eğitim konusunda fikir alışverişi yapmalarını ve ortak projeler geliştirmelerini teşvik etmektedirler. Bu sayede Acıpayam\'da eğitime verilen desteğin artırılması hedeflenmektedir.',
    color: 'emerald'
  },
  {
    id: 'farkindalik',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    title: 'Farkındalık Oluşturmak',
    description: '"Parasızlık yüzünden okuyamadım" diyen hiçbir öğrencinin kalmaması için yola çıkarak, eğitimde fırsat eşitliği konusunda toplumsal farkındalık oluşturmaya çalışmaktadırlar.',
    color: 'rose'
  }
];

// Aktivite kartları (sağ taraftaki visual card)
export const ACTIVITY_DATA: ActivityCard[] = [
  {
    id: 'burs-destegi',
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    title: 'Burs Desteği',
    description: 'Maddi imkanları kısıtlı öğrencilere',
    color: 'blue'
  },
  {
    id: 'sosyal-etkinlikler',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    title: 'Sosyal Etkinlikler',
    description: 'Yaz kampları ve kariyer seminerleri',
    color: 'amber'
  },
  {
    id: 'farkindalik',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    title: 'Farkındalık',
    description: 'Eğitimde fırsat eşitliği bilinci',
    color: 'emerald'
  }
];

// Güven göstergeleri
export const TRUST_INDICATORS: TrustIndicator[] = [
  {
    id: 'guvenilir',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    label: 'Güvenilir'
  },
  {
    id: 'hizli',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    label: 'Hızlı'
  },
  {
    id: 'seffaf',
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    label: 'Şeffaf'
  },
  {
    id: 'topluluk',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    label: 'Topluluk'
  }
];
