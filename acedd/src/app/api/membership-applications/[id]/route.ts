/**
 * API Route: /api/membership-applications/[id]
 * 
 * GET /api/membership-applications/[id]
 * - Returns: MembershipApplication (single application by ID)
 * 
 * PUT /api/membership-applications/[id]
 * - Body: { status: 'approved' | 'rejected', notes?: string, reviewedBy?: string }
 * - Returns: MembershipApplication (updated application)
 * 
 * DELETE /api/membership-applications/[id]
 * - Returns: { message: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { MembershipApplication } from "@/lib/types/member";
import { requireRole, createAuthErrorResponse } from "@/lib/auth/adminAuth";

/**
 * Helper function to format Prisma MembershipApplication to frontend MembershipApplication
 */
function formatApplication(prismaApplication: {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
  birthDate: Date;
  academicLevel: string;
  maritalStatus: string;
  hometown: string;
  placeOfBirth: string;
  nationality: string;
  currentAddress: string;
  tcId: string | null;
  lastValidDate: Date | null;
  status: string;
  applicationDate: Date;
  reviewedAt: Date | null;
  reviewedBy: string | null;
  notes: string | null;
  department: string | null;
  reason: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: prismaApplication.id,
    firstName: prismaApplication.firstName,
    lastName: prismaApplication.lastName,
    gender: prismaApplication.gender as "erkek" | "kadın",
    email: prismaApplication.email,
    phone: prismaApplication.phone,
    birthDate: prismaApplication.birthDate.toISOString(),
    academicLevel: prismaApplication.academicLevel as MembershipApplication["academicLevel"],
    maritalStatus: prismaApplication.maritalStatus as MembershipApplication["maritalStatus"],
    hometown: prismaApplication.hometown,
    placeOfBirth: prismaApplication.placeOfBirth,
    nationality: prismaApplication.nationality,
    currentAddress: prismaApplication.currentAddress,
    tcId: prismaApplication.tcId || undefined,
    lastValidDate: prismaApplication.lastValidDate?.toISOString() || undefined,
    status: prismaApplication.status.toLowerCase() as "pending" | "approved" | "rejected",
    applicationDate: prismaApplication.applicationDate.toISOString(),
    reviewedAt: prismaApplication.reviewedAt?.toISOString() || undefined,
    reviewedBy: prismaApplication.reviewedBy || undefined,
    notes: prismaApplication.notes || undefined,
    createdAt: prismaApplication.createdAt.toISOString(),
    updatedAt: prismaApplication.updatedAt.toISOString(),
  };
}

// GET - Belirli bir başvuruyu getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Sprint 14.7: Membership Applications GET requires ADMIN or SUPER_ADMIN (admin sayfasında kullanılıyor)
    requireRole(request, ["SUPER_ADMIN", "ADMIN"]);
    
    const { id } = await params;

    const application = await prisma.membershipApplication.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Başvuru bulunamadı" },
        { status: 404 }
      );
    }

    const formattedApplication = formatApplication(application);
    return NextResponse.json(formattedApplication);
  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }

    const errorDetails = error instanceof Error ? error.stack : String(error);
    console.error("[ERROR][API][MEMBERSHIP][GET_BY_ID]", error);
    console.error("[ERROR][API][MEMBERSHIP][GET_BY_ID] Details:", errorDetails);

    return NextResponse.json(
      {
        error: "Başvuru yüklenirken bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
      },
      { status: 500 }
    );
  }
}

// PUT - Başvuru durumunu güncelle (onay/red)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require SUPER_ADMIN role for status updates
    requireRole(request, ["SUPER_ADMIN"]);
    
    const { id } = await params;
    const body = await request.json();

    // Validation
    if (!body.status || !["approved", "rejected"].includes(body.status)) {
      return NextResponse.json(
        { error: "Geçersiz durum değeri (approved veya rejected olmalı)" },
        { status: 400 }
      );
    }

    // Map frontend status to Prisma enum
    const statusMap: Record<string, string> = {
      approved: "APPROVED",
      rejected: "REJECTED",
    };
    const prismaStatus = statusMap[body.status];

    // Prepare update data
    const updateData: any = {
      status: prismaStatus,
      reviewedAt: new Date(),
    };

    if (body.notes !== undefined) {
      updateData.notes = body.notes || null;
    }

    if (body.reviewedBy !== undefined) {
      updateData.reviewedBy = body.reviewedBy || null;
    }

    const updatedApplication = await prisma.membershipApplication.update({
      where: { id },
      data: updateData,
    });

    const formattedApplication = formatApplication(updatedApplication);
    return NextResponse.json(formattedApplication);
  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }
    
    // Prisma error handling
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      // Record not found
      return NextResponse.json(
        { error: "Başvuru bulunamadı" },
        { status: 404 }
      );
    }

    const errorDetails = error instanceof Error ? error.stack : String(error);
    console.error("[ERROR][API][MEMBERSHIP][UPDATE]", error);
    console.error("[ERROR][API][MEMBERSHIP][UPDATE] Details:", errorDetails);

    return NextResponse.json(
      {
        error: "Başvuru güncellenirken bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
      },
      { status: 500 }
    );
  }
}

// DELETE - Başvuruyu sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require SUPER_ADMIN role for deletion
    requireRole(request, ["SUPER_ADMIN"]);
    
    const { id } = await params;

    await prisma.membershipApplication.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Başvuru başarıyla silindi" });
  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }
    
    // Prisma error handling
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      // Record not found
      return NextResponse.json(
        { error: "Başvuru bulunamadı" },
        { status: 404 }
      );
    }

    const errorDetails = error instanceof Error ? error.stack : String(error);
    console.error("[ERROR][API][MEMBERSHIP][DELETE]", error);
    console.error("[ERROR][API][MEMBERSHIP][DELETE] Details:", errorDetails);

    return NextResponse.json(
      {
        error: "Başvuru silinirken bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
      },
      { status: 500 }
    );
  }
}
