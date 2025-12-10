import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET, PUT, DELETE } from "../route";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole, createAuthErrorResponse } from "@/lib/auth/adminAuth";
import { MemberGender, ApplicationStatus } from "@prisma/client";

// Mock Prisma
vi.mock("@/lib/db", () => ({
  prisma: {
    membershipApplication: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    member: {
      findFirst: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

// Mock adminAuth
vi.mock("@/lib/auth/adminAuth", () => ({
  requireRole: vi.fn(),
  createAuthErrorResponse: vi.fn((error: string) => {
    if (error === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Oturum bulunamadı. Lütfen giriş yapın." },
        { status: 401 }
      );
    }
    if (error === "FORBIDDEN") {
      return NextResponse.json(
        { error: "Bu işlem için yetkiniz bulunmamaktadır." },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { error: "Yetkilendirme hatası" },
      { status: 500 }
    );
  }),
  getAdminFromRequest: vi.fn(),
}));

describe("GET /api/membership-applications/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock requireRole to return a valid session for all GET tests
    const mockSession = {
      adminUserId: "admin-1",
      role: "SUPER_ADMIN" as const,
      email: "admin@acedd.org",
      name: "Admin User",
    };
    vi.mocked(requireRole).mockReturnValue(mockSession);
  });

  it("should return 401 when no session is provided", async () => {
    vi.mocked(requireRole).mockImplementation(() => {
      throw new Error("UNAUTHORIZED");
    });

    const params = Promise.resolve({ id: "app-1" });
    const request = new NextRequest("http://localhost:3000/api/membership-applications/app-1");
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toHaveProperty("error", "Oturum bulunamadı. Lütfen giriş yapın.");
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN", "ADMIN"]);
    expect(prisma.membershipApplication.findUnique).not.toHaveBeenCalled();
  });

  it("should return 403 when unauthorized role", async () => {
    vi.mocked(requireRole).mockImplementation(() => {
      throw new Error("FORBIDDEN");
    });

    const params = Promise.resolve({ id: "app-1" });
    const request = new NextRequest("http://localhost:3000/api/membership-applications/app-1");
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data).toHaveProperty("error", "Bu işlem için yetkiniz bulunmamaktadır.");
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN", "ADMIN"]);
    expect(prisma.membershipApplication.findUnique).not.toHaveBeenCalled();
  });

  it("should return 200 for ADMIN role", async () => {
    vi.mocked(requireRole).mockReturnValue({
      adminUserId: "admin-1",
      role: "ADMIN" as const,
      email: "admin@acedd.org",
      name: "Admin User",
    });

    const mockApplication = {
      id: "app-1",
      firstName: "John",
      lastName: "Doe",
      identityNumber: "10000000146",
      gender: "erkek" as MemberGender,
      bloodType: "A_POSITIVE" as any,
      birthPlace: "Istanbul",
      birthDate: new Date("1990-01-01T00:00:00Z"),
      city: "Istanbul",
      phone: "5551234567",
      email: "john@example.com",
      address: "Istanbul, Test Address",
      conditionsAccepted: true,
      status: "PENDING" as ApplicationStatus,
      applicationDate: new Date("2024-01-01T00:00:00Z"),
      reviewedAt: null,
      reviewedBy: null,
      notes: null,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    } as any;

    vi.mocked(prisma.membershipApplication.findUnique).mockResolvedValue(mockApplication);

    const params = Promise.resolve({ id: "app-1" });
    const request = new NextRequest("http://localhost:3000/api/membership-applications/app-1");
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      id: "app-1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      status: "pending",
    });
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN", "ADMIN"]);
  });

  it("should return application with correct format", async () => {
    const mockApplication = {
      id: "app-1",
      firstName: "John",
      lastName: "Doe",
      identityNumber: "10000000146",
      gender: "erkek" as MemberGender,
      bloodType: "A_POSITIVE" as any,
      birthPlace: "Istanbul",
      birthDate: new Date("1990-01-01T00:00:00Z"),
      city: "Istanbul",
      phone: "5551234567",
      email: "john@example.com",
      address: "Istanbul, Test Address",
      conditionsAccepted: true,
      status: "PENDING" as ApplicationStatus,
      applicationDate: new Date("2024-01-01T00:00:00Z"),
      reviewedAt: null,
      reviewedBy: null,
      notes: null,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    } as any;

    vi.mocked(prisma.membershipApplication.findUnique).mockResolvedValue(mockApplication);

    const params = Promise.resolve({ id: "app-1" });
    const request = new NextRequest("http://localhost:3000/api/membership-applications/app-1");
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      id: "app-1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      status: "pending",
    });
    expect(data.birthDate).toBe(mockApplication.birthDate.toISOString());
    expect(data.applicationDate).toBe(mockApplication.applicationDate.toISOString());
  });

  it("should return 404 when application not found", async () => {
    vi.mocked(prisma.membershipApplication.findUnique).mockResolvedValue(null);

    const params = Promise.resolve({ id: "non-existent" });
    const request = new NextRequest("http://localhost:3000/api/membership-applications/non-existent");
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toHaveProperty("error", "Başvuru bulunamadı");
  });

  it("should handle database errors gracefully", async () => {
    vi.mocked(prisma.membershipApplication.findUnique).mockRejectedValue(new Error("Database error"));

    const params = Promise.resolve({ id: "app-1" });
    const request = new NextRequest("http://localhost:3000/api/membership-applications/app-1");
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty("error", "Başvuru yüklenirken bir hata oluştu");
    expect(data).toHaveProperty("message", "Lütfen daha sonra tekrar deneyin");
  });
});

