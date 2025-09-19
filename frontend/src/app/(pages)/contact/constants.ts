import { ContactInfo, ContactContent } from './types';

// İletişim sayfası içerik verileri
export const CONTACT_CONTENT: ContactContent = {
  title: "İletişim",
  description: "Sorularınız, eğitim projeleri hakkında bilgi almak veya burs başvurusu için bizimle iletişime geçin. Size en kısa sürede dönüş yapacağız.",
  formTitle: "Bize Mesaj Gönderin",
  formDescription: "Aşağıdaki formu doldurarak bizimle iletişime geçebilirsiniz. En kısa sürede size dönüş yapacağız."
};

// İletişim bilgileri
export const CONTACT_INFO: ContactInfo[] = [
  {
    id: 'address',
    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
    title: 'Adres',
    content: 'Yeni Mahalle, Cumhuriyet Caddesi No: 45/B\n20700 Acıpayam, Denizli',
    color: 'blue'
  },
  {
    id: 'phone',
    icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
    title: 'Telefon',
    content: '+90 258 611 2345\n+90 532 123 4567',
    color: 'green'
  },
  {
    id: 'email',
    icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    title: 'E-posta',
    content: 'info@acipayamegitimdernegi.org\nburs@acipayamegitimdernegi.org',
    color: 'purple'
  },
  {
    id: 'hours',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    title: 'Çalışma Saatleri',
    content: 'Pazartesi - Cuma: 09:00 - 17:00\nCumartesi: 09:00 - 13:00',
    color: 'orange'
  }
];
