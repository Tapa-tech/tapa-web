import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth/admin";
import { fetchPanchangData } from "@/lib/panchang/provider";
import { inngest } from "@/lib/inngest/client";

export async function POST(req: NextRequest) {
  const admin = await checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { date, triggerAll } = body;

    const city = "Delhi-NCR";

    if (triggerAll) {
      
      
      
      const DAYS_AHEAD = 45;
      
      
      (async () => {
        try {
          console.log(`[MANUAL SYNC ALL] Starting 45-day rolling sync in background...`);
          for (let i = 0; i < DAYS_AHEAD; i++) {
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + i);
            const dateOnly = new Date(Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()));

            const existing = await db.panchangEntry.findUnique({
              where: { date_city: { date: dateOnly, city } },
            });

            if (existing?.dataSource === "MANUAL_OVERRIDE") {
              console.log(`[MANUAL SYNC ALL] Skipping overridden entry for date ${dateOnly.toISOString().substring(0, 10)}`);
              continue;
            }

            try {
              const data = await fetchPanchangData(dateOnly, city);
              await db.panchangEntry.upsert({
                where: { date_city: { date: dateOnly, city } },
                create: {
                  ...data,
                  city,
                  date: dateOnly,
                  dataSource: "AUTO_SYNCED",
                  syncedAt: new Date(),
                },
                update: {
                  ...data,
                  dataSource: "AUTO_SYNCED",
                  syncedAt: new Date(),
                },
              });
            } catch (innerErr) {
              console.error(`[MANUAL SYNC ALL] Failed to sync ${dateOnly.toISOString().substring(0, 10)}:`, innerErr);
            }
          }
          console.log(`[MANUAL SYNC ALL] Completed 45-day rolling sync successfully.`);
        } catch (syncErr) {
          console.error(`[MANUAL SYNC ALL] Error during background sync:`, syncErr);
        }
      })();

      return NextResponse.json({
        success: true,
        message: "Rolling 45-day sync triggered in the background.",
      });
    }

    if (!date) {
      return NextResponse.json({ error: "date or triggerAll is required" }, { status: 400 });
    }

    const targetDate = new Date(date);
    const dateOnly = new Date(Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate()));

    const existing = await db.panchangEntry.findUnique({
      where: { date_city: { date: dateOnly, city } },
    });

    if (existing?.dataSource === "MANUAL_OVERRIDE") {
      return NextResponse.json(
        { error: "Cannot auto-sync a date that has been manually overridden by an admin." },
        { status: 400 }
      );
    }

    const data = await fetchPanchangData(dateOnly, city);

    const upserted = await db.panchangEntry.upsert({
      where: { date_city: { date: dateOnly, city } },
      create: {
        ...data,
        city,
        date: dateOnly,
        dataSource: "AUTO_SYNCED",
        syncedAt: new Date(),
      },
      update: {
        ...data,
        dataSource: "AUTO_SYNCED",
        syncedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully synced Panchang for ${dateOnly.toISOString().substring(0, 10)}.`,
      data: upserted,
    });
  } catch (err: any) {
    console.error("POST re-sync global failed:", err);
    return NextResponse.json(
      { error: err.message || "Failed to trigger sync" },
      { status: 500 }
    );
  }
}
