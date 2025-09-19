import { Users, Target, Award, Heart, BookOpen, Globe } from "lucide-react";

export const VALUES = [
  {
    title: "Eğitimde Fırsat Eşitliği",
    description: "Her öğrencinin kaliteli eğitime erişim hakkı olduğuna inanıyoruz.",
    icon: BookOpen,
  },
  {
    title: "Toplumsal Dayanışma",
    description: "Birlikte daha güçlü olduğumuzu ve dayanışmanın gücüne inanıyoruz.",
    icon: Heart,
  },
  {
    title: "Sürdürülebilir Gelişim",
    description: "Uzun vadeli ve sürdürülebilir eğitim destekleri sağlıyoruz.",
    icon: Globe,
  },
  {
    title: "Şeffaflık ve Hesap Verebilirlik",
    description: "Tüm faaliyetlerimizde şeffaflık ve hesap verebilirlik ilkesini benimsiyoruz.",
    icon: Award,
  },
] as const;

export const TEAM_MEMBERS = [
  {
    name: "Ahmet Yılmaz",
    position: "Dernek Başkanı",
    bio: "Eğitim alanında 20 yıllık deneyime sahip, öğrenci gelişimine odaklanan bir lider.",
  },
  {
    name: "Fatma Demir",
    position: "Genel Sekreter",
    bio: "Sosyal sorumluluk projelerinde uzman, toplumsal fayda odaklı çalışmalar yürütüyor.",
  },
  {
    name: "Mehmet Kaya",
    position: "Mali İşler Sorumlusu",
    bio: "Mali yönetim ve kaynak geliştirme konularında deneyimli, şeffaf yönetim anlayışına sahip.",
  },
] as const;

export const HISTORY_TIMELINE = [
  {
    year: "2020",
    title: "Kuruluş",
    description: "Acıpayam ve çevresindeki eğitim sorunlarına çözüm üretmek amacıyla derneğimiz kuruldu. İlk yılımızda 50 öğrenciye burs desteği sağladık.",
  },
  {
    year: "2021",
    title: "Genişleme",
    description: "Mentorluk programını başlattık ve kitap yardımı projesini hayata geçirdik. Desteklediğimiz öğrenci sayısı 150'ye ulaştı.",
  },
  {
    year: "2022",
    title: "Dijitalleşme",
    description: "Online başvuru sistemini kurduk ve sosyal medya hesaplarımızı aktif hale getirdik. Daha geniş kitlelere ulaşmaya başladık.",
  },
  {
    year: "2023",
    title: "Büyüme",
    description: "Desteklediğimiz öğrenci sayısı 500'ü aştı. Yeni sponsorluk anlaşmaları imzaladık ve etkinlik programlarımızı genişlettik.",
  },
] as const;

export const MISSION_VISION = {
  mission: {
    title: "Misyonumuz",
    description: "Acıpayam ve çevresindeki öğrencilerin eğitim hayatlarını desteklemek, onlara eşit eğitim fırsatları sunmak ve geleceklerini şekillendirmelerine yardımcı olmak için çalışıyoruz. Maddi imkansızlıklar nedeniyle eğitim hayatlarında zorluk yaşayan öğrencilere burs, kitap, kırtasiye ve mentorluk desteği sağlıyoruz.",
    icon: Target,
  },
  vision: {
    title: "Vizyonumuz",
    description: "Eğitimde fırsat eşitliğinin sağlandığı, her öğrencinin potansiyelini gerçekleştirebildiği bir toplum yaratmak. Bölgemizdeki eğitim kalitesini artırmak ve öğrencilerin akademik başarılarını destekleyerek onları geleceğin liderleri olmaya hazırlamak.",
    icon: Award,
  },
} as const;
