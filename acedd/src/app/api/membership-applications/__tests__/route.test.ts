import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET, POST } from "../route";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole, createAuthErrorResponse } from "@/lib/auth/adminAuth";
import { MemberGender, MemberAcademicLevel, MemberMaritalStatus, ApplicationStatus } from "@prisma/client";

// Mock Prisma
vi.mock("@/lib/db", () => ({
  prisma: {
    membershipApplication: {
      findMany: vi.fn(),
      create: vi.fn(),
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
}));

describe("GET /api/membership-applications", () => {
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

    const request = new NextRequest("http://localhost:3000/api/membership-applications");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toHaveProperty("error", "Oturum bulunamadı. Lütfen giriş yapın.");
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN", "ADMIN"]);
    expect(prisma.membershipApplication.findMany).not.toHaveBeenCalled();
  });

  it("should return 403 when unauthorized role", async () => {
    vi.mocked(requireRole).mockImplementation(() => {
      throw new Error("FORBIDDEN");
    });

    const request = new NextRequest("http://localhost:3000/api/membership-applications");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data).toHaveProperty("error", "Bu işlem için yetkiniz bulunmamaktadır.");
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN", "ADMIN"]);
    expect(prisma.membershipApplication.findMany).not.toHaveBeenCalled();
  });

  it("should return 200 for ADMIN role", async () => {
    vi.mocked(requireRole).mockReturnValue({
      adminUserId: "admin-1",
      role: "ADMIN" as const,
      email: "admin@acedd.org",
      name: "Admin User",
    });
    vi.mocked(prisma.membershipApplication.findMany).mockResolvedValue([]);

    const request = new NextRequest("http://localhost:3000/api/membership-applications");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN", "ADMIN"]);
  });

  it("should return empty array when no applications exist", async () => {
    vi.mocked(prisma.membershipApplication.findMany).mockResolvedValue([]);

    const request = new NextRequest("http://localhost:3000/api/membership-applications");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
    expect(prisma.membershipApplication.findMany).toHaveBeenCalledWith({
      where: {},
      orderBy: {
        createdAt: "desc",
      },
    });
  });

  it("should return applications with correct format", async () => {
    const mockApplications = [
      {
        id: "app-1",
        firstName: "John",
        lastName: "Doe",
        gender: "erkek" as MemberGender,
        email: "john@example.com",
        phone: "5551234567",
        birthDate: new Date("1990-01-01T00:00:00Z"),
        academicLevel: "lisans" as MemberAcademicLevel,
        maritalStatus: "bekar" as MemberMaritalStatus,
        hometown: "Istanbul",
        placeOfBirth: "Istanbul",
        nationality: "TR",
        currentAddress: "Istanbul",
        tcId: "12345678901",
        lastValidDate: null,
        status: "PENDING" as ApplicationStatus,
        applicationDate: new Date("2024-01-01T00:00:00Z"),
        reviewedAt: null,
        reviewedBy: null,
        notes: null,
        department: null,
        reason: null,
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
    ] as any;

    vi.mocked(prisma.membershipApplication.findMany).mockResolvedValue(mockApplications);

    const request = new NextRequest("http://localhost:3000/api/membership-applications");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0]).toMatchObject({
      id: "app-1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      status: "pending",
    });
    expect(data[0].birthDate).toBe(mockApplications[0].birthDate.toISOString());
    expect(data[0].applicationDate).toBe(mockApplications[0].applicationDate.toISOString());
  });

  it("should filter by status query param", async () => {
    vi.mocked(prisma.membershipApplication.findMany).mockResolvedValue([]);

    const request = new NextRequest("http://localhost:3000/api/membership-applications?status=pending");
    await GET(request);

    expect(prisma.membershipApplication.findMany).toHaveBeenCalledWith({
      where: {
        status: "PENDING",
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  });

  it("should handle database errors gracefully", async () => {
    vi.mocked(prisma.membershipApplication.findMany).mockRejectedValue(new Error("Database error"));

    const request = new NextRequest("http://localhost:3000/api/membership-applications");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty("error", "Başvurular yüklenirken bir hata oluştu");
    expect(data).toHaveProperty("message", "Lütfen daha sonra tekrar deneyin");
  });
});

describe("POST /api/membership-applications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // POST is public, no auth required
  });

  it("should create application with valid data (public endpoint)", async () => {
    const mockApplication = {
      id: "app-new",
      firstName: "Jane",
      lastName: "Smith",
      gender: "kadın" as MemberGender,
      email: "jane@example.com",
      phone: "5559876543",
      birthDate: new Date("1995-05-15T00:00:00Z"),
      academicLevel: "yukseklisans" as MemberAcademicLevel,
      maritalStatus: "evli" as MemberMaritalStatus,
      hometown: "Ankara",
      placeOfBirth: "Ankara",
      nationality: "TR",
      currentAddress: "Ankara",
      tcId: null,
      lastValidDate: null,
      status: "PENDING" as ApplicationStatus,
      applicationDate: new Date("2024-01-01T00:00:00Z"),
      reviewedAt: null,
      reviewedBy: null,
      notes: null,
      department: null,
      reason: null,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    } as any;

    vi.mocked(prisma.membershipApplication.create).mockResolvedValue(mockApplication);

    const requestBody = {
      firstName: "Jane",
      lastName: "Smith",
      gender: "kadın",
      email: "jane@example.com",
      phone: "5559876543",
      birthDate: "1995-05-15T00:00:00Z",
      academicLevel: "yukseklisans",
      maritalStatus: "evli",
      hometown: "Ankara",
      placeOfBirth: "Ankara",
      nationality: "TR",
      currentAddress: "Ankara",
    };

    const request = new NextRequest("http://localhost:3000/api/membership-applications", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toMatchObject({
      id: "app-new",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      status: "pending",
    });
    expect(prisma.membershipApplication.create).toHaveBeenCalled();
    // POST should not require auth
    expect(requireRole).not.toHaveBeenCalled();
  });
});
