import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const concept = await db.dharmicConcept.findFirst({
      where: { 
        slug,
        status: "PUBLISHED" 
      },
      include: {
        dpbEntries: {
          where: { reviewStatus: "APPROVED" }
        }
      }
    });

    if (!concept) {
      return NextResponse.json({ error: "Dharmic Concept not found" }, { status: 404 });
    }

    return NextResponse.json(concept);
  } catch (err) {
    console.error("GET public concept by slug failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
