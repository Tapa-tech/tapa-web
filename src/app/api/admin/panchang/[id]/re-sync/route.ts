import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth/admin";
import { fetchPanchangData } from "@/lib/panchang/provider";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const entry = await db.panchangEntry.findUnique({
      where: { id: params.id },
    });

    if (!entry) {
      return NextResponse.json({ error: "Panchang entry not found" }, { status: 404 });
    }

    // Call provider to fetch fresh astronomical variables
    const data = await fetchPanchangData(entry.date, entry.city);

    // Update entry in database, resetting override tracking variables
    const updated = await db.panchangEntry.update({
      where: { id: entry.id },
      data: {
        ...data,
        dataSource: "AUTO_SYNCED",
        syncedAt: new Date(),
        overriddenBy: null,
        overriddenAt: null,
      },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error(`POST re-sync for entry ${params.id} failed:`, err);
    return NextResponse.json(
      { error: err.message || "Failed to re-sync panchang data" },
      { status: 500 }
    );
  }
}
