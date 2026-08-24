import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth/admin";
import { z } from "zod";
import { indexRitualGuide, deleteRitualGuide } from "@/lib/elasticsearch";

const stepInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  note: z.string().optional().nullable(),
  stepTags: z.string().optional().nullable(),
  order: z.number(),
});

const mantraInputSchema = z.object({
  devanagari: z.string().min(1),
  transliteration: z.string().optional().nullable().transform((v) => v || ""),
  meaning: z.string().optional().nullable().transform((v) => v || ""),
  audioUrl: z.string().optional().nullable(),
});

const samagriInputSchema = z.object({
  name: z.string().min(1),
  function: z.string().optional().nullable().transform((v) => v || ""),
  order: z.number(),
});

const dpbInputSchema = z.object({
  elementName: z.string().min(1),
  tag: z.enum(["DHARMA", "PRATHA", "BHRANTI"]),
  confidenceScore: z.number().min(0).max(5),
  claim: z.string().optional().nullable(),
  correction: z.string().optional().nullable(),
  sourceOfTruth: z.string().optional().nullable(),
  regionalVariance: z.string().optional().nullable(),
});

const ritualGuideInputSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-_]+$/, "Slug must only contain lowercase letters, numbers, dashes, or underscores"),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  category: z.string().min(1),
  introText: z.string().min(1),
  introTitle: z.string().optional().nullable(),
  introDesc: z.string().optional().nullable(),
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
  sources: z.array(z.string()).default([]), 
  faqs: z.array(z.object({ faqId: z.string(), order: z.number() })).default([]),
  dpbEntries: z.array(dpbInputSchema).default([]),
  panchangObservance: z.string().optional().nullable(),
  panchangObservanceSub: z.string().optional().nullable(),
  panchangAlignment: z.string().optional().nullable(),
  panchangMuhurta: z.string().optional().nullable(),
  panchangMuhurtaSub: z.string().optional().nullable(),
  panchangTithi: z.string().optional().nullable(),
  panchangTithiSub: z.string().optional().nullable(),
  panchangVijay: z.string().optional().nullable(),
  panchangVijaySub: z.string().optional().nullable(),
  panchangNote: z.string().optional().nullable(),
  panchangDays: z.any().optional().nullable(),
  
  heroStoryImage: z.string().optional().nullable(),
  heroImageCaption: z.string().optional().nullable(),
  narrationAudioFileUrl: z.string().optional().nullable(),
  narrationDuration: z.string().optional().nullable(),
  narrationLanguage: z.string().optional().nullable(),
  heroCtaButtons: z.any().optional().nullable(),
  sankalpaWho: z.string().optional().nullable(),
  sankalpaWhenWhere: z.string().optional().nullable(),
  sankalpaForWhat: z.string().optional().nullable(),
  sankalpaLanguageNote: z.string().optional().nullable(),
  sankalpaTitle: z.string().optional().nullable(),
  sankalpaSub: z.string().optional().nullable(),
  sankalpaDesc: z.string().optional().nullable(),
  vidhiTitle: z.string().optional().nullable(),
  vidhiSubtitle: z.string().optional().nullable(),
  vidhiMuhuratNote: z.string().optional().nullable(),
  nineFormsBannerImage: z.string().optional().nullable(),
  nineFormsBannerCaption: z.string().optional().nullable(),
  nineFormsTable: z.any().optional().nullable(),
  nineFormsColourNote: z.string().optional().nullable(),
  nineFormsOfferingsNote: z.string().optional().nullable(),
  kathaSourceLabel: z.string().optional().nullable(),
  kathaCardHeadline: z.string().optional().nullable(),
  kathaCardTeaser: z.string().optional().nullable(),
  kathaAudioDuration: z.string().optional().nullable(),
  kathaAudioFileUrl: z.string().optional().nullable(),
  kathaSteps: z.any().optional().nullable(),
  kathaWhyNineNightsNote: z.string().optional().nullable(),
  ashtamiNavamiBody: z.string().optional().nullable(),
  ashtamiNavamiTag: z.string().optional().nullable(),
  ashtamiNavamiSandhiNote: z.string().optional().nullable(),
  deepDiveTitle: z.string().optional().nullable(),
  deepDiveTeaser: z.string().optional().nullable(),
  deepDiveBody: z.string().optional().nullable(),
  deepDiveConceptId: z.string().optional().nullable(),
  deepDiveClosingText: z.string().optional().nullable(),
  relatedRitualGuides: z.any().optional().nullable(),
  relatedPujans: z.any().optional().nullable(),
  relatedConcepts: z.any().optional().nullable(),
  relatedDates: z.any().optional().nullable(),
  preferCareGlobal: z.boolean().optional().default(true),
  kitName: z.string().optional().nullable(),
  kitPrice: z.string().optional().nullable(),
  kitDescription: z.string().optional().nullable(),
  purohitServiceDescription: z.string().optional().nullable(),
  tapaCircleDescription: z.string().optional().nullable(),
  showKitCard: z.boolean().optional().default(true),
  showPurohitCard: z.boolean().optional().default(true),
  showCircleCard: z.boolean().optional().default(true),
});

