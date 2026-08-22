const fs = require("fs");
const path = require("path");

const filePath = path.join(process.cwd(), "src/components/admin/RitualGuideForm.tsx");
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

const startLine = 893;
const endLine = lines.length;

console.log(`Analyzing lines ${startLine} to ${endLine} for div tags:`);

const stack = [];

for (let i = startLine - 1; i < endLine; i++) {
  const line = lines[i];
  if (line === undefined) continue;
  
  // Find all <div or </div> in the line
  const matches = line.matchAll(/<div[^>]*>|<\/div>/g);
  for (const match of matches) {
    const tag = match[0];
    const isClose = tag.startsWith("</");
    
    if (!isClose) {
      stack.push({ line: i + 1, tag });
      console.log(`[OPEN]  Line ${i + 1}: ${tag}`);
    } else {
      if (stack.length === 0) {
        console.log(`[CLOSE] Line ${i + 1}: ${tag} (unmatched!)`);
      } else {
        const last = stack.pop();
        console.log(`[CLOSE] Line ${i + 1}: ${tag} (matches line ${last.line} open)`);
      }
    }
  }
}

if (stack.length > 0) {
  console.log("\nUnclosed divs remaining on stack:");
  stack.forEach(item => {
    console.log(`  Line ${item.line}: ${item.tag}`);
  });
} else {
  console.log("\nAll divs are balanced!");
}
