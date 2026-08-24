import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth/admin";
import { z } from "zod";

const bulkItemSchema = z.object({
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

const bulkSchema = z.array(bulkItemSchema);

export async function POST(req: NextRequest) {
  const admin = await checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const parse = bulkSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: "Invalid data format or fields missing in bulk list" }, { status: 400 });
    }

    const entries = parse.data;
    let createdCount = 0;
    let updatedCount = 0;

    
    for (const item of entries) {
      const { date, ...rest } = item;
      const dateOnly = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

      const exists = await db.panchangEntry.findUnique({
        where: { date_city: { date: dateOnly, city: item.city || "Delhi-NCR" } },
      });

      if (exists) {
        await db.panchangEntry.update({
          where: { id: exists.id },
          data: {
            ...rest,
          },
        });
        updatedCount++;
      } else {
        await db.panchangEntry.create({
          data: {
            date: dateOnly,
            ...rest,
          },
        });
        createdCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Bulk load complete. Created: ${createdCount}, Updated: ${updatedCount} entries.`,
    });
  } catch (err) {
    console.error("POST bulk panchang failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
