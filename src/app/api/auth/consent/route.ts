import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAccessToken, signAccessToken } from "@/lib/auth/jwt";

const CURRENT_CONSENT_VERSION = "v1.0";

export async function POST(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("access_token")?.value;
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyAccessToken(accessToken);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ip = req.headers.get("x-forwarded-for") || "unknown";

    
    const updatedUser = await db.user.update({
      where: { id: payload.userId },
      data: {
        consentGiven: true,
        consentGivenAt: new Date(),
        consentVersion: CURRENT_CONSENT_VERSION,
        consentIpAddress: ip,
      },
    });

    
    const newAccessToken = await signAccessToken({
      userId: updatedUser.id,
      role: updatedUser.role,
      phone: updatedUser.phone || undefined,
      email: updatedUser.email || undefined,
      consentGiven: true,
    });

    const response = NextResponse.json({ success: true, consentGiven: true });

    
    response.cookies.set("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60, 
    });

    return response;
  } catch (error) {
    console.error("Error in consent record endpoint:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
