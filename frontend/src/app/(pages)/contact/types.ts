// İletişim sayfası için özel tipler
export interface ContactInfo {
  id: string;
  icon: string;
  title: string;
  content: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

export interface ContactContent {
  title: string;
  description: string;
  formTitle: string;
  formDescription: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
