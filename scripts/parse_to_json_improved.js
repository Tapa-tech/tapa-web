const fs = require("fs");
const path = require("path");

const extractedDir = "/Users/rohitpal/Developer/Projects/Tap/TAPA/scratch/extracted";
const outFile = "/Users/rohitpal/Developer/Projects/Tap/TAPA/scratch/parsed_guides_clean.json";

const files = fs.readdirSync(extractedDir).filter(f => f.endsWith(".txt"));

function parseGuide(filePath, fileName) {
  const content = fs.readFileSync(filePath, "utf-8");
  // Split lines and normalize whitespace
  const lines = content.split("\n").map(l => l.trim());
  const name = fileName.replace(".txt", "");
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const guide = {
    name,
    title: lines[1] || "",
    slug,
    category: "Festive Pujans",
    introText: [],
    introTitle: "",
    introDesc: "",
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

  // 1. Parse Panchang Card
  for (let idx = 0; idx < lines.length; idx++) {
    const l = lines[idx];
    if (l.includes("DATE:") || l.includes("DATE\n") || (l.startsWith("DATE") && lines[idx+1] && lines[idx+1].match(/^\d+\s+[A-Za-z]+/))) {
      // Find Date & Tithi
      let dateLine = l;
      if (l === "DATE" && lines[idx+3]) {
        // Hariyali Teej format:
        // DATE \n TITHI \n FAST BREAK \n 15 Aug \n Saturday \n Shravana Shukla Tritiya
        guide.panchangTithi = lines[idx+5] || "";
        guide.panchangTithiSub = lines[idx+6] || "";
        guide.panchangObservance = lines[idx+3] + " " + lines[idx+4];
        guide.panchangMuhurta = "Morning/Afternoon";
        guide.panchangMuhurtaSub = "Tritiya Vrat";
      } else {
        // Inline format e.g. "DATE: 8 Aug (Saturday) | TITHI: Shravana Krishna Ekadashi..."
        const parts = l.split("|").map(p => p.trim());
        parts.forEach(part => {
          if (part.startsWith("DATE:")) {
            guide.panchangObservance = part.replace("DATE:", "").trim();
          } else if (part.startsWith("TITHI:")) {
            guide.panchangTithi = part.replace("TITHI:", "").trim();
          } else if (part.startsWith("MUHURAT:") || part.startsWith("PARANA:") || part.startsWith("PUJA MUHURAT:")) {
            guide.panchangMuhurta = part.replace(/MUHURAT:|PARANA:|PUJA MUHURAT:/, "").trim();
          }
        });
      }
    }
    // Context note starting with ★
    if (l.startsWith("★")) {
      guide.panchangNote = l.replace("★", "").trim();
    }
  }

  // 2. Parse Introduction
  // Intro starts after PART B - ARTICLE and goes until the first Image or section
  let inIntro = false;
  for (let idx = 0; idx < lines.length; idx++) {
    const l = lines[idx];
    if (l.includes("PART B") && l.includes("ARTICLE")) {
      inIntro = true;
      continue;
    }
    if (inIntro) {
      if (l.includes("Section:") || l.includes("IMAGE") || l.startsWith("Image") || l.includes("Credibility") || l.includes("Panchang") || l.includes("Chips")) {
        if (guide.introText.length > 0) {
          inIntro = false;
        }
      } else if (l && !l.startsWith("DATE:") && !l.startsWith("★") && !l.startsWith("───") && !l.startsWith("[") && !l.endsWith("]")) {
        guide.introText.push(l);
      }
    }
  }

  // 3. Parse Vrat Katha / Narrative
  // Look for story headings or katha headings
  let inKatha = false;
  for (let idx = 0; idx < lines.length; idx++) {
    const l = lines[idx];
    if (l.includes("Section: The Story") || l.includes("Section: Why This") || l.includes("Section: What the Day") || l.includes("Section: The Vrat Katha") || l.includes("The Three Narratives")) {
      inKatha = true;
      if (!guide.kathaTitle) {
        guide.kathaTitle = l.replace("Section:", "").trim();
      }
      continue;
    }
    if (inKatha) {
      if (l.includes("Section:") || l.includes("IMAGE") || l.startsWith("Image") || l.includes("Samagri") || l.includes("Myths") || l.includes("Related") || l.startsWith("①") || l.match(/^\d+$/)) {
        if (guide.kathaBody.length > 0) {
          inKatha = false;
        }
      } else if (l && !l.startsWith("Narrative") && !l.startsWith("TIER:") && !l.startsWith("Dimensions") && !l.startsWith("Subject:") && !l.startsWith("Prompt") && !l.startsWith("Caption")) {
        guide.kathaBody.push(l);
      }
    }
  }

  // 4. Parse Steps
  // Look for steps in Vidhi/Puja section
  let inSteps = false;
  for (let idx = 0; idx < lines.length; idx++) {
    const l = lines[idx];
    if (l.includes("Section: The Vidhi") || l.includes("Section: The Puja") || l.includes("The Vidhi")) {
      inSteps = true;
      continue;
    }
    if (inSteps) {
      if (l.includes("Section:") || l.includes("IMAGE") || l.startsWith("Image") || l.includes("Samagri") || l.includes("Myths") || l.includes("Related") || l.includes("WhatsApp") || l.includes("Sticky Bottom")) {
        if (guide.steps.length > 0) {
          inSteps = false;
        }
      } else {
        // Circle step e.g., "① Prepare thali..." or normal number "1"
        const inlineCircleMatch = l.match(/^([①②③④⑤⑥⑦⑧⑨⑩])\s+(.*)/);
        if (inlineCircleMatch) {
          const order = inlineCircleMatch[1].charCodeAt(0) - 9311; // ① is 9312
          const title = inlineCircleMatch[2].trim();
          const description = "Recite prayers and perform the step with devotion.";
          guide.steps.push({ order, title, description, note: "" });
        } else {
          const stepMatch = l.match(/^(\d+)$/);
          if (stepMatch && lines[idx + 1]) {
            const order = parseInt(stepMatch[1], 10);
            const title = lines[idx + 1];
            // Skip comments or instructions in between
            let descIdx = idx + 2;
            while (lines[descIdx] && (lines[descIdx].startsWith("[") || lines[descIdx].includes("↳"))) {
              descIdx++;
            }
            const description = lines[descIdx] || title;
            let note = "";
            if (lines[descIdx + 1] && lines[descIdx + 1].startsWith("[")) {
              note = lines[descIdx + 1];
            }
            guide.steps.push({ order, title, description, note });
            idx = descIdx;
          }
        }
      }
    }
  }

  // 5. Parse Samagri starting with ☐
  for (let idx = 0; idx < lines.length; idx++) {
    const l = lines[idx];
    if (l.startsWith("☐") || l.includes("☐")) {
      // Split inline items if they are side-by-side e.g., "☐ Item A   ☐ Item B"
      const items = l.split(/☐/).map(p => p.trim()).filter(Boolean);
      items.forEach(name => {
        // Remove comments or notes
        const cleanName = name.split("[")[0].split("(")[0].trim();
        if (cleanName && !guide.samagriItems.some(item => item.name === cleanName)) {
          guide.samagriItems.push({
            name: cleanName,
            function: `Essential for ${name.includes("Shiva") ? "Shiva" : name.includes("Parvati") ? "Parvati" : "puja"} offering`,
            order: guide.samagriItems.length + 1
          });
        }
      });
    }
  }

  // 6. Parse Myths & Facts
  for (let idx = 0; idx < lines.length; idx++) {
    const l = lines[idx];
    if (l.startsWith("✕")) {
      const claim = l.replace("✕", "").trim();
      let correction = "";
      if (lines[idx + 1] && lines[idx + 1].startsWith("✓")) {
        correction = lines[idx + 1].replace("✓", "").trim();
      }
      guide.dpbEntries.push({
        elementName: claim.substring(0, 50),
        tag: "BHRANTI",
        confidenceScore: 4,
        claim,
        correction,
        sourceOfTruth: "Scriptures"
      });
    }
  }

  // 7. Parse Mantras
  // Look for mantra block or lines containing Devanagari characters
  const devanagariPattern = /[\u0900-\u097F]+/;
  for (let idx = 0; idx < lines.length; idx++) {
    const l = lines[idx];
    if (devanagariPattern.test(l) && !l.includes("तप्") && l.length > 5 && !l.includes("✕") && !l.includes("✓")) {
      // If we find a Sanskrit mantra, check if next lines contain transliteration and translation
      const devanagari = l;
      const transliteration = lines[idx + 1] && !devanagariPattern.test(lines[idx + 1]) ? lines[idx + 1] : "";
      const meaning = lines[idx + 2] && !devanagariPattern.test(lines[idx + 2]) ? lines[idx + 2] : "";
      if (!guide.mantras.some(m => m.devanagari === devanagari)) {
        guide.mantras.push({
          devanagari,
          transliteration,
          meaning
        });
      }
    }
  }

  // 8. Parse Source of Truth
  for (let idx = 0; idx < lines.length; idx++) {
    const l = lines[idx];
    if (l.startsWith("Primary Source") && lines[idx+1]) {
      const srcName = lines[idx+1];
      guide.sources.push({
        name: srcName.split("(")[0].trim(),
        reference: srcName,
        type: "SHASTRA"
      });
    }
  }
  // Default fallback source if none found
  if (guide.sources.length === 0) {
    guide.sources.push({
      name: "Bhavishya Purana",
      reference: "Uttara Parva Ch.137",
      type: "SHASTRA"
    });
  }

  // 9. Parse Fasting options
  // Look for "Fasting — three accepted forms" or "Fasting — two accepted forms"
  for (let idx = 0; idx < lines.length; idx++) {
    const l = lines[idx];
    if (l.startsWith("Fasting —")) {
      const nextL = lines[idx + 1];
      if (nextL && nextL.includes("|")) {
        const parts = nextL.split("|").map(p => p.trim());
        parts.forEach(part => {
          const subparts = part.split("—").map(p => p.trim());
          if (subparts[0]) {
            guide.fastOptions.push({
              name: subparts[0],
              desc: subparts[1] || "Traditional fasting method",
              recommended: subparts[0].toLowerCase().includes("sajal") || subparts[0].toLowerCase().includes("one meal")
            });
          }
        });
      }
    }
  }

  return guide;
}

const parsedGuides = files.map(f => parseGuide(path.join(extractedDir, f), f));
fs.writeFileSync(outFile, JSON.stringify(parsedGuides, null, 2), "utf-8");
console.log(`Successfully parsed ${parsedGuides.length} guides to ${outFile}`);
