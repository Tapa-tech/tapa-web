import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth/admin";
import { z } from "zod";

const stepInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  note: z.string().optional().nullable(),
  order: z.number(),
});

const mantraInputSchema = z.object({
  devanagari: z.string().min(1),
  transliteration: z.string().min(1),
  meaning: z.string().min(1),
  audioUrl: z.string().optional().nullable(),
});

const samagriInputSchema = z.object({
  name: z.string().min(1),
  function: z.string().min(1),
  order: z.number(),
});

const dpbInputSchema = z.object({
  elementName: z.string().min(1),
  tag: z.enum(["DHARMA", "PRATHA", "BHRANTI"]),
  confidenceScore: z.number().min(1).max(5),
  claim: z.string().optional().nullable(),
  correction: z.string().optional().nullable(),
  sourceOfTruth: z.string().optional().nullable(),
  regionalVariance: z.string().optional().nullable(),
  reviewStatus: z.enum(["PENDING_FOUNDER_REVIEW", "APPROVED", "REJECTED"]).optional(),
});

const ritualGuideInputSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-_]+$/, "Slug must only contain lowercase letters, numbers, dashes, or underscores"),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  category: z.string().min(1),
  introText: z.string().min(1),
  sankalpaBody: z.string().min(1),
  sankalpaQuote: z.string().min(1),
  fastOptions: z.array(
    z.object({
      name: z.string(),
      desc: z.string(),
      recommended: z.boolean(),
    })
  ).default([]),
  fastNote: z.string().default(""),
  kathaTitle: z.string().min(1),
  kathaBody: z.string().min(1),
  aartiBody: z.string().optional().nullable(),
  thumbnailUrl: z.string().optional().nullable(),
  audioUrl: z.string().optional().nullable(),
  steps: z.array(stepInputSchema).default([]),
  mantras: z.array(mantraInputSchema).default([]),
  samagriItems: z.array(samagriInputSchema).default([]),
  sources: z.array(z.string()).default([]), // Source library IDs
  faqs: z.array(z.object({ faqId: z.string(), order: z.number() })).default([]),
  dpbEntries: z.array(dpbInputSchema).default([]),
});

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const guide = await db.ritualGuide.findUnique({
      where: { id: params.id },
      include: {
        steps: { orderBy: { order: "asc" } },
        mantras: true,
        samagriItems: { orderBy: { order: "asc" } },
        sources: { include: { source: true } },
        faqs: { include: { faq: true }, orderBy: { order: "asc" } },
        dpbEntries: true,
      },
    });

    if (!guide) {
      return NextResponse.json({ error: "Ritual guide not found" }, { status: 404 });
    }

    // Unpack fastOptions JSON
    let parsedFastOptions = [];
    try {
      if (typeof guide.fastOptions === "string") {
        parsedFastOptions = JSON.parse(guide.fastOptions);
      } else if (Array.isArray(guide.fastOptions)) {
        parsedFastOptions = guide.fastOptions;
      }
    } catch (e) {
      console.error("Failed to parse fastOptions:", e);
    }

    return NextResponse.json({
      ...guide,
      fastOptions: parsedFastOptions,
    });
  } catch (err) {
    console.error("GET individual ritual guide failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const parse = ritualGuideInputSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.issues[0].message }, { status: 400 });
    }

    const data = parse.data;

    // Check slug uniqueness
    const slugExists = await db.ritualGuide.findFirst({
      where: {
        slug: data.slug,
        NOT: { id: params.id },
      },
    });
    if (slugExists) {
      return NextResponse.json({ error: "Slug is already in use by another guide" }, { status: 400 });
    }

    // Integrity validations on DPB tag/scores
    for (const entry of data.dpbEntries) {
      if (entry.tag === "DHARMA" && (entry.confidenceScore < 4 || entry.confidenceScore > 5)) {
        return NextResponse.json(
          { error: `Dharma claim "${entry.elementName}" must have a confidence score of 4 or 5.` },
          { status: 400 }
        );
      }
      if (entry.tag === "PRATHA" && (entry.confidenceScore < 2 || entry.confidenceScore > 3)) {
        return NextResponse.json(
          { error: `Pratha claim "${entry.elementName}" must have a confidence score of 2 or 3.` },
          { status: 400 }
        );
      }
      if (entry.tag === "BHRANTI" && entry.confidenceScore !== 1) {
        return NextResponse.json(
          { error: `Bhranti claim "${entry.elementName}" must have a confidence score of 1.` },
          { status: 400 }
        );
      }
    }

    // Execute transaction to update
    const updatedGuide = await db.$transaction(async (tx) => {
      // 1. Update the base guide
      const guide = await tx.ritualGuide.update({
        where: { id: params.id },
        data: {
          title: data.title,
          slug: data.slug,
          status: data.status,
          category: data.category,
          introText: data.introText,
          sankalpaBody: data.sankalpaBody,
          sankalpaQuote: data.sankalpaQuote,
          fastOptions: JSON.stringify(data.fastOptions),
          fastNote: data.fastNote,
          kathaTitle: data.kathaTitle,
          kathaBody: data.kathaBody,
          aartiBody: data.aartiBody,
          thumbnailUrl: data.thumbnailUrl,
          audioUrl: data.audioUrl,
        },
      });

      // 2. Clear out steps and recreate
      await tx.ritualStep.deleteMany({ where: { ritualGuideId: params.id } });
      if (data.steps.length > 0) {
        await tx.ritualStep.createMany({
          data: data.steps.map((s) => ({
            ritualGuideId: params.id,
            title: s.title,
            description: s.description,
            note: s.note,
            order: s.order,
          })),
        });
      }

      // 3. Clear out mantras and recreate
      await tx.mantra.deleteMany({ where: { ritualGuideId: params.id } });
      if (data.mantras.length > 0) {
        await tx.mantra.createMany({
          data: data.mantras.map((m) => ({
            ritualGuideId: params.id,
            devanagari: m.devanagari,
            transliteration: m.transliteration,
            meaning: m.meaning,
            audioUrl: m.audioUrl,
          })),
        });
      }

      // 4. Clear out samagri and recreate
      await tx.samagriItem.deleteMany({ where: { ritualGuideId: params.id } });
      if (data.samagriItems.length > 0) {
        await tx.samagriItem.createMany({
          data: data.samagriItems.map((s) => ({
            ritualGuideId: params.id,
            name: s.name,
            function: s.function,
            order: s.order,
          })),
        });
      }

      // 5. Clear out sources and recreate
      await tx.ritualGuideSource.deleteMany({ where: { ritualGuideId: params.id } });
      if (data.sources.length > 0) {
        await tx.ritualGuideSource.createMany({
          data: data.sources.map((sId) => ({
            ritualGuideId: params.id,
            sourceId: sId,
          })),
        });
      }

      // 6. Clear out faqs and recreate
      await tx.ritualGuideFAQ.deleteMany({ where: { ritualGuideId: params.id } });
      if (data.faqs.length > 0) {
        await tx.ritualGuideFAQ.createMany({
          data: data.faqs.map((f) => ({
            ritualGuideId: params.id,
            faqId: f.faqId,
            order: f.order,
          })),
        });
      }

      // 7. Reconcile DPB entries
      // Rather than deleting and forcing recalculation of reviews, we look at existing ones to retain status
      const existingDpb = await tx.dPBEntry.findMany({ where: { ritualGuideId: params.id } });
      await tx.dPBEntry.deleteMany({ where: { ritualGuideId: params.id } });

      if (data.dpbEntries.length > 0) {
        await tx.dPBEntry.createMany({
          data: data.dpbEntries.map((d) => {
            // Find if there was an identical claim to preserve reviewStatus
            const match = existingDpb.find(
              (ext) =>
                ext.elementName === d.elementName &&
                ext.tag === d.tag &&
                ext.claim === d.claim &&
                ext.correction === d.correction
            );
            return {
              ritualGuideId: params.id,
              elementName: d.elementName,
              tag: d.tag,
              confidenceScore: d.confidenceScore,
              claim: d.claim,
              correction: d.correction,
              sourceOfTruth: d.sourceOfTruth,
              regionalVariance: d.regionalVariance,
              reviewStatus: match ? match.reviewStatus : (d.tag === "BHRANTI" ? "PENDING_FOUNDER_REVIEW" : "APPROVED"),
            };
          }),
        });
      }

      return guide;
    });

    return NextResponse.json(updatedGuide);
  } catch (err) {
    console.error("PUT ritual guide failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Delete base guide - relations will cascade delete due to prisma schema Cascade setup
    await db.ritualGuide.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE ritual guide failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
