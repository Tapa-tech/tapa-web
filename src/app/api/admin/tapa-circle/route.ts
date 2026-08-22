import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { sendBroadcast } from "@/lib/utils/whatsapp-stub";

export const dynamic = "force-dynamic";

async function isAdmin(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("access_token")?.value;
  if (!token) return false;
  try {
    const payload = await verifyAccessToken(token);
    return payload?.role === "ADMIN" || payload?.role === "SUPER_ADMIN";
  } catch (e) {
    return false;
  }
}

// GET: Fetch all Tapa Circle subscribers for admin panel
export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const subscribers = await db.tapaCircleSubscriber.findMany({
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const broadcasts = await db.broadcastMessage.findMany({
      orderBy: {
        sentAt: "desc",
      },
    });

    return NextResponse.json({ subscribers, broadcasts });
  } catch (err) {
    console.error("GET /api/admin/tapa-circle error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Trigger manual broadcast to all active subscribers
export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { message } = await req.json();

    if (!message || message.trim() === "") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Fetch all active subscribers
    const subscribers = await db.tapaCircleSubscriber.findMany({
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (subscribers.length === 0) {
      return NextResponse.json({ error: "No subscribers found to broadcast to." }, { status: 400 });
    }

    // Map to WhatsAppRecipient list
    const recipients = subscribers.map((sub) => ({
      userId: sub.userId,
      whatsappNumber: sub.whatsappNumber,
      name: sub.user?.name,
    }));

    // Trigger WhatsApp stub broadcast
    const broadcastResult = await sendBroadcast(message, recipients);

    // Save record of the broadcast message
    const record = await db.broadcastMessage.create({
      data: {
        message,
        recipientsCount: broadcastResult.recipientsCount,
      },
    });

    return NextResponse.json({ success: true, record });
  } catch (err) {
    console.error("POST /api/admin/tapa-circle error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
