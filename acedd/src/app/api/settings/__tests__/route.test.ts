/**
 * Tests for Settings API (Sprint 10)
 * 
 * GET /api/settings
 * PUT /api/settings
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET, PUT } from "../route";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole, createAuthErrorResponse } from "@/lib/auth/adminAuth";
import { NextResponse } from "next/server";

// Mock Prisma
vi.mock("@/lib/db", () => ({
  prisma: {
    setting: {
      findMany: vi.fn(),
      upsert: vi.fn(),
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

describe("GET /api/settings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 403 when ADMIN tries to access settings", async () => {
    // Mock requireRole to throw FORBIDDEN for ADMIN
    vi.mocked(requireRole).mockImplementation(() => {
      throw new Error("FORBIDDEN");
    });

    const request = new NextRequest("http://localhost:3000/api/settings");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe("Bu işlem için yetkiniz bulunmamaktadır.");
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN"]);
    expect(prisma.setting.findMany).not.toHaveBeenCalled();
  });

  it("should return 401 when unauthorized", async () => {
    // Mock requireRole to throw UNAUTHORIZED
    vi.mocked(requireRole).mockImplementation(() => {
      throw new Error("UNAUTHORIZED");
    });

    const request = new NextRequest("http://localhost:3000/api/settings");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Oturum bulunamadı. Lütfen giriş yapın.");
    expect(prisma.setting.findMany).not.toHaveBeenCalled();
  });

  it("should return all settings when no prefix is provided", async () => {
    // Mock requireRole to return SUPER_ADMIN session
    const mockSession = {
      adminUserId: "super-admin-1",
      role: "SUPER_ADMIN" as const,
      email: "superadmin@acedd.org",
      name: "Super Admin",
    };
    vi.mocked(requireRole).mockReturnValue(mockSession);

    const mockSettings = [
      {
        id: "setting-1",
        key: "site.name",
        value: "ACEDD",
        updatedAt: new Date("2024-01-15T10:00:00Z"),
        updatedBy: "super-admin-1",
      },
      {
        id: "setting-2",
        key: "contact.email",
        value: "info@acedd.org",
        updatedAt: new Date("2024-01-15T10:00:00Z"),
        updatedBy: "super-admin-1",
      },
    ];

    vi.mocked(prisma.setting.findMany).mockResolvedValue(mockSettings as any);

    const request = new NextRequest("http://localhost:3000/api/settings");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(2);
    expect(data[0]).toMatchObject({
      id: "setting-1",
      key: "site.name",
      value: "ACEDD",
      updatedAt: "2024-01-15T10:00:00.000Z",
      updatedBy: "super-admin-1",
    });
    expect(prisma.setting.findMany).toHaveBeenCalledWith({
      where: {},
      orderBy: { key: "asc" },
    });
  });

  it("should filter settings by prefix when prefix query param is provided", async () => {
    // Mock requireRole to return SUPER_ADMIN session
    const mockSession = {
      adminUserId: "super-admin-1",
      role: "SUPER_ADMIN" as const,
      email: "superadmin@acedd.org",
      name: "Super Admin",
    };
    vi.mocked(requireRole).mockReturnValue(mockSession);

    const mockSettings = [
      {
        id: "setting-1",
        key: "site.name",
        value: "ACEDD",
        updatedAt: new Date("2024-01-15T10:00:00Z"),
        updatedBy: "super-admin-1",
      },
      {
        id: "setting-2",
        key: "site.description",
        value: "Araştırma, Çevre ve Doğa Derneği",
        updatedAt: new Date("2024-01-15T10:00:00Z"),
        updatedBy: "super-admin-1",
      },
    ];

    vi.mocked(prisma.setting.findMany).mockResolvedValue(mockSettings as any);

    const request = new NextRequest("http://localhost:3000/api/settings?prefix=site");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(2);
    expect(data.every((s: any) => s.key.startsWith("site."))).toBe(true);
    expect(prisma.setting.findMany).toHaveBeenCalledWith({
      where: {
        key: {
          startsWith: "site.",
        },
      },
      orderBy: { key: "asc" },
    });
  });

  it("should handle database errors gracefully", async () => {
    // Mock requireRole to return SUPER_ADMIN session
    const mockSession = {
      adminUserId: "super-admin-1",
      role: "SUPER_ADMIN" as const,
      email: "superadmin@acedd.org",
      name: "Super Admin",
    };
    vi.mocked(requireRole).mockReturnValue(mockSession);

    vi.mocked(prisma.setting.findMany).mockRejectedValue(
      new Error("Database connection error")
    );

    const request = new NextRequest("http://localhost:3000/api/settings");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to fetch settings");
    expect(data.message).toBe("Database connection error");
  });
});

describe("PUT /api/settings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 403 when ADMIN tries to update settings", async () => {
    // Mock requireRole to throw FORBIDDEN for ADMIN
    vi.mocked(requireRole).mockImplementation(() => {
      throw new Error("FORBIDDEN");
    });

    const body = {
      key: "site.name",
      value: "ACEDD",
    };

    const request = new NextRequest("http://localhost:3000/api/settings", {
      method: "PUT",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe("Bu işlem için yetkiniz bulunmamaktadır.");
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN"]);
    expect(prisma.setting.upsert).not.toHaveBeenCalled();
  });

  it("should return 401 when unauthorized", async () => {
    // Mock requireRole to throw UNAUTHORIZED
    vi.mocked(requireRole).mockImplementation(() => {
      throw new Error("UNAUTHORIZED");
    });

    const body = {
      key: "site.name",
      value: "ACEDD",
    };

    const request = new NextRequest("http://localhost:3000/api/settings", {
      method: "PUT",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Oturum bulunamadı. Lütfen giriş yapın.");
    expect(prisma.setting.upsert).not.toHaveBeenCalled();
  });

  it("should return 400 when key is missing", async () => {
    // Mock requireRole to return SUPER_ADMIN session
    const mockSession = {
      adminUserId: "super-admin-1",
      role: "SUPER_ADMIN" as const,
      email: "superadmin@acedd.org",
      name: "Super Admin",
    };
    vi.mocked(requireRole).mockReturnValue(mockSession);

    const body = {
      value: "ACEDD",
    };

    const request = new NextRequest("http://localhost:3000/api/settings", {
      method: "PUT",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Validation error");
    expect(data.message).toContain("key is required");
    expect(prisma.setting.upsert).not.toHaveBeenCalled();
  });

  it("should return 400 when value is missing", async () => {
    // Mock requireRole to return SUPER_ADMIN session
    const mockSession = {
      adminUserId: "super-admin-1",
      role: "SUPER_ADMIN" as const,
      email: "superadmin@acedd.org",
      name: "Super Admin",
    };
    vi.mocked(requireRole).mockReturnValue(mockSession);

    const body = {
      key: "site.name",
    };

    const request = new NextRequest("http://localhost:3000/api/settings", {
      method: "PUT",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Validation error");
    expect(data.message).toContain("value is required");
    expect(prisma.setting.upsert).not.toHaveBeenCalled();
  });

  it("should return 400 when key does not use dot notation", async () => {
    // Mock requireRole to return SUPER_ADMIN session
    const mockSession = {
      adminUserId: "super-admin-1",
      role: "SUPER_ADMIN" as const,
      email: "superadmin@acedd.org",
      name: "Super Admin",
    };
    vi.mocked(requireRole).mockReturnValue(mockSession);

    const body = {
      key: "sitename", // No dot notation
      value: "ACEDD",
    };

    const request = new NextRequest("http://localhost:3000/api/settings", {
      method: "PUT",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Validation error");
    expect(data.message).toContain("dot notation");
    expect(prisma.setting.upsert).not.toHaveBeenCalled();
  });

  it("should create a new setting when key does not exist", async () => {
    // Mock requireRole to return SUPER_ADMIN session
    const mockSession = {
      adminUserId: "super-admin-1",
      role: "SUPER_ADMIN" as const,
      email: "superadmin@acedd.org",
      name: "Super Admin",
    };
    vi.mocked(requireRole).mockReturnValue(mockSession);

    const mockSetting = {
      id: "setting-1",
      key: "site.name",
      value: "ACEDD",
      updatedAt: new Date("2024-01-15T10:00:00Z"),
      updatedBy: "super-admin-1",
    };

    vi.mocked(prisma.setting.upsert).mockResolvedValue(mockSetting as any);

    const body = {
      key: "site.name",
      value: "ACEDD",
    };

    const request = new NextRequest("http://localhost:3000/api/settings", {
      method: "PUT",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      id: "setting-1",
      key: "site.name",
      value: "ACEDD",
      updatedAt: "2024-01-15T10:00:00.000Z",
      updatedBy: "super-admin-1",
    });
    expect(prisma.setting.upsert).toHaveBeenCalledWith({
      where: { key: "site.name" },
      update: {
        value: "ACEDD",
        updatedBy: "super-admin-1",
      },
      create: {
        key: "site.name",
        value: "ACEDD",
        updatedBy: "super-admin-1",
      },
    });
  });

  it("should update an existing setting when key exists", async () => {
    // Mock requireRole to return SUPER_ADMIN session
    const mockSession = {
      adminUserId: "super-admin-1",
      role: "SUPER_ADMIN" as const,
      email: "superadmin@acedd.org",
      name: "Super Admin",
    };
    vi.mocked(requireRole).mockReturnValue(mockSession);

    const mockSetting = {
      id: "setting-1",
      key: "site.name",
      value: "ACEDD Updated",
      updatedAt: new Date("2024-01-15T11:00:00Z"),
      updatedBy: "super-admin-1",
    };

    vi.mocked(prisma.setting.upsert).mockResolvedValue(mockSetting as any);

    const body = {
      key: "site.name",
      value: "ACEDD Updated",
    };

    const request = new NextRequest("http://localhost:3000/api/settings", {
      method: "PUT",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.value).toBe("ACEDD Updated");
    expect(prisma.setting.upsert).toHaveBeenCalledWith({
      where: { key: "site.name" },
      update: {
        value: "ACEDD Updated",
        updatedBy: "super-admin-1",
      },
      create: {
        key: "site.name",
        value: "ACEDD Updated",
        updatedBy: "super-admin-1",
      },
    });
  });

  it("should handle null values", async () => {
    // Mock requireRole to return SUPER_ADMIN session
    const mockSession = {
      adminUserId: "super-admin-1",
      role: "SUPER_ADMIN" as const,
      email: "superadmin@acedd.org",
      name: "Super Admin",
    };
    vi.mocked(requireRole).mockReturnValue(mockSession);

    const mockSetting = {
      id: "setting-1",
      key: "site.logoUrl",
      value: null,
      updatedAt: new Date("2024-01-15T10:00:00Z"),
      updatedBy: "super-admin-1",
    };

    vi.mocked(prisma.setting.upsert).mockResolvedValue(mockSetting as any);

    const body = {
      key: "site.logoUrl",
      value: null,
    };

    const request = new NextRequest("http://localhost:3000/api/settings", {
      method: "PUT",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.value).toBeNull();
  });

  it("should handle object values", async () => {
    // Mock requireRole to return SUPER_ADMIN session
    const mockSession = {
      adminUserId: "super-admin-1",
      role: "SUPER_ADMIN" as const,
      email: "superadmin@acedd.org",
      name: "Super Admin",
    };
    vi.mocked(requireRole).mockReturnValue(mockSession);

    const mockValue = { theme: "dark", language: "tr" };
    const mockSetting = {
      id: "setting-1",
      key: "site.config",
      value: mockValue,
      updatedAt: new Date("2024-01-15T10:00:00Z"),
      updatedBy: "super-admin-1",
    };

    vi.mocked(prisma.setting.upsert).mockResolvedValue(mockSetting as any);

    const body = {
      key: "site.config",
      value: mockValue,
    };

    const request = new NextRequest("http://localhost:3000/api/settings", {
      method: "PUT",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.value).toEqual(mockValue);
  });

  it("should handle database errors gracefully", async () => {
    // Mock requireRole to return SUPER_ADMIN session
    const mockSession = {
      adminUserId: "super-admin-1",
      role: "SUPER_ADMIN" as const,
      email: "superadmin@acedd.org",
      name: "Super Admin",
    };
    vi.mocked(requireRole).mockReturnValue(mockSession);

    vi.mocked(prisma.setting.upsert).mockRejectedValue(
      new Error("Database connection error")
    );

    const body = {
      key: "site.name",
      value: "ACEDD",
    };

    const request = new NextRequest("http://localhost:3000/api/settings", {
      method: "PUT",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to upsert setting");
    expect(data.message).toBe("Database connection error");
  });
});

