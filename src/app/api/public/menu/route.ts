import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as PanchangLib from "@bidyashish/panchang";

interface PanchangaResult {
  rahuKaal?: { start: Date; end: Date };
  yoga?: { name: string };
  karana?: { name: string };
  sunrise?: string | Date;
  sunset?: string | Date;
}

const { getPanchanga } = PanchangLib as unknown as {
  getPanchanga: (date: Date, lat: number, lon: number, tz: string) => PanchangaResult;
};
import "@/lib/panchang/provider"; // Ensures NOAA monkeypatch is loaded

export const dynamic = "force-dynamic";

const CITY_COORDS: Record<string, { lat: number; lon: number; timezone: string }> = {
  "Delhi-NCR": { lat: 28.6139, lon: 77.2090, timezone: "Asia/Kolkata" },
  "Mumbai": { lat: 19.0760, lon: 72.8777, timezone: "Asia/Kolkata" },
  "Bengaluru": { lat: 12.9716, lon: 77.5946, timezone: "Asia/Kolkata" },
  "Kolkata": { lat: 22.5726, lon: 88.3639, timezone: "Asia/Kolkata" },
  "Chennai": { lat: 13.0827, lon: 80.2707, timezone: "Asia/Kolkata" },
  "Pune": { lat: 18.5204, lon: 73.8567, timezone: "Asia/Kolkata" },
  "Hyderabad": { lat: 17.3850, lon: 78.4867, timezone: "Asia/Kolkata" },
  "Varanasi": { lat: 25.3176, lon: 82.9739, timezone: "Asia/Kolkata" },
};

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const city = searchParams.get("city") || "Delhi-NCR";
    const coords = CITY_COORDS[city] || CITY_COORDS["Delhi-NCR"];

    const today = new Date();
    const todayUtc = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

    // 1. Get today's basic metadata from DB
    let panchang = await db.panchangEntry.findUnique({
      where: { date_city: { date: todayUtc, city: "Delhi-NCR" } },
    });

    if (!panchang) {
      panchang = await db.panchangEntry.findFirst({
        orderBy: { date: "desc" },
      });
    }

    let todayPanchang = null;
    if (panchang) {
      const dateObj = new Date(panchang.date);
      let p = null;
      try {
        p = getPanchanga(dateObj, coords.lat, coords.lon, coords.timezone);
      } catch (err) {
        console.error("Menu getPanchanga failed:", err);
      }

      const format12Hour = (d: Date) => {
        return d.toLocaleTimeString("en-US", {
          timeZone: coords.timezone,
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
      };

      const rahuKaal = (p && p.rahuKaal) ? `${format12Hour(p.rahuKaal.start)} - ${format12Hour(p.rahuKaal.end)}` : "7:32 AM - 9:07 AM";
      const sunrise = (p && p.sunrise) ? format12Hour(new Date(p.sunrise)) : panchang.sunrise;
      const sunset = (p && p.sunset) ? format12Hour(new Date(p.sunset)) : (panchang.sunset || "6:30 PM");

      todayPanchang = {
        city,
        tithi: panchang.tithi,
        tithiSub: panchang.tithiSub,
        paksha: panchang.paksha,
        pakshaSub: panchang.pakshaSub,
        nakshatra: panchang.nakshatra,
        sunrise,
        sunset,
        rahuKaal,
      };
    }

    // 2. Fetch next 3 upcoming guides from VratEntry list
    const upcoming = await db.vratEntry.findMany({
      where: {
        date: { gte: todayUtc },
        linkedGuideId: { not: null },
      },
      orderBy: { date: "asc" },
      take: 3,
    });

    const upcomingGuides = [];
    for (const v of upcoming) {
      const guide = await db.ritualGuide.findUnique({
        where: { slug: v.linkedGuideId! },
        select: { title: true, slug: true, category: true },
      });
      if (guide) {
        upcomingGuides.push({
          name: v.name,
          date: v.date,
          slug: guide.slug,
          title: guide.title,
          category: guide.category,
        });
      }
    }

    // 3. Fetch 3 published Concepts
    const recentConcepts = await db.dharmicConcept.findMany({
      where: { status: "PUBLISHED" },
      select: { id: true, title: true, slug: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    // 4. Fetch 3 Ritual Kits
    const recentKits = await db.ritualKit.findMany({
      where: { inStock: true },
      select: { id: true, name: true, price: true },
      orderBy: { id: "asc" },
      take: 3,
    });

    return NextResponse.json({
      todayPanchang,
      upcomingGuides,
      recentConcepts,
      recentKits,
    });
  } catch (err) {
    console.error("GET public menu failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
