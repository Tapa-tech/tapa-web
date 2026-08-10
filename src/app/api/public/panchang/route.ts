import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const today = new Date();
    // Standardize to UTC Midnight to match the database format
    const todayUtc = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

    // Look for an entry matching today's date
    let panchang = await db.panchangEntry.findUnique({
      where: { date: todayUtc },
    });

    // If not found, fall back to the latest entry in the database
    if (!panchang) {
      panchang = await db.panchangEntry.findFirst({
        orderBy: { date: "desc" },
      });
    }

    // Query the next upcoming vrat (date >= today)
    const nextVrat = await db.vratEntry.findFirst({
      where: {
        date: { gte: todayUtc },
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json({
      panchang,
      nextVrat,
    });
  } catch (err) {
    console.error("GET public panchang failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
