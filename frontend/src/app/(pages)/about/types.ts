// Hakkımızda sayfası için özel tipler
export interface FeatureCard {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: 'blue' | 'green' | 'red';
}

export interface AboutContent {
  title: string;
  paragraphs: string[];
  image: {
    src: string;
    alt: string;
  };
}
