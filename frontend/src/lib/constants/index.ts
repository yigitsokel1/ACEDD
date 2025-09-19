// Global sabitler
export const APP_CONFIG = {
  name: 'Acıpayam ve Çevresi Eğitimi Destekleme Derneği',
  description: 'Eğitimde fırsat eşitliği sağlayan dernek',
  version: '1.0.0',
  url: 'https://acipayamegitimdernegi.org',
  email: 'info@acipayamegitimdernegi.org',
  phone: '+90 258 611 2345',
  address: 'Yeni Mahalle, Cumhuriyet Caddesi No: 45/B, 20700 Acıpayam, Denizli'
} as const;

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  SERVICES: '/services',
  BOARD: '/board',
  CONTACT: '/contact',
  SCHOLARSHIP: '/scholarship'
} as const;

// API endpoints kaldırıldı - frontend-only proje
