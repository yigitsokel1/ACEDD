/**
 * Tests for File Lifecycle Service
 * 
 * Sprint 17 - Block E: Unit tests for file lifecycle management
 * 
 * Tests cover:
 * - linkFileToEntity()
 * - unlinkAndDeleteFilesForEntity()
 * - deleteEventFiles()
 * - replaceSingleFile()
 * - replaceMemberCV()
 * - replaceFaviconOrLogo()
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  linkFileToEntity,
  unlinkAndDeleteFilesForEntity,
  deleteEventFiles,
  replaceSingleFile,
  replaceMemberCV,
  replaceFaviconOrLogo,
} from "../fileService";
import { prisma } from "@/lib/db";

// Mock Prisma
vi.mock("@/lib/db", () => ({
  prisma: {
    dataset: {
      update: vi.fn(),
      findMany: vi.fn(),
      deleteMany: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe("linkFileToEntity", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should link EVENT entity correctly", async () => {
    const datasetId = "dataset-1";
    const eventId = "event-1";

    await linkFileToEntity(datasetId, {
      entityType: "EVENT",
      entityId: eventId,
    });

    expect(prisma.dataset.update).toHaveBeenCalledWith({
      where: { id: datasetId },
      data: {
        eventId: eventId,
        source: "event-upload",
      },
    });
  });

  it("should link MEMBER_CV entity correctly", async () => {
    const datasetId = "dataset-1";
    const memberId = "member-1";

    await linkFileToEntity(datasetId, {
      entityType: "MEMBER_CV",
      entityId: memberId,
    });

    expect(prisma.dataset.update).toHaveBeenCalledWith({
      where: { id: datasetId },
      data: {
        source: "member-cv",
      },
    });
  });

  it("should link FAVICON entity correctly", async () => {
    const datasetId = "dataset-1";

    await linkFileToEntity(datasetId, {
      entityType: "FAVICON",
      entityId: "site",
    });

    expect(prisma.dataset.update).toHaveBeenCalledWith({
      where: { id: datasetId },
      data: {
        source: "favicon",
      },
    });
  });

  it("should handle errors gracefully (non-critical)", async () => {
    const datasetId = "dataset-1";
    vi.mocked(prisma.dataset.update).mockRejectedValue(new Error("Database error"));

    // Should not throw
    await expect(
      linkFileToEntity(datasetId, {
        entityType: "EVENT",
        entityId: "event-1",
      })
    ).resolves.not.toThrow();
  });
});

describe("unlinkAndDeleteFilesForEntity", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should delete EVENT files correctly", async () => {
    const eventId = "event-1";
    const mockDatasets = [
      { id: "dataset-1" },
      { id: "dataset-2" },
    ];

    vi.mocked(prisma.dataset.findMany).mockResolvedValue(mockDatasets as any);
    vi.mocked(prisma.dataset.deleteMany).mockResolvedValue({ count: 2 } as any);

    const result = await unlinkAndDeleteFilesForEntity({
      entityType: "EVENT",
      entityId: eventId,
    });

    expect(prisma.dataset.findMany).toHaveBeenCalledWith({
      where: {
        eventId: eventId,
        source: "event-upload",
      },
      select: { id: true },
    });

    expect(prisma.dataset.deleteMany).toHaveBeenCalledWith({
      where: {
        eventId: eventId,
        source: "event-upload",
      },
    });

    expect(result).toBe(2);
  });

  it("should return 0 when no files found", async () => {
    const eventId = "event-1";

    vi.mocked(prisma.dataset.findMany).mockResolvedValue([]);

    const result = await unlinkAndDeleteFilesForEntity({
      entityType: "EVENT",
      entityId: eventId,
    });

    expect(result).toBe(0);
    expect(prisma.dataset.deleteMany).not.toHaveBeenCalled();
  });

  it("should handle errors gracefully and return 0", async () => {
    const eventId = "event-1";

    vi.mocked(prisma.dataset.findMany).mockRejectedValue(new Error("Database error"));

    const result = await unlinkAndDeleteFilesForEntity({
      entityType: "EVENT",
      entityId: eventId,
    });

    expect(result).toBe(0);
  });
});

describe("deleteEventFiles", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call unlinkAndDeleteFilesForEntity with EVENT type", async () => {
    const eventId = "event-1";

    vi.mocked(prisma.dataset.findMany).mockResolvedValue([]);

    const result = await deleteEventFiles(eventId);

    expect(prisma.dataset.findMany).toHaveBeenCalledWith({
      where: {
        eventId: eventId,
        source: "event-upload",
      },
      select: { id: true },
    });

    expect(result).toBe(0);
  });
});

describe("replaceSingleFile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should delete old file and link new file", async () => {
    const oldDatasetId = "dataset-1";
    const newDatasetId = "dataset-2";
    const eventId = "event-1";

    vi.mocked(prisma.dataset.delete).mockResolvedValue({} as any);
    vi.mocked(prisma.dataset.update).mockResolvedValue({} as any);

    await replaceSingleFile(oldDatasetId, newDatasetId, {
      entityType: "EVENT",
      entityId: eventId,
    });

    expect(prisma.dataset.delete).toHaveBeenCalledWith({
      where: { id: oldDatasetId },
    });

    expect(prisma.dataset.update).toHaveBeenCalledWith({
      where: { id: newDatasetId },
      data: {
        eventId: eventId,
        source: "event-upload",
      },
    });
  });

  it("should only link new file if oldDatasetId is null", async () => {
    const newDatasetId = "dataset-2";
    const eventId = "event-1";

    vi.mocked(prisma.dataset.update).mockResolvedValue({} as any);

    await replaceSingleFile(null, newDatasetId, {
      entityType: "EVENT",
      entityId: eventId,
    });

    expect(prisma.dataset.delete).not.toHaveBeenCalled();
    expect(prisma.dataset.update).toHaveBeenCalledWith({
      where: { id: newDatasetId },
      data: {
        eventId: eventId,
        source: "event-upload",
      },
    });
  });

  it("should handle delete errors gracefully", async () => {
    const oldDatasetId = "dataset-1";
    const newDatasetId = "dataset-2";

    vi.mocked(prisma.dataset.delete).mockRejectedValue(new Error("Not found"));
    vi.mocked(prisma.dataset.update).mockResolvedValue({} as any);

    // Should not throw
    await expect(
      replaceSingleFile(oldDatasetId, newDatasetId, {
        entityType: "EVENT",
        entityId: "event-1",
      })
    ).resolves.not.toThrow();

    // Should still link new file
    expect(prisma.dataset.update).toHaveBeenCalled();
  });
});

describe("replaceMemberCV", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should delete old CV and link new CV", async () => {
    const memberId = "member-1";
    const oldDatasetId = "dataset-1";
    const newDatasetId = "dataset-2";

    vi.mocked(prisma.dataset.delete).mockResolvedValue({} as any);
    vi.mocked(prisma.dataset.update).mockResolvedValue({} as any);

    await replaceMemberCV(memberId, oldDatasetId, newDatasetId);

    expect(prisma.dataset.delete).toHaveBeenCalledWith({
      where: { id: oldDatasetId },
    });

    expect(prisma.dataset.update).toHaveBeenCalledWith({
      where: { id: newDatasetId },
      data: {
        source: "member-cv",
      },
    });
  });

  it("should only link new CV if oldDatasetId is null", async () => {
    const memberId = "member-1";
    const newDatasetId = "dataset-2";

    vi.mocked(prisma.dataset.update).mockResolvedValue({} as any);

    await replaceMemberCV(memberId, null, newDatasetId);

    expect(prisma.dataset.delete).not.toHaveBeenCalled();
    expect(prisma.dataset.update).toHaveBeenCalled();
  });
});

describe("replaceFaviconOrLogo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should cleanup old favicon when new one is uploaded", async () => {
    const oldDataUrl = "data:image/png;base64,old";
    const newDataUrl = "data:image/png;base64,new";
    const oldDataset = [{ id: "dataset-1", updatedAt: new Date() }];

    vi.mocked(prisma.dataset.findMany).mockResolvedValue(oldDataset as any);
    vi.mocked(prisma.dataset.delete).mockResolvedValue({} as any);

    await replaceFaviconOrLogo("site.faviconUrl", oldDataUrl, newDataUrl);

    expect(prisma.dataset.findMany).toHaveBeenCalledWith({
      where: { source: "favicon" },
      orderBy: { updatedAt: "desc" },
      take: 1,
    });

    expect(prisma.dataset.delete).toHaveBeenCalledWith({
      where: { id: "dataset-1" },
    });
  });

  it("should not cleanup if data URLs are the same", async () => {
    const dataUrl = "data:image/png;base64,same";

    await replaceFaviconOrLogo("site.faviconUrl", dataUrl, dataUrl);

    expect(prisma.dataset.findMany).not.toHaveBeenCalled();
  });

  it("should handle cleanup errors gracefully", async () => {
    const oldDataUrl = "data:image/png;base64,old";
    const newDataUrl = "data:image/png;base64,new";

    vi.mocked(prisma.dataset.findMany).mockRejectedValue(new Error("Database error"));

    // Should not throw
    await expect(
      replaceFaviconOrLogo("site.faviconUrl", oldDataUrl, newDataUrl)
    ).resolves.not.toThrow();
  });
});

