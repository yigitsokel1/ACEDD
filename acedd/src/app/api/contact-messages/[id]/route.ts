/**
 * API Route: /api/contact-messages/[id]
 * 
 * GET /api/contact-messages/[id]
 * - Returns: ContactMessage (single message)
 * - Auth: Required (SUPER_ADMIN or ADMIN)
 * 
 * PUT /api/contact-messages/[id]
 * - Body: UpdateContactMessageStatusRequest
 * - Returns: ContactMessage (updated message)
 * - Auth: Required (SUPER_ADMIN or ADMIN)
 * 
 * DELETE /api/contact-messages/[id]
 * - Returns: Success message
 * - Auth: Required (SUPER_ADMIN only)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { ContactMessage } from "@/lib/types/contact";
import { requireRole, createAuthErrorResponse } from "@/lib/auth/adminAuth";
import { logErrorSecurely } from "@/lib/utils/secureLogging";

/**
 * Helper function to format Prisma ContactMessage to frontend ContactMessage
 */
function formatMessage(prismaMessage: {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  ipAddress: string | null;
  userAgent: string | null;
  status: string;
  createdAt: Date;
  readAt: Date | null;
  archivedAt: Date | null;
}): ContactMessage {
  return {
    id: prismaMessage.id,
    fullName: prismaMessage.fullName,
    email: prismaMessage.email,
    phone: prismaMessage.phone || undefined,
    subject: prismaMessage.subject,
    message: prismaMessage.message,
    ipAddress: prismaMessage.ipAddress || undefined,
    userAgent: prismaMessage.userAgent || undefined,
    status: prismaMessage.status as "NEW" | "READ" | "ARCHIVED",
    createdAt: prismaMessage.createdAt.toISOString(),
    readAt: prismaMessage.readAt?.toISOString() || undefined,
    archivedAt: prismaMessage.archivedAt?.toISOString() || undefined,
  };
}

// GET - Tek mesajı getir (Admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin role
    requireRole(request, ["SUPER_ADMIN", "ADMIN"]);

    const { id } = await params;

    const message = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!message) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      );
    }

    const formattedMessage = formatMessage(message);

    return NextResponse.json(formattedMessage);
  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }

    logErrorSecurely("[ERROR][API][CONTACT][GET_BY_ID]", error);

    return NextResponse.json(
      {
        error: "Mesaj yüklenirken bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
      },
      { status: 500 }
    );
  }
}

// PUT - Mesaj durumunu güncelle (READ/ARCHIVED)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin role for status updates
    requireRole(request, ["SUPER_ADMIN", "ADMIN"]);

    const { id } = await params;
    const body = await request.json();

    // Validation
    if (!body.status || !["READ", "ARCHIVED"].includes(body.status)) {
      return NextResponse.json(
        { error: "Geçersiz durum değeri" },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: any = {
      status: body.status,
    };

    // Set readAt or archivedAt based on status
    if (body.status === "READ") {
      updateData.readAt = new Date();
    } else if (body.status === "ARCHIVED") {
      updateData.archivedAt = new Date();
    }

    const message = await prisma.contactMessage.update({
      where: { id },
      data: updateData,
    });

    const formattedMessage = formatMessage(message);

    return NextResponse.json(formattedMessage);
  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }

    // Prisma not found error
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json(
        { error: "Mesaj bulunamadı" },
        { status: 404 }
      );
    }

    logErrorSecurely("[ERROR][API][CONTACT][UPDATE]", error);

    return NextResponse.json(
      {
        error: "Mesaj güncellenirken bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
      },
      { status: 500 }
    );
  }
}

// DELETE - Mesajı sil (SUPER_ADMIN only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require SUPER_ADMIN role for deletion
    requireRole(request, ["SUPER_ADMIN"]);

    const { id } = await params;

    await prisma.contactMessage.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Mesaj başarıyla silindi" },
      { status: 200 }
    );
  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }

    // Prisma not found error
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json(
        { error: "Mesaj bulunamadı" },
        { status: 404 }
      );
    }

    logErrorSecurely("[ERROR][API][CONTACT][DELETE]", error);

    return NextResponse.json(
      {
        error: "Mesaj silinirken bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
      },
      { status: 500 }
    );
  }
}

