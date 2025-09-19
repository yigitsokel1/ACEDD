import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const CONTACT_INFO = [
  {
    title: "Adres",
    value: "Acıpayam, Denizli, Türkiye",
    icon: MapPin,
    description: "Dernek merkezimiz Acıpayam'da bulunmaktadır",
  },
  {
    title: "Telefon",
    value: "+90 258 XXX XX XX",
    icon: Phone,
    description: "Pazartesi - Cuma: 09:00 - 17:00",
  },
  {
    title: "E-posta",
    value: "info@acedd.org",
    icon: Mail,
    description: "7/24 e-posta desteği",
  },
  {
    title: "Çalışma Saatleri",
    value: "Pazartesi - Cuma",
    icon: Clock,
    description: "09:00 - 17:00",
  },
] as const;

export const CONTACT_FORM_FIELDS = {
  name: {
    label: "Ad Soyad",
    placeholder: "Adınızı ve soyadınızı girin",
    required: true,
  },
  email: {
    label: "E-posta",
    placeholder: "ornek@email.com",
    required: true,
  },
  phone: {
    label: "Telefon",
    placeholder: "+90 5XX XXX XX XX",
    required: false,
  },
  subject: {
    label: "Konu",
    placeholder: "Mesajınızın konusunu belirtin",
    required: true,
  },
  message: {
    label: "Mesaj",
    placeholder: "Mesajınızı buraya yazın...",
    required: true,
  },
} as const;

export const SOCIAL_MEDIA = [
  {
    name: "Facebook",
    url: "https://facebook.com/acedd",
    icon: "facebook",
  },
  {
    name: "Twitter",
    url: "https://twitter.com/acedd",
    icon: "twitter",
  },
  {
    name: "Instagram",
    url: "https://instagram.com/acedd",
    icon: "instagram",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/company/acedd",
    icon: "linkedin",
  },
] as const;
