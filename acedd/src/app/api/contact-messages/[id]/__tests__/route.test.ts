import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET, PUT, DELETE } from "../route";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole, createAuthErrorResponse } from "@/lib/auth/adminAuth";
import { NextResponse } from "next/server";

// Mock Prisma
vi.mock("@/lib/db", () => ({
  prisma: {
    contactMessage: {
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
}));

describe("GET /api/contact-messages/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const mockSession = {
      adminUserId: "admin-1",
      role: "ADMIN" as const,
      email: "admin@acedd.org",
      name: "Admin User",
      issuedAt: Math.floor(Date.now() / 1000),
    };
    vi.mocked(requireRole).mockReturnValue(mockSession);
  });

  it("should return message by id", async () => {
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

    vi.mocked(prisma.contactMessage.findUnique).mockResolvedValue(mockMessage);

    const params = Promise.resolve({ id: "msg-1" });
    const request = new NextRequest("http://localhost:3000/api/contact-messages/msg-1");
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      id: "msg-1",
      fullName: "Ahmet Yılmaz",
      email: "ahmet@example.com",
      status: "NEW",
    });
    expect(prisma.contactMessage.findUnique).toHaveBeenCalledWith({
      where: { id: "msg-1" },
    });
  });

  it("should return 404 when message not found", async () => {
    vi.mocked(prisma.contactMessage.findUnique).mockResolvedValue(null);

    const params = Promise.resolve({ id: "non-existent" });
    const request = new NextRequest("http://localhost:3000/api/contact-messages/non-existent");
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toHaveProperty("error", "Message not found");
  });

  it("should return 401 when UNAUTHORIZED", async () => {
    vi.mocked(requireRole).mockImplementation(() => {
      throw new Error("UNAUTHORIZED");
    });

    const params = Promise.resolve({ id: "msg-1" });
    const request = new NextRequest("http://localhost:3000/api/contact-messages/msg-1");
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toHaveProperty("error");
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN", "ADMIN"]);
  });

  it("should return 403 when FORBIDDEN", async () => {
    vi.mocked(requireRole).mockImplementation(() => {
      throw new Error("FORBIDDEN");
    });

    const params = Promise.resolve({ id: "msg-1" });
    const request = new NextRequest("http://localhost:3000/api/contact-messages/msg-1");
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data).toHaveProperty("error");
  });
});

