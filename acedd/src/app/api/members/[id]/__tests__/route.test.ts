import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET, PUT, DELETE } from "../route";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole, createAuthErrorResponse, getAdminFromRequest } from "@/lib/auth/adminAuth";

// Mock Prisma
vi.mock("@/lib/db", () => ({
  prisma: {
    member: {
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

// Mock validateMemberTags
vi.mock("@/lib/utils/memberHelpers", () => ({
  validateMemberTags: vi.fn((tags: string[]) => ({ valid: true, invalidTags: [] })),
}));

// Helper to parse JSON string to array (matching route implementation)
function parseJsonArray(jsonString: string | null | undefined): string[] | null {
  if (!jsonString) return null;
  try {
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

describe("GET /api/members/[id]", () => {
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

    const params = Promise.resolve({ id: "member-1" });
    const request = new NextRequest("http://localhost:3000/api/members/member-1");
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toHaveProperty("error", "Oturum bulunamadı. Lütfen giriş yapın.");
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN", "ADMIN"]);
    expect(prisma.member.findUnique).not.toHaveBeenCalled();
  });

  it("should return 403 when unauthorized role", async () => {
    vi.mocked(requireRole).mockImplementation(() => {
      throw new Error("FORBIDDEN");
    });

    const params = Promise.resolve({ id: "member-1" });
    const request = new NextRequest("http://localhost:3000/api/members/member-1");
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data).toHaveProperty("error", "Bu işlem için yetkiniz bulunmamaktadır.");
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN", "ADMIN"]);
    expect(prisma.member.findUnique).not.toHaveBeenCalled();
  });

  it("should return 200 for ADMIN role", async () => {
    vi.mocked(requireRole).mockReturnValue({
      adminUserId: "admin-1",
      role: "ADMIN" as const,
      email: "admin@acedd.org",
      name: "Admin User",
    });

    const mockMember = {
      id: "member-1",
      firstName: "John",
      lastName: "Doe",
      gender: "erkek",
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
      status: "ACTIVE",
      membershipDate: new Date("2024-01-01T00:00:00Z"),
      membershipKind: "MEMBER",
      tags: ["FOUNDING_MEMBER"],
      department: "Bilgisayar Mühendisliği",
      graduationYear: 2015,
      occupation: "Yazılım Geliştirici",
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    } as any;

    vi.mocked(prisma.member.findUnique).mockResolvedValue(mockMember);

    const params = Promise.resolve({ id: "member-1" });
    const request = new NextRequest("http://localhost:3000/api/members/member-1");
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      id: "member-1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      status: "active",
    });
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN", "ADMIN"]);
  });

  it("should return member with correct format", async () => {
    const mockMember = {
      id: "member-1",
      firstName: "John",
      lastName: "Doe",
      gender: "erkek",
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
      status: "ACTIVE",
      membershipDate: new Date("2024-01-01T00:00:00Z"),
      membershipKind: "MEMBER",
      tags: ["FOUNDING_MEMBER"],
      department: "Bilgisayar Mühendisliği",
      graduationYear: 2015,
      occupation: "Yazılım Geliştirici",
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    } as any;

    vi.mocked(prisma.member.findUnique).mockResolvedValue(mockMember);

    const params = Promise.resolve({ id: "member-1" });
    const request = new NextRequest("http://localhost:3000/api/members/member-1");
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      id: "member-1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      status: "active",
    });
    expect(data.birthDate).toBe(mockMember.birthDate.toISOString());
    expect(data.membershipDate).toBe(mockMember.membershipDate.toISOString());
    expect(data.titles).toEqual(["Üye"]);
    expect(data.membershipKind).toBe("MEMBER");
    expect(data.tags).toEqual(["FOUNDING_MEMBER"]);
  });

  it("should return 404 when member not found", async () => {
    vi.mocked(prisma.member.findUnique).mockResolvedValue(null);

    const params = Promise.resolve({ id: "non-existent" });
    const request = new NextRequest("http://localhost:3000/api/members/non-existent");
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toHaveProperty("error", "Üye bulunamadı");
  });

  it("should handle database errors gracefully", async () => {
    vi.mocked(prisma.member.findUnique).mockRejectedValue(new Error("Database error"));

    const params = Promise.resolve({ id: "member-1" });
    const request = new NextRequest("http://localhost:3000/api/members/member-1");
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty("error", "Üye yüklenirken bir hata oluştu");
    expect(data).toHaveProperty("message", "Lütfen daha sonra tekrar deneyin");
  });
});

