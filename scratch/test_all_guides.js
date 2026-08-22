const cp = require("child_process");
const fs = require("fs");
const path = require("path");

function getDocxParagraphs(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
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

const fileMappings = [
  { filePath: "Editorial/Sundarkand/RG-Hanuman Chalisa Guide/Hanuman_Chalisa_Guide.docx", slug: "hanuman-chalisa-guide" },
  { filePath: "Editorial/Sundarkand/RG-Hanuman-Tue-Sat/Hanuman-Tue-Sat.docx", slug: "hanuman-tue-sat" },
  { filePath: "Editorial/Sundarkand/RG-Sundarkand/Sundarkand_Path_Home_Vidhi.docx", slug: "sundarkand-path-home-vidhi" },
  { filePath: "Editorial/Aug 2026/Ritual Guides/Hariyali Teej/Hariyali_Teej_Editorial_Draft.docx", slug: "hariyali-teej" },
  { filePath: "Editorial/Aug 2026/Ritual Guides/Kajari Teej/Kajari_Teej_Editorial_Draft.docx", slug: "kajari-teej" },
  { filePath: "Editorial/Aug 2026/Ritual Guides/Hartalika Teej/Hartalika_Teej_Editorial_Draft.docx", slug: "hartalika-teej" },
  { filePath: "Editorial/Aug 2026/Ritual Guides/Shravana Putrada Ekadashi/Shravana_Putrada_Ekadashi_Editorial_Draft.docx", slug: "shravana-putrada-ekadashi" },
  { filePath: "Editorial/Aug 2026/Ritual Guides/Nag Panchami/Nag_Panchami_Editorial_Draft.docx", slug: "nag-panchami" },
  { filePath: "Editorial/Aug 2026/Ritual Guides/Sawan Somwar/Sawan_Somwar_Vrat_Editorial_Draft.docx", slug: "sawan-somwar" },
  { filePath: "Editorial/Aug 2026/Ritual Guides/Rakshabandhan/Raksha_Bandhan_Editorial_Draft.docx", slug: "rakshabandhan" },
  { filePath: "Editorial/Aug 2026/Ritual Guides/Kamika Ekadashi/Kamika_Ekadashi_Editorial_Draft.docx", slug: "kamika-ekadashi" },
  { filePath: "Editorial/Sep 2026/Ritual Guides_Sep26/Aja Ekadashi/Aja_Ekadashi_Editorial_Draft.docx", slug: "aja-ekadashi" },
  { filePath: "Editorial/Sep 2026/Ritual Guides_Sep26/Janmashtami/Krishna_Janmashtami_Editorial_Draft.docx", slug: "krishna-janmashtami" },
  { filePath: "Editorial/Sep 2026/Ritual Guides_Sep26/Radha Ashtami/Radha_Ashtami_Editorial_Draft.docx", slug: "radha-ashtami" },
  { filePath: "Editorial/Sep 2026/Ritual Guides_Sep26/Satyanarayan Katha/Satyanarayan_Katha_Puja_Guide.docx", slug: "satyanarayan-katha" },
  { filePath: "Editorial/Sep 2026/Ritual Guides_Sep26/Ganesh_Chaturthi_10Day/Ganesh_Chaturthi_10Day_Guide.docx", slug: "ganesh-chaturthi-10day" },
  { filePath: "Editorial/Sep 2026/Ritual Guides_Sep26/Parsva Ekadashi/Parsva_Ekadashi_Editorial_Draft.docx", slug: "parsva-ekadashi" }
];

fileMappings.forEach((mapping) => {
  const paragraphs = getDocxParagraphs(mapping.filePath);
  if (paragraphs.length === 0) return;

  let partBIndex = paragraphs.findIndex((p) => p.trim() === "PART B — ARTICLE" || p.trim() === "PART B — THE COMPARISON");
  if (partBIndex === -1) {
    const indices = [];
    paragraphs.forEach((p, idx) => {
      if (p.includes("PART B")) indices.push(idx);
    });
    partBIndex = indices.length > 0 ? indices[indices.length - 1] : -1;
  }
  const bodyParagraphs = partBIndex !== -1 ? paragraphs.slice(partBIndex + 1) : paragraphs;

  const steps = [];
  
  // Try to find the start of the puja/vidhi section if possible, to limit false positives
  let inPujaOrVidhiSection = false;
  let hasPujaOrVidhiSection = false;

  // Let's first check if there are any section headings containing Puja or Vidhi
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
      const description = (nextP && !nextP.match(/^([①-⑩]|\d+)/) && !nextP.includes("Section:") && !nextP.includes("IMAGE") && !nextP.startsWith("✕") && !nextP.startsWith("✓")) ? nextP : title;
      steps.push({ title, description });
      continue;
    }

    // Style B: digit on its own line
    const digitMatch = p.match(/^([①②③④⑤⑥⑦⑧⑨⑩]|\d+)$/);
    if (digitMatch) {
      const title = bodyParagraphs[idx + 1] ? bodyParagraphs[idx + 1].trim() : "";
      const description = bodyParagraphs[idx + 2] ? bodyParagraphs[idx + 2].trim() : "";
      if (title && !title.match(/^([①-⑩]|\d+)/) && !title.includes("Section:") && !title.includes("IMAGE") && !title.startsWith("✕") && !title.startsWith("✓")) {
        steps.push({ title, description });
        idx += 2;
        continue;
      }
    }
  }

  console.log(`Guide: "${mapping.slug}" -> Found ${steps.length} steps:`);
  steps.forEach((s, i) => {
    console.log(`  Step ${i+1}: "${s.title}"`);
  });
});
