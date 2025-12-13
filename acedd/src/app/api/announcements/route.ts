/**
 * API Route: /api/announcements
 * 
 * GET /api/announcements
 * - Query parameters:
 *   - category?: string - Filter by category (e.g., "general", "scholarship", "event", "system")
 *   - pinned?: "true" | "false" - Filter by pinned status
 *   - activeOnly?: "true" | "false" - Filter only active announcements (based on startsAt/endsAt)
 * - Returns: Announcement[] (array of announcements)
 * 
 * POST /api/announcements
 * - Body: CreateAnnouncementRequest
 *   {
 *     title: string (required)
 *     summary?: string | null
 *     content: string (required)
 *     category: AnnouncementCategory (required)
 *     startsAt?: string | null (ISO 8601)
 *     endsAt?: string | null (ISO 8601)
 *     isPinned?: boolean (default: false)
 *   }
 * - Returns: Announcement (created announcement)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type {
  Announcement,
  CreateAnnouncementRequest,
  GetAnnouncementsQuery,
} from "@/lib/types/announcement";
import { isAnnouncementActive } from "@/lib/utils/isAnnouncementActive";
import { requireRole, createAuthErrorResponse } from "@/lib/auth/adminAuth";
import { logErrorSecurely } from "@/lib/utils/secureLogging";

/**
 * GET /api/announcements
 * List announcements with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const pinned = searchParams.get("pinned");
    const activeOnly = searchParams.get("activeOnly");

    // Build Prisma query
    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (pinned === "true") {
      where.isPinned = true;
    } else if (pinned === "false") {
      where.isPinned = false;
    }

    // Fetch announcements from database
    const announcements = await prisma.announcement.findMany({
      where,
      orderBy: [
        { isPinned: "desc" }, // Pinned first
        { createdAt: "desc" }, // Newest first
      ],
    });

    // Convert Prisma DateTime to ISO strings and filter by active status if needed
    const formattedAnnouncements: Announcement[] = announcements
      .map((announcement) => ({
        id: announcement.id,
        title: announcement.title,
        summary: announcement.summary,
        content: announcement.content,
        category: announcement.category,
        startsAt: announcement.startsAt?.toISOString() ?? null,
        endsAt: announcement.endsAt?.toISOString() ?? null,
        isPinned: announcement.isPinned,
        createdAt: announcement.createdAt.toISOString(),
        updatedAt: announcement.updatedAt.toISOString(),
      }))
      .filter((announcement) => {
        // Filter by active status if activeOnly=true
        if (activeOnly === "true") {
          return isAnnouncementActive(announcement);
        }
        return true;
      });

    return NextResponse.json(formattedAnnouncements);
  } catch (error) {
    logErrorSecurely("[ERROR][API][ANNOUNCEMENTS][GET]", error);

    return NextResponse.json(
      {
        error: "Duyurular yüklenirken bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/announcements
 * Create a new announcement
 */
export async function POST(request: NextRequest) {
  try {
    // Sprint 6: Announcements CRUD requires ADMIN or SUPER_ADMIN
    requireRole(request, ["SUPER_ADMIN", "ADMIN"]);
    
    const body: CreateAnnouncementRequest = await request.json();

    // Validate required fields
    if (!body.title || typeof body.title !== "string" || body.title.trim().length === 0) {
      return NextResponse.json(
        { error: "Başlık zorunludur" },
        { status: 400 }
      );
    }

    if (!body.content || typeof body.content !== "string" || body.content.trim().length === 0) {
      return NextResponse.json(
        { error: "İçerik zorunludur" },
        { status: 400 }
      );
    }

    if (!body.category || typeof body.category !== "string" || body.category.trim().length === 0) {
      return NextResponse.json(
        { error: "Kategori zorunludur" },
        { status: 400 }
      );
    }

    // Parse and validate dates if provided
    let startsAt: Date | null = null;
    let endsAt: Date | null = null;

    if (body.startsAt) {
      startsAt = new Date(body.startsAt);
      if (isNaN(startsAt.getTime())) {
        return NextResponse.json(
          { error: "Geçerli bir başlangıç tarihi giriniz" },
          { status: 400 }
        );
      }
    }

    if (body.endsAt) {
      endsAt = new Date(body.endsAt);
      if (isNaN(endsAt.getTime())) {
        return NextResponse.json(
          { error: "Geçerli bir bitiş tarihi giriniz" },
          { status: 400 }
        );
      }
    }

    // Validate date logic: startsAt should be before endsAt
    if (startsAt && endsAt && startsAt >= endsAt) {
      return NextResponse.json(
        {
          error: "Başlangıç tarihi bitiş tarihinden önce olmalıdır",
          message: "startsAt must be before endsAt",
        },
        { status: 400 }
      );
    }

    // Create announcement in database
    const announcement = await prisma.announcement.create({
      data: {
        title: body.title.trim(),
        summary: body.summary === null || (typeof body.summary === "string" && body.summary.trim().length === 0) ? null : body.summary?.trim() ?? null,
        content: body.content.trim(),
        category: body.category.trim(),
        startsAt,
        endsAt,
        isPinned: body.isPinned ?? false,
      },
    });

    // Convert Prisma DateTime to ISO strings
    const formattedAnnouncement: Announcement = {
      id: announcement.id,
      title: announcement.title,
      summary: announcement.summary,
      content: announcement.content,
      category: announcement.category,
      startsAt: announcement.startsAt?.toISOString() ?? null,
      endsAt: announcement.endsAt?.toISOString() ?? null,
      isPinned: announcement.isPinned,
      createdAt: announcement.createdAt.toISOString(),
      updatedAt: announcement.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedAnnouncement, { status: 201 });
  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }

    logErrorSecurely("[ERROR][API][ANNOUNCEMENTS][CREATE]", error);

    return NextResponse.json(
      {
        error: "Duyuru kaydedilirken bir hata oluştu",
        message: "Lütfen bilgilerinizi kontrol edip tekrar deneyin",
      },
      { status: 500 }
    );
  }
}
