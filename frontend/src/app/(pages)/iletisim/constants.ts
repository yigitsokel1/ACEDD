import { Phone, Mail, MapPin } from "lucide-react";
import { CONTACT_INFO as GLOBAL_CONTACT_INFO } from "@/lib/constants";

export const CONTACT_INFO = [
  {
    title: "Adres",
    value: GLOBAL_CONTACT_INFO.address,
    icon: MapPin,
    description: "Dernek merkezimiz Acıpayam'da bulunmaktadır",
  },
  {
    title: "Telefon",
    value: GLOBAL_CONTACT_INFO.phone,
    icon: Phone,
    description: "Bizimle iletişime geçin",
  },
  {
    title: "E-posta",
    value: GLOBAL_CONTACT_INFO.email,
    icon: Mail,
    description: "E-posta ile iletişime geçin",
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
