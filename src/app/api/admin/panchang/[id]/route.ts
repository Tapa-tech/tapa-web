import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth/admin";
import { z } from "zod";

const panchangSchema = z.object({
  date: z.string().transform((str) => new Date(str)),
  city: z.string().default("Delhi-NCR"),
  tithi: z.string().min(1, "Tithi is required"),
  tithiSub: z.string().min(1, "Tithi detail is required"),
  paksha: z.string().min(1, "Paksha is required"),
  pakshaSub: z.string().min(1, "Paksha detail is required"),
  nakshatra: z.string().min(1, "Nakshatra is required"),
  nakshatraSub: z.string().optional().nullable(),
  sunrise: z.string().min(1, "Sunrise is required"),
  sunset: z.string().optional().nullable(),
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const parse = panchangSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.issues[0].message }, { status: 400 });
    }

    const { date, ...rest } = parse.data;
    const dateOnly = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

    // Check date uniqueness excluding current entry
    const exists = await db.panchangEntry.findFirst({
      where: {
        date: dateOnly,
        NOT: { id: params.id },
      },
    });

    if (exists) {
      return NextResponse.json({ error: "Another entry for this date already exists" }, { status: 400 });
    }

    const entry = await db.panchangEntry.update({
      where: { id: params.id },
      data: {
        date: dateOnly,
        ...rest,
        dataSource: "MANUAL_OVERRIDE",
        overriddenBy: admin.userId,
        overriddenAt: new Date(),
      },
    });

    return NextResponse.json(entry);
  } catch (err) {
    console.error("PUT panchang entry failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await db.panchangEntry.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE panchang entry failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
