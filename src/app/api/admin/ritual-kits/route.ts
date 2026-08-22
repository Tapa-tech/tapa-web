import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth/admin";
import { indexRitualKit } from "@/lib/elasticsearch";
import { z } from "zod";

const ritualKitInputSchema = z.object({
  id: z.string().regex(/^[a-z0-9-_]+$/, "ID/Slug must only contain lowercase letters, numbers, dashes, or underscores"),
  name: z.string().min(1, "Name is required"),
  hindi: z.string().optional().nullable(),
  occ: z.string().min(1, "Occasion is required"),
  deity: z.string().min(1, "Deity is required"),
  price: z.number().min(0, "Price must be a positive number"),
  mrp: z.number().min(0, "MRP must be a positive number").optional().nullable(),
  inStock: z.boolean().default(true),
  stockLeft: z.number().min(0).optional().nullable(),
  itemsCount: z.string().min(1, "Items count description is required"),
  ribbon: z.string().optional().nullable(),
  delivery: z.string().min(1, "Delivery info is required"),
  isFeatured: z.boolean().default(false),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  const admin = await checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const kits = await db.ritualKit.findMany({
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(kits);
  } catch (err) {
    console.error("GET admin ritual kits failed:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const parse = ritualKitInputSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.issues[0].message }, { status: 400 });
    }

    const data = parse.data;

    // Check slug uniqueness
    const exists = await db.ritualKit.findUnique({
      where: { id: data.id },
    });
    if (exists) {
      return NextResponse.json({ error: "ID/Slug is already in use by another kit" }, { status: 400 });
    }

    const kit = await db.ritualKit.create({
      data: {
        id: data.id,
        name: data.name,
        hindi: data.hindi || null,
        occ: data.occ,
        deity: data.deity,
        price: data.price,
        mrp: data.mrp || null,
        inStock: data.inStock,
        stockLeft: data.stockLeft || null,
        itemsCount: data.itemsCount,
        ribbon: data.ribbon || null,
        delivery: data.delivery,
        isFeatured: data.isFeatured,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
      },
    });

    // Index newly created kit in Elasticsearch
    if (kit && kit.id) {
      indexRitualKit(kit.id).catch((err) => {
        console.error("Background Elasticsearch indexing for kit failed:", err);
      });
    }

    return NextResponse.json(kit, { status: 201 });
  } catch (err) {
    console.error("POST admin ritual kit failed:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
