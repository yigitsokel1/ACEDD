/**
 * API Route: /api/scholarship-applications/[id]
 * 
 * GET /api/scholarship-applications/[id]
 * - Returns: ScholarshipApplication (single application by ID)
 * - Auth: Required (SUPER_ADMIN or ADMIN)
 * 
 * PUT /api/scholarship-applications/[id]
 * - Body: { status: 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW', reviewNotes?: string }
 * - Returns: ScholarshipApplication (updated application)
 * - Auth: Required (SUPER_ADMIN or ADMIN)
 * 
 * DELETE /api/scholarship-applications/[id]
 * - Returns: { message: string }
 * - Auth: Required (SUPER_ADMIN or ADMIN)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { ScholarshipApplication, ScholarshipRelative, ScholarshipEducationHistory, ScholarshipReference } from "@/lib/types/scholarship";
import { requireRole, createAuthErrorResponse, getAdminFromRequest } from "@/lib/auth/adminAuth";

/**
 * Helper function to format Prisma ScholarshipApplication to frontend ScholarshipApplication
 */
function formatApplication(prismaApplication: {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  alternativePhone: string | null;
  birthDate: Date;
  birthPlace: string;
  tcNumber: string;
  idIssuePlace: string;
  idIssueDate: Date;
  gender: string;
  maritalStatus: string;
  hometown: string;
  permanentAddress: string;
  currentAccommodation: string;
  bankAccount: string;
  ibanNumber: string;
  university: string;
  faculty: string;
  department: string | null;
  grade: string;
  turkeyRanking: number | null;
  physicalDisability: string;
  healthProblem: string;
  familyMonthlyIncome: number;
  familyMonthlyExpenses: number;
  scholarshipIncome: string;
  interests: string | null;
  selfIntroduction: string;
  relatives: any; // Json
  educationHistory: any; // Json
  references: any; // Json
  documents: any; // Json
  status: string;
  reviewedBy: string | null;
  reviewedAt: Date | null;
  reviewNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
}): ScholarshipApplication {
  // Parse JSON fields
  let relatives: ScholarshipRelative[] | undefined;
  let educationHistory: ScholarshipEducationHistory[] | undefined;
  let references: ScholarshipReference[] | undefined;
  let documents: string[] | undefined;

  try {
    if (prismaApplication.relatives) {
      relatives = typeof prismaApplication.relatives === "string" 
        ? JSON.parse(prismaApplication.relatives) 
        : prismaApplication.relatives;
    }
  } catch {
    relatives = undefined;
  }

  try {
    if (prismaApplication.educationHistory) {
      educationHistory = typeof prismaApplication.educationHistory === "string"
        ? JSON.parse(prismaApplication.educationHistory)
        : prismaApplication.educationHistory;
    }
  } catch {
    educationHistory = undefined;
  }

  try {
    if (prismaApplication.references) {
      references = typeof prismaApplication.references === "string"
        ? JSON.parse(prismaApplication.references)
        : prismaApplication.references;
    }
  } catch {
    references = undefined;
  }

  try {
    if (prismaApplication.documents) {
      documents = typeof prismaApplication.documents === "string"
        ? JSON.parse(prismaApplication.documents)
        : prismaApplication.documents;
    }
  } catch {
    documents = undefined;
  }

  // Map status to frontend format
  const statusMap: Record<string, "PENDING" | "APPROVED" | "REJECTED" | "UNDER_REVIEW"> = {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    UNDER_REVIEW: "UNDER_REVIEW",
  };

  return {
    id: prismaApplication.id,
    fullName: prismaApplication.fullName,
    email: prismaApplication.email,
    phone: prismaApplication.phone,
    alternativePhone: prismaApplication.alternativePhone || undefined,
    birthDate: prismaApplication.birthDate.toISOString(),
    birthPlace: prismaApplication.birthPlace,
    tcNumber: prismaApplication.tcNumber,
    idIssuePlace: prismaApplication.idIssuePlace,
    idIssueDate: prismaApplication.idIssueDate.toISOString(),
    gender: prismaApplication.gender,
    maritalStatus: prismaApplication.maritalStatus,
    hometown: prismaApplication.hometown,
    permanentAddress: prismaApplication.permanentAddress,
    currentAccommodation: prismaApplication.currentAccommodation,
    bankAccount: prismaApplication.bankAccount,
    ibanNumber: prismaApplication.ibanNumber,
    university: prismaApplication.university,
    faculty: prismaApplication.faculty,
    department: prismaApplication.department || undefined,
    grade: prismaApplication.grade,
    turkeyRanking: prismaApplication.turkeyRanking || undefined,
    physicalDisability: prismaApplication.physicalDisability,
    healthProblem: prismaApplication.healthProblem,
    familyMonthlyIncome: prismaApplication.familyMonthlyIncome,
    familyMonthlyExpenses: prismaApplication.familyMonthlyExpenses,
    scholarshipIncome: prismaApplication.scholarshipIncome,
    interests: prismaApplication.interests || undefined,
    selfIntroduction: prismaApplication.selfIntroduction,
    relatives,
    educationHistory,
    references,
    documents,
    status: statusMap[prismaApplication.status] || "PENDING",
    reviewedBy: prismaApplication.reviewedBy || undefined,
    reviewedAt: prismaApplication.reviewedAt?.toISOString() || undefined,
    reviewNotes: prismaApplication.reviewNotes || undefined,
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
    // Require admin role for viewing
    requireRole(request, ["SUPER_ADMIN", "ADMIN"]);

    const { id } = await params;

    const application = await prisma.scholarshipApplication.findUnique({
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
    console.error("[ERROR][API][SCHOLARSHIP][GET_BY_ID]", error);
    console.error("[ERROR][API][SCHOLARSHIP][GET_BY_ID] Details:", errorDetails);

    return NextResponse.json(
      {
        error: "Başvuru yüklenirken bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
      },
      { status: 500 }
    );
  }
}

// PUT - Başvuru durumunu güncelle (onay/red/inceleme)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin role for status updates
    requireRole(request, ["SUPER_ADMIN", "ADMIN"]);

    const { id } = await params;
    const body = await request.json();

    // Validation
    if (!body.status || !["APPROVED", "REJECTED", "UNDER_REVIEW"].includes(body.status)) {
      return NextResponse.json(
        { error: "Geçersiz durum değeri" },
        { status: 400 }
      );
    }

    // Get admin user for reviewedBy
    const admin = getAdminFromRequest(request);

    // Map frontend status to Prisma enum
    const statusMap: Record<string, string> = {
      APPROVED: "APPROVED",
      REJECTED: "REJECTED",
      UNDER_REVIEW: "UNDER_REVIEW",
    };
    const prismaStatus = statusMap[body.status];

    // Prepare update data
    const updateData: any = {
      status: prismaStatus,
      reviewedAt: new Date(),
      reviewedBy: admin?.adminUserId || null,
    };

    if (body.reviewNotes !== undefined) {
      updateData.reviewNotes = body.reviewNotes || null;
    }

    const updatedApplication = await prisma.scholarshipApplication.update({
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
    console.error("[ERROR][API][SCHOLARSHIP][UPDATE]", error);
    console.error("[ERROR][API][SCHOLARSHIP][UPDATE] Details:", errorDetails);

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
    // Require admin role for deletion
    requireRole(request, ["SUPER_ADMIN", "ADMIN"]);

    const { id } = await params;

    await prisma.scholarshipApplication.delete({
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
    console.error("[ERROR][API][SCHOLARSHIP][DELETE]", error);
    console.error("[ERROR][API][SCHOLARSHIP][DELETE] Details:", errorDetails);

    return NextResponse.json(
      {
        error: "Başvuru silinirken bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
      },
      { status: 500 }
    );
  }
}
