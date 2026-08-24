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


export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await db.order.findMany({
      include: {
        user: {
          select: {
            email: true,
            phone: true,
            name: true,
          },
        },
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (err) {
    console.error("GET /api/admin/orders error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function PUT(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { orderId, orderStatus, paymentStatus } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    
    const order = await db.order.findUnique({
      where: { id: orderId },
    });

    if (order && orderStatus === "DELIVERED" && order.paymentMethod === "COD") {
      updateData.paymentStatus = "PAID";
    }

    const updated = await db.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        user: {
          select: {
            email: true,
            phone: true,
            name: true,
          },
        },
        items: true,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /api/admin/orders error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
