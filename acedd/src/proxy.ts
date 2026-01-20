/**
 * Next.js Proxy (eski middleware.ts — Next 16)
 *
 * Admin rotalarını korur: geçerli admin oturumu ve rol kontrolü.
 * Oturumsuz kullanıcı → /admin-login, yetkisiz → /admin?error=unauthorized
 *
 * Sprint 6: HMAC-SHA256 imza doğrulama (Edge Runtime: Web Crypto API)
 * Sprint 14.7: Rol tabanlı erişim
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "change-me-in-production";

/**
 * Sayfa bazlı yetkiler (Edge uyumluluk için inline; rolePermissions.ts ile uyumlu)
 */
const PAGE_PERMISSIONS: Record<string, string[]> = {
  "/admin": ["SUPER_ADMIN", "ADMIN"],
  "/admin/duyurular": ["SUPER_ADMIN", "ADMIN"],
  "/admin/etkinlikler": ["SUPER_ADMIN", "ADMIN"],
  "/admin/uyeler": ["SUPER_ADMIN", "ADMIN"],
  "/admin/burs-basvurulari": ["SUPER_ADMIN", "ADMIN"],
  "/admin/iletisim-mesajlari": ["SUPER_ADMIN", "ADMIN"],
  "/admin/ayarlar": ["SUPER_ADMIN"],
};

function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function generateSignature(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    stringToUint8Array(SESSION_SECRET).buffer as ArrayBuffer,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    stringToUint8Array(payload).buffer as ArrayBuffer
  );
  return arrayBufferToHex(sig);
}

async function verifySignature(payload: string, signature: string): Promise<boolean> {
  const expected = await generateSignature(payload);
  if (expected.length !== signature.length) return false;
  let r = 0;
  for (let i = 0; i < expected.length; i++) r |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  return r === 0;
}

function base64Decode(str: string): string {
  try {
    return atob(str);
  } catch {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let out = "";
    str = str.replace(/[^A-Za-z0-9+/]/g, "");
    for (let i = 0; i < str.length; ) {
      const a = chars.indexOf(str[i++]);
      const b = chars.indexOf(str[i++]);
      const c = chars.indexOf(str[i++]);
      const d = chars.indexOf(str[i++]);
      const n = (a << 18) | (b << 12) | (c << 6) | d;
      out += String.fromCharCode((n >> 16) & 255);
      if (c !== 64) out += String.fromCharCode((n >> 8) & 255);
      if (d !== 64) out += String.fromCharCode(n & 255);
    }
    return out;
  }
}

async function getSessionFromCookie(
  sessionCookie: string | undefined
): Promise<{ role: string; adminUserId: string; email: string; name: string } | null> {
  if (!sessionCookie) return null;
  try {
    const parts = sessionCookie.split(".");
    if (parts.length !== 2) return null;
    const [payload, signature] = parts;
    if (!(await verifySignature(payload, signature))) return null;
    const session = JSON.parse(base64Decode(payload));
    if (
      typeof session?.adminUserId === "string" &&
      typeof session?.role === "string" &&
      typeof session?.email === "string" &&
      typeof session?.name === "string"
    ) {
      return { role: session.role, adminUserId: session.adminUserId, email: session.email, name: session.name };
    }
    return null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin-login") {
      const res = NextResponse.next();
      res.headers.set("x-pathname", pathname);
      return res;
    }

    const session = await getSessionFromCookie(request.cookies.get(SESSION_COOKIE_NAME)?.value);
    if (!session) {
      const url = new URL("/admin-login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    const roles = PAGE_PERMISSIONS[pathname];
    if (roles && session.role !== "SUPER_ADMIN" && !roles.includes(session.role)) {
      const url = new URL("/admin", request.url);
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }
  }

  const res = NextResponse.next();
  res.headers.set("x-pathname", pathname);
  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
