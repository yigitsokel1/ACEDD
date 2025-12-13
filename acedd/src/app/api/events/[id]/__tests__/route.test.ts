/**
 * Tests for Event DELETE endpoint
 * 
 * Sprint 17 - Block E: Integration test for event delete → dataset cleanup
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { DELETE } from "../route";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole, createAuthErrorResponse } from "@/lib/auth/adminAuth";
import { deleteEventFiles } from "@/modules/files/fileService";

// Mock Prisma
vi.mock("@/lib/db", () => ({
  prisma: {
    event: {
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

// Mock fileService
vi.mock("@/modules/files/fileService", () => ({
  deleteEventFiles: vi.fn(),
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

describe("DELETE /api/events/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const mockSession = {
      adminUserId: "admin-1",
      role: "SUPER_ADMIN" as const,
      email: "admin@acedd.org",
      name: "Admin User",
    };
    vi.mocked(requireRole).mockReturnValue(mockSession);
  });

  it("should delete event and cleanup associated files", async () => {
    const eventId = "event-1";
    const mockEvent = {
      id: eventId,
      title: "Test Event",
      description: "Test Description",
    };

    vi.mocked(prisma.event.findUnique).mockResolvedValue(mockEvent as any);
    vi.mocked(deleteEventFiles).mockResolvedValue(3); // 3 files deleted
    vi.mocked(prisma.event.delete).mockResolvedValue(mockEvent as any);

    const request = new NextRequest(`http://localhost/api/events/${eventId}`, {
      method: "DELETE",
    });

    const params = Promise.resolve({ id: eventId });
    const response = await DELETE(request, { params });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.message).toBe("Etkinlik başarıyla silindi");

    // Verify file cleanup was called
    expect(deleteEventFiles).toHaveBeenCalledWith(eventId);
    expect(deleteEventFiles).toHaveBeenCalledTimes(1);

    // Verify event was deleted
    expect(prisma.event.delete).toHaveBeenCalledWith({
      where: { id: eventId },
    });
  });

  it("should delete event even if file cleanup fails (non-critical)", async () => {
    const eventId = "event-1";
    const mockEvent = {
      id: eventId,
      title: "Test Event",
    };

    vi.mocked(prisma.event.findUnique).mockResolvedValue(mockEvent as any);
    vi.mocked(deleteEventFiles).mockRejectedValue(new Error("Cleanup failed"));
    vi.mocked(prisma.event.delete).mockResolvedValue(mockEvent as any);

    const request = new NextRequest(`http://localhost/api/events/${eventId}`, {
      method: "DELETE",
    });

    const params = Promise.resolve({ id: eventId });
    const response = await DELETE(request, { params });

    // Should still succeed even if cleanup fails
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.message).toBe("Etkinlik başarıyla silindi");

    // Event should still be deleted
    expect(prisma.event.delete).toHaveBeenCalled();
  });

  it("should return 404 if event not found", async () => {
    const eventId = "nonexistent-event";

    vi.mocked(prisma.event.findUnique).mockResolvedValue(null);

    const request = new NextRequest(`http://localhost/api/events/${eventId}`, {
      method: "DELETE",
    });

    const params = Promise.resolve({ id: eventId });
    const response = await DELETE(request, { params });

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Etkinlik bulunamadı");

    // Should not attempt cleanup or delete
    expect(deleteEventFiles).not.toHaveBeenCalled();
    expect(prisma.event.delete).not.toHaveBeenCalled();
  });

  it("should return 401 if unauthorized", async () => {
    const eventId = "event-1";

    vi.mocked(requireRole).mockImplementation(() => {
      throw new Error("UNAUTHORIZED");
    });

    const request = new NextRequest(`http://localhost/api/events/${eventId}`, {
      method: "DELETE",
    });

    const params = Promise.resolve({ id: eventId });
    const response = await DELETE(request, { params });

    expect(response.status).toBe(401);
  });

  it("should return 403 if forbidden", async () => {
    const eventId = "event-1";

    vi.mocked(requireRole).mockImplementation(() => {
      throw new Error("FORBIDDEN");
    });

    const request = new NextRequest(`http://localhost/api/events/${eventId}`, {
      method: "DELETE",
    });

    const params = Promise.resolve({ id: eventId });
    const response = await DELETE(request, { params });

    expect(response.status).toBe(403);
  });
});

