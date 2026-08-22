import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { jsPDF } from "jspdf";
import { drawBrandedHeader, drawBrandedFooter } from "@/lib/pdf/branding";

export const dynamic = "force-dynamic";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

const getMonthDetails = (year: number, monthIndex: number) => {
  const firstDay = new Date(Date.UTC(year, monthIndex, 1));
  const startWeekday = firstDay.getUTCDay();
  const lastDay = new Date(Date.UTC(year, monthIndex + 1, 0));
  const totalDays = lastDay.getUTCDate();
  return { startWeekday, totalDays };
};

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

export async function GET(req: NextRequest) {
  try {
    // 1. Authenticate & Verify Consent
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!payload.consentGiven) {
      return NextResponse.json({ error: "Consent required to download panchang" }, { status: 403 });
    }

    // 2. Parse query parameters
    const searchParams = req.nextUrl.searchParams;
    const type = (searchParams.get("type") || "calendar") as "calendar" | "vrat" | "festival";
    const city = searchParams.get("city") || "Delhi-NCR";
    const calendarSystem = (searchParams.get("calendarSystem") || "Purnimanta") as "Purnimanta" | "Amanta";
    const currentFilter = searchParams.get("filter") || "All";

    // 3. Log Download Record
    await db.downloadRecord.create({
      data: {
        userId: payload.userId,
        contentType: "PANCHANG_CALENDAR",
        contentTitle: `2026 Panchang ${type.toUpperCase()} - ${city} (${calendarSystem})`,
        ipAddress: req.headers.get("x-forwarded-for") || "unknown",
        userAgent: req.headers.get("user-agent") || "unknown",
      },
    });

    // 4. Fetch dynamic Panchang & Vrat entries from DB
    const vratEntries = await db.vratEntry.findMany({
      orderBy: { date: "asc" },
    });

    const panchangEntries = await db.panchangEntry.findMany({
      where: { city },
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

    const extendedVratEntries = vratEntries.map(v => {
      const p = panchangMap.get(v.date.toISOString());
      let tithiDetail = `${v.category} Tithi`;
      if (p) {
        tithiDetail = `${getHinduMonthAmanta2026(v.date)} ${p.paksha} ${p.tithi}`;
      }
      return {
        id: v.id,
        name: v.name,
        date: v.date,
        category: v.category,
        linkedGuideId: v.linkedGuideId,
        tithiDetail,
      };
    });

    // 5. Generate PDF
    const doc = new jsPDF("p", "pt", "a4");
    const startX = 35;

    if (type === "calendar") {
      drawBrandedHeader(doc, "2026 Calendar", "Tapa Panchang");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(44, 32, 16); // Dark Charcoal
      doc.text("2026 Calendar", 35, 78);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(138, 122, 104);
      doc.text(`Computed for ${city} · ${calendarSystem} System`, 35, 93);

      const startY = 112;
      const colWidth = 160;
      const rowHeight = 132;
      const colGap = 22.5;
      const rowGap = 15;

      for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
        const col = monthIdx % 3;
        const row = Math.floor(monthIdx / 3);
        const x = startX + col * (colWidth + colGap);
        const y = startY + row * (rowHeight + rowGap);

        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(232, 224, 208);
        doc.rect(x, y, colWidth, rowHeight, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(44, 32, 16);
        doc.text(MONTH_NAMES[monthIdx].toUpperCase(), x + colWidth / 2, y + 16, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(6);
        doc.setTextColor(138, 122, 104);
        const wSpacing = colWidth / 7;
        for (let w = 0; w < 7; w++) {
          doc.text(WEEKDAYS[w], x + w * wSpacing + wSpacing / 2, y + 28, { align: "center" });
        }

        doc.setDrawColor(240, 232, 216);
        doc.line(x + 6, y + 32, x + colWidth - 6, y + 32);

        const { startWeekday, totalDays } = getMonthDetails(2026, monthIdx);

        for (let d = 1; d <= totalDays; d++) {
          const gridCell = d - 1 + startWeekday;
          const c = gridCell % 7;
          const r = Math.floor(gridCell / 7);
          const dateX = x + c * wSpacing + wSpacing / 2;
          const dateY = y + 43 + r * 13.5;

          const dayVrats = extendedVratEntries.filter(v => {
            const vDate = new Date(v.date);
            return vDate.getUTCFullYear() === 2026 && vDate.getUTCMonth() === monthIdx && vDate.getUTCDate() === d;
          });

          const isFestival = dayVrats.some(v => v.linkedGuideId || !["Ekadashi", "Pradosh", "Chaturthi", "Purnima", "Amavasya"].includes(v.category));
          const isVrat = dayVrats.length > 0 && !isFestival;

          if (isFestival) {
            doc.setFillColor(232, 160, 32);
            doc.circle(dateX, dateY - 2, 5.5, "F");
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
          } else if (isVrat) {
            doc.setFillColor(253, 6, 109);
            doc.circle(dateX, dateY - 2, 5.5, "F");
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
          } else {
            doc.setTextColor(44, 32, 16);
            doc.setFont("helvetica", "normal");
          }

          doc.setFontSize(7);
          doc.text(d.toString(), dateX, dateY, { align: "center" });
        }
      }

      const legendY = 708;
      doc.setDrawColor(208, 198, 182);
      doc.line(startX, legendY, startX + 525, legendY);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(44, 32, 16);
      doc.text("CALENDAR KEY", startX, legendY + 16);

      doc.setFillColor(253, 6, 109);
      doc.circle(startX + 6, legendY + 30, 4, "F");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(92, 78, 54);
      doc.text("Major Vrat (Ekadashi, Pradosh, Chaturthi, Purnima, Amavasya)", startX + 16, legendY + 33);

      doc.setFillColor(232, 160, 32);
      doc.circle(startX + 290, legendY + 30, 4, "F");
      doc.text("Key Festival (Janmashtami, Ganesh Chaturthi, Hartalika Teej, etc.)", startX + 300, legendY + 33);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(138, 122, 104);
      doc.text("Generated via TAPA Web. Verified scriptural computations.", startX, legendY + 52);
      doc.text("Please cross-reference local sunrise/sunset offsets if observing strictly.", startX, legendY + 62);

    } else {
      let filteredData = [...extendedVratEntries];

      if (type === "vrat") {
        if (currentFilter !== "All") {
          filteredData = filteredData.filter(v =>
            v.category.toLowerCase().includes(currentFilter.toLowerCase()) ||
            v.name.toLowerCase().includes(currentFilter.toLowerCase())
          );
        }
      } else {
        if (currentFilter !== "All festivals") {
          const filter = currentFilter.toLowerCase();
          if (filter === "shiva") {
            filteredData = filteredData.filter(v => v.name.toLowerCase().includes("shiva") || v.category.toLowerCase().includes("pradosh"));
          } else if (filter === "vishnu") {
            filteredData = filteredData.filter(v => v.name.toLowerCase().includes("vishnu") || v.category.toLowerCase().includes("ekadashi"));
          } else if (filter === "devi") {
            filteredData = filteredData.filter(v => v.name.toLowerCase().includes("devi") || v.name.toLowerCase().includes("teej") || v.name.toLowerCase().includes("navratri") || v.name.toLowerCase().includes("durga"));
          } else if (filter === "ganesha") {
            filteredData = filteredData.filter(v => v.name.toLowerCase().includes("ganesh") || v.category.toLowerCase().includes("chaturthi"));
          } else if (filter === "major only") {
            filteredData = filteredData.filter(v => v.linkedGuideId !== null && v.linkedGuideId !== undefined);
          }
        }
      }

      let currentY = 120;
      const pageHeightLimit = 770;

      const drawHeader = (d: InstanceType<typeof jsPDF>, titleStr: string, subtitleStr: string) => {
        drawBrandedHeader(d, titleStr, "Tapa Panchang · Report");

        d.setFont("helvetica", "bold");
        d.setFontSize(16);
        d.setTextColor(44, 32, 16);
        d.text(titleStr, 35, 78);

        d.setFont("helvetica", "normal");
        d.setFontSize(8.5);
        d.setTextColor(138, 122, 104);
        d.text(subtitleStr, 35, 93);
      };

      const drawTableHeaders = (d: InstanceType<typeof jsPDF>, y: number) => {
        d.setFillColor(44, 32, 16);
        d.rect(35, y, 525, 22, "F");

        d.setFont("helvetica", "bold");
        d.setFontSize(7.5);
        d.setTextColor(255, 255, 255);
        d.text("DATE", 45, y + 14);
        d.text("DAY", 105, y + 14);
        d.text("OBSERVANCE", 185, y + 14);
        d.text("TITHI / LUNAR DETAIL", 365, y + 14);
      };

      const title = type === "vrat" ? "2026 Vrat Calendar" : "Festival Calendar 2026";
      const subtitle = `Filtered: ${currentFilter} · Computed for ${city}`;

      drawHeader(doc, title, subtitle);
      drawTableHeaders(doc, currentY);
      currentY += 22;

      if (filteredData.length === 0) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(9);
        doc.setTextColor(138, 122, 104);
        doc.text("No observances found matching this filter.", 45, currentY + 30);
      } else {
        filteredData.forEach((vrat, idx) => {
          if (currentY + 22 > pageHeightLimit) {
            doc.addPage();
            currentY = 75;
            drawHeader(doc, title, subtitle);
            drawTableHeaders(doc, currentY);
            currentY += 22;
          }

          if (idx % 2 === 0) {
            doc.setFillColor(255, 255, 255);
          } else {
            doc.setFillColor(247, 243, 237);
          }
          doc.rect(35, currentY, 525, 22, "F");

          doc.setDrawColor(232, 224, 208);
          doc.line(35, currentY + 22, 560, currentY + 22);

          const dateObj = new Date(vrat.date);
          const dayVal = dateObj.getUTCDate();
          const monthVal = dateObj.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
          const dateStr = `${dayVal} ${monthVal}`;
          const weekdayStr = dateObj.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });

          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(44, 32, 16);
          doc.text(dateStr, 45, currentY + 14);

          doc.setFont("helvetica", "normal");
          doc.setTextColor(92, 78, 54);
          doc.text(weekdayStr, 105, currentY + 14);

          doc.setFont("helvetica", "bold");
          doc.setTextColor(44, 32, 16);
          doc.text(vrat.name, 185, currentY + 14);

          doc.setFont("helvetica", "normal");
          doc.setTextColor(138, 122, 104);
          const detail = vrat.tithiDetail || `${vrat.category} Tithi`;
          doc.text(detail, 365, currentY + 14);

          currentY += 22;
        });
      }
    }

    // Draw branded footers across all pages
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      drawBrandedFooter(doc, i, pageCount, `Printed from TAPA. Computed for ${city}.`);
    }

    const filename = `${type === "vrat" ? "Vrat" : type === "festival" ? "Festival" : "Tapa_Panchang"}_Calendar_2026_${currentFilter.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;

    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Failed to generate server PDF:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
