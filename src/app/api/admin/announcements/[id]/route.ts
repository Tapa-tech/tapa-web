import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth/admin";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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
        where: {
          isActive: true,
          NOT: { id: params.id },
        },
        data: { isActive: false },
      });
    }

    const updated = await db.announcementMessage.update({
      where: { id: params.id },
      data: {
        message,
        isActive: !!isActive,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        priority: priority ? parseInt(priority) : 0,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT admin announcement failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await db.announcementMessage.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE admin announcement failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