describe("PUT /api/membership-applications/[id] - Status Update", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock requireRole to return a valid SUPER_ADMIN session for all PUT tests
    const mockSession = {
      adminUserId: "super-admin-1",
      role: "SUPER_ADMIN" as const,
      email: "superadmin@acedd.org",
      name: "Super Admin",
    };
    vi.mocked(requireRole).mockReturnValue(mockSession);
  });

  it("should update application status to approved", async () => {
    const existingApplication = {
      id: "app-1",
      firstName: "John",
      lastName: "Doe",
      identityNumber: "10000000146",
      gender: "erkek" as MemberGender,
      bloodType: "A_POSITIVE" as any,
      birthPlace: "Istanbul",
      birthDate: new Date("1990-01-01T00:00:00Z"),
      city: "Istanbul",
      phone: "5551234567",
      email: "john@example.com",
      address: "Istanbul, Test Address",
      conditionsAccepted: true,
      status: "PENDING" as ApplicationStatus,
      applicationDate: new Date("2024-01-01T00:00:00Z"),
      reviewedAt: null,
      reviewedBy: null,
      notes: null,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    } as any;

    const updatedApplication = {
      ...existingApplication,
      status: "APPROVED" as ApplicationStatus,
      reviewedAt: new Date("2024-01-02T00:00:00Z"),
      reviewedBy: "admin-123",
      notes: "Approved by admin",
      updatedAt: new Date("2024-01-02T00:00:00Z"),
    };

    vi.mocked(prisma.membershipApplication.findUnique).mockResolvedValue(existingApplication);
    vi.mocked(prisma.membershipApplication.update).mockResolvedValue(updatedApplication);
    vi.mocked(prisma.member.findFirst).mockResolvedValue(null); // No existing member
    vi.mocked(prisma.member.create).mockResolvedValue({
      id: "member-1",
      firstName: "John",
      lastName: "Doe",
    } as any);

    const requestBody = {
      status: "approved",
      notes: "Approved by admin",
      reviewedBy: "admin-123",
    };

    const params = Promise.resolve({ id: "app-1" });
    const request = new NextRequest("http://localhost:3000/api/membership-applications/app-1", {
      method: "PUT",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      id: "app-1",
      status: "approved",
      notes: "Approved by admin",
      reviewedBy: "admin-123",
    });
    expect(prisma.membershipApplication.findUnique).toHaveBeenCalledWith({
      where: { id: "app-1" },
    });
    expect(prisma.membershipApplication.update).toHaveBeenCalled();
    expect(prisma.member.findFirst).toHaveBeenCalled();
    expect(prisma.member.create).toHaveBeenCalled();
  });

  it("should create member when application is approved and member does not exist", async () => {
    const existingApplication = {
      id: "app-1",
      firstName: "John",
      lastName: "Doe",
      identityNumber: "10000000146",
      gender: "erkek" as MemberGender,
      bloodType: "A_POSITIVE" as any,
      birthPlace: "Istanbul",
      birthDate: new Date("1990-01-01T00:00:00Z"),
      city: "Istanbul",
      phone: "5551234567",
      email: "john@example.com",
      address: "Istanbul, Test Address",
      conditionsAccepted: true,
      status: "PENDING" as ApplicationStatus,
      applicationDate: new Date("2024-01-01T00:00:00Z"),
      reviewedAt: null,
      reviewedBy: null,
      notes: null,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    } as any;

    const updatedApplication = {
      ...existingApplication,
      status: "APPROVED" as ApplicationStatus,
      reviewedAt: new Date("2024-01-02T00:00:00Z"),
      updatedAt: new Date("2024-01-02T00:00:00Z"),
    };

    const createdMember = {
      id: "member-new",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      status: "ACTIVE",
    } as any;

    vi.mocked(prisma.membershipApplication.findUnique).mockResolvedValue(existingApplication);
    vi.mocked(prisma.membershipApplication.update).mockResolvedValue(updatedApplication);
    vi.mocked(prisma.member.findFirst).mockResolvedValue(null); // No existing member
    vi.mocked(prisma.member.create).mockResolvedValue(createdMember);

    const requestBody = {
      status: "approved",
    };

    const params = Promise.resolve({ id: "app-1" });
    const request = new NextRequest("http://localhost:3000/api/membership-applications/app-1", {
      method: "PUT",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await PUT(request, { params });

    expect(response.status).toBe(200);
    expect(prisma.member.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        status: "ACTIVE",
        membershipKind: "MEMBER",
        bloodType: "A_POSITIVE",
        city: "Istanbul",
      }),
    });
  });

  it("should not create member when application is approved but member already exists", async () => {
    const existingApplication = {
      id: "app-1",
      firstName: "John",
      lastName: "Doe",
      identityNumber: "10000000146",
      gender: "erkek" as MemberGender,
      bloodType: "A_POSITIVE" as any,
      birthPlace: "Istanbul",
      birthDate: new Date("1990-01-01T00:00:00Z"),
      city: "Istanbul",
      phone: "5551234567",
      email: "john@example.com",
      address: "Istanbul, Test Address",
      conditionsAccepted: true,
      status: "PENDING" as ApplicationStatus,
      applicationDate: new Date("2024-01-01T00:00:00Z"),
      reviewedAt: null,
      reviewedBy: null,
      notes: null,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    } as any;

    const updatedApplication = {
      ...existingApplication,
      status: "APPROVED" as ApplicationStatus,
      reviewedAt: new Date("2024-01-02T00:00:00Z"),
      updatedAt: new Date("2024-01-02T00:00:00Z"),
    };

    const existingMember = {
      id: "member-existing",
      email: "john@example.com",
    } as any;

    vi.mocked(prisma.membershipApplication.findUnique).mockResolvedValue(existingApplication);
    vi.mocked(prisma.membershipApplication.update).mockResolvedValue(updatedApplication);
    vi.mocked(prisma.member.findFirst).mockResolvedValue(existingMember); // Member exists

    const requestBody = {
      status: "approved",
    };

    const params = Promise.resolve({ id: "app-1" });
    const request = new NextRequest("http://localhost:3000/api/membership-applications/app-1", {
      method: "PUT",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await PUT(request, { params });

    expect(response.status).toBe(200);
    expect(prisma.member.findFirst).toHaveBeenCalled();
    expect(prisma.member.create).not.toHaveBeenCalled();
  });

  it("should reject invalid status", async () => {
    const requestBody = {
      status: "invalid",
    };

    const params = Promise.resolve({ id: "app-1" });
    const request = new NextRequest("http://localhost:3000/api/membership-applications/app-1", {
      method: "PUT",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Geçersiz durum değeri (approved veya rejected olmalı)");
    expect(prisma.membershipApplication.update).not.toHaveBeenCalled();
  });

  it("should handle application not found", async () => {
    vi.mocked(prisma.membershipApplication.findUnique).mockResolvedValue(null);

    const requestBody = {
      status: "approved",
    };

    const params = Promise.resolve({ id: "non-existent" });
    const request = new NextRequest("http://localhost:3000/api/membership-applications/non-existent", {
      method: "PUT",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toHaveProperty("error", "Başvuru bulunamadı");
    expect(prisma.membershipApplication.update).not.toHaveBeenCalled();
  });

  it("should handle notes being empty string (should be null)", async () => {
    const existingApplication = {
      id: "app-1",
      firstName: "John",
      lastName: "Doe",
      identityNumber: "10000000146",
      gender: "erkek" as MemberGender,
      bloodType: "A_POSITIVE" as any,
      birthPlace: "Istanbul",
      birthDate: new Date("1990-01-01T00:00:00Z"),
      city: "Istanbul",
      phone: "5551234567",
      email: "john@example.com",
      address: "Istanbul, Test Address",
      conditionsAccepted: true,
      status: "PENDING" as ApplicationStatus,
      applicationDate: new Date("2024-01-01T00:00:00Z"),
      reviewedAt: null,
      reviewedBy: null,
      notes: null,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    } as any;

    const updatedApplication = {
      ...existingApplication,
      status: "APPROVED" as ApplicationStatus,
      reviewedAt: new Date("2024-01-02T00:00:00Z"),
      notes: null,
      updatedAt: new Date("2024-01-02T00:00:00Z"),
    };

    vi.mocked(prisma.membershipApplication.findUnique).mockResolvedValue(existingApplication);
    vi.mocked(prisma.membershipApplication.update).mockResolvedValue(updatedApplication);
    vi.mocked(prisma.member.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.member.create).mockResolvedValue({} as any);

    const requestBody = {
      status: "approved",
      notes: "", // Empty string
    };

    const params = Promise.resolve({ id: "app-1" });
    const request = new NextRequest("http://localhost:3000/api/membership-applications/app-1", {
      method: "PUT",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await PUT(request, { params });

    expect(response.status).toBe(200);
    expect(prisma.membershipApplication.update).toHaveBeenCalledWith({
      where: { id: "app-1" },
      data: expect.objectContaining({
        notes: null, // Empty string converted to null
      }),
    });
  });

  it("should handle database errors gracefully", async () => {
    vi.mocked(prisma.membershipApplication.update).mockRejectedValue(new Error("Database error"));

    const requestBody = {
      status: "approved",
    };

    const params = Promise.resolve({ id: "app-1" });
    const request = new NextRequest("http://localhost:3000/api/membership-applications/app-1", {
      method: "PUT",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty("error", "Başvuru güncellenirken bir hata oluştu");
    expect(data).toHaveProperty("message", "Lütfen daha sonra tekrar deneyin");
  });
});

describe("DELETE /api/membership-applications/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock requireRole to return a valid SUPER_ADMIN session for all DELETE tests
    const mockSession = {
      adminUserId: "super-admin-1",
      role: "SUPER_ADMIN" as const,
      email: "superadmin@acedd.org",
      name: "Super Admin",
    };
    vi.mocked(requireRole).mockReturnValue(mockSession);
  });

  it("should return 401 when no session is provided", async () => {
    vi.mocked(requireRole).mockImplementation(() => {
      throw new Error("UNAUTHORIZED");
    });

    const params = Promise.resolve({ id: "app-1" });
    const request = new NextRequest("http://localhost:3000/api/membership-applications/app-1", {
      method: "DELETE",
    });
    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toHaveProperty("error", "Oturum bulunamadı. Lütfen giriş yapın.");
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN"]);
    expect(prisma.membershipApplication.delete).not.toHaveBeenCalled();
  });

  it("should return 403 when ADMIN role tries to delete", async () => {
    vi.mocked(requireRole).mockImplementation(() => {
      throw new Error("FORBIDDEN");
    });

    const params = Promise.resolve({ id: "app-1" });
    const request = new NextRequest("http://localhost:3000/api/membership-applications/app-1", {
      method: "DELETE",
    });
    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data).toHaveProperty("error", "Bu işlem için yetkiniz bulunmamaktadır.");
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN"]);
    expect(prisma.membershipApplication.delete).not.toHaveBeenCalled();
  });

  it("should delete application successfully", async () => {
    vi.mocked(prisma.membershipApplication.findUnique).mockResolvedValue({
      id: "app-1",
      status: "PENDING" as ApplicationStatus,
    } as any);
    vi.mocked(prisma.membershipApplication.delete).mockResolvedValue({} as any);

    const params = Promise.resolve({ id: "app-1" });
    const request = new NextRequest("http://localhost:3000/api/membership-applications/app-1", {
      method: "DELETE",
    });
    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("message", "Başvuru başarıyla silindi");
    expect(prisma.membershipApplication.findUnique).toHaveBeenCalledWith({
      where: { id: "app-1" },
    });
    expect(prisma.membershipApplication.delete).toHaveBeenCalledWith({
      where: { id: "app-1" },
    });
  });

  it("should NOT delete associated member when approved application is deleted", async () => {
    const approvedApplication = {
      id: "app-1",
      firstName: "John",
      lastName: "Doe",
      identityNumber: "10000000146",
      email: "john@example.com",
      status: "APPROVED" as ApplicationStatus,
    } as any;

    vi.mocked(prisma.membershipApplication.findUnique).mockResolvedValue(approvedApplication);
    vi.mocked(prisma.membershipApplication.delete).mockResolvedValue({} as any);

    const params = Promise.resolve({ id: "app-1" });
    const request = new NextRequest("http://localhost:3000/api/membership-applications/app-1", {
      method: "DELETE",
    });
    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("message", "Başvuru başarıyla silindi");
    // Member should NOT be deleted - once a member is created, they remain even if application is deleted
    expect(prisma.member.findFirst).not.toHaveBeenCalled();
    expect(prisma.member.delete).not.toHaveBeenCalled();
    expect(prisma.membershipApplication.delete).toHaveBeenCalled();
  });

  it("should not delete member when pending application is deleted", async () => {
    const pendingApplication = {
      id: "app-1",
      status: "PENDING" as ApplicationStatus,
    } as any;

    vi.mocked(prisma.membershipApplication.findUnique).mockResolvedValue(pendingApplication);
    vi.mocked(prisma.membershipApplication.delete).mockResolvedValue({} as any);

    const params = Promise.resolve({ id: "app-1" });
    const request = new NextRequest("http://localhost:3000/api/membership-applications/app-1", {
      method: "DELETE",
    });
    const response = await DELETE(request, { params });

    expect(response.status).toBe(200);
    expect(prisma.member.findFirst).not.toHaveBeenCalled();
    expect(prisma.member.delete).not.toHaveBeenCalled();
  });

  it("should return 404 when application not found", async () => {
    vi.mocked(prisma.membershipApplication.findUnique).mockResolvedValue(null);

    const params = Promise.resolve({ id: "non-existent" });
    const request = new NextRequest("http://localhost:3000/api/membership-applications/non-existent", {
      method: "DELETE",
    });
    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toHaveProperty("error", "Başvuru bulunamadı");
    expect(prisma.membershipApplication.delete).not.toHaveBeenCalled();
  });

  it("should handle database errors gracefully", async () => {
    vi.mocked(prisma.membershipApplication.findUnique).mockResolvedValue({
      id: "app-1",
      status: "PENDING" as ApplicationStatus,
    } as any);
    vi.mocked(prisma.membershipApplication.delete).mockRejectedValue(new Error("Database error"));

    const params = Promise.resolve({ id: "app-1" });
    const request = new NextRequest("http://localhost:3000/api/membership-applications/app-1", {
      method: "DELETE",
    });
    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty("error", "Başvuru silinirken bir hata oluştu");
    expect(data).toHaveProperty("message", "Lütfen daha sonra tekrar deneyin");
  });
});
