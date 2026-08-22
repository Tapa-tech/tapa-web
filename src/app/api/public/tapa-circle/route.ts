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
    return NextResponse.json({ error: "Please log in to join The Tapa Circle" }, { status: 401 });
  }

  try {
    const { whatsappNumber, consent } = await req.json();

    if (!whatsappNumber || whatsappNumber.trim() === "") {
      return NextResponse.json({ error: "WhatsApp number is required" }, { status: 400 });
    }

    if (!consent) {
      return NextResponse.json({ error: "Consent is required to subscribe" }, { status: 400 });
    }

    // Upsert TapaCircleSubscriber
    const subscriber = await db.tapaCircleSubscriber.upsert({
      where: { userId },
      update: {
        whatsappNumber,
        consentGiven: true,
        consentGivenAt: new Date(),
        status: "PENDING_PAYMENT", // online payment gateway integration is stubbed
      },
      create: {
        userId,
        whatsappNumber,
        consentGiven: true,
        consentGivenAt: new Date(),
        status: "PENDING_PAYMENT",
      },
    });

    return NextResponse.json(subscriber, { status: 201 });
  } catch (err) {
    console.error("POST /api/public/tapa-circle error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
