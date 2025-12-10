import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET, POST } from "../route";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole, createAuthErrorResponse } from "@/lib/auth/adminAuth";
import { NextResponse } from "next/server";

// Mock Prisma
vi.mock("@/lib/db", () => ({
  prisma: {
    scholarshipApplication: {
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

describe("GET /api/scholarship-applications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock requireRole to return a valid session for successful tests
    const mockSession = {
      adminUserId: "admin-1",
      role: "SUPER_ADMIN" as const,
      email: "admin@acedd.org",
      name: "Admin User",
    };
    vi.mocked(requireRole).mockReturnValue(mockSession);
  });

  it("should return empty array when no applications exist", async () => {
    vi.mocked(prisma.scholarshipApplication.findMany).mockResolvedValue([]);

    const request = new NextRequest("http://localhost:3000/api/scholarship-applications");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
    expect(prisma.scholarshipApplication.findMany).toHaveBeenCalledWith({
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
        fullName: "Ahmet Yılmaz",
        email: "ahmet@example.com",
        phone: "5551234567",
        alternativePhone: null,
        birthDate: new Date("2000-01-01T00:00:00Z"),
        birthPlace: "Istanbul",
        tcNumber: "12345678950", // Algorithmically valid TC number
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
        relatives: JSON.stringify([{ kinship: "Baba", name: "Mehmet", surname: "Yılmaz", birthDate: "1970-01-01", education: "Lisans", occupation: "Mühendis", job: "Yazılım", healthInsurance: "Var", healthDisability: "Yok", income: 8000, phone: "5551111111", additionalNotes: "" }]),
        educationHistory: JSON.stringify([{ schoolName: "Anadolu Lisesi", startDate: "2014-09-01", endDate: "2018-06-01", graduation: "Mezun", department: "Fen", percentage: 85 }]),
        references: JSON.stringify([{ relationship: "Hoca", fullName: "Ali Veli", isAcddMember: "Evet", job: "Öğretmen", address: "Istanbul", phone: "5552222222" }]),
        documents: null,
        status: "PENDING" as const,
        reviewedBy: null,
        reviewedAt: null,
        reviewNotes: null,
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
    ] as any; // Sprint 7: Mock data için type assertion

    vi.mocked(prisma.scholarshipApplication.findMany).mockResolvedValue(mockApplications);

    const request = new NextRequest("http://localhost:3000/api/scholarship-applications");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0]).toMatchObject({
      id: "app-1",
      fullName: "Ahmet Yılmaz",
      email: "ahmet@example.com",
      phone: "5551234567",
      university: "İstanbul Üniversitesi",
      faculty: "Mühendislik Fakültesi",
      status: "PENDING",
    });
    expect(data[0].relatives).toBeDefined();
    expect(data[0].educationHistory).toBeDefined();
    expect(data[0].references).toBeDefined();
  });

  it("should filter by status", async () => {
    vi.mocked(prisma.scholarshipApplication.findMany).mockResolvedValue([]);

    const request = new NextRequest("http://localhost:3000/api/scholarship-applications?status=pending");
    await GET(request);

    expect(prisma.scholarshipApplication.findMany).toHaveBeenCalledWith({
      where: {
        status: "PENDING" as const,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  });

  it("should filter by search query", async () => {
    vi.mocked(prisma.scholarshipApplication.findMany).mockResolvedValue([]);

    const request = new NextRequest("http://localhost:3000/api/scholarship-applications?search=ahmet");
    await GET(request);

    expect(prisma.scholarshipApplication.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { fullName: { contains: "ahmet" } },
          { email: { contains: "ahmet" } },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  });

  it("should return 401 when UNAUTHORIZED", async () => {
    vi.mocked(requireRole).mockImplementation(() => {
      throw new Error("UNAUTHORIZED");
    });

    const request = new NextRequest("http://localhost:3000/api/scholarship-applications");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toHaveProperty("error");
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN", "ADMIN"]);
  });

  it("should return 403 when FORBIDDEN", async () => {
    vi.mocked(requireRole).mockImplementation(() => {
      throw new Error("FORBIDDEN");
    });

    const request = new NextRequest("http://localhost:3000/api/scholarship-applications");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data).toHaveProperty("error");
  });

  it("should handle database errors gracefully", async () => {
    vi.mocked(prisma.scholarshipApplication.findMany).mockRejectedValue(
      new Error("Database error")
    );

    const request = new NextRequest("http://localhost:3000/api/scholarship-applications");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty("error", "Başvurular yüklenirken bir hata oluştu");
    expect(data).toHaveProperty("message", "Lütfen daha sonra tekrar deneyin");
  });
});

describe("POST /api/scholarship-applications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create scholarship application with valid data", async () => {
    const mockApplication = {
      id: "app-new",
      fullName: "Fatma Demir",
      email: "fatma@example.com",
      phone: "5559876543",
      alternativePhone: null,
      birthDate: new Date("2001-05-15T00:00:00Z"),
      birthPlace: "Ankara",
      tcNumber: "12345678950", // Algorithmically valid TC number
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
      interests: "Müzik",
      selfIntroduction: "Merhaba, ben Fatma...",
      relatives: JSON.stringify([{ kinship: "Anne", name: "Ayşe", surname: "Demir", birthDate: "1975-01-01", education: "Lise", occupation: "Ev Hanımı", job: "-", healthInsurance: "Var", healthDisability: "Yok", income: 0, phone: "5553333333", additionalNotes: "" }]),
      educationHistory: JSON.stringify([{ schoolName: "Fen Lisesi", startDate: "2015-09-01", endDate: "2019-06-01", graduation: "Mezun", department: "Fen", percentage: 90 }]),
      references: JSON.stringify([{ relationship: "Öğretmen", fullName: "Zeynep Kaya", isAcddMember: "Hayır", job: "Öğretmen", address: "Ankara", phone: "5554444444" }]),
      documents: null,
      status: "PENDING" as const,
      reviewedBy: null,
      reviewedAt: null,
      reviewNotes: null,
      createdAt: new Date("2024-01-15T00:00:00Z"),
      updatedAt: new Date("2024-01-15T00:00:00Z"),
    } as any; // Sprint 7: Mock data için type assertion

    vi.mocked(prisma.scholarshipApplication.create).mockResolvedValue(mockApplication);

    const requestBody = {
      name: "Fatma",
      surname: "Demir",
      phone: "5559876543",
      email: "fatma@example.com",
      birthDate: "2001-05-15",
      birthPlace: "Ankara",
      tcNumber: "12345678950", // Algorithmically valid TC number
      idIssuePlace: "Ankara",
      idIssueDate: "2019-01-01",
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
      interests: "Müzik",
      selfIntroduction: "Merhaba, ben Fatma...",
      relatives: [
        {
          kinship: "Anne",
          name: "Ayşe",
          surname: "Demir",
          birthDate: "1975-01-01",
          education: "Lise",
          occupation: "Ev Hanımı",
          job: "-",
          healthInsurance: "Var",
          healthDisability: "Yok",
          income: 0,
          phone: "5553333333",
          additionalNotes: "",
        },
      ],
      educationHistory: [
        {
          schoolName: "Fen Lisesi",
          startDate: "2015-09-01",
          endDate: "2019-06-01",
          graduation: "Mezun",
          department: "Fen",
          percentage: 90,
        },
      ],
      references: [
        {
          relationship: "Öğretmen",
          fullName: "Zeynep Kaya",
          isAcddMember: "Hayır",
          job: "Öğretmen",
          address: "Ankara",
          phone: "5554444444",
        },
      ],
    };

    const request = new NextRequest("http://localhost:3000/api/scholarship-applications", {
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
      fullName: "Fatma Demir",
      email: "fatma@example.com",
      phone: "5559876543",
      university: "Ankara Üniversitesi",
      status: "PENDING",
    });
    expect(prisma.scholarshipApplication.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          fullName: "Fatma Demir",
          email: "fatma@example.com",
          phone: "5559876543",
          university: "Ankara Üniversitesi",
          status: "PENDING" as const,
        }),
      })
    );
  });

  it("should reject application without required fields (name)", async () => {
    const requestBody = {
      surname: "Demir",
      email: "fatma@example.com",
      phone: "5559876543",
    };

    const request = new NextRequest("http://localhost:3000/api/scholarship-applications", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Ad alanı zorunludur");
    expect(prisma.scholarshipApplication.create).not.toHaveBeenCalled();
  });

  it("should reject application without required fields (email)", async () => {
    const requestBody = {
      name: "Fatma",
      surname: "Demir",
      phone: "5559876543",
    };

    const request = new NextRequest("http://localhost:3000/api/scholarship-applications", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "E-posta adresi zorunludur");
  });

  it("should reject application without required fields (university)", async () => {
    const requestBody = {
      name: "Fatma",
      surname: "Demir",
      email: "fatma@example.com",
      phone: "5559876543",
      birthDate: "2001-05-15",
      idIssueDate: "2019-01-01",
      permanentAddress: "Ankara",
      relatives: [{ kinship: "Anne", name: "Ayşe", surname: "Demir", birthDate: "1975-01-01", education: "Lise", occupation: "Ev Hanımı", job: "-", healthInsurance: "Var", healthDisability: "Yok", income: 0, phone: "5553333333" }],
      educationHistory: [{ schoolName: "Fen Lisesi", startDate: "2015-09-01", endDate: "2019-06-01", graduation: "Mezun", department: "Fen", percentage: 90 }],
      references: [{ relationship: "Öğretmen", fullName: "Zeynep Kaya", isAcddMember: "Hayır", job: "Öğretmen", address: "Ankara", phone: "5554444444" }],
    };

    const request = new NextRequest("http://localhost:3000/api/scholarship-applications", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Üniversite bilgisi zorunludur");
  });

  it("should reject application without required arrays (relatives)", async () => {
    const requestBody = {
      name: "Fatma",
      surname: "Demir",
      email: "fatma@example.com",
      phone: "5559876543",
      birthDate: "2001-05-15",
      idIssueDate: "2019-01-01",
      university: "Ankara Üniversitesi",
      faculty: "Eğitim Fakültesi",
      permanentAddress: "Ankara",
      educationHistory: [{ schoolName: "Fen Lisesi", startDate: "2015-09-01", endDate: "2019-06-01", graduation: "Mezun", department: "Fen", percentage: 90 }],
      references: [{ relationship: "Öğretmen", fullName: "Zeynep Kaya", isAcddMember: "Hayır", job: "Öğretmen", address: "Ankara", phone: "5554444444" }],
    };

    const request = new NextRequest("http://localhost:3000/api/scholarship-applications", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Aile üyeleri bilgisi zorunludur");
  });

  it("should reject application with duplicate email", async () => {
    vi.mocked(prisma.scholarshipApplication.create).mockRejectedValue({
      code: "P2002",
      message: "Unique constraint failed",
    });

    const requestBody = {
      name: "Fatma",
      surname: "Demir",
      email: "existing@example.com",
      phone: "5559876543",
      birthDate: "2001-05-15",
      idIssueDate: "2019-01-01",
      university: "Ankara Üniversitesi",
      faculty: "Eğitim Fakültesi",
      permanentAddress: "Ankara",
      relatives: [{ kinship: "Anne", name: "Ayşe", surname: "Demir", birthDate: "1975-01-01", education: "Lise", occupation: "Ev Hanımı", job: "-", healthInsurance: "Var", healthDisability: "Yok", income: 0, phone: "5553333333" }],
      educationHistory: [{ schoolName: "Fen Lisesi", startDate: "2015-09-01", endDate: "2019-06-01", graduation: "Mezun", department: "Fen", percentage: 90 }],
      references: [{ relationship: "Öğretmen", fullName: "Zeynep Kaya", isAcddMember: "Hayır", job: "Öğretmen", address: "Ankara", phone: "5554444444" }],
    };

    const request = new NextRequest("http://localhost:3000/api/scholarship-applications", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Bu e-posta adresi ile daha önce başvuru yapılmış");
  });

  it("should handle database errors gracefully", async () => {
    vi.mocked(prisma.scholarshipApplication.create).mockRejectedValue(
      new Error("Database error")
    );

    const requestBody = {
      name: "Fatma",
      surname: "Demir",
      email: "fatma@example.com",
      phone: "5559876543",
      birthDate: "2001-05-15",
      idIssueDate: "2019-01-01",
      university: "Ankara Üniversitesi",
      faculty: "Eğitim Fakültesi",
      permanentAddress: "Ankara",
      relatives: [{ kinship: "Anne", name: "Ayşe", surname: "Demir", birthDate: "1975-01-01", education: "Lise", occupation: "Ev Hanımı", job: "-", healthInsurance: "Var", healthDisability: "Yok", income: 0, phone: "5553333333" }],
      educationHistory: [{ schoolName: "Fen Lisesi", startDate: "2015-09-01", endDate: "2019-06-01", graduation: "Mezun", department: "Fen", percentage: 90 }],
      references: [{ relationship: "Öğretmen", fullName: "Zeynep Kaya", isAcddMember: "Hayır", job: "Öğretmen", address: "Ankara", phone: "5554444444" }],
    };

    const request = new NextRequest("http://localhost:3000/api/scholarship-applications", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty("error", "Başvuru kaydedilirken bir hata oluştu");
    expect(data).toHaveProperty("message", "Lütfen bilgilerinizi kontrol edip tekrar deneyin");
  });

  it("should return 400 when TC Number is invalid", async () => {
    const requestBody = {
      name: "Fatma",
      surname: "Demir",
      email: "fatma@example.com",
      phone: "05551234567",
      birthDate: "2001-05-15",
      idIssueDate: "2019-01-01",
      tcNumber: "1234567890", // Invalid (10 digits, should be 11)
      university: "Ankara Üniversitesi",
      faculty: "Eğitim Fakültesi",
      permanentAddress: "Ankara",
      relatives: [{ kinship: "Anne", name: "Ayşe", surname: "Demir", birthDate: "1975-01-01", education: "Lise", occupation: "Ev Hanımı", job: "-", healthInsurance: "Var", healthDisability: "Yok", income: 0, phone: "5553333333" }],
      educationHistory: [{ schoolName: "Fen Lisesi", startDate: "2015-09-01", endDate: "2019-06-01", graduation: "Mezun", department: "Fen", percentage: 90 }],
      references: [{ relationship: "Öğretmen", fullName: "Zeynep Kaya", isAcddMember: "Hayır", job: "Öğretmen", address: "Ankara", phone: "5554444444" }],
    };

    const request = new NextRequest("http://localhost:3000/api/scholarship-applications", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Geçerli bir TC Kimlik No giriniz (11 haneli)");
    expect(prisma.scholarshipApplication.create).not.toHaveBeenCalled();
  });

  it("should return 400 when phone number is invalid", async () => {
    const requestBody = {
      name: "Fatma",
      surname: "Demir",
      email: "fatma@example.com",
      phone: "1234567890", // Invalid (doesn't start with 5)
      birthDate: "2001-05-15",
      idIssueDate: "2019-01-01",
      university: "Ankara Üniversitesi",
      faculty: "Eğitim Fakültesi",
      permanentAddress: "Ankara",
      relatives: [{ kinship: "Anne", name: "Ayşe", surname: "Demir", birthDate: "1975-01-01", education: "Lise", occupation: "Ev Hanımı", job: "-", healthInsurance: "Var", healthDisability: "Yok", income: 0, phone: "5553333333" }],
      educationHistory: [{ schoolName: "Fen Lisesi", startDate: "2015-09-01", endDate: "2019-06-01", graduation: "Mezun", department: "Fen", percentage: 90 }],
      references: [{ relationship: "Öğretmen", fullName: "Zeynep Kaya", isAcddMember: "Hayır", job: "Öğretmen", address: "Ankara", phone: "5554444444" }],
    };

    const request = new NextRequest("http://localhost:3000/api/scholarship-applications", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Geçerli bir telefon numarası giriniz (örn: 05551234567)");
    expect(prisma.scholarshipApplication.create).not.toHaveBeenCalled();
  });

  it("should return 400 when email is invalid", async () => {
    const requestBody = {
      name: "Fatma",
      surname: "Demir",
      email: "invalid-email", // Invalid email format
      phone: "05551234567",
      birthDate: "2001-05-15",
      idIssueDate: "2019-01-01",
      university: "Ankara Üniversitesi",
      faculty: "Eğitim Fakültesi",
      permanentAddress: "Ankara",
      relatives: [{ kinship: "Anne", name: "Ayşe", surname: "Demir", birthDate: "1975-01-01", education: "Lise", occupation: "Ev Hanımı", job: "-", healthInsurance: "Var", healthDisability: "Yok", income: 0, phone: "5553333333" }],
      educationHistory: [{ schoolName: "Fen Lisesi", startDate: "2015-09-01", endDate: "2019-06-01", graduation: "Mezun", department: "Fen", percentage: 90 }],
      references: [{ relationship: "Öğretmen", fullName: "Zeynep Kaya", isAcddMember: "Hayır", job: "Öğretmen", address: "Ankara", phone: "5554444444" }],
    };

    const request = new NextRequest("http://localhost:3000/api/scholarship-applications", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Geçerli bir e-posta adresi giriniz");
    expect(prisma.scholarshipApplication.create).not.toHaveBeenCalled();
  });
});
