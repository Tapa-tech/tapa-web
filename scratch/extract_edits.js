const fs = require("fs");
const path = require("path");

const brainDir = "/Users/rohitpal/.gemini/antigravity-ide/brain";
const logFiles = [
  "5ce56f3a-4bae-4cbb-a8f7-e6a50c492d74",
  "f6728564-7a69-49e8-a2c3-041a55b0423b"
].map(id => path.join(brainDir, id, ".system_generated/logs/transcript_full.jsonl"));

for (const logPath of logFiles) {
  if (!fs.existsSync(logPath)) continue;
  console.log(`Analyzing: ${logPath}`);
  
  const content = fs.readFileSync(logPath, "utf8");
  const lines = content.split("\n");
  
  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    if (!line.trim()) continue;
    try {
      const obj = JSON.parse(line);
      if (obj.tool_calls) {
        for (const tc of obj.tool_calls) {
          if (tc.name === "replace_file_content" && tc.args.TargetFile.includes("RitualGuideForm.tsx")) {
            console.log(`[replace_file_content] StartLine: ${tc.args.StartLine}, EndLine: ${tc.args.EndLine}`);
            // Check size of TargetContent / ReplacementContent
            console.log(`  TargetContent lines: ${tc.args.TargetContent.split("\n").length}`);
            console.log(`  ReplacementContent lines: ${tc.args.ReplacementContent.split("\n").length}`);
          }
          if (tc.name === "multi_replace_file_content" && tc.args.TargetFile.includes("RitualGuideForm.tsx")) {
            console.log(`[multi_replace_file_content] chunks: ${tc.args.ReplacementChunks.length}`);
            tc.args.ReplacementChunks.forEach((chunk, cidx) => {
              console.log(`  Chunk ${cidx}: StartLine: ${chunk.StartLine}, EndLine: ${chunk.EndLine}`);
              console.log(`    TargetContent lines: ${chunk.TargetContent.split("\n").length}`);
              console.log(`    ReplacementContent lines: ${chunk.ReplacementContent.split("\n").length}`);
            });
          }
        }
      }
    } catch (err) {
      // Ignore
    }
  }
}
