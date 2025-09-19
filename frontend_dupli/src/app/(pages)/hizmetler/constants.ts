import { BookOpen, Users, Award, Heart, Laptop, Phone, Mail } from "lucide-react";

export const SERVICES = [
  {
    title: "Eğitim Bursları",
    description: "İhtiyaç sahibi öğrencilere aylık burs desteği sağlıyoruz. Burs miktarları öğrencinin ihtiyacına ve aile durumuna göre belirlenir.",
    icon: Award,
    features: [
      "Aylık 500-2000 TL arası burs desteği",
      "Yıllık değerlendirme ve yenileme",
      "Öğrenci başarı takibi",
      "Aile durumu analizi",
    ],
    requirements: [
      "Acıpayam ve çevresinde ikamet etmek",
      "Lise veya üniversite öğrencisi olmak",
      "Maddi ihtiyaç durumu belgesi",
      "Not ortalaması 2.5 ve üzeri",
    ],
  },
  {
    title: "Kitap ve Kırtasiye Yardımları",
    description: "Ders kitapları, kaynak materyaller ve kırtasiye malzemeleri temin ediyoruz.",
    icon: BookOpen,
    features: [
      "Ders kitapları temin etme",
      "Kaynak kitap desteği",
      "Kırtasiye malzemesi yardımı",
      "Dijital kaynak erişimi",
    ],
    requirements: [
      "Eğitim seviyesine uygun kitap ihtiyacı",
      "Maddi durum belgesi",
      "Okul kayıt belgesi",
    ],
  },
  {
    title: "Mentorluk Programı",
    description: "Deneyimli gönüllülerle öğrencileri buluşturarak akademik ve kişisel gelişimlerini destekliyoruz.",
    icon: Users,
    features: [
      "Birebir mentorluk desteği",
      "Kariyer rehberliği",
      "Ders çalışma teknikleri",
      "Motivasyon ve psikolojik destek",
    ],
    requirements: [
      "Programa katılım isteği",
      "Düzenli görüşme taahhüdü",
      "Gelişim raporları",
    ],
  },
  {
    title: "Sosyal Etkinlikler",
    description: "Öğrencilerin sosyal gelişimlerini desteklemek için çeşitli etkinlikler düzenliyoruz.",
    icon: Heart,
    features: [
      "Eğitim seminerleri",
      "Kültürel geziler",
      "Spor etkinlikleri",
      "Toplumsal projeler",
    ],
    requirements: [
      "Etkinliklere katılım isteği",
      "Yaş grubuna uygunluk",
      "Veli izni (18 yaş altı için)",
    ],
  },
  {
    title: "Dijital Eğitim Desteği",
    description: "Online eğitim platformlarına erişim ve teknolojik araçlar konusunda destek sağlıyoruz.",
    icon: Laptop,
    features: [
      "Online kurs erişimi",
      "Teknoloji eğitimi",
      "Dijital kaynak desteği",
      "Uzaktan eğitim araçları",
    ],
    requirements: [
      "Temel teknoloji kullanım bilgisi",
      "İnternet erişimi",
      "Eğitim hedefi belirleme",
    ],
  },
  {
    title: "Psikolojik Destek",
    description: "Öğrencilerin psikolojik sağlığını desteklemek için uzman psikologlarla çalışıyoruz.",
    icon: Heart,
    features: [
      "Bireysel psikolojik danışmanlık",
      "Grup terapileri",
      "Aile danışmanlığı",
      "Kriz müdahalesi",
    ],
    requirements: [
      "Psikolojik destek ihtiyacı",
      "Gönüllü katılım",
      "Gizlilik taahhüdü",
    ],
  },
] as const;

export const PROCESS_STEPS = [
  {
    step: "1",
    title: "Başvuru",
    description: "Online formu doldurun ve gerekli belgeleri yükleyin",
  },
  {
    step: "2",
    title: "Değerlendirme",
    description: "Başvurunuz uzman ekibimiz tarafından değerlendirilir",
  },
  {
    step: "3",
    title: "Görüşme",
    description: "Uygun adaylarla yüz yüze veya online görüşme yapılır",
  },
  {
    step: "4",
    title: "Onay",
    description: "Değerlendirme sonucu size bildirilir ve destek başlar",
  },
] as const;

export const CONTACT_INFO = [
  {
    title: "Telefon",
    value: "+90 258 XXX XX XX",
    icon: Phone,
  },
  {
    title: "E-posta",
    value: "info@acedd.org",
    icon: Mail,
  },
  {
    title: "Ofis",
    value: "Acıpayam, Denizli",
    icon: Users,
  },
] as const;

export const CTA_CONTENT = {
  title: "Hizmetlerimizden Yararlanmak İster misiniz?",
  subtitle: "Başvuru formunu doldurun ve size en uygun hizmeti belirleyelim.",
  primaryButton: {
    text: "Başvuru Yap",
    href: "/burs-basvuru",
  },
  secondaryButton: {
    text: "İletişime Geç",
    href: "/iletisim",
  },
} as const;
