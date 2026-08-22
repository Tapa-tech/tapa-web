import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { db } from "@/lib/db";
import { z } from "zod";

const UpdateRoleSchema = z.object({
  role: z.enum(["CUSTOMER", "ADMIN", "SUPER_ADMIN"]),
});

export async function PATCH(
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

    const body = await req.json().catch(() => ({}));
    const parse = UpdateRoleSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: "Invalid role specified." }, { status: 400 });
    }

    const newRole = parse.data.role;

    // 2. Fetch the target user
    const targetUser = await db.user.findUnique({
      where: { id: params.id },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // 3. "Last Super Admin" check
    if (targetUser.role === "SUPER_ADMIN" && newRole !== "SUPER_ADMIN") {
      const superAdminCount = await db.user.count({
        where: { role: "SUPER_ADMIN" },
      });
      if (superAdminCount <= 1) {
        return NextResponse.json({ error: "Cannot demote the last Super Admin." }, { status: 400 });
      }
    }

    // 4. Perform update
    const updatedUser = await db.user.update({
      where: { id: params.id },
      data: { role: newRole },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
      },
    });

    // 5. Append to Audit Log (Immutable)
    await db.auditLog.create({
      data: {
        action: "ROLE_CHANGE",
        targetType: "User",
        targetId: params.id,
        performedBy: payload.userId,
        details: {
          from: targetUser.role,
          to: newRole,
          targetEmail: targetUser.email || targetUser.phone || targetUser.id,
        },
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error in PATCH /api/admin/users/[id]/role:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
