import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");

    if (id) {
      const kit = await db.ritualKit.findUnique({
        where: { id },
      });
      if (!kit) {
        return NextResponse.json({ error: "Ritual kit not found" }, { status: 404 });
      }
      return NextResponse.json(kit);
    }

    const kits = await db.ritualKit.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json(kits);
  } catch (err) {
    console.error("Public kits API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
