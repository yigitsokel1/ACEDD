/**
 * API Route: /api/admin/logout
 * 
 * POST /api/admin/logout
 * - Clears the admin session cookie
 * - Returns: { success: true }
 */

import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Create response
    const response = NextResponse.json({ success: true });
    
    // Delete session cookie
    response.cookies.delete("admin_session");
    
    return response;
  } catch (error) {
    const errorDetails = error instanceof Error ? error.stack : String(error);
    console.error("[ERROR][API][ADMIN][LOGOUT]", error);
    console.error("[ERROR][API][ADMIN][LOGOUT] Details:", errorDetails);

    return NextResponse.json(
      {
        error: "Çıkış işlemi sırasında bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
      },
      { status: 500 }
    );
  }
}
