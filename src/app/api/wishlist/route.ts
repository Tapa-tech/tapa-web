import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAccessToken } from "@/lib/auth/jwt";

export const dynamic = "force-dynamic";

async function getUserId(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get("access_token")?.value;
  if (!token) return null;
  try {
    const payload = await verifyAccessToken(token);
    return payload?.userId || null;
  } catch {
    return null;
  }
}


export async function GET(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const wishlistItems = await db.wishlistItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
      orderBy: {
        addedAt: "desc",
      },
    });

    return NextResponse.json(wishlistItems);
  } catch (err) {
    console.error("GET /api/wishlist error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    
    const product = await db.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    
    const existing = await db.wishlistItem.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existing) {
      return NextResponse.json(existing); 
    }

    const created = await db.wishlistItem.create({
      data: {
        userId,
        productId,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("POST /api/wishlist error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const productId = req.nextUrl.searchParams.get("productId");
    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    await db.wishlistItem.deleteMany({
      where: { userId, productId },
    });

    return NextResponse.json({ success: true, removed: productId });
  } catch (err) {
    console.error("DELETE /api/wishlist error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
