export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  gender: 'erkek' | 'kadın';
  email: string;
  phone: string;
  birthDate: string;
  academicLevel: 'ilkokul' | 'ortaokul' | 'lise' | 'onlisans' | 'lisans' | 'yukseklisans' | 'doktora';
  maritalStatus: 'bekar' | 'evli' | 'dul' | 'bosanmis';
  hometown: string;
  placeOfBirth: string;
  nationality: string;
  currentAddress: string;
  tcId?: string;
  lastValidDate?: string;
  titles: string[]; // Birden fazla ünvan seçilebilir
  status: 'active' | 'inactive';
  membershipDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMemberFormData {
  firstName: string;
  lastName: string;
  gender: 'erkek' | 'kadın' | '';
  email: string;
  phone: string;
  birthDate: string;
  academicLevel: 'ilkokul' | 'ortaokul' | 'lise' | 'onlisans' | 'lisans' | 'yukseklisans' | 'doktora' | '';
  maritalStatus: 'bekar' | 'evli' | 'dul' | 'bosanmis' | '';
  hometown: string;
  placeOfBirth: string;
  nationality: string;
  currentAddress: string;
  tcId?: string;
  lastValidDate?: string;
  titles: string[];
  status: 'active' | 'inactive' | '';
  membershipDate: string;
}

export interface MembershipApplication {
  id: string;
  firstName: string;
  lastName: string;
  gender: 'erkek' | 'kadın';
  email: string;
  phone: string;
  birthDate: string;
  academicLevel: 'ilkokul' | 'ortaokul' | 'lise' | 'onlisans' | 'lisans' | 'yukseklisans' | 'doktora';
  maritalStatus: 'bekar' | 'evli' | 'dul' | 'bosanmis';
  hometown: string;
  placeOfBirth: string;
  nationality: string;
  currentAddress: string;
  tcId?: string;
  lastValidDate?: string;
  status: 'pending' | 'approved' | 'rejected';
  applicationDate: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BoardMember {
  id: string;
  name: string;
  memberType: 'honoraryPresident' | 'foundingPresident' | 'foundingMember' | 'formerPresident' | 'boardMember';
  bio?: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateMemberData = Omit<Member, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateMemberData = Partial<CreateMemberData>;
export type CreateApplicationData = Omit<MembershipApplication, 'id' | 'createdAt' | 'updatedAt' | 'applicationDate' | 'status'>;
export type CreateBoardMemberData = Omit<BoardMember, 'id' | 'createdAt' | 'updatedAt'>;