describe("PUT /api/members/[id]", () => {
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

  it("should return 403 when ADMIN role tries to update", async () => {
    vi.mocked(requireRole).mockImplementation(() => {
      throw new Error("FORBIDDEN");
    });

    const params = Promise.resolve({ id: "member-1" });
    const request = new NextRequest("http://localhost:3000/api/members/member-1", {
      method: "PUT",
      body: JSON.stringify({ firstName: "Updated" }),
      headers: { "Content-Type": "application/json" },
    });
    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data).toHaveProperty("error", "Bu işlem için yetkiniz bulunmamaktadır.");
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN"]);
    expect(prisma.member.update).not.toHaveBeenCalled();
  });

  it("should update member with partial data", async () => {
    const existingMember = {
      id: "member-1",
      firstName: "John",
      lastName: "Doe",
      gender: "erkek",
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
      status: "ACTIVE",
      membershipDate: new Date("2024-01-01T00:00:00Z"),
      membershipKind: "MEMBER",
      tags: null,
      department: null,
      graduationYear: null,
      occupation: null,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    } as any;

    const updatedMember = {
      ...existingMember,
      firstName: "Updated",
      phone: "5559998888",
      updatedAt: new Date("2024-01-02T00:00:00Z"),
    };

    vi.mocked(prisma.member.findUnique).mockResolvedValue(existingMember);
    vi.mocked(prisma.member.update).mockResolvedValue(updatedMember);

    const requestBody = {
      firstName: "Updated",
      phone: "5559998888",
    };

    const params = Promise.resolve({ id: "member-1" });
    const request = new NextRequest("http://localhost:3000/api/members/member-1", {
      method: "PUT",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" },
    });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.firstName).toBe("Updated");
    expect(data.phone).toBe("5559998888");
    expect(prisma.member.update).toHaveBeenCalled();
  });

  it("should update bloodType and city fields", async () => {
    const existingMember = {
      id: "member-1",
      firstName: "John",
      lastName: "Doe",
      gender: "erkek",
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
      status: "ACTIVE",
      membershipDate: new Date("2024-01-01T00:00:00Z"),
      membershipKind: "MEMBER",
      tags: null,
      department: null,
      graduationYear: null,
      occupation: null,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    } as any;

    const updatedMember = {
      ...existingMember,
      bloodType: "B_POSITIVE" as any,
      city: "Ankara",
      updatedAt: new Date("2024-01-02T00:00:00Z"),
    };

    vi.mocked(prisma.member.findUnique).mockResolvedValue(existingMember);
    vi.mocked(prisma.member.update).mockResolvedValue(updatedMember);

    const requestBody = {
      bloodType: "B_POSITIVE",
      city: "Ankara",
    };

    const params = Promise.resolve({ id: "member-1" });
    const request = new NextRequest("http://localhost:3000/api/members/member-1", {
      method: "PUT",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" },
    });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.bloodType).toBe("B_POSITIVE");
    expect(data.city).toBe("Ankara");
  });
});

describe("DELETE /api/members/[id]", () => {
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

    const params = Promise.resolve({ id: "member-1" });
    const request = new NextRequest("http://localhost:3000/api/members/member-1", {
      method: "DELETE",
    });
    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toHaveProperty("error", "Oturum bulunamadı. Lütfen giriş yapın.");
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN"]);
    expect(prisma.member.delete).not.toHaveBeenCalled();
  });

  it("should return 403 when ADMIN role tries to delete", async () => {
    vi.mocked(requireRole).mockImplementation(() => {
      throw new Error("FORBIDDEN");
    });

    const params = Promise.resolve({ id: "member-1" });
    const request = new NextRequest("http://localhost:3000/api/members/member-1", {
      method: "DELETE",
    });
    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data).toHaveProperty("error", "Bu işlem için yetkiniz bulunmamaktadır.");
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN"]);
    expect(prisma.member.delete).not.toHaveBeenCalled();
  });

  it("should delete member successfully", async () => {
    vi.mocked(prisma.member.delete).mockResolvedValue({} as any);

    const params = Promise.resolve({ id: "member-1" });
    const request = new NextRequest("http://localhost:3000/api/members/member-1", {
      method: "DELETE",
    });
    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("message", "Üye başarıyla silindi");
    expect(prisma.member.delete).toHaveBeenCalledWith({
      where: { id: "member-1" },
    });
  });

  it("should return 404 when member not found", async () => {
    vi.mocked(prisma.member.delete).mockRejectedValue({
      code: "P2025",
      message: "Record not found",
    });

    const params = Promise.resolve({ id: "non-existent" });
    const request = new NextRequest("http://localhost:3000/api/members/non-existent", {
      method: "DELETE",
    });
    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toHaveProperty("error", "Üye bulunamadı");
  });

  it("should handle database errors gracefully", async () => {
    vi.mocked(prisma.member.delete).mockRejectedValue(new Error("Database error"));

    const params = Promise.resolve({ id: "member-1" });
    const request = new NextRequest("http://localhost:3000/api/members/member-1", {
      method: "DELETE",
    });
    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty("error", "Üye silinirken bir hata oluştu");
    expect(data).toHaveProperty("message", "Lütfen daha sonra tekrar deneyin");
  });
});
