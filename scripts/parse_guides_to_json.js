const fs = require("fs");
const path = require("path");

const extractedDir = "/Users/rohitpal/Developer/Projects/Tap/TAPA/scratch/extracted";
const outFile = "/Users/rohitpal/Developer/Projects/Tap/TAPA/scratch/parsed_guides.json";

const files = fs.readdirSync(extractedDir).filter(f => f.endsWith(".txt"));

function parseGuide(filePath, fileName) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n").map(l => l.trim());
  const name = fileName.replace(".txt", "");
  
  const guide = {
    name,
    title: "",
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    introText: [],
    sankalpaBody: "",
    sankalpaQuote: "",
    fastNote: "",
    fastOptions: [],
    kathaTitle: "",
    kathaBody: [],
    steps: [],
    samagriItems: [],
    mantras: [],
    dpbEntries: [],
    sources: [],
    relatedSlugs: [],
    panchangObservance: "",
    panchangObservanceSub: "",
    panchangMuhurta: "",
    panchangMuhurtaSub: "",
    panchangTithi: "",
    panchangTithiSub: "",
    panchangVijay: "",
    panchangVijaySub: "",
    panchangNote: ""
  };

  // Title is line 2
  guide.title = lines[1] || "";

  // Parse sections by scanning lines
  let currentSection = "";
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (line.includes("Section: The Story") || line.includes("Section: Why This") || line.includes("Section: What the Day")) {
      currentSection = "story";
      guide.kathaTitle = line.replace("Section:", "").trim();
      i++;
      continue;
    } else if (line.includes("Section: The Vidhi") || line.includes("Section: The Puja")) {
      currentSection = "vidhi";
      i++;
      continue;
    } else if (line.includes("Section: The Vrat Katha")) {
      currentSection = "vrat_katha";
      i++;
      continue;
    } else if (line.includes("Section: Myths") || line.includes("Dharma vs Pratha")) {
      currentSection = "myths";
      i++;
      continue;
    } else if (line.includes("Intro Prose") || line.includes("Intro")) {
      currentSection = "intro";
      i++;
      continue;
    }

    if (currentSection === "intro") {
      if (line.startsWith("Image") || line.startsWith("IMAGE") || line.startsWith("---") || line.startsWith("===") || line.includes("Section:")) {
        currentSection = "";
      } else if (line) {
        guide.introText.push(line);
      }
    } else if (currentSection === "story" || currentSection === "vrat_katha") {
      if (line.startsWith("Image") || line.startsWith("IMAGE") || line.startsWith("---") || line.startsWith("===") || line.includes("Section:") || line.includes("Related") || line.includes("Dharma")) {
        // Stop on metadata or section change
      } else if (line) {
        guide.kathaBody.push(line);
      }
    } else if (currentSection === "vidhi") {
      // Parse steps: digit on its own line followed by title and description
      const stepMatch = line.match(/^(\d+)$/);
      if (stepMatch && lines[i + 1] && lines[i + 2]) {
        const order = parseInt(stepMatch[1], 10);
        const title = lines[i + 1];
        const description = lines[i + 2];
        const noteLine = lines[i + 3] || "";
        const note = noteLine.includes("Dharma") || noteLine.includes("Pratha") ? noteLine : "";
        guide.steps.push({ order, title, description, note });
        i += 3;
        if (note) i++;
        continue;
      }
    } else if (currentSection === "myths") {
      if (line.startsWith("✕") && lines[i + 1] && lines[i + 1].startsWith("✓")) {
        const claim = line.replace("✕", "").trim();
        const correction = lines[i + 1].replace("✓", "").trim();
        guide.dpbEntries.push({
          elementName: claim.substring(0, 50),
          tag: "BHRANTI",
          confidenceScore: 1,
          claim,
          correction
        });
        i += 2;
        continue;
      }
    }

    // Parse samagri starting with ☐
    if (line.startsWith("☐")) {
      const name = line.replace(/☐\s*/, "").trim();
      guide.samagriItems.push({
        name,
        function: "Used for ritual pujan",
        order: guide.samagriItems.length + 1
      });
    }

    i++;
  }

  // Parse mantras from bottom
  const mantraIndex = lines.findIndex(l => l.includes("MANTRA"));
  if (mantraIndex !== -1 && lines[mantraIndex + 1]) {
    const devanagari = lines[mantraIndex + 1];
    const transliteration = lines[mantraIndex + 2] || "";
    const meaning = lines[mantraIndex + 3] || "";
    guide.mantras.push({
      devanagari,
      transliteration,
      meaning
    });
  }

  return guide;
}

const parsedGuides = files.map(f => parseGuide(path.join(extractedDir, f), f));
fs.writeFileSync(outFile, JSON.stringify(parsedGuides, null, 2), "utf-8");
console.log(`Successfully parsed ${parsedGuides.length} guides to ${outFile}`);
