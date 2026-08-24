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
import "@/lib/panchang/provider"; 

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

    
    let panchang = await db.panchangEntry.findUnique({
      where: { date_city: { date: todayUtc, city: "Delhi-NCR" } },
    });

    
    if (!panchang) {
      panchang = await db.panchangEntry.findFirst({
        orderBy: { date: "desc" },
      });
    }

    let extendedPanchang = null;
    if (panchang) {
      const dateObj = new Date(panchang.date);
      const p = getPanchanga(dateObj, coords.lat, coords.lon, coords.timezone);
      
      const format12Hour = (d: Date) => {
        return d.toLocaleTimeString("en-US", {
          timeZone: coords.timezone,
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
      };

      const rahuKaal = (p && p.rahuKaal) ? `${format12Hour(p.rahuKaal.start)} - ${format12Hour(p.rahuKaal.end)}` : "7:32 AM - 9:07 AM";
      const yogaKarana = (p && p.yoga && p.karana) ? `${p.yoga.name} · ${p.karana.name}` : "Vriddhi · Kaulava";
      const sunrise = (p && p.sunrise) ? format12Hour(new Date(p.sunrise)) : panchang.sunrise;
      const sunset = (p && p.sunset) ? format12Hour(new Date(p.sunset)) : (panchang.sunset || "6:30 PM");

      extendedPanchang = {
        ...panchang,
        city,
        sunrise,
        sunset,
        rahuKaal,
        yogaKarana,
      };
    }

    
    const nextVrat = await db.vratEntry.findFirst({
      where: {
        date: { gte: todayUtc },
      },
      orderBy: { date: "asc" },
    });

    
    const vratEntries = await db.vratEntry.findMany({
      orderBy: { date: "asc" },
    });

    
    const panchangEntries = await db.panchangEntry.findMany({
      where: { city: "Delhi-NCR" },
      select: {
        date: true,
        paksha: true,
        tithi: true,
      }
    });

    const panchangMap = new Map<string, { paksha: string; tithi: string }>();
    for (const p of panchangEntries) {
      panchangMap.set(p.date.toISOString(), p);
    }

    const getHinduMonthAmanta2026 = (date: Date): string => {
      const time = date.getTime();
      const months = [
        { name: "Pausha", start: new Date("2025-12-20T00:00:00.000Z").getTime() },
        { name: "Magha", start: new Date("2026-01-19T00:00:00.000Z").getTime() },
        { name: "Phalguna", start: new Date("2026-02-18T00:00:00.000Z").getTime() },
        { name: "Chaitra", start: new Date("2026-03-19T00:00:00.000Z").getTime() },
        { name: "Vaishakha", start: new Date("2026-04-18T00:00:00.000Z").getTime() },
        { name: "Jyeshtha", start: new Date("2026-05-17T00:00:00.000Z").getTime() },
        { name: "Ashadha", start: new Date("2026-06-16T00:00:00.000Z").getTime() },
        { name: "Shravana", start: new Date("2026-07-15T00:00:00.000Z").getTime() },
        { name: "Bhadrapada", start: new Date("2026-08-13T00:00:00.000Z").getTime() },
        { name: "Ashwin", start: new Date("2026-09-12T00:00:00.000Z").getTime() },
        { name: "Kartika", start: new Date("2026-10-11T00:00:00.000Z").getTime() },
        { name: "Margashirsha", start: new Date("2026-11-10T00:00:00.000Z").getTime() },
        { name: "Pausha", start: new Date("2026-12-10T00:00:00.000Z").getTime() },
        { name: "Magha", start: new Date("2027-01-08T00:00:00.000Z").getTime() },
      ];

      for (let i = months.length - 1; i >= 0; i--) {
        if (time >= months[i].start) {
          return months[i].name;
        }
      }
      return "Pausha";
    };

    const extendedVratEntries = vratEntries.map(v => {
      const p = panchangMap.get(v.date.toISOString());
      let tithiDetail = `${v.category} Tithi`;
      if (p) {
        tithiDetail = `${getHinduMonthAmanta2026(v.date)} ${p.paksha} ${p.tithi}`;
      }
      return {
        ...v,
        tithiDetail,
      };
    });

    return NextResponse.json({
      panchang: extendedPanchang,
      nextVrat,
      vratEntries: extendedVratEntries,
    });
  } catch (err) {
    console.error("GET public panchang failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

