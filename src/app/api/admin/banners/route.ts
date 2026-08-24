import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth/admin";

export async function GET(req: NextRequest) {
  const admin = await checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const banners = await db.homepageBanner.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(banners);
  } catch (err) {
    console.error("GET admin banners failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const {
      isActive,
      imageUrl,
      orderByDate,
      festivalTitle,
      mainHeading,
      highlightedText,
      description,
      price,
      mrp,
      primaryCtaText,
      primaryCtaLink,
      secondaryCtaText,
      secondaryCtaLink,
      festivalDate,
    } = body;

    if (!imageUrl || !festivalTitle || !mainHeading || !highlightedText || !description || price === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (isActive) {
      
      await db.homepageBanner.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    const banner = await db.homepageBanner.create({
      data: {
        isActive: !!isActive,
        imageUrl,
        orderByDate: orderByDate ? new Date(orderByDate) : null,
        festivalTitle,
        mainHeading,
        highlightedText,
        description,
        price: Number(price),
        mrp: mrp ? Number(mrp) : null,
        primaryCtaText: primaryCtaText || "Pre-book Kit now ›",
        primaryCtaLink: primaryCtaLink || "/cart",
        secondaryCtaText: secondaryCtaText || null,
        secondaryCtaLink: secondaryCtaLink || null,
        festivalDate: festivalDate ? new Date(festivalDate) : null,
      },
    });

    return NextResponse.json(banner, { status: 201 });
  } catch (err) {
    console.error("POST admin banner failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
