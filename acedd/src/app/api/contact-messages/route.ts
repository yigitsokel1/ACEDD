/**
 * API Route: /api/contact-messages
 * 
 * GET /api/contact-messages
 * - Query params: status (NEW|READ|ARCHIVED), search (name/email/subject)
 * - Returns: ContactMessage[] (array of messages, sorted by createdAt desc)
 * - Auth: Required (SUPER_ADMIN or ADMIN)
 * 
 * POST /api/contact-messages
 * - Body: CreateContactMessageRequest
 * - Returns: ContactMessage (created message)
 * - Auth: Not required (public form submission)
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

// GET - Tüm mesajları getir (Admin only)
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
      // Sprint 14.6: Support comma-separated status values (e.g., "new,read")
      const statusMap: Record<string, string> = {
        new: "NEW",
        read: "READ",
        archived: "ARCHIVED",
      };
      
      const statusValues = statusParam.toLowerCase().split(",").map(s => s.trim());
      const prismaStatuses = statusValues
        .map(s => statusMap[s])
        .filter(Boolean) as string[];
      
      if (prismaStatuses.length > 0) {
        if (prismaStatuses.length === 1) {
          where.status = prismaStatuses[0];
        } else {
          where.status = { in: prismaStatuses };
        }
      }
    }

    if (searchParam) {
      const search = searchParam.trim();
      if (search.length > 0) {
        // MariaDB case-insensitive search
        where.OR = [
          { fullName: { contains: search } },
          { email: { contains: search } },
          { subject: { contains: search } },
        ];
      }
    }

    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedMessages = messages.map(formatMessage);

    return NextResponse.json(formattedMessages);
  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }

    logErrorSecurely("[ERROR][API][CONTACT][GET]", error);

    return NextResponse.json(
      {
        error: "Mesajlar yüklenirken bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
      },
      { status: 500 }
    );
  }
}

// POST - Yeni mesaj oluştur (Public, no auth required)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    if (!body.name || typeof body.name !== "string" || body.name.trim().length === 0) {
      return NextResponse.json(
        { error: "Ad Soyad alanı zorunludur" },
        { status: 400 }
      );
    }

    if (!body.email || typeof body.email !== "string" || body.email.trim().length === 0) {
      return NextResponse.json(
        { error: "E-posta adresi zorunludur" },
        { status: 400 }
      );
    }

    if (!body.subject || typeof body.subject !== "string" || body.subject.trim().length === 0) {
      return NextResponse.json(
        { error: "Konu alanı zorunludur" },
        { status: 400 }
      );
    }

    if (!body.message || typeof body.message !== "string" || body.message.trim().length === 0) {
      return NextResponse.json(
        { error: "Mesaj alanı zorunludur" },
        { status: 400 }
      );
    }

    // Extract IP address and user agent from request headers
    const ipAddress = request.headers.get("x-forwarded-for") || 
                     request.headers.get("x-real-ip") || 
                     undefined;
    const userAgent = request.headers.get("user-agent") || undefined;

    // Create message
    const message = await prisma.contactMessage.create({
      data: {
        fullName: body.name.trim(),
        email: body.email.trim(),
        phone: body.phone ? body.phone.trim() : null,
        subject: body.subject.trim(),
        message: body.message.trim(),
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
        status: "NEW",
      },
    });

    const formattedMessage = formatMessage(message);

    return NextResponse.json(formattedMessage, { status: 201 });
  } catch (error) {
    logErrorSecurely("[ERROR][API][CONTACT][CREATE]", error);

    return NextResponse.json(
      {
        error: "Mesajınız gönderilirken bir hata oluştu",
        message: "Lütfen bilgilerinizi kontrol edip tekrar deneyin",
      },
      { status: 500 }
    );
  }
}

