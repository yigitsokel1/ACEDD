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
  placeOfBirth: string;
  currentAddress: string;
  tcId?: string;
  lastValidDate?: string;
  titles: string[]; // Birden fazla ünvan seçilebilir
  status: 'active' | 'inactive';
  membershipDate: string;
  // Sprint 5: Yeni alanlar
  membershipKind: MembershipKind;
  tags?: MemberTag[];
  // Sprint 15: Membership Application'dan gelen yeni alanlar
  bloodType?: BloodType | null;
  city?: string | null;
  // Sprint 17: CV Upload
  cvDatasetId?: string | null;
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
  placeOfBirth: string;
  currentAddress: string;
  tcId?: string;
  lastValidDate?: string;
  titles: string[];
  status: 'active' | 'inactive' | '';
  membershipDate: string;
  // Sprint 5: Yeni alanlar
  membershipKind?: MembershipKind;
  tags?: MemberTag[];
  // Sprint 15: Membership Application'dan gelen yeni alanlar
  bloodType?: BloodType | null;
  city?: string | null;
  // Sprint 17: CV Upload
  cvDatasetId?: string | null;
}

// Sprint 15.1: Kan Grubu Type
export type BloodType =
  | "A_POSITIVE"
  | "A_NEGATIVE"
  | "B_POSITIVE"
  | "B_NEGATIVE"
  | "AB_POSITIVE"
  | "AB_NEGATIVE"
  | "O_POSITIVE"
  | "O_NEGATIVE";

// Sprint 15.1: Yeni MembershipApplication interface
export interface MembershipApplication {
  id: string;
  // Sprint 15.1: Yeni form alanları (zorunlu)
  firstName: string;
  lastName: string;
  identityNumber: string; // TC Kimlik No (11 haneli)
  gender: 'erkek' | 'kadın';
  bloodType?: BloodType | null;
  birthPlace: string;
  birthDate: string; // ISO 8601
  city: string;
  phone: string;
  email: string;
  address: string; // @db.Text
  conditionsAccepted: boolean;
  // Sprint 15.1: Durum ve İnceleme
  status: 'pending' | 'approved' | 'rejected';
  applicationDate: string; // ISO 8601
  reviewedAt?: string; // ISO 8601
  reviewedBy?: string; // AdminUser ID
  notes?: string;
  // Metadata
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

// Sprint 15.1: Create Membership Application Request (Form submission data)
export interface CreateMembershipApplicationRequest {
  firstName: string;
  lastName: string;
  identityNumber: string; // TC Kimlik No (11 haneli)
  gender: 'erkek' | 'kadın';
  bloodType?: BloodType | null;
  birthPlace: string;
  birthDate: string; // ISO 8601
  city: string;
  phone: string;
  email: string;
  address: string;
  conditionsAccepted: boolean;
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
