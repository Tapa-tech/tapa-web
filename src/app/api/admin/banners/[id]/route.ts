import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth/admin";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const banner = await db.homepageBanner.findUnique({
      where: { id: params.id },
    });
    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }
    return NextResponse.json(banner);
  } catch (err) {
    console.error("GET admin banner by id failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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
        where: {
          isActive: true,
          NOT: { id: params.id },
        },
        data: { isActive: false },
      });
    }

    const banner = await db.homepageBanner.update({
      where: { id: params.id },
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

    return NextResponse.json(banner);
  } catch (err) {
    console.error("PUT admin banner failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await db.homepageBanner.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE admin banner failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
