import { Users, Target, Award, Heart, BookOpen, Globe, Users2, Shield, Lightbulb, HandHeart } from "lucide-react";

export const VALUES = [
  {
    title: "Eğitime Erişim",
    description: "Maddi imkanları kısıtlı öğrencilere burs ve destek sağlayarak eğitime erişimlerini kolaylaştırıyoruz.",
    icon: BookOpen,
  },
  {
    title: "Kapsamlı Gelişim",
    description: "Öğrencilerin akademik, sosyal, kültürel ve kişisel gelişimlerini destekliyoruz.",
    icon: Users2,
  },
  {
    title: "Toplumsal Katılım",
    description: "Gönüllüler, hayırseverler ve paydaşlarla işbirliği yaparak eğitimde dayanışmayı güçlendiriyoruz.",
    icon: HandHeart,
  },
  {
    title: "Farkındalık Yaratma",
    description: "Eğitimdeki engelleri vurgulayarak toplumsal farkındalık oluşturuyor ve öğrenci kayıplarını önlüyoruz.",
    icon: Lightbulb,
  },
] as const;

export const ORGANIZATION_STRUCTURE = [
  // Level 1
  {
    title: "Genel Kurul",
    description: "Derneğin en yetkili karar organıdır, tüm üyeleri kapsar.",
    level: 1,
    icon: Users,
  },
  // Level 2
  {
    title: "Yönetim Kurulu",
    description: "Derneği temsil eder ve faaliyetleri yürütür.",
    level: 2,
    icon: Shield,
    parent: 1,
  },
  {
    title: "Denetim Kurulu",
    description: "Mali ve idari işlemleri kontrol eder. (İç denetim)",
    level: 2,
    icon: Award,
    parent: 1,
    isDashed: true,
  },
  // Level 3
  {
    title: "Dernek Başkanı",
    description: "Derneğin yürütmesinden ve temsilinden birinci derecede sorumludur.",
    level: 3,
    icon: Target,
    parent: 2,
  },
  // Level 4
  {
    title: "Genel Sekreter",
    description: "Yazışmalar, toplantı tutanakları ve kayıtların tutulmasından sorumludur.",
    level: 4,
    icon: BookOpen,
    parent: 3,
  },
  {
    title: "Sayman",
    description: "Gelir-gider takibi, bütçe hazırlığı ve raporlamadan sorumludur.",
    level: 4,
    icon: Globe,
    parent: 3,
  },
  {
    title: "Burs Komisyonu",
    description: "Burs başvurularını değerlendirir, burs verilecek öğrencileri belirler.",
    level: 4,
    icon: Heart,
    parent: 3,
  },
  {
    title: "Proje Koordinatörü",
    description: "Eğitim destek projelerini planlar ve yürütür. (Eğitim destek projeleri)",
    level: 4,
    icon: Lightbulb,
    parent: 3,
  },
  // Level 5
  {
    title: "Üye İlişkileri",
    description: "Yeni üyelerle iletişim, başvuru yönetimi ve bilgilendirme işlerini yürütür. (Başvurular, iletişim)",
    level: 5,
    icon: Users2,
    parent: 4,
  },
  {
    title: "Eğitim Koordinatörü",
    description: "Gönüllü eğitmenlerle birlikte eğitim faaliyetlerini organize eder.",
    level: 5,
    icon: HandHeart,
    parent: 4,
  },
  {
    title: "Bursiyer Takip Ekibi",
    description: "Burs verilen öğrencilerin gelişim süreçlerini izler, raporlar oluşturur.",
    level: 5,
    icon: Shield,
    parent: 4,
  },
  // Level 6
  {
    title: "Gönüllü Eğitmenler",
    description: "Eğitim faaliyetlerinde aktif olarak görev alan gönüllü eğitmenler.",
    level: 6,
    icon: Users,
    parent: 5,
  },
] as const;

