import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth/admin";
import { z } from "zod";

const conceptSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().regex(/^[a-z0-9-_]+$/, "Slug must only contain lowercase letters, numbers, dashes, or underscores"),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  body: z.string().min(1, "Body is required"),
  thumbnailUrl: z.string().url("Invalid image URL").or(z.literal("")).optional(),
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const parse = conceptSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.issues[0].message }, { status: 400 });
    }

    // Check slug uniqueness (excluding current)
    const exists = await db.dharmicConcept.findFirst({
      where: {
        slug: parse.data.slug,
        NOT: { id: params.id },
      },
    });
    if (exists) {
      return NextResponse.json({ error: "Slug is already in use by another concept" }, { status: 400 });
    }

    const concept = await db.dharmicConcept.update({
      where: { id: params.id },
      data: parse.data,
    });

    return NextResponse.json(concept);
  } catch (err) {
    console.error("PUT concept failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await db.dharmicConcept.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE concept failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
