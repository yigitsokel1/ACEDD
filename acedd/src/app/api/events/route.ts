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
    console.error("Error fetching events:", error);
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorDetails = error instanceof Error ? error.stack : String(error);
    
    console.error("Error details:", errorDetails);
    
    return NextResponse.json(
      {
        error: "Failed to fetch events",
        message: errorMessage,
        // Only include details in development
        ...(process.env.NODE_ENV === "development" && { details: errorDetails }),
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
    const body = await request.json();

    // Validate required fields
    if (!body.title || typeof body.title !== "string" || body.title.trim().length === 0) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: "title is required and must be a non-empty string",
        },
        { status: 400 }
      );
    }

    if (!body.description || typeof body.description !== "string" || body.description.trim().length === 0) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: "description is required and must be a non-empty string",
        },
        { status: 400 }
      );
    }

    if (!body.shortDescription || typeof body.shortDescription !== "string" || body.shortDescription.trim().length === 0) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: "shortDescription is required and must be a non-empty string",
        },
        { status: 400 }
      );
    }

    if (!body.date || typeof body.date !== "string") {
      return NextResponse.json(
        {
          error: "Validation error",
          message: "date is required and must be a valid ISO 8601 date string",
        },
        { status: 400 }
      );
    }

    // Parse and validate date
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

    if (!body.location || typeof body.location !== "string" || body.location.trim().length === 0) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: "location is required and must be a non-empty string",
        },
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
    
    console.error("Error creating event:", error);
    return NextResponse.json(
      {
        error: "Failed to create event",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
