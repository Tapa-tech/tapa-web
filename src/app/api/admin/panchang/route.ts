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

export async function GET(req: NextRequest) {
  const admin = await checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const entries = await db.panchangEntry.findMany({
      orderBy: { date: "asc" },
    });
    return NextResponse.json(entries);
  } catch (err) {
    console.error("GET panchang entries failed:", err);
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
    const parse = panchangSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.issues[0].message }, { status: 400 });
    }

    const { date, ...rest } = parse.data;

    
    const dateOnly = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

    
    const exists = await db.panchangEntry.findUnique({
      where: { date_city: { date: dateOnly, city: rest.city || "Delhi-NCR" } },
    });

    if (exists) {
      return NextResponse.json({ error: "An entry for this date already exists" }, { status: 400 });
    }

    const entry = await db.panchangEntry.create({
      data: {
        date: dateOnly,
        ...rest,
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (err) {
    console.error("POST panchang entry failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