describe("PUT /api/contact-messages/[id] - Status Update", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const mockSession = {
      adminUserId: "admin-1",
      role: "ADMIN" as const,
      email: "admin@acedd.org",
      name: "Admin User",
      issuedAt: Math.floor(Date.now() / 1000),
    };
    vi.mocked(requireRole).mockReturnValue(mockSession);
  });

  it("should update status to READ", async () => {
    const mockUpdatedMessage = {
      id: "msg-1",
      fullName: "Ahmet Yılmaz",
      email: "ahmet@example.com",
      phone: "5551234567",
      subject: "Test Konu",
      message: "Bu bir test mesajıdır.",
      ipAddress: "127.0.0.1",
      userAgent: "Mozilla/5.0",
      status: "READ" as const,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      readAt: new Date("2024-01-02T00:00:00Z"),
      archivedAt: null,
    };

    vi.mocked(prisma.contactMessage.update).mockResolvedValue(mockUpdatedMessage);

    const params = Promise.resolve({ id: "msg-1" });
    const request = new NextRequest("http://localhost:3000/api/contact-messages/msg-1", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "READ" }),
    });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      id: "msg-1",
      status: "READ",
    });
    expect(data.readAt).toBeDefined();
    expect(prisma.contactMessage.update).toHaveBeenCalledWith({
      where: { id: "msg-1" },
      data: {
        status: "READ",
        readAt: expect.any(Date),
      },
    });
  });

  it("should update status to ARCHIVED", async () => {
    const mockUpdatedMessage = {
      id: "msg-1",
      fullName: "Ahmet Yılmaz",
      email: "ahmet@example.com",
      phone: "5551234567",
      subject: "Test Konu",
      message: "Bu bir test mesajıdır.",
      ipAddress: "127.0.0.1",
      userAgent: "Mozilla/5.0",
      status: "ARCHIVED" as const,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      readAt: null,
      archivedAt: new Date("2024-01-02T00:00:00Z"),
    };

    vi.mocked(prisma.contactMessage.update).mockResolvedValue(mockUpdatedMessage);

    const params = Promise.resolve({ id: "msg-1" });
    const request = new NextRequest("http://localhost:3000/api/contact-messages/msg-1", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "ARCHIVED" }),
    });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      id: "msg-1",
      status: "ARCHIVED",
    });
    expect(data.archivedAt).toBeDefined();
    expect(prisma.contactMessage.update).toHaveBeenCalledWith({
      where: { id: "msg-1" },
      data: {
        status: "ARCHIVED",
        archivedAt: expect.any(Date),
      },
    });
  });

  it("should return 400 when status is invalid", async () => {
    const params = Promise.resolve({ id: "msg-1" });
    const request = new NextRequest("http://localhost:3000/api/contact-messages/msg-1", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "INVALID_STATUS" }),
    });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Geçersiz durum değeri");
    expect(prisma.contactMessage.update).not.toHaveBeenCalled();
  });

  it("should return 400 when status is missing", async () => {
    const params = Promise.resolve({ id: "msg-1" });
    const request = new NextRequest("http://localhost:3000/api/contact-messages/msg-1", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Geçersiz durum değeri");
    expect(prisma.contactMessage.update).not.toHaveBeenCalled();
  });

  it("should return 404 when message not found", async () => {
    const prismaError = new Error("Record not found");
    (prismaError as any).code = "P2025";
    vi.mocked(prisma.contactMessage.update).mockRejectedValue(prismaError);

    const params = Promise.resolve({ id: "non-existent" });
    const request = new NextRequest("http://localhost:3000/api/contact-messages/non-existent", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "READ" }),
    });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toHaveProperty("error", "Mesaj bulunamadı");
  });

  it("should return 401 when UNAUTHORIZED", async () => {
    vi.mocked(requireRole).mockImplementation(() => {
      throw new Error("UNAUTHORIZED");
    });

    const params = Promise.resolve({ id: "msg-1" });
    const request = new NextRequest("http://localhost:3000/api/contact-messages/msg-1", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "READ" }),
    });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toHaveProperty("error");
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN", "ADMIN"]);
  });

  it("should return 403 when FORBIDDEN", async () => {
    vi.mocked(requireRole).mockImplementation(() => {
      throw new Error("FORBIDDEN");
    });

    const params = Promise.resolve({ id: "msg-1" });
    const request = new NextRequest("http://localhost:3000/api/contact-messages/msg-1", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "READ" }),
    });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data).toHaveProperty("error");
  });
});

describe("DELETE /api/contact-messages/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const mockSession = {
      adminUserId: "admin-1",
      role: "SUPER_ADMIN" as const,
      email: "admin@acedd.org",
      name: "Admin User",
      issuedAt: Math.floor(Date.now() / 1000),
    };
    vi.mocked(requireRole).mockReturnValue(mockSession);
  });

  it("should delete message successfully", async () => {
    vi.mocked(prisma.contactMessage.delete).mockResolvedValue({
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
    } as any);

    const params = Promise.resolve({ id: "msg-1" });
    const request = new NextRequest("http://localhost:3000/api/contact-messages/msg-1", {
      method: "DELETE",
    });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("message", "Mesaj başarıyla silindi");
    expect(prisma.contactMessage.delete).toHaveBeenCalledWith({
      where: { id: "msg-1" },
    });
  });

  it("should return 404 when message not found", async () => {
    const prismaError = new Error("Record not found");
    (prismaError as any).code = "P2025";
    vi.mocked(prisma.contactMessage.delete).mockRejectedValue(prismaError);

    const params = Promise.resolve({ id: "non-existent" });
    const request = new NextRequest("http://localhost:3000/api/contact-messages/non-existent", {
      method: "DELETE",
    });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toHaveProperty("error", "Mesaj bulunamadı");
  });

  it("should return 401 when UNAUTHORIZED", async () => {
    vi.mocked(requireRole).mockImplementation(() => {
      throw new Error("UNAUTHORIZED");
    });

    const params = Promise.resolve({ id: "msg-1" });
    const request = new NextRequest("http://localhost:3000/api/contact-messages/msg-1", {
      method: "DELETE",
    });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toHaveProperty("error");
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN"]);
  });

  it("should return 403 when FORBIDDEN (ADMIN trying to delete)", async () => {
    vi.mocked(requireRole).mockImplementation(() => {
      throw new Error("FORBIDDEN");
    });

    const params = Promise.resolve({ id: "msg-1" });
    const request = new NextRequest("http://localhost:3000/api/contact-messages/msg-1", {
      method: "DELETE",
    });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data).toHaveProperty("error");
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN"]);
  });
});
