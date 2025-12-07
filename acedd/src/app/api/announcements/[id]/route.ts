/**
 * API Route: /api/announcements/[id]
 * 
 * GET /api/announcements/[id]
 * - Path parameter: id (string) - Announcement UUID
 * - Returns: Announcement (single announcement) or 404 if not found
 * 
 * PUT /api/announcements/[id]
 * - Path parameter: id (string) - Announcement UUID
 * - Body: UpdateAnnouncementRequest (all fields optional)
 *   {
 *     title?: string
 *     summary?: string | null
 *     content?: string
 *     category?: AnnouncementCategory
 *     startsAt?: string | null (ISO 8601)
 *     endsAt?: string | null (ISO 8601)
 *     isPinned?: boolean
 *   }
 * - Returns: Announcement (updated announcement) or 404 if not found
 * 
 * DELETE /api/announcements/[id]
 * - Path parameter: id (string) - Announcement UUID
 * - Returns: { success: true } or 404 if not found
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type {
  Announcement,
  UpdateAnnouncementRequest,
} from "@/lib/types/announcement";
import { requireRole, createAuthErrorResponse } from "@/lib/auth/adminAuth";

/**
 * GET /api/announcements/[id]
 * Get a single announcement by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const announcement = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!announcement) {
      return NextResponse.json(
        {
          error: "Not found",
          message: "Announcement not found",
        },
        { status: 404 }
      );
    }

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

    return NextResponse.json(formattedAnnouncement);
  } catch (error) {
    console.error("Error fetching announcement:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch announcement",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/announcements/[id]
 * Update an existing announcement
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Sprint 6: Announcements CRUD requires ADMIN or SUPER_ADMIN
    requireRole(request, ["SUPER_ADMIN", "ADMIN"]);
    
    const { id } = await params;
    const body: UpdateAnnouncementRequest = await request.json();

    // Check if announcement exists
    const existing = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        {
          error: "Not found",
          message: "Announcement not found",
        },
        { status: 404 }
      );
    }

    // Validate provided fields
    if (body.title !== undefined) {
      if (typeof body.title !== "string" || body.title.trim().length === 0) {
        return NextResponse.json(
          {
            error: "Validation error",
            message: "title must be a non-empty string",
          },
          { status: 400 }
        );
      }
    }

    if (body.content !== undefined) {
      if (typeof body.content !== "string" || body.content.trim().length === 0) {
        return NextResponse.json(
          {
            error: "Validation error",
            message: "content must be a non-empty string",
          },
          { status: 400 }
        );
      }
    }

    if (body.category !== undefined) {
      if (typeof body.category !== "string" || body.category.trim().length === 0) {
        return NextResponse.json(
          {
            error: "Validation error",
            message: "category must be a non-empty string",
          },
          { status: 400 }
        );
      }
    }

    // Parse and validate dates if provided
    let startsAt: Date | null | undefined = undefined;
    let endsAt: Date | null | undefined = undefined;

    if (body.startsAt !== undefined) {
      if (body.startsAt === null) {
        startsAt = null;
      } else {
        startsAt = new Date(body.startsAt);
        if (isNaN(startsAt.getTime())) {
          return NextResponse.json(
            {
              error: "Validation error",
              message: "startsAt must be a valid ISO 8601 date string or null",
            },
            { status: 400 }
          );
        }
      }
    }

    if (body.endsAt !== undefined) {
      if (body.endsAt === null) {
        endsAt = null;
      } else {
        endsAt = new Date(body.endsAt);
        if (isNaN(endsAt.getTime())) {
          return NextResponse.json(
            {
              error: "Validation error",
              message: "endsAt must be a valid ISO 8601 date string or null",
            },
            { status: 400 }
          );
        }
      }
    }

    // Validate date logic: startsAt should be before endsAt
    // Use existing values if not provided in update
    const finalStartsAt = startsAt !== undefined ? startsAt : existing.startsAt;
    const finalEndsAt = endsAt !== undefined ? endsAt : existing.endsAt;

    if (finalStartsAt && finalEndsAt && finalStartsAt >= finalEndsAt) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: "startsAt must be before endsAt",
        },
        { status: 400 }
      );
    }

    // Build update data (only include provided fields)
    const updateData: any = {};

    if (body.title !== undefined) {
      updateData.title = body.title.trim();
    }
    if (body.summary !== undefined) {
      updateData.summary = body.summary === null || body.summary.trim().length === 0 ? null : body.summary.trim();
    }
    if (body.content !== undefined) {
      updateData.content = body.content.trim();
    }
    if (body.category !== undefined) {
      updateData.category = body.category.trim();
    }
    if (body.startsAt !== undefined) {
      updateData.startsAt = startsAt;
    }
    if (body.endsAt !== undefined) {
      updateData.endsAt = endsAt;
    }
    if (body.isPinned !== undefined) {
      updateData.isPinned = body.isPinned;
    }

    // Update announcement in database
    const announcement = await prisma.announcement.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(formattedAnnouncement);
  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }
    
    console.error("Error updating announcement:", error);
    return NextResponse.json(
      {
        error: "Failed to update announcement",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/announcements/[id]
 * Delete an announcement
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require SUPER_ADMIN or ADMIN role
    requireRole(request, ["SUPER_ADMIN", "ADMIN"]);
    
    const { id } = await params;

    // Check if announcement exists
    const existing = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        {
          error: "Not found",
          message: "Announcement not found",
        },
        { status: 404 }
      );
    }

    // Delete announcement from database
    await prisma.announcement.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }
    
    console.error("Error deleting announcement:", error);
    return NextResponse.json(
      {
        error: "Failed to delete announcement",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
