const fs = require("fs");
const path = require("path");

const filePath = path.join(process.cwd(), "src/components/admin/RitualGuideForm.tsx");
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

const startLine = 1885;
const endLine = 2536;

console.log(`Analyzing file for HTML/JSX tags:`);

const stack = [];

// Match JSX tags: opening, closing, or self-closing
// Handling multi-line tags by matching across newlines
const tagRegex = /<(\/)?([a-zA-Z0-9_.-]+)([\s\S]*?)(\/)?>/g;

let match;
while ((match = tagRegex.exec(content)) !== null) {
  const [fullTag, isClose, tagName, attrs, isSelfClose] = match;
  
  // Calculate line number
  const index = match.index;
  const lineNum = content.substring(0, index).split("\n").length;
  
  if (lineNum < startLine || lineNum > endLine) {
    continue;
  }
  
  // Ignore self-closing tags and common HTML void elements
  if (isSelfClose || ["input", "img", "br", "hr"].includes(tagName.toLowerCase())) {
    continue;
  }
  
  // If attrs ends with / (e.g. <Plus size={14} />), it's self-closing
  if (attrs.trim().endsWith("/")) {
    continue;
  }
  
  // Skip scriptural tags / components that are capitalized and self-closing in context
  // E.g. <ArrowLeft size={16} /> is handled above, but if it spans lines, we check here
  
  if (!isClose) {
    stack.push({ lineNum, tagName, fullTag: fullTag.replace(/\s+/g, " ") });
  } else {
    if (stack.length === 0) {
      console.log(`[UNMATCHED CLOSE] Line ${lineNum}: ${fullTag}`);
    } else {
      const last = stack.pop();
      if (last.tagName !== tagName) {
        console.log(`[MISMATCH] Line ${lineNum}: closing ${fullTag} matches opening ${last.fullTag} from line ${last.lineNum}`);
      }
    }
  }
}

if (stack.length > 0) {
  console.log("\nUnclosed tags remaining on stack:");
  stack.forEach(item => {
    console.log(`  Line ${item.lineNum}: ${item.fullTag}`);
  });
} else {
  console.log("\nAll tags are balanced!");
}
