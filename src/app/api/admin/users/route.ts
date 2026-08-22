import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth/admin";

export async function GET(req: NextRequest) {
  try {
    // Enforce Super Admin check
    const payload = await checkAdminAuth(req);
    if (!payload || payload.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden: Super Admin access only" }, { status: 403 });
    }

    // Fetch all users with their download records
    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        phone: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        consentGiven: true,
        consentGivenAt: true,
        consentVersion: true,
        consentIpAddress: true,
        downloadRecords: {
          orderBy: { downloadedAt: "desc" },
          select: {
            id: true,
            contentType: true,
            contentTitle: true,
            downloadedAt: true,
            ipAddress: true,
            userAgent: true,
          },
        },
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Failed to load users directory:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
