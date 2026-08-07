import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { signAccessToken } from "@/lib/auth/jwt";
import { createHash, randomBytes, timingSafeEqual } from "crypto";

const verifySchema = z.object({
  phone: z.string().regex(/^\+91[6-9]\d{9}$/),
  otp: z.string().length(6),
  name: z.string().optional(),
  email: z.string().email("Invalid email format.").optional().or(z.literal("")),
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
    const parse = verifySchema.safeParse(body);

    if (!parse.success) {
      return NextResponse.json(
        { error: "Invalid phone number or verification code." },
        { status: 400 }
      );
    }

    const { phone, otp } = parse.data;

    // 1. Retrieve the latest unexpired, unverified OTP request for this phone
    const otpRequest = await db.oTPRequest.findFirst({
      where: {
        phone,
        verified: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!otpRequest) {
      return NextResponse.json(
        { error: "Invalid or expired verification code." },
        { status: 400 }
      );
    }

    // 2. Brute-force protection: max 5 verification attempts per OTP request
    if (otpRequest.attempts >= 5) {
      // Invalidate the OTP request immediately by making it expired
      await db.oTPRequest.update({
        where: { id: otpRequest.id },
        data: { expiresAt: new Date(Date.now() - 1000) },
      });
      return NextResponse.json(
        { error: "Too many failed attempts. Please request a new verification code." },
        { status: 400 }
      );
    }

    // Increment attempts count
    await db.oTPRequest.update({
      where: { id: otpRequest.id },
      data: { attempts: otpRequest.attempts + 1 },
    });

    // 3. Timing-safe OTP code verification
    const inputHash = hashSHA256(otp);
    const isMatch = safeCompare(inputHash, otpRequest.codeHash);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid or expired verification code." },
        { status: 400 }
      );
    }

    // Mark request as verified
    await db.oTPRequest.update({
      where: { id: otpRequest.id },
      data: { verified: true },
    });

    // 4. Find or create the user in the database
    let user = await db.user.findUnique({
      where: { phone },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          phone,
          role: "CUSTOMER",
          phoneVerified: new Date(),
          name: parse.data.name || null,
          email: parse.data.email || null,
        },
      });
    }

    // 5. Generate session tokens
    const accessToken = await signAccessToken({
      userId: user.id,
      role: user.role,
      phone: user.phone || undefined,
      email: user.email || undefined,
    });

    const refreshTokenVal = generateOpaqueToken();
    const refreshTokenHash = hashSHA256(refreshTokenVal);
    const family = generateOpaqueToken(); // Rotation family identifier
    const refreshTokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Save refresh token record hashed in DB
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

    // 6. Build cookies response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        role: user.role,
        phone: user.phone,
        name: user.name,
      },
    });

    // Set Access Token (JWT) - 15 minutes, httpOnly, secure, sameSite=lax
    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60, // 15 mins
    });

    // Set Refresh Token (Opaque) - 30 days, httpOnly, secure, sameSite=lax
    response.cookies.set("refresh_token", refreshTokenVal, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error) {
    console.error("Error verifying OTP code:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
