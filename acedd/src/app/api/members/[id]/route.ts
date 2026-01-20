/**
 * API Route: /api/members/[id]
 * 
 * GET /api/members/[id]
 * - Returns: Member (single member by ID)
 * 
 * PUT /api/members/[id]
 * - Body: Partial<UpdateMemberRequest>
 * - Returns: Member (updated member)
 * 
 * DELETE /api/members/[id]
 * - Returns: { message: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { Member } from "@/lib/types/member";
import { requireRole, createAuthErrorResponse, getAdminFromRequest } from "@/lib/auth/adminAuth";
import { validateMemberTags } from "@/lib/utils/memberHelpers";
import { replaceMemberCV } from "@/modules/files/fileService";
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

// GET - Belirli bir üyeyi getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Sprint 14.7: Members GET requires ADMIN or SUPER_ADMIN (GET operation - no database check)
    requireRole(request, ["SUPER_ADMIN", "ADMIN"]);
    
    const { id } = await params;

    const member = await prisma.member.findUnique({
      where: { id },
    });

    if (!member) {
      return NextResponse.json(
        { error: "Üye bulunamadı" },
        { status: 404 }
      );
    }

    const formattedMember = formatMember(member);
    return NextResponse.json(formattedMember);
  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }

    logErrorSecurely("[ERROR][API][MEMBERS][GET_BY_ID]", error);

    return NextResponse.json(
      {
        error: "Üye yüklenirken bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
      },
      { status: 500 }
    );
  }
}

// PUT - Üye bilgilerini güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Sprint 6: All member updates require SUPER_ADMIN (PUT operation - cookie-only auth, database check done in /api/admin/me)
    requireRole(request, ["SUPER_ADMIN"]);

    // Prepare update data
    const updateData: any = {};

    if (body.firstName !== undefined) {
      if (typeof body.firstName !== "string" || body.firstName.trim().length === 0) {
        return NextResponse.json(
          { error: "Ad alanı boş olamaz" },
          { status: 400 }
        );
      }
      updateData.firstName = body.firstName.trim();
    }

    if (body.lastName !== undefined) {
      if (typeof body.lastName !== "string" || body.lastName.trim().length === 0) {
        return NextResponse.json(
          { error: "Soyad alanı boş olamaz" },
          { status: 400 }
        );
      }
      updateData.lastName = body.lastName.trim();
    }

    if (body.email !== undefined) {
      // E-posta opsiyonel; boş string veya null ile temizlenebilir
      updateData.email = (typeof body.email === "string" && body.email.trim().length > 0) ? body.email.trim() : null;
    }

    if (body.phone !== undefined) {
      updateData.phone = body.phone || null;
    }

    if (body.birthDate !== undefined) {
      const raw = body.birthDate;
      if (raw === null || raw === "" || (typeof raw === "string" && !raw.trim())) {
        updateData.birthDate = null;
      } else {
        const birthDate = new Date(raw);
        if (isNaN(birthDate.getTime())) {
          return NextResponse.json(
            { error: "Geçerli bir doğum tarihi giriniz" },
            { status: 400 }
          );
        }
        updateData.birthDate = birthDate;
      }
    }

    if (body.membershipDate !== undefined) {
      const raw = body.membershipDate;
      if (raw === null || raw === "" || (typeof raw === "string" && !raw.trim())) {
        updateData.membershipDate = null;
      } else {
        const membershipDate = new Date(raw);
        if (isNaN(membershipDate.getTime())) {
          return NextResponse.json(
            { error: "Geçerli bir üyelik tarihi giriniz" },
            { status: 400 }
          );
        }
        updateData.membershipDate = membershipDate;
      }
    }

    if (body.gender !== undefined) {
      updateData.gender = (body.gender === "erkek" || body.gender === "kadın") ? body.gender : null;
    }
    if (body.placeOfBirth !== undefined) updateData.placeOfBirth = body.placeOfBirth;
    if (body.currentAddress !== undefined) updateData.currentAddress = body.currentAddress;
    if (body.tcId !== undefined) updateData.tcId = body.tcId || null;
    if (body.lastValidDate !== undefined) {
      updateData.lastValidDate = body.lastValidDate ? new Date(body.lastValidDate) : null;
    }
    if (body.titles !== undefined) {
      updateData.titles = body.titles && Array.isArray(body.titles) ? JSON.stringify(body.titles) : JSON.stringify([]);
    }
    if (body.status !== undefined) {
      updateData.status = body.status === "inactive" ? "INACTIVE" : "ACTIVE";
    }
    // Sprint 5: membershipKind update
    if (body.membershipKind !== undefined) {
      if (body.membershipKind !== "MEMBER" && body.membershipKind !== "VOLUNTEER") {
        return NextResponse.json(
          { error: "Üyelik türü MEMBER veya VOLUNTEER olmalıdır" },
          { status: 400 }
        );
      }
      updateData.membershipKind = body.membershipKind;
    }
    // Sprint 6: tags update (using centralized validation helper)
    if (body.tags !== undefined) {
      if (Array.isArray(body.tags)) {
        const validation = validateMemberTags(body.tags);
        if (!validation.valid) {
          return NextResponse.json(
            { error: `Geçersiz etiketler: ${validation.invalidTags.join(", ")}` },
            { status: 400 }
          );
        }
        updateData.tags = body.tags.length > 0 ? body.tags : null;
      } else {
        return NextResponse.json(
          { error: "Etiketler dizi formatında olmalıdır" },
          { status: 400 }
        );
      }
    }
    if (body.department !== undefined) updateData.department = body.department || null;
    if (body.graduationYear !== undefined) updateData.graduationYear = body.graduationYear || null;
    if (body.occupation !== undefined) updateData.occupation = body.occupation || null;
    // Sprint 15: bloodType and city
    if (body.bloodType !== undefined) updateData.bloodType = body.bloodType || null;
    if (body.city !== undefined) updateData.city = body.city || null;
    // Sprint 17: CV Upload - Eski CV'yi temizle (merkezi servis ile)
    if (body.cvDatasetId !== undefined) {
      // Mevcut member'ı getir ve eski CV dataset ID'sini kontrol et
      const currentMember = await prisma.member.findUnique({
        where: { id },
        select: { cvDatasetId: true },
      });
      
      const oldDatasetId = currentMember?.cvDatasetId ?? null;
      const newDatasetId = body.cvDatasetId ?? null; // Use ?? instead of || to handle null explicitly
      
      // Eğer eski CV varsa ve yeni CV farklıysa, merkezi servis ile temizle
      if (oldDatasetId && oldDatasetId !== newDatasetId) {
        try {
          await replaceMemberCV(id, oldDatasetId, newDatasetId);
        } catch (cleanupError) {
          // Dataset silme hatası log'lanır ama işlemi durdurmaz (non-critical)
          logErrorSecurely("[WARNING][API][MEMBERS][UPDATE][CV_CLEANUP] Failed to cleanup old CV", cleanupError);
        }
      } else if (newDatasetId) {
        // Sadece yeni CV varsa, bağla
        try {
          await replaceMemberCV(id, null, newDatasetId);
        } catch (linkError) {
          logErrorSecurely("[WARNING][API][MEMBERS][UPDATE][CV_LINK] Failed to link new CV", linkError);
        }
      }
      
      updateData.cvDatasetId = newDatasetId;
    }

    const updatedMember = await prisma.member.update({
      where: { id },
      data: updateData,
    });

    const formattedMember = formatMember(updatedMember);
    return NextResponse.json(formattedMember);
  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }
    
    // Prisma error handling
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }

    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2025") {
        // Record not found
        return NextResponse.json(
          { error: "Üye bulunamadı" },
          { status: 404 }
        );
      }
      if (error.code === "P2002") {
        // Unique constraint violation (email)
        return NextResponse.json(
          { error: "Bu e-posta adresi zaten kullanılıyor" },
          { status: 400 }
        );
      }
    }

    logErrorSecurely("[ERROR][API][MEMBERS][UPDATE]", error);

    return NextResponse.json(
      {
        error: "Üye güncellenirken bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
      },
      { status: 500 }
    );
  }
}

// DELETE - Üyeyi sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require SUPER_ADMIN role for deletion (DELETE operation - cookie-only auth, database check done in /api/admin/me)
    requireRole(request, ["SUPER_ADMIN"]);
    
    const { id } = await params;

    // Sprint 18 - B1: Üye silmeden önce CV dataset'i temizle
    const member = await prisma.member.findUnique({
      where: { id },
      select: { cvDatasetId: true },
    });

    if (member?.cvDatasetId) {
      try {
        await replaceMemberCV(id, member.cvDatasetId, null);
      } catch (cleanupError) {
        // Dataset silme hatası kritik değil, log'la ama devam et
        logErrorSecurely("[API][MEMBERS][DELETE] Error cleaning up CV dataset", cleanupError);
      }
    }

    await prisma.member.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Üye başarıyla silindi" });
  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }
    
    // Prisma error handling
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      // Record not found
      return NextResponse.json(
        { error: "Üye bulunamadı" },
        { status: 404 }
      );
    }

    logErrorSecurely("[ERROR][API][MEMBERS][DELETE]", error);

    return NextResponse.json(
      {
        error: "Üye silinirken bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
      },
      { status: 500 }
    );
  }
}
