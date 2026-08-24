import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/auth/rate-limit";
import { sendSMSOTP } from "@/lib/auth/msg91";
import { createHash } from "crypto";


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

    
    const rateLimitKey = `ratelimit:otp_req:${phone}`;
    const { success } = await rateLimit(rateLimitKey, 3, 10 * 60 * 1000);

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please wait 10 minutes before requesting another OTP." },
        { status: 429 }
      );
    }

    
    
    const otpVal = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = hashSHA256(otpVal);

    
    
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await db.oTPRequest.create({
      data: {
        phone,
        codeHash,
        expiresAt,
      },
    });

    
    const smsSent = await sendSMSOTP(phone, otpVal);

    if (!smsSent) {
      return NextResponse.json(
        { error: "Failed to dispatch verification code. Please try again later." },
        { status: 500 }
      );
    }

    
    return NextResponse.json({ success: true, message: "Verification code sent successfully." });
  } catch (error) {
    console.error("Error in OTP request endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
