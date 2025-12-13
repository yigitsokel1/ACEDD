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
import { logErrorSecurely } from "@/lib/utils/secureLogging";

/**
 * Helper function to format Prisma MembershipApplication to frontend MembershipApplication
 * Sprint 15.1: Yeni form şeması ile güncellendi
 */
function formatApplication(prismaApplication: {
  id: string;
  firstName: string;
  lastName: string;
  identityNumber: string;
  gender: string;
  bloodType: string | null;
  birthPlace: string;
  birthDate: Date;
  city: string;
  phone: string;
  email: string;
  address: string;
  conditionsAccepted: boolean;
  status: string;
  applicationDate: Date;
  reviewedAt: Date | null;
  reviewedBy: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: prismaApplication.id,
    firstName: prismaApplication.firstName,
    lastName: prismaApplication.lastName,
    identityNumber: prismaApplication.identityNumber,
    gender: prismaApplication.gender as "erkek" | "kadın",
    bloodType: prismaApplication.bloodType as MembershipApplication["bloodType"] || null,
    birthPlace: prismaApplication.birthPlace,
    birthDate: prismaApplication.birthDate.toISOString(),
    city: prismaApplication.city,
    phone: prismaApplication.phone,
    email: prismaApplication.email,
    address: prismaApplication.address,
    conditionsAccepted: prismaApplication.conditionsAccepted,
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

    logErrorSecurely("[ERROR][API][MEMBERSHIP][GET_BY_ID]", error);

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
    // Require SUPER_ADMIN role for status updates and get admin user info
    const adminUser = requireRole(request, ["SUPER_ADMIN"]);
    
    const { id } = await params;
    const body = await request.json();

    // Validation - status is optional (can just update notes)
    let prismaStatus: string | null = null;
    if (body.status) {
      if (!["approved", "rejected"].includes(body.status)) {
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
      prismaStatus = statusMap[body.status];
    }

    // Get the application first to check current status and get data
    const application = await prisma.membershipApplication.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Başvuru bulunamadı" },
        { status: 404 }
      );
    }
    
    // If approved, create a Member from the application FIRST (before updating application)
    // This ensures member creation happens before status update
    if (prismaStatus === "APPROVED") {
      try {
        // Check if member already exists (by email or identityNumber)
        // Use lowercase email for comparison to match the stored format
        const existingMember = await prisma.member.findFirst({
          where: {
            OR: [
              { email: application.email.trim().toLowerCase() },
              ...(application.identityNumber ? [{ tcId: application.identityNumber }] : []),
            ],
          },
        });

        if (!existingMember) {
          // Create member from application
          // Use current date (when approved) as membershipDate
          // This represents when the person officially became a member
          const newMember = await prisma.member.create({
            data: {
              firstName: application.firstName,
              lastName: application.lastName,
              gender: application.gender,
              email: application.email.trim().toLowerCase(), // Ensure lowercase email
              phone: application.phone || null,
              birthDate: application.birthDate, // Already a Date object from Prisma
              placeOfBirth: application.birthPlace,
              currentAddress: application.address,
              tcId: application.identityNumber || null,
              titles: JSON.stringify([]), // Empty titles array
              status: "ACTIVE", // Automatically active
              membershipDate: new Date(), // Use current date (approval date) as membership date
              membershipKind: "MEMBER", // Default to MEMBER
              bloodType: application.bloodType || null,
              city: application.city,
            },
          });
        } else {
        }
      } catch (memberError) {
        // Log member creation error and fail the request
        // Use secureLogging to sanitize sensitive data (email, identityNumber, etc.)
        logErrorSecurely("[ERROR][API][MEMBERSHIP][APPROVE] Failed to create member", memberError, {
          applicationId: application.id,
          email: application.email,
          identityNumber: application.identityNumber,
          firstName: application.firstName,
          lastName: application.lastName,
        });
        // Fail the request if member creation fails
        return NextResponse.json(
          {
            error: "Üye oluşturulurken hata oluştu",
            message: memberError instanceof Error ? memberError.message : String(memberError),
          },
          { status: 500 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {
      reviewedBy: adminUser.adminUserId || body.reviewedBy || null,
    };

    // Only update status if provided
    if (prismaStatus) {
      updateData.status = prismaStatus;
      updateData.reviewedAt = new Date(); // Only set reviewedAt when status changes
    }

    if (body.notes !== undefined) {
      updateData.notes = body.notes || null;
    }

    // Update application
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

    logErrorSecurely("[ERROR][API][MEMBERSHIP][UPDATE]", error);

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

    // Get application first
    const application = await prisma.membershipApplication.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Başvuru bulunamadı" },
        { status: 404 }
      );
    }

    // Note: We do NOT delete the member even if the application was approved
    // Once a member is created from an approved application, they remain a member
    // even if the application record is deleted. This is intentional to preserve
    // member data integrity.

    // Delete the application
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

    logErrorSecurely("[ERROR][API][MEMBERSHIP][DELETE]", error);

    return NextResponse.json(
      {
        error: "Başvuru silinirken bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
      },
      { status: 500 }
    );
  }
}
