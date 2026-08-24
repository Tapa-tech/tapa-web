import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { jsPDF } from "jspdf";
import { drawBrandedHeader, drawBrandedFooter } from "@/lib/pdf/branding";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!payload.consentGiven) {
      return NextResponse.json({ error: "Consent required to download checklist" }, { status: 403 });
    }

    
    const guide = await db.ritualGuide.findUnique({
      where: { slug },
      include: {
        samagriItems: { orderBy: { order: "asc" } },
      },
    });

    if (!guide) {
      return NextResponse.json({ error: "Ritual Guide not found" }, { status: 404 });
    }

    
    await db.downloadRecord.create({
      data: {
        userId: payload.userId,
        contentType: "SAMAGRI_CHECKLIST",
        contentId: guide.id,
        contentTitle: `${guide.title} Samagri Checklist`,
        ipAddress: req.headers.get("x-forwarded-for") || "unknown",
        userAgent: req.headers.get("user-agent") || "unknown",
      },
    });

    
    const doc = new jsPDF("p", "pt", "a4");

    
    drawBrandedHeader(doc, `${guide.title} — Samagri Checklist`, `Checklist · ${guide.category}`);

    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(44, 32, 16); 
    doc.text(`${guide.title} — Checklist`, 35, 78);

    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(106, 90, 78);
    doc.text("Verify each item with scriptural reasons below before your pujan starts. Bring this list to your local store.", 35, 96);

    let currentY = 120;

    const drawTableHead = (d: jsPDF, y: number) => {
      d.setFillColor(44, 32, 16);
      d.rect(35, y, 525, 22, "F");

      d.setFont("helvetica", "bold");
      d.setFontSize(8);
      d.setTextColor(255, 255, 255);
      d.text("[  ]", 45, y + 14);
      d.text("SAMAGRI ITEM", 85, y + 14);
      d.text("FUNCTION / SCRIPTURAL RATIONALE", 225, y + 14);
    };

    
    drawTableHead(doc, currentY);
    currentY += 22;

    guide.samagriItems.forEach((item, idx) => {
      if (currentY + 28 > 770) {
        doc.addPage();
        drawBrandedHeader(doc, `${guide.title} — Samagri Checklist`, `Checklist · ${guide.category}`);
        currentY = 75;
        drawTableHead(doc, currentY);
        currentY += 22;
      }

      
      if (idx % 2 === 0) {
        doc.setFillColor(255, 255, 255);
      } else {
        doc.setFillColor(247, 243, 237);
      }
      doc.rect(35, currentY, 525, 24, "F");

      doc.setDrawColor(232, 224, 208);
      doc.line(35, currentY + 24, 560, currentY + 24);

      
      doc.setDrawColor(138, 122, 104);
      doc.rect(45, currentY + 6, 12, 12);

      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(44, 32, 16);
      doc.text(item.name, 85, currentY + 15);

      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(106, 90, 78);
      const splitFunc = doc.splitTextToSize(item.function, 310);
      doc.text(splitFunc, 225, currentY + 15);

      currentY += 24;
    });

    
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      drawBrandedFooter(doc, i, pageCount, "TAPA — The Scriptural Shopping Guide.");
    }

    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Tapa_Samagri_Checklist_${slug}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Failed to generate Server Checklist PDF:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
