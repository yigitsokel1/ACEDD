import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET, POST } from "../route";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole, createAuthErrorResponse } from "@/lib/auth/adminAuth";
import { NextResponse } from "next/server";

// Mock Prisma
// Sprint 16 - Block E: Added transaction and relational table mocks
vi.mock("@/lib/db", () => ({
  prisma: {
    scholarshipApplication: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
    relative: {
      createMany: vi.fn(),
    },
    educationHistory: {
      createMany: vi.fn(),
    },
    reference: {
      createMany: vi.fn(),
    },
    $transaction: vi.fn(async (callback) => {
      const tx = {
        scholarshipApplication: {
          create: vi.fn(),
          findUnique: vi.fn(),
        },
        relative: {
          createMany: vi.fn(),
        },
        educationHistory: {
          createMany: vi.fn(),
        },
        reference: {
          createMany: vi.fn(),
        },
      };
      return await callback(tx);
    }),
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

// Mock reCAPTCHA
// Sprint 16 - Block E: Added reCAPTCHA mock
vi.mock("@/lib/utils/recaptcha", () => ({
  verifyRecaptchaToken: vi.fn().mockResolvedValue(true),
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
    // Sprint 16 - Block F: Mock data must use new Prisma field names with relational data
    const mockApplications = [
      {
        id: "app-1",
        firstName: "Ahmet",
        lastName: "Yılmaz",
        email: "ahmet@example.com",
        phone: "5551234567",
        birthDate: new Date("2000-01-01T00:00:00Z"),
        birthPlace: "Istanbul",
        nationalId: "12345678950",
        idIssuePlace: "Istanbul",
        idIssueDate: new Date("2018-01-01T00:00:00Z"),
        gender: "Erkek",
        maritalStatus: "Bekar",
        hometown: "Istanbul",
        permanentAddress: "Istanbul, Kadıköy",
        currentAccommodation: "Yurt",
        bankName: "Ziraat Bankası",
        iban: "TR330006100519786457841326",
        university: "İstanbul Üniversitesi",
        faculty: "Mühendislik Fakültesi",
        department: "Bilgisayar Mühendisliği",
        classYear: "3",
        turkiyeRanking: 1500,
        hasPhysicalDisability: "Hayır",
        hasHealthIssue: "Hayır",
        familyMonthlyIncome: 5000,
        familyMonthlyMandatoryExpenses: 4000,
        hasScholarshipOrLoan: "Hayır",
        interests: null,
        aboutYourself: "Merhaba, ben Ahmet...",
        documents: null,
        status: "PENDING" as const,
        reviewedBy: null,
        reviewedAt: null,
        reviewNotes: null,
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
        relatives: [
          {
            id: "rel-1",
            degree: "Baba",
            firstName: "Mehmet",
            lastName: "Yılmaz",
            birthDate: new Date("1970-01-01T00:00:00Z"),
            educationStatus: "Lisans",
            occupation: "Mühendis",
            workplace: "Yazılım",
            healthInsurance: "Var",
            healthDisability: "Hayır",
            income: 8000,
            phone: "5551111111",
            notes: "",
          },
        ],
        educationHistory: [
          {
            id: "edu-1",
            schoolName: "Anadolu Lisesi",
            startDate: new Date("2014-09-01T00:00:00Z"),
            endDate: new Date("2018-06-01T00:00:00Z"),
            isGraduated: true,
            department: "Fen",
            gradePercent: 85,
          },
        ],
        references: [
          {
            id: "ref-1",
            relationship: "Hoca",
            firstName: "Ali",
            lastName: "Veli",
            isAceddMember: true,
            job: "Öğretmen",
            address: "Istanbul",
            phone: "5552222222",
          },
        ],
      },
    ] as any;

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
    // Sprint 16 - Block E: Mock transaction result with relational data
    const mockApplication = {
      id: "app-new",
      firstName: "Fatma",
      lastName: "Demir",
      email: "fatma@example.com",
      phone: "5559876543",
      referenceContactPhone: null,
      birthDate: new Date("2001-05-15T00:00:00Z"),
      birthPlace: "Ankara",
      nationalId: "12345678950",
      idIssuePlace: "Ankara",
      idIssueDate: new Date("2019-01-01T00:00:00Z"),
      gender: "Kadın",
      maritalStatus: "Bekar",
      hometown: "Ankara",
      permanentAddress: "Ankara, Çankaya, Test Mahallesi, Test Sokak No: 123",
      currentAccommodation: "Ev",
      bankName: "Garanti Bankası",
      iban: "TR330006100519786457841327",
      university: "Ankara Üniversitesi",
      faculty: "Eğitim Fakültesi",
      department: "Matematik Öğretmenliği",
      classYear: "2",
      turkiyeRanking: 2000,
      hasPhysicalDisability: "Hayır",
      hasHealthIssue: "Hayır",
      familyMonthlyIncome: 6000,
      familyMonthlyMandatoryExpenses: 5000,
      hasScholarshipOrLoan: "Hayır",
      interests: "Müzik",
      aboutYourself: "Merhaba, ben Fatma...",
      documents: null,
      status: "PENDING" as const,
      reviewedBy: null,
      reviewedAt: null,
      reviewNotes: null,
      createdAt: new Date("2024-01-15T00:00:00Z"),
      updatedAt: new Date("2024-01-15T00:00:00Z"),
      relatives: [],
      educationHistory: [],
      references: [],
    } as any;

    // Mock transaction
    vi.mocked(prisma.$transaction).mockImplementation(async (callback: any) => {
      const tx = {
        scholarshipApplication: {
          create: vi.fn().mockResolvedValue(mockApplication),
          findUnique: vi.fn().mockResolvedValue(mockApplication),
        },
        relative: {
          createMany: vi.fn().mockResolvedValue({ count: 1 }),
        },
        educationHistory: {
          createMany: vi.fn().mockResolvedValue({ count: 1 }),
        },
        reference: {
          createMany: vi.fn().mockResolvedValue({ count: 1 }),
        },
      };
      return await callback(tx);
    });

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
      permanentAddress: "Ankara, Çankaya, Test Mahallesi, Test Sokak No: 123", // Sprint 16: Must be at least 10 characters
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
          healthDisability: "Hayır", // Sprint 16: Must be "Evet" or "Hayır"
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
          graduation: "Evet", // Sprint 16: Must be "Evet" or "Hayır"
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
          address: "Ankara, Çankaya, Test Mahallesi", // Sprint 16: Must be at least 10 characters
          phone: "5554444444",
        },
      ],
      recaptchaToken: "test-recaptcha-token", // Sprint 16 - Block E: reCAPTCHA token required
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
      success: true,
      id: "app-new",
      message: "Başvurunuz başarıyla kaydedildi",
    });
    // Sprint 16 - Block E: API now uses Prisma transaction
    expect(prisma.$transaction).toHaveBeenCalled();
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
    // Sprint 16 - Block E: API now uses Zod validation, error message format changed
    expect(data).toHaveProperty("error", "Form validasyonu başarısız oldu");
    expect(data).toHaveProperty("errors"); // Zod errors array
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
    // Sprint 16 - Block E: API now uses Zod validation, error message format changed
    expect(data).toHaveProperty("error", "Form validasyonu başarısız oldu");
    expect(data).toHaveProperty("errors");
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
      relatives: [{ kinship: "Anne", name: "Ayşe", surname: "Demir", birthDate: "1975-01-01", education: "Lise", occupation: "Ev Hanımı", healthInsurance: "Var", healthDisability: "Yok", income: 0, phone: "5553333333" }],
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
    // Sprint 16 - Block E: API now uses Zod validation
    expect(data).toHaveProperty("error", "Form validasyonu başarısız oldu");
    expect(data).toHaveProperty("errors");
  });

  it("should reject application without required arrays (relatives)", async () => {
    const requestBody = {
      name: "Fatma",
      surname: "Demir",
      email: "fatma@example.com",
      phone: "5559876543",
      birthDate: "2001-05-15",
      idIssueDate: "2019-01-01",
      gender: "Kadın",
      birthPlace: "Ankara",
      hometown: "Ankara",
      tcNumber: "12345678950",
      idIssuePlace: "Ankara",
      maritalStatus: "Bekar",
      bankAccount: "Garanti Bankası",
      ibanNumber: "TR330006100519786457841327",
      university: "Ankara Üniversitesi",
      faculty: "Eğitim Fakültesi",
      department: "Sınıf Öğretmenliği",
      grade: "2",
      physicalDisability: "Hayır",
      healthProblem: "Hayır",
      familyMonthlyIncome: 6000,
      familyMonthlyExpenses: 5000,
      scholarshipIncome: "Hayır",
      permanentAddress: "Ankara, Çankaya, Test Mahallesi, Test Sokak No: 123",
      currentAccommodation: "Ev",
      selfIntroduction: "Merhaba, ben Fatma...",
      relatives: [], // Valid: empty array (relatives is optional)
      educationHistory: [{ schoolName: "Fen Lisesi", startDate: "2015-09-01", endDate: "2019-06-01", graduation: "Evet", department: "Fen", percentage: 90 }],
      references: [{ relationship: "Öğretmen", fullName: "Zeynep Kaya", isAcddMember: "Hayır", job: "Öğretmen", address: "Ankara, Çankaya, Test Mahallesi, Test Sokak No: 123", phone: "5554444444" }],
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

    // Sprint 16 - Block E: Relatives is optional (min(0)), so empty array is valid
    expect(response.status).toBe(201);
    expect(data).toHaveProperty("success", true);
    expect(data).toHaveProperty("id");
  });

  it("should reject application with duplicate email", async () => {
    // Sprint 16 - Block E: Mock transaction to throw P2002 error
    vi.mocked(prisma.$transaction).mockRejectedValue({
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
      gender: "Kadın",
      birthPlace: "Ankara",
      hometown: "Ankara",
      tcNumber: "12345678950",
      idIssuePlace: "Ankara",
      maritalStatus: "Bekar",
      bankAccount: "Garanti Bankası",
      ibanNumber: "TR330006100519786457841327",
      university: "Ankara Üniversitesi",
      faculty: "Eğitim Fakültesi",
      department: "Sınıf Öğretmenliği",
      grade: "2",
      physicalDisability: "Hayır",
      healthProblem: "Hayır",
      familyMonthlyIncome: 6000,
      familyMonthlyExpenses: 5000,
      scholarshipIncome: "Hayır",
      permanentAddress: "Ankara, Çankaya, Test Mahallesi, Test Sokak No: 123",
      currentAccommodation: "Ev",
      selfIntroduction: "Merhaba, ben Fatma...",
      relatives: [{ kinship: "Anne", name: "Ayşe", surname: "Demir", birthDate: "1975-01-01", education: "Lise", occupation: "Ev Hanımı", healthInsurance: "Var", healthDisability: "Hayır", income: 0, phone: "5553333333" }],
      educationHistory: [{ schoolName: "Fen Lisesi", startDate: "2015-09-01", endDate: "2019-06-01", graduation: "Evet", department: "Fen", percentage: 90 }],
      references: [{ relationship: "Öğretmen", fullName: "Zeynep Kaya", isAcddMember: "Hayır", job: "Öğretmen", address: "Ankara, Çankaya, Test Mahallesi", phone: "5554444444" }],
      recaptchaToken: "test-recaptcha-token",
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
    // Sprint 16 - Block E: Mock transaction to throw database error
    vi.mocked(prisma.$transaction).mockRejectedValue(
      new Error("Database error")
    );

    const requestBody = {
      name: "Fatma",
      surname: "Demir",
      email: "fatma@example.com",
      phone: "5559876543",
      birthDate: "2001-05-15",
      idIssueDate: "2019-01-01",
      gender: "Kadın",
      birthPlace: "Ankara",
      hometown: "Ankara",
      tcNumber: "12345678950",
      idIssuePlace: "Ankara",
      maritalStatus: "Bekar",
      bankAccount: "Garanti Bankası",
      ibanNumber: "TR330006100519786457841327",
      university: "Ankara Üniversitesi",
      faculty: "Eğitim Fakültesi",
      department: "Sınıf Öğretmenliği",
      grade: "2",
      physicalDisability: "Hayır",
      healthProblem: "Hayır",
      familyMonthlyIncome: 6000,
      familyMonthlyExpenses: 5000,
      scholarshipIncome: "Hayır",
      permanentAddress: "Ankara, Çankaya, Test Mahallesi, Test Sokak No: 123",
      currentAccommodation: "Ev",
      selfIntroduction: "Merhaba, ben Fatma...",
      relatives: [{ kinship: "Anne", name: "Ayşe", surname: "Demir", birthDate: "1975-01-01", education: "Lise", occupation: "Ev Hanımı", healthInsurance: "Var", healthDisability: "Hayır", income: 0, phone: "5553333333" }],
      educationHistory: [{ schoolName: "Fen Lisesi", startDate: "2015-09-01", endDate: "2019-06-01", graduation: "Evet", department: "Fen", percentage: 90 }],
      references: [{ relationship: "Öğretmen", fullName: "Zeynep Kaya", isAcddMember: "Hayır", job: "Öğretmen", address: "Ankara, Çankaya, Test Mahallesi, Test Sokak No: 123", phone: "5554444444" }],
      recaptchaToken: "test-recaptcha-token",
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
      gender: "Kadın",
      birthPlace: "Ankara",
      hometown: "Ankara",
      tcNumber: "1234567890", // Invalid (10 digits, should be 11)
      idIssuePlace: "Ankara",
      maritalStatus: "Bekar",
      bankAccount: "Garanti Bankası",
      ibanNumber: "TR330006100519786457841327",
      university: "Ankara Üniversitesi",
      faculty: "Eğitim Fakültesi",
      department: "Sınıf Öğretmenliği",
      grade: "2",
      physicalDisability: "Hayır",
      healthProblem: "Hayır",
      familyMonthlyIncome: 6000,
      familyMonthlyExpenses: 5000,
      scholarshipIncome: "Hayır",
      permanentAddress: "Ankara, Çankaya, Test Mahallesi, Test Sokak No: 123",
      currentAccommodation: "Ev",
      selfIntroduction: "Merhaba, ben Fatma...",
      relatives: [{ kinship: "Anne", name: "Ayşe", surname: "Demir", birthDate: "1975-01-01", education: "Lise", occupation: "Ev Hanımı", healthInsurance: "Var", healthDisability: "Hayır", income: 0, phone: "5553333333" }],
      educationHistory: [{ schoolName: "Fen Lisesi", startDate: "2015-09-01", endDate: "2019-06-01", graduation: "Evet", department: "Fen", percentage: 90 }],
      references: [{ relationship: "Öğretmen", fullName: "Zeynep Kaya", isAcddMember: "Hayır", job: "Öğretmen", address: "Ankara, Çankaya, Test Mahallesi", phone: "5554444444" }],
      recaptchaToken: "test-recaptcha-token",
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
    // Sprint 16 - Block E: API now uses Zod validation
    expect(data).toHaveProperty("error", "Form validasyonu başarısız oldu");
    expect(data).toHaveProperty("errors");
  });

  it("should return 400 when phone number is invalid", async () => {
    const requestBody = {
      name: "Fatma",
      surname: "Demir",
      email: "fatma@example.com",
      phone: "1234567890", // Invalid (doesn't start with 5)
      birthDate: "2001-05-15",
      idIssueDate: "2019-01-01",
      gender: "Kadın",
      birthPlace: "Ankara",
      hometown: "Ankara",
      tcNumber: "12345678950",
      idIssuePlace: "Ankara",
      maritalStatus: "Bekar",
      bankAccount: "Garanti Bankası",
      ibanNumber: "TR330006100519786457841327",
      university: "Ankara Üniversitesi",
      faculty: "Eğitim Fakültesi",
      department: "Sınıf Öğretmenliği",
      grade: "2",
      physicalDisability: "Hayır",
      healthProblem: "Hayır",
      familyMonthlyIncome: 6000,
      familyMonthlyExpenses: 5000,
      scholarshipIncome: "Hayır",
      permanentAddress: "Ankara, Çankaya, Test Mahallesi, Test Sokak No: 123",
      currentAccommodation: "Ev",
      selfIntroduction: "Merhaba, ben Fatma...",
      relatives: [{ kinship: "Anne", name: "Ayşe", surname: "Demir", birthDate: "1975-01-01", education: "Lise", occupation: "Ev Hanımı", healthInsurance: "Var", healthDisability: "Hayır", income: 0, phone: "5553333333" }],
      educationHistory: [{ schoolName: "Fen Lisesi", startDate: "2015-09-01", endDate: "2019-06-01", graduation: "Evet", department: "Fen", percentage: 90 }],
      references: [{ relationship: "Öğretmen", fullName: "Zeynep Kaya", isAcddMember: "Hayır", job: "Öğretmen", address: "Ankara, Çankaya, Test Mahallesi", phone: "5554444444" }],
      recaptchaToken: "test-recaptcha-token",
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
    // Sprint 16 - Block E: API now uses Zod validation
    expect(data).toHaveProperty("error", "Form validasyonu başarısız oldu");
    expect(data).toHaveProperty("errors");
  });

  it("should return 400 when email is invalid", async () => {
    const requestBody = {
      name: "Fatma",
      surname: "Demir",
      email: "invalid-email", // Invalid email format
      phone: "05551234567",
      birthDate: "2001-05-15",
      idIssueDate: "2019-01-01",
      gender: "Kadın",
      birthPlace: "Ankara",
      hometown: "Ankara",
      tcNumber: "12345678950",
      idIssuePlace: "Ankara",
      maritalStatus: "Bekar",
      bankAccount: "Garanti Bankası",
      ibanNumber: "TR330006100519786457841327",
      university: "Ankara Üniversitesi",
      faculty: "Eğitim Fakültesi",
      department: "Sınıf Öğretmenliği",
      grade: "2",
      physicalDisability: "Hayır",
      healthProblem: "Hayır",
      familyMonthlyIncome: 6000,
      familyMonthlyExpenses: 5000,
      scholarshipIncome: "Hayır",
      permanentAddress: "Ankara, Çankaya, Test Mahallesi, Test Sokak No: 123",
      currentAccommodation: "Ev",
      selfIntroduction: "Merhaba, ben Fatma...",
      relatives: [{ kinship: "Anne", name: "Ayşe", surname: "Demir", birthDate: "1975-01-01", education: "Lise", occupation: "Ev Hanımı", healthInsurance: "Var", healthDisability: "Hayır", income: 0, phone: "5553333333" }],
      educationHistory: [{ schoolName: "Fen Lisesi", startDate: "2015-09-01", endDate: "2019-06-01", graduation: "Evet", department: "Fen", percentage: 90 }],
      references: [{ relationship: "Öğretmen", fullName: "Zeynep Kaya", isAcddMember: "Hayır", job: "Öğretmen", address: "Ankara, Çankaya, Test Mahallesi", phone: "5554444444" }],
      recaptchaToken: "test-recaptcha-token",
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
    // Sprint 16 - Block E: API now uses Zod validation
    expect(data).toHaveProperty("error", "Form validasyonu başarısız oldu");
    expect(data).toHaveProperty("errors");
  });
});
