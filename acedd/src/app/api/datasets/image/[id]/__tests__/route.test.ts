import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET } from "../route";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

// Mock Prisma
vi.mock("@/lib/db", () => ({
  prisma: {
    dataset: {
      findUnique: vi.fn(),
    },
  },
}));

describe("GET /api/datasets/image/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return dataset image data", async () => {
    const mockDataset = {
      id: "dataset-1",
      fileUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      fileName: "test.png",
      fileType: "image/png",
    };

    vi.mocked((prisma as any).dataset.findUnique).mockResolvedValue(mockDataset);

    const params = Promise.resolve({ id: "dataset-1" });
    const request = new NextRequest("http://localhost:3000/api/datasets/image/dataset-1");

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      id: "dataset-1",
      fileUrl: mockDataset.fileUrl,
      fileName: "test.png",
      fileType: "image/png",
    });
    expect((prisma as any).dataset.findUnique).toHaveBeenCalledWith({
      where: { id: "dataset-1" },
    });
  });

  it("should return 404 when dataset not found", async () => {
    vi.mocked((prisma as any).dataset.findUnique).mockResolvedValue(null);

    const params = Promise.resolve({ id: "non-existent" });
    const request = new NextRequest("http://localhost:3000/api/datasets/image/non-existent");

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toHaveProperty("error", "Dataset not found");
  });

  it("should return 500 when fileUrl is invalid", async () => {
    const mockDataset = {
      id: "dataset-1",
      fileUrl: null,
      fileName: "test.png",
      fileType: "image/png",
    };

    vi.mocked((prisma as any).dataset.findUnique).mockResolvedValue(mockDataset);

    const params = Promise.resolve({ id: "dataset-1" });
    const request = new NextRequest("http://localhost:3000/api/datasets/image/dataset-1");

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty("error", "Invalid file URL in dataset");
  });

  it("should return 500 when fileUrl is not a data URL", async () => {
    const mockDataset = {
      id: "dataset-1",
      fileUrl: "https://example.com/image.png",
      fileName: "test.png",
      fileType: "image/png",
    };

    vi.mocked((prisma as any).dataset.findUnique).mockResolvedValue(mockDataset);

    const params = Promise.resolve({ id: "dataset-1" });
    const request = new NextRequest("http://localhost:3000/api/datasets/image/dataset-1");

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty("error", "Invalid file URL format (not a data URL)");
  });

  it("should handle database errors gracefully", async () => {
    vi.mocked((prisma as any).dataset.findUnique).mockRejectedValue(
      new Error("Database error")
    );

    const params = Promise.resolve({ id: "dataset-1" });
    const request = new NextRequest("http://localhost:3000/api/datasets/image/dataset-1");

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty("error", "Failed to fetch dataset");
    expect(data).toHaveProperty("message");
  });
});
