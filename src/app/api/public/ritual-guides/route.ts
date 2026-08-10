import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const guides = await db.ritualGuide.findMany({
      where: { status: "PUBLISHED" },
      include: {
        steps: { orderBy: { order: "asc" } },
        mantras: true,
        samagriItems: { orderBy: { order: "asc" } },
        dpbEntries: { where: { reviewStatus: "APPROVED" } },
        sources: { include: { source: true } },
        faqs: { include: { faq: true }, orderBy: { order: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(guides);
  } catch (err) {
    console.error("GET public ritual guides failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
