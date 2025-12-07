import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET, POST } from "../route";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole, createAuthErrorResponse } from "@/lib/auth/adminAuth";

// Mock Prisma
vi.mock("@/lib/db", () => ({
  prisma: {
    boardMember: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
    member: {
      findUnique: vi.fn(),
    },
  },
}));

// Mock adminAuth
vi.mock("@/lib/auth/adminAuth", () => ({
  requireRole: vi.fn(),
  createAuthErrorResponse: vi.fn(),
}));

describe("GET /api/board-members", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return empty array when no board members exist", async () => {
    vi.mocked(prisma.boardMember.findMany).mockResolvedValue([]);

    const request = new NextRequest("http://localhost:3000/api/board-members");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
    expect(prisma.boardMember.findMany).toHaveBeenCalledWith({
      where: {},
      include: {
        member: true,
      },
      orderBy: [
        { role: "asc" },
        { member: { firstName: "asc" } },
        { member: { lastName: "asc" } },
      ],
    });
  });

  it("should return board members with member info", async () => {
    const mockBoardMembers = [
      {
        id: "board-1",
        memberId: "member-1",
        member: {
          id: "member-1",
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phone: "5551234567",
          tags: JSON.stringify([]),
        },
        role: "PRESIDENT",
        termStart: null,
        termEnd: null,
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
    ];

    vi.mocked(prisma.boardMember.findMany).mockResolvedValue(mockBoardMembers);

    const request = new NextRequest("http://localhost:3000/api/board-members");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0]).toMatchObject({
      id: "board-1",
      memberId: "member-1",
      role: "PRESIDENT",
    });
    expect(data[0].member).toMatchObject({
      id: "member-1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
    });
  });

  it("should filter by role query param", async () => {
    vi.mocked(prisma.boardMember.findMany).mockResolvedValue([]);

    const request = new NextRequest("http://localhost:3000/api/board-members?role=PRESIDENT");
    await GET(request);

    expect(prisma.boardMember.findMany).toHaveBeenCalledWith({
      where: {
        role: "PRESIDENT",
      },
      include: {
        member: true,
      },
      orderBy: [
        { role: "asc" },
        { member: { firstName: "asc" } },
        { member: { lastName: "asc" } },
      ],
    });
  });
});

describe("POST /api/board-members", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock requireRole to return a valid session
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

  it("should create board member with valid data", async () => {
    const mockMember = {
      id: "member-1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
    };

    const mockBoardMember = {
      id: "board-new",
      memberId: "member-1",
      member: {
        id: "member-1",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "5551234567",
        tags: JSON.stringify([]),
      },
      role: "PRESIDENT",
      termStart: null,
      termEnd: null,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    };

    vi.mocked(prisma.member.findUnique).mockResolvedValue(mockMember as any);
    vi.mocked(prisma.boardMember.create).mockResolvedValue(mockBoardMember as any);

    const requestBody = {
      memberId: "member-1",
      role: "PRESIDENT",
    };

    const request = new NextRequest("http://localhost:3000/api/board-members", {
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
      id: "board-new",
      memberId: "member-1",
      role: "PRESIDENT",
    });
    expect(prisma.member.findUnique).toHaveBeenCalledWith({
      where: { id: "member-1" },
    });
    expect(prisma.boardMember.create).toHaveBeenCalled();
  });

  it("should reject board member without memberId", async () => {
    const requestBody = {
      role: "PRESIDENT",
    };

    const request = new NextRequest("http://localhost:3000/api/board-members", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Validation error");
    expect(data.message).toContain("memberId");
    expect(prisma.boardMember.create).not.toHaveBeenCalled();
  });

  it("should reject board member without role", async () => {
    const requestBody = {
      memberId: "member-1",
    };

    const request = new NextRequest("http://localhost:3000/api/board-members", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Validation error");
    expect(data.message).toContain("role");
    expect(prisma.boardMember.create).not.toHaveBeenCalled();
  });

  it("should reject board member with invalid memberId (member not found)", async () => {
    vi.mocked(prisma.member.findUnique).mockResolvedValue(null);

    const requestBody = {
      memberId: "non-existent-member",
      role: "PRESIDENT",
    };

    const request = new NextRequest("http://localhost:3000/api/board-members", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toHaveProperty("error", "Validation error");
    expect(data.message).toContain("Member not found");
    expect(prisma.boardMember.create).not.toHaveBeenCalled();
  });

  it("should create board member with termStart and termEnd", async () => {
    const mockMember = {
      id: "member-1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
    };

    const mockBoardMember = {
      id: "board-new",
      memberId: "member-1",
      member: {
        id: "member-1",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "5551234567",
        tags: JSON.stringify([]),
      },
      role: "PRESIDENT",
      termStart: new Date("2024-01-01T00:00:00Z"),
      termEnd: new Date("2025-01-01T00:00:00Z"),
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    };

    vi.mocked(prisma.member.findUnique).mockResolvedValue(mockMember as any);
    vi.mocked(prisma.boardMember.create).mockResolvedValue(mockBoardMember as any);

    const requestBody = {
      memberId: "member-1",
      role: "PRESIDENT",
      termStart: "2024-01-01T00:00:00Z",
      termEnd: "2025-01-01T00:00:00Z",
    };

    const request = new NextRequest("http://localhost:3000/api/board-members", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.termStart).toBe("2024-01-01T00:00:00.000Z");
    expect(data.termEnd).toBe("2025-01-01T00:00:00.000Z");
  });

  // Sprint 6: Role-based access control tests
  it("should reject ADMIN role for board member creation (requires SUPER_ADMIN)", async () => {
    vi.mocked(requireRole).mockImplementation(() => {
      throw new Error("FORBIDDEN");
    });

    const requestBody = {
      memberId: "member-1",
      role: "PRESIDENT",
    };

    const request = new NextRequest("http://localhost:3000/api/board-members", {
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
      memberId: "member-1",
      role: "PRESIDENT",
    };

    const request = new NextRequest("http://localhost:3000/api/board-members", {
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
});
