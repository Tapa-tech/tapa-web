import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAccessToken } from "@/lib/auth/jwt";

// Helper to authenticate and verify user and consent
async function getAuthedUser(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  if (!token) return null;
  const payload = await verifyAccessToken(token);
  if (!payload) return null;
  
  // If not consented, block
  if (!payload.consentGiven) return null;
  
  return payload.userId;
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthedUser(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized or Consent required" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        savedGuides: {
          select: {
            id: true,
            title: true,
            slug: true,
            category: true,
            thumbnailUrl: true,
            introText: true,
          }
        }
      }
    });

    return NextResponse.json({ savedGuides: user?.savedGuides || [] });
  } catch (error) {
    console.error("Error in GET saved-guides:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthedUser(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized or Consent required" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { guideId } = body;
    if (!guideId) {
      return NextResponse.json({ error: "guideId is required" }, { status: 400 });
    }

    // Check if the guide exists
    const guide = await db.ritualGuide.findUnique({ where: { id: guideId } });
    if (!guide) {
      return NextResponse.json({ error: "Ritual guide not found" }, { status: 404 });
    }

    // Check if user already saved this guide
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        savedGuides: {
          where: { id: guideId }
        }
      }
    });

    const isCurrentlySaved = (user?.savedGuides.length || 0) > 0;

    if (isCurrentlySaved) {
      // Disconnect/Remove
      await db.user.update({
        where: { id: userId },
        data: {
          savedGuides: {
            disconnect: { id: guideId }
          }
        }
      });
      return NextResponse.json({ saved: false });
    } else {
      // Connect/Save
      await db.user.update({
        where: { id: userId },
        data: {
          savedGuides: {
            connect: { id: guideId }
          }
        }
      });
      return NextResponse.json({ saved: true });
    }
  } catch (error) {
    console.error("Error in POST saved-guides:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
