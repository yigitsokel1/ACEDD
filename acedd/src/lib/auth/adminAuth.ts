/**
 * Admin Authentication Helpers for API Routes
 * 
 * Provides utilities for extracting admin session from requests
 * and enforcing role-based access control in API routes.
 * 
 * OPTIMIZATION: Database verification is done only in /api/admin/me endpoint
 * (called once per page load by AdminLayout). All other API routes use
 * cookie-only authentication (requireRole) for performance.
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import type { AdminRole } from "@/lib/types/admin";
import type { AdminSession } from "./adminSession";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "change-me-in-production";

/**
 * Generate HMAC-SHA256 signature for session payload
 */
function generateSignature(payload: string): string {
  return crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("hex");
}

/**
 * Verify HMAC-SHA256 signature
 */
function verifySignature(payload: string, signature: string): boolean {
  const expectedSignature = generateSignature(payload);
  // Use timing-safe comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(signature, "hex"),
    Buffer.from(expectedSignature, "hex")
  );
}

/**
 * Decrypt and verify session from cookie value
 * Format: base64(payload).hex(hmac)
 * Returns null if signature is invalid or data is corrupted
 */
function decryptSession(encrypted: string): AdminSession | null {
  try {
    // Split payload and signature
    const parts = encrypted.split(".");
    if (parts.length !== 2) {
      return null; // Invalid format
    }

    const [payload, signature] = parts;

    // Verify signature
    if (!verifySignature(payload, signature)) {
      return null; // Invalid signature - possible tampering
    }

    // Decode payload
    const decoded = Buffer.from(payload, "base64").toString("utf-8");
    const session = JSON.parse(decoded) as AdminSession;
    
    // Validate session structure
    if (
      typeof session.adminUserId === "string" &&
      typeof session.role === "string" &&
      typeof session.email === "string" &&
      typeof session.name === "string"
    ) {
      // Backward compatibility: if issuedAt is missing, set it to now
      if (typeof session.issuedAt !== "number") {
        session.issuedAt = Math.floor(Date.now() / 1000);
      }
      return session;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Get admin session from request cookies
 * Returns null if no valid session found
 */
export function getAdminFromRequest(request: NextRequest): AdminSession | null {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  
  if (!sessionCookie) {
    return null;
  }
  
  return decryptSession(sessionCookie);
}

/**
 * Require admin authentication
 * Returns 401 if not authenticated
 */
export function requireAuth(request: NextRequest): AdminSession {
  const session = getAdminFromRequest(request);
  
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  
  return session;
}

/**
 * Require specific role(s)
 * Returns 403 if role doesn't match
 * 
 * @param request - NextRequest object
 * @param allowedRoles - Array of allowed roles
 * @returns AdminSession if authorized
 * @throws Error with "UNAUTHORIZED" or "FORBIDDEN" message
 */
export function requireRole(
  request: NextRequest,
  allowedRoles: AdminRole[]
): AdminSession {
  const session = requireAuth(request);
  
  // SUPER_ADMIN has access to everything
  if (session.role === "SUPER_ADMIN") {
    return session;
  }
  
  // Check if user's role is in allowed roles
  if (!allowedRoles.includes(session.role)) {
    throw new Error("FORBIDDEN");
  }
  
  return session;
}

/**
 * Check if user has required role (non-throwing version)
 */
export function hasRole(session: AdminSession | null, allowedRoles: AdminRole[]): boolean {
  if (!session) return false;
  
  // SUPER_ADMIN has access to everything
  if (session.role === "SUPER_ADMIN") return true;
  
  // Check if user's role is in allowed roles
  return allowedRoles.includes(session.role);
}

/**
 * Require admin authentication with database verification
 * 
 * @deprecated This function is no longer used. Database verification is now done
 * only in /api/admin/me endpoint (called once per page load). All other API routes
 * use requireRole() for performance (cookie-only auth).
 * 
 * CRITICAL: This function verifies that:
 * 1. Session cookie is valid (HMAC signature)
 * 2. User exists in database
 * 3. User is active
 * 
 * @param request - NextRequest object
 * @returns AdminSession if authenticated and user exists and is active
 * @throws Error with "UNAUTHORIZED" if session invalid, user not found, or user inactive
 */
export async function requireAuthWithDatabaseCheck(
  request: NextRequest
): Promise<AdminSession> {
  const session = getAdminFromRequest(request);
  
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  
  // Verify user exists in database and is active
  const adminUser = await prisma.adminUser.findUnique({
    where: { id: session.adminUserId },
    select: { id: true, isActive: true, role: true },
  });
  
  if (!adminUser) {
    // User doesn't exist (may have been deleted)
    throw new Error("UNAUTHORIZED");
  }
  
  if (!adminUser.isActive) {
    // User exists but is deactivated
    throw new Error("UNAUTHORIZED");
  }
  
  // Verify role matches (in case role was changed after session creation)
  // This prevents privilege escalation
  if (adminUser.role !== session.role) {
    throw new Error("UNAUTHORIZED");
  }
  
  return session;
}

/**
 * Require specific role(s) with database verification
 * 
 * @deprecated This function is no longer used. Database verification is now done
 * only in /api/admin/me endpoint (called once per page load). All other API routes
 * use requireRole() for performance (cookie-only auth).
 * 
 * CRITICAL: This function verifies that:
 * 1. Session cookie is valid (HMAC signature)
 * 2. User exists in database
 * 3. User is active
 * 4. User has required role
 * 
 * @param request - NextRequest object
 * @param allowedRoles - Array of allowed roles
 * @returns AdminSession if authorized
 * @throws Error with "UNAUTHORIZED" or "FORBIDDEN" message
 */
export async function requireRoleWithDatabaseCheck(
  request: NextRequest,
  allowedRoles: AdminRole[]
): Promise<AdminSession> {
  const session = await requireAuthWithDatabaseCheck(request);
  
  // SUPER_ADMIN has access to everything
  if (session.role === "SUPER_ADMIN") {
    return session;
  }
  
  // Check if user's role is in allowed roles
  if (!allowedRoles.includes(session.role)) {
    throw new Error("FORBIDDEN");
  }
  
  return session;
}

/**
 * Helper to create error response for auth failures
 */
export function createAuthErrorResponse(error: string): NextResponse {
  if (error === "UNAUTHORIZED") {
    return NextResponse.json(
      { error: "Oturum bulunamadı. Lütfen giriş yapın." },
      { status: 401 }
    );
  }
  
  if (error === "FORBIDDEN") {
    return NextResponse.json(
      { error: "Bu işlem için yetkiniz bulunmamaktadır." },
      { status: 403 }
    );
  }
  
  return NextResponse.json(
    { error: "Yetkilendirme hatası" },
    { status: 500 }
  );
}
