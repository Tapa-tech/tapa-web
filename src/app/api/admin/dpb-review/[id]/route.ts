import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth/admin";
import { z } from "zod";

const reviewActionSchema = z.object({
  action: z.enum(["APPROVE", "REJECT"]),
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const parse = reviewActionSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: "Invalid action. Must be APPROVE or REJECT." }, { status: 400 });
    }

    const reviewStatus = parse.data.action === "APPROVE" ? "APPROVED" : "REJECTED";

    const entry = await db.dPBEntry.update({
      where: { id: params.id },
      data: {
        reviewStatus,
      },
    });

    return NextResponse.json(entry);
  } catch (err) {
    console.error("PUT DPB review action failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
