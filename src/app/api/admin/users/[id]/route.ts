import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Verify caller is SUPER_ADMIN
    const token = req.cookies.get("access_token")?.value;
    const payload = token ? await verifyAccessToken(token) : null;
    if (!payload || payload.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden. Super Admin privileges required." }, { status: 403 });
    }

    // 2. Fetch the target user with all aggregates
    const userDetail = await db.user.findUnique({
      where: { id: params.id },
      include: {
        savedGuides: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        downloadRecords: {
          orderBy: { downloadedAt: "desc" },
        },
        orders: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!userDetail) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json(userDetail);
  } catch (error) {
    console.error("Error in GET /api/admin/users/[id]:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
