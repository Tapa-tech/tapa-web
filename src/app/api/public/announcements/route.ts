import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const now = new Date();
    
    const announcements = await db.announcementMessage.findMany({
      where: {
        OR: [
          { isActive: true },
          {
            AND: [
              { startDate: { lte: now } },
              { endDate: { gte: now } }
            ]
          }
        ]
      },
      orderBy: [
        { priority: "desc" },
        { createdAt: "desc" }
      ],
      take: 1
    });

    if (announcements.length === 0) {
      return NextResponse.json({ message: "" });
    }

    return NextResponse.json(announcements[0]);
  } catch (err) {
    console.error("GET public announcements failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
