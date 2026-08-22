const cp = require("child_process");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

// Ensure public/uploads directory exists
const uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 1. Mappings of docx file paths to their target models, slugs, categories and thumbnail image files
const fileMappings = [
  // Sundarkand folder
  {
    filePath: "main docs /Editorial/Sundarkand/Why Sundar/Why_Sundar.docx",
    imagePath: "main docs /Editorial/Sundarkand/Why Sundar/Why Sundar.png",
    thumbnailName: "why-sundar.png",
    type: "concept",
    slug: "why-sundar",
    category: "Sundarkand",
  },
  {
    filePath: "main docs /Editorial/Sundarkand/BG-Sundarkand for Beginners/Sundarkand for Beginners.docx",
    imagePath: "main docs /Editorial/Sundarkand/BG-Sundarkand for Beginners/Sundarkand for Beginners.png",
    thumbnailName: "sundarkand-beginners.png",
    type: "concept",
    slug: "sundarkand-beginners",
    category: "Sundarkand",
  },
  {
    filePath: "main docs /Editorial/Sundarkand/DC-Hanumanji-Tue-Sat Connection/Hanumanji-Tue-Sat Connection.docx",
    imagePath: "main docs /Editorial/Sundarkand/DC-Hanumanji-Tue-Sat Connection/DC.png",
    thumbnailName: "hanumanji-tue-sat-connection.png",
    type: "concept",
    slug: "hanumanji-tue-sat-connection",
    category: "Sundarkand",
  },
  {
    filePath: "main docs /Editorial/Sundarkand/DC-Sundarkand Contains/Sundarkand_Contains.docx",
    imagePath: "main docs /Editorial/Sundarkand/DC-Sundarkand Contains/Contaims.png",
    thumbnailName: "sundarkand-contains.png",
    type: "concept",
    slug: "sundarkand-contains",
    category: "Sundarkand",
  },
  {
    filePath: "main docs /Editorial/Sundarkand/DC-Why is Sundarkand Recited_Sep/Why_Sundarkand_Recited_Separately.docx",
    imagePath: "main docs /Editorial/Sundarkand/DC-Why is Sundarkand Recited_Sep/Why is SK Recited sep.png",
    thumbnailName: "why-sundarkand-recited-separately.png",
    type: "concept",
    slug: "why-sundarkand-recited-separately",
    category: "Sundarkand",
  },
  {
    filePath: "main docs /Editorial/Sundarkand/BG-Ramcharitmanas_7_Kand Explained/Ramcharitmanas_7_Kandas_Explained.docx",
    imagePath: "main docs /Brand Assets/Logos & DPs/DP 3.png", // fallback image
    thumbnailName: "ramcharitmanas-7-kandas-explained.png",
    type: "concept",
    slug: "ramcharitmanas-7-kandas-explained",
    category: "Sundarkand",
  },
  {
    filePath: "main docs /Editorial/Sundarkand/RG-Hanuman Chalisa Guide/Hanuman_Chalisa_Guide.docx",
    imagePath: "main docs /Editorial/Sundarkand/RG-Hanuman Chalisa Guide/HC Guide 1.png",
    thumbnailName: "hanuman-chalisa-guide.png",
    type: "guide",
    slug: "hanuman-chalisa-guide",
    category: "All-Year Pujans",
  },
  {
    filePath: "main docs /Editorial/Sundarkand/RG-Hanuman-Tue-Sat/Hanuman-Tue-Sat.docx",
    imagePath: "main docs /Editorial/Sundarkand/RG-Hanuman-Tue-Sat/Hanu.png",
    thumbnailName: "hanuman-tue-sat.png",
    type: "guide",
    slug: "hanuman-tue-sat",
    category: "All-Year Pujans",
  },
  {
    filePath: "main docs /Editorial/Sundarkand/RG-Sundarkand/Sundarkand_Path_Home_Vidhi.docx",
    imagePath: "main docs /Editorial/Sundarkand/RG-Sundarkand/SKP 1.png",
    thumbnailName: "sundarkand-path-home-vidhi.png",
    type: "guide",
    slug: "sundarkand-path-home-vidhi",
    category: "All-Year Pujans",
  },

  // Aug 2026 folder
  {
    filePath: "main docs /Editorial/Aug 2026/Ritual Guides/Hariyali Teej/Hariyali_Teej_Editorial_Draft.docx",
    imagePath: "main docs /Editorial/Aug 2026/Ritual Guides/Hariyali Teej/HT 1.png",
    thumbnailName: "hariyali-teej.png",
    type: "guide",
    slug: "hariyali-teej",
    category: "Festive Pujans",
  },
  {
    filePath: "main docs /Editorial/Aug 2026/Ritual Guides/Kajari Teej/Kajari_Teej_Editorial_Draft.docx",
    imagePath: "main docs /Editorial/Aug 2026/Ritual Guides/Kajari Teej/1.png",
    thumbnailName: "kajari-teej.png",
    type: "guide",
    slug: "kajari-teej",
    category: "Festive Pujans",
  },
  {
    filePath: "main docs /Editorial/Aug 2026/Ritual Guides/Hartalika Teej/Hartalika_Teej_Editorial_Draft.docx",
    imagePath: "main docs /Editorial/Aug 2026/Ritual Guides/Hartalika Teej/1.png",
    thumbnailName: "hartalika-teej.png",
    type: "guide",
    slug: "hartalika-teej",
    category: "Festive Pujans",
  },
  {
    filePath: "main docs /Editorial/Aug 2026/Ritual Guides/Shravana Putrada Ekadashi/Shravana_Putrada_Ekadashi_Editorial_Draft.docx",
    imagePath: "main docs /Editorial/Aug 2026/Ritual Guides/Shravana Putrada Ekadashi/1.png",
    thumbnailName: "shravana-putrada-ekadashi.png",
    type: "guide",
    slug: "shravana-putrada-ekadashi",
    category: "Festive Pujans",
  },
  {
    filePath: "main docs /Editorial/Aug 2026/Ritual Guides/Nag Panchami/Nag_Panchami_Editorial_Draft.docx",
    imagePath: "main docs /Editorial/Aug 2026/Ritual Guides/Nag Panchami/Image 1.png",
    thumbnailName: "nag-panchami.png",
    type: "guide",
    slug: "nag-panchami",
    category: "Festive Pujans",
  },
  {
    filePath: "main docs /Editorial/Aug 2026/Ritual Guides/Sawan Somwar/Sawan_Somwar_Vrat_Editorial_Draft.docx",
    imagePath: "main docs /Editorial/Aug 2026/Ritual Guides/Sawan Somwar/1.png",
    thumbnailName: "sawan-somwar.png",
    type: "guide",
    slug: "sawan-somwar",
    category: "Festive Pujans",
  },
  {
    filePath: "main docs /Editorial/Aug 2026/Ritual Guides/Rakshabandhan/Raksha_Bandhan_Editorial_Draft.docx",
    imagePath: "main docs /Editorial/Aug 2026/Ritual Guides/Rakshabandhan/RB.png",
    thumbnailName: "rakshabandhan.png",
    type: "guide",
    slug: "rakshabandhan",
    category: "Festive Pujans",
  },
  {
    filePath: "main docs /Editorial/Aug 2026/Ritual Guides/Kamika Ekadashi/Kamika_Ekadashi_Editorial_Draft.docx",
    imagePath: "main docs /Editorial/Aug 2026/Ritual Guides/Kamika Ekadashi/KE 1.png",
    thumbnailName: "kamika-ekadashi.png",
    type: "guide",
    slug: "kamika-ekadashi",
    category: "Festive Pujans",
  },
  {
    filePath: "main docs /Editorial/Aug 2026/Dharmic Concepts/Three Teejs Comparison/Three_Teejs_Comparison.docx",
    imagePath: "main docs /Editorial/Aug 2026/Dharmic Concepts/Three Teejs Comparison/3 Teejs.png",
    thumbnailName: "three-teejs-comparison.png",
    type: "concept",
    slug: "three-teejs-comparison",
    category: "Festive Pujans",
  },
  {
    filePath: "main docs /Editorial/Aug 2026/Dharmic Concepts/Why Thread Tied/Why_Thread_Tied_Raksha_Sutra.docx",
    imagePath: "main docs /Editorial/Aug 2026/Dharmic Concepts/Why Thread Tied/why thread tied on rakhi.png",
    thumbnailName: "why-thread-tied-raksha-sutra.png",
    type: "concept",
    slug: "why-thread-tied-raksha-sutra",
    category: "Festive Pujans",
  },
  {
    filePath: "main docs /Editorial/Aug 2026/Dharmic Concepts/Rakhi - 3 Threads 3 Stories/Three_Stories_One_Thread.docx",
    imagePath: "main docs /Editorial/Aug 2026/Dharmic Concepts/Rakhi - 3 Threads 3 Stories/3 Stories.png",
    thumbnailName: "three-stories-one-thread.png",
    type: "concept",
    slug: "three-stories-one-thread",
    category: "Festive Pujans",
  },
  {
    filePath: "main docs /Editorial/Aug 2026/Dharmic Concepts/Why is Bilva dear to Shiva/Bilva_Mahadev_Dharmic_Concept.docx",
    imagePath: "main docs /Editorial/Aug 2026/Dharmic Concepts/Why is Bilva dear to Shiva/Bilva.png",
    thumbnailName: "bilva-mahadev.png",
    type: "concept",
    slug: "bilva-mahadev",
    category: "Festive Pujans",
  },

  // Sep 2026 folder
  {
    filePath: "main docs /Editorial/Sep 2026/Ritual Guides_Sep26/Aja Ekadashi/Aja_Ekadashi_Editorial_Draft.docx",
    imagePath: "main docs /Editorial/Sep 2026/Ritual Guides_Sep26/Aja Ekadashi/AE.png",
    thumbnailName: "aja-ekadashi.png",
    type: "guide",
    slug: "aja-ekadashi",
    category: "Festive Pujans",
  },
  {
    filePath: "main docs /Editorial/Sep 2026/Ritual Guides_Sep26/Janmashtami/Krishna_Janmashtami_Editorial_Draft.docx",
    imagePath: "main docs /Editorial/Sep 2026/Ritual Guides_Sep26/Janmashtami/KJ 1.png",
    thumbnailName: "krishna-janmashtami.png",
    type: "guide",
    slug: "krishna-janmashtami",
    category: "Festive Pujans",
  },
  {
    filePath: "main docs /Editorial/Sep 2026/Ritual Guides_Sep26/Radha Ashtami/Radha_Ashtami_Editorial_Draft.docx",
    imagePath: "main docs /Editorial/Sep 2026/Ritual Guides_Sep26/Radha Ashtami/RA 1.png",
    thumbnailName: "radha-ashtami.png",
    type: "guide",
    slug: "radha-ashtami",
    category: "Festive Pujans",
  },
  {
    filePath: "main docs /Editorial/Sep 2026/Ritual Guides_Sep26/Satyanarayan Katha/Satyanarayan_Katha_Puja_Guide.docx",
    imagePath: "main docs /Editorial/Sep 2026/Ritual Guides_Sep26/Satyanarayan Katha/SK 1.png",
    thumbnailName: "satyanarayan-katha.png",
    type: "guide",
    slug: "satyanarayan-katha",
    category: "Festive Pujans",
  },
  {
    filePath: "main docs /Editorial/Sep 2026/Ritual Guides_Sep26/Ganesh_Chaturthi_10Day/Ganesh_Chaturthi_10Day_Guide.docx",
    imagePath: "main docs /Editorial/Sep 2026/Ritual Guides_Sep26/Ganesh_Chaturthi_10Day/GS 1.png",
    thumbnailName: "ganesh-chaturthi-10day.png",
    type: "guide",
    slug: "ganesh-chaturthi-10day",
    category: "Festive Pujans",
  },
  {
    filePath: "main docs /Editorial/Sep 2026/Ritual Guides_Sep26/Parsva Ekadashi/Parsva_Ekadashi_Editorial_Draft.docx",
    imagePath: "main docs /Editorial/Sep 2026/Ritual Guides_Sep26/Parsva Ekadashi/KE 1.png",
    thumbnailName: "parsva-ekadashi.png",
    type: "guide",
    slug: "parsva-ekadashi",
    category: "Festive Pujans",
  },
  {
    filePath: "main docs /Editorial/Sep 2026/Beginner_s Guide_Sep 26/Ganesh_Chaturthi_For_Beginners.docx",
    imagePath: "main docs /Editorial/Sep 2026/Beginner_s Guide_Sep 26/Ganpati Beginner_s.png",
    thumbnailName: "ganesh-chaturthi-beginners.png",
    type: "concept",
    slug: "ganesh-chaturthi-beginners",
    category: "Ganesha",
  },
  {
    filePath: "main docs /Editorial/Sep 2026/Dharmic Concepts_Sep 26/Why_Durva_Offered_Ganesha.docx",
    imagePath: "main docs /Editorial/Sep 2026/Dharmic Concepts_Sep 26/Why Durva.png",
    thumbnailName: "why-durva-offered-ganesha.png",
    type: "concept",
    slug: "why-durva-offered-ganesha",
    category: "Ganesha",
  },
  {
    filePath: "main docs /Editorial/Sep 2026/Dharmic Concepts_Sep 26/Eco_Friendly_Ganesh_Chaturthi.docx",
    imagePath: "main docs /Editorial/Sep 2026/Dharmic Concepts_Sep 26/Eco-Friendly Bappa.png",
    thumbnailName: "eco-friendly-ganesh-chaturthi.png",
    type: "concept",
    slug: "eco-friendly-ganesh-chaturthi",
    category: "Ganesha",
  },
  {
    filePath: "main docs /Editorial/Sep 2026/Dharmic Concepts_Sep 26/Why_Ganesha_Elephant_Head.docx",
    imagePath: "main docs /Editorial/Sep 2026/Dharmic Concepts_Sep 26/Why elephant.png",
    thumbnailName: "why-ganesha-elephant-head.png",
    type: "concept",
    slug: "why-ganesha-elephant-head",
    category: "Ganesha",
  },
  {
    filePath: "main docs /Editorial/Aug 2026/Panchang/Eclipse 12-28 Aug/Eclipse_Explainer_Panchang_Draft.docx",
    imagePath: "main docs /Editorial/Aug 2026/Panchang/Eclipse 12-28 Aug/E1.png",
    thumbnailName: "eclipse-explainer.png",
    type: "concept",
    slug: "eclipse-explainer",
    category: "Panchang",
  },
  {
    filePath: "main docs /Editorial/Aug 2026/Panchang/How to read panchang/How_To_Read_Panchang_Draft.docx",
    imagePath: "main docs /Editorial/Aug 2026/Panchang/How to read panchang/P1.png",
    thumbnailName: "how-to-read-panchang.png",
    type: "concept",
    slug: "how-to-read-panchang",
    category: "Panchang",
  },
];

