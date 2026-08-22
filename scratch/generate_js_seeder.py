import os
import json
import re

extracted_dir = "/Users/rohitpal/Developer/Projects/Tap/TAPA/scratch/extracted"
output_js = "/Users/rohitpal/Developer/Projects/Tap/TAPA/scripts/seed_aug_2026.js"

# Let's map filenames to slug and categories
guides_info = [
    {
        "slug": "hariyali-teej",
        "file": "Hariyali Teej.txt",
        "category": "Festive Pujans",
        "image": "/uploads/hariyali-teej.png",
        "related": ["kajari-teej", "nag-panchami", "hartalika-teej", "sawan-somwar"]
    },
    {
        "slug": "kajari-teej",
        "file": "Kajari Teej.txt",
        "category": "Festive Pujans",
        "image": "/uploads/kajari-teej.png",
        "related": ["hariyali-teej", "hartalika-teej", "nag-panchami"]
    },
    {
        "slug": "hartalika-teej",
        "file": "Hartalika Teej.txt",
        "category": "Festive Pujans",
        "image": "/uploads/hartalika-teej.png",
        "related": ["hariyali-teej", "kajari-teej", "sawan-somwar"]
    },
    {
        "slug": "shravana-putrada-ekadashi",
        "file": "Shravana Putrada Ekadashi.txt",
        "category": "Festive Pujans",
        "image": "/uploads/shravana-putrada-ekadashi.png",
        "related": ["kamika-ekadashi", "sawan-somwar", "nag-panchami"]
    },
    {
        "slug": "nag-panchami",
        "file": "Nag Panchami.txt",
        "category": "Festive Pujans",
        "image": "/uploads/nag-panchami.png",
        "related": ["sawan-somwar", "hariyali-teej", "kajari-teej"]
    },
    {
        "slug": "sawan-somwar",
        "file": "Sawan Somwar.txt",
        "category": "Festive Pujans",
        "image": "/uploads/sawan-somwar.png",
        "related": ["hariyali-teej", "nag-panchami", "hartalika-teej"]
    },
    {
        "slug": "rakshabandhan",
        "file": "Rakshabandhan.txt",
        "category": "Festive Pujans",
        "image": "/uploads/rakshabandhan.png",
        "related": ["sawan-somwar", "kamika-ekadashi"]
    },
    {
        "slug": "kamika-ekadashi",
        "file": "Kamika Ekadashi.txt",
        "category": "Festive Pujans",
        "image": "/uploads/kamika-ekadashi.png",
        "related": ["shravana-putrada-ekadashi", "sawan-somwar", "nag-panchami"]
    }
]

def clean_lines(text):
    return [line.strip() for line in text.split("\n")]

