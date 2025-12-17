import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET, POST } from "../route";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole, createAuthErrorResponse } from "@/lib/auth/adminAuth";
import { NextResponse } from "next/server";

// Mock Prisma
vi.mock("@/lib/db", () => ({
  prisma: {
    contactMessage: {
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

describe("POST /api/contact-messages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create contact message with valid payload", async () => {
    const mockMessage = {
      id: "msg-1",
      fullName: "Ahmet Yılmaz",
      email: "ahmet@example.com",
      phone: "5551234567",
      subject: "Test Konu",
      message: "Bu bir test mesajıdır.",
      ipAddress: "127.0.0.1",
      userAgent: "Mozilla/5.0",
      status: "NEW" as const,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      readAt: null,
      archivedAt: null,
    };

    vi.mocked(prisma.contactMessage.create).mockResolvedValue(mockMessage);

    const requestBody = {
      name: "Ahmet Yılmaz",
      email: "ahmet@example.com",
      phone: "5551234567",
      subject: "Test Konu",
      message: "Bu bir test mesajıdır.",
    };

    const request = new NextRequest("http://localhost:3000/api/contact-messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "127.0.0.1",
        "user-agent": "Mozilla/5.0",
      },
      body: JSON.stringify(requestBody),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toMatchObject({
      id: "msg-1",
      fullName: "Ahmet Yılmaz",
      email: "ahmet@example.com",
      phone: "5551234567",
      subject: "Test Konu",
      message: "Bu bir test mesajıdır.",
      status: "NEW",
    });
    expect(prisma.contactMessage.create).toHaveBeenCalledWith({
      data: {
        fullName: "Ahmet Yılmaz",
        email: "ahmet@example.com",
        phone: "5551234567",
        subject: "Test Konu",
        message: "Bu bir test mesajıdır.",
        ipAddress: "127.0.0.1",
        userAgent: "Mozilla/5.0",
        status: "NEW",
      },
    });
  });

  it("should create contact message without phone", async () => {
    const mockMessage = {
      id: "msg-2",
      fullName: "Fatma Demir",
      email: "fatma@example.com",
      phone: null,
      subject: "Test Konu 2",
      message: "Bu bir test mesajıdır.",
      ipAddress: null,
      userAgent: null,
      status: "NEW" as const,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      readAt: null,
      archivedAt: null,
    };

    vi.mocked(prisma.contactMessage.create).mockResolvedValue(mockMessage);

    const requestBody = {
      name: "Fatma Demir",
      email: "fatma@example.com",
      subject: "Test Konu 2",
      message: "Bu bir test mesajıdır.",
    };

    const request = new NextRequest("http://localhost:3000/api/contact-messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toMatchObject({
      id: "msg-2",
      fullName: "Fatma Demir",
      email: "fatma@example.com",
      subject: "Test Konu 2",
      message: "Bu bir test mesajıdır.",
    });
    expect(prisma.contactMessage.create).toHaveBeenCalledWith({
      data: {
        fullName: "Fatma Demir",
        email: "fatma@example.com",
        phone: null,
        subject: "Test Konu 2",
        message: "Bu bir test mesajıdır.",
        ipAddress: null,
        userAgent: null,
        status: "NEW",
      },
    });
  });

  it("should return 400 when name is missing", async () => {
    const requestBody = {
      email: "ahmet@example.com",
      subject: "Test Konu",
      message: "Bu bir test mesajıdır.",
    };

    const request = new NextRequest("http://localhost:3000/api/contact-messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Ad Soyad alanı zorunludur");
    expect(prisma.contactMessage.create).not.toHaveBeenCalled();
  });

  it("should return 400 when email is missing", async () => {
    const requestBody = {
      name: "Ahmet Yılmaz",
      subject: "Test Konu",
      message: "Bu bir test mesajıdır.",
    };

    const request = new NextRequest("http://localhost:3000/api/contact-messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "E-posta adresi zorunludur");
    expect(prisma.contactMessage.create).not.toHaveBeenCalled();
  });

  it("should return 400 when subject is missing", async () => {
    const requestBody = {
      name: "Ahmet Yılmaz",
      email: "ahmet@example.com",
      message: "Bu bir test mesajıdır.",
    };

    const request = new NextRequest("http://localhost:3000/api/contact-messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Konu alanı zorunludur");
    expect(prisma.contactMessage.create).not.toHaveBeenCalled();
  });

  it("should return 400 when message is missing", async () => {
    const requestBody = {
      name: "Ahmet Yılmaz",
      email: "ahmet@example.com",
      subject: "Test Konu",
    };

    const request = new NextRequest("http://localhost:3000/api/contact-messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Mesaj alanı zorunludur");
    expect(prisma.contactMessage.create).not.toHaveBeenCalled();
  });

  it("should return 400 when name is empty string", async () => {
    const requestBody = {
      name: "",
      email: "ahmet@example.com",
      subject: "Test Konu",
      message: "Bu bir test mesajıdır.",
    };

    const request = new NextRequest("http://localhost:3000/api/contact-messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Ad Soyad alanı zorunludur");
  });
});

describe("GET /api/contact-messages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock requireRole to return a valid session for successful tests
    const mockSession = {
      adminUserId: "admin-1",
      role: "ADMIN" as const,
      email: "admin@acedd.org",
      name: "Admin User",
      issuedAt: Math.floor(Date.now() / 1000),
    };
    vi.mocked(requireRole).mockReturnValue(mockSession);
  });

  it("should return empty array when no messages exist", async () => {
    vi.mocked(prisma.contactMessage.findMany).mockResolvedValue([]);

    const request = new NextRequest("http://localhost:3000/api/contact-messages");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
    expect(prisma.contactMessage.findMany).toHaveBeenCalledWith({
      where: {},
      orderBy: {
        createdAt: "desc",
      },
    });
  });

  it("should return messages with correct format", async () => {
    const mockMessages = [
      {
        id: "msg-1",
        fullName: "Ahmet Yılmaz",
        email: "ahmet@example.com",
        phone: "5551234567",
        subject: "Test Konu",
        message: "Bu bir test mesajıdır.",
        ipAddress: "127.0.0.1",
        userAgent: "Mozilla/5.0",
        status: "NEW" as const,
        createdAt: new Date("2024-01-01T00:00:00Z"),
        readAt: null,
        archivedAt: null,
      },
    ] as any;

    vi.mocked(prisma.contactMessage.findMany).mockResolvedValue(mockMessages);

    const request = new NextRequest("http://localhost:3000/api/contact-messages");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0]).toMatchObject({
      id: "msg-1",
      fullName: "Ahmet Yılmaz",
      email: "ahmet@example.com",
      phone: "5551234567",
      subject: "Test Konu",
      message: "Bu bir test mesajıdır.",
      status: "NEW",
    });
  });

  it("should filter by status", async () => {
    vi.mocked(prisma.contactMessage.findMany).mockResolvedValue([]);

    const request = new NextRequest("http://localhost:3000/api/contact-messages?status=new");
    await GET(request);

    expect(prisma.contactMessage.findMany).toHaveBeenCalledWith({
      where: {
        status: "NEW" as const,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  });

  it("should search by name, email, or subject", async () => {
    vi.mocked(prisma.contactMessage.findMany).mockResolvedValue([]);

    const request = new NextRequest("http://localhost:3000/api/contact-messages?search=ahmet");
    await GET(request);

    expect(prisma.contactMessage.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { fullName: { contains: "ahmet" } },
          { email: { contains: "ahmet" } },
          { subject: { contains: "ahmet" } },
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

    const request = new NextRequest("http://localhost:3000/api/contact-messages");
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

    const request = new NextRequest("http://localhost:3000/api/contact-messages");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data).toHaveProperty("error");
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN", "ADMIN"]);
  });

  it("should return 200 when ADMIN role", async () => {
    const mockSession = {
      adminUserId: "admin-1",
      role: "ADMIN" as const,
      email: "admin@acedd.org",
      name: "Admin User",
      issuedAt: Math.floor(Date.now() / 1000),
    };
    vi.mocked(requireRole).mockReturnValue(mockSession);
    vi.mocked(prisma.contactMessage.findMany).mockResolvedValue([]);

    const request = new NextRequest("http://localhost:3000/api/contact-messages");
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN", "ADMIN"]);
  });
});