// Copy Ritual Kits images directly to uploads folder
const kitImages = [
  { src: "main docs /Ritual Kits/Sundarkand Kit.png", dest: "sundarkand-path.png" },
  { src: "main docs /Ritual Kits/Diya Box SBS.png", dest: "shashti-deepam.png" },
  { src: "main docs /Ritual Kits/Navratri Pink.png", dest: "shubh-sampada.png" },
  { src: "main docs /Ritual Kits/Sarv Mangalam E.png", dest: "shakti-aradhana.png" },
  { src: "main docs /Ritual Kits/Pitru.png", dest: "ekadash.png" },
  { src: "main docs /Ritual Kits/havan.png", dest: "yajna.png" },
  { src: "main docs /Ritual Kits/Thakur ji Kit.png", dest: "satyanarayan-pujan.png" },
  { src: "main docs /Ritual Kits/Janmashtami Box A.png", dest: "tulsi-kalyanam.png" },
  { src: "main docs /Ritual Kits/Janmashtami Box B.png", dest: "panch-jyoti.png" },
];

function getDocxParagraphs(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    console.error(`File does not exist: ${fullPath}`);
    return [];
  }
  try {
    const xml = cp.execSync(`unzip -p "${fullPath}" word/document.xml 2>/dev/null`).toString();
    const pMatches = xml.split(/<\/w:p>/);
    const paragraphs = [];
    for (const pXml of pMatches) {
      const tMatches = [...pXml.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)];
      const text = tMatches.map(m => m[1]).join("");
      if (text.trim()) {
        paragraphs.push(text.trim());
      }
    }
    return paragraphs;
  } catch (e) {
    console.error(`Failed to unzip/parse ${filePath}:`, e);
    return [];
  }
}

