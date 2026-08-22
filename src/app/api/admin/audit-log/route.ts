import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // 1. Verify caller is SUPER_ADMIN
    const token = req.cookies.get("access_token")?.value;
    const payload = token ? await verifyAccessToken(token) : null;
    if (!payload || payload.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden. Super Admin privileges required." }, { status: 403 });
    }

    // 2. Fetch recent audit logs (latest 100 records)
    const logs = await db.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error in GET /api/admin/audit-log:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
