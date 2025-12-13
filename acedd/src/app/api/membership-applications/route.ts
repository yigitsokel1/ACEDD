/**
 * API Route: /api/membership-applications
 * 
 * GET /api/membership-applications
 * - Query params: status (pending|approved|rejected)
 * - Returns: MembershipApplication[] (array of applications, sorted by createdAt desc)
 * 
 * POST /api/membership-applications
 * - Body: CreateApplicationRequest
 * - Returns: MembershipApplication (created application)
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import type { MembershipApplication } from "@/lib/types/member";
import { requireRole, createAuthErrorResponse } from "@/lib/auth/adminAuth";
import { checkRateLimit, getClientIp } from "@/lib/utils/rateLimit";
import { logErrorSecurely } from "@/lib/utils/secureLogging";
import { verifyRecaptchaToken } from "@/lib/utils/recaptcha";
import {
  MembershipApplicationSchema,
  type MembershipApplicationInput,
} from "@/modules/membership/schemas";

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

// GET - Tüm başvuruları getir
export async function GET(request: NextRequest) {
  try {
    // Sprint 14.7: Membership Applications GET requires ADMIN or SUPER_ADMIN (admin sayfasında kullanılıyor)
    requireRole(request, ["SUPER_ADMIN", "ADMIN"]);
    
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");

    // Build where clause
    const where: any = {};

    if (statusParam) {
      // Map frontend status to Prisma enum
      const statusMap: Record<string, string> = {
        pending: "PENDING",
        approved: "APPROVED",
        rejected: "REJECTED",
      };
      const prismaStatus = statusMap[statusParam.toLowerCase()];
      if (prismaStatus) {
        where.status = prismaStatus;
      }
    }

    const applications = await prisma.membershipApplication.findMany({
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

    // Sprint 15.2: Secure logging - don't log sensitive data
    logErrorSecurely("[ERROR][API][MEMBERSHIP][GET]", error);

    return NextResponse.json(
      {
        error: "Başvurular yüklenirken bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
      },
      { status: 500 }
    );
  }
}

// POST - Yeni başvuru oluştur
// Sprint 15.1: Yeni form şeması ile güncellendi - sıkı validation
// Rate limiting eklendi
export async function POST(request: NextRequest) {
  try {
    // Sprint 15.2: Rate limiting check
    const clientIp = getClientIp(request);
    const rateLimitResult = checkRateLimit(clientIp);

    if (!rateLimitResult.allowed) {
      const resetTime = rateLimitResult.resetAt
        ? new Date(rateLimitResult.resetAt).toLocaleTimeString("tr-TR")
        : "birkaç dakika";
      return NextResponse.json(
        {
          error: "Çok fazla istek gönderdiniz",
          message: `Lütfen ${resetTime} sonra tekrar deneyin.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimitResult.resetAt
              ? Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000).toString()
              : "60",
            "X-RateLimit-Limit": "3",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimitResult.resetAt?.toString() || "",
          },
        }
      );
    }

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

    // Validate with Zod schema (single source of truth)
    let validatedData: MembershipApplicationInput;
    try {
      validatedData = MembershipApplicationSchema.parse(body);
    } catch (zodError) {
      if (zodError instanceof z.ZodError) {
        // Format Zod errors for client
        const errors = zodError.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        }));

        // Get the first error message for the main error field
        const firstError = errors[0];

        // Log validation errors (without sensitive data)
        logErrorSecurely(
          "[API][MEMBERSHIP][CREATE][VALIDATION]",
          zodError,
          { ipAddress: clientIp, errorCount: errors.length }
        );

        return NextResponse.json(
          {
            error: firstError?.message || "Form validasyonu başarısız oldu",
            message: "Lütfen tüm alanları kontrol edin",
            errors,
          },
          { status: 400 }
        );
      }

      // Unknown validation error
      logErrorSecurely(
        "[API][MEMBERSHIP][CREATE][VALIDATION]",
        zodError,
        { ipAddress: clientIp }
      );

      return NextResponse.json(
        { error: "Form validasyonu başarısız oldu" },
        { status: 400 }
      );
    }


    // Check for duplicate applications (TC, email, phone)
    const trimmedIdentityNumber = validatedData.identityNumber.trim();
    const trimmedEmail = validatedData.email.trim().toLowerCase();
    const trimmedPhone = validatedData.phone.trim();

    // Check if TC kimlik already exists in applications
    const existingByTC = await prisma.membershipApplication.findFirst({
      where: {
        identityNumber: trimmedIdentityNumber,
      },
    });

    if (existingByTC) {
      return NextResponse.json(
        { error: "Bu TC Kimlik No ile daha önce başvuru yapılmış" },
        { status: 400 }
      );
    }

    // Check if email already exists in applications
    const existingByEmail = await prisma.membershipApplication.findFirst({
      where: {
        email: trimmedEmail,
      },
    });

    if (existingByEmail) {
      return NextResponse.json(
        { error: "Bu e-posta adresi ile daha önce başvuru yapılmış" },
        { status: 400 }
      );
    }

    // Check if phone already exists in applications
    const existingByPhone = await prisma.membershipApplication.findFirst({
      where: {
        phone: trimmedPhone,
      },
    });

    if (existingByPhone) {
      return NextResponse.json(
        { error: "Bu telefon numarası ile daha önce başvuru yapılmış" },
        { status: 400 }
      );
    }

    // Check if TC kimlik already exists in members
    const existingMemberByTC = await prisma.member.findFirst({
      where: {
        tcId: trimmedIdentityNumber,
      },
    });

    if (existingMemberByTC) {
      return NextResponse.json(
        { error: "Bu TC Kimlik No ile zaten bir üye kayıtlı" },
        { status: 400 }
      );
    }

    // Check if email already exists in members
    const existingMemberByEmail = await prisma.member.findFirst({
      where: {
        email: trimmedEmail,
      },
    });

    if (existingMemberByEmail) {
      return NextResponse.json(
        { error: "Bu e-posta adresi ile zaten bir üye kayıtlı" },
        { status: 400 }
      );
    }

    // Check if phone already exists in members
    const existingMemberByPhone = await prisma.member.findFirst({
      where: {
        phone: trimmedPhone,
      },
    });

    if (existingMemberByPhone) {
      return NextResponse.json(
        { error: "Bu telefon numarası ile zaten bir üye kayıtlı" },
        { status: 400 }
      );
    }

    // Create application
    // validatedData.birthDate is already a Date object (from z.coerce.date())
    const application = await prisma.membershipApplication.create({
      data: {
        firstName: validatedData.firstName.trim(),
        lastName: validatedData.lastName.trim(),
        identityNumber: trimmedIdentityNumber,
        gender: validatedData.gender,
        bloodType: validatedData.bloodType,
        birthPlace: validatedData.birthPlace.trim(),
        birthDate: validatedData.birthDate instanceof Date
          ? validatedData.birthDate
          : new Date(validatedData.birthDate),
        city: validatedData.city.trim(),
        phone: trimmedPhone,
        email: trimmedEmail,
        address: validatedData.address.trim(),
        conditionsAccepted: validatedData.conditionsAccepted,
        status: "PENDING", // Always start as pending
      },
    });

    const formattedApplication = formatApplication(application);

    return NextResponse.json(formattedApplication, {
      status: 201,
      headers: {
        "X-RateLimit-Limit": "3",
        "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
        "X-RateLimit-Reset": rateLimitResult.resetAt?.toString() || "",
      },
    });
  } catch (error) {
    // Sprint 15.2: Secure logging - don't log sensitive data
    logErrorSecurely("[ERROR][API][MEMBERSHIP][CREATE]", error);

    // Prisma unique constraint error (fallback - should not happen with manual checks above)
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return NextResponse.json(
        { error: "Bu bilgiler ile daha önce başvuru yapılmış" },
        { status: 400 }
      );
    }

    // Sprint 15.2: Generic error message (don't expose internal details)
    return NextResponse.json(
      {
        error: "Başvuru kaydedilirken bir hata oluştu",
        message: "Lütfen bilgilerinizi kontrol edip tekrar deneyin",
      },
      { status: 500 }
    );
  }
}