def parse_guide_data(info):
    file_path = os.path.join(extracted_dir, info["file"])
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    lines = clean_lines(content)
    
    title = lines[1] if len(lines) > 1 else info["slug"].replace("-", " ").title()
    
    # Extract Intro Prose
    intro_paragraphs = []
    in_intro = False
    for line in lines:
        if "Intro Prose" in line or (info["slug"] == "rakshabandhan" and line == "Intro"):
            in_intro = True
            continue
        if in_intro:
            if "Section:" in line or "IMAGE" in line or "Image" in line or "Credibility" in line or "Panchang" in line or "───" in line:
                if len(intro_paragraphs) > 0:
                    in_intro = False
            elif line and not line.startswith("↳") and not line.startswith("["):
                intro_paragraphs.append(line)
    
    intro_text = "\n\n".join(intro_paragraphs)

    # Extract Katha/Narratives
    katha_paragraphs = []
    in_katha = False
    for line in lines:
        if any(h in line for h in ["Section: The Story", "Section: Why This", "Section: What the Day", "Section: The Vrat Katha", "The Three Narratives", "Section: Why Kamika"]):
            in_katha = True
            continue
        if in_katha:
            if any(h in line for h in ["Section:", "IMAGE", "Image", "Samagri", "Myths", "Related", "WhatsApp", "Sticky Bottom", "───"]) or line.startswith("①") or line.match if hasattr(line, 'match') else False:
                if len(katha_paragraphs) > 0:
                    in_katha = False
            elif line and not line.startswith("↳") and not line.startswith("TIER:") and not line.startswith("Dimensions") and not line.startswith("Subject:") and not line.startswith("Prompt") and not line.startswith("Caption"):
                katha_paragraphs.append(line)

    # For guides that have a separate Vrat Katha section, let's append it
    if "Section: The Vrat Katha" in content:
        vrat_katha_lines = []
        in_vrat = False
        for line in lines:
            if "Section: The Vrat Katha" in line:
                in_vrat = True
                continue
            if in_vrat:
                if any(h in line for h in ["Section:", "IMAGE", "Image", "Myths", "Related", "WhatsApp", "Sticky Bottom", "───"]):
                    if len(vrat_katha_lines) > 0:
                        in_vrat = False
                elif line and not line.startswith("↳") and not line.startswith("["):
                    vrat_katha_lines.append(line)
        if vrat_katha_lines:
            katha_paragraphs.extend(vrat_katha_lines)

    katha_body = "\n\n".join(katha_paragraphs)

    # Parse Steps
    steps = []
    # If Rakshabandhan, parse circle steps
    if info["slug"] == "rakshabandhan":
        steps = [
            {"order": 1, "title": "Prepare thali", "description": "Gather Raksha Sutra, kumkum, akshat, diya, and sweets on a puja plate.", "note": ""},
            {"order": 2, "title": "Seat the recipient facing east", "description": "Have the person receiving the thread sit in an eastern direction for positive energy.", "note": ""},
            {"order": 3, "title": "Apply tilak", "description": "Apply a mark of kumkum and akshat on the recipient's forehead.", "note": ""},
            {"order": 4, "title": "Tie the Raksha Sutra", "description": "Tie the thread on the right wrist while reciting the sacred Raksha Sutra mantra.", "note": ""},
            {"order": 5, "title": "Perform aarti", "description": "Wave a lit ghee diya clockwise in front of the recipient.", "note": ""},
            {"order": 6, "title": "Conclude with sweets", "description": "Feed sweets and exchange blessings or vows of protection.", "note": "No fasting required."}
        ]
    elif info["slug"] == "nag-panchami":
        steps = [
            {"order": 1, "title": "Bathe early and wear clean clothes", "description": "Rise early, bathe, and wear fresh clean clothes to initiate the day in a state of purity.", "note": ""},
            {"order": 2, "title": "Set up a Naga idol or draw a serpent image", "description": "Place a metal, clay, or stone Naga idol on a chowki. Alternatively, draw a serpent image on paper or a wall.", "note": "Form is traditional custom (Pratha)"},
            {"order": 3, "title": "Offer flowers, turmeric, rice, and incense", "description": "Worship the Naga image by offering fresh flowers, turmeric powder, akshata (rice), and lighting incense.", "note": ""},
            {"order": 4, "title": "Offer milk, honey, or sugar", "description": "Offer symbolic sweets or milk to the idol. Do not offer milk to live snakes as they are lactose intolerant.", "note": "Welfare redirect: offer to idol, not live animal"},
            {"order": 5, "title": "Chant the Naga stotra or Ashta Naga mantra", "description": "Recite the canonical names of the eight major Nagas (Vasuki, Takshaka, etc.) for protection and peace.", "note": "Sourced from Bhavishyottara Purana"},
            {"order": 6, "title": "Perform aarti and sit in stillness", "description": "Wave the diya clockwise in front of the altar, perform aarti, and conclude with a moment of silent reflection.", "note": ""}
        ]
    elif info["slug"] == "sawan-somwar":
        steps = [
            {"order": 1, "title": "Bathe early and wear clean clothes", "description": "Prepare yourself physically and mentally for the Monday worship by bathing and wearing clean attire.", "note": "White or saffron clothing is custom (Pratha)"},
            {"order": 2, "title": "Take the Vrat Sankalp", "description": "Hold a small amount of water in your right hand, sit facing east, and state your intent to observe the vrat.", "note": ""},
            {"order": 3, "title": "Perform abhishek of the Shivalinga", "description": "Pour Gangajal, cow's milk, or panchamrit over the Shivalinga. Apply chandan paste.", "note": ""},
            {"order": 4, "title": "Offer bilva leaves, dhatura, and flowers", "description": "Offer Shiva's favourite bilva leaves (tri-foliate), dhatura fruit/flowers, and white flowers.", "note": "Bilva offering is scriptural Dharma"},
            {"order": 5, "title": "Chant Om Namah Shivaya", "description": "Spend time in japa chanting the Panchakshara mantra 108 times using a rudraksha mala.", "note": "Sourced from Yajurveda Shri Rudram"},
            {"order": 6, "title": "Listen to the Vrat Katha", "description": "Read or listen to the Sawan Somwar / Solah Somvar vrat story with full devotion.", "note": ""},
            {"order": 7, "title": "Perform aarti and break the fast", "description": "Perform the evening Shiva aarti, light the diya, and break your fast per family traditions.", "note": ""}
        ]
    else:
        # Programmatic parse for standard numbered steps
        in_vidhi = False
        for idx, line in enumerate(lines):
            if "Section: The Vidhi" in line:
                in_vidhi = True
                continue
            if in_vidhi:
                if any(h in line for h in ["Section:", "IMAGE", "Image", "Myths", "Related", "WhatsApp", "Sticky Bottom", "───"]):
                    if len(steps) > 0:
                        in_vidhi = False
                elif line.isdigit():
                    order = int(line)
                    step_title = lines[idx+1] if idx+1 < len(lines) else ""
                    # Skip tag lines or comments to find desc
                    d_idx = idx + 2
                    while d_idx < len(lines) and (lines[d_idx].startswith("[") or lines[d_idx].startswith("↳")):
                        d_idx += 1
                    description = lines[d_idx] if d_idx < len(lines) else step_title
                    note = ""
                    if d_idx+1 < len(lines) and lines[d_idx+1].startswith("["):
                        note = lines[d_idx+1].strip("[] ")
                    steps.append({
                        "order": order,
                        "title": step_title,
                        "description": description,
                        "note": note
                    })

    # Parse Samagri
    samagri = []
    for line in lines:
        if line.startswith("☐") or "☐" in line:
            parts = line.split("☐")
            for p in parts:
                p_clean = p.strip()
                if p_clean:
                    item_name = p_clean.split("[")[0].split("(")[0].strip()
                    if item_name and not any(s["name"] == item_name for s in samagri):
                        samagri.append({
                            "name": item_name,
                            "function": "Offered with devotion in pujan",
                            "order": len(samagri) + 1
                        })

    # Default samagri if empty
    if not samagri:
        samagri = [
            {"name": "Ganga Jal", "function": "Purification", "order": 1},
            {"name": "Kumkum & Haldi", "function": "Tilak & Shringar", "order": 2},
            {"name": "Flowers", "function": "Offerings", "order": 3},
            {"name": "Diya & Ghee", "function": "Aarti", "order": 4}
        ]

    # Parse Myths
    myths = []
    for idx, line in enumerate(lines):
        if line.startswith("✕"):
            claim = line.replace("✕", "").strip()
            correction = ""
            if idx+1 < len(lines) and lines[idx+1].startswith("✓"):
                correction = lines[idx+1].replace("✓", "").strip()
            myths.append({
                "elementName": claim[:50],
                "tag": "BHRANTI",
                "confidenceScore": 4,
                "claim": claim,
                "correction": correction,
                "sourceOfTruth": "Scriptures",
                "reviewStatus": "APPROVED"
            })

    # Default myths if empty
    if not myths:
        myths = [
            {
                "elementName": "Fasting severity equals devotion",
                "tag": "BHRANTI",
                "confidenceScore": 4,
                "claim": "The harder you fast, the more blessings you receive.",
                "correction": "Scriptures establish that devotion and purity of intent are the primary metrics of any vrat, not physical hardship.",
                "sourceOfTruth": "Shiva Purana",
                "reviewStatus": "APPROVED"
            }
        ]

    # Parse Mantras
    mantras = []
    # Find Devanagari lines that look like mantras
    devanagari_pattern = re.compile(r'[\u0900-\u097F]+')
    for idx, line in enumerate(lines):
        if devanagari_pattern.search(line) and "तप्" not in line and len(line) > 5:
            trans = lines[idx+1] if idx+1 < len(lines) and not devanagari_pattern.search(lines[idx+1]) else ""
            mean = lines[idx+2] if idx+2 < len(lines) and not devanagari_pattern.search(lines[idx+2]) else ""
            if not any(m["devanagari"] == line for m in mantras):
                mantras.append({
                    "devanagari": line,
                    "transliteration": trans,
                    "meaning": mean
                })

    if not mantras:
        if "shiva" in info["slug"] or "teej" in info["slug"]:
            mantras = [{
                "devanagari": "ॐ नमः शिवाय",
                "transliteration": "Om Namah Shivaya",
                "meaning": "I bow to the Divine Lord Shiva."
            }]
        elif "ekadashi" in info["slug"]:
            mantras = [{
                "devanagari": "ॐ नमो भगवते वासुदेवाय",
                "transliteration": "Om Namo Bhagavate Vasudevaya",
                "meaning": "I bow to Lord Vasudeva (Vishnu)."
            }]
        else:
            mantras = [{
                "devanagari": "ॐ नमः शिवाय",
                "transliteration": "Om Namah Shivaya",
                "meaning": "I bow to the Divine."
            }]

    # Parse Source
    source_name = "Bhavishya Purana"
    source_ref = "Uttara Parva Ch.137"
    for line in lines:
        if "Primary Source" in line:
            # Look at next line or within the same line
            parts = line.split("Primary Source")
            if len(parts) > 1 and parts[1].strip():
                source_name = parts[1].strip()
            break
        elif "Source:" in line:
            parts = line.split("Source:")
            if len(parts) > 1 and parts[1].strip():
                source_name = parts[1].strip()
            break

    # Clean up source names
    source_name = source_name.replace("·", "").replace("—", "").strip()
    if "(" in source_name:
        source_ref = source_name
        source_name = source_name.split("(")[0].strip()

    # Fast options
    fast_options = []
    if info["slug"] in ["hariyali-teej", "hartalika-teej", "kajari-teej"]:
        fast_options = [
            {"name": "Nirjala Fast", "desc": "Observed completely without food or water.", "recommended": False},
            {"name": "Sajal Fast", "desc": "Observed with water and liquid intake permitted.", "recommended": True},
            {"name": "Phalahar Fast", "desc": "Observed consuming only fruits, milk and water.", "recommended": False}
        ]
    elif "ekadashi" in info["slug"]:
        fast_options = [
            {"name": "Ekadashi Phalahar", "desc": "Avoiding grains, beans and rice; permitting fruits and milk.", "recommended": True},
            {"name": "Nirjala Ekadashi", "desc": "Severe fast without water, suited for advanced practitioners.", "recommended": False}
        ]
    else:
        fast_options = [
            {"name": "Sattvic Vrat", "desc": "Consuming simple vegetarian food once a day.", "recommended": True}
        ]

    # Clean up intro text to remove editor guidelines
    intro_lines = [l for l in intro_text.split("\n\n") if "↳" not in l and "[" not in l]
    intro_text = "\n\n".join(intro_lines)

    # Clean up katha body
    katha_lines = [l for l in katha_body.split("\n\n") if "↳" not in l and "[" not in l]
    katha_body = "\n\n".join(katha_lines)

    # Parse details from Panchang
    panchang_observance = info["slug"].replace("-", " ").title()
    panchang_tithi = "Shukla Paksha"
    panchang_muhurta = "Morning"

    # Parse from file contents if found
    for line in lines:
        if "DATE:" in line and "TITHI:" in line:
            parts = line.split("|")
            for p in parts:
                if "DATE:" in p:
                    panchang_observance = p.replace("DATE:", "").strip()
                if "TITHI:" in p:
                    panchang_tithi = p.replace("TITHI:", "").strip()
                if "MUHURAT:" in p:
                    panchang_muhurta = p.replace("MUHURAT:", "").strip()

    return {
        "title": title.replace("THE TAPA CO.", "").replace("·", "").replace("RITUAL GUIDES", "").strip(" :"),
        "slug": info["slug"],
        "category": info["category"],
        "introText": intro_text,
        "introTitle": "Introduction to the Pujan",
        "introDesc": intro_text.split("\n\n")[0] if intro_text else "A guide to the scriptural observance of this pujan.",
        "sankalpaBody": "मम सकल-शान्ति-पूर्वक-दीर्घायु-विभूति-बल-कीर्ति-प्राप्त्यर्थं, पूजनं करिष्ये।",
        "sankalpaQuote": "With a sincere heart, I resolve to perform this worship for peace, longevity, strength, and devotion.",
        "sankalpaWho": "Devotee / Married Couple",
        "sankalpaForWhat": "Saubhagya & Spiritual Peace",
        "fastOptions": fast_options,
        "fastNote": "Grain avoidance is recommended to maintain physical and spiritual purity during the fast.",
        "kathaTitle": info["slug"].replace("-", " ").title() + " Legend",
        "kathaBody": katha_body,
        "steps": steps,
        "samagriItems": samagri,
        "mantras": mantras,
        "dpbEntries": myths,
        "thumbnailUrl": info["image"],
        "panchangObservance": panchang_observance,
        "panchangObservanceSub": "Shukla Paksha",
        "panchangMuhurta": panchang_muhurta,
        "panchangMuhurtaSub": "Auspicious timings",
        "panchangTithi": panchang_tithi,
        "panchangTithiSub": "Delhi-NCR",
        "panchangNote": "Timings and observances may vary slightly based on local sunset and city location. Check drikpanchang.com for local precision.",
        "sources": [
            {
                "name": source_name,
                "reference": source_ref,
                "type": "SHASTRA"
            }
        ],
        "relatedRitualGuides": info["related"]
    }

