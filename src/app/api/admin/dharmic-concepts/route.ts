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

export async function GET(req: NextRequest) {
  const admin = await checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const concepts = await db.dharmicConcept.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(concepts);
  } catch (err) {
    console.error("GET concepts failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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

    // Check slug uniqueness
    const exists = await db.dharmicConcept.findUnique({
      where: { slug: parse.data.slug },
    });
    if (exists) {
      return NextResponse.json({ error: "Slug must be unique" }, { status: 400 });
    }

    const concept = await db.dharmicConcept.create({
      data: parse.data,
    });

    return NextResponse.json(concept, { status: 201 });
  } catch (err) {
    console.error("POST concept failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
