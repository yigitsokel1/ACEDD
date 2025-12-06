import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const announcementCount = await prisma.announcement.count();
    const adminUserCount = await prisma.adminUser.count();
    const eventCount = await prisma.event.count();

    return NextResponse.json({
      ok: true,
      announcements: announcementCount,
      adminUsers: adminUserCount,
      events: eventCount,
      message: "Prisma client is working correctly",
    });
  } catch (error) {
    console.error("Prisma test error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
