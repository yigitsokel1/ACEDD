import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET, POST } from "../route";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

// Mock Prisma
vi.mock("@/lib/db", () => ({
  prisma: {
    event: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

describe("GET /api/events", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return empty array when no events exist", async () => {
    vi.mocked(prisma.event.findMany).mockResolvedValue([]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
    expect(prisma.event.findMany).toHaveBeenCalledWith({
      orderBy: {
        createdAt: "desc",
      },
    });
  });

  it("should return events with correct format", async () => {
    const mockEvents = [
      {
        id: "event-1",
        title: "Test Event",
        description: "Test description",
        shortDescription: "Short description",
        date: new Date("2024-12-31T10:00:00Z"),
        location: "Test Location",
        images: JSON.stringify(["img1", "img2"]),
        featuredImage: "featured-img",
        isFeatured: true,
        requirements: JSON.stringify(["req1", "req2"]),
        benefits: JSON.stringify(["benefit1"]),
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
    ];

    vi.mocked(prisma.event.findMany).mockResolvedValue(mockEvents);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0]).toMatchObject({
      id: "event-1",
      title: "Test Event",
      description: "Test description",
      shortDescription: "Short description",
      location: "Test Location",
      isFeatured: true,
    });
    expect(data[0].date).toBe(mockEvents[0].date.toISOString());
    expect(data[0].images).toEqual(["img1", "img2"]);
    expect(data[0].featuredImage).toBe("featured-img");
    expect(data[0].requirements).toEqual(["req1", "req2"]);
    expect(data[0].benefits).toEqual(["benefit1"]);
    expect(data[0].createdAt).toBe(mockEvents[0].createdAt.toISOString());
    expect(data[0].updatedAt).toBe(mockEvents[0].updatedAt.toISOString());
  });

  it("should handle events with null optional fields", async () => {
    const mockEvents = [
      {
        id: "event-2",
        title: "Event Without Optional Fields",
        description: "Description",
        shortDescription: "Short",
        date: new Date("2024-12-31T10:00:00Z"),
        location: "Location",
        images: JSON.stringify([]),
        featuredImage: null,
        isFeatured: false,
        requirements: null,
        benefits: null,
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
    ];

    vi.mocked(prisma.event.findMany).mockResolvedValue(mockEvents);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data[0].featuredImage).toBeNull();
    expect(data[0].images).toEqual([]);
    expect(data[0].requirements).toBeNull();
    expect(data[0].benefits).toBeNull();
  });

  it("should handle database errors gracefully", async () => {
    vi.mocked(prisma.event.findMany).mockRejectedValue(new Error("Database error"));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty("error", "Failed to fetch events");
    expect(data).toHaveProperty("message");
  });
});

describe("POST /api/events", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create event with valid data", async () => {
    const mockEvent = {
      id: "event-new",
      title: "New Event",
      description: "Event description",
      shortDescription: "Short description",
      date: new Date("2024-12-31T10:00:00Z"),
      location: "Event Location",
      images: JSON.stringify(["img1"]),
      featuredImage: "featured-img",
      isFeatured: false,
      requirements: JSON.stringify(["req1"]),
      benefits: null,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    };

    vi.mocked(prisma.event.create).mockResolvedValue(mockEvent);

    const requestBody = {
      title: "New Event",
      description: "Event description",
      shortDescription: "Short description",
      date: "2024-12-31T10:00:00Z",
      location: "Event Location",
      images: ["img1"],
      featuredImage: "featured-img",
      isFeatured: false,
      requirements: ["req1"],
      benefits: null,
    };

    const request = new NextRequest("http://localhost:3000/api/events", {
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
      id: "event-new",
      title: "New Event",
      description: "Event description",
      shortDescription: "Short description",
      location: "Event Location",
      isFeatured: false,
    });
    expect(data.images).toEqual(["img1"]);
    expect(data.requirements).toEqual(["req1"]);
    expect(prisma.event.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          title: "New Event",
          description: "Event description",
          shortDescription: "Short description",
          location: "Event Location",
          images: JSON.stringify(["img1"]),
          featuredImage: "featured-img",
          isFeatured: false,
          requirements: JSON.stringify(["req1"]),
          benefits: null,
        }),
      })
    );
  });

  it("should reject event without title", async () => {
    const requestBody = {
      description: "Event description",
      shortDescription: "Short description",
      date: "2024-12-31T10:00:00Z",
      location: "Event Location",
    };

    const request = new NextRequest("http://localhost:3000/api/events", {
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
    expect(data.message).toContain("title");
    expect(prisma.event.create).not.toHaveBeenCalled();
  });

  it("should reject event with empty title", async () => {
    const requestBody = {
      title: "   ",
      description: "Event description",
      shortDescription: "Short description",
      date: "2024-12-31T10:00:00Z",
      location: "Event Location",
    };

    const request = new NextRequest("http://localhost:3000/api/events", {
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
    expect(data.message).toContain("title");
  });

  it("should reject event without description", async () => {
    const requestBody = {
      title: "Test Event",
      shortDescription: "Short description",
      date: "2024-12-31T10:00:00Z",
      location: "Event Location",
    };

    const request = new NextRequest("http://localhost:3000/api/events", {
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
    expect(data.message).toContain("description");
  });

  it("should reject event without shortDescription", async () => {
    const requestBody = {
      title: "Test Event",
      description: "Event description",
      date: "2024-12-31T10:00:00Z",
      location: "Event Location",
    };

    const request = new NextRequest("http://localhost:3000/api/events", {
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
    expect(data.message).toContain("shortDescription");
  });

  it("should reject event with invalid date", async () => {
    const requestBody = {
      title: "Test Event",
      description: "Event description",
      shortDescription: "Short description",
      date: "invalid-date",
      location: "Event Location",
    };

    const request = new NextRequest("http://localhost:3000/api/events", {
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
    expect(data.message).toContain("date");
  });

  it("should reject event without location", async () => {
    const requestBody = {
      title: "Test Event",
      description: "Event description",
      shortDescription: "Short description",
      date: "2024-12-31T10:00:00Z",
      location: "   ",
    };

    const request = new NextRequest("http://localhost:3000/api/events", {
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
    expect(data.message).toContain("location");
  });

  it("should handle empty images array", async () => {
    const mockEvent = {
      id: "event-empty-images",
      title: "Event",
      description: "Description",
      shortDescription: "Short",
      date: new Date("2024-12-31T10:00:00Z"),
      location: "Location",
      images: JSON.stringify([]),
      featuredImage: null,
      isFeatured: false,
      requirements: null,
      benefits: null,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    };

    vi.mocked(prisma.event.create).mockResolvedValue(mockEvent);

    const requestBody = {
      title: "Event",
      description: "Description",
      shortDescription: "Short",
      date: "2024-12-31T10:00:00Z",
      location: "Location",
      images: [],
    };

    const request = new NextRequest("http://localhost:3000/api/events", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.images).toEqual([]);
    expect(prisma.event.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          images: JSON.stringify([]),
        }),
      })
    );
  });

  it("should trim string fields", async () => {
    const mockEvent = {
      id: "event-trimmed",
      title: "Trimmed Title",
      description: "Trimmed Description",
      shortDescription: "Trimmed Short",
      date: new Date("2024-12-31T10:00:00Z"),
      location: "Trimmed Location",
      images: JSON.stringify([]),
      featuredImage: null,
      isFeatured: false,
      requirements: null,
      benefits: null,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    };

    vi.mocked(prisma.event.create).mockResolvedValue(mockEvent);

    const requestBody = {
      title: "  Trimmed Title  ",
      description: "  Trimmed Description  ",
      shortDescription: "  Trimmed Short  ",
      date: "2024-12-31T10:00:00Z",
      location: "  Trimmed Location  ",
      images: [],
    };

    const request = new NextRequest("http://localhost:3000/api/events", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    await POST(request);

    expect(prisma.event.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          title: "Trimmed Title",
          description: "Trimmed Description",
          shortDescription: "Trimmed Short",
          location: "Trimmed Location",
        }),
      })
    );
  });

  it("should handle database errors gracefully", async () => {
    vi.mocked(prisma.event.create).mockRejectedValue(new Error("Database error"));

    const requestBody = {
      title: "Test Event",
      description: "Event description",
      shortDescription: "Short description",
      date: "2024-12-31T10:00:00Z",
      location: "Event Location",
    };

    const request = new NextRequest("http://localhost:3000/api/events", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty("error", "Failed to create event");
    expect(data).toHaveProperty("message");
  });
});
