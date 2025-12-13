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
import { Prisma } from "@prisma/client";
import type { ScholarshipApplication, ScholarshipRelative, ScholarshipEducationHistory, ScholarshipReference } from "@/lib/types/scholarship";
import { requireRole, createAuthErrorResponse } from "@/lib/auth/adminAuth";
import { ScholarshipApplicationSchema, ScholarshipApplicationInput } from "@/modules/scholarship/schemas";
import { verifyRecaptchaToken } from "@/lib/utils/recaptcha";
import { logErrorSecurely, sanitizeObjectForLogging } from "@/lib/utils/secureLogging";
import { z } from "zod";

/**
 * Helper function to format Prisma ScholarshipApplication to frontend ScholarshipApplication
 * Sprint 16 - Block A: Updated to handle new Prisma model (firstName/lastName instead of fullName)
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
    endDate: Date;
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
  const relatives: ScholarshipRelative[] | undefined = prismaApplication.relatives?.map((rel) => ({
    kinship: rel.degree,
    name: rel.firstName,
    surname: rel.lastName,
    birthDate: rel.birthDate.toISOString().split("T")[0],
    education: rel.educationStatus,
    occupation: rel.occupation || rel.workplace || "", // occupation now contains both occupation and job
    healthInsurance: rel.healthInsurance,
    healthDisability: rel.healthDisability,
    income: rel.income,
    phone: rel.phone,
    additionalNotes: rel.notes || "",
  }));

  const educationHistory: ScholarshipEducationHistory[] | undefined = prismaApplication.educationHistory?.map((edu) => ({
    schoolName: edu.schoolName,
    startDate: edu.startDate.toISOString().split("T")[0],
    endDate: edu.endDate ? edu.endDate.toISOString().split("T")[0] : undefined,
    graduation: edu.isGraduated ? "Evet" : "Hayır",
    department: edu.department,
    percentage: edu.gradePercent,
  }));

  const references: ScholarshipReference[] | undefined = prismaApplication.references?.map((ref) => ({
    relationship: ref.relationship,
    fullName: `${ref.firstName} ${ref.lastName}`,
    isAcddMember: ref.isAceddMember ? "Evet" : "Hayır",
    job: ref.job,
    address: ref.address,
    phone: ref.phone,
  }));

  // Parse documents (if JSON)
  let documents: string[] | undefined;
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
    fullName: `${prismaApplication.firstName} ${prismaApplication.lastName}`,
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

    logErrorSecurely("[ERROR][API][SCHOLARSHIP][GET]", error);

    return NextResponse.json(
      {
        error: "Başvurular yüklenirken bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
      },
      { status: 500 }
    );
  }
}

// POST - Yeni başvuru oluştur (Public, no auth required)
// Sprint 16 - Block E: API & Backend (Create Scholarship Application)
export async function POST(request: NextRequest) {
  // Extract IP address for logging (metadata only)
  const ipAddress = request.headers.get("x-forwarded-for") || 
                   request.headers.get("x-real-ip") || 
                   undefined;

  try {
    // Parse request body
    let body: unknown;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: "Geçersiz JSON formatı" },
        { status: 400 }
      );
    }

    // Extract reCAPTCHA token (if present)
    const recaptchaToken = typeof body === "object" && body !== null && "recaptchaToken" in body
      ? (body as { recaptchaToken?: string }).recaptchaToken
      : undefined;

    // Verify reCAPTCHA (if secret key is configured)
    const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (recaptchaSecretKey) {
      const isRecaptchaValid = await verifyRecaptchaToken(recaptchaToken, recaptchaSecretKey);
      if (!isRecaptchaValid) {
        return NextResponse.json(
          { error: "reCAPTCHA doğrulaması başarısız oldu. Lütfen tekrar deneyin." },
          { status: 403 }
        );
      }
    }

    // Validate with Zod schema (Block B)
    let validatedData: ScholarshipApplicationInput;
    try {
      validatedData = ScholarshipApplicationSchema.parse(body);
    } catch (zodError) {
      if (zodError instanceof z.ZodError) {
        // Format Zod errors for client
        const errors = zodError.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        }));

        // Log validation errors (without sensitive data)
        logErrorSecurely(
          "[API][SCHOLARSHIP][CREATE][VALIDATION]",
          zodError,
          { ipAddress, errorCount: errors.length }
        );

        return NextResponse.json(
          {
            error: "Form validasyonu başarısız oldu",
            message: "Lütfen tüm alanları kontrol edin",
            errors,
          },
          { status: 400 }
        );
      }

      // Unknown validation error
      logErrorSecurely(
        "[API][SCHOLARSHIP][CREATE][VALIDATION]",
        zodError,
        { ipAddress }
      );

      return NextResponse.json(
        { error: "Form validasyonu başarısız oldu" },
        { status: 400 }
      );
    }


    // Transform form data to Prisma format
    // Map form field names to Prisma field names
    const applicationData = {
      firstName: validatedData.name.trim(),
      lastName: validatedData.surname.trim(),
      phone: validatedData.phone.trim(),
      alternativePhone: validatedData.alternativePhone?.trim() || null,
      email: validatedData.email.trim().toLowerCase(),
      birthDate: validatedData.birthDate instanceof Date 
        ? validatedData.birthDate 
        : new Date(validatedData.birthDate),
      gender: validatedData.gender,
      birthPlace: validatedData.birthPlace.trim(),
      hometown: validatedData.hometown.trim(),
      nationalId: validatedData.tcNumber.trim(),
      idIssueDate: validatedData.idIssueDate instanceof Date
        ? validatedData.idIssueDate
        : new Date(validatedData.idIssueDate),
      idIssuePlace: validatedData.idIssuePlace.trim(),
      maritalStatus: validatedData.maritalStatus,
      bankName: validatedData.bankAccount.trim(),
      iban: validatedData.ibanNumber.trim(),
      university: validatedData.university.trim(),
      faculty: validatedData.faculty.trim(),
      department: validatedData.department.trim(),
      classYear: validatedData.grade.trim(),
      turkiyeRanking: validatedData.turkeyRanking || null,
      hasPhysicalDisability: validatedData.physicalDisability,
      hasHealthIssue: validatedData.healthProblem,
      familyMonthlyIncome: validatedData.familyMonthlyIncome,
      familyMonthlyMandatoryExpenses: validatedData.familyMonthlyExpenses,
      hasScholarshipOrLoan: validatedData.scholarshipIncome,
      permanentAddress: validatedData.permanentAddress.trim(),
      currentAccommodation: validatedData.currentAccommodation.trim(),
      aboutYourself: validatedData.selfIntroduction.trim(),
      interests: validatedData.interests?.trim() || null,
      status: "PENDING" as const,
    };

    // Transform relatives data
    const relativesData = validatedData.relatives.map((rel) => ({
      degree: rel.kinship.trim(),
      firstName: rel.name.trim(),
      lastName: rel.surname.trim(),
      birthDate: rel.birthDate instanceof Date 
        ? rel.birthDate 
        : new Date(rel.birthDate),
      educationStatus: rel.education.trim(),
      occupation: rel.occupation.trim(),
      workplace: rel.occupation.trim(), // occupation now contains both occupation and job info
      healthInsurance: rel.healthInsurance.trim(),
      healthDisability: rel.healthDisability,
      income: rel.income,
      phone: rel.phone.trim(),
      notes: rel.additionalNotes?.trim() || null,
    }));

    // Transform education history data
    const educationHistoryData = validatedData.educationHistory.map((edu) => ({
      schoolName: edu.schoolName.trim(),
      startDate: edu.startDate instanceof Date
        ? edu.startDate
        : new Date(edu.startDate),
      endDate: edu.endDate
        ? (edu.endDate instanceof Date ? edu.endDate : new Date(edu.endDate))
        : null,
      isGraduated: edu.graduation === "Evet",
      department: edu.department.trim(),
      gradePercent: edu.percentage,
    }));

    // Transform references data
    const referencesData = validatedData.references.map((ref) => {
      // Split fullName into firstName and lastName
      const nameParts = ref.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      return {
        relationship: ref.relationship.trim(),
        firstName,
        lastName,
        isAceddMember: ref.isAcddMember === "Evet",
        job: ref.job.trim(),
        address: ref.address.trim(),
        phone: ref.phone.trim(),
      };
    });

    // Create application with related records in a transaction
    // Set timeout to 10 seconds to handle multiple related record creations
    const result = await prisma.$transaction(
      async (tx) => {
      // 1. Create main application
      const application = await tx.scholarshipApplication.create({
        data: applicationData,
      });

      // 2. Create relatives
      if (relativesData.length > 0) {
        await tx.relative.createMany({
          data: relativesData.map((rel) => ({
            ...rel,
            applicationId: application.id,
          })),
        });
      }

      // 3. Create education history
      if (educationHistoryData.length > 0) {
        await tx.educationHistory.createMany({
          data: educationHistoryData.map((edu) => ({
            ...edu,
            applicationId: application.id,
          })),
        });
      }

      // 4. Create references
      if (referencesData.length > 0) {
        await tx.reference.createMany({
          data: referencesData.map((ref) => ({
            ...ref,
            applicationId: application.id,
          })),
        });
      }

      // Return application with relations
      return await tx.scholarshipApplication.findUnique({
        where: { id: application.id },
        include: {
          relatives: true,
          educationHistory: true,
          references: true,
        },
      });
      },
      {
        maxWait: 10000, // Maximum time to wait for a transaction slot (10 seconds)
        timeout: 10000, // Maximum time the transaction can run (10 seconds)
      }
    );

    if (!result) {
      throw new Error("Transaction completed but application not found");
    }


    // Return success response (minimal data)
    return NextResponse.json(
      {
        success: true,
        id: result.id,
        message: "Başvurunuz başarıyla kaydedildi",
      },
      { status: 201 }
    );
  } catch (error) {
    // Secure error logging (no sensitive data)
    logErrorSecurely(
      "[API][SCHOLARSHIP][CREATE]",
      error,
      { ipAddress }
    );

    // Prisma unique constraint error (duplicate email)
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return NextResponse.json(
        { error: "Bu e-posta adresi ile daha önce başvuru yapılmış" },
        { status: 400 }
      );
    }

    // Generic error response (don't expose internal details)
    return NextResponse.json(
      {
        error: "Başvuru kaydedilirken bir hata oluştu",
        message: "Lütfen bilgilerinizi kontrol edip tekrar deneyin",
      },
      { status: 500 }
    );
  }
}
