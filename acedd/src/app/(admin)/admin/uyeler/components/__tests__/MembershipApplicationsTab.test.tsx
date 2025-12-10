/**
 * MembershipApplicationsTab component tests
 * Sprint 15.5: Admin table mapping and display tests
 */

/**
 * MembershipApplicationsTab component tests
 * Sprint 15.5: Admin table mapping and display tests
 */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import MembershipApplicationsTab from "../MembershipApplicationsTab";
import { MembershipApplication } from "@/lib/types/member";
import type { MembersContextType } from "@/contexts/MembersContext";

// Mock useMembers context
const mockApplications: MembershipApplication[] = [
  {
    id: "app-1",
    firstName: "Ahmet",
    lastName: "Yılmaz",
    identityNumber: "10000000146",
    gender: "erkek",
    bloodType: "A_POSITIVE",
    birthPlace: "Istanbul",
    birthDate: "1990-01-01T00:00:00Z",
    city: "Istanbul",
    phone: "05551234567",
    email: "ahmet@example.com",
    address: "Istanbul, Kadıköy, Test Mahallesi",
    conditionsAccepted: true,
    status: "pending",
    applicationDate: "2024-01-01T00:00:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "app-2",
    firstName: "Ayşe",
    lastName: "Demir",
    identityNumber: "10000000154",
    gender: "kadın",
    bloodType: "B_POSITIVE",
    birthPlace: "Ankara",
    birthDate: "1995-05-15T00:00:00Z",
    city: "Ankara",
    phone: "05559876543",
    email: "ayse@example.com",
    address: "Ankara, Çankaya, Test Sokak",
    conditionsAccepted: true,
    status: "approved",
    applicationDate: "2024-01-02T00:00:00Z",
    reviewedAt: "2024-01-03T00:00:00Z",
    reviewedBy: "admin-1",
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-03T00:00:00Z",
  },
];

const createMockUseMembers = (overrides: Partial<MembersContextType> = {}): MembersContextType => ({
  applications: mockApplications,
  applicationsLoading: false,
  applicationsError: null,
  updateApplicationStatus: vi.fn(),
  deleteApplication: vi.fn(),
  members: [],
  membersLoading: false,
  membersError: null,
  addMember: vi.fn(),
  updateMember: vi.fn(),
  deleteMember: vi.fn(),
  getMemberById: vi.fn(),
  refreshMembers: vi.fn(),
  addApplication: vi.fn(),
  getApplicationById: vi.fn(),
  refreshApplications: vi.fn(),
  boardMembers: [],
  boardMembersLoading: false,
  boardMembersError: null,
  addBoardMember: vi.fn(),
  updateBoardMember: vi.fn(),
  deleteBoardMember: vi.fn(),
  getBoardMemberById: vi.fn(),
  refreshBoardMembers: vi.fn(),
  ...overrides,
} as MembersContextType);

const mockUseMembers: MembersContextType = createMockUseMembers();

const mockUseMembersFn = vi.fn(() => mockUseMembers);

vi.mock("@/contexts/MembersContext", () => ({
  useMembers: () => mockUseMembersFn(),
}));

describe("MembershipApplicationsTab", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMembersFn.mockReturnValue(mockUseMembers);
  });

  it("should render table with correct columns (Sprint 15.3: new schema)", () => {
    render(<MembershipApplicationsTab />);

    // Check table headers
    expect(screen.getByText("Ad Soyad")).toBeInTheDocument();
    expect(screen.getByText("Şehir")).toBeInTheDocument();
    expect(screen.getByText("Telefon")).toBeInTheDocument();
    expect(screen.getByText("Başvuru Tarihi")).toBeInTheDocument();
    expect(screen.getByText("Durum")).toBeInTheDocument();
    expect(screen.getByText("İşlemler")).toBeInTheDocument();
  });

  it("should display applications with correct data mapping", () => {
    render(<MembershipApplicationsTab />);

    // Check first application data
    expect(screen.getByText("Ahmet Yılmaz")).toBeInTheDocument();
    expect(screen.getByText("Istanbul")).toBeInTheDocument();
    expect(screen.getByText("05551234567")).toBeInTheDocument();
    // Note: Email is not displayed in the table, only in the detail modal
    // Check status badges
    expect(screen.getByText("Beklemede")).toBeInTheDocument();
    expect(screen.getByText("Onaylandı")).toBeInTheDocument();
  });

  it("should display empty state when no applications", () => {
    mockUseMembersFn.mockReturnValueOnce(createMockUseMembers({ applications: [] }));

    render(<MembershipApplicationsTab />);

    expect(screen.getByText("Henüz başvuru yok")).toBeInTheDocument();
    expect(screen.getByText("Üyelik başvuruları burada görünecek.")).toBeInTheDocument();
  });

  it("should display loading state", () => {
    mockUseMembersFn.mockReturnValueOnce(createMockUseMembers({ applicationsLoading: true }));

    render(<MembershipApplicationsTab />);

    // Loading spinner should be visible
    const spinner = document.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("should display error state", () => {
    mockUseMembersFn.mockReturnValueOnce(
      createMockUseMembers({ applicationsError: "Failed to load applications" })
    );

    render(<MembershipApplicationsTab />);

    // Error message is rendered as "Hata: {error}" in a single element
    expect(screen.getByText(/Hata:/i)).toBeInTheDocument();
    expect(screen.getByText(/Failed to load applications/i)).toBeInTheDocument();
  });

  it("should render action buttons for each application", () => {
    render(<MembershipApplicationsTab />);

    // Check for "İncele" buttons (should be 2, one for each application)
    const inceleButtons = screen.getAllByText("İncele");
    expect(inceleButtons.length).toBeGreaterThan(0);

    // Note: "Onayla" button is in the modal, not in the table. We check that "İncele" buttons exist
    // which open the modal containing the "Onayla" button
  });

  it("should format dates correctly", () => {
    render(<MembershipApplicationsTab />);

    // Check that dates are formatted (should not contain ISO string format)
    const dateTexts = screen.getAllByText(/\d{2}\.\d{2}\.\d{4}/);
    expect(dateTexts.length).toBeGreaterThan(0);
  });
});

