import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth/admin";

export async function GET(req: NextRequest) {
  const admin = await checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const announcements = await db.announcementMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(announcements);
  } catch (err) {
    console.error("GET admin announcements failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { message, isActive, startDate, endDate, priority } = body;

    if (!message) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 });
    }

    if (isActive) {
      // Deactivate other announcements
      await db.announcementMessage.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    const created = await db.announcementMessage.create({
      data: {
        message,
        isActive: !!isActive,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        priority: priority ? parseInt(priority) : 0,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("POST admin announcement failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
