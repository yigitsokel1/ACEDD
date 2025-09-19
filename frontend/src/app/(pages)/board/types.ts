// Yönetim Kurulu sayfası için özel tipler
export interface BoardMember {
  id: string;
  name: string;
  position: string;
  description: string;
  email: string;
  phone: string;
  initials: string;
}

export interface BoardContent {
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
}
