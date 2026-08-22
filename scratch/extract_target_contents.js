const fs = require("fs");
const path = require("path");

const brainDir = "/Users/rohitpal/.gemini/antigravity-ide/brain";
const logPath = path.join(brainDir, "f6728564-7a69-49e8-a2c3-041a55b0423b", ".system_generated/logs/transcript_full.jsonl");

if (!fs.existsSync(logPath)) {
  console.error("Log file not found:", logPath);
  process.exit(1);
}

const content = fs.readFileSync(logPath, "utf8");
const lines = content.split("\n");

// Read existing reconstructed JSON
const chunksPath = path.join(process.cwd(), "scratch/extracted_chunks.json");
let chunks = [];
if (fs.existsSync(chunksPath)) {
  chunks = JSON.parse(fs.readFileSync(chunksPath, "utf8"));
}

const lineMap = new Map();
// Populate from existing chunks
for (const chunk of chunks) {
  for (const line of chunk.lines) {
    lineMap.set(line.num, line.content);
  }
}

console.log(`Initial unique lines from view_file: ${lineMap.size}`);

// Helper to add target content lines
function addTargetContent(startLine, targetContent) {
  const targetLines = targetContent.split("\n");
  console.log(`Adding ${targetLines.length} lines of TargetContent starting at line ${startLine}`);
  for (let i = 0; i < targetLines.length; i++) {
    const lineNum = startLine + i;
    // Don't overwrite if we already have it, or overwrite if we want to ensure correctness
    lineMap.set(lineNum, targetLines[i]);
  }
}

for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.tool_calls) {
      for (const tc of obj.tool_calls) {
        if (tc.name === "replace_file_content" && tc.args.TargetFile.includes("RitualGuideForm.tsx")) {
          const startLine = parseInt(tc.args.StartLine);
          addTargetContent(startLine, tc.args.TargetContent);
        }
        if (tc.name === "multi_replace_file_content" && tc.args.TargetFile.includes("RitualGuideForm.tsx")) {
          for (const chunk of tc.args.ReplacementChunks) {
            const startLine = parseInt(chunk.StartLine);
            addTargetContent(startLine, chunk.TargetContent);
          }
        }
      }
    }
  } catch (err) {
    // Ignore JSON errors
  }
}

console.log(`Reconstructed lines after merging TargetContent: ${lineMap.size}`);
const sortedKeys = Array.from(lineMap.keys()).sort((a, b) => a - b);
const maxLine = sortedKeys[sortedKeys.length - 1];
console.log(`Min line: ${sortedKeys[0]}, Max line: ${maxLine}`);

// Check for missing line ranges
let startMissing = null;
const missingRanges = [];

for (let i = 1; i <= maxLine; i++) {
  if (!lineMap.has(i)) {
    if (startMissing === null) {
      startMissing = i;
    }
  } else {
    if (startMissing !== null) {
      missingRanges.push([startMissing, i - 1]);
      startMissing = null;
    }
  }
}
if (startMissing !== null) {
  missingRanges.push([startMissing, maxLine]);
}
console.log("Missing line ranges:", missingRanges);

// Reconstruct file text
const fileLines = [];
for (let i = 1; i <= maxLine; i++) {
  if (lineMap.has(i)) {
    fileLines.push(lineMap.get(i));
  } else {
    fileLines.push(`// MISSING LINE ${i}`);
  }
}

fs.writeFileSync(
  path.join(process.cwd(), "scratch/reconstructed_RitualGuideForm_merged.tsx"),
  fileLines.join("\n")
);
console.log("Merged reconstructed file saved to scratch/reconstructed_RitualGuideForm_merged.tsx");
