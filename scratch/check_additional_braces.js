const fs = require("fs");
const path = require("path");

const filePath = path.join(process.cwd(), "src/components/admin/RitualGuideForm.tsx");
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

const startLine = 1;
const endLine = 2791;

console.log(`Analyzing lines ${startLine} to ${endLine} for brackets/parentheses/braces:`);

const stack = [];

for (let i = startLine - 1; i < endLine; i++) {
  const line = lines[i];
  if (line === undefined) continue;
  
  let inString = false;
  let stringChar = '';
  
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    
    if ((char === '"' || char === "'" || char === "`") && line[j - 1] !== "\\") {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
      }
    }
    
    if (inString) continue;
    
    if (char === "/" && line[j + 1] === "/") {
      break;
    }
    
    if (char === "{" || char === "(" || char === "[") {
      stack.push({ char, lineNum: i + 1, col: j + 1 });
    } else if (char === "}" || char === ")" || char === "]") {
      if (stack.length === 0) {
        console.log(`[EXTRA CLOSE] Line ${i + 1}, col ${j + 1}: ${char}`);
      } else {
        const last = stack[stack.length - 1];
        if (
          (char === "}" && last.char === "{") ||
          (char === ")" && last.char === "(") ||
          (char === "]" && last.char === "[")
        ) {
          stack.pop();
        } else {
          console.log(`[MISMATCH] Line ${i + 1}, col ${j + 1}: closing ${char} matches opening ${last.char} from line ${last.lineNum}, col ${last.col}`);
          stack.pop();
        }
      }
    }
  }
}

if (stack.length > 0) {
  console.log("\nUnclosed items remaining on stack:");
  stack.forEach(item => {
    console.log(`  Line ${item.lineNum}, col ${item.col}: ${item.char}`);
  });
} else {
  console.log("\nAll items in this range are balanced!");
}
