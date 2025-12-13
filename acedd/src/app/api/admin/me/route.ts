/**
 * API Route: /api/admin/me
 * 
 * GET /api/admin/me
 * - Returns current admin user info from session
 * - Verifies user exists in database and is active (CRITICAL: only check on first access)
 * - Refreshes cookie if older than 30 minutes
 * - Returns: { user: { id, name, email, role } } or 401
 * 
 * OPTIMIZATION: This is the ONLY endpoint that performs database verification.
 * Called once per page load by AdminLayout. All other API routes use cookie-only auth.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest, createAuthErrorResponse } from "@/lib/auth/adminAuth";
import { prisma } from "@/lib/db";
import { logErrorSecurely } from "@/lib/utils/secureLogging";

export async function GET(request: NextRequest) {
  try {
    // Get session from cookie (no database check yet)
    const session = getAdminFromRequest(request);
    
    if (!session) {
      return createAuthErrorResponse("UNAUTHORIZED");
    }
    
    // CRITICAL: Verify user exists in database and is active
    // This is the ONLY place we check database (optimization)
    const adminUser = await prisma.adminUser.findUnique({
      where: { id: session.adminUserId },
      select: { id: true, isActive: true, role: true, email: true, name: true },
    });
    
    if (!adminUser) {
      // User doesn't exist (may have been deleted)
      return createAuthErrorResponse("UNAUTHORIZED");
    }
    
    if (!adminUser.isActive) {
      // User exists but is deactivated
      return createAuthErrorResponse("UNAUTHORIZED");
    }
    
    // Verify role matches (in case role was changed after session creation)
    // This prevents privilege escalation
    if (adminUser.role !== session.role) {
      return createAuthErrorResponse("UNAUTHORIZED");
    }
    
    // Update session with latest user data (in case name/email changed)
    const updatedSession = {
      ...session,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role,
    };
    
    // Refresh cookie if older than 30 minutes
    const response = NextResponse.json({
      user: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      },
    });
    
    // Refresh cookie if older than 30 minutes (update issuedAt timestamp)
    const now = Math.floor(Date.now() / 1000);
    const cookieAge = now - (session.issuedAt || 0);
    const REFRESH_INTERVAL = 60 * 30; // 30 minutes
    const needsRefresh = cookieAge >= REFRESH_INTERVAL;
    
    if (needsRefresh) {
      const refreshedSession = {
        ...updatedSession,
        issuedAt: now,
      };
      
      // Manually set refreshed cookie in response (API route context)
      const SESSION_COOKIE_NAME = "admin_session";
      const SESSION_SECRET = process.env.SESSION_SECRET || "change-me-in-production";
      const crypto = await import("crypto");
      
      const sessionData = JSON.stringify(refreshedSession);
      const payload = Buffer.from(sessionData).toString("base64");
      const signature = crypto.default
        .createHmac("sha256", SESSION_SECRET)
        .update(payload)
        .digest("hex");
      const encrypted = `${payload}.${signature}`;
      
      response.cookies.set(SESSION_COOKIE_NAME, encrypted, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });
    }
    
    return response;
  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }

    logErrorSecurely("[ERROR][API][ADMIN][ME]", error);

    return NextResponse.json(
      {
        error: "Kullanıcı bilgileri alınırken bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
      },
      { status: 500 }
    );
  }
}
