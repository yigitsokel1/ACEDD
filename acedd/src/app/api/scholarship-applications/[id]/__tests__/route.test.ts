import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET, PUT, DELETE } from "../route";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole, createAuthErrorResponse, getAdminFromRequest } from "@/lib/auth/adminAuth";
import { NextResponse } from "next/server";

// Mock Prisma
vi.mock("@/lib/db", () => ({
  prisma: {
    scholarshipApplication: {
      findUnique: vi.fn(),
      update: vi.fn(),
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

describe("GET /api/scholarship-applications/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const mockSession = {
      adminUserId: "admin-1",
      role: "SUPER_ADMIN" as const,
      email: "admin@acedd.org",
      name: "Admin User",
    };
    vi.mocked(requireRole).mockReturnValue(mockSession);
  });

  it("should return application by id", async () => {
    const mockApplication = {
      id: "app-1",
      fullName: "Ahmet Yılmaz",
      email: "ahmet@example.com",
      phone: "5551234567",
      alternativePhone: null,
      birthDate: new Date("2000-01-01T00:00:00Z"),
      birthPlace: "Istanbul",
      tcNumber: "12345678901",
      idIssuePlace: "Istanbul",
      idIssueDate: new Date("2018-01-01T00:00:00Z"),
      gender: "Erkek",
      maritalStatus: "Bekar",
      hometown: "Istanbul",
      permanentAddress: "Istanbul, Kadıköy",
      currentAccommodation: "Yurt",
      bankAccount: "Ziraat Bankası",
      ibanNumber: "TR330006100519786457841326",
      university: "İstanbul Üniversitesi",
      faculty: "Mühendislik Fakültesi",
      department: "Bilgisayar Mühendisliği",
      grade: "3",
      turkeyRanking: 1500,
      physicalDisability: "Hayır",
      healthProblem: "Hayır",
      familyMonthlyIncome: 5000,
      familyMonthlyExpenses: 4000,
      scholarshipIncome: "Hayır",
      interests: null,
      selfIntroduction: "Merhaba, ben Ahmet...",
      relatives: JSON.stringify([{ kinship: "Baba", name: "Mehmet", surname: "Yılmaz", birthDate: "1970-01-01", education: "Lisans", occupation: "Mühendis", job: "Yazılım", healthInsurance: "Var", healthDisability: "Yok", income: 8000, phone: "5551111111" }]),
      educationHistory: JSON.stringify([{ schoolName: "Anadolu Lisesi", startDate: "2014-09-01", endDate: "2018-06-01", graduation: "Mezun", department: "Fen", percentage: 85 }]),
      references: JSON.stringify([{ relationship: "Hoca", fullName: "Ali Veli", isAcddMember: "Evet", job: "Öğretmen", address: "Istanbul", phone: "5552222222" }]),
      documents: null,
      status: "PENDING" as const,
      reviewedBy: null,
      reviewedAt: null,
      reviewNotes: null,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    } as any; // Sprint 7: Mock data için type assertion

    vi.mocked(prisma.scholarshipApplication.findUnique).mockResolvedValue(mockApplication);

    const params = Promise.resolve({ id: "app-1" });
    const request = new NextRequest("http://localhost:3000/api/scholarship-applications/app-1");
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      id: "app-1",
      fullName: "Ahmet Yılmaz",
      email: "ahmet@example.com",
      status: "PENDING",
    });
    expect(prisma.scholarshipApplication.findUnique).toHaveBeenCalledWith({
      where: { id: "app-1" },
    });
  });

  it("should return 404 when application not found", async () => {
    vi.mocked(prisma.scholarshipApplication.findUnique).mockResolvedValue(null);

    const params = Promise.resolve({ id: "non-existent" });
    const request = new NextRequest("http://localhost:3000/api/scholarship-applications/non-existent");
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toHaveProperty("error", "Başvuru bulunamadı");
  });

  it("should return 401 when UNAUTHORIZED", async () => {
    vi.mocked(requireRole).mockImplementation(() => {
      throw new Error("UNAUTHORIZED");
    });

    const params = Promise.resolve({ id: "app-1" });
    const request = new NextRequest("http://localhost:3000/api/scholarship-applications/app-1");
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toHaveProperty("error");
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN", "ADMIN"]);
  });
});

