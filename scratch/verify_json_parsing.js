const fs = require("fs");
const data = JSON.parse(fs.readFileSync("/Users/rohitpal/Developer/Projects/Tap/TAPA/scratch/parsed_guides_clean.json", "utf-8"));

console.log("Parsed guides verification:");
data.forEach(g => {
  console.log(`\n- ${g.name}:`);
  console.log(`  Intro paragraphs: ${g.introText.length}`);
  console.log(`  Katha paragraphs: ${g.kathaBody.length}`);
  console.log(`  Steps: ${g.steps.length}`);
  console.log(`  Samagri items: ${g.samagriItems.length}`);
  console.log(`  Mantras: ${g.mantras.length}`);
  console.log(`  Myths: ${g.dpbEntries.length}`);
});
