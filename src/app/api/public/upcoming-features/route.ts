import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const features = await db.upcomingFeature.findMany();
    // Reduce array into key-value map for easier lookup
    const featureMap = features.reduce<Record<string, typeof features[0]>>((acc, cur) => {
      acc[cur.key] = cur;
      return acc;
    }, {});
    return NextResponse.json(featureMap);
  } catch (err) {
    console.error("GET public upcoming-features failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
