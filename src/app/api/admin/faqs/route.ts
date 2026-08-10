import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth/admin";
import { z } from "zod";

const faqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

export async function GET(req: NextRequest) {
  const admin = await checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const faqs = await db.fAQ.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(faqs);
  } catch (err) {
    console.error("GET faqs failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const parse = faqSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.issues[0].message }, { status: 400 });
    }

    const faq = await db.fAQ.create({
      data: parse.data,
    });

    return NextResponse.json(faq, { status: 201 });
  } catch (err) {
    console.error("POST faq failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
