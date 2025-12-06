import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET, POST } from "../route";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

// Mock Prisma
vi.mock("@/lib/db", () => ({
  prisma: {
    announcement: {
      findMany: vi.fn(),
      create: vi.fn(),
      count: vi.fn(),
    },
  },
}));

// Mock isAnnouncementActive
vi.mock("@/lib/utils/isAnnouncementActive", () => ({
  isAnnouncementActive: vi.fn((announcement) => {
    const now = new Date();
    const startsAt = announcement.startsAt ? new Date(announcement.startsAt) : null;
    const endsAt = announcement.endsAt ? new Date(announcement.endsAt) : null;
    if (startsAt && now < startsAt) return false;
    if (endsAt && now > endsAt) return false;
    return true;
  }),
}));

describe("GET /api/announcements", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return empty array when no announcements exist", async () => {
    vi.mocked(prisma.announcement.findMany).mockResolvedValue([]);

    const request = new NextRequest("http://localhost:3000/api/announcements");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
    expect(prisma.announcement.findMany).toHaveBeenCalled();
  });

  it("should return announcements with correct format", async () => {
    const mockAnnouncements = [
      {
        id: "1",
        title: "Test Announcement",
        summary: "Test summary",
        content: "Test content",
        category: "general",
        startsAt: new Date("2024-01-01"),
        endsAt: new Date("2024-12-31"),
        isPinned: false,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
    ];

    vi.mocked(prisma.announcement.findMany).mockResolvedValue(mockAnnouncements);

    const request = new NextRequest("http://localhost:3000/api/announcements");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0]).toMatchObject({
      id: "1",
      title: "Test Announcement",
      summary: "Test summary",
      content: "Test content",
      category: "general",
      isPinned: false,
    });
    expect(data[0].startsAt).toBe(mockAnnouncements[0].startsAt.toISOString());
    expect(data[0].endsAt).toBe(mockAnnouncements[0].endsAt.toISOString());
  });

  it("should filter by category when category query param is provided", async () => {
    vi.mocked(prisma.announcement.findMany).mockResolvedValue([]);

    const request = new NextRequest(
      "http://localhost:3000/api/announcements?category=general"
    );
    await GET(request);

    expect(prisma.announcement.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          category: "general",
        }),
      })
    );
  });

  it("should filter by pinned when pinned query param is provided", async () => {
    vi.mocked(prisma.announcement.findMany).mockResolvedValue([]);

    const request = new NextRequest(
      "http://localhost:3000/api/announcements?pinned=true"
    );
    await GET(request);

    expect(prisma.announcement.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          isPinned: true,
        }),
      })
    );
  });
});

describe("POST /api/announcements", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 400 when title is missing", async () => {
    const body = {
      content: "Test content",
      category: "general",
    };

    const request = new NextRequest("http://localhost:3000/api/announcements", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Validation error");
    expect(data.message).toContain("title");
    expect(prisma.announcement.create).not.toHaveBeenCalled();
  });

  it("should return 400 when content is missing", async () => {
    const body = {
      title: "Test Title",
      category: "general",
    };

    const request = new NextRequest("http://localhost:3000/api/announcements", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Validation error");
    expect(data.message).toContain("content");
  });

  it("should return 400 when category is missing", async () => {
    const body = {
      title: "Test Title",
      content: "Test content",
    };

    const request = new NextRequest("http://localhost:3000/api/announcements", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Validation error");
    expect(data.message).toContain("category");
  });

  it("should return 400 when startsAt is after endsAt", async () => {
    const body = {
      title: "Test Title",
      content: "Test content",
      category: "general",
      startsAt: "2024-12-31T00:00:00Z",
      endsAt: "2024-01-01T00:00:00Z",
    };

    const request = new NextRequest("http://localhost:3000/api/announcements", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Validation error");
    expect(data.message).toContain("startsAt must be before endsAt");
  });

  it("should create announcement with valid data", async () => {
    const body = {
      title: "Test Title",
      content: "Test content",
      category: "general",
      summary: "Test summary",
      isPinned: false,
    };

    const mockCreated = {
      id: "1",
      ...body,
      startsAt: null,
      endsAt: null,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    };

    vi.mocked(prisma.announcement.create).mockResolvedValue(mockCreated);

    const request = new NextRequest("http://localhost:3000/api/announcements", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toMatchObject({
      id: "1",
      title: "Test Title",
      content: "Test content",
      category: "general",
      summary: "Test summary",
      isPinned: false,
    });
    expect(prisma.announcement.create).toHaveBeenCalled();
  });

  it("should trim string fields", async () => {
    const body = {
      title: "  Test Title  ",
      content: "  Test content  ",
      category: "  general  ",
    };

    const mockCreated = {
      id: "1",
      title: "Test Title",
      content: "Test content",
      category: "general",
      summary: null,
      startsAt: null,
      endsAt: null,
      isPinned: false,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    };

    vi.mocked(prisma.announcement.create).mockResolvedValue(mockCreated);

    const request = new NextRequest("http://localhost:3000/api/announcements", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    await POST(request);

    expect(prisma.announcement.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          title: "Test Title",
          content: "Test content",
          category: "general",
        }),
      })
    );
  });
});
