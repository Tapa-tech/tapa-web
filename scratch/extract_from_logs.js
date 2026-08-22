const fs = require("fs");
const path = require("path");

const logPath = "/Users/rohitpal/.gemini/antigravity-ide/brain/f6728564-7a69-49e8-a2c3-041a55b0423b/.system_generated/logs/transcript_full.jsonl";

if (!fs.existsSync(logPath)) {
  console.error("Log file does not exist at:", logPath);
  process.exit(1);
}

const fileContent = fs.readFileSync(logPath, "utf8");
const lines = fileContent.split("\n");

console.log(`Found ${lines.length} lines in log.`);

const views = [];

for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const obj = JSON.parse(line);
    
    // Look for tool calls or tool responses
    if (obj.tool_calls) {
      for (const call of obj.tool_calls) {
        if (call.name === "view_file" && call.args.AbsolutePath.includes("RitualGuideForm.tsx")) {
          console.log(`Found view_file call: StartLine=${call.args.StartLine}, EndLine=${call.args.EndLine}`);
        }
      }
    }
    
    if (obj.content && obj.content.includes("File Path:") && obj.content.includes("RitualGuideForm.tsx")) {
      // This is the output of the view_file tool
      // Let's parse out the line range and the lines
      const rangeMatch = obj.content.match(/Showing lines (\d+) to (\d+)/);
      if (rangeMatch) {
        const start = parseInt(rangeMatch[1]);
        const end = parseInt(rangeMatch[2]);
        console.log(`Found view_file response: lines ${start} to ${end}`);
        
        // Extract the code content line by line
        const codeLines = [];
        const contentLines = obj.content.split("\n");
        for (const cl of contentLines) {
          const m = cl.match(/^\d+:\s(.*)/);
          if (m) {
            codeLines.push({ num: parseInt(cl.split(":")[0]), content: m[1] });
          }
        }
        views.push({ start, end, lines: codeLines });
      }
    }
  } catch (err) {
    // Ignore parse errors
  }
}

// Sort views by start line
views.sort((a, b) => a.start - b.start);

// Output the segments
fs.writeFileSync(
  path.join(process.cwd(), "scratch/extracted_chunks.json"),
  JSON.stringify(views, null, 2)
);
console.log("Extracted chunks saved to scratch/extracted_chunks.json");
