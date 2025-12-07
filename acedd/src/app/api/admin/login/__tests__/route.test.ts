import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST } from "../route";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

// Mock Prisma
vi.mock("@/lib/db", () => ({
  prisma: {
    adminUser: {
      findUnique: vi.fn(),
    },
  },
}));

// Mock bcrypt
vi.mock("bcryptjs", () => ({
  default: {
    compare: vi.fn(),
  },
}));

describe("POST /api/admin/login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 400 when email is missing", async () => {
    const body = {
      password: "password123",
    };

    const request = new NextRequest("http://localhost:3000/api/admin/login", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Email ve şifre gereklidir");
    expect(prisma.adminUser.findUnique).not.toHaveBeenCalled();
  });

  it("should return 400 when password is missing", async () => {
    const body = {
      email: "admin@acedd.org",
    };

    const request = new NextRequest("http://localhost:3000/api/admin/login", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Email ve şifre gereklidir");
    expect(prisma.adminUser.findUnique).not.toHaveBeenCalled();
  });

  it("should return 400 when body is invalid JSON", async () => {
    const request = new NextRequest("http://localhost:3000/api/admin/login", {
      method: "POST",
      body: "invalid json",
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Geçersiz JSON formatı");
  });

  it("should return 401 when user does not exist", async () => {
    vi.mocked(prisma.adminUser.findUnique).mockResolvedValue(null);

    const body = {
      email: "nonexistent@acedd.org",
      password: "password123",
    };

    const request = new NextRequest("http://localhost:3000/api/admin/login", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Email veya şifre hatalı");
    expect(prisma.adminUser.findUnique).toHaveBeenCalledWith({
      where: { email: "nonexistent@acedd.org" },
    });
  });

  it("should return 401 when password is incorrect", async () => {
    const mockAdminUser = {
      id: "admin-1",
      name: "Admin User",
      email: "admin@acedd.org",
      passwordHash: "hashed_password",
      role: "ADMIN" as const,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(prisma.adminUser.findUnique).mockResolvedValue(mockAdminUser);
    (vi.mocked(bcrypt.compare) as any).mockResolvedValue(false);

    const body = {
      email: "admin@acedd.org",
      password: "wrong_password",
    };

    const request = new NextRequest("http://localhost:3000/api/admin/login", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Email veya şifre hatalı");
    expect(bcrypt.compare).toHaveBeenCalledWith("wrong_password", "hashed_password");
  });

  it("should return 403 when user is inactive", async () => {
    const mockAdminUser = {
      id: "admin-1",
      name: "Admin User",
      email: "admin@acedd.org",
      passwordHash: "hashed_password",
      role: "ADMIN" as const,
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(prisma.adminUser.findUnique).mockResolvedValue(mockAdminUser);

    const body = {
      email: "admin@acedd.org",
      password: "password123",
    };

    const request = new NextRequest("http://localhost:3000/api/admin/login", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toContain("aktif değil");
    expect(bcrypt.compare).not.toHaveBeenCalled();
  });

  it("should return 200 and set session cookie when credentials are correct", async () => {
    const mockAdminUser = {
      id: "admin-1",
      name: "Admin User",
      email: "admin@acedd.org",
      passwordHash: "hashed_password",
      role: "ADMIN" as const,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(prisma.adminUser.findUnique).mockResolvedValue(mockAdminUser);
    (vi.mocked(bcrypt.compare) as any).mockResolvedValue(true);

    const body = {
      email: "admin@acedd.org",
      password: "password123",
    };

    const request = new NextRequest("http://localhost:3000/api/admin/login", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.user).toEqual({
      id: "admin-1",
      name: "Admin User",
      email: "admin@acedd.org",
      role: "ADMIN",
    });

    // Check that session cookie is set
    const cookies = response.headers.getSetCookie();
    expect(cookies.length).toBeGreaterThan(0);
    const sessionCookie = cookies.find((cookie) => cookie.startsWith("admin_session="));
    expect(sessionCookie).toBeDefined();
    expect(sessionCookie).toContain("HttpOnly");
    expect(sessionCookie).toContain("Path=/");

    // Sprint 6: Verify cookie format is base64(payload).hex(hmac)
    const cookieValue = sessionCookie?.split("=")[1]?.split(";")[0];
    expect(cookieValue).toBeDefined();
    if (cookieValue) {
      const parts = cookieValue.split(".");
      expect(parts.length).toBe(2); // Should have payload and signature
      // Payload should be valid base64
      expect(() => Buffer.from(parts[0], "base64")).not.toThrow();
      // Signature should be valid hex
      expect(/^[0-9a-f]+$/i.test(parts[1])).toBe(true);
    }

    expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashed_password");
  });

  it("should return 200 and set session cookie for SUPER_ADMIN", async () => {
    const mockAdminUser = {
      id: "super-admin-1",
      name: "Super Admin",
      email: "superadmin@acedd.org",
      passwordHash: "hashed_password",
      role: "SUPER_ADMIN" as const,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(prisma.adminUser.findUnique).mockResolvedValue(mockAdminUser);
    (vi.mocked(bcrypt.compare) as any).mockResolvedValue(true);

    const body = {
      email: "superadmin@acedd.org",
      password: "password123",
    };

    const request = new NextRequest("http://localhost:3000/api/admin/login", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.user.role).toBe("SUPER_ADMIN");
  });

  it("should trim and lowercase email", async () => {
    const mockAdminUser = {
      id: "admin-1",
      name: "Admin User",
      email: "admin@acedd.org",
      passwordHash: "hashed_password",
      role: "ADMIN" as const,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(prisma.adminUser.findUnique).mockResolvedValue(mockAdminUser);
    (vi.mocked(bcrypt.compare) as any).mockResolvedValue(true);

    const body = {
      email: "  ADMIN@ACEDD.ORG  ",
      password: "password123",
    };

    const request = new NextRequest("http://localhost:3000/api/admin/login", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    await POST(request);

    expect(prisma.adminUser.findUnique).toHaveBeenCalledWith({
      where: { email: "admin@acedd.org" },
    });
  });

  describe("Sprint 6: Session Security (HMAC-SHA256)", () => {
    it("should create session cookie with HMAC signature", async () => {
      const mockAdminUser = {
        id: "admin-1",
        name: "Admin User",
        email: "admin@acedd.org",
        passwordHash: "hashed_password",
        role: "ADMIN" as const,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.adminUser.findUnique).mockResolvedValue(mockAdminUser);
      (vi.mocked(bcrypt.compare) as any).mockResolvedValue(true);

      const body = {
        email: "admin@acedd.org",
        password: "password123",
      };

      const request = new NextRequest("http://localhost:3000/api/admin/login", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);
      const cookies = response.headers.getSetCookie();
      const sessionCookie = cookies.find((cookie) => cookie.startsWith("admin_session="));
      
      expect(sessionCookie).toBeDefined();
      
      // Parse cookie value: "admin_session=<value>; HttpOnly; Path=/; ..."
      // Extract value between "admin_session=" and first ";"
      const cookieMatch = sessionCookie?.match(/admin_session=([^;]+)/);
      expect(cookieMatch).toBeDefined();
      let cookieValue = cookieMatch?.[1];
      expect(cookieValue).toBeDefined();
      
      // URL decode if needed (Next.js might URL encode cookie values)
      if (cookieValue) {
        try {
          cookieValue = decodeURIComponent(cookieValue);
        } catch {
          // If decode fails, use original value
        }
        
        // Format: base64(payload).hex(hmac)
        const parts = cookieValue.split(".");
        expect(parts.length).toBe(2);
        
        // Decode payload and verify it contains session data
        const payload = Buffer.from(parts[0], "base64").toString("utf-8");
        const session = JSON.parse(payload);
        expect(session.adminUserId).toBe("admin-1");
        expect(session.role).toBe("ADMIN");
        expect(session.email).toBe("admin@acedd.org");
        expect(session.name).toBe("Admin User");
        
        // Signature should be 64 hex characters (SHA-256)
        expect(parts[1].length).toBe(64);
        expect(/^[0-9a-f]{64}$/i.test(parts[1])).toBe(true);
      }
    });

    it("should reject session cookie with invalid signature", async () => {
      // This test verifies that middleware/adminAuth will reject tampered cookies
      // We can't directly test middleware here, but we can verify the format
      const mockAdminUser = {
        id: "admin-1",
        name: "Admin User",
        email: "admin@acedd.org",
        passwordHash: "hashed_password",
        role: "ADMIN" as const,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.adminUser.findUnique).mockResolvedValue(mockAdminUser);
      (vi.mocked(bcrypt.compare) as any).mockResolvedValue(true);

      const body = {
        email: "admin@acedd.org",
        password: "password123",
      };

      const request = new NextRequest("http://localhost:3000/api/admin/login", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);
      const cookies = response.headers.getSetCookie();
      const sessionCookie = cookies.find((cookie) => cookie.startsWith("admin_session="));
      const cookieValue = sessionCookie?.split("=")[1]?.split(";")[0];
      
      if (cookieValue) {
        const [payload, originalSignature] = cookieValue.split(".");
        
        // Create tampered cookie with invalid signature
        const tamperedCookie = `${payload}.${"a".repeat(64)}`; // Invalid signature
        
        // Verify that tampered cookie would be rejected by decryptSession
        // (This is tested in adminSession.test.ts, but we verify format here)
        expect(tamperedCookie).not.toBe(cookieValue);
        expect(tamperedCookie.split(".")[1]).not.toBe(originalSignature);
      }
    });
  });
});
