import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST } from "../route";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole, createAuthErrorResponse } from "@/lib/auth/adminAuth";

// Mock Prisma
vi.mock("@/lib/db", () => ({
  prisma: {
    dataset: {
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

// Mock File API
global.File = class File {
  name: string;
  size: number;
  type: string;
  constructor(public parts: any[], public filename: string, public options: any) {
    this.name = filename;
    this.size = 0;
    this.type = options?.type || "image/png";
  }
  
  async arrayBuffer(): Promise<ArrayBuffer> {
    // Return a minimal ArrayBuffer for testing
    return new ArrayBuffer(8);
  }
} as any;

// Mock FormData that works with NextRequest
global.FormData = class FormData {
  private data: Map<string, any[]> = new Map();
  
  append(key: string, value: any) {
    if (!this.data.has(key)) {
      this.data.set(key, []);
    }
    this.data.get(key)!.push(value);
  }
  
  getAll(key: string): any[] {
    return this.data.get(key) || [];
  }
  
  get(key: string): any | null {
    const values = this.data.get(key);
    return values && values.length > 0 ? values[0] : null;
  }
  
  has(key: string): boolean {
    return this.data.has(key) && (this.data.get(key)?.length || 0) > 0;
  }
} as any;

describe("POST /api/upload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock requireRole to return a valid session for all tests
    const mockSession = {
      adminUserId: "admin-1",
      role: "SUPER_ADMIN" as const,
      email: "admin@acedd.org",
      name: "Admin User",
    };
    vi.mocked(requireRole).mockReturnValue(mockSession);
  });

  it("should return 401 when no session is provided", async () => {
    vi.mocked(requireRole).mockImplementation(() => {
      throw new Error("UNAUTHORIZED");
    });

    const formData = new FormData();
    const mockFile = new File([], "test.png", { type: "image/png" });
    Object.defineProperty(mockFile, "size", { value: 1024, writable: false });
    formData.append("file", mockFile);

    const request = {
      formData: async () => formData,
    } as unknown as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toHaveProperty("error", "Oturum bulunamadı. Lütfen giriş yapın.");
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN", "ADMIN"]);
    expect((prisma as any).dataset.create).not.toHaveBeenCalled();
  });

  it("should allow ADMIN role to upload files", async () => {
    // Upload allows both ADMIN and SUPER_ADMIN
    vi.mocked(requireRole).mockReturnValue({
      adminUserId: "admin-1",
      role: "ADMIN" as const,
      email: "admin@acedd.org",
      name: "Admin User",
    });

    const mockDataset = {
      id: "dataset-1",
      name: "Etkinlik Görseli - test",
      description: "Etkinlik için yüklenen görsel dosyası: test.png",
      category: "Görsel",
      fileUrl: "data:image/png;base64,test123",
      fileName: "test.png",
      fileSize: 1024,
      fileType: "image/png",
      tags: JSON.stringify(["görsel", "etkinlik", "eğitim", "fotoğraf"]),
      isPublic: true,
      downloadCount: 0,
      uploadedBy: "Admin",
      source: "event-upload",
      eventId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked((prisma as any).dataset.create).mockResolvedValue(mockDataset);

    const formData = new FormData();
    const mockFile = new File([], "test.png", { type: "image/png" });
    Object.defineProperty(mockFile, "size", { value: 1024, writable: false });
    formData.append("file", mockFile);

    const request = {
      formData: async () => formData,
    } as unknown as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("success", true);
    expect(requireRole).toHaveBeenCalledWith(request, ["SUPER_ADMIN", "ADMIN"]);
  });

  it("should upload single file and return dataset ID", async () => {
    const mockDataset = {
      id: "dataset-1",
      name: "Etkinlik Görseli - test",
      description: "Etkinlik için yüklenen görsel dosyası: test.png",
      category: "Görsel",
      fileUrl: "data:image/png;base64,test123",
      fileName: "test.png",
      fileSize: 1024,
      fileType: "image/png",
      tags: JSON.stringify(["görsel", "etkinlik", "eğitim", "fotoğraf"]),
      isPublic: true,
      downloadCount: 0,
      uploadedBy: "Admin",
      source: "event-upload",
      eventId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked((prisma as any).dataset.create).mockResolvedValue(mockDataset);

    const formData = new FormData();
    const mockFile = new File([], "test.png", { type: "image/png" });
    Object.defineProperty(mockFile, "size", { value: 1024, writable: false });
    formData.append("file", mockFile);

    // Create a mock NextRequest with formData method
    const request = {
      formData: async () => formData,
    } as unknown as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("success", true);
    expect(data).toHaveProperty("datasetIds");
    expect(Array.isArray(data.datasetIds)).toBe(true);
    expect(data.datasetIds.length).toBe(1);
    expect((prisma as any).dataset.create).toHaveBeenCalled();
  });

  it("should upload multiple files and return all dataset IDs", async () => {
    const mockDatasets = [
      {
        id: "dataset-1",
        name: "Etkinlik Görseli - test1",
        category: "Görsel",
        fileUrl: "data:image/png;base64,test1",
        fileName: "test1.png",
        fileSize: 1024,
        fileType: "image/png",
        tags: JSON.stringify(["görsel", "etkinlik", "eğitim", "fotoğraf"]),
        isPublic: true,
        downloadCount: 0,
        uploadedBy: "Admin",
        source: "event-upload",
        eventId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "dataset-2",
        name: "Etkinlik Görseli - test2",
        category: "Görsel",
        fileUrl: "data:image/jpeg;base64,test2",
        fileName: "test2.jpg",
        fileSize: 2048,
        fileType: "image/jpeg",
        tags: JSON.stringify(["görsel", "etkinlik", "eğitim", "fotoğraf"]),
        isPublic: true,
        downloadCount: 0,
        uploadedBy: "Admin",
        source: "event-upload",
        eventId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Mock create to return different datasets for each call
    let callCount = 0;
    vi.mocked((prisma as any).dataset.create).mockImplementation(() => {
      return Promise.resolve(mockDatasets[callCount++]);
    });

    const formData = new FormData();
    const mockFile1 = new File([], "test1.png", { type: "image/png" });
    Object.defineProperty(mockFile1, "size", { value: 1024, writable: false });
    const mockFile2 = new File([], "test2.jpg", { type: "image/jpeg" });
    Object.defineProperty(mockFile2, "size", { value: 2048, writable: false });
    formData.append("file", mockFile1);
    formData.append("file", mockFile2);

    // Create a mock NextRequest with formData method
    const request = {
      formData: async () => formData,
    } as unknown as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("success", true);
    expect(data.datasetIds).toHaveLength(2);
    expect((prisma as any).dataset.create).toHaveBeenCalledTimes(2);
  });

  it("should reject request with no files", async () => {
    const formData = new FormData();

    // Create a mock NextRequest with formData method
    const request = {
      formData: async () => formData,
    } as unknown as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "No files uploaded");
    expect((prisma as any).dataset.create).not.toHaveBeenCalled();
  });

  it("should handle database errors gracefully", async () => {
    vi.mocked((prisma as any).dataset.create).mockRejectedValue(
      new Error("Database error")
    );

    const formData = new FormData();
    const mockFile = new File([], "test.png", { type: "image/png" });
    Object.defineProperty(mockFile, "size", { value: 1024, writable: false });
    formData.append("file", mockFile);

    // Create a mock NextRequest with formData method
    const request = {
      formData: async () => formData,
    } as unknown as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty("error", "Dosya kaydedilirken bir hata oluştu");
  });

  // Sprint 17: PDF upload tests
  it("should upload PDF file successfully", async () => {
    const mockDataset = {
      id: "dataset-pdf-1",
      name: "CV - test",
      description: "Belge için yüklenen dosya: test.pdf. Dosya boyutu: 0.00 MB",
      category: "Belge",
      fileUrl: "data:application/pdf;base64,test123",
      fileName: "test.pdf",
      fileSize: 1024,
      fileType: "application/pdf",
      tags: JSON.stringify(["pdf", "belge", "cv", "döküman"]),
      isPublic: true,
      downloadCount: 0,
      uploadedBy: "Admin",
      source: "member-cv",
      eventId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked((prisma as any).dataset.create).mockResolvedValue(mockDataset);

    const formData = new FormData();
    const mockPdfFile = new File([], "test.pdf", { type: "application/pdf" });
    Object.defineProperty(mockPdfFile, "size", { value: 1024, writable: false });
    formData.append("file", mockPdfFile);

    const request = {
      formData: async () => formData,
    } as unknown as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("success", true);
    expect(data.datasetIds).toHaveLength(1);
    expect((prisma as any).dataset.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        category: "Belge",
        fileType: "application/pdf",
        source: "member-cv",
        name: "CV - test",
      }),
    });
  });

  it("should reject PDF file larger than 10MB", async () => {
    const formData = new FormData();
    const mockPdfFile = new File([], "test.pdf", { type: "application/pdf" });
    Object.defineProperty(mockPdfFile, "size", { value: 11 * 1024 * 1024, writable: false }); // 11MB
    formData.append("file", mockPdfFile);

    const request = {
      formData: async () => formData,
    } as unknown as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Dosya boyutu 10MB'dan küçük olmalıdır");
    expect((prisma as any).dataset.create).not.toHaveBeenCalled();
  });

  it("should reject non-image and non-PDF files", async () => {
    const formData = new FormData();
    const mockFile = new File([], "test.txt", { type: "text/plain" });
    Object.defineProperty(mockFile, "size", { value: 1024, writable: false });
    formData.append("file", mockFile);

    const request = {
      formData: async () => formData,
    } as unknown as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Sadece görsel (image) veya PDF dosyaları yüklenebilir");
    expect((prisma as any).dataset.create).not.toHaveBeenCalled();
  });
});
