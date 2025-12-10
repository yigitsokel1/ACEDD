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

    const errorDetails = error instanceof Error ? error.stack : String(error);
    console.error("[ERROR][API][MEMBERSHIP][GET]", error);
    console.error("[ERROR][API][MEMBERSHIP][GET] Details:", errorDetails);

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
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    if (!body.firstName || typeof body.firstName !== "string" || body.firstName.trim().length === 0) {
      return NextResponse.json(
        { error: "Ad alanı zorunludur" },
        { status: 400 }
      );
    }

    if (!body.lastName || typeof body.lastName !== "string" || body.lastName.trim().length === 0) {
      return NextResponse.json(
        { error: "Soyad alanı zorunludur" },
        { status: 400 }
      );
    }

    if (!body.email || typeof body.email !== "string" || body.email.trim().length === 0) {
      return NextResponse.json(
        { error: "E-posta adresi zorunludur" },
        { status: 400 }
      );
    }

    if (!body.phone || typeof body.phone !== "string" || body.phone.trim().length === 0) {
      return NextResponse.json(
        { error: "Telefon numarası zorunludur" },
        { status: 400 }
      );
    }

    if (!body.birthDate) {
      return NextResponse.json(
        { error: "Doğum tarihi zorunludur" },
        { status: 400 }
      );
    }

    // Parse date
    const birthDate = new Date(body.birthDate);
    if (isNaN(birthDate.getTime())) {
      return NextResponse.json(
        { error: "Geçerli bir doğum tarihi giriniz" },
        { status: 400 }
      );
    }

    // Create application
    const application = await prisma.membershipApplication.create({
      data: {
        firstName: body.firstName.trim(),
        lastName: body.lastName.trim(),
        gender: body.gender || "erkek",
        email: body.email.trim(),
        phone: body.phone.trim(),
        birthDate,
        academicLevel: body.academicLevel || "lise",
        maritalStatus: body.maritalStatus || "bekar",
        hometown: body.hometown || "",
        placeOfBirth: body.placeOfBirth || "",
        nationality: body.nationality || "",
        currentAddress: body.currentAddress || "",
        tcId: body.tcId || null,
        lastValidDate: body.lastValidDate ? new Date(body.lastValidDate) : null,
        status: "PENDING", // Always start as pending
        department: body.department || null,
        reason: body.reason || null,
      },
    });

    const formattedApplication = formatApplication(application);

    return NextResponse.json(formattedApplication, { status: 201 });
  } catch (error) {
    const errorDetails = error instanceof Error ? error.stack : String(error);
    console.error("[ERROR][API][MEMBERSHIP][CREATE]", error);
    console.error("[ERROR][API][MEMBERSHIP][CREATE] Details:", errorDetails);

    // Prisma unique constraint error (duplicate email)
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return NextResponse.json(
        { error: "Bu e-posta adresi ile daha önce başvuru yapılmış" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Başvuru kaydedilirken bir hata oluştu",
        message: "Lütfen bilgilerinizi kontrol edip tekrar deneyin",
      },
      { status: 500 }
    );
  }
}
