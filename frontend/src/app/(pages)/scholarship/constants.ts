import { ScholarshipContent, FormSection } from './types';

// Burs Başvuru sayfası içerik verileri
export const SCHOLARSHIP_CONTENT: ScholarshipContent = {
  title: "Burs Başvuru Formu",
  description: "Aşağıdaki formu doldurarak burs başvurunuzu yapabilirsiniz. Tüm alanlar zorunludur.",
  successTitle: "Başvurunuz Alındı!",
  successDescription: "Burs başvurunuz başarıyla gönderildi. Değerlendirme süreci 2-3 hafta sürmektedir. Sonuçlar e-posta adresinize gönderilecektir."
};

// Form bölümleri
export const FORM_SECTIONS: FormSection[] = [
  {
    id: 'personal',
    title: 'Kişisel Bilgiler',
    fields: [
      {
        id: 'adSoyad',
        name: 'adSoyad',
        label: 'Ad Soyad',
        type: 'text',
        required: true,
        placeholder: 'Adınızı ve soyadınızı girin'
      },
      {
        id: 'email',
        name: 'email',
        label: 'E-posta',
        type: 'email',
        required: true,
        placeholder: 'ornek@email.com'
      },
      {
        id: 'telefon',
        name: 'telefon',
        label: 'Telefon',
        type: 'tel',
        required: true,
        placeholder: '+90 5XX XXX XX XX'
      }
    ]
  },
  {
    id: 'education',
    title: 'Eğitim Bilgileri',
    fields: [
      {
        id: 'universite',
        name: 'universite',
        label: 'Üniversite',
        type: 'text',
        required: true,
        placeholder: 'Üniversite adını girin'
      },
      {
        id: 'bolum',
        name: 'bolum',
        label: 'Bölüm',
        type: 'text',
        required: true,
        placeholder: 'Bölüm adını girin'
      },
      {
        id: 'sinif',
        name: 'sinif',
        label: 'Sınıf',
        type: 'select',
        required: true,
        options: [
          { value: '', label: 'Seçiniz' },
          { value: '1', label: '1. Sınıf' },
          { value: '2', label: '2. Sınıf' },
          { value: '3', label: '3. Sınıf' },
          { value: '4', label: '4. Sınıf' },
          { value: '5', label: '5. Sınıf' },
          { value: '6', label: '6. Sınıf' }
        ]
      },
      {
        id: 'gpa',
        name: 'gpa',
        label: 'Genel Not Ortalaması (GPA)',
        type: 'number',
        required: true,
        min: 0,
        max: 4,
        step: 0.01,
        placeholder: '0.00 - 4.00'
      }
    ]
  },
  {
    id: 'financial',
    title: 'Mali Durum',
    fields: [
      {
        id: 'aileGelir',
        name: 'aileGelir',
        label: 'Aile Aylık Geliri (TL)',
        type: 'select',
        required: true,
        options: [
          { value: '', label: 'Seçiniz' },
          { value: '0-5000', label: '0 - 5.000 TL' },
          { value: '5000-10000', label: '5.000 - 10.000 TL' },
          { value: '10000-15000', label: '10.000 - 15.000 TL' },
          { value: '15000-20000', label: '15.000 - 20.000 TL' },
          { value: '20000+', label: '20.000 TL ve üzeri' }
        ]
      },
      {
        id: 'acilDurum',
        name: 'acilDurum',
        label: 'Acil Durum Açıklaması',
        type: 'textarea',
        required: false,
        rows: 3,
        placeholder: 'Ailenizin mali durumu hakkında ek bilgi verebilirsiniz...'
      }
    ]
  },
  {
    id: 'motivation',
    title: 'Motivasyon',
    fields: [
      {
        id: 'motivasyon',
        name: 'motivasyon',
        label: 'Neden burs almak istiyorsunuz?',
        type: 'textarea',
        required: true,
        rows: 5,
        placeholder: 'Burs almak isteme nedenlerinizi ve eğitim hedeflerinizi açıklayınız...'
      }
    ]
  }
];