export async function GET(req: NextRequest) {
  const admin = await checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const guides = await db.ritualGuide.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        category: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(guides);
  } catch (err) {
    console.error("GET ritual guides failed:", err);
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
    const parse = ritualGuideInputSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.issues[0].message }, { status: 400 });
    }

    const data = parse.data;

    
    const slugExists = await db.ritualGuide.findUnique({
      where: { slug: data.slug },
    });
    if (slugExists) {
      return NextResponse.json({ error: "Slug is already in use by another guide" }, { status: 400 });
    }

    
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
      if (entry.tag === "BHRANTI" && entry.confidenceScore !== 0) {
        return NextResponse.json(
          { error: `Bhranti claim "${entry.elementName}" must have a confidence score of 0.` },
          { status: 400 }
        );
      }
    }

    
    const guide = await db.$transaction(async (tx) => {
      const createdGuide = await tx.ritualGuide.create({
        data: {
          title: data.title,
          slug: data.slug,
          status: data.status,
          category: data.category,
          introText: data.introText,
          introTitle: data.introTitle,
          introDesc: data.introDesc,
          sankalpaBody: data.sankalpaBody,
          sankalpaQuote: data.sankalpaQuote,
          fastOptions: JSON.stringify(data.fastOptions),
          fastNote: data.fastNote,
          kathaTitle: data.kathaTitle,
          kathaBody: data.kathaBody,
          aartiBody: data.aartiBody,
          thumbnailUrl: data.thumbnailUrl,
          audioUrl: data.audioUrl,
          panchangObservance: data.panchangObservance,
          panchangObservanceSub: data.panchangObservanceSub,
          panchangAlignment: data.panchangAlignment,
          panchangMuhurta: data.panchangMuhurta,
          panchangMuhurtaSub: data.panchangMuhurtaSub,
          panchangTithi: data.panchangTithi,
          panchangTithiSub: data.panchangTithiSub,
          panchangVijay: data.panchangVijay,
          panchangVijaySub: data.panchangVijaySub,
          panchangNote: data.panchangNote,
          panchangDays: data.panchangDays ? (typeof data.panchangDays === 'string' ? JSON.parse(data.panchangDays) : data.panchangDays) : undefined,
          heroStoryImage: data.heroStoryImage,
          heroImageCaption: data.heroImageCaption,
          narrationAudioFileUrl: data.narrationAudioFileUrl,
          narrationDuration: data.narrationDuration,
          narrationLanguage: data.narrationLanguage,
          heroCtaButtons: data.heroCtaButtons ? (typeof data.heroCtaButtons === 'string' ? JSON.parse(data.heroCtaButtons) : data.heroCtaButtons) : undefined,
          sankalpaWho: data.sankalpaWho,
          sankalpaWhenWhere: data.sankalpaWhenWhere,
          sankalpaForWhat: data.sankalpaForWhat,
          sankalpaLanguageNote: data.sankalpaLanguageNote,
          sankalpaTitle: data.sankalpaTitle,
          sankalpaSub: data.sankalpaSub,
          sankalpaDesc: data.sankalpaDesc,
          vidhiTitle: data.vidhiTitle,
          vidhiSubtitle: data.vidhiSubtitle,
          vidhiMuhuratNote: data.vidhiMuhuratNote,
          nineFormsBannerImage: data.nineFormsBannerImage,
          nineFormsBannerCaption: data.nineFormsBannerCaption,
          nineFormsTable: data.nineFormsTable ? (typeof data.nineFormsTable === 'string' ? JSON.parse(data.nineFormsTable) : data.nineFormsTable) : undefined,
          nineFormsColourNote: data.nineFormsColourNote,
          nineFormsOfferingsNote: data.nineFormsOfferingsNote,
          kathaSourceLabel: data.kathaSourceLabel,
          kathaCardHeadline: data.kathaCardHeadline,
          kathaCardTeaser: data.kathaCardTeaser,
          kathaAudioDuration: data.kathaAudioDuration,
          kathaAudioFileUrl: data.kathaAudioFileUrl,
          kathaSteps: data.kathaSteps ? (typeof data.kathaSteps === 'string' ? JSON.parse(data.kathaSteps) : data.kathaSteps) : undefined,
          kathaWhyNineNightsNote: data.kathaWhyNineNightsNote,
          ashtamiNavamiBody: data.ashtamiNavamiBody,
          ashtamiNavamiTag: data.ashtamiNavamiTag,
          ashtamiNavamiSandhiNote: data.ashtamiNavamiSandhiNote,
          deepDiveTitle: data.deepDiveTitle,
          deepDiveTeaser: data.deepDiveTeaser,
          deepDiveBody: data.deepDiveBody,
          deepDiveConceptId: data.deepDiveConceptId,
          deepDiveClosingText: data.deepDiveClosingText,
          relatedRitualGuides: data.relatedRitualGuides ? (typeof data.relatedRitualGuides === 'string' ? JSON.parse(data.relatedRitualGuides) : data.relatedRitualGuides) : undefined,
          relatedPujans: data.relatedPujans ? (typeof data.relatedPujans === 'string' ? JSON.parse(data.relatedPujans) : data.relatedPujans) : undefined,
          relatedConcepts: data.relatedConcepts ? (typeof data.relatedConcepts === 'string' ? JSON.parse(data.relatedConcepts) : data.relatedConcepts) : undefined,
          relatedDates: data.relatedDates ? (typeof data.relatedDates === 'string' ? JSON.parse(data.relatedDates) : data.relatedDates) : undefined,
          preferCareGlobal: data.preferCareGlobal,
          kitName: data.kitName,
          kitPrice: data.kitPrice,
          kitDescription: data.kitDescription,
          purohitServiceDescription: data.purohitServiceDescription,
          tapaCircleDescription: data.tapaCircleDescription,
          showKitCard: data.showKitCard,
          showPurohitCard: data.showPurohitCard,
          showCircleCard: data.showCircleCard,
        },
      });

      
      if (data.steps.length > 0) {
        await tx.ritualStep.createMany({
          data: data.steps.map((s) => ({
            ritualGuideId: createdGuide.id,
            title: s.title,
            description: s.description,
            note: s.note,
            stepTags: s.stepTags,
            order: s.order,
          })),
        });
      }

      
      if (data.mantras.length > 0) {
        await tx.mantra.createMany({
          data: data.mantras.map((m) => ({
            ritualGuideId: createdGuide.id,
            devanagari: m.devanagari,
            transliteration: m.transliteration,
            meaning: m.meaning,
            audioUrl: m.audioUrl,
          })),
        });
      }

      
      if (data.samagriItems.length > 0) {
        await tx.samagriItem.createMany({
          data: data.samagriItems.map((s) => ({
            ritualGuideId: createdGuide.id,
            name: s.name,
            function: s.function,
            order: s.order,
          })),
        });
      }

      
      if (data.sources.length > 0) {
        await tx.ritualGuideSource.createMany({
          data: data.sources.map((sId) => ({
            ritualGuideId: createdGuide.id,
            sourceId: sId,
          })),
        });
      }

      
      if (data.faqs.length > 0) {
        await tx.ritualGuideFAQ.createMany({
          data: data.faqs.map((f) => ({
            ritualGuideId: createdGuide.id,
            faqId: f.faqId,
            order: f.order,
          })),
        });
      }

      
      if (data.dpbEntries.length > 0) {
        await tx.dPBEntry.createMany({
          data: data.dpbEntries.map((d) => ({
            ritualGuideId: createdGuide.id,
            elementName: d.elementName,
            tag: d.tag,
            confidenceScore: d.confidenceScore,
            claim: d.claim,
            correction: d.correction,
            sourceOfTruth: d.sourceOfTruth,
            regionalVariance: d.regionalVariance,
            reviewStatus: d.tag === "BHRANTI" ? "PENDING_FOUNDER_REVIEW" : "APPROVED",
          })),
        });
      }

      return createdGuide;
    });

    
    if (guide && guide.id) {
      indexRitualGuide(guide.id).catch((err) => {
        console.error("Background Elasticsearch indexing failed:", err);
      });
    }

    return NextResponse.json(guide, { status: 201 });
  } catch (err) {
    console.error("POST ritual guide failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = await checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    
    const guides = await db.ritualGuide.findMany({
      select: { id: true },
    });

    
    await db.ritualGuide.deleteMany();

    
    for (const guide of guides) {
      deleteRitualGuide(guide.id).catch((err) => {
        console.error(`Background Elasticsearch delete failed for guide ${guide.id}:`, err);
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE all ritual guides failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

