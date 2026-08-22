const fs = require("fs");
const path = require("path");

const filePath = path.join(process.cwd(), "src/components/admin/RitualGuideForm.tsx");
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

const stack = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Skip comments and string literals to be safe (simplified)
  let inString = false;
  let stringChar = '';
  
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    
    // Simple string literal check
    if ((char === '"' || char === "'" || char === "`") && line[j - 1] !== "\\") {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
      }
    }
    
    if (inString) continue;
    
    // Ignore single line comments
    if (char === "/" && line[j + 1] === "/") {
      break;
    }
    
    if (char === "{" || char === "(" || char === "[") {
      stack.push({ char, lineNum: i + 1, col: j + 1 });
    } else if (char === "}" || char === ")" || char === "]") {
      if (stack.length === 0) {
        console.log(`Unmatched closing ${char} at line ${i + 1}, column ${j + 1}`);
      } else {
        const last = stack[stack.length - 1];
        if (
          (char === "}" && last.char === "{") ||
          (char === ")" && last.char === "(") ||
          (char === "]" && last.char === "[")
        ) {
          stack.pop();
        } else {
          console.log(`Mismatch: closing ${char} at line ${i + 1}, column ${j + 1} matches opening ${last.char} at line ${last.lineNum}, column ${last.col}`);
          stack.pop();
        }
      }
    }
  }
}

if (stack.length > 0) {
  console.log(`Unmatched opening characters left on stack: ${stack.length}`);
  stack.forEach((item, index) => {
    if (index < 20 || index > stack.length - 20) {
      console.log(`  ${item.char} at line ${item.lineNum}, column ${item.col}`);
    } else if (index === 20) {
      console.log("  ...");
    }
  });
} else {
  console.log("No unmatched braces found!");
}
