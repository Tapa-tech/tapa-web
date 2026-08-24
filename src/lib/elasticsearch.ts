import { Client } from "@elastic/elasticsearch";
import { db } from "./db";

let client: Client | null = null;
let connectionFailed = false;


export function getElasticClient(): Client | null {
  const node = process.env.ELASTICSEARCH_NODE;
  if (!node) {
    return null;
  }

  if (client) {
    return client;
  }
  if (connectionFailed) {
    return null;
  }

  try {
    client = new Client({
      node,
      maxRetries: 1,
      requestTimeout: 1500, 
    });
    return client;
  } catch (err) {
    console.error("Elasticsearch initialization failed:", err);
    connectionFailed = true;
    return null;
  }
}


export async function testConnection(): Promise<boolean> {
  const c = getElasticClient();
  if (!c) {
    return false;
  }
  try {
    await c.ping();
    connectionFailed = false;
    return true;
  } catch (err) {
    console.error("Elasticsearch ping failed, marking connection as down:", err);
    connectionFailed = true;
    client = null;
    return false;
  }
}


export async function getSearchableBlobForGuide(guideId: string) {
  const guide = await db.ritualGuide.findUnique({
    where: { id: guideId },
    include: {
      steps: true,
      mantras: true,
      samagriItems: true,
      faqs: { include: { faq: true } },
    },
  });

  if (!guide) {
    return null;
  }

  const parts: string[] = [
    guide.title,
    guide.category,
    guide.introText,
    guide.kathaTitle,
    guide.kathaBody,
    guide.sankalpaBody,
    guide.sankalpaQuote,
    guide.fastNote,
  ];

  if (guide.aartiBody) {
    parts.push(guide.aartiBody);
  }

  guide.steps.forEach((s) => {
    parts.push(s.title);
    parts.push(s.description);
    if (s.note) {
      parts.push(s.note);
    }
  });

  guide.mantras.forEach((m) => {
    parts.push(m.devanagari);
    parts.push(m.transliteration);
    parts.push(m.meaning);
  });

  guide.samagriItems.forEach((s) => {
    parts.push(s.name);
    parts.push(s.function);
  });

  guide.faqs.forEach((f) => {
    if (f.faq) {
      parts.push(f.faq.question);
      parts.push(f.faq.answer);
    }
  });

  return {
    id: guide.id,
    title: guide.title,
    slug: guide.slug,
    category: guide.category,
    status: guide.status,
    content: parts.filter(Boolean).join(" "),
  };
}


export async function indexRitualGuide(guideId: string) {
  const c = getElasticClient();
  if (!c) {
    return;
  }

  try {
    const data = await getSearchableBlobForGuide(guideId);
    if (!data) {
      return;
    }

    if (data.status !== "PUBLISHED") {
      await deleteRitualGuide(guideId);
      return;
    }

    const indexName = process.env.ELASTICSEARCH_INDEX_GUIDES || "tapa_guides";
    await c.index({
      index: indexName,
      id: data.id,
      document: {
        id: data.id,
        title: data.title,
        slug: data.slug,
        category: data.category,
        content: data.content,
      },
    });
  } catch (err) {
    console.error(`Failed to index ritual guide ${guideId}:`, err);
  }
}


export async function deleteRitualGuide(guideId: string) {
  const c = getElasticClient();
  if (!c) {
    return;
  }

  try {
    const indexName = process.env.ELASTICSEARCH_INDEX_GUIDES || "tapa_guides";
    await c.delete(
      {
        index: indexName,
        id: guideId,
      },
      { ignore: [404] }
    );
  } catch (err) {
    console.error(`Failed to delete ritual guide ${guideId}:`, err);
  }
}


export async function syncAllToElastic() {
  const c = getElasticClient();
  if (!c) {
    throw new Error("Elasticsearch client not configured or unreachable");
  }

  const guideIndex = process.env.ELASTICSEARCH_INDEX_GUIDES || "tapa_guides";
  const kitIndex = process.env.ELASTICSEARCH_INDEX_KITS || "tapa_kits";

  
  await c.indices.delete({ index: guideIndex }, { ignore: [404] });
  await c.indices.delete({ index: kitIndex }, { ignore: [404] });

  const settings = {
    analysis: {
      analyzer: {
        autocomplete: {
          type: "custom" as const,
          tokenizer: "autocomplete",
          filter: ["lowercase"],
        },
        autocomplete_search: {
          type: "custom" as const,
          tokenizer: "lowercase",
        },
      },
      tokenizer: {
        autocomplete: {
          type: "edge_ngram" as const,
          min_gram: 2,
          max_gram: 15,
          token_chars: ["letter", "digit"] as any,
        },
      },
    },
  };

  await c.indices.create({
    index: guideIndex,
    settings,
    mappings: {
      properties: {
        id: { type: "keyword" },
        title: {
          type: "text",
          analyzer: "autocomplete",
          search_analyzer: "autocomplete_search",
        },
        category: { type: "keyword" },
        slug: { type: "keyword" },
        content: { type: "text" },
      },
    },
  });

  await c.indices.create({
    index: kitIndex,
    settings,
    mappings: {
      properties: {
        id: { type: "keyword" },
        name: {
          type: "text",
          analyzer: "autocomplete",
          search_analyzer: "autocomplete_search",
        },
        hindi: { type: "text" },
        occ: { type: "text" },
        deity: { type: "text" },
        price: { type: "float" },
        itemsCount: { type: "keyword" },
        delivery: { type: "text" },
      },
    },
  });

  
  const publishedGuides = await db.ritualGuide.findMany({
    where: { status: "PUBLISHED" },
    select: { id: true },
  });

  for (const g of publishedGuides) {
    await indexRitualGuide(g.id);
  }

  
  const kits = await db.ritualKit.findMany();
  for (const k of kits) {
    await indexRitualKit(k.id);
  }
}


export async function indexRitualKit(kitId: string) {
  const c = getElasticClient();
  if (!c) {
    return;
  }

  try {
    const kit = await db.ritualKit.findUnique({
      where: { id: kitId },
    });
    if (!kit) {
      return;
    }

    const indexName = process.env.ELASTICSEARCH_INDEX_KITS || "tapa_kits";
    await c.index({
      index: indexName,
      id: kit.id,
      document: kit,
    });
  } catch (err) {
    console.error(`Failed to index ritual kit ${kitId}:`, err);
  }
}


export async function deleteRitualKit(kitId: string) {
  const c = getElasticClient();
  if (!c) {
    return;
  }

  try {
    const indexName = process.env.ELASTICSEARCH_INDEX_KITS || "tapa_kits";
    await c.delete(
      {
        index: indexName,
        id: kitId,
      },
      { ignore: [404] }
    );
  } catch (err) {
    console.error(`Failed to delete ritual kit ${kitId}:`, err);
  }
}
