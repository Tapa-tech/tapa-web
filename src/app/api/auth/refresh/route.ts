import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signAccessToken } from "@/lib/auth/jwt";
import { createHash, randomBytes } from "crypto";

function hashSHA256(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

function generateOpaqueToken(): string {
  return randomBytes(32).toString("hex");
}

export async function POST(req: NextRequest) {
  try {
    const refreshTokenVal = req.cookies.get("refresh_token")?.value;

    if (!refreshTokenVal) {
      return NextResponse.json({ error: "Unauthorized. Missing refresh token." }, { status: 401 });
    }

    const currentHash = hashSHA256(refreshTokenVal);

    // 1. Look up refresh token in database
    const tokenRecord = await db.refreshToken.findUnique({
      where: { tokenHash: currentHash },
      include: { user: true },
    });

    if (!tokenRecord) {
      return NextResponse.json({ error: "Unauthorized. Invalid refresh token." }, { status: 401 });
    }

    // 2. Expiry check
    if (tokenRecord.expiresAt < new Date()) {
      return NextResponse.json({ error: "Unauthorized. Expired refresh token." }, { status: 401 });
    }

    // 3. Reuse Detection: If the token is already revoked, revoke the entire family!
    if (tokenRecord.revoked) {
      console.warn(
        `[SECURITY WARN] Refresh token reuse detected for userId: ${tokenRecord.userId}. Revoking family: ${tokenRecord.family}`
      );
      
      // Revoke all tokens in the same rotation family
      await db.refreshToken.updateMany({
        where: { family: tokenRecord.family },
        data: { revoked: true },
      });

      // Clear cookies and force re-login
      const response = NextResponse.json(
        { error: "Unauthorized. Token reuse detected. Logging out." },
        { status: 401 }
      );
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }

    // 4. Token Rotation (legitimate request)
    // Revoke current token
    await db.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { revoked: true },
    });

    // Create a new refresh token under the SAME family
    const nextTokenVal = generateOpaqueToken();
    const nextTokenHash = hashSHA256(nextTokenVal);
    const nextExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Extend by 30 days
    const ipAddress = req.headers.get("x-forwarded-for") || req.ip || null;
    const userAgent = req.headers.get("user-agent") || null;

    await db.refreshToken.create({
      data: {
        userId: tokenRecord.userId,
        tokenHash: nextTokenHash,
        family: tokenRecord.family, // Maintain rotation family
        expiresAt: nextExpiry,
        ipAddress,
        userAgent,
      },
    });

    // Generate new Access Token (JWT)
    const nextAccessToken = await signAccessToken({
      userId: tokenRecord.user.id,
      role: tokenRecord.user.role,
      phone: tokenRecord.user.phone || undefined,
      email: tokenRecord.user.email || undefined,
    });

    // 5. Send updated cookies
    const response = NextResponse.json({
      success: true,
      user: {
        id: tokenRecord.user.id,
        role: tokenRecord.user.role,
        phone: tokenRecord.user.phone,
        name: tokenRecord.user.name,
      },
    });

    response.cookies.set("access_token", nextAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60, // 15 mins
    });

    response.cookies.set("refresh_token", nextTokenVal, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error) {
    console.error("Error during token refresh:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