function buildTiptapJson(paragraphs) {
  return JSON.stringify({
    type: "doc",
    content: paragraphs.map((p) => ({
      type: "paragraph",
      content: [{ type: "text", text: p }],
    })),
  });
}

function isEditorialOrMetadata(p) {
  const l = p.trim();
  const lower = l.toLowerCase();
  
  if (
    l.startsWith("PART A") ||
    l.startsWith("PART B") ||
    l.startsWith("PART C") ||
    lower.includes("backend") ||
    lower.includes("image brief") ||
    lower.includes("checklist") ||
    lower.includes("tagging log") ||
    lower.includes("source-of-truth") ||
    lower.includes("credibility card") ||
    lower.includes("panchang card") ||
    lower.includes("section nav chips") ||
    lower.includes("intro prose") ||
    lower.includes("intro (shown to user)") ||
    lower.includes("comparison table") ||
    lower.includes("infographic") ||
    lower.includes("image ") ||
    lower.startsWith("image") ||
    lower === "field" ||
    lower === "what it shows" ||
    lower === "primary source" ||
    lower === "confidence" ||
    lower === "regional variance" ||
    lower === "optional elements" ||
    lower === "confidence score" ||
    lower === "dharma note" ||
    lower === "element" ||
    lower === "tag" ||
    lower === "score" ||
    lower === "opt/mand" ||
    lower === "source"
  ) {
    return true;
  }

  if (
    l.startsWith("A1.") ||
    l.startsWith("A2.") ||
    l.startsWith("A3.") ||
    l.startsWith("↳") ||
    l.startsWith("☐") ||
    l.startsWith("✕") ||
    l.startsWith("✓") ||
    l.startsWith("★") ||
    l.startsWith("📅") ||
    l.startsWith("•") ||
    l.startsWith("①") ||
    l.startsWith("②") ||
    l.startsWith("③") ||
    l.startsWith("④") ||
    l.startsWith("⑤") ||
    l.startsWith("⑥") ||
    l.startsWith("⑦") ||
    l.startsWith("⑧") ||
    l.startsWith("⑨") ||
    l.startsWith("⑩") ||
    l.startsWith("[") ||
    l.endsWith("]") ||
    l.includes("★") ||
    l.includes("─────────────────────────") ||
    l.includes("💬") ||
    l.includes("The Tapa Co.") ||
    l.includes("Related")
  ) {
    return true;
  }

  if (
    l.startsWith("Placement:") ||
    l.startsWith("Type:") ||
    l.startsWith("Dimensions:") ||
    l.startsWith("Ratio:") ||
    l.startsWith("Subject:") ||
    l.startsWith("Prompt / Brief:") ||
    l.startsWith("Caption:") ||
    l.startsWith("Caption (as shown to user):") ||
    lower.includes("tier: ai-generated")
  ) {
    return true;
  }

  if (
    l === "Scripture" ||
    l === "Puja" ||
    l === "By region" ||
    l === "Samagri" ||
    l === "Myths" ||
    l === "Related"
  ) {
    return true;
  }

  return false;
}

