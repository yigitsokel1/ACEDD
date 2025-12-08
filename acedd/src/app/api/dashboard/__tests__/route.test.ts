import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET } from "../route";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole, createAuthErrorResponse } from "@/lib/auth/adminAuth";
import { NextResponse } from "next/server";

// Mock Prisma
vi.mock("@/lib/db", () => ({
  prisma: {
    membershipApplication: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    scholarshipApplication: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    member: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    contactMessage: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    event: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    announcement: {
      findMany: vi.fn(),
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

// Mock isAnnouncementActive helper
vi.mock("@/lib/utils/isAnnouncementActive", () => ({
  isAnnouncementActive: vi.fn((announcement: any, now: Date) => {
    const startsAt = announcement.startsAt ? new Date(announcement.startsAt) : null;
    const endsAt = announcement.endsAt ? new Date(announcement.endsAt) : null;
    if (startsAt && now < startsAt) return false;
    if (endsAt && now > endsAt) return false;
    return true;
  }),
}));

describe("GET /api/dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 403 when no role is provided", async () => {
    // Mock requireRole to throw FORBIDDEN error
    vi.mocked(requireRole).mockImplementation(() => {
      throw new Error("FORBIDDEN");
    });

    const request = new NextRequest("http://localhost:3000/api/dashboard");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe("Bu işlem için yetkiniz bulunmamaktadır.");
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN", "ADMIN"]);
  });

  it("should return 401 when unauthorized", async () => {
    // Mock requireRole to throw UNAUTHORIZED error
    vi.mocked(requireRole).mockImplementation(() => {
      throw new Error("UNAUTHORIZED");
    });

    const request = new NextRequest("http://localhost:3000/api/dashboard");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Oturum bulunamadı. Lütfen giriş yapın.");
  });

  it("should return 200 with correct dashboard stats for SUPER_ADMIN", async () => {
    // Mock requireRole to return valid session
    const mockSession = {
      adminUserId: "admin-1",
      role: "SUPER_ADMIN" as const,
      email: "admin@acedd.org",
      name: "Admin User",
    };
    vi.mocked(requireRole).mockReturnValue(mockSession);

    const now = new Date("2024-01-15T12:00:00Z");

    // Use fake timers to control Date in getDashboardStats
    vi.useFakeTimers();
    vi.setSystemTime(now);

    // Mock all Prisma calls
    // Membership Applications
    vi.mocked(prisma.membershipApplication.count)
      .mockResolvedValueOnce(10) // total
      .mockResolvedValueOnce(3); // pending
    vi.mocked(prisma.membershipApplication.findMany).mockResolvedValue([
      {
        id: "app-1",
        firstName: "Ahmet",
        lastName: "Yılmaz",
        email: "ahmet@example.com",
        createdAt: new Date("2024-01-14T10:00:00Z"),
      },
      {
        id: "app-2",
        firstName: "Ayşe",
        lastName: "Demir",
        email: "ayse@example.com",
        createdAt: new Date("2024-01-13T10:00:00Z"),
      },
    ] as any);

    // Scholarship Applications
    vi.mocked(prisma.scholarshipApplication.count)
      .mockResolvedValueOnce(8) // total
      .mockResolvedValueOnce(2); // pending
    vi.mocked(prisma.scholarshipApplication.findMany).mockResolvedValue([
      {
        id: "sch-1",
        fullName: "Mehmet Kaya",
        university: "ODTÜ",
        createdAt: new Date("2024-01-14T10:00:00Z"),
      },
    ] as any);

    // Members
    vi.mocked(prisma.member.count)
      .mockResolvedValueOnce(50) // total
      .mockResolvedValueOnce(45); // active
    vi.mocked(prisma.member.findMany).mockResolvedValue([
      {
        id: "member-1",
        firstName: "Ali",
        lastName: "Veli",
        email: "ali@example.com",
        createdAt: new Date("2024-01-14T10:00:00Z"),
      },
    ] as any);

    // Contact Messages
    vi.mocked(prisma.contactMessage.count).mockResolvedValue(5); // unread
    vi.mocked(prisma.contactMessage.findMany).mockResolvedValue([
      {
        id: "msg-1",
        fullName: "Zeynep Yıldız",
        email: "zeynep@example.com",
        subject: "Test Konu",
        status: "NEW" as const,
        createdAt: new Date("2024-01-14T10:00:00Z"),
      },
    ] as any);

    // Events
    vi.mocked(prisma.event.count).mockResolvedValue(3); // upcomingTotal
    vi.mocked(prisma.event.findMany).mockResolvedValue([
      {
        id: "event-1",
        title: "Yaklaşan Etkinlik",
        date: new Date("2024-01-20T14:00:00Z"),
        location: "Ankara",
      },
    ] as any);

    // Announcements
    vi.mocked(prisma.announcement.findMany)
      .mockResolvedValueOnce([
        // all announcements for counting active (select: id, title, startsAt, endsAt, isPinned, createdAt)
        {
          id: "ann-1",
          title: "Duyuru 1",
          startsAt: new Date("2024-01-10T00:00:00Z"),
          endsAt: new Date("2024-01-20T00:00:00Z"),
          isPinned: true,
          createdAt: new Date("2024-01-10T00:00:00Z"),
        },
        {
          id: "ann-2",
          title: "Duyuru 2",
          startsAt: null,
          endsAt: null,
          isPinned: false,
          createdAt: new Date("2024-01-12T00:00:00Z"),
        },
      ] as any)
      .mockResolvedValueOnce([
        // recent announcements (select: id, title, summary, category, startsAt, endsAt, isPinned, createdAt)
        {
          id: "ann-1",
          title: "Duyuru 1",
          summary: "Özet",
          category: "general",
          startsAt: new Date("2024-01-10T00:00:00Z"),
          endsAt: new Date("2024-01-20T00:00:00Z"),
          isPinned: true,
          createdAt: new Date("2024-01-10T00:00:00Z"),
          // TypeScript requires these fields even though select doesn't fetch them
          updatedAt: new Date("2024-01-10T00:00:00Z"),
          content: "",
        } as any,
      ]);

    const request = new NextRequest("http://localhost:3000/api/dashboard");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("membership");
    expect(data).toHaveProperty("scholarship");
    expect(data).toHaveProperty("members");
    expect(data).toHaveProperty("messages");
    expect(data).toHaveProperty("events");
    expect(data).toHaveProperty("announcements");

    // Verify membership stats
    expect(data.membership).toEqual({
      total: 10,
      pending: 3,
      recent: [
        {
          id: "app-1",
          fullName: "Ahmet Yılmaz",
          email: "ahmet@example.com",
          createdAt: "2024-01-14T10:00:00.000Z",
        },
        {
          id: "app-2",
          fullName: "Ayşe Demir",
          email: "ayse@example.com",
          createdAt: "2024-01-13T10:00:00.000Z",
        },
      ],
    });

    // Verify scholarship stats
    expect(data.scholarship).toEqual({
      total: 8,
      pending: 2,
      recent: [
        {
          id: "sch-1",
          fullName: "Mehmet Kaya",
          university: "ODTÜ",
          createdAt: "2024-01-14T10:00:00.000Z",
        },
      ],
    });

    // Verify members stats
    expect(data.members).toEqual({
      total: 50,
      active: 45,
      recent: [
        {
          id: "member-1",
          fullName: "Ali Veli",
          email: "ali@example.com",
          createdAt: "2024-01-14T10:00:00.000Z",
        },
      ],
    });

    // Verify messages stats
    expect(data.messages).toEqual({
      unread: 5,
      recent: [
        {
          id: "msg-1",
          fullName: "Zeynep Yıldız",
          email: "zeynep@example.com",
          subject: "Test Konu",
          status: "NEW",
          createdAt: "2024-01-14T10:00:00.000Z",
        },
      ],
    });

    // Verify events stats
    expect(data.events).toEqual({
      upcomingTotal: 3,
      upcoming: [
        {
          id: "event-1",
          title: "Yaklaşan Etkinlik",
          date: "2024-01-20T14:00:00.000Z",
          location: "Ankara",
        },
      ],
    });

    // Verify announcements stats
    expect(data.announcements).toHaveProperty("total", 2);
    expect(data.announcements).toHaveProperty("active");
    expect(data.announcements.recent).toHaveLength(1);
    expect(data.announcements.recent[0]).toMatchObject({
      id: "ann-1",
      title: "Duyuru 1",
      summary: "Özet",
      category: "general",
      isPinned: true,
      isActive: true, // Helper calculates this using isAnnouncementActive
      createdAt: "2024-01-10T00:00:00.000Z",
    });

    // Verify Prisma calls
    expect(prisma.membershipApplication.count).toHaveBeenCalledTimes(2);
    expect(prisma.membershipApplication.count).toHaveBeenCalledWith();
    expect(prisma.membershipApplication.count).toHaveBeenCalledWith({
      where: { status: "PENDING" },
    });
    expect(prisma.membershipApplication.findMany).toHaveBeenCalledWith({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
      },
    });

    expect(prisma.scholarshipApplication.count).toHaveBeenCalledTimes(2);
    expect(prisma.scholarshipApplication.count).toHaveBeenCalledWith();
    expect(prisma.scholarshipApplication.count).toHaveBeenCalledWith({
      where: { status: "PENDING" },
    });
    expect(prisma.scholarshipApplication.findMany).toHaveBeenCalledWith({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fullName: true,
        university: true,
        createdAt: true,
      },
    });

    expect(prisma.member.count).toHaveBeenCalledTimes(2);
    expect(prisma.member.count).toHaveBeenCalledWith();
    expect(prisma.member.count).toHaveBeenCalledWith({
      where: { status: "ACTIVE" },
    });
    expect(prisma.member.findMany).toHaveBeenCalledWith({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
      },
    });

    expect(prisma.contactMessage.count).toHaveBeenCalledWith({
      where: { status: "NEW" },
    });
    expect(prisma.contactMessage.findMany).toHaveBeenCalledWith({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fullName: true,
        email: true,
        subject: true,
        status: true,
        createdAt: true,
      },
    });

    expect(prisma.event.count).toHaveBeenCalledWith({
      where: {
        date: {
          gte: expect.any(Date),
        },
      },
    });
    expect(prisma.event.findMany).toHaveBeenCalledWith({
      take: 3,
      where: {
        date: {
          gte: expect.any(Date),
        },
      },
      orderBy: { date: "asc" },
      select: {
        id: true,
        title: true,
        date: true,
        location: true,
      },
    });

    expect(prisma.announcement.findMany).toHaveBeenCalledTimes(2);
    
    // Restore real timers
    vi.useRealTimers();
  });

  it("should return 200 with correct dashboard stats for ADMIN role", async () => {
    // Mock requireRole to return ADMIN session
    const mockSession = {
      adminUserId: "admin-2",
      role: "ADMIN" as const,
      email: "admin2@acedd.org",
      name: "Admin User 2",
    };
    vi.mocked(requireRole).mockReturnValue(mockSession);

    // Mock all Prisma calls with empty/minimal data
    vi.mocked(prisma.membershipApplication.count)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0);
    vi.mocked(prisma.membershipApplication.findMany).mockResolvedValue([]);

    vi.mocked(prisma.scholarshipApplication.count)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0);
    vi.mocked(prisma.scholarshipApplication.findMany).mockResolvedValue([]);

    vi.mocked(prisma.member.count)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0);
    vi.mocked(prisma.member.findMany).mockResolvedValue([]);

    vi.mocked(prisma.contactMessage.count).mockResolvedValue(0);
    vi.mocked(prisma.contactMessage.findMany).mockResolvedValue([]);

    vi.mocked(prisma.event.count).mockResolvedValue(0);
    vi.mocked(prisma.event.findMany).mockResolvedValue([]);

    vi.mocked(prisma.announcement.findMany)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);

    const request = new NextRequest("http://localhost:3000/api/dashboard");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.membership.total).toBe(0);
    expect(data.membership.pending).toBe(0);
    expect(data.membership.recent).toEqual([]);
    expect(data.scholarship.total).toBe(0);
    expect(data.members.total).toBe(0);
    expect(data.messages.unread).toBe(0);
    expect(data.events.upcomingTotal).toBe(0);
    expect(data.announcements.total).toBe(0);
  });

  it("should handle database errors gracefully", async () => {
    // Mock requireRole to return valid session
    const mockSession = {
      adminUserId: "admin-1",
      role: "SUPER_ADMIN" as const,
      email: "admin@acedd.org",
      name: "Admin User",
    };
    vi.mocked(requireRole).mockReturnValue(mockSession);

    // Mock Prisma to throw error
    vi.mocked(prisma.membershipApplication.count).mockRejectedValue(
      new Error("Database connection error")
    );

    const request = new NextRequest("http://localhost:3000/api/dashboard");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to fetch dashboard data");
    expect(data.message).toBe("Database connection error");
  });
});
