import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const slug = req.nextUrl.searchParams.get("slug");
    const type = req.nextUrl.searchParams.get("type");
    const category = req.nextUrl.searchParams.get("category");

    
    if (id || slug) {
      const product = await db.product.findFirst({
        where: {
          ...(id ? { id } : { slug: slug || undefined }),
          status: "PUBLISHED",
        },
        include: {
          kitItems: true,
        },
      });

      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }

      return NextResponse.json(product);
    }

    
    const products = await db.product.findMany({
      where: {
        status: "PUBLISHED",
        ...(type ? { type: type as "PUJA_KIT" | "SAMAGRI_ITEM" } : {}),
        ...(category ? { category } : {}),
      },
      include: {
        kitItems: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (err) {
    console.error("Public products API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
