// Hizmetlerimiz sayfası için özel tipler
export interface ServiceCard {
  id: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  color: 'blue' | 'green' | 'purple' | 'orange';
}

export interface ServicesContent {
  title: string;
  description: string;
}
