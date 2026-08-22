import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth/admin";

export async function GET(req: NextRequest) {
  const admin = await checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const features = await db.upcomingFeature.findMany({
      orderBy: { key: "asc" },
    });
    return NextResponse.json(features);
  } catch (err) {
    console.error("GET admin upcoming-features failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = await checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { key, launchLabel, badgeText, teaserTitle, teaserBody, isLive } = body;

    if (!key) {
      return NextResponse.json({ error: "Feature key is required" }, { status: 400 });
    }

    const updated = await db.upcomingFeature.update({
      where: { key },
      data: {
        launchLabel,
        badgeText,
        teaserTitle,
        teaserBody,
        isLive: !!isLive,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT admin upcoming-feature failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
