import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const guide = await db.ritualGuide.findUnique({
      where: { slug },
      include: {
        steps: { orderBy: { order: "asc" } },
        mantras: true,
        samagriItems: { orderBy: { order: "asc" } },
        dpbEntries: { where: { reviewStatus: "APPROVED" } },
        sources: { include: { source: true } },
        faqs: { include: { faq: true }, orderBy: { order: "asc" } },
      },
    });

    if (!guide) {
      return NextResponse.json({ error: "Ritual Guide not found" }, { status: 404 });
    }

    return NextResponse.json(guide);
  } catch (err) {
    console.error("GET public ritual guide by slug failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
