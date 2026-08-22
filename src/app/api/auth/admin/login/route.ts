import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { signAccessToken } from "@/lib/auth/jwt";
import { createHash, randomBytes, timingSafeEqual } from "crypto";

const adminLoginSchema = z.object({
  email: z.string().email("Invalid email format."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

function hashSHA256(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function generateOpaqueToken(): string {
  return randomBytes(32).toString("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parse = adminLoginSchema.safeParse(body);

    if (!parse.success) {
      return NextResponse.json(
        { error: parse.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parse.data;

    // 1. Look up user by email
    const user = await db.user.findUnique({
      where: { email },
    });

    if (user && user.isActive === false) {
      return NextResponse.json(
        { error: "Your account has been deactivated. Please contact support." },
        { status: 403 }
      );
    }

    if (!user || !user.passwordHash || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
      // Return generic error to prevent email/account enumeration
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // 2. Timing-safe password verification
    const inputHash = hashSHA256(password);
    const isMatch = safeCompare(inputHash, user.passwordHash);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // 3. Issue Access and Refresh Tokens
    const accessToken = await signAccessToken({
      userId: user.id,
      role: user.role,
      email: user.email || undefined,
      phone: user.phone || undefined,
    });

    const refreshTokenVal = generateOpaqueToken();
    const refreshTokenHash = hashSHA256(refreshTokenVal);
    const family = generateOpaqueToken();
    const refreshTokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const ipAddress = req.headers.get("x-forwarded-for") || req.ip || null;
    const userAgent = req.headers.get("user-agent") || null;

    await db.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: refreshTokenHash,
        family,
        expiresAt: refreshTokenExpiry,
        ipAddress,
        userAgent,
      },
    });

    // 4. Set cookies and response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        role: user.role,
        email: user.email,
        name: user.name,
      },
    });

    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60, // 15 mins
    });

    response.cookies.set("refresh_token", refreshTokenVal, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error) {
    console.error("Error in admin credentials login endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
