import { ServiceCard, ServicesContent } from './types';

// Hizmetlerimiz sayfası içerik verileri
export const SERVICES_CONTENT: ServicesContent = {
  title: "Hizmetlerimiz",
  description: "Acıpayam ve çevresindeki öğrencilerin eğitim hayatlarını destekleyecek çeşitli hizmetler sunuyoruz. Her hizmetimiz, eğitimde fırsat eşitliği ve kaliteli öğrenme ortamları sağlama amacımız doğrultusunda şekillenmiştir."
};

// Hizmet kartları
export const SERVICE_CARDS: ServiceCard[] = [
  {
    id: 'burs-egitim',
    icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
    title: 'Burs ve Eğitim Desteği',
    description: 'İhtiyaç sahibi öğrenciler için burs programları, ders kitabı ve eğitim materyali desteği sağlayarak eğitime erişimi kolaylaştırıyoruz.',
    features: ['Üniversite Bursları', 'Lise Eğitim Desteği', 'Kitap ve Kırtasiye Yardımı'],
    color: 'blue'
  },
  {
    id: 'mentorluk',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    title: 'Mentörlük ve Rehberlik',
    description: 'Öğrencilerin akademik ve kişisel gelişimlerinde onlara rehberlik eden mentörlük programları düzenliyoruz.',
    features: ['Bireysel Mentörlük', 'Grup Rehberliği', 'Kariyer Danışmanlığı'],
    color: 'green'
  },
  {
    id: 'mesleki-kurslar',
    icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6',
    title: 'Mesleki Kurslar',
    description: 'Öğrencilerin iş hayatına hazırlanmasında faydalı olacak çeşitli mesleki beceri kursları düzenliyoruz.',
    features: ['Bilgisayar Kursu', 'İngilizce Kursu', 'Girişimcilik Eğitimi'],
    color: 'purple'
  },
  {
    id: 'kutuphane',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    title: 'Kütüphane ve Çalışma Alanları',
    description: 'Öğrencilerin ders çalışabilecekleri sessiz ortamlar ve zengin kütüphane imkanları sunuyoruz.',
    features: ['Ücretsiz Kütüphane', 'Çalışma Salonları', 'İnternet Erişimi'],
    color: 'orange'
  }
];
