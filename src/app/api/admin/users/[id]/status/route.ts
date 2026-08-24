import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { db } from "@/lib/db";
import { z } from "zod";

const UpdateStatusSchema = z.object({
  isActive: z.boolean(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    
    const token = req.cookies.get("access_token")?.value;
    const payload = token ? await verifyAccessToken(token) : null;
    if (!payload || payload.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden. Super Admin privileges required." }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const parse = UpdateStatusSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: "Invalid status format." }, { status: 400 });
    }

    const newActiveState = parse.data.isActive;

    
    const targetUser = await db.user.findUnique({
      where: { id: params.id },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    
    if (targetUser.role === "SUPER_ADMIN" && !newActiveState) {
      const superAdminCount = await db.user.count({
        where: { role: "SUPER_ADMIN" },
      });
      if (superAdminCount <= 1) {
        return NextResponse.json({ error: "Cannot deactivate the last Super Admin." }, { status: 400 });
      }
    }

    
    const updatedUser = await db.user.update({
      where: { id: params.id },
      data: { isActive: newActiveState },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
      },
    });

    
    await db.auditLog.create({
      data: {
        action: newActiveState ? "USER_ACTIVATED" : "USER_DEACTIVATED",
        targetType: "User",
        targetId: params.id,
        performedBy: payload.userId,
        details: {
          isActive: newActiveState,
          targetEmail: targetUser.email || targetUser.phone || targetUser.id,
        },
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error in PATCH /api/admin/users/[id]/status:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
