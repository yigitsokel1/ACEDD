// Sprint 5: Member Tag Types
export type MemberTag =
  | "HONORARY_PRESIDENT"   // Onursal Başkan
  | "FOUNDING_PRESIDENT"   // Kurucu Başkan
  | "FOUNDING_MEMBER"      // Kurucu Üye
  | "PAST_PRESIDENT";      // Önceki Başkan

// Sprint 5: Membership Kind
export type MembershipKind = "MEMBER" | "VOLUNTEER";

// Sprint 5: Board Role
export type BoardRole =
  | "PRESIDENT"            // Başkan
  | "VICE_PRESIDENT"       // Başkan Yardımcısı
  | "SECRETARY_GENERAL"    // Genel Sekreter
  | "TREASURER"            // Sayman
  | "BOARD_MEMBER";        // Yönetim Kurulu Üyesi

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
  // Sprint 5: Yeni alanlar
  membershipKind: MembershipKind;
  tags?: MemberTag[];
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
  // Sprint 5: Yeni alanlar
  membershipKind?: MembershipKind;
  tags?: MemberTag[];
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

// Sprint 5: BoardMember artık Member ile ilişkili
// Sprint 6: isActive ve order alanları Prisma modelinde yok, TS tipinde de yok (tutarlılık sağlandı)
export interface BoardMember {
  id: string;
  memberId: string;
  member: Member; // Member bilgileri buradan gelir (name, email, bio, imageUrl, etc.)
  role: BoardRole;
  termStart?: string;
  termEnd?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateMemberData = Omit<Member, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateMemberData = Partial<CreateMemberData>;
export type CreateApplicationData = Omit<MembershipApplication, 'id' | 'createdAt' | 'updatedAt' | 'applicationDate' | 'status'>;
// Sprint 5: BoardMember artık memberId ve role ile oluşturulur
// Sprint 6: isActive ve order alanları Prisma modelinde yok, burada da yok (tutarlılık sağlandı)
export type CreateBoardMemberData = {
  memberId: string;
  role: BoardRole;
  termStart?: string;
  termEnd?: string;
};
