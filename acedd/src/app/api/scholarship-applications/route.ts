/**
 * API Route: /api/scholarship-applications
 * 
 * GET /api/scholarship-applications
 * - Query params: status (PENDING|APPROVED|REJECTED|UNDER_REVIEW), search (name/email)
 * - Returns: ScholarshipApplication[] (array of applications, sorted by createdAt desc)
 * - Auth: Required (SUPER_ADMIN or ADMIN)
 * 
 * POST /api/scholarship-applications
 * - Body: CreateScholarshipApplicationRequest
 * - Returns: ScholarshipApplication (created application)
 * - Auth: Not required (public form submission)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { ScholarshipApplication, ScholarshipRelative, ScholarshipEducationHistory, ScholarshipReference } from "@/lib/types/scholarship";
import { requireRole, createAuthErrorResponse } from "@/lib/auth/adminAuth";

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

// GET - Tüm başvuruları getir (Admin only)
export async function GET(request: NextRequest) {
  try {
    // Require admin role for listing
    requireRole(request, ["SUPER_ADMIN", "ADMIN"]);

    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");
    const searchParam = searchParams.get("search");

    // Build where clause
    const where: any = {};

    if (statusParam) {
      // Map frontend status to Prisma enum
      const statusMap: Record<string, string> = {
        pending: "PENDING",
        approved: "APPROVED",
        rejected: "REJECTED",
        "under_review": "UNDER_REVIEW",
        "under-review": "UNDER_REVIEW",
      };
      const prismaStatus = statusMap[statusParam.toLowerCase()];
      if (prismaStatus) {
        where.status = prismaStatus;
      }
    }

    if (searchParam) {
      const search = searchParam.trim();
      if (search.length > 0) {
        // MariaDB case-insensitive search (LIKE with LOWER)
        where.OR = [
          { fullName: { contains: search } },
          { email: { contains: search } },
        ];
      }
    }

    const applications = await prisma.scholarshipApplication.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedApplications = applications.map(formatApplication);

    return NextResponse.json(formattedApplications);
  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }

    console.error("Error fetching scholarship applications:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorDetails = error instanceof Error ? error.stack : String(error);

    console.error("Error details:", errorDetails);

    return NextResponse.json(
      {
        error: "Failed to fetch scholarship applications",
        message: errorMessage,
        ...(process.env.NODE_ENV === "development" && { details: errorDetails }),
      },
      { status: 500 }
    );
  }
}

// POST - Yeni başvuru oluştur (Public, no auth required)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation - Required fields
    if (!body.name || typeof body.name !== "string" || body.name.trim().length === 0) {
      return NextResponse.json(
        { error: "Validation error", message: "name is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (!body.surname || typeof body.surname !== "string" || body.surname.trim().length === 0) {
      return NextResponse.json(
        { error: "Validation error", message: "surname is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (!body.email || typeof body.email !== "string" || body.email.trim().length === 0) {
      return NextResponse.json(
        { error: "Validation error", message: "email is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (!body.phone || typeof body.phone !== "string" || body.phone.trim().length === 0) {
      return NextResponse.json(
        { error: "Validation error", message: "phone is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (!body.university || typeof body.university !== "string" || body.university.trim().length === 0) {
      return NextResponse.json(
        { error: "Validation error", message: "university is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (!body.faculty || typeof body.faculty !== "string" || body.faculty.trim().length === 0) {
      return NextResponse.json(
        { error: "Validation error", message: "faculty is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (!body.permanentAddress || typeof body.permanentAddress !== "string" || body.permanentAddress.trim().length === 0) {
      return NextResponse.json(
        { error: "Validation error", message: "permanentAddress is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (!body.birthDate) {
      return NextResponse.json(
        { error: "Validation error", message: "birthDate is required" },
        { status: 400 }
      );
    }

    if (!body.idIssueDate) {
      return NextResponse.json(
        { error: "Validation error", message: "idIssueDate is required" },
        { status: 400 }
      );
    }

    // Parse dates
    const birthDate = new Date(body.birthDate);
    if (isNaN(birthDate.getTime())) {
      return NextResponse.json(
        { error: "Validation error", message: "birthDate must be a valid date" },
        { status: 400 }
      );
    }

    const idIssueDate = new Date(body.idIssueDate);
    if (isNaN(idIssueDate.getTime())) {
      return NextResponse.json(
        { error: "Validation error", message: "idIssueDate must be a valid date" },
        { status: 400 }
      );
    }

    // Validate arrays
    if (!Array.isArray(body.relatives) || body.relatives.length === 0) {
      return NextResponse.json(
        { error: "Validation error", message: "relatives is required and must be a non-empty array" },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.educationHistory) || body.educationHistory.length === 0) {
      return NextResponse.json(
        { error: "Validation error", message: "educationHistory is required and must be a non-empty array" },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.references) || body.references.length === 0) {
      return NextResponse.json(
        { error: "Validation error", message: "references is required and must be a non-empty array" },
        { status: 400 }
      );
    }

    // Combine name and surname
    const fullName = `${body.name.trim()} ${body.surname.trim()}`;

    // Create application
    const application = await prisma.scholarshipApplication.create({
      data: {
        fullName,
        email: body.email.trim().toLowerCase(),
        phone: body.phone.trim(),
        alternativePhone: body.alternativePhone?.trim() || null,
        birthDate,
        birthPlace: body.birthPlace?.trim() || "",
        tcNumber: body.tcNumber?.trim() || "",
        idIssuePlace: body.idIssuePlace?.trim() || "",
        idIssueDate,
        gender: body.gender?.trim() || "",
        maritalStatus: body.maritalStatus?.trim() || "",
        hometown: body.hometown?.trim() || "",
        permanentAddress: body.permanentAddress.trim(),
        currentAccommodation: body.currentAccommodation?.trim() || "",
        bankAccount: body.bankAccount?.trim() || "",
        ibanNumber: body.ibanNumber?.trim() || "",
        university: body.university.trim(),
        faculty: body.faculty.trim(),
        department: body.department?.trim() || null,
        grade: body.grade?.trim() || "",
        turkeyRanking: body.turkeyRanking ? Number(body.turkeyRanking) : null,
        physicalDisability: body.physicalDisability?.trim() || "",
        healthProblem: body.healthProblem?.trim() || "",
        familyMonthlyIncome: body.familyMonthlyIncome ? Number(body.familyMonthlyIncome) : 0,
        familyMonthlyExpenses: body.familyMonthlyExpenses ? Number(body.familyMonthlyExpenses) : 0,
        scholarshipIncome: body.scholarshipIncome?.trim() || "",
        interests: body.interests?.trim() || null,
        selfIntroduction: body.selfIntroduction?.trim() || "",
        relatives: body.relatives ? JSON.stringify(body.relatives) : null,
        educationHistory: body.educationHistory ? JSON.stringify(body.educationHistory) : null,
        references: body.references ? JSON.stringify(body.references) : null,
        documents: body.documents ? JSON.stringify(body.documents) : null,
        status: "PENDING", // Always start as pending
      },
    });

    const formattedApplication = formatApplication(application);

    return NextResponse.json(formattedApplication, { status: 201 });
  } catch (error) {
    console.error("Error creating scholarship application:", error);

    // Prisma unique constraint error (duplicate email)
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return NextResponse.json(
        { error: "Validation error", message: "An application with this email already exists" },
        { status: 400 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorDetails = error instanceof Error ? error.stack : String(error);

    console.error("Error details:", errorDetails);

    return NextResponse.json(
      {
        error: "Failed to create scholarship application",
        message: errorMessage,
        ...(process.env.NODE_ENV === "development" && { details: errorDetails }),
      },
      { status: 500 }
    );
  }
}
