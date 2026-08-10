import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth/admin";

export async function GET(req: NextRequest) {
  const admin = await checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [guidesDraft, guidesPublished, concepts, panchang, pendingDpb] = await Promise.all([
      db.ritualGuide.count({ where: { status: "DRAFT" } }),
      db.ritualGuide.count({ where: { status: "PUBLISHED" } }),
      db.dharmicConcept.count(),
      db.panchangEntry.count(),
      db.dPBEntry.count({ where: { tag: "BHRANTI", reviewStatus: "PENDING_FOUNDER_REVIEW" } }),
    ]);

    return NextResponse.json({
      guidesDraft,
      guidesPublished,
      concepts,
      panchang,
      pendingDpb,
    });
  } catch (err) {
    console.error("GET dashboard metrics failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
