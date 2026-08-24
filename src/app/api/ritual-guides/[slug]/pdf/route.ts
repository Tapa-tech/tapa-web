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
      return NextResponse.json({ error: "Consent required to download guides" }, { status: 403 });
    }

    
    const guide = await db.ritualGuide.findUnique({
      where: { slug },
      include: {
        steps: { orderBy: { order: "asc" } },
        mantras: true,
        samagriItems: { orderBy: { order: "asc" } },
        sources: { include: { source: true } },
      },
    });

    if (!guide) {
      return NextResponse.json({ error: "Ritual Guide not found" }, { status: 404 });
    }

    
    await db.downloadRecord.create({
      data: {
        userId: payload.userId,
        contentType: "RITUAL_GUIDE_PDF",
        contentId: guide.id,
        contentTitle: guide.title,
        ipAddress: req.headers.get("x-forwarded-for") || "unknown",
        userAgent: req.headers.get("user-agent") || "unknown",
      },
    });

    
    const doc = new jsPDF("p", "pt", "a4");

    
    drawBrandedHeader(doc, guide.title, `Ritual Guide · ${guide.category}`);

    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(44, 32, 16); 
    doc.text(guide.title, 35, 78);

    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(106, 90, 78);
    const splitIntro = doc.splitTextToSize(guide.introText || "", 525);
    doc.text(splitIntro, 35, 96);

    let currentY = 96 + (splitIntro.length * 13) + 20;

    
    doc.setFillColor(250, 246, 236); 
    doc.setDrawColor(234, 223, 201); 
    doc.rect(35, currentY, 525, 80, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(200, 42, 84);
    doc.text("SANKALPA (RITUAL INTENT)", 45, currentY + 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(44, 32, 16);
    
    doc.text(guide.sankalpaQuote || "", 45, currentY + 36);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(138, 122, 104);
    const splitSankalpa = doc.splitTextToSize(guide.sankalpaBody || "", 505);
    doc.text(splitSankalpa, 45, currentY + 54);

    currentY += 105;

    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(44, 32, 16);
    doc.text("Ritual Steps & Performance", 35, currentY);
    currentY += 15;

    guide.steps.forEach((step) => {
      if (currentY + 60 > 770) {
        doc.addPage();
        drawBrandedHeader(doc, guide.title, `Ritual Guide · ${guide.category}`);
        currentY = 75;
      }

      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(200, 42, 84);
      doc.text(`${step.order}. ${step.title}`, 35, currentY);
      currentY += 14;

      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(44, 32, 16);
      const splitDesc = doc.splitTextToSize(step.description, 525);
      doc.text(splitDesc, 35, currentY);
      currentY += (splitDesc.length * 11) + 6;

      
      if (step.note) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8.5);
        doc.setTextColor(160, 120, 0); 
        const splitNote = doc.splitTextToSize(`Note: ${step.note}`, 510);
        doc.text(splitNote, 45, currentY);
        currentY += (splitNote.length * 11) + 12;
      } else {
        currentY += 6;
      }
    });

    
    if (guide.mantras.length > 0) {
      if (currentY + 100 > 770) {
        doc.addPage();
        drawBrandedHeader(doc, guide.title, `Ritual Guide · ${guide.category}`);
        currentY = 75;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(44, 32, 16);
      doc.text("Sacred Mantras", 35, currentY);
      currentY += 20;

      guide.mantras.forEach((mantra) => {
        if (currentY + 50 > 770) {
          doc.addPage();
          drawBrandedHeader(doc, guide.title, `Ritual Guide · ${guide.category}`);
          currentY = 75;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(44, 32, 16);
        
        doc.text(mantra.devanagari, 35, currentY);
        currentY += 12;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(106, 90, 78);
        doc.text(mantra.transliteration, 35, currentY);
        currentY += 12;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(138, 122, 104);
        const splitMeaning = doc.splitTextToSize(`Meaning: ${mantra.meaning}`, 525);
        doc.text(splitMeaning, 35, currentY);
        currentY += (splitMeaning.length * 10) + 15;
      });
    }

    
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      drawBrandedFooter(doc, i, pageCount, "Printed from The Tapa Co. Verified Scriptural Guidelines.");
    }

    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Tapa_Ritual_Guide_${slug}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Failed to generate Server Ritual PDF:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
