import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET, POST } from "../route";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole, createAuthErrorResponse } from "@/lib/auth/adminAuth";

// Mock Prisma
vi.mock("@/lib/db", () => ({
  prisma: {
    member: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

// Mock adminAuth - requireRole for POST requests
vi.mock("@/lib/auth/adminAuth", () => ({
  requireRole: vi.fn(),
  createAuthErrorResponse: vi.fn(),
}));

describe("GET /api/members", () => {
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
    // Mock createAuthErrorResponse
    vi.mocked(createAuthErrorResponse).mockImplementation((error: string) => {
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
    });
  });

  it("should return 401 when no session is provided", async () => {
    vi.mocked(requireRole).mockImplementation(() => {
      throw new Error("UNAUTHORIZED");
    });

    const request = new NextRequest("http://localhost:3000/api/members");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toHaveProperty("error", "Oturum bulunamadı. Lütfen giriş yapın.");
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN", "ADMIN"]);
    expect(prisma.member.findMany).not.toHaveBeenCalled();
  });

  it("should return 403 when unauthorized role", async () => {
    vi.mocked(requireRole).mockImplementation(() => {
      throw new Error("FORBIDDEN");
    });

    const request = new NextRequest("http://localhost:3000/api/members");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data).toHaveProperty("error", "Bu işlem için yetkiniz bulunmamaktadır.");
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN", "ADMIN"]);
    expect(prisma.member.findMany).not.toHaveBeenCalled();
  });

  it("should return 200 for ADMIN role", async () => {
    vi.mocked(requireRole).mockReturnValue({
      adminUserId: "admin-1",
      role: "ADMIN" as const,
      email: "admin@acedd.org",
      name: "Admin User",
    });
    vi.mocked(prisma.member.findMany).mockResolvedValue([]);

    const request = new NextRequest("http://localhost:3000/api/members");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN", "ADMIN"]);
  });

  it("should return empty array when no members exist", async () => {
    vi.mocked(prisma.member.findMany).mockResolvedValue([]);

    const request = new NextRequest("http://localhost:3000/api/members");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
    expect(prisma.member.findMany).toHaveBeenCalledWith({
      where: {},
      orderBy: {
        createdAt: "desc",
      },
    });
  });

  it("should return members with correct format", async () => {
    const mockMembers = [
      {
        id: "member-1",
        firstName: "John",
        lastName: "Doe",
        gender: "erkek" as const,
        email: "john@example.com",
        phone: "5551234567",
        birthDate: new Date("1990-01-01T00:00:00Z"),
        placeOfBirth: "Istanbul",
        currentAddress: "Istanbul",
        bloodType: "A_POSITIVE" as any,
        city: "Istanbul",
        tcId: "12345678901",
        lastValidDate: null,
        titles: JSON.stringify(["Üye"]),
        status: "ACTIVE" as const,
        membershipDate: new Date("2024-01-01T00:00:00Z"),
        department: "Bilgisayar Mühendisliği",
        graduationYear: 2015,
        occupation: "Yazılım Geliştirici",
        membershipKind: "MEMBER" as const,
        tags: ["FOUNDING_MEMBER"], // Sprint 5: Prisma Json type array olarak tutuyor
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
    ] as any; // Sprint 5: Mock data için type assertion

    vi.mocked(prisma.member.findMany).mockResolvedValue(mockMembers);

    const request = new NextRequest("http://localhost:3000/api/members");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0]).toMatchObject({
      id: "member-1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      status: "active",
    });
    expect(data[0].birthDate).toBe(mockMembers[0].birthDate.toISOString());
    expect(data[0].membershipDate).toBe(mockMembers[0].membershipDate.toISOString());
    expect(data[0].titles).toEqual(["Üye"]);
    expect(data[0].membershipKind).toBe("MEMBER");
    expect(data[0].tags).toEqual(["FOUNDING_MEMBER"]);
  });

  it("should filter by activeOnly query param", async () => {
    vi.mocked(prisma.member.findMany).mockResolvedValue([]);

    const request = new NextRequest("http://localhost:3000/api/members?activeOnly=true");
    await GET(request);

    expect(prisma.member.findMany).toHaveBeenCalledWith({
      where: {
        status: "ACTIVE",
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  });

  it("should filter by department query param", async () => {
    vi.mocked(prisma.member.findMany).mockResolvedValue([]);

    const request = new NextRequest("http://localhost:3000/api/members?department=Engineering");
    await GET(request);

    expect(prisma.member.findMany).toHaveBeenCalledWith({
      where: {
        department: "Engineering",
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  });

  it("should search by firstName, lastName, or email", async () => {
    vi.mocked(prisma.member.findMany).mockResolvedValue([]);

    const request = new NextRequest("http://localhost:3000/api/members?search=John");
    await GET(request);

    expect(prisma.member.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { firstName: { contains: "John", mode: "insensitive" } },
          { lastName: { contains: "John", mode: "insensitive" } },
          { email: { contains: "John", mode: "insensitive" } },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  });

  it("should handle database errors gracefully", async () => {
    vi.mocked(prisma.member.findMany).mockRejectedValue(new Error("Database error"));

    const request = new NextRequest("http://localhost:3000/api/members");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty("error", "Üyeler yüklenirken bir hata oluştu");
    expect(data).toHaveProperty("message", "Lütfen daha sonra tekrar deneyin");
  });
});

describe("POST /api/members", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock requireRole to return a valid session for all POST tests
    const mockSession = {
      adminUserId: "super-admin-1",
      role: "SUPER_ADMIN" as const,
      email: "superadmin@acedd.org",
      name: "Super Admin",
    };
    vi.mocked(requireRole).mockReturnValue(mockSession);
    // Mock createAuthErrorResponse
    vi.mocked(createAuthErrorResponse).mockImplementation((error: string) => {
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
    });
  });

  it("should create member with valid data", async () => {
    const mockMember = {
      id: "member-new",
      firstName: "Jane",
      lastName: "Smith",
      gender: "kadın" as const,
      email: "jane@example.com",
      phone: "5559876543",
      birthDate: new Date("1995-05-15T00:00:00Z"),
      placeOfBirth: "Ankara",
      currentAddress: "Ankara",
      bloodType: "B_POSITIVE" as any,
      city: "Ankara",
      tcId: null,
      lastValidDate: null,
      titles: JSON.stringify(["Üye"]),
      status: "ACTIVE" as const,
      membershipDate: new Date("2024-06-01T00:00:00Z"),
      department: "İşletme",
      graduationYear: 2020,
      occupation: "Pazarlama Uzmanı",
      membershipKind: "MEMBER" as const,
      tags: null,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    } as any;

    vi.mocked(prisma.member.create).mockResolvedValue(mockMember);

    const requestBody = {
      firstName: "Jane",
      lastName: "Smith",
      gender: "kadın" as const,
      email: "jane@example.com",
      phone: "5559876543",
      birthDate: "1995-05-15T00:00:00Z",
      placeOfBirth: "Ankara",
      currentAddress: "Ankara",
      bloodType: "B_POSITIVE",
      city: "Ankara",
      titles: ["Üye"],
      status: "active",
      membershipDate: "2024-06-01T00:00:00Z",
      department: "İşletme",
      graduationYear: 2020,
      occupation: "Pazarlama Uzmanı",
      membershipKind: "MEMBER",
      tags: [],
    };

    const request = new NextRequest("http://localhost:3000/api/members", {
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
      id: "member-new",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      status: "active",
    });
    expect(data.titles).toEqual(["Üye"]);
    expect(data.membershipKind).toBe("MEMBER");
    expect(prisma.member.create).toHaveBeenCalled();
  });

  it("should create member with membershipKind and tags", async () => {
    const mockMember = {
      id: "member-volunteer",
      firstName: "Volunteer",
      lastName: "User",
      gender: "erkek",
      email: "volunteer@example.com",
      phone: "5551112233",
      birthDate: new Date("1990-01-01T00:00:00Z"),
      academicLevel: "lisans" as const,
      maritalStatus: "bekar" as const,
      hometown: "Istanbul",
      placeOfBirth: "Istanbul",
      nationality: "TR",
      currentAddress: "Istanbul",
      tcId: null,
      lastValidDate: null,
      titles: JSON.stringify([]),
      status: "ACTIVE" as const,
      membershipDate: new Date("2024-01-01T00:00:00Z"),
      department: null,
      graduationYear: null,
      occupation: null,
      membershipKind: "VOLUNTEER" as const,
      tags: ["HONORARY_PRESIDENT"], // Sprint 5: Prisma Json type array olarak tutuyor
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    } as any; // Sprint 5: Mock data için type assertion

    vi.mocked(prisma.member.create).mockResolvedValue(mockMember);

    const requestBody = {
      firstName: "Volunteer",
      lastName: "User",
      gender: "erkek",
      email: "volunteer@example.com",
      phone: "5551112233",
      birthDate: "1990-01-01T00:00:00Z",
      placeOfBirth: "Istanbul",
      currentAddress: "Istanbul",
      bloodType: "O_POSITIVE",
      city: "Istanbul",
      titles: [],
      status: "active",
      membershipDate: "2024-01-01T00:00:00Z",
      membershipKind: "VOLUNTEER",
      tags: ["HONORARY_PRESIDENT"],
    };

    const request = new NextRequest("http://localhost:3000/api/members", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.membershipKind).toBe("VOLUNTEER");
    expect(data.tags).toEqual(["HONORARY_PRESIDENT"]);
    // Sprint 5: tags artık array olarak kaydediliyor (Prisma Json type otomatik olarak JSON'a çeviriyor)
    expect(prisma.member.create).toHaveBeenCalled();
    const createCall = vi.mocked(prisma.member.create).mock.calls[0][0] as any;
    expect(createCall.data.membershipKind).toBe("VOLUNTEER");
    expect(createCall.data.tags).toEqual(["HONORARY_PRESIDENT"]);
  });

  it("should reject member with invalid membershipKind", async () => {
    const requestBody = {
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      birthDate: "1990-01-01T00:00:00Z",
      membershipDate: "2024-01-01T00:00:00Z",
      membershipKind: "INVALID",
    };

    const request = new NextRequest("http://localhost:3000/api/members", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Üyelik türü zorunludur (MEMBER veya VOLUNTEER)");
  });

  it("should reject member with invalid tags", async () => {
    const requestBody = {
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      birthDate: "1990-01-01T00:00:00Z",
      membershipDate: "2024-01-01T00:00:00Z",
      membershipKind: "MEMBER",
      tags: "not-an-array",
    };

    const request = new NextRequest("http://localhost:3000/api/members", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Etiketler dizi formatında olmalıdır");
  });

  it("should reject member without firstName", async () => {
    const requestBody = {
      lastName: "Smith",
      email: "jane@example.com",
      birthDate: "1995-05-15T00:00:00Z",
      membershipDate: "2024-06-01T00:00:00Z",
    };

    const request = new NextRequest("http://localhost:3000/api/members", {
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
    expect(prisma.member.create).not.toHaveBeenCalled();
  });

  it("should reject member without lastName", async () => {
    const requestBody = {
      firstName: "Jane",
      email: "jane@example.com",
      birthDate: "1995-05-15T00:00:00Z",
      membershipDate: "2024-06-01T00:00:00Z",
    };

    const request = new NextRequest("http://localhost:3000/api/members", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Soyad alanı zorunludur");
  });

  it("should reject member without email", async () => {
    const requestBody = {
      firstName: "Jane",
      lastName: "Smith",
      birthDate: "1995-05-15T00:00:00Z",
      membershipDate: "2024-06-01T00:00:00Z",
    };

    const request = new NextRequest("http://localhost:3000/api/members", {
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

  it("should reject member with invalid birthDate", async () => {
    const requestBody = {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      birthDate: "invalid-date",
      membershipDate: "2024-06-01T00:00:00Z",
      membershipKind: "MEMBER", // Sprint 5: membershipKind zorunlu
    };

    const request = new NextRequest("http://localhost:3000/api/members", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Geçerli bir doğum tarihi giriniz");
  });

  it("should reject member with duplicate email", async () => {
    // Mock: İlk validation'ları geç, duplicate email hatası için create çağrısına kadar gel
    vi.mocked(prisma.member.create).mockRejectedValue({
      code: "P2002",
      message: "Unique constraint failed",
    });

    const requestBody = {
      firstName: "Jane",
      lastName: "Smith",
      email: "existing@example.com",
      birthDate: "1995-05-15T00:00:00Z",
      membershipDate: "2024-06-01T00:00:00Z",
      membershipKind: "MEMBER", // Sprint 5: membershipKind zorunlu
    };

    const request = new NextRequest("http://localhost:3000/api/members", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Bu e-posta adresi zaten kullanılıyor");
  });

  it("should handle database errors gracefully", async () => {
    // Mock: İlk validation'ları geç, database error için create çağrısına kadar gel
    vi.mocked(prisma.member.create).mockRejectedValue(new Error("Database error"));

    const requestBody = {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      birthDate: "1995-05-15T00:00:00Z",
      membershipDate: "2024-06-01T00:00:00Z",
      membershipKind: "MEMBER", // Sprint 5: membershipKind zorunlu
    };

    const request = new NextRequest("http://localhost:3000/api/members", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty("error", "Üye kaydedilirken bir hata oluştu");
    expect(data).toHaveProperty("message", "Lütfen bilgilerinizi kontrol edip tekrar deneyin");
  });

  // Sprint 6: Role-based access control tests
  it("should reject ADMIN role for member creation (requires SUPER_ADMIN)", async () => {
    const mockAdminSession = {
      adminUserId: "admin-1",
      role: "ADMIN" as const,
      email: "admin@acedd.org",
      name: "Admin User",
    };
    vi.mocked(requireRole).mockImplementation(() => {
      throw new Error("FORBIDDEN");
    });

    const requestBody = {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      birthDate: "1995-05-15T00:00:00Z",
      membershipDate: "2024-06-01T00:00:00Z",
      membershipKind: "MEMBER",
    };

    const request = new NextRequest("http://localhost:3000/api/members", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data).toHaveProperty("error");
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN"]);
  });

  it("should reject UNAUTHORIZED requests (no session)", async () => {
    vi.mocked(requireRole).mockImplementation(() => {
      throw new Error("UNAUTHORIZED");
    });

    const requestBody = {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      birthDate: "1995-05-15T00:00:00Z",
      membershipDate: "2024-06-01T00:00:00Z",
      membershipKind: "MEMBER",
    };

    const request = new NextRequest("http://localhost:3000/api/members", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toHaveProperty("error");
  });

  // Production-level edge case tests
  it("should automatically set status to ACTIVE for new members", async () => {
    const mockMember = {
      id: "member-new",
      firstName: "Test",
      lastName: "User",
      gender: "erkek" as const,
      email: "test@example.com",
      phone: "5551234567",
      birthDate: new Date("1990-01-01T00:00:00Z"),
      placeOfBirth: "Istanbul",
      currentAddress: "Istanbul",
      bloodType: "A_POSITIVE" as any,
      city: "Istanbul",
      tcId: null,
      lastValidDate: null,
      titles: JSON.stringify([]),
      status: "ACTIVE" as const,
      membershipDate: new Date("2024-01-01T00:00:00Z"),
      membershipKind: "MEMBER" as const,
      tags: null,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    } as any;

    vi.mocked(prisma.member.create).mockResolvedValue(mockMember);

    const requestBody = {
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      birthDate: "1990-01-01T00:00:00Z",
      membershipDate: "2024-01-01T00:00:00Z",
      membershipKind: "MEMBER",
      // status not provided - should default to ACTIVE
    };

    const request = new NextRequest("http://localhost:3000/api/members", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.status).toBe("active");
    const createCall = vi.mocked(prisma.member.create).mock.calls[0][0] as any;
    expect(createCall.data.status).toBe("ACTIVE");
  });

  it("should handle whitespace trimming in all string fields", async () => {
    const mockMember = {
      id: "member-new",
      firstName: "Test",
      lastName: "User",
      gender: "erkek" as const,
      email: "test@example.com",
      phone: "05551234567",
      birthDate: new Date("1990-01-01T00:00:00Z"),
      placeOfBirth: "Istanbul",
      currentAddress: "Istanbul",
      bloodType: "A_POSITIVE" as any,
      city: "Istanbul",
      tcId: null,
      lastValidDate: null,
      titles: JSON.stringify([]),
      status: "ACTIVE" as const,
      membershipDate: new Date("2024-01-01T00:00:00Z"),
      membershipKind: "MEMBER" as const,
      tags: null,
      department: null,
      graduationYear: null,
      occupation: null,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    } as any;

    vi.mocked(prisma.member.create).mockResolvedValue(mockMember);

    const requestBody = {
      firstName: "  Test  ",
      lastName: "  User  ",
      email: "  test@example.com  ",
      birthDate: "1990-01-01T00:00:00Z",
      membershipDate: "2024-01-01T00:00:00Z",
      membershipKind: "MEMBER",
    };

    const request = new NextRequest("http://localhost:3000/api/members", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(201);
    const createCall = vi.mocked(prisma.member.create).mock.calls[0][0] as any;
    expect(createCall.data.firstName).toBe("Test");
    expect(createCall.data.lastName).toBe("User");
    expect(createCall.data.email).toBe("test@example.com");
  });

  it("should accept future birthDate (no validation at API level)", async () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);

    const mockMember = {
      id: "member-new",
      firstName: "Test",
      lastName: "User",
      gender: "erkek" as const,
      email: "test@example.com",
      phone: null,
      birthDate: futureDate,
      placeOfBirth: null,
      currentAddress: null,
      bloodType: null,
      city: null,
      tcId: null,
      lastValidDate: null,
      titles: JSON.stringify([]),
      status: "ACTIVE" as const,
      membershipDate: new Date("2024-01-01T00:00:00Z"),
      membershipKind: "MEMBER" as const,
      tags: null,
      department: null,
      graduationYear: null,
      occupation: null,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    } as any;

    vi.mocked(prisma.member.create).mockResolvedValue(mockMember);

    const requestBody = {
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      birthDate: futureDate.toISOString(), // Future date
      membershipDate: "2024-01-01T00:00:00Z",
      membershipKind: "MEMBER",
    };

    const request = new NextRequest("http://localhost:3000/api/members", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);

    // Should accept the date (validation happens at business logic level if needed)
    // But the date should be parsed correctly
    expect(response.status).toBe(201);
  });

  it("should return 400 when TC Number is invalid", async () => {
    const requestBody = {
      firstName: "Jane",
      lastName: "Smith",
      gender: "kadın" as const,
      email: "jane@example.com",
      phone: "5559876543",
      birthDate: "1995-05-15T00:00:00Z",
      placeOfBirth: "Ankara",
      currentAddress: "Ankara",
      bloodType: "B_POSITIVE",
      city: "Ankara",
      titles: ["Üye"],
      status: "active",
      membershipDate: "2024-06-01T00:00:00Z",
      membershipKind: "MEMBER",
      tags: [],
      tcId: "1234567890", // Invalid (10 digits, should be 11)
    };

    const request = new NextRequest("http://localhost:3000/api/members", {
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
    expect(prisma.member.create).not.toHaveBeenCalled();
  });
});
