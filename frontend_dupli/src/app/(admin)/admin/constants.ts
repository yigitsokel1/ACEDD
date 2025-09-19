import { Users, FileText, Calendar, Megaphone, Settings, BarChart3, UserCheck, BookOpen } from "lucide-react";

export const ADMIN_NAVIGATION_ITEMS = [
  { name: "Dashboard", href: "/admin", icon: BarChart3 },
  { name: "Burs Başvuruları", href: "/admin/burs-basvurulari", icon: FileText },
  { name: "Üyeler", href: "/admin/uyeler", icon: Users },
  { name: "Etkinlikler", href: "/admin/etkinlikler", icon: Calendar },
  { name: "Duyurular", href: "/admin/duyurular", icon: Megaphone },
  { name: "Ayarlar", href: "/admin/ayarlar", icon: Settings },
] as const;

export const DASHBOARD_STATS = [
  {
    title: "Toplam Başvuru",
    value: "156",
    change: "+12%",
    changeType: "positive" as const,
    icon: FileText,
  },
  {
    title: "Onaylanan Burslar",
    value: "89",
    change: "+8%",
    changeType: "positive" as const,
    icon: UserCheck,
  },
  {
    title: "Aktif Üyeler",
    value: "45",
    change: "+3%",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Bu Ay Etkinlik",
    value: "7",
    change: "+2",
    changeType: "positive" as const,
    icon: Calendar,
  },
] as const;

export const RECENT_APPLICATIONS = [
  {
    id: "1",
    name: "Ahmet Yılmaz",
    school: "Acıpayam Anadolu Lisesi",
    grade: "12. Sınıf",
    gpa: 3.8,
    status: "pending" as const,
    appliedDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Fatma Demir",
    school: "Pamukkale Üniversitesi",
    grade: "2. Sınıf",
    gpa: 3.5,
    status: "approved" as const,
    appliedDate: "2024-01-14",
  },
  {
    id: "3",
    name: "Mehmet Kaya",
    school: "Denizli Fen Lisesi",
    grade: "11. Sınıf",
    gpa: 3.2,
    status: "under_review" as const,
    appliedDate: "2024-01-13",
  },
] as const;

export const UPCOMING_EVENTS = [
  {
    id: "1",
    title: "Eğitim Semineri",
    date: "2024-01-20",
    time: "14:00",
    location: "Dernek Merkezi",
    participants: 25,
  },
  {
    id: "2",
    title: "Burs Değerlendirme Toplantısı",
    date: "2024-01-22",
    time: "10:00",
    location: "Online",
    participants: 8,
  },
  {
    id: "3",
    title: "Gönüllü Eğitimi",
    date: "2024-01-25",
    time: "15:30",
    location: "Dernek Merkezi",
    participants: 15,
  },
] as const;

export const APPLICATION_STATUSES = [
  { value: "pending", label: "Beklemede", color: "yellow" },
  { value: "under_review", label: "İnceleniyor", color: "blue" },
  { value: "approved", label: "Onaylandı", color: "green" },
  { value: "rejected", label: "Reddedildi", color: "red" },
] as const;

export const SCHOLARSHIP_AMOUNTS = [
  { amount: 500, label: "500 TL" },
  { amount: 750, label: "750 TL" },
  { amount: 1000, label: "1000 TL" },
  { amount: 1500, label: "1500 TL" },
  { amount: 2000, label: "2000 TL" },
] as const;
