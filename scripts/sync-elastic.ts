import { loadEnvConfig } from "@next/env";
// Load environment variables before importing elasticsearch client which depends on them
loadEnvConfig(process.cwd());

import { syncAllToElastic } from "../src/lib/elasticsearch";

async function run() {
  console.log("Starting bulk synchronization to Elasticsearch...");
  console.log(`ELASTICSEARCH_NODE: ${process.env.ELASTICSEARCH_NODE}`);
  console.log(`Guides Index: ${process.env.ELASTICSEARCH_INDEX_GUIDES || "tapa_guides"}`);
  console.log(`Kits Index: ${process.env.ELASTICSEARCH_INDEX_KITS || "tapa_kits"}`);

  try {
    await syncAllToElastic();
    console.log("Synchronization completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Synchronization failed:", err);
    process.exit(1);
  }
}

run();
