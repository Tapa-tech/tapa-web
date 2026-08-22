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

// GET: Fetch all cart items for current user
export async function GET(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const cartItems = await db.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
      orderBy: {
        addedAt: "asc",
      },
    });

    return NextResponse.json(cartItems);
  } catch (err) {
    console.error("GET /api/cart error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Add product to cart (or increment quantity)
export async function POST(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId, quantity } = await req.json();
    if (!productId || !quantity || quantity <= 0) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Verify product exists
    const product = await db.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Upsert cart item
    const existing = await db.cartItem.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existing) {
      const updated = await db.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
      return NextResponse.json(updated);
    } else {
      const created = await db.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
        },
      });
      return NextResponse.json(created, { status: 201 });
    }
  } catch (err) {
    console.error("POST /api/cart error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT: Set precise quantity of product in cart
export async function PUT(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId, quantity } = await req.json();
    if (!productId || quantity === undefined) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    if (quantity <= 0) {
      // Remove if quantity is 0 or less
      await db.cartItem.deleteMany({
        where: { userId, productId },
      });
      return NextResponse.json({ success: true, removed: true });
    }

    const updated = await db.cartItem.upsert({
      where: {
        userId_productId: { userId, productId },
      },
      update: { quantity },
      create: { userId, productId, quantity },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /api/cart error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE: Remove product from cart or clear entire cart
export async function DELETE(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const productId = req.nextUrl.searchParams.get("productId");

    if (productId) {
      // Remove specific item
      await db.cartItem.deleteMany({
        where: { userId, productId },
      });
      return NextResponse.json({ success: true, removed: productId });
    } else {
      // Clear entire cart
      await db.cartItem.deleteMany({
        where: { userId },
      });
      return NextResponse.json({ success: true, cleared: true });
    }
  } catch (err) {
    console.error("DELETE /api/cart error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
