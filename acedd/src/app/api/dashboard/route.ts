/**
 * API Route: /api/dashboard
 * 
 * GET /api/dashboard
 * - Returns: Dashboard data (stats, recent applications, members, messages, events)
 * - Auth: Required (SUPER_ADMIN or ADMIN)
 * 
 * Sprint 9: Refactored to use helper/service layer (getDashboardStats)
 */

import { NextRequest, NextResponse } from "next/server";
import { requireRole, createAuthErrorResponse } from "@/lib/auth/adminAuth";
import { logErrorSecurely } from "@/lib/utils/secureLogging";
import { getDashboardStats } from "@/lib/dashboard/getDashboardStats";

export async function GET(request: NextRequest) {
  try {
    // Require admin role (GET operation - no database check needed for performance)
    requireRole(request, ["SUPER_ADMIN", "ADMIN"]);

    // Get dashboard stats from helper/service layer
    const stats = await getDashboardStats();

    return NextResponse.json(stats);
  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }

    logErrorSecurely("[ERROR][API][DASHBOARD][GET]", error);

    return NextResponse.json(
      {
        error: "Dashboard verileri yüklenirken bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
      },
      { status: 500 }
    );
  }
}
