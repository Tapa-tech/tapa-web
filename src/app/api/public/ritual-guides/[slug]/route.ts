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

    // Resolve Deep-Dive concept
    let deepDiveConcept = null;
    if (guide.deepDiveConceptId) {
      deepDiveConcept = await db.dharmicConcept.findUnique({
        where: { id: guide.deepDiveConceptId },
      });
    }

    // Resolve Related Concepts
    let resolvedRelatedConcepts: unknown[] = [];
    if (guide.relatedConcepts) {
      try {
        const conceptIds = typeof guide.relatedConcepts === "string" 
          ? JSON.parse(guide.relatedConcepts) 
          : guide.relatedConcepts;
        if (Array.isArray(conceptIds) && conceptIds.length > 0) {
          resolvedRelatedConcepts = await db.dharmicConcept.findMany({
            where: { id: { in: conceptIds } },
          });
        }
      } catch (e) {
        console.error("Failed to resolve related concepts:", e);
      }
    }

    // Resolve Related Guides
    let resolvedRelatedGuides: unknown[] = [];
    if (guide.relatedRitualGuides) {
      try {
        const guideIds = typeof guide.relatedRitualGuides === "string" 
          ? JSON.parse(guide.relatedRitualGuides) 
          : guide.relatedRitualGuides;
        if (Array.isArray(guideIds) && guideIds.length > 0) {
          resolvedRelatedGuides = await db.ritualGuide.findMany({
            where: { id: { in: guideIds } },
            select: { id: true, title: true, slug: true, category: true }
          });
        }
      } catch (e) {
        console.error("Failed to resolve related guides:", e);
      }
    }

    const payload = {
      ...guide,
      deepDiveConcept,
      resolvedRelatedConcepts,
      resolvedRelatedGuides,
    };

    return NextResponse.json(payload);
  } catch (err) {
    console.error("GET public ritual guide by slug failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
