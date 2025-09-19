import { BoardMember, BoardContent } from './types';

// Yönetim Kurulu sayfası içerik verileri
export const BOARD_CONTENT: BoardContent = {
  title: "Yönetim Kurulu",
  description: "Derneğimizin eğitim misyonunu başarıyla yürütmekten sorumlu, alanında uzman ve deneyimli yönetim kurulu üyelerimiz.",
  image: {
    src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    alt: "Öğrenciler"
  }
};

// Yönetim kurulu üyeleri
export const BOARD_MEMBERS: BoardMember[] = [
  {
    id: 'mehmet-ozkan',
    name: 'Dr. Mehmet Özkan',
    position: 'Başkan',
    description: 'Eğitim alanında 25 yıllık deneyimi olan derneğimizin kurucu başkanı',
    email: 'mehmet.ozkan@acipayamegitimdernegi.org',
    phone: '+90 258 611 2345',
    initials: 'DMÖ'
  },
  {
    id: 'ayse-yilmaz',
    name: 'Ayşe Yılmaz',
    position: 'Başkan Yardımcısı',
    description: 'Sosyal hizmetler uzmanı, öğrenci gelişimi konusunda uzman',
    email: 'ayse.yilmaz@acipayamegitimdernegi.org',
    phone: '+90 258 611 2346',
    initials: 'AY'
  },
  {
    id: 'mustafa-kaya',
    name: 'Mustafa Kaya',
    position: 'Genel Sekreter',
    description: 'Mali işler ve organizasyon konularında 15 yıllık deneyim',
    email: 'mustafa.kaya@acipayamegitimdernegi.org',
    phone: '+90 258 611 2347',
    initials: 'MK'
  },
  {
    id: 'fatma-demir',
    name: 'Fatma Demir',
    position: 'Mali İşler Sorumlusu',
    description: 'Muhasebe ve finans konularında uzman, derneğin mali işlerini yönetir',
    email: 'fatma.demir@acipayamegitimdernegi.org',
    phone: '+90 258 611 2348',
    initials: 'FD'
  },
  {
    id: 'ali-celik',
    name: 'Ali Çelik',
    position: 'Eğitim Koordinatörü',
    description: 'Eğitim programları ve kurs organizasyonu konularında uzman',
    email: 'ali.celik@acipayamegitimdernegi.org',
    phone: '+90 258 611 2349',
    initials: 'AÇ'
  },
  {
    id: 'zeynep-arslan',
    name: 'Zeynep Arslan',
    position: 'İletişim Sorumlusu',
    description: 'Halkla ilişkiler ve iletişim konularında deneyimli',
    email: 'zeynep.arslan@acipayamegitimdernegi.org',
    phone: '+90 258 611 2350',
    initials: 'ZA'
  }
];
