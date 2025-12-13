/**
 * API Route: /api/board-members
 * 
 * GET /api/board-members
 * - Query parameters:
 *   - role?: string - Filter by board role (PRESIDENT, VICE_PRESIDENT, etc.)
 * - Returns: BoardMember[] (array of board members with member info, sorted by BoardRole enum order)
 * 
 * POST /api/board-members
 * - Body: { memberId: string, role: BoardRole, termStart?: string, termEnd?: string }
 * - Returns: BoardMember (created board member with member info)
 * 
 * Sprint 5: BoardMember artık Member ile ilişkili, bilgiler Member'dan geliyor
 * Sprint 6: isActive ve order alanları Prisma modelinde yok, TS tipinde de yok (tutarlılık sağlandı)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { BoardMember } from "@/lib/types/member";
import { requireRole, createAuthErrorResponse } from "@/lib/auth/adminAuth";
import { logErrorSecurely } from "@/lib/utils/secureLogging";

/**
 * Helper function to format Prisma BoardMember to frontend BoardMember
 * Sprint 5: BoardMember artık Member ile ilişkili, bilgiler Member'dan geliyor
 */
function formatBoardMember(prismaBoardMember: {
  id: string;
  memberId: string;
  member: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    tags: any; // JSON array
    // Diğer Member alanları...
  };
  role: string;
  termStart: Date | null;
  termEnd: Date | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  const fullName = `${prismaBoardMember.member.firstName} ${prismaBoardMember.member.lastName}`.trim();
  const tags = prismaBoardMember.member.tags ? (Array.isArray(prismaBoardMember.member.tags) ? prismaBoardMember.member.tags : JSON.parse(prismaBoardMember.member.tags as string)) : [];
  
  return {
    id: prismaBoardMember.id,
    memberId: prismaBoardMember.memberId,
    member: {
      id: prismaBoardMember.member.id,
      firstName: prismaBoardMember.member.firstName,
      lastName: prismaBoardMember.member.lastName,
      email: prismaBoardMember.member.email,
      phone: prismaBoardMember.member.phone || undefined,
      tags: tags,
      // Diğer Member alanları gerekirse buraya eklenebilir
    },
    role: prismaBoardMember.role as BoardMember["role"],
    termStart: prismaBoardMember.termStart?.toISOString(),
    termEnd: prismaBoardMember.termEnd?.toISOString(),
    createdAt: prismaBoardMember.createdAt.toISOString(),
    updatedAt: prismaBoardMember.updatedAt.toISOString(),
  };
}

// GET - Tüm yönetim kurulu üyelerini getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role"); // Sprint 5: memberType yerine role

    // Build where clause
    // Sprint 14: Yönetim kurulunda sadece aktif üyeler olabilir
    const where: any = {
      member: {
        status: "ACTIVE", // Sprint 14: Sadece aktif üyeler yönetim kurulunda olabilir
      },
    };

    if (role) {
      where.role = role;
    }

    const boardMembers = await prisma.boardMember.findMany({
      where,
      include: {
        member: true, // Sprint 5: Member bilgilerini de getir
      },
      orderBy: [
        { role: "asc" }, // Sprint 5: Önce BoardRole enum sırasına göre
        { member: { firstName: "asc" } }, // Sonra alfabetik (ad)
        { member: { lastName: "asc" } }, // Sonra alfabetik (soyad)
      ],
    });

    const formattedBoardMembers = boardMembers.map(formatBoardMember);

    return NextResponse.json(formattedBoardMembers);
  } catch (error) {
    logErrorSecurely("[ERROR][API][BOARD_MEMBERS][GET]", error);

    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    const errorDetails = error instanceof Error ? error.stack : String(error);

    return NextResponse.json(
      {
        error: "Failed to fetch board members",
        message: errorMessage,
        ...(process.env.NODE_ENV === "development" && { details: errorDetails }),
      },
      { status: 500 }
    );
  }
}

// POST - Yeni yönetim kurulu üyesi oluştur
export async function POST(request: NextRequest) {
  try {
    // Sprint 6: Board members CRUD requires SUPER_ADMIN only
    requireRole(request, ["SUPER_ADMIN"]);
    
    const body = await request.json();

    // Sprint 5: Validation - memberId ve role gerekli
    if (!body.memberId || typeof body.memberId !== "string") {
      return NextResponse.json(
        { error: "Üye ID zorunludur" },
        { status: 400 }
      );
    }

    if (!body.role || typeof body.role !== "string") {
      return NextResponse.json(
        { error: "Rol zorunludur" },
        { status: 400 }
      );
    }

    // Member'ın var olduğunu ve aktif olduğunu kontrol et
    // Sprint 14: Yönetim kurulunda sadece aktif üyeler olabilir
    const member = await prisma.member.findUnique({
      where: { id: body.memberId },
    });

    if (!member) {
      return NextResponse.json(
        { error: "Üye bulunamadı" },
        { status: 404 }
      );
    }

    if (member.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Pasif üyeler yönetim kuruluna eklenemez" },
        { status: 400 }
      );
    }

    // Create board member (Sprint 6: isActive ve order Prisma modelinde yok)
    const boardMember = await prisma.boardMember.create({
      data: {
        memberId: body.memberId,
        role: body.role,
        termStart: body.termStart ? new Date(body.termStart) : null,
        termEnd: body.termEnd ? new Date(body.termEnd) : null,
      },
      include: {
        member: true,
      },
    });

    const formattedBoardMember = formatBoardMember(boardMember);

    return NextResponse.json(formattedBoardMember, { status: 201 });
  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }

    logErrorSecurely("[ERROR][API][BOARD_MEMBERS][CREATE]", error);

    return NextResponse.json(
      {
        error: "Yönetim kurulu üyesi kaydedilirken bir hata oluştu",
        message: "Lütfen bilgilerinizi kontrol edip tekrar deneyin",
      },
      { status: 500 }
    );
  }
}
