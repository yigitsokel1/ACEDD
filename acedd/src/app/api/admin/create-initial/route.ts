/**
 * API Route: /api/admin/create-initial
 * 
 * POST /api/admin/create-initial
 * - Body: { email: string, password: string, name: string, role?: "SUPER_ADMIN" | "ADMIN" }
 * - Returns: { success: true, user: { id, email, name, role } } or error
 * 
 * ⚠️ SECURITY NOTE: This endpoint should be protected or removed after initial setup.
 * Only use this for creating the first admin user. Consider adding IP whitelist or
 * environment variable check in production.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { logErrorSecurely } from "@/lib/utils/secureLogging";

// Security check: Only allow if explicitly enabled (production-safe default)
// Default: false (even in development, use npm run create-admin instead)
const ALLOW_CREATE_INITIAL = process.env.ALLOW_CREATE_INITIAL === "true";

export async function POST(request: NextRequest) {
  // Security check
  if (!ALLOW_CREATE_INITIAL) {
    return NextResponse.json(
      { error: "Bu endpoint şu anda devre dışı. Lütfen script kullanın: npm run create-admin" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { email, password, name, role = "SUPER_ADMIN" } = body;

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, şifre ve isim gereklidir" },
        { status: 400 }
      );
    }

    if (typeof email !== "string" || typeof password !== "string" || typeof name !== "string") {
      return NextResponse.json(
        { error: "Geçersiz format" },
        { status: 400 }
      );
    }

    // Validate role
    if (role !== "SUPER_ADMIN" && role !== "ADMIN") {
      return NextResponse.json(
        { error: "Rol SUPER_ADMIN veya ADMIN olmalıdır" },
        { status: 400 }
      );
    }

    // Validate email format (basic)
    if (!email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { error: "Geçersiz email formatı" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Şifre en az 6 karakter olmalıdır" },
        { status: 400 }
      );
    }

    // Check if admin user already exists
    const existingUser = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu email adresi ile zaten bir admin kullanıcısı mevcut" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create admin user
    const adminUser = await prisma.adminUser.create({
      data: {
        email: email.toLowerCase().trim(),
        name: name.trim(),
        passwordHash,
        role: role as "SUPER_ADMIN" | "ADMIN",
        isActive: true,
      },
    });

    // Return user data (without password hash)
    return NextResponse.json({
      success: true,
      message: "Admin kullanıcısı başarıyla oluşturuldu",
      user: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
        isActive: adminUser.isActive,
      },
    });
  } catch (error) {
    logErrorSecurely("[ERROR][API][ADMIN][CREATE_INITIAL]", error);
    return NextResponse.json(
      { error: "Admin kullanıcısı oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}
