// Ana sayfa için özel tipler
export interface StatCard {
  id: string;
  icon: string;
  value: string;
  label: string;
  color: 'blue' | 'amber' | 'emerald' | 'rose';
}

export interface MissionCard {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: 'blue' | 'amber' | 'emerald' | 'rose';
}

export interface ActivityCard {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: 'blue' | 'amber' | 'emerald';
}

export interface TrustIndicator {
  id: string;
  icon: string;
  label: string;
}

export interface HeroSection {
  title: string;
  description: string;
  primaryButton: {
    text: string;
    href: string;
  };
  secondaryButton: {
    text: string;
    href: string;
  };
}
