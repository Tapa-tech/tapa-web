import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth/admin";

export async function GET(req: NextRequest) {
  const admin = await checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const pendingReviews = await db.dPBEntry.findMany({
      where: {
        tag: "BHRANTI",
        reviewStatus: "PENDING_FOUNDER_REVIEW",
      },
      include: {
        ritualGuide: {
          select: {
            title: true,
          },
        },
        dharmicConcept: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(pendingReviews);
  } catch (err) {
    console.error("GET pending DPB reviews failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
