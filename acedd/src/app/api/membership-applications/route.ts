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
import { prisma } from "@/lib/db";
import type { MembershipApplication } from "@/lib/types/member";
import { requireRole, createAuthErrorResponse } from "@/lib/auth/adminAuth";
import { validateTCNumber, validatePhoneNumber, validateEmail } from "@/lib/utils/validationHelpers";
import { checkRateLimit, getClientIp } from "@/lib/utils/rateLimit";
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

    const body = await request.json();

    // Sprint 15.1: Yeni form alanları validation
    // First Name
    if (!body.firstName || typeof body.firstName !== "string" || body.firstName.trim().length === 0) {
      return NextResponse.json(
        { error: "Ad alanı zorunludur" },
        { status: 400 }
      );
    }
    if (body.firstName.trim().length < 2) {
      return NextResponse.json(
        { error: "Ad en az 2 karakter olmalıdır" },
        { status: 400 }
      );
    }

    // Last Name
    if (!body.lastName || typeof body.lastName !== "string" || body.lastName.trim().length === 0) {
      return NextResponse.json(
        { error: "Soyad alanı zorunludur" },
        { status: 400 }
      );
    }
    if (body.lastName.trim().length < 2) {
      return NextResponse.json(
        { error: "Soyad en az 2 karakter olmalıdır" },
        { status: 400 }
      );
    }

    // Identity Number (TC Kimlik)
    if (!body.identityNumber || typeof body.identityNumber !== "string" || body.identityNumber.trim().length === 0) {
      return NextResponse.json(
        { error: "TC Kimlik No alanı zorunludur" },
        { status: 400 }
      );
    }
    if (!validateTCNumber(body.identityNumber.trim())) {
      return NextResponse.json(
        { error: "Geçerli bir TC Kimlik No giriniz (11 haneli)" },
        { status: 400 }
      );
    }

    // Gender
    if (!body.gender || (body.gender !== "erkek" && body.gender !== "kadın")) {
      return NextResponse.json(
        { error: "Cinsiyet seçimi zorunludur" },
        { status: 400 }
      );
    }

    // Blood Type (required)
    const validBloodTypes = ["A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE", "AB_POSITIVE", "AB_NEGATIVE", "O_POSITIVE", "O_NEGATIVE"];
    if (!body.bloodType || !validBloodTypes.includes(body.bloodType)) {
      return NextResponse.json(
        { error: "Kan grubu seçimi zorunludur" },
        { status: 400 }
      );
    }

    // Birth Place
    if (!body.birthPlace || typeof body.birthPlace !== "string" || body.birthPlace.trim().length === 0) {
      return NextResponse.json(
        { error: "Doğum yeri alanı zorunludur" },
        { status: 400 }
      );
    }
    if (body.birthPlace.trim().length < 2) {
      return NextResponse.json(
        { error: "Doğum yeri en az 2 karakter olmalıdır" },
        { status: 400 }
      );
    }

    // Birth Date
    if (!body.birthDate) {
      return NextResponse.json(
        { error: "Doğum tarihi zorunludur" },
        { status: 400 }
      );
    }
    const birthDate = new Date(body.birthDate);
    if (isNaN(birthDate.getTime())) {
      return NextResponse.json(
        { error: "Geçerli bir doğum tarihi giriniz" },
        { status: 400 }
      );
    }

    // City
    if (!body.city || typeof body.city !== "string" || body.city.trim().length === 0) {
      return NextResponse.json(
        { error: "Şehir alanı zorunludur" },
        { status: 400 }
      );
    }
    if (body.city.trim().length < 2) {
      return NextResponse.json(
        { error: "Şehir en az 2 karakter olmalıdır" },
        { status: 400 }
      );
    }

    // Phone
    if (!body.phone || typeof body.phone !== "string" || body.phone.trim().length === 0) {
      return NextResponse.json(
        { error: "Telefon numarası zorunludur" },
        { status: 400 }
      );
    }
    if (!validatePhoneNumber(body.phone.trim())) {
      return NextResponse.json(
        { error: "Geçerli bir telefon numarası giriniz (örn: 05551234567)" },
        { status: 400 }
      );
    }

    // Email
    if (!body.email || typeof body.email !== "string" || body.email.trim().length === 0) {
      return NextResponse.json(
        { error: "E-posta adresi zorunludur" },
        { status: 400 }
      );
    }
    if (!validateEmail(body.email.trim())) {
      return NextResponse.json(
        { error: "Geçerli bir e-posta adresi giriniz" },
        { status: 400 }
      );
    }

    // Address
    if (!body.address || typeof body.address !== "string" || body.address.trim().length === 0) {
      return NextResponse.json(
        { error: "Adres alanı zorunludur" },
        { status: 400 }
      );
    }
    if (body.address.trim().length < 10) {
      return NextResponse.json(
        { error: "Adres en az 10 karakter olmalıdır" },
        { status: 400 }
      );
    }

    // Conditions Accepted
    if (body.conditionsAccepted !== true) {
      return NextResponse.json(
        { error: "Şartları kabul etmeniz gerekmektedir" },
        { status: 400 }
      );
    }

    // Sprint 15.1: Check for duplicate applications (TC, email, phone)
    const trimmedIdentityNumber = body.identityNumber.trim();
    const trimmedEmail = body.email.trim().toLowerCase();
    const trimmedPhone = body.phone.trim();

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
    const application = await prisma.membershipApplication.create({
      data: {
        firstName: body.firstName.trim(),
        lastName: body.lastName.trim(),
        identityNumber: body.identityNumber.trim(),
        gender: body.gender as "erkek" | "kadın",
        bloodType: body.bloodType as any,
        birthPlace: body.birthPlace.trim(),
        birthDate,
        city: body.city.trim(),
        phone: body.phone.trim(),
        email: body.email.trim().toLowerCase(),
        address: body.address.trim(),
        conditionsAccepted: body.conditionsAccepted === true,
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
