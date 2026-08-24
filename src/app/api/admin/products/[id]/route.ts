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


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  try {
    const product = await db.product.findUnique({
      where: { id },
      include: {
        kitItems: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (err) {
    console.error("GET /api/admin/products/[id] error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
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

    
    const product = await db.product.findUnique({
      where: { id },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    
    if (slug && slug !== product.slug) {
      const existing = await db.product.findUnique({
        where: { slug },
      });
      if (existing) {
        return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
      }
    }

    
    const updated = await db.$transaction(async (tx) => {
      
      await tx.kitItem.deleteMany({
        where: { productId: id },
      });

      
      return await tx.product.update({
        where: { id },
        data: {
          name,
          slug,
          type,
          description: description ?? "",
          images: images ?? [],
          price: Number(price),
          mrp: mrp ? Number(mrp) : null,
          stock: Number(stock) || 0,
          category: category ?? "general",
          codAvailability: codAvailability ?? "AVAILABLE",
          linkedRitualGuideId: linkedRitualGuideId ?? null,
          status: status ?? "DRAFT",
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
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /api/admin/products/[id] error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  try {
    await db.product.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, deleted: id });
  } catch (err) {
    console.error("DELETE /api/admin/products/[id] error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
