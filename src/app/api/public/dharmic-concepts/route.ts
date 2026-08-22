import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const concepts = await db.dharmicConcept.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(concepts);
  } catch (err) {
    console.error("GET public concepts failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
