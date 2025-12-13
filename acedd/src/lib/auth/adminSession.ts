/**
 * Admin Session Management
 * 
 * Handles session creation, validation, and cookie management for admin authentication.
 * Uses HMAC-SHA256 signed cookies to store session data securely.
 * 
 * Cookie format: base64(payload).hex(hmac)
 * - Payload: base64 encoded JSON session data
 * - HMAC: SHA-256 HMAC signature of the payload using SESSION_SECRET
 */

import { cookies } from "next/headers";
import crypto from "crypto";
import type { AdminRole } from "@/lib/types/admin";

export interface AdminSession {
  adminUserId: string;
  role: AdminRole;
  email: string;
  name: string;
  issuedAt: number; // Unix timestamp (seconds) - when the session was created/refreshed
}

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
 * Encrypt and sign session data
 * Format: base64(payload).hex(hmac)
 */
function encryptSession(session: AdminSession): string {
  const sessionData = JSON.stringify(session);
  const payload = Buffer.from(sessionData).toString("base64");
  const signature = generateSignature(payload);
  return `${payload}.${signature}`;
}

/**
 * Decrypt and verify session data
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
 * Create a session cookie with admin user data
 */
export async function createSession(session: AdminSession): Promise<void> {
  const cookieStore = await cookies();
  // Ensure issuedAt is set
  const sessionWithTimestamp: AdminSession = {
    ...session,
    issuedAt: session.issuedAt || Math.floor(Date.now() / 1000),
  };
  const encrypted = encryptSession(sessionWithTimestamp);
  
  cookieStore.set(SESSION_COOKIE_NAME, encrypted, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

/**
 * Get the current admin session from cookies
 */
export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  
  if (!sessionCookie?.value) {
    return null;
  }
  
  return decryptSession(sessionCookie.value);
}

/**
 * Delete the admin session cookie
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Check if user has required role
 */
export function hasRole(session: AdminSession | null, requiredRole: AdminRole): boolean {
  if (!session) return false;
  
  // SUPER_ADMIN has access to everything
  if (session.role === "SUPER_ADMIN") return true;
  
  // ADMIN can access ADMIN-level resources
  if (requiredRole === "ADMIN" && session.role === "ADMIN") return true;
  
  return false;
}
