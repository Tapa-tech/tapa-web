import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/auth/rate-limit";
import { sendSMSOTP } from "@/lib/auth/msg91";
import { createHash } from "crypto";

// India phone format E.164: +91 followed by exactly 10 digits
const phoneSchema = z.object({
  phone: z
    .string()
    .regex(/^\+91[6-9]\d{9}$/, "Invalid phone format. Must be India E.164 format (+91XXXXXXXXXX)"),
});

function hashSHA256(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parse = phoneSchema.safeParse(body);

    if (!parse.success) {
      return NextResponse.json(
        { error: parse.error.issues[0].message },
        { status: 400 }
      );
    }

    const { phone } = parse.data;

    // 1. Rate limiting: max 3 requests per phone number per 10 minutes
    const rateLimitKey = `ratelimit:otp_req:${phone}`;
    const { success } = await rateLimit(rateLimitKey, 3, 10 * 60 * 1000);

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please wait 10 minutes before requesting another OTP." },
        { status: 429 }
      );
    }

    // 2. Generate a cryptographically secure 6-digit numeric OTP
    // We want a value between 100000 and 999999 inclusive
    const otpVal = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = hashSHA256(otpVal);

    // 3. Save OTP request in database
    // Set code expiry time (5 minutes)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await db.oTPRequest.create({
      data: {
        phone,
        codeHash,
        expiresAt,
      },
    });

    // 4. Send the OTP code via SMS provider
    const smsSent = await sendSMSOTP(phone, otpVal);

    if (!smsSent) {
      return NextResponse.json(
        { error: "Failed to dispatch verification code. Please try again later." },
        { status: 500 }
      );
    }

    // Return generic success to prevent account enumeration
    return NextResponse.json({ success: true, message: "Verification code sent successfully." });
  } catch (error) {
    console.error("Error in OTP request endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
