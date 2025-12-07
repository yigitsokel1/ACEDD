import { describe, it, expect, beforeEach, vi } from "vitest";
import { PUT } from "../[id]/route";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/adminAuth";
import { MemberGender, MemberAcademicLevel, MemberMaritalStatus, ApplicationStatus } from "@prisma/client";

// Mock Prisma
vi.mock("@/lib/db", () => ({
  prisma: {
    membershipApplication: {
      update: vi.fn(),
    },
  },
}));

// Mock adminAuth - requireRole for PUT requests
vi.mock("@/lib/auth/adminAuth", () => ({
  requireRole: vi.fn(),
  createAuthErrorResponse: vi.fn(),
}));

describe("PUT /api/membership-applications/[id] - Status Update", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock requireRole to return a valid SUPER_ADMIN session for all PUT tests
    const mockSession = {
      adminUserId: "super-admin-1",
      role: "SUPER_ADMIN" as const,
      email: "superadmin@acedd.org",
      name: "Super Admin",
    };
    vi.mocked(requireRole).mockReturnValue(mockSession);
  });

  it("should update application status to approved", async () => {
    const mockApplication = {
      id: "app-1",
      firstName: "John",
      lastName: "Doe",
      gender: "erkek" as MemberGender,
      email: "john@example.com",
      phone: "5551234567",
      birthDate: new Date("1990-01-01T00:00:00Z"),
      academicLevel: "lisans" as MemberAcademicLevel,
      maritalStatus: "bekar" as MemberMaritalStatus,
      hometown: "Istanbul",
      placeOfBirth: "Istanbul",
      nationality: "TR",
      currentAddress: "Istanbul",
      tcId: null,
      lastValidDate: null,
      status: "APPROVED" as ApplicationStatus,
      applicationDate: new Date("2024-01-01T00:00:00Z"),
      reviewedAt: new Date("2024-01-02T00:00:00Z"),
      reviewedBy: "admin-123",
      notes: "Approved by admin",
      department: null,
      reason: null,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-02T00:00:00Z"),
    };

    vi.mocked(prisma.membershipApplication.update).mockResolvedValue(mockApplication);

    const requestBody = {
      status: "approved",
      notes: "Approved by admin",
      reviewedBy: "admin-123",
    };

    const params = Promise.resolve({ id: "app-1" });
    const request = new NextRequest("http://localhost:3000/api/membership-applications/app-1", {
      method: "PUT",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      id: "app-1",
      status: "approved",
      notes: "Approved by admin",
      reviewedBy: "admin-123",
    });
    expect(prisma.membershipApplication.update).toHaveBeenCalledWith({
      where: { id: "app-1" },
      data: {
        status: "APPROVED" as ApplicationStatus,
        reviewedAt: expect.any(Date),
        notes: "Approved by admin",
        reviewedBy: "admin-123",
      },
    });
  });

  it("should update application status to rejected", async () => {
    const mockApplication = {
      id: "app-2",
      firstName: "Jane",
      lastName: "Smith",
      gender: "kadın" as MemberGender,
      email: "jane@example.com",
      phone: "5559876543",
      birthDate: new Date("1995-05-15T00:00:00Z"),
      academicLevel: "yukseklisans" as MemberAcademicLevel,
      maritalStatus: "evli" as MemberMaritalStatus,
      hometown: "Ankara",
      placeOfBirth: "Ankara",
      nationality: "TR",
      currentAddress: "Ankara",
      tcId: null,
      lastValidDate: null,
      status: "REJECTED" as const,
      applicationDate: new Date("2024-01-01T00:00:00Z"),
      reviewedAt: new Date("2024-01-02T00:00:00Z"),
      reviewedBy: "admin-123",
      notes: "Incomplete documentation",
      department: null,
      reason: null,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-02T00:00:00Z"),
    };

    vi.mocked(prisma.membershipApplication.update).mockResolvedValue(mockApplication);

    const requestBody = {
      status: "rejected",
      notes: "Incomplete documentation",
      reviewedBy: "admin-123",
    };

    const params = Promise.resolve({ id: "app-2" });
    const request = new NextRequest("http://localhost:3000/api/membership-applications/app-2", {
      method: "PUT",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      id: "app-2",
      status: "rejected",
      notes: "Incomplete documentation",
      reviewedBy: "admin-123",
    });
    expect(prisma.membershipApplication.update).toHaveBeenCalledWith({
      where: { id: "app-2" },
      data: {
        status: "REJECTED",
        reviewedAt: expect.any(Date),
        notes: "Incomplete documentation",
        reviewedBy: "admin-123",
      },
    });
  });

  it("should reject invalid status", async () => {
    const requestBody = {
      status: "invalid",
    };

    const params = Promise.resolve({ id: "app-1" });
    const request = new NextRequest("http://localhost:3000/api/membership-applications/app-1", {
      method: "PUT",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Validation error");
    expect(data.message).toContain("status");
    expect(prisma.membershipApplication.update).not.toHaveBeenCalled();
  });

  it("should reject pending status update", async () => {
    const requestBody = {
      status: "pending",
    };

    const params = Promise.resolve({ id: "app-1" });
    const request = new NextRequest("http://localhost:3000/api/membership-applications/app-1", {
      method: "PUT",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Validation error");
    expect(data.message).toContain("status");
    expect(prisma.membershipApplication.update).not.toHaveBeenCalled();
  });

  it("should handle application not found", async () => {
    vi.mocked(prisma.membershipApplication.update).mockRejectedValue({
      code: "P2025",
      message: "Record not found",
    });

    const requestBody = {
      status: "approved",
    };

    const params = Promise.resolve({ id: "non-existent" });
    const request = new NextRequest("http://localhost:3000/api/membership-applications/non-existent", {
      method: "PUT",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toHaveProperty("error", "Application not found");
  });

  it("should handle database errors gracefully", async () => {
    vi.mocked(prisma.membershipApplication.update).mockRejectedValue(new Error("Database error"));

    const requestBody = {
      status: "approved",
    };

    const params = Promise.resolve({ id: "app-1" });
    const request = new NextRequest("http://localhost:3000/api/membership-applications/app-1", {
      method: "PUT",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty("error", "Failed to update application");
    expect(data).toHaveProperty("message");
  });
});
