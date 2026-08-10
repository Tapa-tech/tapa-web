import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // 1. Fetch featured guide (sawan-somwar)
    let featuredGuide = await db.ritualGuide.findUnique({
      where: { slug: "sawan-somwar" },
      include: {
        steps: { orderBy: { order: "asc" } },
        dpbEntries: { where: { reviewStatus: "APPROVED" } },
        sources: { include: { source: true } },
      },
    });

    // Fallback if sawan-somwar doesn't exist
    if (!featuredGuide) {
      featuredGuide = await db.ritualGuide.findFirst({
        where: { status: "PUBLISHED" },
        include: {
          steps: { orderBy: { order: "asc" } },
          dpbEntries: { where: { reviewStatus: "APPROVED" } },
          sources: { include: { source: true } },
        },
      });
    }

    // 2. Fetch latest published guides (up to 4) for the guides grid, excluding the featured one if possible
    const publishedGuides = await db.ritualGuide.findMany({
      where: {
        status: "PUBLISHED",
        NOT: featuredGuide ? { id: featuredGuide.id } : undefined,
      },
      include: {
        dpbEntries: { where: { reviewStatus: "APPROVED" } },
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    });

    return NextResponse.json({
      featuredGuide,
      publishedGuides,
    });
  } catch (err) {
    console.error("GET public home failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