export const GOALS_ACTIVITIES = [
  {
    title: "Burs İmkanları Sunmak",
    description: "Maddi imkanları kısıtlı ancak akademik olarak başarılı öğrencilere, özellikle de üniversite öğrencilerine burslar sağlayarak eğitim hayatlarını destekliyoruz. Burs miktarları ve koşulları, öğrencinin ailevi durumu ve başarı düzeyi göz önünde bulundurularak belirleniyor. Amaç, hiçbir gencin maddi sıkıntılar yüzünden eğitiminden mahrum kalmaması.",
    icon: Heart,
  },
  {
    title: "Sosyal ve Kültürel Gelişimi Desteklemek",
    description: "Öğrencilerin sadece ders başarılarına değil, aynı zamanda sosyal ve kültürel alanlarda da gelişmelerine önem veriyoruz. Bu kapsamda yaz kampları, kariyer seminerleri, kültürel geziler ve çeşitli sanat etkinlikleri düzenliyoruz. Bu organizasyonlar, öğrencilerin kişisel yeteneklerini keşfetmelerine, farklı deneyimler kazanmalarına ve sosyal becerilerini geliştirmelerine yardımcı oluyor.",
    icon: Users2,
  },
  {
    title: "Eğitim Gönüllülerini Bir Araya Getirmek",
    description: "Acıpayam ve çevresinden iş insanları, bilim insanları, yöneticiler, öğretmenler ve sanatçılar gibi farklı meslek gruplarından eğitim sevdalıları bir araya getiriyoruz. Bu buluşmalar, eğitim konusunda fikir alışverişi yapılmasını ve yeni projeler geliştirilmesini teşvik ederek bölgedeki eğitim desteğini artırmayı hedefliyor.",
    icon: HandHeart,
  },
  {
    title: "Toplumsal Farkındalık Oluşturmak",
    description: "Dernek, 'Parasızlık yüzünden okuyamadım' diyen tek bir öğrencinin bile kalmaması için çabalıyor. Bu doğrultuda, eğitimde fırsat eşitliği konusunda toplumsal farkındalık yaratmaya yönelik çalışmalar yürütüyoruz.",
    icon: Lightbulb,
  },
] as const;

export const MISSION_VISION = {
  mission: {
    title: "Misyonumuz",
    description: "Acıpayam Çevresi Eğitimi Destekleme Derneği'nin misyonu, Acıpayam ve çevresindeki öğrencilerin eğitim hayatlarına maddi ve manevi destek sağlayarak, onların potansiyellerini en üst düzeyde gerçekleştirmelerine, topluma faydalı bireyler olarak yetişmelerine ve eğitimde fırsat eşitliğinin sağlanmasına katkıda bulunmaktır.",
    icon: Target,
  },
  vision: {
    title: "Vizyonumuz",
    description: "Acıpayam ve çevresinde, maddi imkansızlıklar nedeniyle hiçbir öğrencinin eğitimden mahrum kalmadığı, her öğrencinin potansiyelini tam olarak gerçekleştirebildiği, topluma faydalı ve donanımlı bireyler olarak yetiştiği, eğitim kalitesinin sürekli yükseldiği ve fırsat eşitliğinin tam olarak sağlandığı aydınlık bir eğitim ortamı yaratmaktır.",
    icon: Award,
  },
} as const;

export const ORGANIZATION_MEMBERS = {
  honoraryPresident: {
    title: "ONURSAL BAŞKANIMIZ",
    members: [
      { name: "Ahmet GÖK" }
    ]
  },
  foundingPresident: {
    title: "KURUCU BAŞKANIMIZ", 
    members: [
      { name: "Ahmet GÖK" }
    ]
  },
  foundingMembers: {
    title: "KURUCU ÜYLERİMİZ",
    members: [
      { name: "Ahmet GÖK" },
      { name: "Turgut OKKAYA" },
      { name: "Fatma ÖZCAN" },
      { name: "Mesut GÜRSEL" },
      { name: "Behçet YİĞİT" },
      { name: "İlhan ÖZCAN" },
      { name: "Ali DEMİRCİ" },
      { name: "Düriye ULUSOY" },
      { name: "Mehmet Ali TURHAN" }
    ]
  },
  formerPresidents: {
    title: "ÖNCEKİ BAŞKANLARIMIZ",
    members: [
      { name: "Ahmet GÖK" },
      { name: "Erol ÇINAR" }
    ]
  },
  boardOfDirectors: {
    title: "YÖNETİM KURULUMUZ",
    members: [
      { name: "İlhan ÖZCAN", position: "Başkan" },
      { name: "Düriye ULUSOY", position: "Başkan Yardımcısı" },
      { name: "Mehmet Ali TURHAN", position: "Genel Sekreter" },
      { name: "Hasan GEZGİN", position: "Sayman" },
      { name: "Devrim ALKAYA", position: "Üye" },
      { name: "Hatice CAN", position: "Üye" },
      { name: "Erol ÇINAR", position: "Üye" },
      { name: "NURİ GÖKGÖZ", position: "Üye" },
      { name: "Mesut GÜRSEL", position: "Üye" },
      { name: "Turgut OKKAYA", position: "Üye" },
      { name: "Fatma ÖZCAN", position: "Üye" },
      { name: "Zübeyde YANAR", position: "Üye" },
      { name: "Behçet YİĞİT", position: "Üye" }
    ]
  }
} as const;