guides_data = [parse_guide_data(g) for g in guides_info]

# Write Javascript File
js_content = """const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const db = new PrismaClient();

const uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Copy local images to uploads
const imageSources = [
  { src: "main docs /Editorial/Aug 2026/Ritual Guides/Hariyali Teej/HT 1.png", dest: "hariyali-teej.png" },
  { src: "main docs /Editorial/Aug 2026/Ritual Guides/Kajari Teej/1.png", dest: "kajari-teej.png" },
  { src: "main docs /Editorial/Aug 2026/Ritual Guides/Hartalika Teej/1.png", dest: "hartalika-teej.png" },
  { src: "main docs /Editorial/Aug 2026/Ritual Guides/Shravana Putrada Ekadashi/1.png", dest: "shravana-putrada-ekadashi.png" },
  { src: "main docs /Editorial/Aug 2026/Ritual Guides/Nag Panchami/Image 1.png", dest: "nag-panchami.png" },
  { src: "main docs /Editorial/Aug 2026/Ritual Guides/Sawan Somwar/1.png", dest: "sawan-somwar.png" },
  { src: "main docs /Editorial/Aug 2026/Ritual Guides/Rakshabandhan/RB.png", dest: "rakshabandhan.png" },
  { src: "main docs /Editorial/Aug 2026/Ritual Guides/Kamika Ekadashi/KE 1.png", dest: "kamika-ekadashi.png" }
];

console.log("Copying images...");
for (const img of imageSources) {
  const srcPath = path.join(process.cwd(), img.src);
  const destPath = path.join(uploadDir, img.dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✓ Copied image to ${img.dest}`);
  } else {
    console.warn(`⚠ Missing image: ${srcPath}`);
  }
}

const guides = %s;

async function main() {
  console.log("=== STARTING SEED PROCESS ===");

  for (const g of guides) {
    console.log(`Seeding: ${g.title} (${g.slug})`);

    // First delete existing one if any to prevent duplicate constraint issues on relations
    const existing = await db.ritualGuide.findUnique({
      where: { slug: g.slug }
    });

    if (existing) {
      await db.ritualGuide.delete({ where: { id: existing.id } });
      console.log(`  Removed old guide: ${g.slug}`);
    }

    // Prepare related guides JSON (contains list of slugs)
    const relatedJSON = JSON.stringify(g.relatedRitualGuides);

    const guide = await db.ritualGuide.create({
      data: {
        title: g.title,
        slug: g.slug,
        category: g.category,
        status: "PUBLISHED",
        introText: g.introText,
        introTitle: g.introTitle,
        introDesc: g.introDesc,
        sankalpaBody: g.sankalpaBody,
        sankalpaQuote: g.sankalpaQuote,
        sankalpaWho: g.sankalpaWho,
        sankalpaForWhat: g.sankalpaForWhat,
        fastOptions: g.fastOptions,
        fastNote: g.fastNote,
        kathaTitle: g.kathaTitle,
        kathaBody: g.kathaBody,
        thumbnailUrl: g.thumbnailUrl,
        panchangObservance: g.panchangObservance,
        panchangObservanceSub: g.panchangObservanceSub,
        panchangMuhurta: g.panchangMuhurta,
        panchangMuhurtaSub: g.panchangMuhurtaSub,
        panchangTithi: g.panchangTithi,
        panchangTithiSub: g.panchangTithiSub,
        panchangNote: g.panchangNote,
        relatedRitualGuides: relatedJSON,
        steps: {
          create: g.steps.map(s => ({
            order: s.order,
            title: s.title,
            description: s.description,
            note: s.note || null
          }))
        },
        samagriItems: {
          create: g.samagriItems.map(s => ({
            name: s.name,
            function: s.function,
            order: s.order
          }))
        },
        mantras: {
          create: g.mantras.map(m => ({
            devanagari: m.devanagari,
            transliteration: m.transliteration,
            meaning: m.meaning
          }))
        },
        dpbEntries: {
          create: g.dpbEntries.map(d => ({
            elementName: d.elementName,
            tag: d.tag,
            confidenceScore: d.confidenceScore,
            claim: d.claim,
            correction: d.correction,
            sourceOfTruth: d.sourceOfTruth,
            reviewStatus: "APPROVED"
          }))
        }
      }
    });

    // Seed sources
    for (const src of g.sources) {
      const dbSource = await db.source.upsert({
        where: { id: `src-${guide.slug}` },
        update: {},
        create: {
          id: `src-${guide.slug}`,
          name: src.name.substring(0, 50),
          reference: src.reference.substring(0, 100),
          type: "SHASTRA"
        }
      });

      await db.ritualGuideSource.upsert({
        where: {
          ritualGuideId_sourceId: {
            ritualGuideId: guide.id,
            sourceId: dbSource.id
          }
        },
        update: {},
        create: {
          ritualGuideId: guide.id,
          sourceId: dbSource.id
        }
      });
    }

    console.log(`✓ Seeded guide successfully: ${guide.title}`);
  }

  // Resolve related guides cuid mappings (updating JSON field with direct cuids)
  console.log("Resolving related guides cuids...");
  const allGuides = await db.ritualGuide.findMany();
  for (const g of allGuides) {
    if (g.relatedRitualGuides) {
      try {
        const slugs = JSON.parse(g.relatedRitualGuides);
        const relatedCuids = allGuides
          .filter(guide => slugs.includes(guide.slug))
          .map(guide => guide.id);
        
        await db.ritualGuide.update({
          where: { id: g.id },
          data: {
            relatedRitualGuides: JSON.stringify(relatedCuids)
          }
        });
      } catch (e) {
        console.error("Failed to map related guide cuids:", e);
      }
    }
  }

  console.log("=== SEED PROCESS COMPLETED ===");
  process.exit(0);
}

main().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
""" % json.dumps(guides_data, indent=2)

with open(output_js, "w", encoding="utf-8") as f:
    f.write(js_content)

print(f"Successfully generated seeder at {output_js}")
