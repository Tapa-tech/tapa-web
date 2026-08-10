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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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

    const vrat = await db.vratEntry.update({
      where: { id: params.id },
      data: {
        date: dateOnly,
        ...rest,
      },
    });

    return NextResponse.json(vrat);
  } catch (err) {
    console.error("PUT vrat failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await db.vratEntry.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE vrat failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
