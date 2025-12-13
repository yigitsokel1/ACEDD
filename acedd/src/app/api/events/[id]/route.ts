/**
 * API Route: /api/events/[id]
 * 
 * GET /api/events/[id]
 * - Returns: Event (single event by ID)
 * 
 * PUT /api/events/[id]
 * - Body: Partial<UpdateEventRequest> (all fields optional)
 * - Returns: Event (updated event)
 * 
 * DELETE /api/events/[id]
 * - Returns: { message: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { Event } from "@/app/(pages)/etkinlikler/constants";
import { requireRole, createAuthErrorResponse } from "@/lib/auth/adminAuth";
import { deleteEventFiles } from "@/modules/files/fileService";

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
 * Helper function to format Prisma Event to frontend Event
 */
function formatEvent(prismaEvent: {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  date: Date;
  location: string;
  images: string;
  featuredImage: string | null;
  isFeatured: boolean;
  requirements: string | null;
  benefits: string | null;
  createdAt: Date;
  updatedAt: Date;
}): Event {
  return {
    id: prismaEvent.id,
    title: prismaEvent.title,
    description: prismaEvent.description,
    shortDescription: prismaEvent.shortDescription,
    date: prismaEvent.date.toISOString(),
    location: prismaEvent.location,
    images: parseJsonArray(prismaEvent.images) ?? [],
    featuredImage: prismaEvent.featuredImage,
    isFeatured: prismaEvent.isFeatured,
    requirements: parseJsonArray(prismaEvent.requirements),
    benefits: parseJsonArray(prismaEvent.benefits),
    createdAt: prismaEvent.createdAt.toISOString(),
    updatedAt: prismaEvent.updatedAt.toISOString(),
  };
}

/**
 * GET /api/events/[id]
 * Get a single event by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Etkinlik bulunamadı" },
        { status: 404 }
      );
    }

    const formattedEvent = formatEvent(event);
    return NextResponse.json(formattedEvent);
  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }

    const errorDetails = error instanceof Error ? error.stack : String(error);
    console.error("[ERROR][API][EVENTS][GET_BY_ID]", error);
    console.error("[ERROR][API][EVENTS][GET_BY_ID] Details:", errorDetails);

    return NextResponse.json(
      {
        error: "Etkinlik yüklenirken bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/events/[id]
 * Update an existing event
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require SUPER_ADMIN or ADMIN role
    requireRole(request, ["SUPER_ADMIN", "ADMIN"]);
    
    const { id } = await params;
    const body = await request.json();

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: "Etkinlik bulunamadı" },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: any = {};

    if (body.title !== undefined) {
      if (typeof body.title !== "string" || body.title.trim().length === 0) {
        return NextResponse.json(
          { error: "Başlık boş olamaz" },
          { status: 400 }
        );
      }
      updateData.title = body.title.trim();
    }

    if (body.description !== undefined) {
      if (typeof body.description !== "string" || body.description.trim().length === 0) {
        return NextResponse.json(
          { error: "Açıklama boş olamaz" },
          { status: 400 }
        );
      }
      updateData.description = body.description.trim();
    }

    if (body.shortDescription !== undefined) {
      if (typeof body.shortDescription !== "string" || body.shortDescription.trim().length === 0) {
        return NextResponse.json(
          { error: "Kısa açıklama boş olamaz" },
          { status: 400 }
        );
      }
      updateData.shortDescription = body.shortDescription.trim();
    }

    if (body.date !== undefined) {
      if (typeof body.date !== "string") {
        return NextResponse.json(
          { error: "Geçerli bir tarih giriniz" },
          { status: 400 }
        );
      }
      const eventDate = new Date(body.date);
      if (isNaN(eventDate.getTime())) {
        return NextResponse.json(
          {
            error: "Validation error",
            message: "date must be a valid ISO 8601 date string",
          },
          { status: 400 }
        );
      }
      updateData.date = eventDate;
    }

    if (body.location !== undefined) {
      if (typeof body.location !== "string" || body.location.trim().length === 0) {
        return NextResponse.json(
          {
            error: "Validation error",
            message: "location must be a non-empty string",
          },
          { status: 400 }
        );
      }
      updateData.location = body.location.trim();
    }

    if (body.images !== undefined) {
      if (Array.isArray(body.images)) {
        updateData.images = JSON.stringify(body.images);
      } else {
        return NextResponse.json(
          {
            error: "Validation error",
            message: "images must be an array",
          },
          { status: 400 }
        );
      }
    }

    if (body.featuredImage !== undefined) {
      updateData.featuredImage = body.featuredImage === null || body.featuredImage === undefined
        ? null
        : (typeof body.featuredImage === "string" ? body.featuredImage.trim() : null);
    }

    if (body.isFeatured !== undefined) {
      if (typeof body.isFeatured !== "boolean") {
        return NextResponse.json(
          {
            error: "Validation error",
            message: "isFeatured must be a boolean",
          },
          { status: 400 }
        );
      }
      updateData.isFeatured = body.isFeatured;
    }

    if (body.requirements !== undefined) {
      if (body.requirements === null) {
        updateData.requirements = null;
      } else if (Array.isArray(body.requirements)) {
        updateData.requirements = JSON.stringify(body.requirements);
      } else {
        return NextResponse.json(
          {
            error: "Validation error",
            message: "requirements must be an array or null",
          },
          { status: 400 }
        );
      }
    }

    if (body.benefits !== undefined) {
      if (body.benefits === null) {
        updateData.benefits = null;
      } else if (Array.isArray(body.benefits)) {
        updateData.benefits = JSON.stringify(body.benefits);
      } else {
        return NextResponse.json(
          {
            error: "Validation error",
            message: "benefits must be an array or null",
          },
          { status: 400 }
        );
      }
    }

    // Update event in database
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: updateData,
    });

    const formattedEvent = formatEvent(updatedEvent);
    return NextResponse.json(formattedEvent);
  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }

    // Handle Prisma not found error
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json(
        { error: "Etkinlik bulunamadı" },
        { status: 404 }
      );
    }

    const errorDetails = error instanceof Error ? error.stack : String(error);
    console.error("[ERROR][API][EVENTS][UPDATE]", error);
    console.error("[ERROR][API][EVENTS][UPDATE] Details:", errorDetails);

    return NextResponse.json(
      {
        error: "Etkinlik güncellenirken bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/events/[id]
 * Delete an event (hard delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require SUPER_ADMIN or ADMIN role
    requireRole(request, ["SUPER_ADMIN", "ADMIN"]);
    
    const { id } = await params;

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: "Etkinlik bulunamadı" },
        { status: 404 }
      );
    }

    // Sprint 17: Event silinmeden önce ilgili görselleri temizle
    try {
      const deletedCount = await deleteEventFiles(id);
      if (deletedCount > 0) {
        console.log(`[API][EVENTS][DELETE] Cleaned up ${deletedCount} files for event ${id}`);
      }
    } catch (cleanupError) {
      // File cleanup hatası kritik değil, log'la ama devam et
      console.error("[API][EVENTS][DELETE] Error cleaning up event files:", cleanupError);
    }

    // Delete event
    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Etkinlik başarıyla silindi" });
  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }

    // Handle Prisma not found error
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json(
        { error: "Etkinlik bulunamadı" },
        { status: 404 }
      );
    }

    const errorDetails = error instanceof Error ? error.stack : String(error);
    console.error("[ERROR][API][EVENTS][DELETE]", error);
    console.error("[ERROR][API][EVENTS][DELETE] Details:", errorDetails);

    return NextResponse.json(
      {
        error: "Etkinlik silinirken bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
      },
      { status: 500 }
    );
  }
}
