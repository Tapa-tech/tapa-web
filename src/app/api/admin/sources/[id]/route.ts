import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth/admin";
import { z } from "zod";

const sourceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  reference: z.string().min(1, "Reference is required"),
  type: z.enum(["VEDIC", "PURANIC", "SHASTRA", "SCHOLARLY", "ORAL"]),
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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

    const source = await db.source.update({
      where: { id: params.id },
      data: parse.data,
    });

    return NextResponse.json(source);
  } catch (err) {
    console.error("PUT source failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Delete any relation records first
    await db.ritualGuideSource.deleteMany({
      where: { sourceId: params.id },
    });

    await db.source.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE source failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
