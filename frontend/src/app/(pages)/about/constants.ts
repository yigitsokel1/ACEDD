import { FeatureCard, AboutContent } from './types';

// Hakkımızda sayfası içerik verileri
export const ABOUT_CONTENT: AboutContent = {
  title: "Hakkımızda",
  paragraphs: [
    "2015 yılında Acıpayam'da kurulan derneğimiz, bölgedeki öğrencilerin eğitim kalitesini artırmak ve öğrenme fırsatlarını çoğaltmak amacıyla kurulmuştur. Özellikle sosyo-ekonomik zorluklarla karşılaşan öğrencilere destek olmak ve eğitimde fırsat eşitliğini sağlamak temel hedefimizdir.",
    "Bugüne kadar bölgemizde 500'den fazla öğrenciye burs desteği sağladık, kütüphane ve laboratuvar imkanları geliştirdik. Eğitimle güçlenen bir Acıpayam vizyonumuz doğrultusunda çalışmalarımızı sürdürüyoruz."
  ],
  image: {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    alt: "Kütüphane"
  }
};

// Özellik kartları
export const FEATURE_CARDS: FeatureCard[] = [
  {
    id: 'egitimde-birlik',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    title: 'Eğitimde Birlik',
    description: 'Öğrenciler, öğretmenler ve veliler ile birlikte eğitim kalitesini artırıyoruz.',
    color: 'blue'
  },
  {
    id: 'basari-odaklilik',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    title: 'Başarı Odaklılık',
    description: 'Her öğrencinin potansiyelini keşfetmesi ve başarıya ulaşması için çalışıyoruz.',
    color: 'green'
  },
  {
    id: 'egitim-sevgisi',
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    title: 'Eğitim Sevgisi',
    description: 'Öğrenme sevgisini aşılamak ve yaşam boyu eğitimi desteklemek misyonumuz.',
    color: 'red'
  }
];
