/**
 * API Route: /api/settings
 * 
 * GET /api/settings
 * - Query parameters:
 *   - prefix?: string - Filter by key prefix (e.g., "site" returns all site.* settings)
 * - Returns: Setting[] (array of settings)
 * - Auth: Required (SUPER_ADMIN only)
 * 
 * PUT /api/settings
 * - Body: UpsertSettingRequest
 *   {
 *     key: string (required) - Dot notation key (e.g., "site.name", "contact.email")
 *     value: SettingValue (required) - string, number, boolean, object, array, or null
 *   }
 * - Returns: Setting (upserted setting)
 * - Auth: Required (SUPER_ADMIN only)
 * - Note: Upsert operation (create if not exists, update if exists)
 * - Note: updatedBy is automatically set from session
 * 
 * Sprint 10: Settings management API
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { Setting, UpsertSettingRequest } from "@/lib/types/setting";
import { requireRole, createAuthErrorResponse } from "@/lib/auth/adminAuth";
import { Prisma } from "@prisma/client";

/**
 * GET /api/settings
 * List settings with optional prefix filtering
 */
export async function GET(request: NextRequest) {
  try {
    // Require SUPER_ADMIN role
    const session = requireRole(request, ["SUPER_ADMIN"]);

    const searchParams = request.nextUrl.searchParams;
    const prefix = searchParams.get("prefix");

    // Build Prisma query
    const where: Prisma.SettingWhereInput = {};

    if (prefix) {
      // Filter by key prefix (e.g., "site" matches "site.name", "site.description", etc.)
      where.key = {
        startsWith: `${prefix}.`,
      };
    }

    // Fetch settings from database
    const settings = await prisma.setting.findMany({
      where,
      orderBy: {
        key: "asc", // Alphabetical order by key
      },
    });

    // Convert Prisma DateTime to ISO strings
    const formattedSettings: Setting[] = settings.map((setting) => ({
      id: setting.id,
      key: setting.key,
      value: setting.value,
      updatedAt: setting.updatedAt.toISOString(),
      updatedBy: setting.updatedBy,
    }));

    return NextResponse.json(formattedSettings);
  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }

    console.error("Error fetching settings:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch settings",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/settings
 * Upsert a setting (create if not exists, update if exists)
 */
export async function PUT(request: NextRequest) {
  try {
    // Require SUPER_ADMIN role
    const session = requireRole(request, ["SUPER_ADMIN"]);

    const body: UpsertSettingRequest = await request.json();

    // Validate required fields
    if (!body.key || typeof body.key !== "string" || body.key.trim().length === 0) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: "key is required and must be a non-empty string",
        },
        { status: 400 }
      );
    }

    if (body.value === undefined) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: "value is required",
        },
        { status: 400 }
      );
    }

    // Validate key format (should use dot notation)
    const key = body.key.trim();
    if (!key.includes(".")) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: "key must use dot notation (e.g., 'site.name', 'contact.email')",
        },
        { status: 400 }
      );
    }

    // Convert value to Prisma JsonValue
    // Prisma accepts: string, number, boolean, null, object, array
    const jsonValue: Prisma.InputJsonValue = body.value === null ? Prisma.JsonNull : body.value;

    // Upsert setting (create if not exists, update if exists)
    const setting = await prisma.setting.upsert({
      where: {
        key: key,
      },
      update: {
        value: jsonValue,
        updatedBy: session.adminUserId,
      },
      create: {
        key: key,
        value: jsonValue,
        updatedBy: session.adminUserId,
      },
    });

    // Convert Prisma DateTime to ISO string
    const formattedSetting: Setting = {
      id: setting.id,
      key: setting.key,
      value: setting.value,
      updatedAt: setting.updatedAt.toISOString(),
      updatedBy: setting.updatedBy,
    };

    return NextResponse.json(formattedSetting);
  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }

    // Prisma unique constraint error (shouldn't happen with upsert, but handle anyway)
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: "A setting with this key already exists",
        },
        { status: 400 }
      );
    }

    console.error("Error upserting setting:", error);

    return NextResponse.json(
      {
        error: "Failed to upsert setting",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

