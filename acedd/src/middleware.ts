/**
 * Next.js Middleware
 * 
 * Protects admin routes by checking for valid admin session.
 * Redirects unauthenticated users to /admin-login
 * 
 * Sprint 6: Uses HMAC-SHA256 signature verification for session security
 * Note: Middleware runs in Edge Runtime, so we use Web Crypto API instead of Node.js crypto
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "change-me-in-production";

/**
 * Convert string to Uint8Array (for Web Crypto API)
 */
function stringToUint8Array(str: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

/**
 * Convert ArrayBuffer to hex string
 */
function arrayBufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Generate HMAC-SHA256 signature for session payload (Edge Runtime compatible)
 */
async function generateSignature(payload: string): Promise<string> {
  const keyData = stringToUint8Array(SESSION_SECRET);
  const payloadData = stringToUint8Array(payload);
  
  // Import key for HMAC (HMAC keys can be any length)
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  // Sign the payload
  const signature = await crypto.subtle.sign("HMAC", key, payloadData);
  
  // Convert to hex string
  return arrayBufferToHex(signature);
}

/**
 * Verify HMAC-SHA256 signature (Edge Runtime compatible)
 * Uses constant-time comparison to prevent timing attacks
 */
async function verifySignature(payload: string, signature: string): Promise<boolean> {
  const expectedSignature = await generateSignature(payload);
  
  // Constant-time comparison
  if (expectedSignature.length !== signature.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < expectedSignature.length; i++) {
    result |= expectedSignature.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  
  return result === 0;
}

/**
 * Decode base64 string (Edge Runtime compatible)
 */
function base64Decode(str: string): string {
  // Edge Runtime'da atob kullanabiliriz
  try {
    return atob(str);
  } catch {
    // Fallback: manual base64 decode
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let result = "";
    let i = 0;
    str = str.replace(/[^A-Za-z0-9\+\/]/g, "");
    
    while (i < str.length) {
      const encoded1 = chars.indexOf(str.charAt(i++));
      const encoded2 = chars.indexOf(str.charAt(i++));
      const encoded3 = chars.indexOf(str.charAt(i++));
      const encoded4 = chars.indexOf(str.charAt(i++));
      
      const bitmap = (encoded1 << 18) | (encoded2 << 12) | (encoded3 << 6) | encoded4;
      
      result += String.fromCharCode((bitmap >> 16) & 255);
      if (encoded3 !== 64) result += String.fromCharCode((bitmap >> 8) & 255);
      if (encoded4 !== 64) result += String.fromCharCode(bitmap & 255);
    }
    
    return result;
  }
}

/**
 * Session validation with HMAC signature verification
 * Format: base64(payload).hex(hmac)
 * Edge Runtime compatible
 */
async function isValidSession(sessionCookie: string | undefined): Promise<boolean> {
  if (!sessionCookie) return false;
  
  try {
    // Split payload and signature
    const parts = sessionCookie.split(".");
    if (parts.length !== 2) {
      return false; // Invalid format
    }

    const [payload, signature] = parts;

    // Verify signature
    if (!(await verifySignature(payload, signature))) {
      return false; // Invalid signature - possible tampering
    }

    // Decode payload (Edge Runtime compatible)
    const decoded = base64Decode(payload);
    const session = JSON.parse(decoded);
    
    // Validate session structure
    return (
      typeof session.adminUserId === "string" &&
      typeof session.role === "string" &&
      typeof session.email === "string" &&
      typeof session.name === "string"
    );
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (pathname.startsWith("/admin")) {
    // Allow /admin-login to be accessible
    if (pathname === "/admin-login") {
      return NextResponse.next();
    }

    // Check for session cookie
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie || !(await isValidSession(sessionCookie))) {
      // Redirect to login page
      const loginUrl = new URL("/admin-login", request.url);
      // Add redirect parameter to return to original page after login
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
