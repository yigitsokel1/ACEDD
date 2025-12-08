/**
 * Contact Page Constants
 * 
 * Sprint 11: Content data moved to settings (content.contact.*)
 * 
 * CONTACT_FORM_FIELDS remains here as technical configuration (form field definitions)
 */

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
