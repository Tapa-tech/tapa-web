import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth/admin";
import { z } from "zod";

const sourceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  reference: z.string().min(1, "Reference is required"),
  type: z.enum(["VEDIC", "PURANIC", "SHASTRA", "SCHOLARLY", "ORAL"]),
});

export async function GET(req: NextRequest) {
  const admin = await checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sources = await db.source.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(sources);
  } catch (err) {
    console.error("GET sources failed:", err);
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
    const parse = sourceSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.issues[0].message }, { status: 400 });
    }

    const source = await db.source.create({
      data: parse.data,
    });

    return NextResponse.json(source, { status: 201 });
  } catch (err) {
    console.error("POST source failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
