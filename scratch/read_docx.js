const cp = require("child_process");
const fs = require("fs");
const path = require("path");

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

const paragraphs = getDocxParagraphs("Editorial/Sep 2026/Ritual Guides_Sep26/Ganesh_Chaturthi_10Day/Ganesh_Chaturthi_10Day_Guide.docx");
fs.writeFileSync("scratch/ganesh_paragraphs.txt", paragraphs.map((p, i) => `${i}: ${p}`).join("\n"));
console.log("Written first 100 paragraphs to scratch/ganesh_paragraphs.txt");