describe("PUT /api/scholarship-applications/[id] - Status Update", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const mockSession = {
      adminUserId: "admin-1",
      role: "SUPER_ADMIN" as const,
      email: "admin@acedd.org",
      name: "Admin User",
    };
    vi.mocked(requireRole).mockReturnValue(mockSession);
    vi.mocked(getAdminFromRequest).mockReturnValue(mockSession);
  });

  it("should update application status to APPROVED", async () => {
    const mockApplication = {
      id: "app-1",
      fullName: "Ahmet Yılmaz",
      email: "ahmet@example.com",
      phone: "5551234567",
      alternativePhone: null,
      birthDate: new Date("2000-01-01T00:00:00Z"),
      birthPlace: "Istanbul",
      tcNumber: "12345678901",
      idIssuePlace: "Istanbul",
      idIssueDate: new Date("2018-01-01T00:00:00Z"),
      gender: "Erkek",
      maritalStatus: "Bekar",
      hometown: "Istanbul",
      permanentAddress: "Istanbul, Kadıköy",
      currentAccommodation: "Yurt",
      bankAccount: "Ziraat Bankası",
      ibanNumber: "TR330006100519786457841326",
      university: "İstanbul Üniversitesi",
      faculty: "Mühendislik Fakültesi",
      department: "Bilgisayar Mühendisliği",
      grade: "3",
      turkeyRanking: 1500,
      physicalDisability: "Hayır",
      healthProblem: "Hayır",
      familyMonthlyIncome: 5000,
      familyMonthlyExpenses: 4000,
      scholarshipIncome: "Hayır",
      interests: null,
      selfIntroduction: "Merhaba, ben Ahmet...",
      relatives: null,
      educationHistory: null,
      references: null,
      documents: null,
      status: "APPROVED" as const,
      reviewedBy: "admin-1",
      reviewedAt: new Date("2024-01-02T00:00:00Z"),
      reviewNotes: "Approved by admin",
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-02T00:00:00Z"),
    } as any; // Sprint 7: Mock data için type assertion

    vi.mocked(prisma.scholarshipApplication.update).mockResolvedValue(mockApplication);

    const requestBody = {
      status: "APPROVED",
      reviewNotes: "Approved by admin",
    };

    const params = Promise.resolve({ id: "app-1" });
    const request = new NextRequest("http://localhost:3000/api/scholarship-applications/app-1", {
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
      status: "APPROVED",
      reviewNotes: "Approved by admin",
    });
    expect(prisma.scholarshipApplication.update).toHaveBeenCalledWith({
      where: { id: "app-1" },
      data: {
        status: "APPROVED",
        reviewedAt: expect.any(Date),
        reviewedBy: "admin-1",
        reviewNotes: "Approved by admin",
      },
    });
  });

  it("should update application status to REJECTED", async () => {
    const mockApplication = {
      id: "app-2",
      fullName: "Fatma Demir",
      email: "fatma@example.com",
      phone: "5559876543",
      alternativePhone: null,
      birthDate: new Date("2001-05-15T00:00:00Z"),
      birthPlace: "Ankara",
      tcNumber: "98765432109",
      idIssuePlace: "Ankara",
      idIssueDate: new Date("2019-01-01T00:00:00Z"),
      gender: "Kadın",
      maritalStatus: "Bekar",
      hometown: "Ankara",
      permanentAddress: "Ankara, Çankaya",
      currentAccommodation: "Ev",
      bankAccount: "Garanti Bankası",
      ibanNumber: "TR330006100519786457841327",
      university: "Ankara Üniversitesi",
      faculty: "Eğitim Fakültesi",
      department: "Matematik Öğretmenliği",
      grade: "2",
      turkeyRanking: 2000,
      physicalDisability: "Hayır",
      healthProblem: "Hayır",
      familyMonthlyIncome: 6000,
      familyMonthlyExpenses: 5000,
      scholarshipIncome: "Hayır",
      interests: null,
      selfIntroduction: "Merhaba, ben Fatma...",
      relatives: null,
      educationHistory: null,
      references: null,
      documents: null,
      status: "REJECTED" as const,
      reviewedBy: "admin-1",
      reviewedAt: new Date("2024-01-02T00:00:00Z"),
      reviewNotes: "Incomplete documentation",
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-02T00:00:00Z"),
    } as any; // Sprint 7: Mock data için type assertion

    vi.mocked(prisma.scholarshipApplication.update).mockResolvedValue(mockApplication);

    const requestBody = {
      status: "REJECTED",
      reviewNotes: "Incomplete documentation",
    };

    const params = Promise.resolve({ id: "app-2" });
    const request = new NextRequest("http://localhost:3000/api/scholarship-applications/app-2", {
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
      id: "app-2",
      status: "REJECTED",
      reviewNotes: "Incomplete documentation",
    });
  });

  it("should update application status to UNDER_REVIEW", async () => {
    const mockApplication = {
      id: "app-3",
      fullName: "Mehmet Kaya",
      email: "mehmet@example.com",
      phone: "5551111111",
      alternativePhone: null,
      birthDate: new Date("1999-03-20T00:00:00Z"),
      birthPlace: "Izmir",
      tcNumber: "11111111111",
      idIssuePlace: "Izmir",
      idIssueDate: new Date("2017-01-01T00:00:00Z"),
      gender: "Erkek",
      maritalStatus: "Bekar",
      hometown: "Izmir",
      permanentAddress: "Izmir, Bornova",
      currentAccommodation: "Yurt",
      bankAccount: "İş Bankası",
      ibanNumber: "TR330006100519786457841328",
      university: "Ege Üniversitesi",
      faculty: "Fen Fakültesi",
      department: "Fizik",
      grade: "4",
      turkeyRanking: 1000,
      physicalDisability: "Hayır",
      healthProblem: "Hayır",
      familyMonthlyIncome: 4000,
      familyMonthlyExpenses: 3500,
      scholarshipIncome: "Hayır",
      interests: null,
      selfIntroduction: "Merhaba, ben Mehmet...",
      relatives: null,
      educationHistory: null,
      references: null,
      documents: null,
      status: "UNDER_REVIEW" as const,
      reviewedBy: "admin-1",
      reviewedAt: new Date("2024-01-02T00:00:00Z"),
      reviewNotes: "Under review",
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-02T00:00:00Z"),
    } as any; // Sprint 7: Mock data için type assertion

    vi.mocked(prisma.scholarshipApplication.update).mockResolvedValue(mockApplication);

    const requestBody = {
      status: "UNDER_REVIEW",
      reviewNotes: "Under review",
    };

    const params = Promise.resolve({ id: "app-3" });
    const request = new NextRequest("http://localhost:3000/api/scholarship-applications/app-3", {
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
      id: "app-3",
      status: "UNDER_REVIEW",
      reviewNotes: "Under review",
    });
  });

  it("should reject invalid status", async () => {
    const requestBody = {
      status: "INVALID",
    };

    const params = Promise.resolve({ id: "app-1" });
    const request = new NextRequest("http://localhost:3000/api/scholarship-applications/app-1", {
      method: "PUT",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Geçersiz durum değeri");
    expect(prisma.scholarshipApplication.update).not.toHaveBeenCalled();
  });

  it("should allow ADMIN role for status update", async () => {
    const mockAdminSession = {
      adminUserId: "admin-2",
      role: "ADMIN" as const,
      email: "admin2@acedd.org",
      name: "Admin User 2",
    };
    vi.mocked(requireRole).mockReturnValue(mockAdminSession);
    vi.mocked(getAdminFromRequest).mockReturnValue(mockAdminSession);

    const mockApplication = {
      id: "app-1",
      fullName: "Ahmet Yılmaz",
      email: "ahmet@example.com",
      phone: "5551234567",
      alternativePhone: null,
      birthDate: new Date("2000-01-01T00:00:00Z"),
      birthPlace: "Istanbul",
      tcNumber: "12345678901",
      idIssuePlace: "Istanbul",
      idIssueDate: new Date("2018-01-01T00:00:00Z"),
      gender: "Erkek",
      maritalStatus: "Bekar",
      hometown: "Istanbul",
      permanentAddress: "Istanbul, Kadıköy",
      currentAccommodation: "Yurt",
      bankAccount: "Ziraat Bankası",
      ibanNumber: "TR330006100519786457841326",
      university: "İstanbul Üniversitesi",
      faculty: "Mühendislik Fakültesi",
      department: "Bilgisayar Mühendisliği",
      grade: "3",
      turkeyRanking: 1500,
      physicalDisability: "Hayır",
      healthProblem: "Hayır",
      familyMonthlyIncome: 5000,
      familyMonthlyExpenses: 4000,
      scholarshipIncome: "Hayır",
      interests: null,
      selfIntroduction: "Merhaba, ben Ahmet...",
      relatives: null,
      educationHistory: null,
      references: null,
      documents: null,
      status: "APPROVED" as const,
      reviewedBy: "admin-2",
      reviewedAt: new Date("2024-01-02T00:00:00Z"),
      reviewNotes: "Approved by admin",
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-02T00:00:00Z"),
    };

    vi.mocked(prisma.scholarshipApplication.update).mockResolvedValue(mockApplication);

    const requestBody = {
      status: "APPROVED",
      reviewNotes: "Approved by admin",
    };

    const params = Promise.resolve({ id: "app-1" });
    const request = new NextRequest("http://localhost:3000/api/scholarship-applications/app-1", {
      method: "PUT",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await PUT(request, { params });

    expect(response.status).toBe(200);
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN", "ADMIN"]);
  });

  it("should return 401 when UNAUTHORIZED", async () => {
    vi.mocked(requireRole).mockImplementation(() => {
      throw new Error("UNAUTHORIZED");
    });

    const requestBody = {
      status: "APPROVED",
    };

    const params = Promise.resolve({ id: "app-1" });
    const request = new NextRequest("http://localhost:3000/api/scholarship-applications/app-1", {
      method: "PUT",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toHaveProperty("error");
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN", "ADMIN"]);
  });

  it("should handle application not found", async () => {
    vi.mocked(prisma.scholarshipApplication.update).mockRejectedValue({
      code: "P2025",
      message: "Record not found",
    });

    const requestBody = {
      status: "APPROVED",
    };

    const params = Promise.resolve({ id: "non-existent" });
    const request = new NextRequest("http://localhost:3000/api/scholarship-applications/non-existent", {
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
  });

  it("should handle database errors gracefully", async () => {
    vi.mocked(prisma.scholarshipApplication.update).mockRejectedValue(new Error("Database error"));

    const requestBody = {
      status: "APPROVED",
    };

    const params = Promise.resolve({ id: "app-1" });
    const request = new NextRequest("http://localhost:3000/api/scholarship-applications/app-1", {
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

describe("DELETE /api/scholarship-applications/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const mockSession = {
      adminUserId: "admin-1",
      role: "SUPER_ADMIN" as const,
      email: "admin@acedd.org",
      name: "Admin User",
    };
    vi.mocked(requireRole).mockReturnValue(mockSession);
  });

  it("should delete application", async () => {
    vi.mocked(prisma.scholarshipApplication.delete).mockResolvedValue({} as any);

    const params = Promise.resolve({ id: "app-1" });
    const request = new NextRequest("http://localhost:3000/api/scholarship-applications/app-1", {
      method: "DELETE",
    });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("message", "Başvuru başarıyla silindi");
    expect(prisma.scholarshipApplication.delete).toHaveBeenCalledWith({
      where: { id: "app-1" },
    });
  });

  it("should return 401 when UNAUTHORIZED", async () => {
    vi.mocked(requireRole).mockImplementation(() => {
      throw new Error("UNAUTHORIZED");
    });

    const params = Promise.resolve({ id: "app-1" });
    const request = new NextRequest("http://localhost:3000/api/scholarship-applications/app-1", {
      method: "DELETE",
    });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toHaveProperty("error");
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN", "ADMIN"]);
  });

  it("should handle application not found", async () => {
    vi.mocked(prisma.scholarshipApplication.delete).mockRejectedValue({
      code: "P2025",
      message: "Record not found",
    });

    const params = Promise.resolve({ id: "non-existent" });
    const request = new NextRequest("http://localhost:3000/api/scholarship-applications/non-existent", {
      method: "DELETE",
    });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toHaveProperty("error", "Başvuru bulunamadı");
  });

  it("should handle database errors gracefully", async () => {
    vi.mocked(prisma.scholarshipApplication.delete).mockRejectedValue(new Error("Database error"));

    const params = Promise.resolve({ id: "app-1" });
    const request = new NextRequest("http://localhost:3000/api/scholarship-applications/app-1", {
      method: "DELETE",
    });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty("error", "Başvuru silinirken bir hata oluştu");
    expect(data).toHaveProperty("message", "Lütfen daha sonra tekrar deneyin");
  });
});
