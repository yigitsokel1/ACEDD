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
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { Member } from "@/lib/types/member";
import { requireRole, createAuthErrorResponse } from "@/lib/auth/adminAuth";
import { validateMemberTags } from "@/lib/utils/memberHelpers";
import { validateTCNumber } from "@/lib/utils/validationHelpers";
import { logErrorSecurely } from "@/lib/utils/secureLogging";

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
  gender: string | null;
  email: string | null;
  phone: string | null;
  birthDate: Date | null;
  placeOfBirth: string;
  currentAddress: string;
  tcId: string | null;
  lastValidDate: Date | null;
  titles: string;
  status: string;
  membershipDate: Date | null;
  membershipKind: string;
  tags: unknown;
  department: string | null;
  graduationYear: number | null;
  occupation: string | null;
  bloodType: string | null;
  city: string | null;
  cvDatasetId: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  const tags = prismaMember.tags ? (Array.isArray(prismaMember.tags) ? prismaMember.tags : JSON.parse(String(prismaMember.tags))) : [];
  return {
    id: prismaMember.id,
    firstName: prismaMember.firstName,
    lastName: prismaMember.lastName,
    gender: (prismaMember.gender ?? "") as "erkek" | "kadın",
    email: prismaMember.email ?? "",
    phone: prismaMember.phone ?? "",
    birthDate: prismaMember.birthDate?.toISOString() ?? "",
    placeOfBirth: prismaMember.placeOfBirth ?? "",
    currentAddress: prismaMember.currentAddress ?? "",
    tcId: prismaMember.tcId || undefined,
    lastValidDate: prismaMember.lastValidDate?.toISOString() || undefined,
    titles: parseJsonArray(prismaMember.titles) || [],
    status: prismaMember.status.toLowerCase() as "active" | "inactive",
    membershipDate: prismaMember.membershipDate?.toISOString() ?? "",
    membershipKind: prismaMember.membershipKind as "MEMBER" | "VOLUNTEER",
    tags: tags as Member["tags"],
    bloodType: (prismaMember.bloodType as Member["bloodType"]) || undefined,
    city: prismaMember.city || undefined,
    cvDatasetId: prismaMember.cvDatasetId || undefined,
    createdAt: prismaMember.createdAt.toISOString(),
    updatedAt: prismaMember.updatedAt.toISOString(),
  };
}

// GET - Tüm üyeleri getir
export async function GET(request: NextRequest) {
  try {
    // Sprint 14.7: Members GET requires ADMIN or SUPER_ADMIN (GET operation - no database check)
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

    logErrorSecurely("[ERROR][API][MEMBERS][GET]", error);

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
    // Require SUPER_ADMIN role for creating members (POST operation - cookie-only auth, database check done in /api/admin/me)
    requireRole(request, ["SUPER_ADMIN"]);
    
    const body = await request.json();

    // Zorunlu alanlar: Ad, Soyad, Durum, Üye Türü
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

    if (!body.status || (body.status !== "active" && body.status !== "inactive")) {
      return NextResponse.json(
        { error: "Durum zorunludur (active veya inactive)" },
        { status: 400 }
      );
    }

    if (!body.membershipKind || (body.membershipKind !== "MEMBER" && body.membershipKind !== "VOLUNTEER")) {
      return NextResponse.json(
        { error: "Üye türü zorunludur (MEMBER veya VOLUNTEER)" },
        { status: 400 }
      );
    }

    // Opsiyonel tarihler: sadece gönderilmiş ve geçerliyse parse et
    let birthDate: Date | null = null;
    if (body.birthDate && String(body.birthDate).trim()) {
      const d = new Date(body.birthDate);
      if (isNaN(d.getTime())) {
        return NextResponse.json(
          { error: "Geçerli bir doğum tarihi giriniz" },
          { status: 400 }
        );
      }
      birthDate = d;
    }

    let membershipDate: Date | null = null;
    if (body.membershipDate && String(body.membershipDate).trim()) {
      const d = new Date(body.membershipDate);
      if (isNaN(d.getTime())) {
        return NextResponse.json(
          { error: "Geçerli bir üyelik tarihi giriniz" },
          { status: 400 }
        );
      }
      membershipDate = d;
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

    // Create member (sadece ad, soyad, durum, üye türü zorunlu)
    // gender: sadece erkek/kadın ise ekle (null gönderilmez; Prisma optional = anahtar yok)
    // birthDate, membershipDate: her zaman gönder; null ise null (Prisma DateTime? kabul eder)
    const data: Record<string, unknown> = {
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      email: (body.email && typeof body.email === "string" && body.email.trim()) ? body.email.trim() : null,
      phone: (body.phone && typeof body.phone === "string" && body.phone.trim()) ? body.phone.trim() : null,
      placeOfBirth: (body.placeOfBirth && typeof body.placeOfBirth === "string") ? body.placeOfBirth.trim() : "",
      currentAddress: (body.currentAddress && typeof body.currentAddress === "string") ? body.currentAddress.trim() : "",
      tcId: (body.tcId && typeof body.tcId === "string" && body.tcId.trim()) ? body.tcId.trim() : null,
      lastValidDate: body.lastValidDate ? new Date(body.lastValidDate) : null,
      titles: body.titles && Array.isArray(body.titles) ? JSON.stringify(body.titles) : JSON.stringify([]),
      status: body.status === "inactive" ? "INACTIVE" : "ACTIVE",
      membershipKind: body.membershipKind,
      tags,
      department: body.department || null,
      graduationYear: body.graduationYear || null,
      occupation: body.occupation || null,
      bloodType: body.bloodType || null,
      city: (body.city && typeof body.city === "string" && body.city.trim()) ? body.city.trim() : null,
      cvDatasetId: body.cvDatasetId || null,
      birthDate,
      membershipDate,
    };
    if (body.gender === "erkek" || body.gender === "kadın") data.gender = body.gender;

    const member = await prisma.member.create({
      data: data as unknown as Prisma.MemberCreateInput,
    });

    const formattedMember = formatMember(member);

    return NextResponse.json(formattedMember, { status: 201 });
  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }

    logErrorSecurely("[ERROR][API][MEMBERS][CREATE]", error);

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
