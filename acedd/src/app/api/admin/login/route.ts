/**
 * API Route: /api/admin/login
 * 
 * POST /api/admin/login
 * - Body: { email: string, password: string }
 * - Returns: { success: true, user: { id, name, email, role } } or error
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import type { AdminSession } from "@/lib/auth/adminSession";
import { logErrorSecurely } from "@/lib/utils/secureLogging";

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: "Geçersiz JSON formatı" },
        { status: 400 }
      );
    }
    
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email ve şifre gereklidir" },
        { status: 400 }
      );
    }

    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { error: "Geçersiz email veya şifre formatı" },
        { status: 400 }
      );
    }

    // Find admin user
    const adminUser = await prisma.adminUser.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!adminUser) {
      // Don't reveal if user exists or not (security best practice)
      return NextResponse.json(
        { error: "Email veya şifre hatalı" },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!adminUser.isActive) {
      return NextResponse.json(
        { error: "Hesabınız aktif değil. Lütfen yönetici ile iletişime geçin." },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, adminUser.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Email veya şifre hatalı" },
        { status: 401 }
      );
    }

    // Create session with issuedAt timestamp
    const session: AdminSession = {
      adminUserId: adminUser.id,
      role: adminUser.role,
      email: adminUser.email,
      name: adminUser.name,
      issuedAt: Math.floor(Date.now() / 1000), // Unix timestamp in seconds
    };

    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      },
    });

    // Set session cookie using createSession helper (HMAC-SHA256 signed)
    // Note: We need to manually set the cookie here since we're in an API route
    const SESSION_COOKIE_NAME = "admin_session";
    const SESSION_SECRET = process.env.SESSION_SECRET || "change-me-in-production";
    
    // Encrypt and sign session (Sprint 6: HMAC-SHA256)
    const sessionData = JSON.stringify(session);
    const payload = Buffer.from(sessionData).toString("base64");
    const signature = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(payload)
      .digest("hex");
    const encrypted = `${payload}.${signature}`;

    // Set session cookie
    response.cookies.set(SESSION_COOKIE_NAME, encrypted, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    logErrorSecurely("[ERROR][API][ADMIN][LOGIN]", error);

    return NextResponse.json(
      {
        error: "Giriş işlemi sırasında bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
      },
      { status: 500 }
    );
  }
}
