/**
 * API Route: /api/board-members/[id]
 * 
 * GET /api/board-members/[id]
 * - Returns: BoardMember (single board member by ID with member info)
 * 
 * PUT /api/board-members/[id]
 * - Body: Partial<{ memberId: string, role: BoardRole, termStart?: string, termEnd?: string }>
 * - Returns: BoardMember (updated board member with member info)
 * 
 * DELETE /api/board-members/[id]
 * - Returns: { message: string }
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
    email: string | null;
    phone: string | null;
    tags: unknown;
  };
  role: string;
  termStart: Date | null;
  termEnd: Date | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  const tags = prismaBoardMember.member.tags ? (Array.isArray(prismaBoardMember.member.tags) ? prismaBoardMember.member.tags : JSON.parse(prismaBoardMember.member.tags as string)) : [];
  
  return {
    id: prismaBoardMember.id,
    memberId: prismaBoardMember.memberId,
    member: {
      id: prismaBoardMember.member.id,
      firstName: prismaBoardMember.member.firstName,
      lastName: prismaBoardMember.member.lastName,
      email: prismaBoardMember.member.email ?? "",
      phone: prismaBoardMember.member.phone ?? undefined,
      tags: tags,
    },
    role: prismaBoardMember.role as BoardMember["role"],
    termStart: prismaBoardMember.termStart?.toISOString(),
    termEnd: prismaBoardMember.termEnd?.toISOString(),
    createdAt: prismaBoardMember.createdAt.toISOString(),
    updatedAt: prismaBoardMember.updatedAt.toISOString(),
  };
}

// GET - Belirli bir yönetim kurulu üyesini getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const boardMember = await prisma.boardMember.findUnique({
      where: { id },
      include: {
        member: true, // Sprint 5: Member bilgilerini de getir
      },
    });

    if (!boardMember) {
      return NextResponse.json(
        { error: "Yönetim kurulu üyesi bulunamadı" },
        { status: 404 }
      );
    }

    const formattedBoardMember = formatBoardMember(boardMember);
    return NextResponse.json(formattedBoardMember);
  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }

    logErrorSecurely("[ERROR][API][BOARD_MEMBERS][GET_BY_ID]", error);

    return NextResponse.json(
      {
        error: "Yönetim kurulu üyesi yüklenirken bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
      },
      { status: 500 }
    );
  }
}

// PUT - Yönetim kurulu üyesi bilgilerini güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Sprint 6: Board members CRUD requires SUPER_ADMIN only
    requireRole(request, ["SUPER_ADMIN"]);
    
    const { id } = await params;
    const body = await request.json();

    // Prepare update data - Sprint 5: Sadece BoardMember'a özgü alanlar
    const updateData: any = {};

    if (body.memberId !== undefined) {
      // Member değiştirme - yeni Member'ın var olduğunu ve aktif olduğunu kontrol et
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
      
      updateData.memberId = body.memberId;
    }

    if (body.role !== undefined) {
      updateData.role = body.role;
    }

    if (body.termStart !== undefined) {
      updateData.termStart = body.termStart ? new Date(body.termStart) : null;
    }

    if (body.termEnd !== undefined) {
      updateData.termEnd = body.termEnd ? new Date(body.termEnd) : null;
    }

    const updatedBoardMember = await prisma.boardMember.update({
      where: { id },
      data: updateData,
      include: {
        member: true, // Sprint 5: Member bilgilerini de getir
      },
    });

    const formattedBoardMember = formatBoardMember(updatedBoardMember);
    return NextResponse.json(formattedBoardMember);
  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }
    
    // Prisma error handling
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      // Record not found
      return NextResponse.json(
        { error: "Yönetim kurulu üyesi bulunamadı" },
        { status: 404 }
      );
    }

    logErrorSecurely("[ERROR][API][BOARD_MEMBERS][UPDATE]", error);

    return NextResponse.json(
      {
        error: "Yönetim kurulu üyesi güncellenirken bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
      },
      { status: 500 }
    );
  }
}

// DELETE - Yönetim kurulu üyesini sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Sprint 6: Board members CRUD requires SUPER_ADMIN only
    requireRole(request, ["SUPER_ADMIN"]);
    
    const { id } = await params;

    await prisma.boardMember.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Yönetim kurulu üyesi başarıyla silindi" });
  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }
    
    // Prisma error handling
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      // Record not found
      return NextResponse.json(
        { error: "Yönetim kurulu üyesi bulunamadı" },
        { status: 404 }
      );
    }

    logErrorSecurely("[ERROR][API][BOARD_MEMBERS][DELETE]", error);

    return NextResponse.json(
      {
        error: "Yönetim kurulu üyesi silinirken bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
      },
      { status: 500 }
    );
  }
}
