"use client";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

interface VratEntry {
  id: string;
  name: string;
  date: string | Date;
  category: string;
  description?: string | null;
  linkedGuideId?: string | null;
  tithiDetail?: string;
}

// Dynamic helper to get month details in UTC (to prevent local timezone offsets)
const getMonthDetails = (year: number, monthIndex: number) => {
  const firstDay = new Date(Date.UTC(year, monthIndex, 1));
  const startWeekday = firstDay.getUTCDay();
  const lastDay = new Date(Date.UTC(year, monthIndex + 1, 0));
  const totalDays = lastDay.getUTCDate();
  return { startWeekday, totalDays };
};

export async function downloadPanchangPdf(
  type: "calendar" | "vrat" | "festival",
  city: string = "Delhi-NCR",
  calendarSystem: "Purnimanta" | "Amanta" = "Purnimanta",
  preloadedVrats?: VratEntry[],
  currentFilter: string = "All"
) {
  try {
    let vrats = preloadedVrats || [];

    // If no preloaded data, fetch it dynamically from the public API
    if (vrats.length === 0) {
      const res = await fetch("/api/public/panchang");
      if (res.ok) {
        const data = await res.json();
        vrats = data.vratEntries || [];
      }
    }

    // Dynamic import to prevent SSR errors in Next.js
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF("p", "pt", "a4");

    const fillPageBg = (d: InstanceType<typeof jsPDF>) => {
      d.setFillColor(242, 237, 228); // Theme cream #F2EDE4
      d.rect(0, 0, 595.28, 841.89, "F");
    };

    const addPageWithBg = (d: InstanceType<typeof jsPDF>) => {
      d.addPage();
      fillPageBg(d);
    };

    fillPageBg(doc);

    if (type === "calendar") {
      // ----------------------------------------------------
      // LAYOUT: Year at a Glance (12-Month Grid)
      // ----------------------------------------------------
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(160, 120, 0); // Gold
      doc.text("TAPA PANCHANG", 35, 45);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(44, 32, 16); // Dark Charcoal
      doc.text("2026 Calendar", 35, 65);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(138, 122, 104); // Subtext
      doc.text(`Computed for ${city} · ${calendarSystem} System`, 35, 80);

      // Grid Configuration: 3 columns x 4 rows
      const startX = 35;
      const startY = 100;
      const colWidth = 160;
      const rowHeight = 132;
      const colGap = 22.5;
      const rowGap = 15;

      for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
        const col = monthIdx % 3;
        const row = Math.floor(monthIdx / 3);

        const x = startX + col * (colWidth + colGap);
        const y = startY + row * (rowHeight + rowGap);

        // Draw Card Background
        doc.setFillColor(255, 255, 255); // White
        doc.setDrawColor(232, 224, 208); // Subtle border #E8E0D0
        doc.rect(x, y, colWidth, rowHeight, "FD");

        // Month Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(44, 32, 16);
        doc.text(MONTH_NAMES[monthIdx].toUpperCase(), x + colWidth / 2, y + 16, { align: "center" });

        // Weekdays Header
        doc.setFont("helvetica", "normal");
        doc.setFontSize(6);
        doc.setTextColor(138, 122, 104);
        const wSpacing = colWidth / 7;
        for (let w = 0; w < 7; w++) {
          doc.text(WEEKDAYS[w], x + w * wSpacing + wSpacing / 2, y + 28, { align: "center" });
        }

        // Sub-divider line
        doc.setDrawColor(240, 232, 216);
        doc.line(x + 6, y + 32, x + colWidth - 6, y + 32);

        // Render Calendar Numbers
        const { startWeekday, totalDays } = getMonthDetails(2026, monthIdx);

        for (let d = 1; d <= totalDays; d++) {
          const gridCell = d - 1 + startWeekday;
          const c = gridCell % 7;
          const r = Math.floor(gridCell / 7);

          const dateX = x + c * wSpacing + wSpacing / 2;
          const dateY = y + 43 + r * 13.5;

          // Check if this date has Vrats or Festivals
          const dayVrats = vrats.filter(v => {
            const vDate = new Date(v.date);
            return vDate.getUTCFullYear() === 2026 && vDate.getUTCMonth() === monthIdx && vDate.getUTCDate() === d;
          });

          const isFestival = dayVrats.some(v => v.linkedGuideId || !["Ekadashi", "Pradosh", "Chaturthi", "Purnima", "Amavasya"].includes(v.category));
          const isVrat = dayVrats.length > 0 && !isFestival;

          if (isFestival) {
            // Draw Gold highlight circle
            doc.setFillColor(232, 160, 32);
            doc.circle(dateX, dateY - 2, 5.5, "F");
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
          } else if (isVrat) {
            // Draw Pink highlight circle
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

      // Legend & Footnote
      const legendY = 705;
      doc.setDrawColor(208, 198, 182);
      doc.line(startX, legendY, startX + 525, legendY);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(44, 32, 16);
      doc.text("CALENDAR KEY", startX, legendY + 16);

      // Pink Vrat Dot
      doc.setFillColor(253, 6, 109);
      doc.circle(startX + 6, legendY + 30, 4, "F");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(92, 78, 54);
      doc.text("Major Vrat (Ekadashi, Pradosh, Chaturthi, Purnima, Amavasya)", startX + 16, legendY + 33);

      // Gold Festival Dot
      doc.setFillColor(232, 160, 32);
      doc.circle(startX + 290, legendY + 30, 4, "F");
      doc.text("Key Festival (Janmashtami, Ganesh Chaturthi, Hartalika Teej, etc.)", startX + 300, legendY + 33);

      // Footnote
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(138, 122, 104);
      doc.text("Generated via TAPA Web. Verified scriptural computations.", startX, legendY + 52);
      doc.text("Please cross-reference local sunrise/sunset offsets if observing strictly.", startX, legendY + 62);

      doc.save(`Tapa_Panchang_2026_Calendar_${city.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
    } else {
      // ----------------------------------------------------
      // LAYOUT: Detailed Lists (Vrat Calendar / Festival Calendar)
      // ----------------------------------------------------
      // Apply filters to data
      let filteredData = [...vrats];

      if (type === "vrat") {
        if (currentFilter !== "All") {
          filteredData = filteredData.filter(v =>
            v.category.toLowerCase().includes(currentFilter.toLowerCase()) ||
            v.name.toLowerCase().includes(currentFilter.toLowerCase())
          );
        }
      } else {
        // Festival Calendar Filters
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

      let pageNum = 1;
      let currentY = 110;
      const pageHeightLimit = 780;

      const drawHeader = (d: InstanceType<typeof jsPDF>, titleStr: string, subtitleStr: string) => {
        d.setFont("helvetica", "bold");
        d.setFontSize(8);
        d.setTextColor(160, 120, 0); // Gold
        d.text("TAPA PANCHANG · REPORT", 35, 45);

        d.setFont("helvetica", "bold");
        d.setFontSize(16);
        d.setTextColor(44, 32, 16);
        d.text(titleStr, 35, 65);

        d.setFont("helvetica", "normal");
        d.setFontSize(8.5);
        d.setTextColor(138, 122, 104);
        d.text(subtitleStr, 35, 80);
      };

      const drawTableHeaders = (d: InstanceType<typeof jsPDF>, y: number) => {
        // Header container bg
        d.setFillColor(44, 32, 16); // Dark primary
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
      const subtitle = `Filtered: ${currentFilter} · Computed for ${city} · Page ${pageNum}`;

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
            // Footer on current page
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7.5);
            doc.setTextColor(138, 122, 104);
            doc.text(`Page ${pageNum}`, 560, 810, { align: "right" });

            // Next page
            pageNum++;
            addPageWithBg(doc);
            
            // Draw headers on new page
            currentY = 100;
            drawHeader(doc, title, `Filtered: ${currentFilter} · Computed for ${city} · Page ${pageNum}`);
            drawTableHeaders(doc, currentY);
            currentY += 22;
          }

          // Alternating row styling
          if (idx % 2 === 0) {
            doc.setFillColor(255, 255, 255); // White
          } else {
            doc.setFillColor(247, 243, 237); // Very light grey-cream
          }
          doc.rect(35, currentY, 525, 22, "F");

          // Row line separator
          doc.setDrawColor(232, 224, 208);
          doc.line(35, currentY + 22, 560, currentY + 22);

          // Render Row Text
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

      // Final page footer
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(138, 122, 104);
      doc.text(`Page ${pageNum}`, 560, 810, { align: "right" });
      doc.text(`Printed from TAPA. Computed for ${city}.`, 35, 810);

      const filename = `${type === "vrat" ? "Vrat" : "Festival"}_Calendar_2026_${currentFilter.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
      doc.save(filename);
    }
  } catch (error) {
    console.error("Failed to generate PDF:", error);
  }
}
