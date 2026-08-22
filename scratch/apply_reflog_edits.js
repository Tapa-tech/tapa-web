const fs = require("fs");
const path = require("path");

const brainDir = "/Users/rohitpal/.gemini/antigravity-ide/brain";
const conversations = [
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
];

const logsWithTime = [];
for (const id of conversations) {
  const logPath = path.join(brainDir, id, ".system_generated/logs/transcript_full.jsonl");
  if (fs.existsSync(logPath)) {
    const stat = fs.statSync(logPath);
    logsWithTime.push({ path: logPath, mtime: stat.mtimeMs, id });
  }
}
logsWithTime.sort((a, b) => a.mtime - b.mtime);

const baseFileContentPath = path.join(process.cwd(), "scratch/temp_base.tsx");
const { execSync } = require("child_process");
try {
  execSync("git show 7dba45b:src/components/admin/RitualGuideForm.tsx > scratch/temp_base.tsx");
} catch (err) {
  console.error("Failed to extract base file:", err);
  process.exit(1);
}

let fileContent = fs.readFileSync(baseFileContentPath, "utf8").replace(/\r\n/g, "\n");
console.log(`Loaded base file: ${fileContent.split("\n").length} lines.`);

const operations = [];

for (const log of logsWithTime) {
  const logContent = fs.readFileSync(log.path, "utf8");
  const lines = logContent.split("\n");
  
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    if (!line.trim()) continue;
    try {
      const obj = JSON.parse(line);
      if (obj.tool_calls) {
        for (const tc of obj.tool_calls) {
          if (tc.name === "write_to_file" && tc.args.TargetFile.includes("RitualGuideForm.tsx")) {
            operations.push({
              type: "write",
              content: tc.args.CodeContent.replace(/\r\n/g, "\n"),
              logId: log.id,
              lineIndex
            });
          } else if (tc.name === "replace_file_content" && tc.args.TargetFile.includes("RitualGuideForm.tsx")) {
            operations.push({
              type: "replace",
              target: tc.args.TargetContent.replace(/\r\n/g, "\n"),
              replacement: tc.args.ReplacementContent.replace(/\r\n/g, "\n"),
              startLine: parseInt(tc.args.StartLine),
              logId: log.id,
              lineIndex
            });
          } else if (tc.name === "multi_replace_file_content" && tc.args.TargetFile.includes("RitualGuideForm.tsx")) {
            operations.push({
              type: "multi_replace",
              chunks: tc.args.ReplacementChunks.map(chunk => ({
                TargetContent: chunk.TargetContent.replace(/\r\n/g, "\n"),
                ReplacementContent: chunk.ReplacementContent.replace(/\r\n/g, "\n"),
                StartLine: parseInt(chunk.StartLine),
                EndLine: parseInt(chunk.EndLine)
              })),
              logId: log.id,
              lineIndex
            });
          }
        }
      }
    } catch (err) {
      // Ignore
    }
  }
}

console.log(`Found ${operations.length} edit operations in total.`);

operations.forEach((op, idx) => {
  console.log(`Applying op ${idx + 1}/${operations.length} from log ${op.logId} type ${op.type}...`);
  if (op.type === "write") {
    fileContent = op.content;
    console.log(`  Rewrote file. New length: ${fileContent.split("\n").length} lines.`);
  } else if (op.type === "replace") {
    const beforeLength = fileContent.split("\n").length;
    if (fileContent.includes(op.target)) {
      fileContent = fileContent.replace(op.target, op.replacement);
      console.log(`  Replaced target. Lines: ${beforeLength} -> ${fileContent.split("\n").length}`);
    } else {
      // Try stripping leading/trailing whitespace from target to match
      const targetTrimmed = op.target.trim();
      const firstLine = targetTrimmed.split("\n")[0];
      const matchIndex = fileContent.indexOf(targetTrimmed);
      if (matchIndex !== -1) {
        // Simple replacement of trimmed version
        fileContent = fileContent.substring(0, matchIndex) + op.replacement + fileContent.substring(matchIndex + targetTrimmed.length);
        console.log(`  Replaced trimmed target. Lines: ${beforeLength} -> ${fileContent.split("\n").length}`);
      } else {
        console.warn(`  WARNING: Target content not found for replace!`);
        console.log(`    Target preview: ${op.target.substring(0, 100)}...`);
      }
    }
  } else if (op.type === "multi_replace") {
    const beforeLength = fileContent.split("\n").length;
    const sortedChunks = [...op.chunks].sort((a, b) => b.StartLine - a.StartLine);
    let successCount = 0;
    
    for (const chunk of sortedChunks) {
      if (fileContent.includes(chunk.TargetContent)) {
        fileContent = fileContent.replace(chunk.TargetContent, chunk.ReplacementContent);
        successCount++;
      } else {
        const targetTrimmed = chunk.TargetContent.trim();
        const matchIndex = fileContent.indexOf(targetTrimmed);
        if (matchIndex !== -1) {
          fileContent = fileContent.substring(0, matchIndex) + chunk.ReplacementContent + fileContent.substring(matchIndex + targetTrimmed.length);
          successCount++;
        } else {
          console.warn(`  WARNING: Chunk target content not found!`);
          console.log(`    Target preview: ${chunk.TargetContent.substring(0, 100)}...`);
        }
      }
    }
    console.log(`  Multi-replaced ${successCount}/${sortedChunks.length} chunks. Lines: ${beforeLength} -> ${fileContent.split("\n").length}`);
  }
});

fs.writeFileSync(
  path.join(process.cwd(), "scratch/reconstructed_RitualGuideForm_final.tsx"),
  fileContent
);
console.log("Final reconstructed file saved to scratch/reconstructed_RitualGuideForm_final.tsx");
