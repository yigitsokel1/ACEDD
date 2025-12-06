// Genel tip tanımları
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  role: "admin" | "member" | "applicant";
  isActive: boolean;
}

export interface ScholarshipApplication extends BaseEntity {
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  schoolName: string;
  grade: string;
  gpa: number;
  familyIncome: number;
  familyMembers: number;
  address: string;
  motivation: string;
  status: "pending" | "approved" | "rejected" | "under_review";
  documents: string[];
  notes?: string;
}

export interface Event extends BaseEntity {
  title: string;
  description: string;
  date: Date;
  location: string;
  imageUrl?: string;
  isActive: boolean;
  maxParticipants?: number;
  currentParticipants: number;
}

export interface News extends BaseEntity {
  title: string;
  content: string;
  excerpt: string;
  imageUrl?: string;
  isPublished: boolean;
  publishedAt?: Date;
  tags: string[];
}

export interface Service extends BaseEntity {
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
  order: number;
}

export interface BoardMember extends BaseEntity {
  name: string;
  position: string;
  bio: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
}

export interface Statistic {
  id: string;
  label: string;
  value: number;
  icon: string;
  description?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Announcement types
export * from "./announcement";
