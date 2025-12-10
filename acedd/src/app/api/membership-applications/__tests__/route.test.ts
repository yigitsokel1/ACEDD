/**
 * API Route Tests: /api/membership-applications
 * Sprint 15.5: Updated tests for new form schema (fullName, identityNumber, etc.)
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET, POST } from "../route";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole, createAuthErrorResponse } from "@/lib/auth/adminAuth";
import { checkRateLimit, getClientIp } from "@/lib/utils/rateLimit";
import { MemberGender, ApplicationStatus, BloodType } from "@prisma/client";

// Mock Prisma
vi.mock("@/lib/db", () => ({
  prisma: {
    membershipApplication: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    member: {
      findFirst: vi.fn(),
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

// Mock rate limiting
vi.mock("@/lib/utils/rateLimit", () => ({
  getClientIp: vi.fn(() => "127.0.0.1"),
  checkRateLimit: vi.fn(() => ({
    allowed: true,
    remaining: 2,
    resetAt: Date.now() + 60000,
  })),
}));

// Import real validation helpers (no mocking - test real implementation)
// Note: We'll use algorithmically valid TC numbers in tests

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

  it("should return applications with correct format (Sprint 15.1: new schema)", async () => {
    const mockApplications = [
      {
        id: "app-1",
        firstName: "Ahmet",
        lastName: "Yılmaz",
        identityNumber: "12345678950", // Algorithmically valid TC number
        gender: "erkek" as MemberGender,
        bloodType: "A_POSITIVE" as BloodType,
        birthPlace: "Istanbul",
        birthDate: new Date("1990-01-01T00:00:00Z"),
        city: "Istanbul",
        phone: "05551234567",
        email: "ahmet@example.com",
        address: "Istanbul, Kadıköy, Test Mahallesi",
        conditionsAccepted: true,
        status: "PENDING" as ApplicationStatus,
        applicationDate: new Date("2024-01-01T00:00:00Z"),
        reviewedAt: null,
        reviewedBy: null,
        notes: null,
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
      firstName: "Ahmet",
      lastName: "Yılmaz",
      identityNumber: "12345678950", // Algorithmically valid TC number
      gender: "erkek",
      bloodType: "A_POSITIVE",
      city: "Istanbul",
      email: "ahmet@example.com",
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
  beforeEach(async () => {
    vi.clearAllMocks();
    // Sprint 15.2: Mock rate limiting to allow requests
    vi.mocked(checkRateLimit).mockReturnValue({
      allowed: true,
      remaining: 2,
      resetAt: Date.now() + 60000,
    });
    // No mocking - using real validation functions
    // Tests will use algorithmically valid TC numbers (e.g., 12345678950)
    // Default: No duplicate applications or members
    vi.mocked(prisma.membershipApplication.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.member.findFirst).mockResolvedValue(null);
  });

  // Sprint 15.2: Rate limiting tests
  it("should return 429 when rate limit exceeded", async () => {
    vi.mocked(checkRateLimit).mockReturnValue({
      allowed: false,
      remaining: 0,
      resetAt: Date.now() + 60000,
    });

    const requestBody = {
      firstName: "Ahmet",
      lastName: "Yılmaz",
      identityNumber: "12345678950", // Algorithmically valid TC number
      gender: "erkek",
      birthPlace: "Istanbul",
      birthDate: "1990-01-01",
      city: "Istanbul",
      phone: "05551234567",
      email: "ahmet@example.com",
      address: "Test address here with enough characters",
      conditionsAccepted: true,
    };

    const request = new NextRequest("http://localhost:3000/api/membership-applications", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data).toHaveProperty("error", "Çok fazla istek gönderdiniz");
    expect(prisma.membershipApplication.create).not.toHaveBeenCalled();
  });

  // Sprint 15.1: Validation tests (new schema)
  it("should return 400 when firstName is missing", async () => {
    const requestBody = {
      lastName: "Yılmaz",
      identityNumber: "12345678950", // Algorithmically valid TC number
      gender: "erkek",
      bloodType: "A_POSITIVE",
      birthPlace: "Istanbul",
      birthDate: "1990-01-01",
      city: "Istanbul",
      phone: "05551234567",
      email: "ahmet@example.com",
      address: "Test address here with enough characters",
      conditionsAccepted: true,
    };

    const request = new NextRequest("http://localhost:3000/api/membership-applications", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Ad alanı zorunludur");
    expect(prisma.membershipApplication.create).not.toHaveBeenCalled();
  });

  it("should return 400 when firstName is too short", async () => {
    const requestBody = {
      firstName: "A", // Too short
      lastName: "Yılmaz",
      identityNumber: "12345678950", // Algorithmically valid TC number
      gender: "erkek",
      bloodType: "A_POSITIVE",
      birthPlace: "Istanbul",
      birthDate: "1990-01-01",
      city: "Istanbul",
      phone: "05551234567",
      email: "ahmet@example.com",
      address: "Test address here with enough characters",
      conditionsAccepted: true,
    };

    const request = new NextRequest("http://localhost:3000/api/membership-applications", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Ad en az 2 karakter olmalıdır");
    expect(prisma.membershipApplication.create).not.toHaveBeenCalled();
  });

  it("should return 400 when lastName is missing", async () => {
    const requestBody = {
      firstName: "Ahmet",
      identityNumber: "12345678950", // Algorithmically valid TC number
      gender: "erkek",
      bloodType: "A_POSITIVE",
      birthPlace: "Istanbul",
      birthDate: "1990-01-01",
      city: "Istanbul",
      phone: "05551234567",
      email: "ahmet@example.com",
      address: "Test address here with enough characters",
      conditionsAccepted: true,
    };

    const request = new NextRequest("http://localhost:3000/api/membership-applications", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Soyad alanı zorunludur");
    expect(prisma.membershipApplication.create).not.toHaveBeenCalled();
  });

  it("should return 400 when lastName is too short", async () => {
    const requestBody = {
      firstName: "Ahmet",
      lastName: "Y", // Too short
      identityNumber: "12345678950", // Algorithmically valid TC number
      gender: "erkek",
      bloodType: "A_POSITIVE",
      birthPlace: "Istanbul",
      birthDate: "1990-01-01",
      city: "Istanbul",
      phone: "05551234567",
      email: "ahmet@example.com",
      address: "Test address here with enough characters",
      conditionsAccepted: true,
    };

    const request = new NextRequest("http://localhost:3000/api/membership-applications", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Soyad en az 2 karakter olmalıdır");
    expect(prisma.membershipApplication.create).not.toHaveBeenCalled();
  });

  it("should return 400 when identityNumber is missing", async () => {
    const requestBody = {
      firstName: "Ahmet",
      lastName: "Yılmaz",
      gender: "erkek",
      bloodType: "A_POSITIVE",
      birthPlace: "Istanbul",
      birthDate: "1990-01-01",
      city: "Istanbul",
      phone: "05551234567",
      email: "ahmet@example.com",
      address: "Test address here with enough characters",
      conditionsAccepted: true,
    };

    const request = new NextRequest("http://localhost:3000/api/membership-applications", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "TC Kimlik No alanı zorunludur");
    expect(prisma.membershipApplication.create).not.toHaveBeenCalled();
  });

  it("should return 400 when identityNumber is invalid", async () => {
    // Real validation will fail for 10-digit number (not 11 digits)
    const requestBody = {
      firstName: "Ahmet",
      lastName: "Yılmaz",
      identityNumber: "1234567890", // Invalid (10 digits, should be 11)
      gender: "erkek",
      bloodType: "A_POSITIVE",
      birthPlace: "Istanbul",
      birthDate: "1990-01-01",
      city: "Istanbul",
      phone: "05551234567",
      email: "ahmet@example.com",
      address: "Test address here with enough characters",
      conditionsAccepted: true,
    };

    const request = new NextRequest("http://localhost:3000/api/membership-applications", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Geçerli bir TC Kimlik No giriniz (11 haneli)");
    expect(prisma.membershipApplication.create).not.toHaveBeenCalled();
  });

  it("should return 400 when conditionsAccepted is false", async () => {
    const requestBody = {
      firstName: "Ahmet",
      lastName: "Yılmaz",
      identityNumber: "12345678950", // Algorithmically valid TC number
      gender: "erkek",
      bloodType: "A_POSITIVE",
      birthPlace: "Istanbul",
      birthDate: "1990-01-01",
      city: "Istanbul",
      phone: "05551234567",
      email: "ahmet@example.com",
      address: "Test address here with enough characters",
      conditionsAccepted: false,
    };

    const request = new NextRequest("http://localhost:3000/api/membership-applications", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Şartları kabul etmeniz gerekmektedir");
    expect(prisma.membershipApplication.create).not.toHaveBeenCalled();
  });

  // Sprint 15.1: Happy path test (new schema)
  it("should create application with valid data (Sprint 15.1: new schema)", async () => {
    const mockApplication = {
      id: "app-new",
      firstName: "Ahmet",
      lastName: "Yılmaz",
      identityNumber: "12345678950", // Algorithmically valid TC number
      gender: "erkek" as MemberGender,
      bloodType: "A_POSITIVE" as BloodType,
      birthPlace: "Istanbul",
      birthDate: new Date("1990-01-01T00:00:00Z"),
      city: "Istanbul",
      phone: "05551234567",
      email: "ahmet@example.com",
      address: "Istanbul, Kadıköy, Test Mahallesi",
      conditionsAccepted: true,
      status: "PENDING" as ApplicationStatus,
      applicationDate: new Date("2024-01-01T00:00:00Z"),
      reviewedAt: null,
      reviewedBy: null,
      notes: null,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    } as any;

    vi.mocked(prisma.membershipApplication.create).mockResolvedValue(mockApplication);
    vi.mocked(prisma.membershipApplication.findFirst).mockResolvedValue(null); // No duplicate applications
    vi.mocked(prisma.member.findFirst).mockResolvedValue(null); // No duplicate members

    const requestBody = {
      firstName: "Ahmet",
      lastName: "Yılmaz",
      identityNumber: "12345678950", // Algorithmically valid TC number
      gender: "erkek",
      bloodType: "A_POSITIVE",
      birthPlace: "Istanbul",
      birthDate: "1990-01-01",
      city: "Istanbul",
      phone: "05551234567",
      email: "ahmet@example.com",
      address: "Istanbul, Kadıköy, Test Mahallesi",
      conditionsAccepted: true,
    };

    const request = new NextRequest("http://localhost:3000/api/membership-applications", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toMatchObject({
      id: "app-new",
      firstName: "Ahmet",
      lastName: "Yılmaz",
      identityNumber: "12345678950", // Algorithmically valid TC number
      gender: "erkek",
      bloodType: "A_POSITIVE",
      city: "Istanbul",
      email: "ahmet@example.com",
      status: "pending",
    });
    expect(prisma.membershipApplication.create).toHaveBeenCalled();
  });

  // Sprint 15.1: Duplicate check tests
  it("should return 400 when duplicate TC Kimlik exists", async () => {
    vi.mocked(prisma.membershipApplication.findFirst).mockResolvedValueOnce({
      id: "existing-app",
      identityNumber: "12345678950", // Algorithmically valid TC number
    } as any);

    const requestBody = {
      firstName: "Ahmet",
      lastName: "Yılmaz",
      identityNumber: "12345678950", // Algorithmically valid TC number
      gender: "erkek",
      bloodType: "A_POSITIVE",
      birthPlace: "Istanbul",
      birthDate: "1990-01-01",
      city: "Istanbul",
      phone: "05551234567",
      email: "ahmet@example.com",
      address: "Test address here with enough characters",
      conditionsAccepted: true,
    };

    const request = new NextRequest("http://localhost:3000/api/membership-applications", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Bu TC Kimlik No ile daha önce başvuru yapılmış");
    expect(prisma.membershipApplication.findFirst).toHaveBeenCalledWith({
      where: { identityNumber: "12345678950" },
    });
    expect(prisma.membershipApplication.create).not.toHaveBeenCalled();
  });

  it("should return 400 when duplicate email exists in applications", async () => {
    vi.mocked(prisma.membershipApplication.findFirst)
      .mockResolvedValueOnce(null) // TC check passes
      .mockResolvedValueOnce({
        id: "existing-app",
        email: "existing@example.com",
      } as any); // Email check fails

    const requestBody = {
      firstName: "Ahmet",
      lastName: "Yılmaz",
      identityNumber: "12345678950", // Algorithmically valid TC number
      gender: "erkek",
      bloodType: "A_POSITIVE",
      birthPlace: "Istanbul",
      birthDate: "1990-01-01",
      city: "Istanbul",
      phone: "05551234567",
      email: "existing@example.com",
      address: "Test address here with enough characters",
      conditionsAccepted: true,
    };

    const request = new NextRequest("http://localhost:3000/api/membership-applications", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Bu e-posta adresi ile daha önce başvuru yapılmış");
    expect(prisma.membershipApplication.create).not.toHaveBeenCalled();
  });

  it("should return 400 when duplicate phone exists in applications", async () => {
    vi.mocked(prisma.membershipApplication.findFirst)
      .mockResolvedValueOnce(null) // TC check passes
      .mockResolvedValueOnce(null) // Email check passes
      .mockResolvedValueOnce({
        id: "existing-app",
        phone: "05551234567",
      } as any); // Phone check fails

    const requestBody = {
      firstName: "Ahmet",
      lastName: "Yılmaz",
      identityNumber: "12345678950", // Algorithmically valid TC number
      gender: "erkek",
      bloodType: "A_POSITIVE",
      birthPlace: "Istanbul",
      birthDate: "1990-01-01",
      city: "Istanbul",
      phone: "05551234567",
      email: "ahmet@example.com",
      address: "Test address here with enough characters",
      conditionsAccepted: true,
    };

    const request = new NextRequest("http://localhost:3000/api/membership-applications", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Bu telefon numarası ile daha önce başvuru yapılmış");
    expect(prisma.membershipApplication.create).not.toHaveBeenCalled();
  });

  it("should return 400 when TC Kimlik already exists in members", async () => {
    vi.mocked(prisma.membershipApplication.findFirst).mockResolvedValue(null); // No duplicate applications
    vi.mocked(prisma.member.findFirst).mockResolvedValueOnce({
      id: "existing-member",
      tcId: "12345678950",
    } as any); // TC check fails in members

    const requestBody = {
      firstName: "Ahmet",
      lastName: "Yılmaz",
      identityNumber: "12345678950", // Algorithmically valid TC number
      gender: "erkek",
      bloodType: "A_POSITIVE",
      birthPlace: "Istanbul",
      birthDate: "1990-01-01",
      city: "Istanbul",
      phone: "05551234567",
      email: "ahmet@example.com",
      address: "Test address here with enough characters",
      conditionsAccepted: true,
    };

    const request = new NextRequest("http://localhost:3000/api/membership-applications", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Bu TC Kimlik No ile zaten bir üye kayıtlı");
    expect(prisma.member.findFirst).toHaveBeenCalledWith({
      where: { tcId: "12345678950" },
    });
    expect(prisma.membershipApplication.create).not.toHaveBeenCalled();
  });

  it("should return 400 when email already exists in members", async () => {
    vi.mocked(prisma.membershipApplication.findFirst).mockResolvedValue(null); // No duplicate applications
    vi.mocked(prisma.member.findFirst)
      .mockResolvedValueOnce(null) // TC check passes in members
      .mockResolvedValueOnce({
        id: "existing-member",
        email: "existing@example.com",
      } as any); // Email check fails in members

    const requestBody = {
      firstName: "Ahmet",
      lastName: "Yılmaz",
      identityNumber: "12345678950", // Algorithmically valid TC number
      gender: "erkek",
      bloodType: "A_POSITIVE",
      birthPlace: "Istanbul",
      birthDate: "1990-01-01",
      city: "Istanbul",
      phone: "05551234567",
      email: "existing@example.com",
      address: "Test address here with enough characters",
      conditionsAccepted: true,
    };

    const request = new NextRequest("http://localhost:3000/api/membership-applications", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Bu e-posta adresi ile zaten bir üye kayıtlı");
    expect(prisma.member.findFirst).toHaveBeenCalledWith({
      where: { email: "existing@example.com" },
    });
    expect(prisma.membershipApplication.create).not.toHaveBeenCalled();
  });

  it("should return 400 when phone already exists in members", async () => {
    vi.mocked(prisma.membershipApplication.findFirst).mockResolvedValue(null); // No duplicate applications
    vi.mocked(prisma.member.findFirst)
      .mockResolvedValueOnce(null) // TC check passes in members
      .mockResolvedValueOnce(null) // Email check passes in members
      .mockResolvedValueOnce({
        id: "existing-member",
        phone: "05551234567",
      } as any); // Phone check fails in members

    const requestBody = {
      firstName: "Ahmet",
      lastName: "Yılmaz",
      identityNumber: "12345678950", // Algorithmically valid TC number
      gender: "erkek",
      bloodType: "A_POSITIVE",
      birthPlace: "Istanbul",
      birthDate: "1990-01-01",
      city: "Istanbul",
      phone: "05551234567",
      email: "ahmet@example.com",
      address: "Test address here with enough characters",
      conditionsAccepted: true,
    };

    const request = new NextRequest("http://localhost:3000/api/membership-applications", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Bu telefon numarası ile zaten bir üye kayıtlı");
    expect(prisma.member.findFirst).toHaveBeenCalledWith({
      where: { phone: "05551234567" },
    });
    expect(prisma.membershipApplication.create).not.toHaveBeenCalled();
  });

  it("should handle database errors gracefully", async () => {
    vi.mocked(prisma.membershipApplication.findFirst).mockResolvedValue(null); // No duplicate applications
    vi.mocked(prisma.member.findFirst).mockResolvedValue(null); // No duplicate members
    vi.mocked(prisma.membershipApplication.create).mockRejectedValue(new Error("Database error"));

    const requestBody = {
      firstName: "Ahmet",
      lastName: "Yılmaz",
      identityNumber: "12345678950", // Algorithmically valid TC number
      gender: "erkek",
      bloodType: "A_POSITIVE",
      birthPlace: "Istanbul",
      birthDate: "1990-01-01",
      city: "Istanbul",
      phone: "05551234567",
      email: "ahmet@example.com",
      address: "Test address here with enough characters",
      conditionsAccepted: true,
    };

    const request = new NextRequest("http://localhost:3000/api/membership-applications", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty("error", "Başvuru kaydedilirken bir hata oluştu");
    expect(data).toHaveProperty("message", "Lütfen bilgilerinizi kontrol edip tekrar deneyin");
  });

  // Production-level edge case tests
  it("should handle whitespace in firstName and lastName correctly", async () => {
    const mockApplication = {
      id: "app-new",
      firstName: "Ahmet",
      lastName: "Yılmaz",
      identityNumber: "12345678950", // Algorithmically valid TC number
      gender: "erkek" as MemberGender,
      bloodType: "A_POSITIVE" as BloodType,
      birthPlace: "Istanbul",
      birthDate: new Date("1990-01-01T00:00:00Z"),
      city: "Istanbul",
      phone: "05551234567",
      email: "ahmet@example.com",
      address: "Istanbul, Kadıköy, Test Mahallesi",
      conditionsAccepted: true,
      status: "PENDING" as ApplicationStatus,
      applicationDate: new Date("2024-01-01T00:00:00Z"),
      reviewedAt: null,
      reviewedBy: null,
      notes: null,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    } as any;

    vi.mocked(prisma.membershipApplication.findFirst).mockResolvedValue(null); // No duplicate applications
    vi.mocked(prisma.member.findFirst).mockResolvedValue(null); // No duplicate members
    vi.mocked(prisma.membershipApplication.create).mockResolvedValue(mockApplication);

    const requestBody = {
      firstName: "  Ahmet  ", // With whitespace
      lastName: "  Yılmaz  ", // With whitespace
      identityNumber: "12345678950", // Algorithmically valid TC number
      gender: "erkek",
      bloodType: "A_POSITIVE",
      birthPlace: "Istanbul",
      birthDate: "1990-01-01",
      city: "Istanbul",
      phone: "05551234567",
      email: "ahmet@example.com",
      address: "Istanbul, Kadıköy, Test Mahallesi",
      conditionsAccepted: true,
    };

    const request = new NextRequest("http://localhost:3000/api/membership-applications", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(prisma.membershipApplication.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        firstName: "Ahmet", // Trimmed
        lastName: "Yılmaz", // Trimmed
      }),
    });
  });

  it("should handle email case insensitivity correctly", async () => {
    vi.mocked(prisma.membershipApplication.findFirst)
      .mockResolvedValueOnce(null) // TC check in applications
      .mockResolvedValueOnce(null) // Email check in applications (lowercase)
      .mockResolvedValueOnce(null); // Phone check in applications
    vi.mocked(prisma.member.findFirst)
      .mockResolvedValueOnce(null) // TC check in members
      .mockResolvedValueOnce(null) // Email check in members
      .mockResolvedValueOnce(null); // Phone check in members

    const mockApplication = {
      id: "app-new",
      firstName: "Ahmet",
      lastName: "Yılmaz",
      identityNumber: "12345678950", // Algorithmically valid TC number
      gender: "erkek" as MemberGender,
      bloodType: "A_POSITIVE" as BloodType,
      birthPlace: "Istanbul",
      birthDate: new Date("1990-01-01T00:00:00Z"),
      city: "Istanbul",
      phone: "05551234567",
      email: "ahmet@example.com",
      address: "Istanbul, Kadıköy, Test Mahallesi",
      conditionsAccepted: true,
      status: "PENDING" as ApplicationStatus,
      applicationDate: new Date("2024-01-01T00:00:00Z"),
      reviewedAt: null,
      reviewedBy: null,
      notes: null,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    } as any;

    vi.mocked(prisma.membershipApplication.create).mockResolvedValue(mockApplication);

    const requestBody = {
      firstName: "Ahmet",
      lastName: "Yılmaz",
      identityNumber: "12345678950", // Algorithmically valid TC number
      gender: "erkek",
      bloodType: "A_POSITIVE",
      birthPlace: "Istanbul",
      birthDate: "1990-01-01",
      city: "Istanbul",
      phone: "05551234567",
      email: "AHMET@EXAMPLE.COM", // Uppercase
      address: "Istanbul, Kadıköy, Test Mahallesi",
      conditionsAccepted: true,
    };

    const request = new NextRequest("http://localhost:3000/api/membership-applications", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);

    expect(response.status).toBe(201);
    expect(prisma.membershipApplication.findFirst).toHaveBeenCalledWith({
      where: { email: "ahmet@example.com" }, // Lowercase check
    });
    expect(prisma.membershipApplication.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: "ahmet@example.com", // Lowercase stored
      }),
    });
  });

  it("should validate all required fields are present", async () => {
    const requestBody = {
      firstName: "Ahmet",
      lastName: "Yılmaz",
      // Missing required fields
    };

    const request = new NextRequest("http://localhost:3000/api/membership-applications", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error");
    expect(prisma.membershipApplication.create).not.toHaveBeenCalled();
  });

  it("should validate bloodType is required", async () => {
    // Using real validation - will pass with algorithmically valid TC number (12345678950)

    const requestBody = {
      firstName: "Ahmet",
      lastName: "Yılmaz",
      identityNumber: "12345678950", // Algorithmically valid TC number
      gender: "erkek",
      // bloodType missing
      birthPlace: "Istanbul",
      birthDate: "1990-01-01",
      city: "Istanbul",
      phone: "05551234567",
      email: "ahmet@example.com",
      address: "Test address here with enough characters",
      conditionsAccepted: true,
    };

    const request = new NextRequest("http://localhost:3000/api/membership-applications", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Kan grubu seçimi zorunludur");
    expect(prisma.membershipApplication.create).not.toHaveBeenCalled();
  });

  it("should validate invalid bloodType enum value", async () => {
    // Validation mocks are already set to return true in beforeEach
    // No need to reset them here

    const requestBody = {
      firstName: "Ahmet",
      lastName: "Yılmaz",
      identityNumber: "12345678950", // Algorithmically valid TC number
      gender: "erkek",
      bloodType: "INVALID_TYPE",
      birthPlace: "Istanbul",
      birthDate: "1990-01-01",
      city: "Istanbul",
      phone: "05551234567",
      email: "ahmet@example.com",
      address: "Test address here with enough characters",
      conditionsAccepted: true,
    };

    const request = new NextRequest("http://localhost:3000/api/membership-applications", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Kan grubu seçimi zorunludur");
    expect(prisma.membershipApplication.create).not.toHaveBeenCalled();
  });
});
