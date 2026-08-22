import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAccessToken } from "@/lib/auth/jwt";

export const dynamic = "force-dynamic";

async function isAdmin(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("access_token")?.value;
  if (!token) return false;
  try {
    const payload = await verifyAccessToken(token);
    return payload?.role === "ADMIN" || payload?.role === "SUPER_ADMIN";
  } catch (e) {
    return false;
  }
}

// GET: Fetch all products (including drafts) for admin dashboard
export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const products = await db.product.findMany({
      include: {
        kitItems: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(products);
  } catch (err) {
    console.error("GET /api/admin/products error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Create a new product
export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      name,
      slug,
      type,
      description,
      images,
      price,
      mrp,
      stock,
      category,
      codAvailability,
      kitItems,
      linkedRitualGuideId,
      status,
    } = body;

    if (!name || !slug || !type || price === undefined) {
      return NextResponse.json({ error: "Name, slug, type, and price are required" }, { status: 400 });
    }

    // Check unique slug
    const existing = await db.product.findUnique({
      where: { slug },
    });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    const created = await db.product.create({
      data: {
        name,
        slug,
        type,
        description: description || "",
        images: images || [],
        price: Number(price),
        mrp: mrp ? Number(mrp) : null,
        stock: Number(stock) || 0,
        category: category || "general",
        codAvailability: codAvailability || "AVAILABLE",
        linkedRitualGuideId: linkedRitualGuideId || null,
        status: status || "DRAFT",
        kitItems: type === "PUJA_KIT" && kitItems && Array.isArray(kitItems)
          ? {
              create: kitItems.map((item: any) => ({
                itemName: item.itemName,
                itemFunction: item.itemFunction,
              })),
            }
          : undefined,
      },
      include: {
        kitItems: true,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/products error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
