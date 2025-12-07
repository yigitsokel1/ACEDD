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
import { getDashboardStats } from "@/lib/dashboard/getDashboardStats";

export async function GET(request: NextRequest) {
  try {
    // Require admin role
    requireRole(request, ["SUPER_ADMIN", "ADMIN"]);

    // Get dashboard stats from helper/service layer
    const stats = await getDashboardStats();

    return NextResponse.json(stats);
  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }

    console.error("Error fetching dashboard data:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorDetails = error instanceof Error ? error.stack : String(error);

    console.error("Error details:", errorDetails);

    return NextResponse.json(
      {
        error: "Failed to fetch dashboard data",
        message: errorMessage,
        ...(process.env.NODE_ENV === "development" && { details: errorDetails }),
      },
      { status: 500 }
    );
  }
}
