import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json({ session: null });
    }

    const payload = await verifyAccessToken(accessToken);

    if (!payload) {
      return NextResponse.json({ session: null });
    }

    return NextResponse.json({
      session: {
        user: {
          id: payload.userId,
          role: payload.role,
          phone: payload.phone,
          email: payload.email,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching session state:", error);
    return NextResponse.json({ session: null }, { status: 500 });
  }
}
