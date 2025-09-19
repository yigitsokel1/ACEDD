import { Users, BookOpen, Heart, Award, Target } from "lucide-react";

export const HOME_STATS = [
  { label: "Desteklenen Öğrenci", value: "500+", icon: Users },
  { label: "Verilen Burs", value: "1.2M ₺", icon: Award },
  { label: "Aktif Gönüllü", value: "50+", icon: Heart },
  { label: "Başarı Oranı", value: "%95", icon: Target },
] as const;

export const HOME_SERVICES = [
  {
    title: "Eğitim Bursları",
    description: "İhtiyaç sahibi öğrencilere maddi destek sağlıyoruz.",
    icon: BookOpen,
  },
  {
    title: "Kitap Yardımları",
    description: "Ders kitapları ve kaynak materyaller temin ediyoruz.",
    icon: BookOpen,
  },
  {
    title: "Mentorluk Programı",
    description: "Deneyimli gönüllülerle öğrencileri buluşturuyoruz.",
    icon: Users,
  },
] as const;

export const HERO_CONTENT = {
  title: "Eğitime Destek, Geleceğe Umut",
  subtitle: "Acıpayam ve çevresindeki öğrencilerin eğitimlerini desteklemek, onlara daha parlak bir gelecek sunmak için çalışıyoruz.",
  primaryButton: {
    text: "Burs Başvurusu Yap",
    href: "/burs-basvuru",
  },
  secondaryButton: {
    text: "Hakkımızda Daha Fazla",
    href: "/hakkimizda",
  },
} as const;

export const CTA_CONTENT = {
  title: "Birlikte Daha Güçlüyüz",
  subtitle: "Eğitime destek olmak, geleceği şekillendirmek için bizimle birlikte hareket edin.",
  primaryButton: {
    text: "İletişime Geç",
    href: "/iletisim",
  },
  secondaryButton: {
    text: "Derneğimizi Tanıyın",
    href: "/hakkimizda",
  },
} as const;
