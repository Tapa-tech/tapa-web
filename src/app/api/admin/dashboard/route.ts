import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth/admin";

export async function GET(req: NextRequest) {
  const admin = await checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [
      guidesDraft,
      guidesPublished,
      concepts,
      panchang,
      pendingDpb,
      kits,
      productsCount,
      ordersCount,
      ordersConfirmedCount,
      ordersProcessingCount,
      ordersShippedCount,
      tapaCircleCount,
      totalUsers,
      customerCount,
      adminCount,
      superAdminCount,
      pendingConsentCount,
      recentUsers,
      latestPanchang
    ] = await Promise.all([
      db.ritualGuide.count({ where: { status: "DRAFT" } }),
      db.ritualGuide.count({ where: { status: "PUBLISHED" } }),
      db.dharmicConcept.count(),
      db.panchangEntry.count(),
      db.dPBEntry.count({ where: { tag: "BHRANTI", reviewStatus: "PENDING_FOUNDER_REVIEW" } }),
      db.ritualKit.count(),
      db.product.count(),
      db.order.count(),
      db.order.count({ where: { orderStatus: "CONFIRMED" } }),
      db.order.count({ where: { orderStatus: "PROCESSING" } }),
      db.order.count({ where: { orderStatus: "SHIPPED" } }),
      db.tapaCircleSubscriber.count(),
      db.user.count(),
      db.user.count({ where: { role: "CUSTOMER" } }),
      db.user.count({ where: { role: "ADMIN" } }),
      db.user.count({ where: { role: "SUPER_ADMIN" } }),
      db.user.count({ where: { consentGiven: false } }),
      db.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
      }),
      db.panchangEntry.findFirst({
        orderBy: { createdAt: "desc" },
        select: { syncedAt: true },
      }),
    ]);

    return NextResponse.json({
      guidesDraft,
      guidesPublished,
      concepts,
      panchang,
      pendingDpb,
      kits,
      productsCount,
      ordersCount,
      ordersConfirmedCount,
      ordersProcessingCount,
      ordersShippedCount,
      tapaCircleCount,
      totalUsers,
      customerCount,
      adminCount,
      superAdminCount,
      pendingConsentCount,
      recentUsers,
      lastPanchangSync: latestPanchang?.syncedAt || null,
    });
  } catch (err) {
    console.error("GET dashboard metrics failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
