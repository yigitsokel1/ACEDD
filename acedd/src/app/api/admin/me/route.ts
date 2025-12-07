/**
 * API Route: /api/admin/me
 * 
 * GET /api/admin/me
 * - Returns current admin user info from session
 * - Returns: { user: { id, name, email, role } } or 401
 */

import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth/adminAuth";

export async function GET(request: NextRequest) {
  const session = getAdminFromRequest(request);
  
  if (!session) {
    return NextResponse.json(
      { error: "Oturum bulunamadı" },
      { status: 401 }
    );
  }
  
  return NextResponse.json({
    user: {
      id: session.adminUserId,
      name: session.name,
      email: session.email,
      role: session.role,
    },
  });
}
