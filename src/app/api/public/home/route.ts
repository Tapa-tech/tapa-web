import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as PanchangLib from "@bidyashish/panchang";

interface PanchangaResult {
  rahuKaal?: { start: Date; end: Date };
  yoga?: { name: string };
  karana?: { name: string };
}

const { getPanchanga } = PanchangLib as unknown as {
  getPanchanga: (date: Date, lat: number, lon: number, tz: string) => PanchangaResult;
};
import "@/lib/panchang/provider"; 

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

export async function GET() {
  try {
    const today = new Date();
    
    const todayUtc = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

    let featuredGuide = null;
    let featuredDate = todayUtc;
    let todayVrat = null;

    
    const vratForToday = await db.vratEntry.findFirst({
      where: {
        date: todayUtc,
        linkedGuideId: { not: null },
      },
    });

    if (vratForToday && vratForToday.linkedGuideId) {
      const guide = await db.ritualGuide.findUnique({
        where: { slug: vratForToday.linkedGuideId },
        include: {
          steps: { orderBy: { order: "asc" } },
          dpbEntries: { where: { reviewStatus: "APPROVED" } },
          sources: { include: { source: true } },
        },
      });

      if (guide && guide.status === "PUBLISHED") {
        featuredGuide = guide;
        featuredDate = todayUtc;
        todayVrat = vratForToday;
      }
    }

    
    if (!featuredGuide) {
      featuredGuide = await db.ritualGuide.findUnique({
        where: { slug: "sharad-navratri" },
        include: {
          steps: { orderBy: { order: "asc" } },
          dpbEntries: { where: { reviewStatus: "APPROVED" } },
          sources: { include: { source: true } },
        },
      });

      if (!featuredGuide) {
        featuredGuide = await db.ritualGuide.findFirst({
          where: { status: "PUBLISHED" },
          include: {
            steps: { orderBy: { order: "asc" } },
            dpbEntries: { where: { reviewStatus: "APPROVED" } },
            sources: { include: { source: true } },
          },
        });
      }

      if (featuredGuide) {
        if (featuredGuide.slug === "sharad-navratri") {
          
          featuredDate = new Date(Date.UTC(2026, 9, 11));
        } else {
          
          const matchingVrat = await db.vratEntry.findFirst({
            where: { linkedGuideId: featuredGuide.slug },
            orderBy: { date: "asc" },
          });
          if (matchingVrat) {
            featuredDate = new Date(matchingVrat.date);
            todayVrat = matchingVrat;
          } else {
            featuredDate = todayUtc;
          }
        }
      }
    }

    
    if (featuredDate && !todayVrat) {
      todayVrat = await db.vratEntry.findFirst({
        where: { date: featuredDate },
      });
    }

    
    let panchang = null;
    if (featuredDate) {
      panchang = await db.panchangEntry.findUnique({
        where: { date_city: { date: featuredDate, city: "Delhi-NCR" } },
      });
    }

    if (!panchang) {
      panchang = await db.panchangEntry.findFirst({
        orderBy: { date: "desc" },
      });
    }

    let extendedPanchang = null;
    if (panchang) {
      const coords = { lat: 28.6139, lon: 77.2090, timezone: "Asia/Kolkata" };
      const dateObj = new Date(panchang.date);
      let p = null;
      try {
        p = getPanchanga(dateObj, coords.lat, coords.lon, coords.timezone);
      } catch (err) {
        console.error("getPanchanga failed:", err);
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
      const yogaKarana = (p && p.yoga && p.karana) ? `${p.yoga.name} · ${p.karana.name}` : "Vriddhi · Kaulava";
      const hinduMonth = getHinduMonthAmanta2026(dateObj);

      extendedPanchang = {
        ...panchang,
        rahuKaal,
        yogaKarana,
        hinduMonth,
      };
    }

    
    const publishedGuides = await db.ritualGuide.findMany({
      where: { status: "PUBLISHED" },
      include: {
        dpbEntries: { where: { reviewStatus: "APPROVED" } },
      },
      orderBy: { createdAt: "asc" },
      take: 4,
    });

    const publishedGuidesCount = await db.ritualGuide.count({
      where: { status: "PUBLISHED" },
    });

    
    const activeBanner = await db.homepageBanner.findFirst({
      where: { isActive: true },
    });

    
    const nextVrat = await db.vratEntry.findFirst({
      where: {
        date: { gte: todayUtc },
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json({
      featuredGuide,
      featuredDate,
      panchang: extendedPanchang,
      todayVrat,
      publishedGuides,
      publishedGuidesCount,
      activeBanner,
      nextVrat,
    });
  } catch (err) {
    console.error("GET public home failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

