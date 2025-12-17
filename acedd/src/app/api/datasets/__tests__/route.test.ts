import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET, POST } from "../route";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/adminAuth";

// Mock Prisma
vi.mock("@/lib/db", () => ({
  prisma: {
    dataset: {
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
      return new Response(JSON.stringify({ error: "Oturum bulunamadı. Lütfen giriş yapın." }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (error === "FORBIDDEN") {
      return new Response(JSON.stringify({ error: "Bu işlem için yetkiniz bulunmamaktadır." }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ error: "Yetkilendirme hatası" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }),
}));

describe("GET /api/datasets", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return empty array when no datasets exist", async () => {
    vi.mocked((prisma as any).dataset.findMany).mockResolvedValue([]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
    expect((prisma as any).dataset.findMany).toHaveBeenCalledWith({
      orderBy: {
        createdAt: "desc",
      },
    });
  });

  it("should return datasets with correct format", async () => {
    const mockDatasets = [
      {
        id: "dataset-1",
        name: "Test Dataset",
        description: "Test description",
        category: "Görsel",
        fileUrl: "data:image/png;base64,test123",
        fileName: "test.png",
        fileSize: 1024,
        fileType: "image/png",
        tags: JSON.stringify(["tag1", "tag2"]),
        isPublic: true,
        downloadCount: 0,
        uploadedBy: "Admin",
        source: "event-upload",
        eventId: null,
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
    ];

    vi.mocked((prisma as any).dataset.findMany).mockResolvedValue(mockDatasets);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0]).toMatchObject({
      id: "dataset-1",
      name: "Test Dataset",
      description: "Test description",
      category: "Görsel",
      fileName: "test.png",
      fileSize: 1024,
      fileType: "image/png",
      isPublic: true,
      downloadCount: 0,
      uploadedBy: "Admin",
      source: "event-upload",
      eventId: null,
    });
    expect(data[0].fileUrl).toBe("data:image/png;base64,test123");
    expect(data[0].tags).toEqual(["tag1", "tag2"]);
    expect(data[0].createdAt).toBe(mockDatasets[0].createdAt.toISOString());
    expect(data[0].updatedAt).toBe(mockDatasets[0].updatedAt.toISOString());
  });

  it("should handle datasets with null optional fields", async () => {
    const mockDatasets = [
      {
        id: "dataset-2",
        name: "Dataset Without Optional Fields",
        description: null,
        category: "Etkinlik",
        fileUrl: "data:image/jpeg;base64,test456",
        fileName: "test.jpg",
        fileSize: 2048,
        fileType: "image/jpeg",
        tags: null,
        isPublic: false,
        downloadCount: 5,
        uploadedBy: "User",
        source: "event-upload",
        eventId: "event-123",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
    ];

    vi.mocked((prisma as any).dataset.findMany).mockResolvedValue(mockDatasets);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data[0].description).toBeNull();
    expect(data[0].tags).toBeNull();
  });

  it("should handle database errors gracefully", async () => {
    vi.mocked((prisma as any).dataset.findMany).mockRejectedValue(
      new Error("Database error")
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty("error", "Veri setleri yüklenirken bir hata oluştu");
    expect(data).toHaveProperty("message", "Lütfen daha sonra tekrar deneyin");
  });
});

describe("POST /api/datasets", () => {
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

  it("should create dataset with valid data", async () => {
    const mockDataset = {
      id: "dataset-new",
      name: "New Dataset",
      description: "New description",
      category: "Görsel",
      fileUrl: "data:image/png;base64,new123",
      fileName: "new.png",
      fileSize: 1024,
      fileType: "image/png",
      tags: JSON.stringify(["tag1"]),
      isPublic: true,
      downloadCount: 0,
      uploadedBy: "Admin",
      source: "event-upload",
      eventId: null,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    };

    vi.mocked((prisma as any).dataset.create).mockResolvedValue(mockDataset);

    const requestBody = {
      name: "New Dataset",
      description: "New description",
      category: "Görsel",
      fileUrl: "data:image/png;base64,new123",
      fileName: "new.png",
      fileSize: 1024,
      fileType: "image/png",
      tags: ["tag1"],
      isPublic: true,
      uploadedBy: "Admin",
      source: "event-upload",
    };

    const request = new NextRequest("http://localhost:3000/api/datasets", {
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
      id: "dataset-new",
      name: "New Dataset",
      description: "New description",
      category: "Görsel",
      fileName: "new.png",
      fileSize: 1024,
      fileType: "image/png",
      isPublic: true,
      uploadedBy: "Admin",
      source: "event-upload",
    });
    expect(data.fileUrl).toBe("data:image/png;base64,new123");
    expect(data.tags).toEqual(["tag1"]);
    expect((prisma as any).dataset.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: "New Dataset",
          description: "New description",
          category: "Görsel",
          fileUrl: "data:image/png;base64,new123",
          fileName: "new.png",
          fileSize: 1024,
          fileType: "image/png",
          tags: JSON.stringify(["tag1"]),
          isPublic: true,
          uploadedBy: "Admin",
          source: "event-upload",
        }),
      })
    );
  });

  it("should reject dataset without required fields", async () => {
    const requestBody = {
      description: "Description only",
    };

    const request = new NextRequest("http://localhost:3000/api/datasets", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "İsim zorunludur");
    expect((prisma as any).dataset.create).not.toHaveBeenCalled();
  });

  it("should handle database errors gracefully", async () => {
    vi.mocked((prisma as any).dataset.create).mockRejectedValue(
      new Error("Database error")
    );

    const requestBody = {
      name: "Test Dataset",
      category: "Görsel",
      fileUrl: "data:image/png;base64,test",
      fileName: "test.png",
      fileSize: 1024,
      fileType: "image/png",
      uploadedBy: "Admin",
      source: "event-upload",
    };

    const request = new NextRequest("http://localhost:3000/api/datasets", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty("error", "Veri seti kaydedilirken bir hata oluştu");
    expect(data).toHaveProperty("message", "Lütfen bilgilerinizi kontrol edip tekrar deneyin");
  });

  // Sprint 6: Role-based access control tests
  it("should allow ADMIN role for dataset creation", async () => {
    const mockAdminSession = {
      adminUserId: "admin-1",
      role: "ADMIN" as const,
      email: "admin@acedd.org",
      name: "Admin User",
      issuedAt: Math.floor(Date.now() / 1000),
    };
    vi.mocked(requireRole).mockReturnValue(mockAdminSession);

    const mockDataset = {
      id: "dataset-new",
      name: "New Dataset",
      category: "Görsel",
      fileUrl: "data:image/png;base64,test",
      fileName: "test.png",
      fileSize: 1024,
      fileType: "image/png",
      tags: null,
      isPublic: true,
      downloadCount: 0,
      uploadedBy: "Admin",
      source: "event-upload",
      eventId: null,
      description: null,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    };

    vi.mocked((prisma as any).dataset.create).mockResolvedValue(mockDataset);

    const requestBody = {
      name: "New Dataset",
      category: "Görsel",
      fileUrl: "data:image/png;base64,test",
      fileName: "test.png",
      fileSize: 1024,
      fileType: "image/png",
      uploadedBy: "Admin",
      source: "event-upload",
    };

    const request = new NextRequest("http://localhost:3000/api/datasets", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(201);
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN", "ADMIN"]);
  });

  it("should reject UNAUTHORIZED requests (no session)", async () => {
    vi.mocked(requireRole).mockImplementation(() => {
      throw new Error("UNAUTHORIZED");
    });

    const requestBody = {
      name: "Test Dataset",
      category: "Görsel",
      fileUrl: "data:image/png;base64,test",
      fileName: "test.png",
      fileSize: 1024,
      fileType: "image/png",
      uploadedBy: "Admin",
      source: "event-upload",
    };

    const request = new NextRequest("http://localhost:3000/api/datasets", {
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
