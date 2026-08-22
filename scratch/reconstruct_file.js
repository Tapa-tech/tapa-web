const fs = require("fs");
const path = require("path");

const chunksPath = path.join(process.cwd(), "scratch/extracted_chunks.json");
if (!fs.existsSync(chunksPath)) {
  console.error("Chunks file not found.");
  process.exit(1);
}

const chunks = JSON.parse(fs.readFileSync(chunksPath, "utf8"));

// Reconstruct by putting lines into a map of line number -> line content
const lineMap = new Map();

for (const chunk of chunks) {
  for (const line of chunk.lines) {
    lineMap.set(line.num, line.content);
  }
}

// Find min and max line numbers
const lineNums = Array.from(lineMap.keys()).sort((a, b) => a - b);
const minLine = lineNums[0];
const maxLine = lineNums[lineNums.length - 1];

console.log(`Min line: ${minLine}, Max line: ${maxLine}`);
console.log(`Unique lines found: ${lineMap.size}`);

// Print missing line ranges
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
  path.join(process.cwd(), "scratch/reconstructed_RitualGuideForm.tsx"),
  fileLines.join("\n")
);
console.log("Reconstructed file saved to scratch/reconstructed_RitualGuideForm.tsx");
