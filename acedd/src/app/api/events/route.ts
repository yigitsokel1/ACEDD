/**
 * API Route: /api/events
 * 
 * GET /api/events
 * - Returns: Event[] (array of events, sorted by createdAt desc)
 * 
 * POST /api/events
 * - Body: CreateEventRequest
 *   {
 *     title: string (required)
 *     description: string (required)
 *     shortDescription: string (required)
 *     date: string (ISO 8601, required)
 *     location: string (required)
 *     images?: string[] (array of dataset IDs, will be stored as JSON string)
 *     featuredImage?: string | null (dataset ID)
 *     isFeatured?: boolean (default: false)
 *     requirements?: string[] | null (will be stored as JSON string)
 *     benefits?: string[] | null (will be stored as JSON string)
 *   }
 * - Returns: Event (created event)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { Event } from "@/app/(pages)/etkinlikler/constants";
import { requireRole, createAuthErrorResponse } from "@/lib/auth/adminAuth";
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
 * GET /api/events
 * List all events, sorted by createdAt desc
 */
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // Convert Prisma events to frontend format
    const formattedEvents: Event[] = events.map(formatEvent);

    return NextResponse.json(formattedEvents);
  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }

    logErrorSecurely("[ERROR][API][EVENTS][GET]", error);

    return NextResponse.json(
      {
        error: "Etkinlikler yüklenirken bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/events
 * Create a new event
 */
export async function POST(request: NextRequest) {
  try {
    // Sprint 14.7: Events CRUD requires ADMIN or SUPER_ADMIN
    requireRole(request, ["SUPER_ADMIN", "ADMIN"]);
    
    const body = await request.json();

    // Validate required fields
    if (!body.title || typeof body.title !== "string" || body.title.trim().length === 0) {
      return NextResponse.json(
        { error: "Başlık zorunludur" },
        { status: 400 }
      );
    }

    if (!body.description || typeof body.description !== "string" || body.description.trim().length === 0) {
      return NextResponse.json(
        { error: "Açıklama zorunludur" },
        { status: 400 }
      );
    }

    if (!body.shortDescription || typeof body.shortDescription !== "string" || body.shortDescription.trim().length === 0) {
      return NextResponse.json(
        { error: "Kısa açıklama zorunludur" },
        { status: 400 }
      );
    }

    if (!body.date || typeof body.date !== "string") {
      return NextResponse.json(
        { error: "Tarih zorunludur" },
        { status: 400 }
      );
    }

    // Parse and validate date
    const eventDate = new Date(body.date);
    if (isNaN(eventDate.getTime())) {
      return NextResponse.json(
        { error: "Geçerli bir tarih giriniz" },
        { status: 400 }
      );
    }

    if (!body.location || typeof body.location !== "string" || body.location.trim().length === 0) {
      return NextResponse.json(
        { error: "Konum zorunludur" },
        { status: 400 }
      );
    }

    // Parse arrays to JSON strings
    const imagesJson = body.images && Array.isArray(body.images) 
      ? JSON.stringify(body.images) 
      : JSON.stringify([]);
    
    const requirementsJson = body.requirements && Array.isArray(body.requirements)
      ? JSON.stringify(body.requirements)
      : null;
    
    const benefitsJson = body.benefits && Array.isArray(body.benefits)
      ? JSON.stringify(body.benefits)
      : null;

    // Create event in database
    const event = await prisma.event.create({
      data: {
        title: body.title.trim(),
        description: body.description.trim(),
        shortDescription: body.shortDescription.trim(),
        date: eventDate,
        location: body.location.trim(),
        images: imagesJson,
        featuredImage: body.featuredImage === null || body.featuredImage === undefined 
          ? null 
          : (typeof body.featuredImage === "string" ? body.featuredImage.trim() : null),
        isFeatured: body.isFeatured ?? false,
        requirements: requirementsJson,
        benefits: benefitsJson,
      },
    });

    // Convert Prisma event to frontend format
    const formattedEvent = formatEvent(event);

    return NextResponse.json(formattedEvent, { status: 201 });
  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }

    logErrorSecurely("[ERROR][API][EVENTS][CREATE]", error);

    return NextResponse.json(
      {
        error: "Etkinlik kaydedilirken bir hata oluştu",
        message: "Lütfen bilgilerinizi kontrol edip tekrar deneyin",
      },
      { status: 500 }
    );
  }
}
