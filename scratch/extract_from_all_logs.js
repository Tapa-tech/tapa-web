const fs = require("fs");
const path = require("path");

const brainDir = "/Users/rohitpal/.gemini/antigravity-ide/brain";
const logFiles = [
  "f80aae67-9bdd-4fb7-93af-8a965584a9f1",
  "f6728564-7a69-49e8-a2c3-041a55b0423b",
  "363a1c0b-58b6-4f0b-af00-faf5e527feb6",
  "7aa28846-5d78-40c8-ba44-8476d7d4a01c",
  "5ce56f3a-4bae-4cbb-a8f7-e6a50c492d74",
  "466dd08f-a2d3-4ec1-a5e0-a269b3d6f695",
  "e590a1f0-9376-4645-9ab8-d780ffc39280",
  "cae27cc7-74f0-4e45-8a91-516a2b6f451d",
  "85762dc6-1504-4029-885b-2172c9a8bf52",
  "d2d05df8-516c-4f78-8c9b-a0e2360243e7",
  "b114c9f0-964d-48d7-9aeb-8fab3e74039e",
  "39b9276a-ecf6-4df0-aa86-25903746a668"
].map(id => path.join(brainDir, id, ".system_generated/logs/transcript_full.jsonl"));

const lineMap = new Map();

for (const logPath of logFiles) {
  if (!fs.existsSync(logPath)) continue;
  console.log(`Parsing: ${logPath}`);
  
  const content = fs.readFileSync(logPath, "utf8");
  const lines = content.split("\n");
  
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const obj = JSON.parse(line);
      
      // Check tool call outputs for view_file on RitualGuideForm.tsx
      if (obj.content && obj.content.includes("File Path:") && obj.content.includes("RitualGuideForm.tsx")) {
        const rangeMatch = obj.content.match(/Showing lines (\d+) to (\d+)/);
        if (rangeMatch) {
          const contentLines = obj.content.split("\n");
          for (const cl of contentLines) {
            const m = cl.match(/^(\d+):\s(.*)/);
            if (m) {
              const num = parseInt(m[1]);
              const code = m[2];
              lineMap.set(num, code);
            }
          }
        }
      }
      
      // Also check replace_file_content or write_to_file tool calls
      if (obj.tool_calls) {
        for (const tc of obj.tool_calls) {
          if (tc.name === "write_to_file" && tc.args.TargetFile.includes("RitualGuideForm.tsx")) {
            console.log(`Found write_to_file for RitualGuideForm.tsx in logs!`);
            const codeLines = tc.args.CodeContent.split("\n");
            codeLines.forEach((code, idx) => {
              lineMap.set(idx + 1, code);
            });
          }
        }
      }
    } catch (err) {
      // Ignore JSON parsing errors
    }
  }
}

console.log(`Reconstructed lines: ${lineMap.size}`);
const sortedKeys = Array.from(lineMap.keys()).sort((a, b) => a - b);
console.log(`Min line: ${sortedKeys[0]}, Max line: ${sortedKeys[sortedKeys.length - 1]}`);

// Check for missing line ranges
let startMissing = null;
const missingRanges = [];
const maxLine = sortedKeys[sortedKeys.length - 1];

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
  path.join(process.cwd(), "scratch/reconstructed_RitualGuideForm_full.tsx"),
  fileLines.join("\n")
);
console.log("Full reconstructed file saved to scratch/reconstructed_RitualGuideForm_full.tsx");
