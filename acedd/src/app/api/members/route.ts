/**
 * API Route: /api/members
 * 
 * GET /api/members
 * - Query params: activeOnly, department, search
 * - Returns: Member[] (array of members, sorted by createdAt desc)
 * 
 * POST /api/members
 * - Body: CreateMemberRequest
 * - Returns: Member (created member)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { Member } from "@/lib/types/member";
import { requireRole, createAuthErrorResponse, getAdminFromRequest } from "@/lib/auth/adminAuth";
import { validateMemberTags } from "@/lib/utils/memberHelpers";
import { validateTCNumber } from "@/lib/utils/validationHelpers";

/**
 * Helper function to parse JSON string to array
 */
function parseJsonArray(jsonString: string | null | undefined): string[] | null {
  if (!jsonString) return null;
  try {
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Helper function to format Prisma Member to frontend Member
 * Sprint 5: membershipKind ve tags eklendi
 */
function formatMember(prismaMember: {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string | null;
  birthDate: Date;
  placeOfBirth: string;
  currentAddress: string;
  tcId: string | null;
  lastValidDate: Date | null;
  titles: string;
  status: string;
  membershipDate: Date;
  membershipKind: string;
  tags: any; // JSON array
  department: string | null;
  graduationYear: number | null;
  occupation: string | null;
  bloodType: string | null;
  city: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  const tags = prismaMember.tags ? (Array.isArray(prismaMember.tags) ? prismaMember.tags : JSON.parse(prismaMember.tags as string)) : [];
  
  return {
    id: prismaMember.id,
    firstName: prismaMember.firstName,
    lastName: prismaMember.lastName,
    gender: prismaMember.gender as "erkek" | "kadın",
    email: prismaMember.email,
    phone: prismaMember.phone || "",
    birthDate: prismaMember.birthDate.toISOString(),
    placeOfBirth: prismaMember.placeOfBirth,
    currentAddress: prismaMember.currentAddress,
    tcId: prismaMember.tcId || undefined,
    lastValidDate: prismaMember.lastValidDate?.toISOString() || undefined,
    titles: parseJsonArray(prismaMember.titles) || [],
    status: prismaMember.status.toLowerCase() as "active" | "inactive",
    membershipDate: prismaMember.membershipDate.toISOString(),
    membershipKind: prismaMember.membershipKind as "MEMBER" | "VOLUNTEER",
    tags: tags as Member["tags"],
    bloodType: prismaMember.bloodType as Member["bloodType"] || undefined,
    city: prismaMember.city || undefined,
    createdAt: prismaMember.createdAt.toISOString(),
    updatedAt: prismaMember.updatedAt.toISOString(),
  };
}

// GET - Tüm üyeleri getir
export async function GET(request: NextRequest) {
  try {
    // Sprint 14.7: Members GET requires ADMIN or SUPER_ADMIN (admin sayfasında kullanılıyor)
    requireRole(request, ["SUPER_ADMIN", "ADMIN"]);
    
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("activeOnly") === "true";
    const department = searchParams.get("department");
    const search = searchParams.get("search");

    // Build where clause
    const where: any = {};

    if (activeOnly) {
      where.status = "ACTIVE";
    }

    if (department) {
      where.department = department;
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const members = await prisma.member.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedMembers: Member[] = members.map(formatMember);

    return NextResponse.json(formattedMembers);
  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }

    const errorDetails = error instanceof Error ? error.stack : String(error);
    console.error("[ERROR][API][MEMBERS][GET]", error);
    console.error("[ERROR][API][MEMBERS][GET] Details:", errorDetails);

    return NextResponse.json(
      {
        error: "Üyeler yüklenirken bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
      },
      { status: 500 }
    );
  }
}

// POST - Yeni üye oluştur
export async function POST(request: NextRequest) {
  try {
    // Require SUPER_ADMIN role for creating members
    requireRole(request, ["SUPER_ADMIN"]);
    
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

    if (!body.birthDate) {
      return NextResponse.json(
        { error: "Doğum tarihi zorunludur" },
        { status: 400 }
      );
    }

    if (!body.membershipDate) {
      return NextResponse.json(
        { error: "Üyelik tarihi zorunludur" },
        { status: 400 }
      );
    }

    // Sprint 5: membershipKind validation
    if (!body.membershipKind || (body.membershipKind !== "MEMBER" && body.membershipKind !== "VOLUNTEER")) {
      return NextResponse.json(
        { error: "Üyelik türü zorunludur (MEMBER veya VOLUNTEER)" },
        { status: 400 }
      );
    }

    // Parse dates
    const birthDate = new Date(body.birthDate);
    const membershipDate = new Date(body.membershipDate);

    if (isNaN(birthDate.getTime())) {
      return NextResponse.json(
        { error: "Geçerli bir doğum tarihi giriniz" },
        { status: 400 }
      );
    }

    if (isNaN(membershipDate.getTime())) {
      return NextResponse.json(
        { error: "Geçerli bir üyelik tarihi giriniz" },
        { status: 400 }
      );
    }

    // Validate TC Number if provided
    if (body.tcId && typeof body.tcId === "string" && body.tcId.trim().length > 0) {
      if (!validateTCNumber(body.tcId.trim())) {
        return NextResponse.json(
          { error: "Geçerli bir TC Kimlik No giriniz (11 haneli)" },
          { status: 400 }
        );
      }
    }

    // Sprint 6: Validate tags if provided (using centralized helper)
    let tags = null;
    if (body.tags !== undefined) {
      if (Array.isArray(body.tags)) {
        const validation = validateMemberTags(body.tags);
        if (!validation.valid) {
          return NextResponse.json(
            { error: `Geçersiz etiketler: ${validation.invalidTags.join(", ")}` },
            { status: 400 }
          );
        }
        tags = body.tags.length > 0 ? body.tags : null;
      } else {
        return NextResponse.json(
          { error: "Etiketler dizi formatında olmalıdır" },
          { status: 400 }
        );
      }
    }

    // Create member
    const member = await prisma.member.create({
      data: {
        firstName: body.firstName.trim(),
        lastName: body.lastName.trim(),
        gender: body.gender || "erkek",
        email: body.email.trim(),
        phone: body.phone || null,
        birthDate,
        placeOfBirth: body.placeOfBirth || "",
        currentAddress: body.currentAddress || "",
        tcId: body.tcId || null,
        lastValidDate: body.lastValidDate ? new Date(body.lastValidDate) : null,
        titles: body.titles && Array.isArray(body.titles) ? JSON.stringify(body.titles) : JSON.stringify([]),
        status: "ACTIVE", // Automatically active for new members
        membershipDate,
        membershipKind: body.membershipKind, // Sprint 5: Required field
        tags: tags, // Sprint 5: Optional tags
        department: body.department || null,
        graduationYear: body.graduationYear || null,
        occupation: body.occupation || null,
        // Sprint 15: Membership Application'dan gelen yeni alanlar
        bloodType: body.bloodType || null,
        city: body.city || null,
      },
    });

    const formattedMember = formatMember(member);

    return NextResponse.json(formattedMember, { status: 201 });
  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }

    const errorDetails = error instanceof Error ? error.stack : String(error);
    console.error("[ERROR][API][MEMBERS][CREATE]", error);
    console.error("[ERROR][API][MEMBERS][CREATE] Details:", errorDetails);

    // Prisma unique constraint error (email)
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return NextResponse.json(
        { error: "Bu e-posta adresi zaten kullanılıyor" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Üye kaydedilirken bir hata oluştu",
        message: "Lütfen bilgilerinizi kontrol edip tekrar deneyin",
      },
      { status: 500 }
    );
  }
}
