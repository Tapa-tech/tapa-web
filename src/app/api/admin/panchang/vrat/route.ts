import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth/admin";
import { z } from "zod";

const vratSchema = z.object({
  name: z.string().min(1, "Name is required"),
  date: z.string().transform((str) => new Date(str)),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional().nullable(),
  linkedGuideId: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  const admin = await checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const vrats = await db.vratEntry.findMany({
      orderBy: { date: "asc" },
    });
    return NextResponse.json(vrats);
  } catch (err) {
    console.error("GET vrats failed:", err);
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
    const parse = vratSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.issues[0].message }, { status: 400 });
    }

    const { date, ...rest } = parse.data;
    const dateOnly = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

    const vrat = await db.vratEntry.create({
      data: {
        date: dateOnly,
        ...rest,
      },
    });

    return NextResponse.json(vrat, { status: 201 });
  } catch (err) {
    console.error("POST vrat failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
