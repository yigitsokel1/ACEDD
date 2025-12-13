/**
 * API Route: /api/admin/logout
 * 
 * POST /api/admin/logout
 * - Clears the admin session cookie
 * - Returns: { success: true }
 */

import { NextResponse } from "next/server";
import { logErrorSecurely } from "@/lib/utils/secureLogging";

export async function POST() {
  try {
    // Create response
    const response = NextResponse.json({ success: true });
    
    // Delete session cookie
    response.cookies.delete("admin_session");
    
    return response;
  } catch (error) {
    logErrorSecurely("[ERROR][API][ADMIN][LOGOUT]", error);

    return NextResponse.json(
      {
        error: "Çıkış işlemi sırasında bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
      },
      { status: 500 }
    );
  }
}
