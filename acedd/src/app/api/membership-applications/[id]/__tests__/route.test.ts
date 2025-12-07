import { describe, it, expect, beforeEach, vi } from "vitest";
import { PUT } from "../route";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole, createAuthErrorResponse } from "@/lib/auth/adminAuth";
import { NextResponse } from "next/server";

// Mock Prisma
vi.mock("@/lib/db", () => ({
  prisma: {
    membershipApplication: {
      findUnique: vi.fn(),
      update: vi.fn(),
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

describe("PUT /api/membership-applications/[id] - Role-based access control", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 403 when ADMIN tries to approve application", async () => {
    // Mock requireRole to throw FORBIDDEN for ADMIN
    vi.mocked(requireRole).mockImplementation(() => {
      throw new Error("FORBIDDEN");
    });
    vi.mocked(createAuthErrorResponse).mockReturnValue(
      new Response(JSON.stringify({ error: "Bu işlem için yetkiniz bulunmamaktadır." }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }) as any
    );

    const body = {
      status: "approved",
    };

    const request = new NextRequest("http://localhost:3000/api/membership-applications/app-1", {
      method: "PUT",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
      cookies: {
        get: vi.fn(() => ({
          value: Buffer.from(
            JSON.stringify({
              adminUserId: "admin-1",
              role: "ADMIN",
              email: "admin@acedd.org",
              name: "Admin User",
            })
          ).toString("base64"),
        })),
      },
    } as any);

    const params = Promise.resolve({ id: "app-1" });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe("Bu işlem için yetkiniz bulunmamaktadır.");
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN"]);
    expect(prisma.membershipApplication.update).not.toHaveBeenCalled();
    expect(createAuthErrorResponse).toHaveBeenCalledWith("FORBIDDEN");
  });

  it("should return 200 when SUPER_ADMIN approves application", async () => {
    // Mock requireRole to return session for SUPER_ADMIN
    const mockSession = {
      adminUserId: "super-admin-1",
      role: "SUPER_ADMIN" as const,
      email: "superadmin@acedd.org",
      name: "Super Admin",
    };
    vi.mocked(requireRole).mockReturnValue(mockSession);

    const mockApplication = {
      id: "app-1",
      firstName: "John",
      lastName: "Doe",
      gender: "erkek",
      email: "john@example.com",
      phone: "555-1234",
      birthDate: new Date("2000-01-01"),
      academicLevel: "lisans",
      maritalStatus: "bekar",
      hometown: "Istanbul",
      placeOfBirth: "Istanbul",
      nationality: "TR",
      currentAddress: "Istanbul",
      tcId: null,
      lastValidDate: null,
      status: "APPROVED",
      applicationDate: new Date("2024-01-01"),
      reviewedAt: new Date("2024-01-02"),
      reviewedBy: "super-admin-1",
      notes: null,
      department: null,
      reason: null,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-02"),
    };

    vi.mocked(prisma.membershipApplication.update).mockResolvedValue(mockApplication);

    const body = {
      status: "approved",
      notes: "Approved by super admin",
    };

    const request = new NextRequest("http://localhost:3000/api/membership-applications/app-1", {
      method: "PUT",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
      cookies: {
        get: vi.fn(() => ({
          value: Buffer.from(JSON.stringify(mockSession)).toString("base64"),
        })),
      },
    } as any);

    const params = Promise.resolve({ id: "app-1" });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe("approved");
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN"]);
    expect(prisma.membershipApplication.update).toHaveBeenCalledWith({
      where: { id: "app-1" },
      data: expect.objectContaining({
        status: "APPROVED",
        notes: "Approved by super admin",
      }),
    });
  });

  it("should return 401 when no session cookie is present", async () => {
    // Mock requireRole to throw UNAUTHORIZED
    vi.mocked(requireRole).mockImplementation(() => {
      throw new Error("UNAUTHORIZED");
    });
    vi.mocked(createAuthErrorResponse).mockReturnValue(
      new Response(JSON.stringify({ error: "Oturum bulunamadı. Lütfen giriş yapın." }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }) as any
    );

    const body = {
      status: "approved",
    };

    const request = new NextRequest("http://localhost:3000/api/membership-applications/app-1", {
      method: "PUT",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
      cookies: {
        get: vi.fn(() => undefined),
      },
    } as any);

    const params = Promise.resolve({ id: "app-1" });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Oturum bulunamadı. Lütfen giriş yapın.");
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN"]);
    expect(prisma.membershipApplication.update).not.toHaveBeenCalled();
    expect(createAuthErrorResponse).toHaveBeenCalledWith("UNAUTHORIZED");
  });
});
