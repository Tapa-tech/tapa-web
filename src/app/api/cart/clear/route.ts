import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAccessToken } from "@/lib/auth/jwt";

export const dynamic = "force-dynamic";

async function getUserId(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get("access_token")?.value;
  if (!token) return null;
  try {
    const payload = await verifyAccessToken(token);
    return payload?.userId || null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await db.cartItem.deleteMany({
      where: { userId },
    });
    return NextResponse.json({ success: true, cleared: true });
  } catch (err) {
    console.error("POST /api/cart/clear error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
