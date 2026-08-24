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
  consentGiven: z.boolean().optional(),
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

    
    if (otpRequest.attempts >= 5) {
      
      await db.oTPRequest.update({
        where: { id: otpRequest.id },
        data: { expiresAt: new Date(Date.now() - 1000) },
      });
      return NextResponse.json(
        { error: "Too many failed attempts. Please request a new verification code." },
        { status: 400 }
      );
    }

    
    await db.oTPRequest.update({
      where: { id: otpRequest.id },
      data: { attempts: otpRequest.attempts + 1 },
    });

    
    const inputHash = hashSHA256(otp);
    const isMatch = safeCompare(inputHash, otpRequest.codeHash);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid or expired verification code." },
        { status: 400 }
      );
    }

    
    await db.oTPRequest.update({
      where: { id: otpRequest.id },
      data: { verified: true },
    });

    
    let user = await db.user.findUnique({
      where: { phone },
    });

    if (user && user.isActive === false) {
      return NextResponse.json(
        { error: "Your account has been deactivated. Please contact support." },
        { status: 403 }
      );
    }

    if (!user) {
      if (body.consentGiven !== true) {
        return NextResponse.json(
          { error: "Consent must be explicitly given to create an account." },
          { status: 400 }
        );
      }
      user = await db.user.create({
        data: {
          phone,
          role: "CUSTOMER",
          phoneVerified: new Date(),
          name: parse.data.name || null,
          email: parse.data.email || null,
          consentGiven: true,
          consentGivenAt: new Date(),
          consentVersion: "v1.0",
          consentIpAddress: req.headers.get("x-forwarded-for") || req.ip || "unknown",
        },
      });
    }

    
    const accessToken = await signAccessToken({
      userId: user.id,
      role: user.role,
      phone: user.phone || undefined,
      email: user.email || undefined,
      consentGiven: user.consentGiven,
    });

    const refreshTokenVal = generateOpaqueToken();
    const refreshTokenHash = hashSHA256(refreshTokenVal);
    const family = generateOpaqueToken(); 
    const refreshTokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); 

    
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

    
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        role: user.role,
        phone: user.phone,
        name: user.name,
      },
    });

    
    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60, 
    });

    
    response.cookies.set("refresh_token", refreshTokenVal, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, 
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
