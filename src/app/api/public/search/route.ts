import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// Keep in sync with the 13 kits available on the frontend
import { getElasticClient } from "@/lib/elasticsearch";

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q") || "";
    if (!q.trim()) {
      return NextResponse.json({ guides: [], kits: [] });
    }

    // Attempt Elasticsearch query if client is initialized
    const elasticClient = getElasticClient();
    if (elasticClient) {
      try {
        const guideIndex = process.env.ELASTICSEARCH_INDEX_GUIDES || "tapa_guides";
        const kitIndex = process.env.ELASTICSEARCH_INDEX_KITS || "tapa_kits";

        const [guidesResponse, kitsResponse] = await Promise.all([
          elasticClient.search({
            index: guideIndex,
            query: {
              multi_match: {
                query: q,
                fields: ["title^3", "category^2", "content"],
                fuzziness: "AUTO",
              },
            },
            size: 6,
          }),
          elasticClient.search({
            index: kitIndex,
            query: {
              multi_match: {
                query: q,
                fields: ["name^3", "hindi^2", "occ^1.5", "deity^1.5", "delivery"],
                fuzziness: "AUTO",
              },
            },
            size: 4,
          }),
        ]);

        interface ElasticHit {
          _source: {
            id: string;
            title: string;
            slug: string;
            category: string;
            name?: string;
          };
        }

        const guides = (guidesResponse.hits.hits as unknown as ElasticHit[] || []).map((hit) => ({
          id: hit._source.id,
          title: hit._source.title,
          slug: hit._source.slug,
          category: hit._source.category,
        }));

        const kits = (kitsResponse.hits.hits as unknown as ElasticHit[] || []).map((hit) => hit._source);

        return NextResponse.json({ guides, kits });
      } catch (elasticErr) {
        console.error("Elasticsearch search query failed. Falling back to direct database query:", elasticErr);
      }
    }

    // FALLBACK: Search Ritual Guides in the Database with proper matching across relevant fields
    const guides = await db.ritualGuide.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { category: { contains: q, mode: "insensitive" } },
          { introText: { contains: q, mode: "insensitive" } },
          { kathaTitle: { contains: q, mode: "insensitive" } },
          { kathaBody: { contains: q, mode: "insensitive" } },
          {
            steps: {
              some: {
                OR: [
                  { title: { contains: q, mode: "insensitive" } },
                  { description: { contains: q, mode: "insensitive" } },
                ],
              },
            },
          },
          {
            mantras: {
              some: {
                OR: [
                  { devanagari: { contains: q, mode: "insensitive" } },
                  { transliteration: { contains: q, mode: "insensitive" } },
                  { meaning: { contains: q, mode: "insensitive" } },
                ],
              },
            },
          },
          {
            samagriItems: {
              some: {
                OR: [
                  { name: { contains: q, mode: "insensitive" } },
                  { function: { contains: q, mode: "insensitive" } },
                ],
              },
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
      },
      take: 6,
    });

    // FALLBACK: Search Ritual Kits in the database
    const kits = await db.ritualKit.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { occ: { contains: q, mode: "insensitive" } },
          { deity: { contains: q, mode: "insensitive" } },
          { hindi: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 4,
    });

    return NextResponse.json({ guides, kits });
  } catch (err) {
    console.error("Public search API error:", err);
    return NextResponse.json({ error: "Internal Search Error" }, { status: 500 });
  }
}

