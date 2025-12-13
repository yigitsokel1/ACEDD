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
import { replaceFaviconOrLogo } from "@/modules/files/fileService";

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

    const errorDetails = error instanceof Error ? error.stack : String(error);
    console.error("[ERROR][API][SETTINGS][GET]", error);
    console.error("[ERROR][API][SETTINGS][GET] Details:", errorDetails);

    return NextResponse.json(
      {
        error: "Ayarlar yüklenirken bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
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
          error: "Ayar anahtarı zorunludur",
        },
        { status: 400 }
      );
    }

    if (body.value === undefined) {
      return NextResponse.json(
        {
          error: "Ayar değeri zorunludur",
        },
        { status: 400 }
      );
    }

    // Validate key format (should use dot notation)
    const key = body.key.trim();
    if (!key.includes(".")) {
      return NextResponse.json(
        {
          error: "Ayar anahtarı geçersiz format",
        },
        { status: 400 }
      );
    }

    // Sprint 17: Favicon/Logo değişiminde eski dosya temizleme
    let oldValue: string | null = null;
    if (key === "site.faviconUrl" || key === "site.logoUrl") {
      // Eski setting value'yu al
      const oldSetting = await prisma.setting.findUnique({
        where: { key },
        select: { value: true },
      });
      oldValue = oldSetting?.value && typeof oldSetting.value === "string" 
        ? oldSetting.value 
        : null;
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

    // Sprint 17: Favicon/Logo değişiminde eski dosya temizleme
    if ((key === "site.faviconUrl" || key === "site.logoUrl") && oldValue) {
      // Check if new value is a string (Prisma.JsonNull is treated as null)
      const newValue = jsonValue !== null && jsonValue !== (Prisma.JsonNull as any) && typeof jsonValue === "string" ? jsonValue : null;
      // Eğer yeni value farklı bir data URL ise (yeni dosya yüklendi)
      if (newValue && newValue !== oldValue && newValue.startsWith("data:")) {
        try {
          await replaceFaviconOrLogo(
            key as "site.faviconUrl" | "site.logoUrl",
            oldValue,
            newValue
          );
        } catch (cleanupError) {
          // Non-critical error
          console.error("[API][SETTINGS][PUT] Error cleaning up old favicon/logo:", cleanupError);
        }
      }
    }

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

    const errorDetails = error instanceof Error ? error.stack : String(error);
    console.error("[ERROR][API][SETTINGS][PUT]", error);
    console.error("[ERROR][API][SETTINGS][PUT] Details:", errorDetails);

    // Prisma unique constraint error (shouldn't happen with upsert, but handle anyway)
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        {
          error: "Bu ayar zaten mevcut",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Ayar kaydedilirken bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
      },
      { status: 500 }
    );
  }
}