async function run() {
  console.log("=== STARTING IMPORT PROCESS ===");

  // Copy Ritual Kits images
  console.log("Copying Ritual Kits images...");
  for (const kitImg of kitImages) {
    const srcPath = path.join(process.cwd(), kitImg.src);
    const destPath = path.join(uploadDir, kitImg.dest);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✓ Copied kit image to ${kitImg.dest}`);
    } else {
      console.warn(`⚠ Missing kit image: ${srcPath}`);
    }
  }

  // Iterate files
  for (const mapping of fileMappings) {
    const docPath = path.join(process.cwd(), mapping.filePath);
    if (!fs.existsSync(docPath)) {
      console.log(`Skipping missing docx: ${mapping.filePath}`);
      continue;
    }

    console.log(`\nProcessing: ${mapping.filePath}`);
    const paragraphs = getDocxParagraphs(mapping.filePath);
    if (paragraphs.length === 0) continue;

    // 1. Copy thumbnail image
    const srcImg = path.join(process.cwd(), mapping.imagePath);
    const destImg = path.join(uploadDir, mapping.thumbnailName);
    let thumbnailUrl = "";
    if (fs.existsSync(srcImg)) {
      fs.copyFileSync(srcImg, destImg);
      thumbnailUrl = `/uploads/${mapping.thumbnailName}`;
      console.log(`✓ Copied image to ${mapping.thumbnailName}`);
    } else {
      console.warn(`⚠ Image not found: ${srcImg}`);
    }

    // 2. Extract title & sub-headline
    let title = paragraphs[1] || "Untitled";
    if (title.length > 100) title = title.substring(0, 100);
    const subHeadline = paragraphs[2] || "";

    // 3. Scan metadata line for source & classification
    let primarySource = "Traditional Scripture";
    let tag = "DHARMA";
    let score = 4;

    const metaLine = paragraphs[3] || "";
    if (metaLine.includes("|")) {
      const parts = metaLine.split("|");
      if (parts[1]) primarySource = parts[1].trim();
      const rawTagScore = parts[2] ? parts[2].trim() : "";
      if (rawTagScore.includes("PRATHA")) tag = "PRATHA";
      if (rawTagScore.includes("BHRANTI")) tag = "BHRANTI";
      const scoreMatch = rawTagScore.match(/(\d)\/\d/);
      if (scoreMatch) score = parseInt(scoreMatch[1], 10);
    }

    // 4. Create reusable Source record
    let sourceId = null;
    try {
      const sourceObj = await db.source.upsert({
        where: { id: `src-${mapping.slug}` },
        update: {},
        create: {
          id: `src-${mapping.slug}`,
          name: primarySource.split(",")[0].trim().substring(0, 50),
          reference: primarySource.substring(0, 100),
          type: "SHASTRA",
        },
      });
      sourceId = sourceObj.id;
    } catch (e) {
      console.error("Failed to save Source:", e);
    }

    // 5. Separate content sections
    let partBIndex = paragraphs.findIndex((p) => p.trim() === "PART B — ARTICLE" || p.trim() === "PART B — THE COMPARISON");
    if (partBIndex === -1) {
      // Find the last index containing "PART B" (skips the TOC entry at the top)
      const indices = [];
      paragraphs.forEach((p, idx) => {
        if (p.includes("PART B")) indices.push(idx);
      });
      partBIndex = indices.length > 0 ? indices[indices.length - 1] : -1;
    }
    const bodyParagraphs = partBIndex !== -1 ? paragraphs.slice(partBIndex + 1) : paragraphs;

    // Filter out editorial and metadata rows in body text
    const cleanBodyParagraphs = [];
    const hasIntroHeader = bodyParagraphs.some(
      (p) => p.includes("Intro Prose") || p.includes("Intro (shown to user)") || p.includes("Introduction")
    );

    let hasStarted = !hasIntroHeader;

    for (let i = 0; i < bodyParagraphs.length; i++) {
      const p = bodyParagraphs[i];
      const isHeader = p.includes("Intro Prose") || p.includes("Intro (shown to user)") || p.includes("Introduction");

      if (isHeader) {
        hasStarted = true;
        continue;
      }

      if (!hasStarted) {
        continue;
      }

      if (hasStarted && !isEditorialOrMetadata(p)) {
        cleanBodyParagraphs.push(p);
      }
    }

    // 6. Extract Myths & Facts (Bhranti DPB entries)
    const bhrantis = [];
    for (let i = 0; i < paragraphs.length; i++) {
      const p = paragraphs[i];
      if (p.startsWith("✕") && paragraphs[i + 1] && paragraphs[i + 1].startsWith("✓")) {
        const claim = p.replace("✕", "").trim();
        const correction = paragraphs[i + 1].replace("✓", "").trim();
        bhrantis.push({
          elementName: claim.substring(0, 50),
          tag: "BHRANTI",
          confidenceScore: 1,
          claim,
          correction,
          sourceOfTruth: primarySource,
          reviewStatus: "APPROVED", // Auto approve since they are seeded from locked documents!
        });
      }
    }

    if (mapping.type === "concept") {
      // Create Dharmic Concept
      try {
        const concept = await db.dharmicConcept.upsert({
          where: { slug: mapping.slug },
          update: {
            title,
            body: buildTiptapJson(cleanBodyParagraphs),
            thumbnailUrl,
          },
          create: {
            title,
            slug: mapping.slug,
            body: buildTiptapJson(cleanBodyParagraphs),
            status: "PUBLISHED",
            thumbnailUrl,
          },
        });

        // Insert its DPB Bhrantis
        for (const bhr of bhrantis) {
          await db.dPBEntry.create({
            data: {
              ...bhr,
              dharmicConceptId: concept.id,
            },
          });
        }
        console.log(`✓ Seeded Dharmic Concept: "${title}"`);
      } catch (e) {
        console.error("Failed to seed concept:", e);
      }
    } else {
      // Create Ritual Guide
      // Extract steps from paragraphs
      const steps = [];
      const samagri = [];

      let inPujaOrVidhiSection = false;
      let hasPujaOrVidhiSection = false;

      bodyParagraphs.forEach((p) => {
        if (p.includes("Section:")) {
          const secName = p.split("Section:")[1].trim();
          if (/puja|vidhi|step|kanda|chalisa|path|verses|recite/i.test(secName)) {
            hasPujaOrVidhiSection = true;
          }
        }
      });

      for (let idx = 0; idx < bodyParagraphs.length; idx++) {
        const p = bodyParagraphs[idx].trim();

        if (p.includes("Section:")) {
          const secName = p.split("Section:")[1].trim();
          inPujaOrVidhiSection = /puja|vidhi|step|kanda|chalisa|path|verses|recite/i.test(secName);
          continue;
        }

        // Extract samagri items (samagri checklist can be anywhere in the body)
        if (p.startsWith("☐") || p.startsWith("☐ ")) {
          samagri.push(p.replace(/☐\s*/, "").trim());
          continue;
        }

        // If the file has a Puja/Vidhi section, only extract steps when inside it.
        // If the file does NOT have any Puja/Vidhi section heading, search the whole body.
        if (hasPujaOrVidhiSection && !inPujaOrVidhiSection) {
          continue;
        }

        // Ignore known non-step parts like Myths or Samagri checklists or Related sections
        if (p.startsWith("✕") || p.startsWith("✓") || p.startsWith("☐") || p.includes("WhatsApp") || p.includes("Sticky Bottom")) {
          continue;
        }

        // Style A: inline number
        const inlineMatch = p.match(/^([①②③④⑤⑥⑦⑧⑨⑩]|\d+)\.?\s+(.*)/);
        if (inlineMatch) {
          const title = inlineMatch[2].trim();
          const nextP = bodyParagraphs[idx + 1] ? bodyParagraphs[idx + 1].trim() : "";
          const description = (nextP && !nextP.match(/^([①-⑩]|\d+)/) && !nextP.includes("Section:") && !nextP.includes("IMAGE") && !nextP.startsWith("✕") && !nextP.startsWith("✓") && !nextP.startsWith("☐")) ? nextP : title;
          steps.push({ title, description });
          continue;
        }

        // Style B: digit on its own line
        const digitMatch = p.match(/^([①②③④⑤⑥⑦⑧⑨⑩]|\d+)$/);
        if (digitMatch) {
          const title = bodyParagraphs[idx + 1] ? bodyParagraphs[idx + 1].trim() : "";
          const description = bodyParagraphs[idx + 2] ? bodyParagraphs[idx + 2].trim() : "";
          if (title && !title.match(/^([①-⑩]|\d+)/) && !title.includes("Section:") && !title.includes("IMAGE") && !title.startsWith("✕") && !title.startsWith("✓") && !title.startsWith("☐")) {
            steps.push({ title, description });
            idx += 2;
            continue;
          }
        }
      }

      try {
        const guide = await db.ritualGuide.upsert({
          where: { slug: mapping.slug },
          update: {
            title,
            introText: buildTiptapJson(cleanBodyParagraphs.slice(0, 8)),
            thumbnailUrl,
          },
          create: {
            title,
            slug: mapping.slug,
            category: mapping.category,
            status: "PUBLISHED",
            introText: buildTiptapJson(cleanBodyParagraphs.slice(0, 8)),
            sankalpaBody: "Standard Sankalpa path resolution: focus on internal purity, place clean objects before the altar.",
            sankalpaQuote: "Mamabhipretha siddhyartham shri devata aradhanatam sankalpam karishye.",
            fastOptions: [{ name: "Standard Fast", desc: "Fruits and milk only", recommended: true }],
            fastNote: "Avoid grains and salt to maintain the purity of the fast.",
            kathaTitle: `${title} Katha`,
            kathaBody: buildTiptapJson(["Katha recitation for the auspicious deity, focusing on traditional stories of worship."]),
            thumbnailUrl,
          },
        });

        // Delete old relation steps, samagri, mantras, and dpb
        await db.ritualStep.deleteMany({ where: { ritualGuideId: guide.id } });
        await db.samagriItem.deleteMany({ where: { ritualGuideId: guide.id } });
        await db.dPBEntry.deleteMany({ where: { ritualGuideId: guide.id } });

        // Insert steps
        for (let idx = 0; idx < steps.length; idx++) {
          await db.ritualStep.create({
            data: {
              title: steps[idx].title.substring(0, 60),
              description: steps[idx].description,
              order: idx + 1,
              ritualGuideId: guide.id,
            },
          });
        }

        // Insert samagri
        for (let idx = 0; idx < samagri.length; idx++) {
          await db.samagriItem.create({
            data: {
              name: samagri[idx],
              function: "Used for ritual pujan",
              order: idx + 1,
              ritualGuideId: guide.id,
            },
          });
        }

        // Link Source
        if (sourceId) {
          await db.ritualGuideSource.upsert({
            where: {
              ritualGuideId_sourceId: {
                ritualGuideId: guide.id,
                sourceId,
              },
            },
            update: {},
            create: {
              ritualGuideId: guide.id,
              sourceId,
            },
          });
        }

        // Insert its DPB Bhrantis
        for (const bhr of bhrantis) {
          await db.dPBEntry.create({
            data: {
              ...bhr,
              ritualGuideId: guide.id,
            },
          });
        }

        console.log(`✓ Seeded Ritual Guide: "${title}"`);
      } catch (e) {
        console.error("Failed to seed ritual guide:", e);
      }
    }
  }

  console.log("\n=== SEED DATA IMPORT SUCCESSFULLY COMPLETED ===");
  process.exit(0);
}

run();
