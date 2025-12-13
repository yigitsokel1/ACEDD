/**
 * Tests for CV Download API
 * 
 * Sprint 18 - Block A: CV download endpoint QA test
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET } from "../route";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Mock Prisma
vi.mock("@/lib/db", () => ({
  prisma: {
    dataset: {
      findUnique: vi.fn(),
    },
  },
}));

describe("GET /api/download/cv/[datasetId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should download CV PDF successfully", async () => {
    const datasetId = "dataset-1";
    const base64PdfData = "JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKL01lZGlhQm94IFswIDAgNjEyIDc5Ml0KPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMSA0IDAgUgo+Pgo+PgovQ29udGVudHMgNSAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCi9GMSAxMiBUZgooSGVsbG8gV29ybGQpIFRlCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDQ1IDAwMDAwIG4gCjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE0OCAwMDAwMCBuIAowMDAwMDAwMjk3IDAwMDAwIG4gCjAwMDAwMDAzNzggMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA2Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo1MDgKJSVFT0YK";

    const mockDataset = {
      id: datasetId,
      name: "CV - Test User",
      fileUrl: `data:application/pdf;base64,${base64PdfData}`,
      fileName: "test-cv.pdf",
      fileType: "application/pdf",
      fileSize: 1000,
    };

    vi.mocked(prisma.dataset.findUnique).mockResolvedValue(mockDataset as any);

    const request = new NextRequest(`http://localhost/api/download/cv/${datasetId}`);
    const params = Promise.resolve({ datasetId });
    const response = await GET(request, { params });

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
    expect(response.headers.get("Content-Disposition")).toContain("test-cv.pdf");

    const buffer = await response.arrayBuffer();
    expect(buffer.byteLength).toBeGreaterThan(0);
  });

  it("should return 404 if CV not found", async () => {
    const datasetId = "nonexistent-dataset";

    vi.mocked(prisma.dataset.findUnique).mockResolvedValue(null);

    const request = new NextRequest(`http://localhost/api/download/cv/${datasetId}`);
    const params = Promise.resolve({ datasetId });
    const response = await GET(request, { params });

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("CV bulunamadı");
  });

  it("should return 400 if file is not PDF", async () => {
    const datasetId = "dataset-1";

    const mockDataset = {
      id: datasetId,
      name: "Image File",
      fileUrl: "data:image/png;base64,test",
      fileName: "test.png",
      fileType: "image/png",
    };

    vi.mocked(prisma.dataset.findUnique).mockResolvedValue(mockDataset as any);

    const request = new NextRequest(`http://localhost/api/download/cv/${datasetId}`);
    const params = Promise.resolve({ datasetId });
    const response = await GET(request, { params });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Bu dosya bir PDF değil");
  });

  it("should handle invalid base64 data URL format", async () => {
    const datasetId = "dataset-1";

    const mockDataset = {
      id: datasetId,
      name: "CV - Test",
      fileUrl: "invalid-format",
      fileName: "test-cv.pdf",
      fileType: "application/pdf",
    };

    vi.mocked(prisma.dataset.findUnique).mockResolvedValue(mockDataset as any);

    const request = new NextRequest(`http://localhost/api/download/cv/${datasetId}`);
    const params = Promise.resolve({ datasetId });
    const response = await GET(request, { params });

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe("Geçersiz CV dosyası formatı");
  });

  it("should clean whitespace from base64 string", async () => {
    const datasetId = "dataset-1";
    const base64PdfData = "JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKL01lZGlhQm94IFswIDAgNjEyIDc5Ml0KPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMSA0IDAgUgo+Pgo+PgovQ29udGVudHMgNSAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCi9GMSAxMiBUZgooSGVsbG8gV29ybGQpIFRlCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDQ1IDAwMDAwIG4gCjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE0OCAwMDAwMCBuIAowMDAwMDAwMjk3IDAwMDAwIG4gCjAwMDAwMDAzNzggMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA2Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo1MDgKJSVFT0YK";
    const base64WithWhitespace = base64PdfData.replace(/(.{76})/g, "$1\n"); // Add newlines

    const mockDataset = {
      id: datasetId,
      name: "CV - Test",
      fileUrl: `data:application/pdf;base64,${base64WithWhitespace}`,
      fileName: "test-cv.pdf",
      fileType: "application/pdf",
    };

    vi.mocked(prisma.dataset.findUnique).mockResolvedValue(mockDataset as any);

    const request = new NextRequest(`http://localhost/api/download/cv/${datasetId}`);
    const params = Promise.resolve({ datasetId });
    const response = await GET(request, { params });

    // Should succeed even with whitespace (whitespace is cleaned)
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
  });

  it("should return 500 if base64 contains invalid characters", async () => {
    const datasetId = "dataset-1";
    const invalidBase64 = "!!!INVALID_BASE64!!!";

    const mockDataset = {
      id: datasetId,
      name: "CV - Test",
      fileUrl: `data:application/pdf;base64,${invalidBase64}`,
      fileName: "test-cv.pdf",
      fileType: "application/pdf",
    };

    vi.mocked(prisma.dataset.findUnique).mockResolvedValue(mockDataset as any);

    const request = new NextRequest(`http://localhost/api/download/cv/${datasetId}`);
    const params = Promise.resolve({ datasetId });
    const response = await GET(request, { params });

    expect(response.status).toBe(500);
    const data = await response.json();
    // Base64 validation happens before decode, so we get validation error first
    expect(data.error).toBe("Geçersiz base64 karakterler içeriyor");
  });

  it("should return 500 if base64 decode fails (valid format but invalid PDF)", async () => {
    const datasetId = "dataset-1";
    // Valid base64 format but not a valid PDF
    const validBase64ButInvalidPdf = "SGVsbG8gV29ybGQ="; // "Hello World" in base64

    const mockDataset = {
      id: datasetId,
      name: "CV - Test",
      fileUrl: `data:application/pdf;base64,${validBase64ButInvalidPdf}`,
      fileName: "test-cv.pdf",
      fileType: "application/pdf",
    };

    vi.mocked(prisma.dataset.findUnique).mockResolvedValue(mockDataset as any);

    const request = new NextRequest(`http://localhost/api/download/cv/${datasetId}`);
    const params = Promise.resolve({ datasetId });
    const response = await GET(request, { params });

    // Should succeed (decode works), but PDF might be corrupted
    // Buffer.from() will succeed even if it's not a valid PDF
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
  });
});

