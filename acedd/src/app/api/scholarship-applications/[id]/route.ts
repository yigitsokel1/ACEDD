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
import { logErrorSecurely } from "@/lib/utils/secureLogging";

/**
 * Helper function to format Prisma ScholarshipApplication to frontend ScholarshipApplication
 * Sprint 16 - Block F: Updated to handle relational data (relatives, educationHistory, references)
 */
function formatApplication(prismaApplication: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternativePhone: string | null;
  birthDate: Date;
  birthPlace: string;
  nationalId: string;
  idIssuePlace: string;
  idIssueDate: Date;
  gender: string;
  maritalStatus: string;
  hometown: string;
  permanentAddress: string;
  currentAccommodation: string;
  bankName: string;
  iban: string;
  university: string;
  faculty: string;
  department: string | null;
  classYear: string;
  turkiyeRanking: number | null;
  hasPhysicalDisability: string;
  hasHealthIssue: string;
  familyMonthlyIncome: number;
  familyMonthlyMandatoryExpenses: number;
  hasScholarshipOrLoan: string;
  interests: string | null;
  aboutYourself: string;
  documents: any; // Json
  status: string;
  reviewedBy: string | null;
  reviewedAt: Date | null;
  reviewNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
  relatives?: Array<{
    id: string;
    degree: string;
    firstName: string;
    lastName: string;
    birthDate: Date;
    educationStatus: string;
    occupation: string;
    workplace: string;
    healthInsurance: string;
    healthDisability: string;
    income: number;
    phone: string;
    notes: string | null;
  }>;
  educationHistory?: Array<{
    id: string;
    schoolName: string;
    startDate: Date;
    endDate: Date | null;
    isGraduated: boolean;
    department: string;
    gradePercent: number;
  }>;
  references?: Array<{
    id: string;
    relationship: string;
    firstName: string;
    lastName: string;
    isAceddMember: boolean;
    job: string;
    address: string;
    phone: string;
  }>;
}): ScholarshipApplication {
  // Transform relational data to frontend format
  let relatives: ScholarshipRelative[] | undefined;
  let educationHistory: ScholarshipEducationHistory[] | undefined;
  let references: ScholarshipReference[] | undefined;
  let documents: string[] | undefined;

  // Transform relatives from relational table
  if (prismaApplication.relatives && Array.isArray(prismaApplication.relatives)) {
    relatives = prismaApplication.relatives.map((rel) => ({
      kinship: rel.degree,
      name: rel.firstName,
      surname: rel.lastName,
      birthDate: rel.birthDate.toISOString(),
      education: rel.educationStatus,
      occupation: rel.occupation,
      job: rel.workplace || "", // workplace → job in frontend
      healthInsurance: rel.healthInsurance,
      healthDisability: rel.healthDisability,
      income: rel.income,
      phone: rel.phone,
      additionalNotes: rel.notes || undefined,
    }));
  }

  // Transform educationHistory from relational table
  if (prismaApplication.educationHistory && Array.isArray(prismaApplication.educationHistory)) {
    educationHistory = prismaApplication.educationHistory.map((edu) => ({
      schoolName: edu.schoolName,
      startDate: edu.startDate.toISOString(),
      endDate: edu.endDate ? edu.endDate.toISOString() : undefined,
      graduation: edu.isGraduated ? "Evet" : "Hayır",
      department: edu.department,
      percentage: edu.gradePercent,
    }));
  }

  // Transform references from relational table
  if (prismaApplication.references && Array.isArray(prismaApplication.references)) {
    references = prismaApplication.references.map((ref) => ({
      relationship: ref.relationship,
      fullName: `${ref.firstName} ${ref.lastName}`.trim(),
      isAcddMember: ref.isAceddMember ? "Evet" : "Hayır",
      job: ref.job,
      address: ref.address,
      phone: ref.phone,
    }));
  }

  // Parse documents JSON (if exists)
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

  // Combine firstName and lastName for fullName (frontend compatibility)
  const fullName = `${prismaApplication.firstName} ${prismaApplication.lastName}`.trim();

  return {
    id: prismaApplication.id,
    fullName,
    email: prismaApplication.email,
    phone: prismaApplication.phone,
    alternativePhone: prismaApplication.alternativePhone || undefined,
    birthDate: prismaApplication.birthDate.toISOString(),
    birthPlace: prismaApplication.birthPlace,
    tcNumber: prismaApplication.nationalId,
    idIssuePlace: prismaApplication.idIssuePlace,
    idIssueDate: prismaApplication.idIssueDate.toISOString(),
    gender: prismaApplication.gender,
    maritalStatus: prismaApplication.maritalStatus,
    hometown: prismaApplication.hometown,
    permanentAddress: prismaApplication.permanentAddress,
    currentAccommodation: prismaApplication.currentAccommodation,
    bankAccount: prismaApplication.bankName,
    ibanNumber: prismaApplication.iban,
    university: prismaApplication.university,
    faculty: prismaApplication.faculty,
    department: prismaApplication.department || undefined,
    grade: prismaApplication.classYear,
    turkeyRanking: prismaApplication.turkiyeRanking || undefined,
    physicalDisability: prismaApplication.hasPhysicalDisability,
    healthProblem: prismaApplication.hasHealthIssue,
    familyMonthlyIncome: prismaApplication.familyMonthlyIncome,
    familyMonthlyExpenses: prismaApplication.familyMonthlyMandatoryExpenses,
    scholarshipIncome: prismaApplication.hasScholarshipOrLoan,
    interests: prismaApplication.interests || undefined,
    selfIntroduction: prismaApplication.aboutYourself,
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

    // Sprint 16 - Block F: Include relational data (relatives, educationHistory, references)
    // Optimized: Only select necessary fields to improve performance
    const application = await prisma.scholarshipApplication.findUnique({
      where: { id },
      include: {
        relatives: {
          select: {
            id: true,
            degree: true,
            firstName: true,
            lastName: true,
            birthDate: true,
            educationStatus: true,
            occupation: true,
            workplace: true,
            healthInsurance: true,
            healthDisability: true,
            income: true,
            phone: true,
            notes: true,
          },
        },
        educationHistory: {
          select: {
            id: true,
            schoolName: true,
            startDate: true,
            endDate: true,
            isGraduated: true,
            department: true,
            gradePercent: true,
          },
        },
        references: {
          select: {
            id: true,
            relationship: true,
            firstName: true,
            lastName: true,
            isAceddMember: true,
            job: true,
            address: true,
            phone: true,
          },
        },
      },
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

    logErrorSecurely("[ERROR][API][SCHOLARSHIP][GET_BY_ID]", error);

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

    // Validation - Allow status update OR just reviewNotes update
    if (body.status && !["APPROVED", "REJECTED", "UNDER_REVIEW"].includes(body.status)) {
      return NextResponse.json(
        { error: "Geçersiz durum değeri" },
        { status: 400 }
      );
    }

    // If no status provided, only update reviewNotes (if provided)
    if (!body.status && body.reviewNotes === undefined) {
      return NextResponse.json(
        { error: "Durum veya inceleme notu gerekli" },
        { status: 400 }
      );
    }

    // Get admin user for reviewedBy
    const admin = getAdminFromRequest(request);

    // Prepare update data
    const updateData: any = {};

    // Only update status if provided
    if (body.status) {
      // Map frontend status to Prisma enum
      const statusMap: Record<string, string> = {
        APPROVED: "APPROVED",
        REJECTED: "REJECTED",
        UNDER_REVIEW: "UNDER_REVIEW",
      };
      const prismaStatus = statusMap[body.status];
      updateData.status = prismaStatus;
      updateData.reviewedAt = new Date();
      updateData.reviewedBy = admin?.adminUserId || null;
    }

    // Always update reviewNotes if provided (Sprint 18 B3: max length validation)
    if (body.reviewNotes !== undefined) {
      const reviewNotesValue = body.reviewNotes || null;
      if (reviewNotesValue && typeof reviewNotesValue === "string" && reviewNotesValue.length > 1000) {
        return NextResponse.json(
          { error: "Değerlendirme notları en fazla 1000 karakter olmalıdır" },
          { status: 400 }
        );
      }
      updateData.reviewNotes = reviewNotesValue;
    }

    // Sprint 16 - Block F: Include relational data when updating (with select for performance)
    const updatedApplication = await prisma.scholarshipApplication.update({
      where: { id },
      data: updateData,
      include: {
        relatives: {
          select: {
            id: true,
            degree: true,
            firstName: true,
            lastName: true,
            birthDate: true,
            educationStatus: true,
            occupation: true,
            workplace: true,
            healthInsurance: true,
            healthDisability: true,
            income: true,
            phone: true,
            notes: true,
          },
        },
        educationHistory: {
          select: {
            id: true,
            schoolName: true,
            startDate: true,
            endDate: true,
            isGraduated: true,
            department: true,
            gradePercent: true,
          },
        },
        references: {
          select: {
            id: true,
            relationship: true,
            firstName: true,
            lastName: true,
            isAceddMember: true,
            job: true,
            address: true,
            phone: true,
          },
        },
      },
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

    logErrorSecurely("[API][SCHOLARSHIP][UPDATE]", error);

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

    logErrorSecurely("[API][SCHOLARSHIP][DELETE]", error);

    return NextResponse.json(
      {
        error: "Başvuru silinirken bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
      },
      { status: 500 }
    );
  }
}
