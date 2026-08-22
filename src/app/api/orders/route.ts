import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { sendOrderConfirmationNotification } from "@/lib/utils/whatsapp-stub";

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
    const orders = await db.order.findMany({
      where: { userId },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (err) {
    console.error("GET /api/orders error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { address, paymentMethod } = await req.json();

    if (!address || !paymentMethod) {
      return NextResponse.json({ error: "Address and payment method are required" }, { status: 400 });
    }

    if (paymentMethod !== "COD") {
      return NextResponse.json({ error: "Only Cash on Delivery (COD) is currently active" }, { status: 400 });
    }

    // Get user's cart items
    const cartItems = await db.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
    }

    // Validate stock and COD availability
    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        return NextResponse.json({
          error: `Insufficient stock for ${item.product.name}. Available: ${item.product.stock}`,
        }, { status: 400 });
      }

      if (item.product.codAvailability === "NOT_AVAILABLE") {
        return NextResponse.json({
          error: `${item.product.name} is not eligible for Cash on Delivery. Online payment coming soon.`,
        }, { status: 400 });
      }
    }

    // Calculate total amount
    const subtotal = cartItems.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
    const shippingFee = subtotal >= 1500 ? 0 : 99; // Free shipping above ₹1500, flat ₹99 otherwise
    const totalAmount = subtotal + shippingFee;

    // Generate Order Number: e.g. TK-2026-1001, TK-2026-1002
    const orderCount = await db.order.count();
    const currentYear = new Date().getFullYear();
    const sequentialNum = 1000 + orderCount + 1;
    const orderNumber = `TK-${currentYear}-${sequentialNum}`;

    // Estimated delivery (e.g., 3 days from now)
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

    // Place order in transaction
    const order = await db.$transaction(async (tx) => {
      // 1. Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          paymentMethod: "COD",
          paymentStatus: "PENDING_ON_DELIVERY",
          orderStatus: "CONFIRMED",
          totalAmount,
          deliveryAddress: address,
          estimatedDelivery,
        },
      });

      // 2. Create order items and decrement stock
      for (const item of cartItems) {
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            productName: item.product.name,
            quantity: item.quantity,
            priceAtOrder: item.product.price,
          },
        });

        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // 3. Clear cart
      await tx.cartItem.deleteMany({
        where: { userId },
      });

      return newOrder;
    });

    // Send transactional notification stub
    try {
      await sendOrderConfirmationNotification(order.orderNumber, address.mobile, totalAmount);
    } catch (e) {
      console.error("Failed to send order notification:", e);
    }

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error("POST /api/orders error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
