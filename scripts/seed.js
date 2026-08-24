const { PrismaClient } = require("@prisma/client");
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

const guides = [
  {
    "title": "Hariyali Teej: The Complete Vidhi, Vrat Katha, and Why It Matters",
    "slug": "hariyali-teej",
    "category": "Festive Pujans",
    "introText": "Hariyali Teej falls on the third day (Tritiya) of Shukla Paksha in the month of Shravana \u2014 two days before Nag Panchami, at the height of the monsoon. The name comes from hariyali: greenery. The name is exact. This festival arrives when the earth is most lush, most alive, most coloured.\n\nAt its heart is a story from the Shiva Purana: Parvati's long tapasya to be united with Shiva, and his acceptance of her on this Tritiya. The vrat observed today is a way of stepping into that same devotion \u2014 not a transaction, but a remembering.",
    "introTitle": "Introduction to the Pujan",
    "introDesc": "Hariyali Teej falls on the third day (Tritiya) of Shukla Paksha in the month of Shravana \u2014 two days before Nag Panchami, at the height of the monsoon. The name comes from hariyali: greenery. The name is exact. This festival arrives when the earth is most lush, most alive, most coloured.",
    "sankalpaBody": "\u092e\u092e \u0938\u0915\u0932-\u0936\u093e\u0928\u094d\u0924\u093f-\u092a\u0942\u0930\u094d\u0935\u0915-\u0926\u0940\u0930\u094d\u0918\u093e\u092f\u0941-\u0935\u093f\u092d\u0942\u0924\u093f-\u092c\u0932-\u0915\u0940\u0930\u094d\u0924\u093f-\u092a\u094d\u0930\u093e\u092a\u094d\u0924\u094d\u092f\u0930\u094d\u0925\u0902, \u092a\u0942\u091c\u0928\u0902 \u0915\u0930\u093f\u0937\u094d\u092f\u0947\u0964",
    "sankalpaQuote": "With a sincere heart, I resolve to perform this worship for peace, longevity, strength, and devotion.",
    "sankalpaWho": "Devotee / Married Couple",
    "sankalpaForWhat": "Saubhagya & Spiritual Peace",
    "fastOptions": [
      {
        "name": "Nirjala Fast",
        "desc": "Observed completely without food or water.",
        "recommended": false
      },
      {
        "name": "Sajal Fast",
        "desc": "Observed with water and liquid intake permitted.",
        "recommended": true
      },
      {
        "name": "Phalahar Fast",
        "desc": "Observed consuming only fruits, milk and water.",
        "recommended": false
      }
    ],
    "fastNote": "Grain avoidance is recommended to maintain physical and spiritual purity during the fast.",
    "kathaTitle": "Hariyali Teej Legend",
    "kathaBody": "Narrative 1 of 1\n\nParvati's Tapasya \u2014 Shiva Purana, Rudra Samhita / Parvati Khanda\n\nThe Shiva Purana tells us that Parvati was not always Parvati. In her first life, she was Sati \u2014 the daughter of Daksha Prajapati, who married Shiva against her father's wishes, and who immolated herself when Daksha insulted Shiva at a great yajna. Shiva's grief at her death is said to have consumed him entirely.\n\nSati was reborn as Parvati, daughter of Himavan, the king of the mountains. She carried the same sankalp from her previous life: that Shiva alone would be her husband. But Shiva was deep in meditation, withdrawn from the world after Sati's death. Himavan, like Daksha before him, had other plans \u2014 the sage Narada arrived with a proposal that Parvati be given in marriage to Vishnu.\n\nParvati refused. A loyal friend helped her escape into the forest, where she undertook sustained tapasya. She gave up food progressively \u2014 first eating only fruit, then only leaves, then sustaining herself on water alone, until finally she subsisted on nothing at all. Years passed. Shiva \u2014 moved by the depth and duration of her resolve \u2014 appeared before her. On that day, Shravana Shukla Tritiya, standing before the Shivalinga she had shaped from river sand, she asked for a single boon: that he be her husband. He agreed. She returned to her father; the marriage was performed; and Parvati became the consort of Shiva.\n\nThis is the heart of why the day is observed: not fear of what happens if it isn't, but a chance to bring the same quality of devotion \u2014 steady, patient, across a lifetime and beyond \u2014 into one's own marriage and life.\n\nImage 2  |  Full bleed  |  After scriptural narrative\n\nIMAGE 2 \u2014 Full bleed \u2014 after scriptural narrative, before regional section\n\nSection: Who Observes This, and How It Looks by Region\n\nMarried women observe the vrat for their husband's wellbeing and a harmonious marriage. Unmarried women observe it praying for a partner with the same devotion Shiva showed Parvati. Both intentions are honoured equally \u2014 this is a vrat of aspiration, not obligation.\n\nRajasthan\n\nUP / Bihar / Haryana\n\nMadhya Pradesh\n\nDelhi-NCR\n\nGrand Teej Mata processions, especially in Jaipur. Elaborate fairs (melas), decorated elephants, folk performances. Women in bright green lehengas and sarees.\n\nHome-based worship with family. Traditional songs and Teej vrat are observed together. Sinjara exchange between natal and married families is a significant ritual.\n\nFairs held; women gather in temples for collective puja. Clay idols of Shiva and Parvati are made in some households.\n\nUrban observance \u2014 largely home-based. Green attire, mehendi, and family gathering. Swings and fairs in parks and neighbourhoods in some areas.\n\nPratha \u2014 regional scale\n\nPratha \u2014 family custom\n\nPratha \u2014 community tradition\n\nDharma (core vrat)\n\nThis is not a pan-Hindu observance. If your family or region does not mark Hariyali Teej, that does not mean your tradition has skipped something \u2014 Shiva-Parvati devotion is honoured at different points across India's regional calendars.\n\nSamagri Checklist  (locked \u2014 do not edit items or tags)\n\nFor Shiva:\n\nITEM\n\nCLASSIFICATION\n\nNOTE\n\nGanga Jal (or clean water)\n\nDHARMA \u2014 Mandatory\n\nCentral abhishek offering. Any clean water if Ganga Jal unavailable.\n\nCow's milk\n\nDHARMA \u2014 Mandatory\n\nFor panchamrit abhishek.\n\nBelpatra (bilva leaves)\n\nDHARMA \u2014 Mandatory\n\nShiva's foremost offering. Fresh preferred; dried acceptable.\n\nPanchamrit (milk, curd, ghee, honey, sugar)\n\nDHARMA \u2014 Optional\n\nFor full abhishek form. Plain water is sufficient for simple puja.\n\nChandan (sandalwood paste)\n\nDHARMA \u2014 Optional\n\nFor applying to the Shivalinga.\n\nAkshat (unbroken rice, turmeric-stained)\n\nDHARMA \u2014 Optional\n\nStandard puja offering.\n\nDhatura flower and fruit\n\nPRATHA \u2014 Optional\n\nRegional North India Pratha. Not required.\n\nWhite flowers for Shiva\n\nPRATHA \u2014 Optional\n\nConvention; any flower offered with devotion is accepted.\n\nIncense (agarbatti)\n\nPRATHA \u2014 Optional\n\nFor puja atmosphere.\n\nDiya and ghee\n\nDHARMA \u2014 Optional\n\nFor aarti at end of puja.\n\nFor Parvati (shringar tray):\n\nITEM\n\nCLASSIFICATION\n\nNOTE\n\nSindoor (vermilion)\n\nDHARMA \u2014 Mandatory\n\nOffered to Parvati as suhaag symbol; Shodashopachara tradition.\n\nKumkum\n\nDHARMA \u2014 Mandatory\n\nCompanion to sindoor offering.\n\nGreen bangles\n\nPRATHA \u2014 Mandatory (by tradition)\n\nThe green colour is specific to Hariyali Teej tradition \u2014 Pratha, but strongly observed.\n\nMehendi (henna)\n\nPRATHA \u2014 Optional\n\nStrongly traditional; offered on the shringar tray.\n\nRed chunri\n\nPRATHA \u2014 Optional\n\nOffered to Parvati as part of solah shringar.\n\nBindi and kohl (kajal)\n\nPRATHA \u2014 Optional\n\nPart of shringar set.\n\nHaldi (turmeric)\n\nDHARMA \u2014 Optional\n\nPurification; also offered as part of shringar.\n\nFruits and sweets (especially ghewar)\n\nPRATHA \u2014 Optional\n\nGhewar is North India seasonal \u2014 Pratha. Any sattvic sweet as naivedhyam is appropriate.\n\nSection: The Vidhi \u2014 Step by Step\n\n1\n\nBathe and dress in clean clothes \u2014 green attire is traditional\n\nRise early, bathe, and wear clean clothes. Green is strongly associated with Hariyali Teej and the monsoon's greenery.\n\n2\n\nSet up the altar with idols or images of Shiva, Parvati, and Ganesha\n\nA brass or clay idol, or images of all three, on a clean red or white cloth over a chowki. Some households make temporary clay idols specifically for this day.\n\n3\n\nTake the Vrat Sankalp\n\nSit facing east. Take a small spoon of water in your right palm and make a sincere resolve: to observe this vrat with devotion for the wellbeing of your marriage and family, or for the sankalp you carry.\n\n4\n\nPerform abhishek of Shiva with water, milk, and panchamrit\n\nPour Ganga Jal first, then cow's milk, then panchamrit if observing the full form. Offer belpatra. Apply chandan to the Shivalinga. This is the central act of devotion.\n\n5\n\nOffer sindoor, bangles, and shringar to Parvati\n\nPlace sindoor, kumkum, green bangles, mehendi, and other shringar items on a small tray before Parvati's image. Offer red flowers to Parvati and white flowers to Shiva.\n\n6\n\nListen to or read the Vrat Katha\n\nThe recitation of the katha \u2014 Shiva narrating the story of Parvati's tapasya \u2014 is the essential act that transmits the merit of the vrat. See the Vrat Katha section below.\n\n7\n\nSing bhajans and perform aarti in the evening\n\nLight the diya and perform Shiva-Parvati aarti. In many households, women gather with family and neighbours for songs and bhajans dedicated to Parvati through the evening.\n\n8\n\nBreak the fast\n\nFor those observing the fast until the next morning: break it after bathing on the 16th August at sunrise. For those observing a sajal or phalahar fast: break it after moonrise on the evening of the 15th, after the aarti is complete.\n\nFasting \u2014 three accepted forms\n\nNirjala \u2014 without food or water. Demanding; only for those physically suited.     |     Sajal \u2014 with water permitted. Widely accepted.     |     Phalahar \u2014 fruit-based. Suitable for pregnancy, health conditions, or where a stricter fast is inadvisable.\n\nThe Shiva Purana establishes fasting as part of this vrat. It does not specify the form. The devotion matters \u2014 not the difficulty.\n\nThe Vrat Katha is not a separate legend. It is Shiva himself \u2014 on the day he accepted Parvati \u2014 narrating back to her the story of what she endured to reach him. This is the form preserved in the Shiva Purana, and it is why the katha is considered essential to the vrat: hearing it is the devotee's way of stepping into Parvati's story.\n\nThe Vrat Katha \u2014 as narrated by Shiva to Parvati (Shiva Purana, Rudra Samhita)\n\nShiva spoke:  'Parvati, in your first life you were Sati \u2014 my wife, the daughter of Daksha. You had resolved even then, before you knew me, that I alone would be your husband. When Daksha insulted me and you gave up your life in protest, I was consumed with grief. But your resolve did not end with your life.  You were reborn as the daughter of Himavan. And in this birth too, from the moment you were conscious, you carried the same sankalp: that Shiva alone would be your husband.  When your father Himavan heard from the sage Narada that Lord Vishnu wished to marry you, he consented. But you did not. A loyal friend took you into the forest so that you could complete your tapasya undisturbed.  In the forest, on the bank of a river, you shaped a Shivalinga from the sand of the riverbed. You worshipped it through the entire night of Shravana Shukla Tritiya \u2014 without food, without water, without sleep. The night passed. The morning came. I appeared before you.  I offered you any boon. You said: Lord, you are the boon. Be my husband.  I agreed. You returned to your father and told him: I will come home, but only if you give me in marriage to Shiva, and no one else. Himavan agreed. Our marriage was performed.  Parvati, this story \u2014 of your tapasya, your resolve, this night, this day \u2014 I am telling you now so that it is never lost. Any woman who observes a fast on Shravana Shukla Tritiya, who worships us with devotion, who hears this story told \u2014 she will receive the same blessing you received. Married women will find harmony and long-lived husbands. Unmarried women will find partners worthy of their devotion. The vrat will never be incomplete for her.'  Shiva fell silent. Parvati listened. And on that day, the vrat was established.\n\nThe katha is traditionally recited in the evening, after the puja, in the presence of Shiva and Parvati. Many households read it aloud together; in some communities, women gather with neighbours to hear it. A printed version for distribution \u2014 or a digital card for sharing \u2014 is an appropriate accompaniment to this article.\n\nImage 3  |  Half-width pair  |  After Vrat Katha\n\nIMAGE 3 \u2014 Half-width pair \u2014 after Vrat Katha, before myths\n\nSection: Myths & Facts\n\n\u2715  \"If you don't keep a nirjala fast, the Hariyali Teej vrat doesn't really count.\"\n\n\u2713  No source text makes nirjala mandatory for this vrat. The Shiva Purana establishes fasting with devotion \u2014 not a specific form of fasting. Sajal (with water) and phalahar (fruit-based) fasts are recognised, accepted forms. A fast adapted to your health, kept with sincerity, is a complete vrat.\n\n\u2715  \"This vrat is harder than Karwa Chauth, so it counts for more \u2014 it's the bigger test of devotion.\"\n\n\u2713  No scripture ranks vrats against each other by physical difficulty. Parvati's tapasya lasted years \u2014 the tradition honours the quality and duration of devotion, not its severity in a single day. Comparing hardship distracts from the actual point: steady, patient love.\n\n\u2715  \"Hariyali Teej and Hartalika Teej are the same festival observed at different times.\"\n\n\u2713  They are two distinct festivals with different origins. Hariyali Teej falls on Shravana Shukla Tritiya (this year, 15 August) and celebrates the arrival of the monsoon alongside Parvati's tapasya. Hartalika Teej falls on Bhadrapada Shukla Tritiya (14 September in 2026) and commemorates specifically the episode of Parvati's friend taking her into the forest \u2014 its name, Hartalika, means 'the abduction by a female friend'. Different tithi, different month, different narrative.\n\nClosing Prose\n\nParvati did not fast for a day to win a husband. She carried a resolve across lifetimes \u2014 through loss, through rebirth, through years of tapasya, through a night on a riverbank with a Shivalinga shaped from sand. The story is not asking women to replicate the severity of what she endured. It is asking them to recognise the quality: the steadiness, the patience, the devotion that does not perform itself but simply continues.\n\nHariyali Teej is the day when that quality is honoured. Wear green because the earth is green and alive. Observe the fast in the form your health allows. Say the sankalp with the wish you carry. Read the katha and let Shiva's narration of Parvati's story remind you of what devotion looks like when it is lived over a long time, across difficulty, without diminishment.\n\nRelated Pujans\n\nSawan Somwar Vrat\n\nEarlier in Shravan month  |  Deity Cluster \u2014 same Shiva-Parvati devotion\n\nLIVE\n\nNag Panchami\n\nFalls two days after (17 August)  |  Season Cluster \u2014 same Shravan window\n\nLIVE\n\nKajari Teej\n\nLater in Shravan / early Bhadrapada  |  Vrat Type Cluster \u2014 same saubhagya vrat structure\n\nLIVE\n\nHartalika Teej\n\nBhadrapada Shukla Tritiya (14 September 2026)  |  Vrat Type Cluster \u2014 distinct from Hariyali Teej\n\nLIVE\n\nMahashivratri\n\nThe peak Shiva festival of the year  |  Deity Cluster\n\nCOMING SOON\n\nWhatsApp Subscription Nudge\n\n\ud83d\udcac  Get reminded before every festival   WhatsApp reminders \u2014 \u20b9499/yr  \u203a\n\nSticky Bottom Bar\n\nRITUAL CARD 3 OF 7\n\n\u0924\u092a\u094d\n\nHariyali Teej\n\n15 August 2026  |  Saturday  |  Shravana Shukla Tritiya\n\nDATE\n\nTITHI\n\nFAST BREAK\n\n15 Aug\n\nSaturday\n\nShravana Shukla Tritiya\n\nTritiya ends 5:30 PM\n\nAt moonrise\n\nOr next morning\n\nSAMAGRI CHECKLIST\n\nFor Shiva\n\nFor Parvati (shringar)\n\n\u2610  Ganga Jal / clean water\n\n\u2610  Sindoor\n\n\u2610  Cow's milk\n\n\u2610  Kumkum\n\n\u2610  Belpatra (bilva leaves)\n\n\u2610  Green bangles\n\n\u2610  Panchamrit\n\n\u2610  Mehendi\n\n\u2610  Chandan\n\n\u2610  Red chunri\n\n\u2610  Dhatura flower\n\n\u2610  Bindi + kajal\n\n\u2610  White flowers\n\n\u2610  Haldi (turmeric)\n\n\u2610  Diya + ghee\n\n\u2610  Fruits + ghewar\n\nVIDHI \u2014 STEP BY STEP\n\n1\n\nBathe and dress in green \u2014 apply mehendi if practised\n\n2\n\nSet up idols of Shiva, Parvati, and Ganesha\n\n3\n\nTake the Vrat Sankalp facing east\n\n4\n\nAbhishek of Shiva with water, milk, panchamrit + belpatra\n\n5\n\nOffer sindoor, bangles, shringar to Parvati\n\n6\n\nListen to or recite the Vrat Katha\n\n7\n\nSing bhajans, perform aarti in the evening\n\n8\n\nBreak fast after moonrise or next morning (per family tradition)\n\nMANTRA\n\n\u0950 \u0928\u092e\u0903 \u0936\u093f\u0935\u093e\u092f\n\nOm Namah Shivaya\n\n108 times, or 11 / 21 / 51\n\nFASTING\n\nNirjala \u2014 without food or water. Demanding.\n\nSajal \u2014 with water. Widely accepted.\n\nPhalahar \u2014 fruit-based. For health conditions.\n\n\u0924\u092a\u094d\n\nthetapaco.com\n\nSource: Drik Panchang, Delhi-NCR  |  2026\n\nThe Vrat Katha is not a separate legend. It is Shiva himself \u2014 on the day he accepted Parvati \u2014 narrating back to her the story of what she endured to reach him. This is the form preserved in the Shiva Purana, and it is why the katha is considered essential to the vrat: hearing it is the devotee's way of stepping into Parvati's story.\n\nThe Vrat Katha \u2014 as narrated by Shiva to Parvati (Shiva Purana, Rudra Samhita)\n\nShiva spoke:  'Parvati, in your first life you were Sati \u2014 my wife, the daughter of Daksha. You had resolved even then, before you knew me, that I alone would be your husband. When Daksha insulted me and you gave up your life in protest, I was consumed with grief. But your resolve did not end with your life.  You were reborn as the daughter of Himavan. And in this birth too, from the moment you were conscious, you carried the same sankalp: that Shiva alone would be your husband.  When your father Himavan heard from the sage Narada that Lord Vishnu wished to marry you, he consented. But you did not. A loyal friend took you into the forest so that you could complete your tapasya undisturbed.  In the forest, on the bank of a river, you shaped a Shivalinga from the sand of the riverbed. You worshipped it through the entire night of Shravana Shukla Tritiya \u2014 without food, without water, without sleep. The night passed. The morning came. I appeared before you.  I offered you any boon. You said: Lord, you are the boon. Be my husband.  I agreed. You returned to your father and told him: I will come home, but only if you give me in marriage to Shiva, and no one else. Himavan agreed. Our marriage was performed.  Parvati, this story \u2014 of your tapasya, your resolve, this night, this day \u2014 I am telling you now so that it is never lost. Any woman who observes a fast on Shravana Shukla Tritiya, who worships us with devotion, who hears this story told \u2014 she will receive the same blessing you received. Married women will find harmony and long-lived husbands. Unmarried women will find partners worthy of their devotion. The vrat will never be incomplete for her.'  Shiva fell silent. Parvati listened. And on that day, the vrat was established.\n\nThe katha is traditionally recited in the evening, after the puja, in the presence of Shiva and Parvati. Many households read it aloud together; in some communities, women gather with neighbours to hear it. A printed version for distribution \u2014 or a digital card for sharing \u2014 is an appropriate accompaniment to this article.",
    "steps": [
      {
        "order": 1,
        "title": "Bathe and dress in clean clothes \u2014 green attire is traditional",
        "description": "Rise early, bathe, and wear clean clothes. Green is strongly associated with Hariyali Teej and the monsoon's greenery.",
        "note": "Dharma \u2014 preparatory]  [Green attire \u2014 Pratha"
      },
      {
        "order": 2,
        "title": "Set up the altar with idols or images of Shiva, Parvati, and Ganesha",
        "description": "A brass or clay idol, or images of all three, on a clean red or white cloth over a chowki. Some households make temporary clay idols specifically for this day.",
        "note": "Dharma"
      },
      {
        "order": 3,
        "title": "Take the Vrat Sankalp",
        "description": "Sit facing east. Take a small spoon of water in your right palm and make a sincere resolve: to observe this vrat with devotion for the wellbeing of your marriage and family, or for the sankalp you carry.",
        "note": "Dharma"
      },
      {
        "order": 4,
        "title": "Perform abhishek of Shiva with water, milk, and panchamrit",
        "description": "Pour Ganga Jal first, then cow's milk, then panchamrit if observing the full form. Offer belpatra. Apply chandan to the Shivalinga. This is the central act of devotion.",
        "note": "Dharma \u2014 core act]  [Belpatra \u2014 Dharma 5/5]  [Shiva Purana"
      },
      {
        "order": 5,
        "title": "Offer sindoor, bangles, and shringar to Parvati",
        "description": "Place sindoor, kumkum, green bangles, mehendi, and other shringar items on a small tray before Parvati's image. Offer red flowers to Parvati and white flowers to Shiva.",
        "note": "Dharma \u2014 shodashopachara]  [Shringar form \u2014 Pratha"
      },
      {
        "order": 6,
        "title": "Listen to or read the Vrat Katha",
        "description": "The recitation of the katha \u2014 Shiva narrating the story of Parvati's tapasya \u2014 is the essential act that transmits the merit of the vrat. See the Vrat Katha section below.",
        "note": "Dharma \u2014 mandatory]  [Shiva Purana"
      },
      {
        "order": 7,
        "title": "Sing bhajans and perform aarti in the evening",
        "description": "Light the diya and perform Shiva-Parvati aarti. In many households, women gather with family and neighbours for songs and bhajans dedicated to Parvati through the evening.",
        "note": "Dharma"
      },
      {
        "order": 8,
        "title": "Break the fast",
        "description": "For those observing the fast until the next morning: break it after bathing on the 16th August at sunrise. For those observing a sajal or phalahar fast: break it after moonrise on the evening of the 15th, after the aarti is complete.",
        "note": "Dharma"
      }
    ],
    "samagriItems": [
      {
        "name": "Ganga Jal / clean water",
        "function": "Offered with devotion in pujan",
        "order": 1
      },
      {
        "name": "Sindoor",
        "function": "Offered with devotion in pujan",
        "order": 2
      },
      {
        "name": "Cow's milk",
        "function": "Offered with devotion in pujan",
        "order": 3
      },
      {
        "name": "Kumkum",
        "function": "Offered with devotion in pujan",
        "order": 4
      },
      {
        "name": "Belpatra",
        "function": "Offered with devotion in pujan",
        "order": 5
      },
      {
        "name": "Green bangles",
        "function": "Offered with devotion in pujan",
        "order": 6
      },
      {
        "name": "Panchamrit",
        "function": "Offered with devotion in pujan",
        "order": 7
      },
      {
        "name": "Mehendi",
        "function": "Offered with devotion in pujan",
        "order": 8
      },
      {
        "name": "Chandan",
        "function": "Offered with devotion in pujan",
        "order": 9
      },
      {
        "name": "Red chunri",
        "function": "Offered with devotion in pujan",
        "order": 10
      },
      {
        "name": "Dhatura flower",
        "function": "Offered with devotion in pujan",
        "order": 11
      },
      {
        "name": "Bindi + kajal",
        "function": "Offered with devotion in pujan",
        "order": 12
      },
      {
        "name": "White flowers",
        "function": "Offered with devotion in pujan",
        "order": 13
      },
      {
        "name": "Haldi",
        "function": "Offered with devotion in pujan",
        "order": 14
      },
      {
        "name": "Diya + ghee",
        "function": "Offered with devotion in pujan",
        "order": 15
      },
      {
        "name": "Fruits + ghewar",
        "function": "Offered with devotion in pujan",
        "order": 16
      }
    ],
    "mantras": [
      {
        "devanagari": "\u0950 \u0928\u092e\u0903 \u0936\u093f\u0935\u093e\u092f",
        "transliteration": "Om Namah Shivaya",
        "meaning": "108 times, or 11 / 21 / 51"
      }
    ],
    "dpbEntries": [
      {
        "elementName": "Myths",
        "tag": "BHRANTI",
        "confidenceScore": 4,
        "claim": "Myths",
        "correction": "",
        "sourceOfTruth": "Scriptures",
        "reviewStatus": "APPROVED"
      },
      {
        "elementName": "\"If you don't keep a nirjala fast, the Hariyali Te",
        "tag": "BHRANTI",
        "confidenceScore": 4,
        "claim": "\"If you don't keep a nirjala fast, the Hariyali Teej vrat doesn't really count.\"",
        "correction": "No source text makes nirjala mandatory for this vrat. The Shiva Purana establishes fasting with devotion \u2014 not a specific form of fasting. Sajal (with water) and phalahar (fruit-based) fasts are recognised, accepted forms. A fast adapted to your health, kept with sincerity, is a complete vrat.",
        "sourceOfTruth": "Scriptures",
        "reviewStatus": "APPROVED"
      },
      {
        "elementName": "\"This vrat is harder than Karwa Chauth, so it coun",
        "tag": "BHRANTI",
        "confidenceScore": 4,
        "claim": "\"This vrat is harder than Karwa Chauth, so it counts for more \u2014 it's the bigger test of devotion.\"",
        "correction": "No scripture ranks vrats against each other by physical difficulty. Parvati's tapasya lasted years \u2014 the tradition honours the quality and duration of devotion, not its severity in a single day. Comparing hardship distracts from the actual point: steady, patient love.",
        "sourceOfTruth": "Scriptures",
        "reviewStatus": "APPROVED"
      },
      {
        "elementName": "\"Hariyali Teej and Hartalika Teej are the same fes",
        "tag": "BHRANTI",
        "confidenceScore": 4,
        "claim": "\"Hariyali Teej and Hartalika Teej are the same festival observed at different times.\"",
        "correction": "They are two distinct festivals with different origins. Hariyali Teej falls on Shravana Shukla Tritiya (this year, 15 August) and celebrates the arrival of the monsoon alongside Parvati's tapasya. Hartalika Teej falls on Bhadrapada Shukla Tritiya (14 September in 2026) and commemorates specifically the episode of Parvati's friend taking her into the forest \u2014 its name, Hartalika, means 'the abduction by a female friend'. Different tithi, different month, different narrative.",
        "sourceOfTruth": "Scriptures",
        "reviewStatus": "APPROVED"
      }
    ],
    "thumbnailUrl": "/uploads/hariyali-teej.png",
    "panchangObservance": "Hariyali Teej",
    "panchangObservanceSub": "Shukla Paksha",
    "panchangMuhurta": "Morning",
    "panchangMuhurtaSub": "Auspicious timings",
    "panchangTithi": "Shukla Paksha",
    "panchangTithiSub": "Delhi-NCR",
    "panchangNote": "Timings and observances may vary slightly based on local sunset and city location. Check drikpanchang.com for local precision.",
    "sources": [
      {
        "name": "Bhavishya Purana",
        "reference": "Uttara Parva Ch.137",
        "type": "SHASTRA"
      }
    ],
    "relatedRitualGuides": [
      "kajari-teej",
      "nag-panchami",
      "hartalika-teej",
      "sawan-somwar"
    ]
  },
  {
    "title": "Kajari Teej: Vidhi and Why It Differs",
    "slug": "kajari-teej",
    "category": "Festive Pujans",
    "introText": "Three festivals carry the name Teej in the Hindu calendar. All three are for women. All three involve fasting and the worship of Shiva-Parvati. All three fall between July and September. And all three are persistently confused with each other online.\n\nKajari Teej is the middle one \u2014 fifteen days after Hariyali Teej, fourteen days before Hartalika Teej. It falls on the third day (Tritiya) of the dark fortnight (Krishna Paksha) of Bhadrapada. In North India it is called Badi Teej \u2014 the big Teej \u2014 because the observance is intense: a nirjala fast until moonrise, the worship of Neemdi Mata, and the preparation of sattu, all against a backdrop of the Kajri folk songs that give the festival its name.\n\nWhat makes Kajari Teej distinct from the other two Teejs is not primarily scriptural \u2014 it is cultural. Where Hariyali Teej is rooted in the Shiva Purana and Hartalika Teej in the Shiva-Parvati reunion narrative, Kajari Teej's identity is carried primarily by folk tradition: the neem tree, the kund, the sattu, the songs. The puja structure is the same saubhagya vrat form as the other two. The spirit is identical. What distinguishes it is the texture of its practice.",
    "introTitle": "Introduction to the Pujan",
    "introDesc": "Three festivals carry the name Teej in the Hindu calendar. All three are for women. All three involve fasting and the worship of Shiva-Parvati. All three fall between July and September. And all three are persistently confused with each other online.",
    "sankalpaBody": "\u092e\u092e \u0938\u0915\u0932-\u0936\u093e\u0928\u094d\u0924\u093f-\u092a\u0942\u0930\u094d\u0935\u0915-\u0926\u0940\u0930\u094d\u0918\u093e\u092f\u0941-\u0935\u093f\u092d\u0942\u0924\u093f-\u092c\u0932-\u0915\u0940\u0930\u094d\u0924\u093f-\u092a\u094d\u0930\u093e\u092a\u094d\u0924\u094d\u092f\u0930\u094d\u0925\u0902, \u092a\u0942\u091c\u0928\u0902 \u0915\u0930\u093f\u0937\u094d\u092f\u0947\u0964",
    "sankalpaQuote": "With a sincere heart, I resolve to perform this worship for peace, longevity, strength, and devotion.",
    "sankalpaWho": "Devotee / Married Couple",
    "sankalpaForWhat": "Saubhagya & Spiritual Peace",
    "fastOptions": [
      {
        "name": "Nirjala Fast",
        "desc": "Observed completely without food or water.",
        "recommended": false
      },
      {
        "name": "Sajal Fast",
        "desc": "Observed with water and liquid intake permitted.",
        "recommended": true
      },
      {
        "name": "Phalahar Fast",
        "desc": "Observed consuming only fruits, milk and water.",
        "recommended": false
      }
    ],
    "fastNote": "Grain avoidance is recommended to maintain physical and spiritual purity during the fast.",
    "kathaTitle": "Kajari Teej Legend",
    "kathaBody": "The name Kajari comes from Kajri \u2014 a genre of folk song sung in the Bhojpuri belt of Uttar Pradesh, Bihar, and Jharkhand during the monsoon season. Kajri songs are about separation and longing: a woman missing her husband, or a bride in her maternal home watching the rains without him. Sung under swings, in courtyards, in groups, they are among the oldest surviving folk traditions of this region. The festival of Kajari Teej takes its name from these songs \u2014 not the other way around.\n\nThe puja structure of Kajari Teej \u2014 a saubhagya vrat for marital harmony, fasting, the worship of Shiva and Parvati, the offering of sindoor and shringar items \u2014 is the same structure shared by all three Teej festivals. This structure comes from the Dharmashastra and Agama tradition of saubhagya vrats: fasts observed by married women for the long life and wellbeing of their husbands. What Kajari Teej adds to this structure is specific to itself: the neem tree, the clay kund, the sattu, the moonrise fast-break.\n\nNeemdi Mata is a form of the Divine Mother associated specifically with Kajari Teej. The neem branch installed in the clay kund represents her presence. Neem is widely associated across India with protection, health, and the cooling of fever \u2014 qualities attributed to the Divine Mother. The worship of Neemdi Mata at Kajari Teej is oral tradition rather than textual prescription; it belongs to the same layer of living practice as the Kajri songs and the sattu offering.\n\nSection: How Kajari Teej Differs from Hariyali and Hartalika Teej\n\nHariyali Teej\n\nKajari Teej\n\nHartalika Teej\n\nMonth\n\nShravana (Shukla Paksha)\n\nBhadrapada (Krishna Paksha)\n\nBhadrapada (Shukla Paksha)\n\nPaksha\n\nWaxing (bright)\n\nWaning (dark)\n\nWaxing (bright)\n\n2026 Date\n\n15 August\n\n31 August\n\n14 September\n\nFounding source\n\nShiva Purana\n\nFolk tradition / oral\n\nShiva Purana (Hartalika episode)\n\nDistinctive practice\n\nGreen attire, jhula, sinjara\n\nNeemdi Mata / neem kund, sattu, kajri songs\n\nNight jagaran, sand idols, no food until next morning\n\nFast break\n\nAt moonrise OR next morning (varies by family)\n\nAt moonrise \u2014 after moon arghya\n\nNext morning at dawn \u2014 nirjala 24-hour\n\nStrictness\n\nModerate \u2014 forms vary\n\nModerate to strict\n\nStrictest \u2014 24-hour nirjala most observed\n\nClassification\n\nDHARMA 4/5\n\nMIXED 3/5\n\nDHARMA 4/5\n\nThe most common confusion is between Kajari and Hariyali Teej. They are fifteen days apart, both involve Shiva-Parvati worship, both involve fasting, and both are celebrated primarily in North India. The practical distinctions are three: Kajari falls in the dark fortnight (Krishna Paksha), its fast is broken at moonrise not the next morning, and its signature practices \u2014 neem, sattu, kajri songs \u2014 have no equivalent in Hariyali Teej.\n\nThe confusion between Kajari and Hartalika Teej is less common but also significant. Both fall in Bhadrapada, but Hartalika is in the Shukla Paksha two weeks later, has a 24-hour nirjala fast, and takes its name from a specific Puranic episode (the abduction of Parvati by her friend). Kajari is in the Krishna Paksha, breaks at moonrise, and is named for a folk song form, not a Puranic event.\n\nSection: How It's Observed \u2014 By Region\n\nRajasthan (Bundi)\n\nUP / Bihar / Jharkhand\n\nMadhya Pradesh\n\nWhat's shared\n\nThe Kajali Teej Mela in Bundi is the grandest celebration in India. A procession of the Teej Mata idol, decorated elephants, folk performances, Ghoomar and Kalbeliya dances. Grand fair with ghevar, feni, and traditional foods. Swing decorated with mango leaves.\n\nNeemdi Mata worship in courtyards. Clay kund preparation, neem branch, sattu offering. Kajri folk songs with dholak. Women in green sarees. Cow feeding at day's end.\n\nBundelkhand and Baghelkhand: community group dances in local dialect songs. Nature worship alongside Shiva-Parvati puja. Swings and sattu offering.\n\nSaubhagya vrat fast, Shiva-Parvati puja with sindoor and shringar offerings, moon arghya at moonrise, fast broken after moon worship. Kajri songs in various forms.\n\nPratha \u2014 Rajasthan scale\n\nPratha \u2014 Bhojpuri belt\n\nPratha \u2014 Bundeli tradition\n\nDharma \u2014 core vrat structure\n\nSamagri Checklist  (locked \u2014 do not edit items or tags)\n\nShared puja samagri (same as Hariyali Teej):\n\nITEM\n\nCLASSIFICATION\n\nNOTE\n\nGanga Jal or clean water\n\nDHARMA \u2014 Mandatory\n\nFor abhishek.\n\nSindoor, kumkum, haldi\n\nDHARMA \u2014 Mandatory\n\nOffered to Parvati.\n\nGreen bangles\n\nPRATHA \u2014 Strongly traditional\n\nTraditional for all three Teej festivals.\n\nFlowers, incense, diya\n\nDHARMA \u2014 Optional\n\nStandard puja.\n\nKajari-specific samagri (unique to this festival):\n\nITEM\n\nCLASSIFICATION\n\nNOTE\n\nNeem twig with leaves (Neemdi Mata)\n\nPRATHA \u2014 Mandatory (by tradition)\n\nThe defining item of Kajari Teej. A fresh neem branch planted upright in the clay kund. Not present in Hariyali or Hartalika Teej.\n\nSattu (roasted gram flour with jaggery and ghee)\n\nPRATHA \u2014 Mandatory (by tradition)\n\nFestival-specific prasad. Prepared the morning of the fast; offered to Neemdi Mata; shared after moonrise. The name 'Satudi Teej' derives from sattu.\n\nClay for kund (small pond-like structure)\n\nPRATHA \u2014 Optional / regional\n\nSome households make the clay kund; others simply place the neem branch in a puja vessel. Regional variation.\n\nRaw milk (not boiled)\n\nPRATHA \u2014 Strongly traditional\n\nPoured into the clay kund. Women see the moon's reflection in the milk-water surface before breaking the fast.\n\nLemon, cucumber, whole rice (for puja thali)\n\nPRATHA \u2014 Optional\n\nRegional puja thali tradition for Kajari Teej.\n\nSmall jaggery-ghee chapati (for cow feeding)\n\nPRATHA \u2014 Optional / regional\n\nCow is fed before the woman eats after the fast. Bhojpuri-belt tradition.\n\nSilver ring and wheat grains (for moon arghya)\n\nPRATHA \u2014 Optional\n\nHeld while offering arghya to the moon. Regional tradition.\n\nImage 2  |  Half-width pair  |  After samagri, before puja steps\n\nIMAGE 2 \u2014 Half-width pair \u2014 after samagri section, before puja steps\n\nLeft image Caption - The prasad that gives Kajari Teej one of its names (Satudi Teej)  \u00b7\n\nRight image caption: Kajri songs,  the folk tradition that gives the festival its name.\"\n\nSection: The Vidhi \u2014 Step by Step\n\n1\n\nBathe before sunrise and dress in green\n\nRise early and bathe before the fast begins. Wear green traditional attire \u2014 green is common to all three Teej festivals. Apply mehendi and prepare for the full day.\n\n2\n\nPrepare the sattu\n\nMix roasted gram flour with jaggery and pure ghee. This will be offered to Neemdi Mata in the evening and shared as prasad after the fast. Some households also prepare chapatis with jaggery and ghee for the cow feeding.\n\n3\n\nTake the Vrat Sankalp\n\nSit before the Shiva-Parvati altar. Make a sincere resolve to keep the fast through the day until moonrise.\n\n4\n\nMorning Shiva-Parvati puja\n\nSet up idols or images of Shiva, Parvati, and Ganesha. Perform abhishek with water and milk. Offer sindoor, kumkum, and shringar items to Parvati. Offer flowers, incense, and light the diya.\n\n5\n\nPrepare and worship Neemdi Mata in the evening\n\nAs evening approaches, prepare the puja space. Make a small clay kund (or use a vessel) and plant a fresh neem branch upright in it. Pour raw milk and water into the kund. Place the sattu, lemon, cucumber, and whole rice on the puja thali. Apply sindoor, kumkum, and mehndi to the neem branch. Light a diya near the kund. Worship Neemdi Mata \u2014 offer the sindoor and shringar, recite the Kajari Teej vrat katha.\n\n6\n\nOffer arghya to the Moon at moonrise\n\nWhen the moon rises, offer arghya \u2014 a mixture of water and milk \u2014 facing the moon. In many traditions, hold a silver ring and wheat grains while offering. Perform three or four pradakshina (clockwise rotations). Look at the moon's reflection in the milk-water of the kund \u2014 this is the traditional signal that the fast may be broken.\n\n7\n\nFeed a cow, then break the fast\n\nFeed the cow with the jaggery-ghee chapati (where this tradition is observed). Break the fast with water, then sattu prasad and other prepared foods \u2014 without garlic, onion, or non-vegetarian items.\n\nSection: Myths & Facts\n\n\u2715  \"Kajari Teej is the same as Hariyali Teej, just observed two weeks later.\"\n\n\u2713  They are distinct festivals. Hariyali Teej is in Shravana Shukla Paksha (waxing moon), rooted in the Shiva Purana, its signature practices are the green attire and jhula. Kajari Teej is in Bhadrapada Krishna Paksha (waning moon), rooted primarily in folk tradition, its signature practices are the neem tree, sattu, and kajri songs. Both worship Shiva-Parvati; neither is a variant of the other.\n\n\u2715  \"Kajari Teej is described in the Shiva Purana.\"\n\n\u2713  No named chapter or verse in the Shiva Purana or any other Purana establishes Bhadrapada Krishna Tritiya specifically as a Shiva-Parvati event distinct from Hariyali Teej. Kajari Teej's identity is carried primarily by oral folk tradition from the Bhojpuri belt \u2014 the kajri songs, the Neemdi Mata worship, the sattu. The puja structure shares the saubhagya vrat tradition with the other Teej festivals, but that tradition is not unique to Kajari Teej.\n\nClosing Prose\n\nKajri songs are songs about separation. A woman in her mother's home, watching the monsoon arrive, missing her husband. They are sung under swings hung from trees heavy with rain-wet leaves. The form of the song \u2014 longing, the beauty of nature, the waiting \u2014 is the emotional texture of Kajari Teej itself.\n\nThe festival lands in the dark fortnight, the waning moon, the deeper monsoon. The neem tree is not a decorative choice \u2014 it is medicinal, protective, bitter in the way that life is sometimes bitter, and sacred to the Divine Mother in a tradition that has no Puranic text behind it but needs none. Neemdi Mata's presence is felt in the neem branch, the kund, the raw milk poured over roots. This is the oldest kind of practice: direct, local, unmediated by a text, and alive because it has been lived continuously.\n\nHariyali Teej\n\n15 August 2026  |  The Shravana Shukla Teej \u2014 Puranic foundation\n\nLIVE\n\nHartalika Teej\n\n14 September 2026  |  The Bhadrapada Shukla Teej \u2014 strictest of the three\n\nCOMING SOON\n\nSawan Somwar Vrat\n\nSame Shravan-Bhadrapada window  |  Deity Cluster \u2014 Shiva-Parvati devotion\n\nLIVE\n\n\ud83d\udcac  Get reminded before every festival   WhatsApp reminders \u2014 \u20b9499/yr  \u203a\n\nRITUAL CARD 5 OF 7\n\n\u0924\u092a\u094d\n\nKajari Teej\n\n31 August 2026  |  Monday  |  Bhadrapada Krishna Tritiya\n\nDATE\n\nTITHI\n\nFAST BREAK\n\nALSO KNOWN\n\n31 Aug\n\nMonday\n\nBhadra. Krishna Tritiya\n\nEnds 8:51 AM\n\nAt moonrise\n\nEvening of 31 Aug\n\nBadi Teej\n\nSatudi Teej\n\nSAMAGRI CHECKLIST\n\nShared puja\n\nKajari-specific\n\n\u2610  Ganga Jal / water\n\n\u2610  Neem twig with leaves\n\n\u2610  Sindoor + kumkum\n\n\u2610  Sattu (gram flour + jaggery + ghee)\n\n\u2610  Green bangles\n\n\u2610  Clay for kund\n\n\u2610  Flowers + incense\n\n\u2610  Raw milk (for kund)\n\n\u2610  Diya + ghee\n\n\u2610  Jaggery-ghee chapati (cow feeding)\n\n\u2610  Silver ring + wheat (moon arghya)\n\nVIDHI \u2014 STEP BY STEP\n\n1\n\nBathe before sunrise, dress in green\n\n2\n\nPrepare the sattu (roasted gram + jaggery + ghee)\n\n3\n\nTake the Vrat Sankalp before the Shiva-Parvati altar\n\n4\n\nMorning Shiva-Parvati puja \u2014 abhishek, sindoor, shringar\n\n5\n\nEvening: prepare clay kund, plant neem branch, pour raw milk\n\n6\n\nWorship Neemdi Mata \u2014 offer sindoor, recite katha\n\n7\n\nAt moonrise: offer arghya to the moon, see reflection in kund\n\n8\n\nFeed a cow, then break the fast with sattu prasad\n\nFASTING\n\nNirjala \u2014 common in Rajasthan.\n\nPhalahar \u2014 accepted in most regions.\n\nFast breaks at moonrise \u2014 not next morning.\n\n\u0924\u092a\u094d\n\nthetapaco.com\n\nSource: Drik Panchang, Delhi-NCR  |  2026",
    "steps": [
      {
        "order": 1,
        "title": "Bathe before sunrise and dress in green",
        "description": "Rise early and bathe before the fast begins. Wear green traditional attire \u2014 green is common to all three Teej festivals. Apply mehendi and prepare for the full day.",
        "note": "Dharma \u2014 preparatory]  [Green attire \u2014 Pratha"
      },
      {
        "order": 2,
        "title": "Prepare the sattu",
        "description": "Mix roasted gram flour with jaggery and pure ghee. This will be offered to Neemdi Mata in the evening and shared as prasad after the fast. Some households also prepare chapatis with jaggery and ghee for the cow feeding.",
        "note": "Pratha \u2014 Kajari-specific"
      },
      {
        "order": 3,
        "title": "Take the Vrat Sankalp",
        "description": "Sit before the Shiva-Parvati altar. Make a sincere resolve to keep the fast through the day until moonrise.",
        "note": "Dharma"
      },
      {
        "order": 4,
        "title": "Morning Shiva-Parvati puja",
        "description": "Set up idols or images of Shiva, Parvati, and Ganesha. Perform abhishek with water and milk. Offer sindoor, kumkum, and shringar items to Parvati. Offer flowers, incense, and light the diya.",
        "note": "Dharma \u2014 core puja"
      },
      {
        "order": 5,
        "title": "Prepare and worship Neemdi Mata in the evening",
        "description": "As evening approaches, prepare the puja space. Make a small clay kund (or use a vessel) and plant a fresh neem branch upright in it. Pour raw milk and water into the kund. Place the sattu, lemon, cucumber, and whole rice on the puja thali. Apply sindoor, kumkum, and mehndi to the neem branch. Light a diya near the kund. Worship Neemdi Mata \u2014 offer the sindoor and shringar, recite the Kajari Teej vrat katha.",
        "note": "Pratha \u2014 Kajari-specific"
      },
      {
        "order": 6,
        "title": "Offer arghya to the Moon at moonrise",
        "description": "When the moon rises, offer arghya \u2014 a mixture of water and milk \u2014 facing the moon. In many traditions, hold a silver ring and wheat grains while offering. Perform three or four pradakshina (clockwise rotations). Look at the moon's reflection in the milk-water of the kund \u2014 this is the traditional signal that the fast may be broken.",
        "note": "Dharma \u2014 moon worship]  [Arghya form \u2014 Pratha"
      },
      {
        "order": 7,
        "title": "Feed a cow, then break the fast",
        "description": "Feed the cow with the jaggery-ghee chapati (where this tradition is observed). Break the fast with water, then sattu prasad and other prepared foods \u2014 without garlic, onion, or non-vegetarian items.",
        "note": "Pratha \u2014 cow feeding]  [Dharma \u2014 fast break"
      }
    ],
    "samagriItems": [
      {
        "name": "Ganga Jal / water",
        "function": "Offered with devotion in pujan",
        "order": 1
      },
      {
        "name": "Neem twig with leaves",
        "function": "Offered with devotion in pujan",
        "order": 2
      },
      {
        "name": "Sindoor + kumkum",
        "function": "Offered with devotion in pujan",
        "order": 3
      },
      {
        "name": "Sattu",
        "function": "Offered with devotion in pujan",
        "order": 4
      },
      {
        "name": "Green bangles",
        "function": "Offered with devotion in pujan",
        "order": 5
      },
      {
        "name": "Clay for kund",
        "function": "Offered with devotion in pujan",
        "order": 6
      },
      {
        "name": "Flowers + incense",
        "function": "Offered with devotion in pujan",
        "order": 7
      },
      {
        "name": "Raw milk",
        "function": "Offered with devotion in pujan",
        "order": 8
      },
      {
        "name": "Diya + ghee",
        "function": "Offered with devotion in pujan",
        "order": 9
      },
      {
        "name": "Jaggery-ghee chapati",
        "function": "Offered with devotion in pujan",
        "order": 10
      },
      {
        "name": "Silver ring + wheat",
        "function": "Offered with devotion in pujan",
        "order": 11
      }
    ],
    "mantras": [
      {
        "devanagari": "\u0950 \u0928\u092e\u0903 \u0936\u093f\u0935\u093e\u092f",
        "transliteration": "Om Namah Shivaya",
        "meaning": "I bow to the Divine Lord Shiva."
      }
    ],
    "dpbEntries": [
      {
        "elementName": "Myths",
        "tag": "BHRANTI",
        "confidenceScore": 4,
        "claim": "Myths",
        "correction": "",
        "sourceOfTruth": "Scriptures",
        "reviewStatus": "APPROVED"
      },
      {
        "elementName": "\"Kajari Teej is the same as Hariyali Teej, just ob",
        "tag": "BHRANTI",
        "confidenceScore": 4,
        "claim": "\"Kajari Teej is the same as Hariyali Teej, just observed two weeks later.\"",
        "correction": "They are distinct festivals. Hariyali Teej is in Shravana Shukla Paksha (waxing moon), rooted in the Shiva Purana, its signature practices are the green attire and jhula. Kajari Teej is in Bhadrapada Krishna Paksha (waning moon), rooted primarily in folk tradition, its signature practices are the neem tree, sattu, and kajri songs. Both worship Shiva-Parvati; neither is a variant of the other.",
        "sourceOfTruth": "Scriptures",
        "reviewStatus": "APPROVED"
      },
      {
        "elementName": "\"Kajari Teej is described in the Shiva Purana.\"",
        "tag": "BHRANTI",
        "confidenceScore": 4,
        "claim": "\"Kajari Teej is described in the Shiva Purana.\"",
        "correction": "No named chapter or verse in the Shiva Purana or any other Purana establishes Bhadrapada Krishna Tritiya specifically as a Shiva-Parvati event distinct from Hariyali Teej. Kajari Teej's identity is carried primarily by oral folk tradition from the Bhojpuri belt \u2014 the kajri songs, the Neemdi Mata worship, the sattu. The puja structure shares the saubhagya vrat tradition with the other Teej festivals, but that tradition is not unique to Kajari Teej.",
        "sourceOfTruth": "Scriptures",
        "reviewStatus": "APPROVED"
      }
    ],
    "thumbnailUrl": "/uploads/kajari-teej.png",
    "panchangObservance": "Kajari Teej",
    "panchangObservanceSub": "Shukla Paksha",
    "panchangMuhurta": "Morning",
    "panchangMuhurtaSub": "Auspicious timings",
    "panchangTithi": "Shukla Paksha",
    "panchangTithiSub": "Delhi-NCR",
    "panchangNote": "Timings and observances may vary slightly based on local sunset and city location. Check drikpanchang.com for local precision.",
    "sources": [
      {
        "name": "Bhavishya Purana",
        "reference": "Uttara Parva Ch.137",
        "type": "SHASTRA"
      }
    ],
    "relatedRitualGuides": [
      "hariyali-teej",
      "hartalika-teej",
      "nag-panchami"
    ]
  },
  {
    "title": "Hartalika Teej: The Strictest Teej - Complete Vidhi and Vrat Katha",
    "slug": "hartalika-teej",
    "category": "Festive Pujans",
    "introText": "The name tells you what happened. Hartalika is a compound of two words: harat, meaning to take away, and aalika, meaning a female friend. On this day, Parvati's closest friend took her - abducted her, in the language of the text - deep into a forest so that she could worship Shiva undisturbed, instead of being married off to someone she did not choose.\n\nHartalika Teej falls on the third day (Tritiya) of Shukla Paksha in the month of Bhadrapada. It is the strictest of the three Teej festivals: a 24-hour nirjala fast, an all-night vigil, and the making and immersion of sand or clay idols of Shiva and Parvati - all of which mirror, in practice, what Parvati herself is said to have done on this night.\n\nWhere Hariyali Teej (Shravana Shukla Tritiya) celebrates the monsoon's arrival and Parvati's tapasya in general, and Kajari Teej (Bhadrapada Krishna Tritiya) is carried by folk tradition and the kajri songs, Hartalika Teej is anchored in a specific Puranic episode - the friend's intervention - that gives the festival its name, its narrative, and its distinctive practices.",
    "introTitle": "Introduction to the Pujan",
    "introDesc": "The name tells you what happened. Hartalika is a compound of two words: harat, meaning to take away, and aalika, meaning a female friend. On this day, Parvati's closest friend took her - abducted her, in the language of the text - deep into a forest so that she could worship Shiva undisturbed, instead of being married off to someone she did not choose.",
    "sankalpaBody": "\u092e\u092e \u0938\u0915\u0932-\u0936\u093e\u0928\u094d\u0924\u093f-\u092a\u0942\u0930\u094d\u0935\u0915-\u0926\u0940\u0930\u094d\u0918\u093e\u092f\u0941-\u0935\u093f\u092d\u0942\u0924\u093f-\u092c\u0932-\u0915\u0940\u0930\u094d\u0924\u093f-\u092a\u094d\u0930\u093e\u092a\u094d\u0924\u094d\u092f\u0930\u094d\u0925\u0902, \u092a\u0942\u091c\u0928\u0902 \u0915\u0930\u093f\u0937\u094d\u092f\u0947\u0964",
    "sankalpaQuote": "With a sincere heart, I resolve to perform this worship for peace, longevity, strength, and devotion.",
    "sankalpaWho": "Devotee / Married Couple",
    "sankalpaForWhat": "Saubhagya & Spiritual Peace",
    "fastOptions": [
      {
        "name": "Nirjala Fast",
        "desc": "Observed completely without food or water.",
        "recommended": false
      },
      {
        "name": "Sajal Fast",
        "desc": "Observed with water and liquid intake permitted.",
        "recommended": true
      },
      {
        "name": "Phalahar Fast",
        "desc": "Observed consuming only fruits, milk and water.",
        "recommended": false
      }
    ],
    "fastNote": "Grain avoidance is recommended to maintain physical and spiritual purity during the fast.",
    "kathaTitle": "Hartalika Teej Legend",
    "kathaBody": "",
    "steps": [
      {
        "order": 1,
        "title": "Bathe and dress in green or red - evening of 13 September",
        "description": "Bathe in the evening. Wear clean traditional attire - green is most common, red is equally traditional. Apply mehndi if this is your practice. The shringar is part of the saubhagya observance.",
        "note": "Dharma - preparatory]  [Colour and shringar - Pratha"
      },
      {
        "order": 2,
        "title": "Make sand or clay idols of Shiva, Parvati, and Ganesha",
        "description": "Using clean river sand or clay, shape three idols: a Shivalinga, a figure of Parvati, and a figure of Ganesha. Place them on a banana leaf or peepal leaf on a clean surface. This is not decorative - Parvati herself made a Shivalinga from sand in the Puranic narrative.",
        "note": "Dharma - core act]  [Shiva Purana"
      },
      {
        "order": 3,
        "title": "Take the Vrat Sankalp",
        "description": "Sit before the idols facing east. Take water in your right palm and resolve: to observe this vrat with sincerity through the night until morning, for the wellbeing of your marriage and family, or for the sankalp you carry.",
        "note": "Dharma"
      },
      {
        "order": 4,
        "title": "Perform abhishek and puja of the sand idol",
        "description": "Pour water (Ganga Jal if available), then milk, over the Shivalinga. Offer belpatra, dhatura, and white flowers to Shiva. Offer sindoor, kumkum, and red flowers to Parvati. Place akshat and fruits before Ganesha. Light the diya and incense.",
        "note": "Dharma - core puja"
      },
      {
        "order": 5,
        "title": "Listen to or recite the Vrat Katha",
        "description": "The katha - Shiva narrating the Hartalika episode: Parvati's friend taking her to the forest, the night of tapasya, the sand Shivalinga, Shiva's acceptance - is recited in the evening in the presence of the idols. This is the essential narrative act. Read it aloud or have it read while you listen.",
        "note": "Dharma - mandatory]  [Shiva Purana"
      },
      {
        "order": 6,
        "title": "Stay awake through the night - jagaran",
        "description": "The night vigil is the Pratha heart of Hartalika Teej. Stay awake through the night with bhajans, Teej songs, and devotional reading. Many women observe jagaran in groups. The diya should remain lit through the night. If you doze briefly from exhaustion, this does not invalidate the vrat.",
        "note": "Pratha - strongly traditional"
      },
      {
        "order": 7,
        "title": "Morning puja and aarti - 15 September",
        "description": "At dawn on the morning of the 15th, perform a final aarti of the sand idols. Offer fresh flowers. Chant the Shanti Mantra.",
        "note": "Dharma"
      },
      {
        "order": 8,
        "title": "Immerse the idols and break the fast",
        "description": "Carry the sand/clay idols to a river, pond, or water body and immerse them. Return home. Bathe. Break the fast with water, then fruits, then a light meal. The fast is now complete.",
        "note": "Dharma - ritual completion"
      }
    ],
    "samagriItems": [
      {
        "name": "River sand or clay",
        "function": "Offered with devotion in pujan",
        "order": 1
      },
      {
        "name": "Ganga Jal / water",
        "function": "Offered with devotion in pujan",
        "order": 2
      },
      {
        "name": "Banana / peepal leaf",
        "function": "Offered with devotion in pujan",
        "order": 3
      },
      {
        "name": "Diya + ghee",
        "function": "Offered with devotion in pujan",
        "order": 4
      },
      {
        "name": "Belpatra",
        "function": "Offered with devotion in pujan",
        "order": 5
      },
      {
        "name": "Incense",
        "function": "Offered with devotion in pujan",
        "order": 6
      },
      {
        "name": "Dhatura flowers",
        "function": "Offered with devotion in pujan",
        "order": 7
      },
      {
        "name": "Green bangles",
        "function": "Offered with devotion in pujan",
        "order": 8
      },
      {
        "name": "White flowers",
        "function": "Offered with devotion in pujan",
        "order": 9
      },
      {
        "name": "Mehndi",
        "function": "Offered with devotion in pujan",
        "order": 10
      },
      {
        "name": "Sindoor + kumkum",
        "function": "Offered with devotion in pujan",
        "order": 11
      },
      {
        "name": "Red / green chunri",
        "function": "Offered with devotion in pujan",
        "order": 12
      },
      {
        "name": "Red flowers",
        "function": "Offered with devotion in pujan",
        "order": 13
      },
      {
        "name": "Fruits + sweets",
        "function": "Offered with devotion in pujan",
        "order": 14
      }
    ],
    "mantras": [
      {
        "devanagari": "\u0950 \u0928\u092e\u0903 \u0936\u093f\u0935\u093e\u092f",
        "transliteration": "Om Namah Shivaya",
        "meaning": "108 times with mala, or 11 / 21 / 51"
      }
    ],
    "dpbEntries": [
      {
        "elementName": "Myths",
        "tag": "BHRANTI",
        "confidenceScore": 4,
        "claim": "Myths",
        "correction": "",
        "sourceOfTruth": "Scriptures",
        "reviewStatus": "APPROVED"
      },
      {
        "elementName": "\"If you don't keep a nirjala fast, the Hartalika T",
        "tag": "BHRANTI",
        "confidenceScore": 4,
        "claim": "\"If you don't keep a nirjala fast, the Hartalika Teej vrat doesn't count at all.\"",
        "correction": "The Shiva Purana prescribes fasting with devotion on this day - it does not mandate the waterless form specifically. Nirjala is the dominant Pratha for Hartalika Teej and is observed by the large majority of women, but sajal and phalahar are accepted forms, especially for pregnant women, the elderly, or anyone with a health condition. A fast adapted to your capacity, kept with sincerity, is a complete vrat.",
        "sourceOfTruth": "Scriptures",
        "reviewStatus": "APPROVED"
      },
      {
        "elementName": "\"If you fall asleep during the jagaran, the entire",
        "tag": "BHRANTI",
        "confidenceScore": 4,
        "claim": "\"If you fall asleep during the jagaran, the entire vrat is wasted and must be repeated.\"",
        "correction": "No text states this. The jagaran is a strongly observed Pratha - it is central to the experience of Hartalika Teej and to the community gathering that defines it. But dozing briefly from exhaustion after hours of devotion does not reset the vrat's merit. The tradition asks for sincerity sustained through a long night, not for a physical endurance test.",
        "sourceOfTruth": "Scriptures",
        "reviewStatus": "APPROVED"
      },
      {
        "elementName": "\"Hartalika Teej and Hariyali Teej are the same fes",
        "tag": "BHRANTI",
        "confidenceScore": 4,
        "claim": "\"Hartalika Teej and Hariyali Teej are the same festival observed at different times.\"",
        "correction": "They are two distinct festivals. Hartalika Teej falls on Bhadrapada Shukla Tritiya (14 September in 2026) and takes its name from a specific Puranic episode - the friend who took Parvati into the forest. Hariyali Teej falls on Shravana Shukla Tritiya (August) and takes its name from hariyali - the greenery of the monsoon. Different month, different founding narrative, different name etymology, and a different fast-breaking condition: Hartalika breaks the next morning after 24 hours; Hariyali breaks at moonrise or the next morning depending on family tradition.",
        "sourceOfTruth": "Scriptures",
        "reviewStatus": "APPROVED"
      }
    ],
    "thumbnailUrl": "/uploads/hartalika-teej.png",
    "panchangObservance": "Hartalika Teej",
    "panchangObservanceSub": "Shukla Paksha",
    "panchangMuhurta": "Morning",
    "panchangMuhurtaSub": "Auspicious timings",
    "panchangTithi": "Shukla Paksha",
    "panchangTithiSub": "Delhi-NCR",
    "panchangNote": "Timings and observances may vary slightly based on local sunset and city location. Check drikpanchang.com for local precision.",
    "sources": [
      {
        "name": "Bhavishya Purana",
        "reference": "Uttara Parva Ch.137",
        "type": "SHASTRA"
      }
    ],
    "relatedRitualGuides": [
      "hariyali-teej",
      "kajari-teej",
      "sawan-somwar"
    ]
  },
  {
    "title": "Shravana Putrada Ekadashi: Vrat Katha and Vidhi",
    "slug": "shravana-putrada-ekadashi",
    "category": "Festive Pujans",
    "introText": "Every month the Hindu calendar holds two Ekadashi tithis \u2014 the eleventh lunar day \u2014 one in the waxing fortnight, one in the waning. Of all the fasts a Vishnu devotee can observe, Ekadashi is the most consistent and the most complete. The Bhagavata Purana, the Padma Purana, and the Bhavishya Purana each return to the same teaching: that one who keeps Ekadashi with sincerity worships Vishnu with the fullest available act of devotion.\n\nThe Ekadashi that falls in the Shukla Paksha of Shravana is known as Putrada Ekadashi \u2014 putrada meaning giver of children. It is especially observed by couples who carry a prayer for progeny, and by parents who keep the fast for their children's long life and welfare. But the vrat is not restricted to either group. Anyone who keeps it with devotion receives what the Bhavishya Purana describes as its phala: purification, grace, and the protection of Lord Vishnu.",
    "introTitle": "Introduction to the Pujan",
    "introDesc": "Every month the Hindu calendar holds two Ekadashi tithis \u2014 the eleventh lunar day \u2014 one in the waxing fortnight, one in the waning. Of all the fasts a Vishnu devotee can observe, Ekadashi is the most consistent and the most complete. The Bhagavata Purana, the Padma Purana, and the Bhavishya Purana each return to the same teaching: that one who keeps Ekadashi with sincerity worships Vishnu with the fullest available act of devotion.",
    "sankalpaBody": "\u092e\u092e \u0938\u0915\u0932-\u0936\u093e\u0928\u094d\u0924\u093f-\u092a\u0942\u0930\u094d\u0935\u0915-\u0926\u0940\u0930\u094d\u0918\u093e\u092f\u0941-\u0935\u093f\u092d\u0942\u0924\u093f-\u092c\u0932-\u0915\u0940\u0930\u094d\u0924\u093f-\u092a\u094d\u0930\u093e\u092a\u094d\u0924\u094d\u092f\u0930\u094d\u0925\u0902, \u092a\u0942\u091c\u0928\u0902 \u0915\u0930\u093f\u0937\u094d\u092f\u0947\u0964",
    "sankalpaQuote": "With a sincere heart, I resolve to perform this worship for peace, longevity, strength, and devotion.",
    "sankalpaWho": "Devotee / Married Couple",
    "sankalpaForWhat": "Saubhagya & Spiritual Peace",
    "fastOptions": [
      {
        "name": "Ekadashi Phalahar",
        "desc": "Avoiding grains, beans and rice; permitting fruits and milk.",
        "recommended": true
      },
      {
        "name": "Nirjala Ekadashi",
        "desc": "Severe fast without water, suited for advanced practitioners.",
        "recommended": false
      }
    ],
    "fastNote": "Grain avoidance is recommended to maintain physical and spiritual purity during the fast.",
    "kathaTitle": "Shravana Putrada Ekadashi Legend",
    "kathaBody": "Narrative 1 of 1\n\nEkadashi as Vishnu's day \u2014 and why Shravana Ekadashi carries special weight\n\nThe Vishnu Puranas establish Ekadashi as the tithi on which Vishnu himself is most accessible to sincere devotion. The connection is described through the demon Mura, who guarded the gates of Svarga. When Vishnu, exhausted from battle with Mura's armies, rested in a cave, a divine energy emerged from his body and slew Mura. Vishnu named that energy Ekadashi and declared that whoever fasts on this day and worships him with a clean heart shall receive what they truly need.\n\nWhen Ekadashi falls within the month of Shravana \u2014 itself the most devotionally charged month of the year, when Vishnu is believed to rest on Ananta (the infinite serpent) in the cosmic ocean \u2014 it carries the combined weight of two of the most sacred periods in the Vaishnava calendar. The Bhavishya Purana is specific: this Shravana Shukla Ekadashi is the 'Putrada' \u2014 the one that gives children \u2014 not because the vrat is limited to this desire, but because the katha attached to it specifically demonstrates Vishnu's grace in fulfilling the deepest wishes of sincere devotees.\n\nThe recitation of the Vrat Katha is the essential act that transmits the merit of this Ekadashi. The text is narrated by Lord Krishna to King Yudhishthira, as recorded in the Bhavishya Purana.\n\nThe Vrat Katha \u2014 narrated by Krishna to Yudhishthira (Bhavishya Purana)\n\nKing Yudhishthira asked: 'Lord, what is the name of the Ekadashi that falls in the Shukla Paksha of Shravana? What is its merit and who is its presiding deity?'  Lord Krishna replied:  'O King, this Ekadashi is called Putrada \u2014 the giver of children. Its presiding deity is Lord Shridhar, Vishnu as the consort of Shri Lakshmi. Now hear its katha.  In the ancient city of Mahishmati, there ruled a just and generous king named Mahijit. He was beloved by his subjects, devout in his worship, and righteous in his rule. But he had no children. As the years passed and no heir came, the king and his queen fell into grief. A kingdom without a successor, they knew, would fall into disorder after them.  The king assembled the sages and wise men of his kingdom and spoke honestly: I have performed every rite and offered every charity I know of. Yet I remain childless. Please tell me what I have not understood.  Among the assembled sages was the learned Lomesh, whose meditation was deep and whose vision stretched across lifetimes. He concentrated his mind and saw into the king's previous birth. What he saw, he told the king without hiding.  In your previous life, O King, you were a merchant. One hot afternoon during a journey, you were overcome with thirst. You found a pond and bent down to drink. At that same moment, a cow and her calf arrived at the same pond, also thirsty after a long walk in the heat. You did not wait. You drank your fill first, and then drove the cow and calf away before they could drink. That act \u2014 the thirst of a mother and child that went unquenched because of your impatience \u2014 is what follows you into this birth as childlessness.  The king listened. He felt the weight of what he had unknowingly carried.  Sage Lomesh said: The remedy is this. On the Ekadashi that falls in the Shukla Paksha of Shravana, observe a complete fast dedicated to Lord Vishnu. Spend the night in vigil and devotion. Worship Shridhar with tulsi, flowers, and a pure heart. Have the katha of this Ekadashi recited. Ask your subjects to join you and share in the observance \u2014 for a community's combined punya can reach what a single heart alone cannot.  The king and his queen observed the fast with full sincerity on Shravana Putrada Ekadashi. The people of Mahishmati fasted alongside them. They worshipped Lord Vishnu through the night, recited the katha, and performed daan to Brahmins.  By the grace of Lord Shridhar, the sin of the king's previous birth was dissolved. The queen conceived. In time, a son was born to them \u2014 virtuous, capable, and beloved by his people.  This is the merit of Shravana Putrada Ekadashi. Whoever observes it with sincerity \u2014 fasting, worshipping Vishnu, reciting this katha \u2014 shall find that Lord Shridhar turns toward them with his grace, dissolves what has accumulated in their past, and fulfils the sincere wish they carry.'  Krishna fell silent. Yudhishthira bowed.\n\nRecite the katha during the puja, ideally in the evening. Read it aloud, or have it read while you listen. The katha is complete whether heard or recited \u2014 the attentiveness is what matters.\n\nImage 2  |  Half-width pair  |  After Vrat Katha, before puja steps\n\nIMAGE 2 \u2014 Half-width pair \u2014 after Vrat Katha, before puja steps\n\nSamagri Checklist  (locked \u2014 do not edit items or tags)\n\nITEM\n\nCLASSIFICATION\n\nNOTE\n\nTulsi leaves (fresh)\n\nDHARMA \u2014 Mandatory\n\nVishnu's foremost offering; explicitly named across Puranas. No Vishnu puja is complete without tulsi.\n\nGanga Jal or clean water\n\nDHARMA \u2014 Mandatory\n\nFor panchamrit abhishek of the Vishnu idol.\n\nCow's milk\n\nDHARMA \u2014 Mandatory\n\nFor panchamrit abhishek.\n\nPanchamrit (milk, curd, ghee, honey, sugar)\n\nDHARMA \u2014 Optional\n\nFull abhishek form. Simple water and milk is sufficient.\n\nLotus flowers or seasonal flowers\n\nDHARMA \u2014 Optional\n\nLotus is Vishnu's flower; any fresh flower is accepted.\n\nAkshat (unbroken rice, turmeric-stained)\n\nDHARMA \u2014 Optional\n\nStandard puja offering.\n\nDiya and ghee\n\nDHARMA \u2014 Optional\n\nFor aarti. Keep a lamp burning through the night for jagaran.\n\nCotton wicks soaked in ghee or panchamrit (Pavitra)\n\nPRATHA \u2014 Optional / regional\n\nPavitropana tradition, especially Gujarat and West India.\n\nFruits for Parana meal (24 Aug)\n\nDHARMA \u2014 For Parana\n\nPrepare Parana food the evening before. Break fast with fruits and light food first.\n\nFood for daan (donation to Brahmin or the needy)\n\nDHARMA \u2014 Strongly recommended\n\nThe katha itself describes the king donating to Brahmins after breaking the fast. Completing the fast with daan is part of the full observance.\n\nAvoid on Ekadashi fast day:\n\nGrains, rice, wheat, lentils and pulses, regular salt (use sendha namak / rock salt instead), onion, garlic, and non-vegetarian food. Consume only phalahar (fruits, milk, curd, nuts, sabudana, vrat-specific foods).\n\nSection: The Vidhi \u2014 Step by Step\n\nEkadashi is a two-day observance. Dashami (the day before) sets the conditions; Ekadashi is the fast; Dwadashi (the day after) is when the fast is broken at the prescribed time.\n\nDashami \u2014 22 August (preparation day)\n\n1\n\nEat one sattvic meal before noon\n\nAvoid grains, rice, lentils, onion, garlic, and non-vegetarian food from the midday Dashami meal onwards. Keep the rest of Dashami light \u2014 no heavy or tamasic food after noon. Sleep early and maintain celibacy through the night.\n\nEkadashi \u2014 23 August (the fast)\n\n2\n\nRise before sunrise and bathe\n\nBathing at or before dawn on Ekadashi carries the merit of bathing in a sacred river. Wear clean clothes \u2014 white or saffron if available.\n\n3\n\nTake the Vrat Sankalp\n\nSit before the Vishnu idol. Take a spoon of water in your right palm and resolve: 'I observe Shravana Putrada Ekadashi with devotion, fasting until Dwadashi Parana, for the grace of Lord Shridhar and the welfare of my family.'\n\n4\n\nPerform Vishnu puja\n\nBathe the Vishnu idol or Shaligram with panchamrit. Offer fresh tulsi leaves \u2014 this is not optional; tulsi is Vishnu's foremost offering. Offer lotus or seasonal flowers, akshat, incense, and a lit ghee diya. Chant Om Namo Bhagavate Vasudevaya 108 times. Recite the Vishnu Sahasranama if time permits.\n\n5\n\nRecite the Vrat Katha\n\nRead or listen to the katha of King Mahijit. This is the essential narrative act of the vrat \u2014 the katha is not supplementary to the puja, it is the puja's completion. Read it aloud or have it read while you listen with full attention.\n\n6\n\nKeep the fast and observe jagaran if possible\n\nFast through the day on phalahar \u2014 fruits, milk, curd, nuts, sabudana prepared without regular salt. Avoid all grains. If physically able, stay awake through part of the night in bhajan, reading, or quiet meditation before Lord Vishnu.\n\nDwadashi \u2014 24 August (Parana day)\n\n7\n\nBreak the fast during the Parana window\n\nOn 24 August, break the fast between 1:41 PM and 4:16 PM (Delhi-NCR, 2026). This Parana window falls within Dwadashi tithi, as required. Do not break the fast during Hari Vasara (the first quarter of Dwadashi, which ends before the Parana window begins). Begin with a sip of water or a small fruit. Offer food to a Brahmin, a cow, or a family in need \u2014 the katha shows that daan completes the observance.\n\nAbout Parana timing:\n\nThe Parana must fall within the Dwadashi tithi (which ends at 4:19 AM on 25 August \u2014 so the entire 24 August window is safe). The Hari Vasara period at the very start of Dwadashi must be avoided; it ends well before the Parana window opens at 1:41 PM. Confirm exact timings from Drik Panchang for your city \u2014 muhurat shifts by location.\n\nSection: Myths & Facts\n\n\u2715  \"Shravana Putrada Ekadashi is only for couples who want to have a son. If you already have children, there is no purpose in observing it.\"\n\n\u2713  No text restricts this vrat to childless couples or to the desire for a son. The Bhavishya Purana describes the katha to illustrate how sincere devotion removes karmic obstacles \u2014 in this story, childlessness. But the same katha also names moksha, sin-cleansing, and the general welfare of family as the vrat's phala. Any devotee who keeps it with sincerity receives what they sincerely need.\n\n\u2715  \"If you miss the Parana window on Dwadashi, the entire fast is wasted and you have to start again.\"\n\n\u2713  The Parana timing matters and should be followed sincerely \u2014 this is not a technicality. But the tradition's own framing of Hari Vasara and Dwadashi timing is a rule of propriety and spiritual precision, not a mechanism for punishment. Texts do not say that an honest error in timing 'resets' the fast's accumulated merit. If you miss the window through genuine circumstance, complete the fast with daan and pray with an honest heart. The sin being dissolved is not re-acquired.\n\nClosing Prose\n\nKing Mahijit's sin was not a terrible crime. He was thirsty, he was tired, and in that moment of need he did not notice or did not wait for the cow and calf who were also thirsty. A small act of inattention, carried into another life as an absence he could not explain and a prayer that seemed unanswered no matter what he offered.\n\nThis is what Ekadashi addresses \u2014 not the dramatic sins, but the accumulated weight of ordinary moments where we were impatient, where we did not see, where we took without pausing. The fast is a form of pausing. Vishnu, who sees all of it without judgment, receives the fast and the katha and the tulsi and the sincere heart, and extends what the Bhavishya Purana calls his grace \u2014 dissolving what has piled up, restoring what has been withheld, and turning toward the devotee with whatever they actually need.\n\nIntelligence Layer - Why Are Grains Avoided on Ekadashi?\n\nINTELLIGENCE LAYER  |  Shared across all Ekadashi articles\n\nWhy are grains avoided on Ekadashi?\n\nEvery fortnight, on the eleventh day of the lunar cycle, devotees observe Ekadashi -- a day dedicated to Lord Vishnu. It is a day of restraint, prayer, and turning inward.\n\nThe Puranas tell us that Ekadashi has the power to cleanse accumulated karma and bring one closer to the Divine. But as more people began observing this sacred vrata, a question arose: if Ekadashi destroys sin, where does sin go?\n\nThe Puranic tradition answers this through a symbolic story.\n\nIt says that Papa Purusha -- the personification of all sinful actions -- approached Lord Vishnu in distress. 'Lord,' he said, 'if every devotee observes Ekadashi and is purified, I shall have no place to remain. What is to become of me?'\n\nMoved by his plea, Vishnu replied: 'On the day of Ekadashi, you shall reside in anna -- the staple grains. Those who seek My grace on this sacred day will abstain from them. Those who choose not to observe the vrata may eat as they wish, but My devotees shall leave those grains untouched.'\n\nFrom that day onward, the tradition says, grains became the temporary abode of Papa on Ekadashi. This is why the shastras advise devotees to avoid anna -- rice, wheat, barley and other grains -- on Ekadashi. If one cannot undertake a complete fast, the prescribed alternative is fruits, milk, roots, nuts, and other non-grain foods.\n\nThe idea is not that grains are impure. On every other day, they are revered as Anna Devata, a sacred gift that nourishes life. But on Ekadashi, setting them aside becomes an act of devotion -- a conscious reminder that, for one day, the soul is nourished before the body.\n\nTextual basis: The Brihan-Naradiya Purana states that all sins reside in grains on Hari-vasara (Ekadashi). The Papa Purusha story is a Puranic elaboration that transmits this injunction through narrative. Both the injunction and the narrative are preserved here without conflating them.\n\nRelated Pujans\n\nSawan Somwar Vrat\n\nSame Shravan month  |  Deity Cluster \u2014 both Vishnu and Shiva sacred in Shravan\n\nKamika Ekadashi\n\nEarlier in Shravan month (9 August)  |  Vrat Type Cluster \u2014 same Ekadashi structure\n\nAja Ekadashi\n\n7 September 2026  |  Vrat Type Cluster \u2014 next Ekadashi in sequence\n\nPausha Putrada Ekadashi\n\nDecember-January  |  Vrat Type Cluster \u2014 twin vrat; more prominent in North India\n\nWhatsApp Subscription Nudge\n\n\ud83d\udcac  Get reminded before every festival   WhatsApp reminders \u2014 \u20b9499/yr  \u203a\n\nSticky Bottom Bar\n\nRITUAL CARD 4 OF 7\n\n\u0924\u092a\u094d\n\nShravana Putrada Ekadashi\n\n23 August 2026  |  Sunday  |  Shravana Shukla Ekadashi\n\nDATE\n\nTITHI\n\nFAST\n\nPARANA\n\n23 Aug\n\nSunday\n\nShravana Shukla Ekadashi\n\nTithi begins 2:01 AM\n\nAll day\n\n23 Aug\n\n1:41 PM - 4:16 PM\n\n24 Aug (Dwadashi)\n\nSAMAGRI CHECKLIST\n\n\u2610  Tulsi leaves (fresh) \u2014 mandatory\n\n\u2610  Ganga Jal or clean water\n\n\u2610  Cow's milk\n\n\u2610  Panchamrit\n\n\u2610  Lotus or seasonal flowers\n\n\u2610  Akshat (turmeric rice)\n\n\u2610  Diya + ghee\n\n\u2610  Fruits for Parana meal (24 Aug)\n\n\u2610  Food for daan (donation)\n\nVIDHI \u2014 STEP BY STEP\n\nDashami \u2014 22 Aug (prep)\n\n1\n\nEat one sattvic meal before noon. Avoid grains after midday.\n\nEkadashi \u2014 23 Aug (the fast)\n\n2\n\nRise before sunrise and bathe\n\n3\n\nTake the Vrat Sankalp before the Vishnu idol\n\n4\n\nVishnu puja \u2014 panchamrit abhishek, tulsi, flowers, diya. Chant Om Namo Bhagavate Vasudevaya 108x\n\n5\n\nRecite the Vrat Katha (King Mahijit, Bhavishya Purana)\n\n6\n\nFast on phalahar. Jagaran if possible.\n\nDwadashi \u2014 24 Aug (Parana)\n\n7\n\nBreak fast between 1:41 PM and 4:16 PM. Avoid Hari Vasara. Begin with water/fruit. Complete with daan.\n\nMANTRA\n\n\u0950 \u0928\u092e\u094b \u092d\u0917\u0935\u0924\u0947 \u0935\u093e\u0938\u0941\u0926\u0947\u0935\u093e\u092f\n\nOm Namo Bhagavate Vasudevaya\n\n108 times, or 12 / 24 / 48\n\nFASTING\n\nAvoid: all grains, rice, wheat, lentils, regular salt.\n\nUse: fruits, milk, sabudana, sendha namak, nuts.\n\nPhalahar is the standard form. Nirjala only if suited.\n\n\u0924\u092a\u094d\n\nthetapaco.com\n\nSource: Drik Panchang, Delhi-NCR  |  2026\n\nThe Tapa Co. 2026  |  Internal Document  |  Stage 1 - Editorial Draft  |  Not for public distribution\n\nThe recitation of the Vrat Katha is the essential act that transmits the merit of this Ekadashi. The text is narrated by Lord Krishna to King Yudhishthira, as recorded in the Bhavishya Purana.\n\nThe Vrat Katha \u2014 narrated by Krishna to Yudhishthira (Bhavishya Purana)\n\nKing Yudhishthira asked: 'Lord, what is the name of the Ekadashi that falls in the Shukla Paksha of Shravana? What is its merit and who is its presiding deity?'  Lord Krishna replied:  'O King, this Ekadashi is called Putrada \u2014 the giver of children. Its presiding deity is Lord Shridhar, Vishnu as the consort of Shri Lakshmi. Now hear its katha.  In the ancient city of Mahishmati, there ruled a just and generous king named Mahijit. He was beloved by his subjects, devout in his worship, and righteous in his rule. But he had no children. As the years passed and no heir came, the king and his queen fell into grief. A kingdom without a successor, they knew, would fall into disorder after them.  The king assembled the sages and wise men of his kingdom and spoke honestly: I have performed every rite and offered every charity I know of. Yet I remain childless. Please tell me what I have not understood.  Among the assembled sages was the learned Lomesh, whose meditation was deep and whose vision stretched across lifetimes. He concentrated his mind and saw into the king's previous birth. What he saw, he told the king without hiding.  In your previous life, O King, you were a merchant. One hot afternoon during a journey, you were overcome with thirst. You found a pond and bent down to drink. At that same moment, a cow and her calf arrived at the same pond, also thirsty after a long walk in the heat. You did not wait. You drank your fill first, and then drove the cow and calf away before they could drink. That act \u2014 the thirst of a mother and child that went unquenched because of your impatience \u2014 is what follows you into this birth as childlessness.  The king listened. He felt the weight of what he had unknowingly carried.  Sage Lomesh said: The remedy is this. On the Ekadashi that falls in the Shukla Paksha of Shravana, observe a complete fast dedicated to Lord Vishnu. Spend the night in vigil and devotion. Worship Shridhar with tulsi, flowers, and a pure heart. Have the katha of this Ekadashi recited. Ask your subjects to join you and share in the observance \u2014 for a community's combined punya can reach what a single heart alone cannot.  The king and his queen observed the fast with full sincerity on Shravana Putrada Ekadashi. The people of Mahishmati fasted alongside them. They worshipped Lord Vishnu through the night, recited the katha, and performed daan to Brahmins.  By the grace of Lord Shridhar, the sin of the king's previous birth was dissolved. The queen conceived. In time, a son was born to them \u2014 virtuous, capable, and beloved by his people.  This is the merit of Shravana Putrada Ekadashi. Whoever observes it with sincerity \u2014 fasting, worshipping Vishnu, reciting this katha \u2014 shall find that Lord Shridhar turns toward them with his grace, dissolves what has accumulated in their past, and fulfils the sincere wish they carry.'  Krishna fell silent. Yudhishthira bowed.\n\nRecite the katha during the puja, ideally in the evening. Read it aloud, or have it read while you listen. The katha is complete whether heard or recited \u2014 the attentiveness is what matters.",
    "steps": [
      {
        "order": 1,
        "title": "Eat one sattvic meal before noon",
        "description": "Avoid grains, rice, lentils, onion, garlic, and non-vegetarian food from the midday Dashami meal onwards. Keep the rest of Dashami light \u2014 no heavy or tamasic food after noon. Sleep early and maintain celibacy through the night.",
        "note": "Dharma \u2014 mandatory prep"
      },
      {
        "order": 2,
        "title": "Rise before sunrise and bathe",
        "description": "Bathing at or before dawn on Ekadashi carries the merit of bathing in a sacred river. Wear clean clothes \u2014 white or saffron if available.",
        "note": "Dharma"
      },
      {
        "order": 3,
        "title": "Take the Vrat Sankalp",
        "description": "Sit before the Vishnu idol. Take a spoon of water in your right palm and resolve: 'I observe Shravana Putrada Ekadashi with devotion, fasting until Dwadashi Parana, for the grace of Lord Shridhar and the welfare of my family.'",
        "note": "Dharma"
      },
      {
        "order": 4,
        "title": "Perform Vishnu puja",
        "description": "Bathe the Vishnu idol or Shaligram with panchamrit. Offer fresh tulsi leaves \u2014 this is not optional; tulsi is Vishnu's foremost offering. Offer lotus or seasonal flowers, akshat, incense, and a lit ghee diya. Chant Om Namo Bhagavate Vasudevaya 108 times. Recite the Vishnu Sahasranama if time permits.",
        "note": "Dharma \u2014 core act]  [Bhagavata Purana"
      },
      {
        "order": 5,
        "title": "Recite the Vrat Katha",
        "description": "Read or listen to the katha of King Mahijit. This is the essential narrative act of the vrat \u2014 the katha is not supplementary to the puja, it is the puja's completion. Read it aloud or have it read while you listen with full attention.",
        "note": "Dharma \u2014 mandatory]  [Bhavishya Purana"
      },
      {
        "order": 6,
        "title": "Keep the fast and observe jagaran if possible",
        "description": "Fast through the day on phalahar \u2014 fruits, milk, curd, nuts, sabudana prepared without regular salt. Avoid all grains. If physically able, stay awake through part of the night in bhajan, reading, or quiet meditation before Lord Vishnu.",
        "note": "Dharma \u2014 fasting]  [Jagaran \u2014 Pratha"
      },
      {
        "order": 7,
        "title": "Break the fast during the Parana window",
        "description": "On 24 August, break the fast between 1:41 PM and 4:16 PM (Delhi-NCR, 2026). This Parana window falls within Dwadashi tithi, as required. Do not break the fast during Hari Vasara (the first quarter of Dwadashi, which ends before the Parana window begins). Begin with a sip of water or a small fruit. Offer food to a Brahmin, a cow, or a family in need \u2014 the katha shows that daan completes the observance.",
        "note": "Dharma \u2014 ritual-critical"
      }
    ],
    "samagriItems": [
      {
        "name": "Tulsi leaves",
        "function": "Offered with devotion in pujan",
        "order": 1
      },
      {
        "name": "Ganga Jal or clean water",
        "function": "Offered with devotion in pujan",
        "order": 2
      },
      {
        "name": "Cow's milk",
        "function": "Offered with devotion in pujan",
        "order": 3
      },
      {
        "name": "Panchamrit",
        "function": "Offered with devotion in pujan",
        "order": 4
      },
      {
        "name": "Lotus or seasonal flowers",
        "function": "Offered with devotion in pujan",
        "order": 5
      },
      {
        "name": "Akshat",
        "function": "Offered with devotion in pujan",
        "order": 6
      },
      {
        "name": "Diya + ghee",
        "function": "Offered with devotion in pujan",
        "order": 7
      },
      {
        "name": "Fruits for Parana meal",
        "function": "Offered with devotion in pujan",
        "order": 8
      },
      {
        "name": "Food for daan",
        "function": "Offered with devotion in pujan",
        "order": 9
      }
    ],
    "mantras": [
      {
        "devanagari": "\u0950 \u0928\u092e\u094b \u092d\u0917\u0935\u0924\u0947 \u0935\u093e\u0938\u0941\u0926\u0947\u0935\u093e\u092f",
        "transliteration": "Om Namo Bhagavate Vasudevaya",
        "meaning": "108 times, or 12 / 24 / 48"
      }
    ],
    "dpbEntries": [
      {
        "elementName": "Myths",
        "tag": "BHRANTI",
        "confidenceScore": 4,
        "claim": "Myths",
        "correction": "",
        "sourceOfTruth": "Scriptures",
        "reviewStatus": "APPROVED"
      },
      {
        "elementName": "\"Shravana Putrada Ekadashi is only for couples who",
        "tag": "BHRANTI",
        "confidenceScore": 4,
        "claim": "\"Shravana Putrada Ekadashi is only for couples who want to have a son. If you already have children, there is no purpose in observing it.\"",
        "correction": "No text restricts this vrat to childless couples or to the desire for a son. The Bhavishya Purana describes the katha to illustrate how sincere devotion removes karmic obstacles \u2014 in this story, childlessness. But the same katha also names moksha, sin-cleansing, and the general welfare of family as the vrat's phala. Any devotee who keeps it with sincerity receives what they sincerely need.",
        "sourceOfTruth": "Scriptures",
        "reviewStatus": "APPROVED"
      },
      {
        "elementName": "\"If you miss the Parana window on Dwadashi, the en",
        "tag": "BHRANTI",
        "confidenceScore": 4,
        "claim": "\"If you miss the Parana window on Dwadashi, the entire fast is wasted and you have to start again.\"",
        "correction": "The Parana timing matters and should be followed sincerely \u2014 this is not a technicality. But the tradition's own framing of Hari Vasara and Dwadashi timing is a rule of propriety and spiritual precision, not a mechanism for punishment. Texts do not say that an honest error in timing 'resets' the fast's accumulated merit. If you miss the window through genuine circumstance, complete the fast with daan and pray with an honest heart. The sin being dissolved is not re-acquired.",
        "sourceOfTruth": "Scriptures",
        "reviewStatus": "APPROVED"
      }
    ],
    "thumbnailUrl": "/uploads/shravana-putrada-ekadashi.png",
    "panchangObservance": "Shravana Putrada Ekadashi",
    "panchangObservanceSub": "Shukla Paksha",
    "panchangMuhurta": "Morning",
    "panchangMuhurtaSub": "Auspicious timings",
    "panchangTithi": "Shukla Paksha",
    "panchangTithiSub": "Delhi-NCR",
    "panchangNote": "Timings and observances may vary slightly based on local sunset and city location. Check drikpanchang.com for local precision.",
    "sources": [
      {
        "name": "Bhavishya Purana",
        "reference": "Uttara Parva Ch.137",
        "type": "SHASTRA"
      }
    ],
    "relatedRitualGuides": [
      "kamika-ekadashi",
      "sawan-somwar",
      "nag-panchami"
    ]
  },
  {
    "title": "Nag Panchami: What the tradition actually asks for",
    "slug": "nag-panchami",
    "category": "Festive Pujans",
    "introText": "Nag Panchami falls on the fifth day (Panchami) of Shukla Paksha in the month of Shravana \u2014 two days after Hariyali Teej. What most people encounter about this festival online is a mix: fear about what happens if you don't observe it, claims about snakes drinking milk, commercial packages promising to fix astrological doshas. Almost none of this is what the tradition is actually asking for.",
    "introTitle": "Introduction to the Pujan",
    "introDesc": "Nag Panchami falls on the fifth day (Panchami) of Shukla Paksha in the month of Shravana \u2014 two days after Hariyali Teej. What most people encounter about this festival online is a mix: fear about what happens if you don't observe it, claims about snakes drinking milk, commercial packages promising to fix astrological doshas. Almost none of this is what the tradition is actually asking for.",
    "sankalpaBody": "\u092e\u092e \u0938\u0915\u0932-\u0936\u093e\u0928\u094d\u0924\u093f-\u092a\u0942\u0930\u094d\u0935\u0915-\u0926\u0940\u0930\u094d\u0918\u093e\u092f\u0941-\u0935\u093f\u092d\u0942\u0924\u093f-\u092c\u0932-\u0915\u0940\u0930\u094d\u0924\u093f-\u092a\u094d\u0930\u093e\u092a\u094d\u0924\u094d\u092f\u0930\u094d\u0925\u0902, \u092a\u0942\u091c\u0928\u0902 \u0915\u0930\u093f\u0937\u094d\u092f\u0947\u0964",
    "sankalpaQuote": "With a sincere heart, I resolve to perform this worship for peace, longevity, strength, and devotion.",
    "sankalpaWho": "Devotee / Married Couple",
    "sankalpaForWhat": "Saubhagya & Spiritual Peace",
    "fastOptions": [
      {
        "name": "Sattvic Vrat",
        "desc": "Consuming simple vegetarian food once a day.",
        "recommended": true
      }
    ],
    "fastNote": "Grain avoidance is recommended to maintain physical and spiritual purity during the fast.",
    "kathaTitle": "Nag Panchami Legend",
    "kathaBody": "Narrative 1 of 2\n\nThe Sarpa Satra \u2014 Mahabharata, Adi Parva\n\nKing Janamejaya, son of Parikshit, organized the Sarpa Satra \u2014 a massive yajna aimed at destroying the entire Naga race in revenge for his father's death at the fangs of Takshaka. The sacrifice was working; serpents by the thousands were drawn into the fire. It was the young Brahmin sage Astika who intervened, using his learning and calm persuasion to convince Janamejaya to stop the yajna. He did. The day the Sarpa Satra was halted was Shravana Shukla Panchami. The festival that emerged from this moment is not about fear of snakes \u2014 it commemorates the act that saved them. Restraint over revenge. Coexistence over destruction.\n\nNarrative 2 of 2\n\nThe Second Narrative: Krishna and Kaliya \u2014 Bhagavata Purana\n\nThe Bhagavata Purana carries a second associated story: young Krishna's confrontation with Kaliya, the multi-hooded serpent who had poisoned the Yamuna River, making it dangerous for the people of Gokul. Krishna did not kill Kaliya. He danced upon his heads until the serpent was subdued, then showed him mercy \u2014 asking him to leave the river and return to his home in the ocean. The villagers were safe; the serpent was alive. The narrative is not one of punishment or fear. It is of power exercised with mercy, and of a river restored.\n\nImage 2  \u00b7  Full bleed  \u00b7  After scripture section\n\nIMAGE 2 \u2014 Full bleed \u2014 after scriptural narratives, before regional section\n\n\u26a0 AI-generation not permitted for this slot. Any iconographic error (wrong head count, wrong posture) is immediately visible to practitioners and destroys article credibility.\n\nSection: How It's Observed \u2014 By Region\n\n\ud83c\udfd4\ufe0f North India\n\n\ud83c\udf3e Maharashtra\n\n\ud83c\udf0a Bengal\n\n\ud83c\udf3f Karnataka \u00b7 Kerala\n\n\ud83e\ude94 Gujarat\n\nClay or metal Naga idols at home or temple. Milk, turmeric, flowers offered to the idol. Rural areas visit anthill mounds.\n\nHome and temple worship. Clay Naga images prepared fresh. Nagpur observes with particular fervour.\n\nManasa Puja \u2014 multi-day worship of Manasa Devi. Rooted in Manasa Mangal Kavya, a regional Bengali tradition.\n\nSarpakkavu \u2014 sacred serpent groves. Women draw Naga images on the floor and offer prayers for family wellbeing.\n\nObserved 15 days later on Krishna Paksha Panchami per the Amanta calendar. Known as Nag Pancham.\n\nPratha\n\nPratha\n\nPratha \u00b7 regional text\n\nPratha\n\nPratha \u00b7 different date\n\nIf your family's tradition for this day looks different from a neighbour's or from what you see online \u2014 that difference is probably not error. It is regional Pratha. Both can be valid.\n\nImage 3  \u00b7  Half-width pair  \u00b7  After regional section\n\nIMAGE 3 \u2014 Half-width pair \u2014 after regional section, before puja steps\n\nSection: The Puja\n\n1\n\nBathe early and wear clean clothes\n\n2\n\nSet up a Naga idol or draw a serpent image\n\nClay, metal, stone, or a drawn image on paper or the wall \u2014 all valid forms.\n\n3\n\nOffer flowers, turmeric, rice (akshata), incense\n\n4\n\nOffer milk, honey or sugar \u2014 to the idol, not a live snake\n\nThese are symbolic offerings of purity directed at the deity. Not at a physical animal.\n\n5\n\nChant a Naga stotra or the Ashta Naga mantra\n\nThe Bhavishyottara Purana carries the invocation of the Ashta Nagas \u2014 Vasuki, Takshaka, Kaliya, Manibhadra, Airavata, Dhritarashtra, Karkotaka, Dhananjaya \u2014 as guardians of life and protection.\n\n6\n\nPerform aarti and conclude with a moment of stillness\n\nFasting \u2014 two accepted forms\n\nOne meal on Chaturthi: eat once the day before; fast through Panchami.     |     No fast: fasting is Pratha \u2014 the puja is the core observance.\n\nNo text mandates a specific fast form. The puja matters; the fast is personal practice.\n\nCallout Card \u2014 A note on live snake worship\n\n\u26a0\ufe0f  A note on live snake worship\n\nIn some rural areas, snake charmers bring cobras to temples on Nag Panchami, and devotees offer milk directly to the live animal. The tradition is declining for important reasons: snakes do not biologically drink milk, and forcing it causes harm. Animal welfare organisations have for years documented injury to the snakes involved in these practices.  The scriptural tradition asks for reverence toward Nagas as divine beings \u2014 not for interaction with wild snakes. Worshipping a clay idol, a stone image, or a Shivalinga (where the serpent Vasuki is always present around Shiva) fulfils the intent of the day completely and with harm to no living creature.\n\nSection: Myths & Facts\n\n\u2715  \"If you don't worship on Nag Panchami, a snake will bite someone in your family.\"\n\n\u2713  No Puranic or Dharmashastra text makes this claim. The festival commemorates compassion and coexistence with serpents \u2014 not appeasement under threat. Fear-based messaging inverts the entire spirit of the day.\n\n\u2715  \"Snakes drink the milk you offer them, and this pleases the serpent god.\"\n\n\u2713  Snakes are lactose-intolerant reptiles \u2014 they do not drink milk. Milk offered to a live snake is not absorbed and can cause illness. Milk in this tradition is offered to a Naga idol as a symbol of purity \u2014 not to a physical animal. The offering is devotional, not transactional.\n\n\u2715  \"Worshipping on this day cures Kaal Sarp Dosha in your horoscope.\"\n\n\u2713  No Puranic source establishes this. Nag Panchami predates the modern astrological framing of Kaal Sarp Dosha by centuries. The association is a commercial-era addition, not a traditional or textual one. The festival can be observed for its own meaning without needing a Dosha to fix.\n\n\u2715  \"You must worship a live cobra \u2014 an idol doesn't have the same power.\"\n\n\u2713  The tradition's core is reverence directed toward Naga deities as divine beings. A clay idol, a stone image, a silver Naga, or the serpent imagery on any Shivalinga all fulfil this intent. No text restricts the merit of worship to contact with live animals.\n\nClosing Prose\n\nNag Panchami is perhaps the Hindu calendar's most direct expression of a principle the tradition holds consistently: that the natural world deserves reverence, not exploitation. Serpents eat rodents that destroy crops. They are part of the ecological web. Cultures that understood this built a day in the calendar to honour that relationship, and wrapped it in mythology that asked for compassion even toward creatures that frightened them.\n\nThat is the tradition. Not fear. Not dosha. Not a transactional exchange with an animal. A day of acknowledging that the world contains powers and creatures beyond human control, and that the correct response to that is reverence \u2014 not anxiety.\n\nRelated Pujans\n\nSawan Somwar Vrat\n\nSame day in 2026 \u2014 Shiva wears serpent Vasuki  \u00b7  Deity Cluster\n\nLIVE\n\nHariyali Teej\n\nFalls two days before, same Shravan window  \u00b7  Season Cluster\n\nLIVE\n\nKajari Teej\n\nSame Shravan Pratha window  \u00b7  Season Cluster\n\nLIVE\n\nWhatsApp Subscription Nudge\n\n\ud83d\udcac  Get reminded before every festival   WhatsApp reminders \u2014 \u20b999/yr  \u203a\n\nSticky Bottom Bar\n\nRITUAL CARD 1 OF 7\n\n\u0924\u092a\u094d\n\nNag Panchami\n\n17 August 2026  |  Monday  |  Shravana Shukla Panchami\n\nDATE\n\nTITHI\n\nPUJA MUHURAT\n\n17 Aug\n\nMonday\n\nShravana Shukla Panchami\n\nEnds 5:00 PM\n\n6:04 AM\n\nto 8:39 AM\n\nVIDHI \u2014 STEP BY STEP\n\n1\n\nBathe early and wear clean clothes\n\n2\n\nSet up a Naga idol or draw a serpent image\n\n3\n\nOffer flowers, turmeric, rice (akshata), incense\n\n4\n\nOffer milk, honey, or sugar \u2014 to the idol, not a live snake\n\n5\n\nChant a Naga stotra or the Ashta Naga mantra\n\n6\n\nPerform aarti and conclude with a moment of stillness\n\nFASTING\n\nFasting is Pratha \u2014 the puja is the core observance.\n\nOne meal on Chaturthi (day before) OR no fast \u2014 both accepted.\n\n\u0924\u092a\u094d\n\nthetapaco.com\n\nSource: Drik Panchang, Delhi-NCR  |  2026",
    "steps": [
      {
        "order": 1,
        "title": "Bathe early and wear clean clothes",
        "description": "Rise early, bathe, and wear fresh clean clothes to initiate the day in a state of purity.",
        "note": ""
      },
      {
        "order": 2,
        "title": "Set up a Naga idol or draw a serpent image",
        "description": "Place a metal, clay, or stone Naga idol on a chowki. Alternatively, draw a serpent image on paper or a wall.",
        "note": "Form is traditional custom (Pratha)"
      },
      {
        "order": 3,
        "title": "Offer flowers, turmeric, rice, and incense",
        "description": "Worship the Naga image by offering fresh flowers, turmeric powder, akshata (rice), and lighting incense.",
        "note": ""
      },
      {
        "order": 4,
        "title": "Offer milk, honey, or sugar",
        "description": "Offer symbolic sweets or milk to the idol. Do not offer milk to live snakes as they are lactose intolerant.",
        "note": "Welfare redirect: offer to idol, not live animal"
      },
      {
        "order": 5,
        "title": "Chant the Naga stotra or Ashta Naga mantra",
        "description": "Recite the canonical names of the eight major Nagas (Vasuki, Takshaka, etc.) for protection and peace.",
        "note": "Sourced from Bhavishyottara Purana"
      },
      {
        "order": 6,
        "title": "Perform aarti and sit in stillness",
        "description": "Wave the diya clockwise in front of the altar, perform aarti, and conclude with a moment of silent reflection.",
        "note": ""
      }
    ],
    "samagriItems": [
      {
        "name": "Ganga Jal",
        "function": "Purification",
        "order": 1
      },
      {
        "name": "Kumkum & Haldi",
        "function": "Tilak & Shringar",
        "order": 2
      },
      {
        "name": "Flowers",
        "function": "Offerings",
        "order": 3
      },
      {
        "name": "Diya & Ghee",
        "function": "Aarti",
        "order": 4
      }
    ],
    "mantras": [
      {
        "devanagari": "\u0950 \u0928\u092e\u0903 \u0936\u093f\u0935\u093e\u092f",
        "transliteration": "Om Namah Shivaya",
        "meaning": "I bow to the Divine."
      }
    ],
    "dpbEntries": [
      {
        "elementName": "Myths",
        "tag": "BHRANTI",
        "confidenceScore": 4,
        "claim": "Myths",
        "correction": "",
        "sourceOfTruth": "Scriptures",
        "reviewStatus": "APPROVED"
      },
      {
        "elementName": "\"If you don't worship on Nag Panchami, a snake wil",
        "tag": "BHRANTI",
        "confidenceScore": 4,
        "claim": "\"If you don't worship on Nag Panchami, a snake will bite someone in your family.\"",
        "correction": "No Puranic or Dharmashastra text makes this claim. The festival commemorates compassion and coexistence with serpents \u2014 not appeasement under threat. Fear-based messaging inverts the entire spirit of the day.",
        "sourceOfTruth": "Scriptures",
        "reviewStatus": "APPROVED"
      },
      {
        "elementName": "\"Snakes drink the milk you offer them, and this pl",
        "tag": "BHRANTI",
        "confidenceScore": 4,
        "claim": "\"Snakes drink the milk you offer them, and this pleases the serpent god.\"",
        "correction": "Snakes are lactose-intolerant reptiles \u2014 they do not drink milk. Milk offered to a live snake is not absorbed and can cause illness. Milk in this tradition is offered to a Naga idol as a symbol of purity \u2014 not to a physical animal. The offering is devotional, not transactional.",
        "sourceOfTruth": "Scriptures",
        "reviewStatus": "APPROVED"
      },
      {
        "elementName": "\"Worshipping on this day cures Kaal Sarp Dosha in ",
        "tag": "BHRANTI",
        "confidenceScore": 4,
        "claim": "\"Worshipping on this day cures Kaal Sarp Dosha in your horoscope.\"",
        "correction": "No Puranic source establishes this. Nag Panchami predates the modern astrological framing of Kaal Sarp Dosha by centuries. The association is a commercial-era addition, not a traditional or textual one. The festival can be observed for its own meaning without needing a Dosha to fix.",
        "sourceOfTruth": "Scriptures",
        "reviewStatus": "APPROVED"
      },
      {
        "elementName": "\"You must worship a live cobra \u2014 an idol doesn't h",
        "tag": "BHRANTI",
        "confidenceScore": 4,
        "claim": "\"You must worship a live cobra \u2014 an idol doesn't have the same power.\"",
        "correction": "The tradition's core is reverence directed toward Naga deities as divine beings. A clay idol, a stone image, a silver Naga, or the serpent imagery on any Shivalinga all fulfil this intent. No text restricts the merit of worship to contact with live animals.",
        "sourceOfTruth": "Scriptures",
        "reviewStatus": "APPROVED"
      }
    ],
    "thumbnailUrl": "/uploads/nag-panchami.png",
    "panchangObservance": "Nag Panchami",
    "panchangObservanceSub": "Shukla Paksha",
    "panchangMuhurta": "Morning",
    "panchangMuhurtaSub": "Auspicious timings",
    "panchangTithi": "Shukla Paksha",
    "panchangTithiSub": "Delhi-NCR",
    "panchangNote": "Timings and observances may vary slightly based on local sunset and city location. Check drikpanchang.com for local precision.",
    "sources": [
      {
        "name": "Bhavishya Purana",
        "reference": "Uttara Parva Ch.137",
        "type": "SHASTRA"
      }
    ],
    "relatedRitualGuides": [
      "sawan-somwar",
      "hariyali-teej",
      "kajari-teej"
    ]
  },
  {
    "title": "Sawan Somwar Vrat: A weekly vow of devotion to Lord Shiva",
    "slug": "sawan-somwar",
    "category": "Festive Pujans",
    "introText": "Sawan Somwar Vrat is the Monday fast of the month of Shravan \u2014 and according to the Shiva Purana and multiple other named texts, it is among the most meritorious vrats a devotee can observe in a year. The month of Shravan belongs to Shiva in a way no other month does. The fasts that fall within it \u2014 one Monday at a time \u2014 carry the weight of that relationship.\n\nWhat circulates about Sawan Somwar online is a mix of genuine scriptural grounding and popular embellishment: conflicting fasting rules, fear about what happens if you miss a Monday, and confusion about which dates apply in which part of India. This guide cuts through all of it.",
    "introTitle": "Introduction to the Pujan",
    "introDesc": "Sawan Somwar Vrat is the Monday fast of the month of Shravan \u2014 and according to the Shiva Purana and multiple other named texts, it is among the most meritorious vrats a devotee can observe in a year. The month of Shravan belongs to Shiva in a way no other month does. The fasts that fall within it \u2014 one Monday at a time \u2014 carry the weight of that relationship.",
    "sankalpaBody": "\u092e\u092e \u0938\u0915\u0932-\u0936\u093e\u0928\u094d\u0924\u093f-\u092a\u0942\u0930\u094d\u0935\u0915-\u0926\u0940\u0930\u094d\u0918\u093e\u092f\u0941-\u0935\u093f\u092d\u0942\u0924\u093f-\u092c\u0932-\u0915\u0940\u0930\u094d\u0924\u093f-\u092a\u094d\u0930\u093e\u092a\u094d\u0924\u094d\u092f\u0930\u094d\u0925\u0902, \u092a\u0942\u091c\u0928\u0902 \u0915\u0930\u093f\u0937\u094d\u092f\u0947\u0964",
    "sankalpaQuote": "With a sincere heart, I resolve to perform this worship for peace, longevity, strength, and devotion.",
    "sankalpaWho": "Devotee / Married Couple",
    "sankalpaForWhat": "Saubhagya & Spiritual Peace",
    "fastOptions": [
      {
        "name": "Sattvic Vrat",
        "desc": "Consuming simple vegetarian food once a day.",
        "recommended": true
      }
    ],
    "fastNote": "Grain avoidance is recommended to maintain physical and spiritual purity during the fast.",
    "kathaTitle": "Sawan Somwar Legend",
    "kathaBody": "",
    "steps": [
      {
        "order": 1,
        "title": "Bathe early and wear clean clothes",
        "description": "Prepare yourself physically and mentally for the Monday worship by bathing and wearing clean attire.",
        "note": "White or saffron clothing is custom (Pratha)"
      },
      {
        "order": 2,
        "title": "Take the Vrat Sankalp",
        "description": "Hold a small amount of water in your right hand, sit facing east, and state your intent to observe the vrat.",
        "note": ""
      },
      {
        "order": 3,
        "title": "Perform abhishek of the Shivalinga",
        "description": "Pour Gangajal, cow's milk, or panchamrit over the Shivalinga. Apply chandan paste.",
        "note": ""
      },
      {
        "order": 4,
        "title": "Offer bilva leaves, dhatura, and flowers",
        "description": "Offer Shiva's favourite bilva leaves (tri-foliate), dhatura fruit/flowers, and white flowers.",
        "note": "Bilva offering is scriptural Dharma"
      },
      {
        "order": 5,
        "title": "Chant Om Namah Shivaya",
        "description": "Spend time in japa chanting the Panchakshara mantra 108 times using a rudraksha mala.",
        "note": "Sourced from Yajurveda Shri Rudram"
      },
      {
        "order": 6,
        "title": "Listen to the Vrat Katha",
        "description": "Read or listen to the Sawan Somwar / Solah Somvar vrat story with full devotion.",
        "note": ""
      },
      {
        "order": 7,
        "title": "Perform aarti and break the fast",
        "description": "Perform the evening Shiva aarti, light the diya, and break your fast per family traditions.",
        "note": ""
      }
    ],
    "samagriItems": [
      {
        "name": "Ganga Jal or clean water",
        "function": "Offered with devotion in pujan",
        "order": 1
      },
      {
        "name": "Cow's milk",
        "function": "Offered with devotion in pujan",
        "order": 2
      },
      {
        "name": "Bilva patra",
        "function": "Offered with devotion in pujan",
        "order": 3
      },
      {
        "name": "Panchamrit",
        "function": "Offered with devotion in pujan",
        "order": 4
      },
      {
        "name": "Akshat",
        "function": "Offered with devotion in pujan",
        "order": 5
      },
      {
        "name": "White or saffron flowers",
        "function": "Offered with devotion in pujan",
        "order": 6
      },
      {
        "name": "Chandan",
        "function": "Offered with devotion in pujan",
        "order": 7
      },
      {
        "name": "Incense + diya + ghee",
        "function": "Offered with devotion in pujan",
        "order": 8
      },
      {
        "name": "Rudraksha mala",
        "function": "Offered with devotion in pujan",
        "order": 9
      }
    ],
    "mantras": [
      {
        "devanagari": "\u0950 \u0928\u092e\u0903 \u0936\u093f\u0935\u093e\u092f",
        "transliteration": "Om Namah Shivaya",
        "meaning": "108 times with rudraksha mala, or 11 / 21 / 51"
      }
    ],
    "dpbEntries": [
      {
        "elementName": "\"If you miss one Sawan Monday, all the previous Mo",
        "tag": "BHRANTI",
        "confidenceScore": 4,
        "claim": "\"If you miss one Sawan Monday, all the previous Mondays' vrats are lost.\"",
        "correction": "No text makes this claim. The tradition provides for exactly this situation: if you miss a Monday by circumstance, add one Monday at the end to keep the count unbroken. The vrat is a sankalp of devotion \u2014 the tradition is not punitive about human circumstance.",
        "sourceOfTruth": "Scriptures",
        "reviewStatus": "APPROVED"
      },
      {
        "elementName": "\"Only a pandit can perform Rudrabhishek \u2014 doing it",
        "tag": "BHRANTI",
        "confidenceScore": 4,
        "claim": "\"Only a pandit can perform Rudrabhishek \u2014 doing it yourself doesn't count.\"",
        "correction": "Any sincere devotee can pour water and milk on the Shivalinga and chant Om Namah Shivaya. The Shiva Purana does not restrict jalabhishek to priests. A pandit adds mantra expertise and pace for a larger gathering \u2014 not validity to the worship.",
        "sourceOfTruth": "Scriptures",
        "reviewStatus": "APPROVED"
      },
      {
        "elementName": "\"The Sawan Somwar fast must be nirjala \u2014 no food o",
        "tag": "BHRANTI",
        "confidenceScore": 4,
        "claim": "\"The Sawan Somwar fast must be nirjala \u2014 no food or water \u2014 or it has no merit.\"",
        "correction": "No Puranic text mandates the waterless form for Sawan Somwar. Phalahar (fruits and milk) and even a single sattvic meal are accepted forms of the vrat across the tradition. The Shiva Purana prescribes devotion and the sankalp \u2014 not endurance. A phalahar fast observed with full sincerity is a complete vrat.",
        "sourceOfTruth": "Scriptures",
        "reviewStatus": "APPROVED"
      }
    ],
    "thumbnailUrl": "/uploads/sawan-somwar.png",
    "panchangObservance": "Sawan Somwar",
    "panchangObservanceSub": "Shukla Paksha",
    "panchangMuhurta": "Morning",
    "panchangMuhurtaSub": "Auspicious timings",
    "panchangTithi": "Shukla Paksha",
    "panchangTithiSub": "Delhi-NCR",
    "panchangNote": "Timings and observances may vary slightly based on local sunset and city location. Check drikpanchang.com for local precision.",
    "sources": [
      {
        "name": "Bhavishya Purana",
        "reference": "Uttara Parva Ch.137",
        "type": "SHASTRA"
      }
    ],
    "relatedRitualGuides": [
      "hariyali-teej",
      "nag-panchami",
      "hartalika-teej"
    ]
  },
  {
    "title": "Raksha Bandhan: The Raksha Sutra, the Mantra, and the Three Puranic Narratives",
    "slug": "rakshabandhan",
    "category": "Festive Pujans",
    "introText": "The Bhavishya Purana does not describe a sister tying a decorative thread on her brother's wrist and receiving a gift in return. It describes something older and wider: a sacred thread, consecrated with a specific mantra, tied on the wrist of someone you want to protect \u2014 and it worked. The thread itself carried the power of the prayer. It was a shield.\n\nIn the founding narrative, it is a wife who ties it on her husband. In the Mahabharata, a friend ties it on a friend. In the Bhagavata Purana, a devotee ties it on a king. The common element is not the relationship \u2014 it is the thread, the mantra, and the intention.",
    "introTitle": "Introduction to the Pujan",
    "introDesc": "The Bhavishya Purana does not describe a sister tying a decorative thread on her brother's wrist and receiving a gift in return. It describes something older and wider: a sacred thread, consecrated with a specific mantra, tied on the wrist of someone you want to protect \u2014 and it worked. The thread itself carried the power of the prayer. It was a shield.",
    "sankalpaBody": "\u092e\u092e \u0938\u0915\u0932-\u0936\u093e\u0928\u094d\u0924\u093f-\u092a\u0942\u0930\u094d\u0935\u0915-\u0926\u0940\u0930\u094d\u0918\u093e\u092f\u0941-\u0935\u093f\u092d\u0942\u0924\u093f-\u092c\u0932-\u0915\u0940\u0930\u094d\u0924\u093f-\u092a\u094d\u0930\u093e\u092a\u094d\u0924\u094d\u092f\u0930\u094d\u0925\u0902, \u092a\u0942\u091c\u0928\u0902 \u0915\u0930\u093f\u0937\u094d\u092f\u0947\u0964",
    "sankalpaQuote": "With a sincere heart, I resolve to perform this worship for peace, longevity, strength, and devotion.",
    "sankalpaWho": "Devotee / Married Couple",
    "sankalpaForWhat": "Saubhagya & Spiritual Peace",
    "fastOptions": [
      {
        "name": "Sattvic Vrat",
        "desc": "Consuming simple vegetarian food once a day.",
        "recommended": true
      }
    ],
    "fastNote": "Grain avoidance is recommended to maintain physical and spiritual purity during the fast.",
    "kathaTitle": "Rakshabandhan Legend",
    "kathaBody": "1. SACHI-INDRA (Wife to Husband, Bhavishya Purana): Indra losing a war. Sachi ties consecrated thread on his wrist. He wins.\n\n2. DRAUPADI-KRISHNA (Friend to Friend, Mahabharata): Draupadi tears saree to bind Krishna's wound. He reciprocates during Vastraaharan.\n\n3. LAKSHMI-BALI (Devotee to King, Bhagavata Purana): Lakshmi ties thread on Bali's wrist to free Vishnu from doorkeeper duty.\n\nNone are sibling relationships. The thread is the constant.\n\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nIMAGE 2 \u2014 Three Threads on Different Surfaces\n\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nThe Vidhi\n\n\u2460  Prepare thali: Raksha Sutra, kumkum, akshat, diya, sweets.\n\n\u2461  Seat the person receiving the thread, facing east.\n\n\u2462  Apply tilak \u2014 kumkum and akshat on forehead.\n\n\u2463  Tie the Raksha Sutra on the right wrist while reciting the mantra.\n\n\u2464  Perform aarti \u2014 wave diya clockwise.\n\n\u2465  Feed sweets and receive blessings.\n\nNo fasting. Not a fasting festival. The ritual is the tying.\n\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nSamagri\n\n\u2610 Raksha Sutra (cotton/silk thread)  \u2610 Kumkum  \u2610 Akshat  \u2610 Diya+ghee  \u2610 Sweets  \u2610 Puja thali\n\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nDharma vs Pratha\n\nDHARMA: The mantra (Bhavishya Purana). The three narratives. The consecrated thread concept.\n\nPRATHA: Sibling-specific form. Decorative rakhis. Gift exchange. 'The gift proves the love.' All culturally dominant \u2014 not Puranic.\n\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nMyths & Facts\n\n\u2715  \"Raksha Bandhan is ONLY between siblings.\"\n\n\u2713  The three founding narratives are wife-husband, friend-friend, devotee-king. None are siblings.\n\n\u2715  \"The gift proves the love.\"\n\n\u2713  No Puranic text names a gift. The thread IS the complete ritual act.\n\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nClosing\n\nThe word 'rakshe' \u2014 protector \u2014 is the root of the festival's name. Not 'gift.' Not 'sibling.' Protector. That is what the thread becomes when the mantra is spoken.\n\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nIntelligence Layer \u2014 Three Traditions on Shravana Purnima\n\nNorth India: Raksha Bandhan. Maharashtra: Narali Purnima. South India: Avani Avittam. Three distinct traditions, one full moon.\n\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nRelated: Sawan Somwar | Eclipse Explainer (Chandra Grahan overlap) | Parsva Ekadashi (same Bali from mantra)\n\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nRITUAL CARD: Mantra: \u092f\u0947\u0928 \u092c\u0926\u094d\u0927\u094b \u092c\u0932\u0940 \u0930\u093e\u091c\u093e. No fast. Morning ceremony. Samagri: thread, kumkum, akshat, diya, sweets.\n\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\n\ud83d\udcac  Get reminded  |  WhatsApp \u2014 \u20b9499/yr  \u203a\n\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nThe Tapa Co. 2026  |  Stage 1 - Editorial Draft",
    "steps": [
      {
        "order": 1,
        "title": "Prepare thali",
        "description": "Gather Raksha Sutra, kumkum, akshat, diya, and sweets on a puja plate.",
        "note": ""
      },
      {
        "order": 2,
        "title": "Seat the recipient facing east",
        "description": "Have the person receiving the thread sit in an eastern direction for positive energy.",
        "note": ""
      },
      {
        "order": 3,
        "title": "Apply tilak",
        "description": "Apply a mark of kumkum and akshat on the recipient's forehead.",
        "note": ""
      },
      {
        "order": 4,
        "title": "Tie the Raksha Sutra",
        "description": "Tie the thread on the right wrist while reciting the sacred Raksha Sutra mantra.",
        "note": ""
      },
      {
        "order": 5,
        "title": "Perform aarti",
        "description": "Wave a lit ghee diya clockwise in front of the recipient.",
        "note": ""
      },
      {
        "order": 6,
        "title": "Conclude with sweets",
        "description": "Feed sweets and exchange blessings or vows of protection.",
        "note": "No fasting required."
      }
    ],
    "samagriItems": [
      {
        "name": "Raksha Sutra",
        "function": "Offered with devotion in pujan",
        "order": 1
      },
      {
        "name": "Kumkum",
        "function": "Offered with devotion in pujan",
        "order": 2
      },
      {
        "name": "Akshat",
        "function": "Offered with devotion in pujan",
        "order": 3
      },
      {
        "name": "Diya+ghee",
        "function": "Offered with devotion in pujan",
        "order": 4
      },
      {
        "name": "Sweets",
        "function": "Offered with devotion in pujan",
        "order": 5
      },
      {
        "name": "Puja thali",
        "function": "Offered with devotion in pujan",
        "order": 6
      }
    ],
    "mantras": [
      {
        "devanagari": "\u092f\u0947\u0928 \u092c\u0926\u094d\u0927\u094b \u092c\u0932\u0940 \u0930\u093e\u091c\u093e \u0926\u093e\u0928\u0935\u0947\u0928\u094d\u0926\u094d\u0930\u094b \u092e\u0939\u093e\u092c\u0932\u0903",
        "transliteration": "",
        "meaning": "'With the same bond that held King Bali, I bind you. O protector, be steadfast \u2014 do not falter.'"
      },
      {
        "devanagari": "\u0924\u0947\u0928 \u0924\u094d\u0935\u093e\u092e\u092d\u093f\u092c\u0927\u094d\u0928\u093e\u092e\u093f \u0930\u0915\u094d\u0937\u0947 \u092e\u093e \u091a\u0932 \u092e\u093e \u091a\u0932",
        "transliteration": "'With the same bond that held King Bali, I bind you. O protector, be steadfast \u2014 do not falter.'",
        "meaning": "[Dharma \u00b7 4/5]  [Bhavishya Purana, Uttara Parva Ch.137]"
      },
      {
        "devanagari": "RITUAL CARD: Mantra: \u092f\u0947\u0928 \u092c\u0926\u094d\u0927\u094b \u092c\u0932\u0940 \u0930\u093e\u091c\u093e. No fast. Morning ceremony. Samagri: thread, kumkum, akshat, diya, sweets.",
        "transliteration": "\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500",
        "meaning": "\ud83d\udcac  Get reminded  |  WhatsApp \u2014 \u20b9499/yr  \u203a"
      }
    ],
    "dpbEntries": [
      {
        "elementName": "\"Raksha Bandhan is ONLY between siblings.\"",
        "tag": "BHRANTI",
        "confidenceScore": 4,
        "claim": "\"Raksha Bandhan is ONLY between siblings.\"",
        "correction": "The three founding narratives are wife-husband, friend-friend, devotee-king. None are siblings.",
        "sourceOfTruth": "Scriptures",
        "reviewStatus": "APPROVED"
      },
      {
        "elementName": "\"The gift proves the love.\"",
        "tag": "BHRANTI",
        "confidenceScore": 4,
        "claim": "\"The gift proves the love.\"",
        "correction": "No Puranic text names a gift. The thread IS the complete ritual act.",
        "sourceOfTruth": "Scriptures",
        "reviewStatus": "APPROVED"
      }
    ],
    "thumbnailUrl": "/uploads/rakshabandhan.png",
    "panchangObservance": "28 Aug, Friday",
    "panchangObservanceSub": "Shukla Paksha",
    "panchangMuhurta": "Morning",
    "panchangMuhurtaSub": "Auspicious timings",
    "panchangTithi": "Shravana Purnima",
    "panchangTithiSub": "Delhi-NCR",
    "panchangNote": "Timings and observances may vary slightly based on local sunset and city location. Check drikpanchang.com for local precision.",
    "sources": [
      {
        "name": "Bhavishya Purana",
        "reference": "Bhavishya Purana (Uttara Parva Ch.137  Sachi-Indra + Raksha Sutra mantra). Mahabharata (Draupadi-Krishna). Bhagavata Purana (Lakshmi-Bali). Three narratives, three relationships, none sibling.",
        "type": "SHASTRA"
      }
    ],
    "relatedRitualGuides": [
      "sawan-somwar",
      "kamika-ekadashi"
    ]
  },
  {
    "title": "Kamika Ekadashi: Vrat Katha and Vidhi",
    "slug": "kamika-ekadashi",
    "category": "Festive Pujans",
    "introText": "Kamika Ekadashi falls in the dark fortnight of Shravana \u2014 the monsoon month already charged with Shiva and Vishnu devotion. The Brahma Vaivarta Purana says that even hearing about this Ekadashi carries the merit of a Vajapeya yajna. The Padma Purana adds that offering tulsi leaves and lighting a ghee lamp on this day pleases Vishnu more than any material offering.\n\nThe name Kamika means desire-fulfilling. But the tradition is careful about what kind of desire it means \u2014 not material greed, but the sincere wish of a devotee who has disciplined their body and mind through the fast and turned their attention toward the Divine.",
    "introTitle": "Introduction to the Pujan",
    "introDesc": "Kamika Ekadashi falls in the dark fortnight of Shravana \u2014 the monsoon month already charged with Shiva and Vishnu devotion. The Brahma Vaivarta Purana says that even hearing about this Ekadashi carries the merit of a Vajapeya yajna. The Padma Purana adds that offering tulsi leaves and lighting a ghee lamp on this day pleases Vishnu more than any material offering.",
    "sankalpaBody": "\u092e\u092e \u0938\u0915\u0932-\u0936\u093e\u0928\u094d\u0924\u093f-\u092a\u0942\u0930\u094d\u0935\u0915-\u0926\u0940\u0930\u094d\u0918\u093e\u092f\u0941-\u0935\u093f\u092d\u0942\u0924\u093f-\u092c\u0932-\u0915\u0940\u0930\u094d\u0924\u093f-\u092a\u094d\u0930\u093e\u092a\u094d\u0924\u094d\u092f\u0930\u094d\u0925\u0902, \u092a\u0942\u091c\u0928\u0902 \u0915\u0930\u093f\u0937\u094d\u092f\u0947\u0964",
    "sankalpaQuote": "With a sincere heart, I resolve to perform this worship for peace, longevity, strength, and devotion.",
    "sankalpaWho": "Devotee / Married Couple",
    "sankalpaForWhat": "Saubhagya & Spiritual Peace",
    "fastOptions": [
      {
        "name": "Ekadashi Phalahar",
        "desc": "Avoiding grains, beans and rice; permitting fruits and milk.",
        "recommended": true
      },
      {
        "name": "Nirjala Ekadashi",
        "desc": "Severe fast without water, suited for advanced practitioners.",
        "recommended": false
      }
    ],
    "fastNote": "Grain avoidance is recommended to maintain physical and spiritual purity during the fast.",
    "kathaTitle": "Kamika Ekadashi Legend",
    "kathaBody": "Kamika Ekadashi - Brahma Vaivarta Purana\n\nPresiding deity: Lord Shridhar - Vishnu as the bearer of Shri (Lakshmi)\n\nName origin: 'Kamika' derives from 'Kama' \u2014 desire. This Ekadashi is said to fulfil the sincere desires of the devotee.\n\nIMAGE 1 \u2014 Tulsi and Ghee Lamp at Evening Puja\n\nPlacement: here \u2014 after name origin / Shridhar note, before Vrat Katha\n\nType: AI-GENERATED \u2014 Safe: ritual objects, no deity iconography\n\nThe tulsi is the hero \u2014 bright green, clearly the primary offering. Ghee lamp burns steadily.\n\nSmall brass lota of water visible. Indian home setting. No deity idol \u2014 just the offerings and the lamp.\n\nWhy this image: Kamika Ekadashi's distinctive elements are tulsi (especially emphasised) and the ghee lamp (lit through the night). Both visible in one frame.\n\nReusable as a generic Ekadashi puja setup image across the series.\n\nThe Katha of the Warrior and His Redemption (Brahma Vaivarta Purana, narrated by Brahma to Narada)\n\nNarada asked: 'O Kamalasana, what is the name and merit of the Ekadashi that falls in the dark half of Shravana?'  Brahma replied:  'Listen carefully, Narada. This Ekadashi is called Kamika, and its merit is immeasurable.  In ancient times, there lived a warrior \u2014 brave in battle but ruthless in his conduct. Through years of violence, he had accumulated sins that weighed upon his soul like a mountain. As he aged, the weight became unbearable. He sought counsel from sages and was told: observe the Ekadashi that falls in Shravana Krishna Paksha. Fast with sincerity, offer tulsi to Lord Vishnu, light a ghee lamp that burns through the night, and recite Vishnu's names with a contrite heart.  The warrior did as he was told. On Kamika Ekadashi, he bathed at dawn, set up a simple altar with a Vishnu image, offered fresh tulsi leaves, lit a ghee lamp, and spent the day in fasting and prayer. He did not ask for wealth or victory. He asked only for release from the burden he carried.  By the grace of Lord Shridhar, the warrior's accumulated sins were dissolved. He lived the rest of his life in peace and, at death, attained Vishnu-loka.  This is the merit of Kamika Ekadashi. Whoever observes it with sincerity \u2014 fasting, offering tulsi, lighting the lamp \u2014 shall find that the desires of their heart, when turned toward the Divine, are fulfilled.'\n\nRecite the katha during the puja, ideally in the evening. Read it aloud or have it read while you listen with full attention.\n\nSamagri Checklist  (shared across all Ekadashis)\n\nITEM\n\nCLASSIFICATION\n\nNOTE\n\nTulsi leaves (fresh)\n\nDHARMA -- Mandatory\n\nVishnu's foremost offering. No Vishnu puja is complete without tulsi.\n\nGanga Jal or clean water\n\nDHARMA -- Mandatory\n\nFor panchamrit abhishek.\n\nCow's milk\n\nDHARMA -- Mandatory\n\nFor panchamrit abhishek.\n\nPanchamrit (milk, curd, ghee, honey, sugar)\n\nDHARMA -- Optional\n\nFull abhishek form. Simple water + milk sufficient.\n\nLotus flowers or seasonal flowers\n\nDHARMA -- Optional\n\nLotus is Vishnu's flower; any fresh flower accepted.\n\nAkshat (unbroken rice, turmeric-stained)\n\nDHARMA -- Optional\n\nStandard puja offering.\n\nDiya and ghee\n\nDHARMA -- Optional\n\nFor aarti and jagaran.\n\nFruits for Parana meal\n\nDHARMA -- For Parana\n\nBreak fast with fruits and light food first.\n\nFood for daan\n\nDHARMA -- Strongly recommended\n\nCompleting the fast with daan is part of the full observance.\n\nAvoid on Ekadashi fast day:\n\nGrains, rice, wheat, lentils and pulses, regular salt (use sendha namak / rock salt instead), onion, garlic, and non-vegetarian food. Consume only phalahar (fruits, milk, curd, nuts, sabudana, vrat-specific foods).\n\nSection: The Vidhi - Step by Step\n\nDashami - preparation day:\n\n1\n\nEat one sattvic meal before noon on Dashami\n\nAvoid grains, lentils, onion, garlic from midday onwards. Keep the rest of the day light. Sleep early. Maintain celibacy.\n\nEkadashi - 8 Aug (the fast):\n\n2\n\nRise before sunrise and bathe\n\nBathing at dawn on Ekadashi carries the merit of bathing in a sacred river. Wear clean clothes.\n\n3\n\nTake the Vrat Sankalp\n\nSit before the Vishnu idol. Resolve: 'I observe Kamika Ekadashi with devotion, fasting until Dwadashi Parana, for the grace of Lord Shridhar.'\n\n4\n\nPerform Vishnu puja - worship Lord Shridhar\n\nBathe the Vishnu idol or Shaligram with panchamrit. Offer fresh tulsi leaves (mandatory). Offer lotus or seasonal flowers, akshat, incense, and a lit ghee diya. Chant Om Namo Bhagavate Vasudevaya 108 times. Recite the Vishnu Sahasranama if time permits.\n\n5\n\nRecite the Vrat Katha\n\nRead or listen to the katha of Kamika Ekadashi. The katha is not supplementary to the puja -- it is the puja's completion.\n\n6\n\nKeep the fast and observe jagaran if possible\n\nFast through the day on phalahar. Avoid all grains. If physically able, stay awake through part of the night in bhajan, reading, or quiet meditation.\n\nDwadashi - 9 Aug (Parana day):\n\n7\n\nBreak the fast during the Parana window\n\nOn 9 Aug, break the fast during the prescribed Parana window (5:40 AM \u2013 8:14 AM, Delhi-NCR). Do not break during Hari Vasara. Begin with water or a small fruit. Offer food to a Brahmin or a family in need -- daan completes the observance.\n\nFasting - three accepted forms\n\nNirjala - no food or water (demanding; only if physically suited)     |     Phalahar - fruits, milk, sattvic vrat foods (widely practised, fully accepted)     |     Sajal / one sattvic meal - permitted where health requires\n\nThe Puranas prescribe devotion and the sankalp, not a specific fast form. Phalahar and sajal are explicitly accepted. Difficulty is not the requirement.\n\nIMAGE 2 \u2014 Parana Morning\n\nPlacement: here \u2014 after vidhi / fasting box, before Myths & Facts\n\nType: AI-GENERATED \u2014 Safe: food, no deity iconography\n\nREUSABLE TEMPLATE \u2014 this image (or variant) appears in every Ekadashi article at the Parana section.\n\nSection: Myths & Facts\n\n\u2715  \"Kamika Ekadashi is only for a specific type of person - if it doesn't match your situation, there is no point observing it.\"\n\n\u2713  No text restricts any Ekadashi to a specific type of devotee. The katha may highlight a particular phala (Fulfilment of sincere desires, purification of accumulated karma, merit equal to Vajapeya yajna), but the Puranas consistently describe every Ekadashi as beneficial for any sincere observer. The fast purifies karma, the katha transmits merit, and the Parana completes the observance -- for everyone.\n\n\u2715  \"If you miss the Parana window on Dwadashi, the entire fast is wasted.\"\n\n\u2713  The Parana timing matters and should be followed sincerely. But the tradition frames Hari Vasara and Dwadashi timing as a rule of propriety and spiritual precision, not a mechanism for punishment. An honest error does not 'reset' the fast's merit. If you miss the window through genuine circumstance, complete the fast with daan and pray with sincerity.\n\nClosing Prose\n\nKamika Ekadashi arrives in the monsoon, when the earth is being washed clean by rain. The tradition asks the devotee to do the same inwardly: let the fast wash away what has accumulated, let the tulsi and the lamp and the sincere heart do their work, and trust that Vishnu receives what is offered with honesty.\n\nThe name says desire. The tradition says discipline. The Purana says both are needed: the desire to be free of what weighs you down, and the discipline to set aside food, grains, and distraction for one day so that the soul can be heard above the body.\n\nIntelligence Layer - Why Are Grains Avoided on Ekadashi?\n\nINTELLIGENCE LAYER  |  Shared across all Ekadashi articles\n\nWhy are grains avoided on Ekadashi?\n\nEvery fortnight, on the eleventh day of the lunar cycle, devotees observe Ekadashi -- a day dedicated to Lord Vishnu. It is a day of restraint, prayer, and turning inward.\n\nThe Puranas tell us that Ekadashi has the power to cleanse accumulated karma and bring one closer to the Divine. But as more people began observing this sacred vrata, a question arose: if Ekadashi destroys sin, where does sin go?\n\nThe Puranic tradition answers this through a symbolic story.\n\nIt says that Papa Purusha -- the personification of all sinful actions -- approached Lord Vishnu in distress. 'Lord,' he said, 'if every devotee observes Ekadashi and is purified, I shall have no place to remain. What is to become of me?'\n\nMoved by his plea, Vishnu replied: 'On the day of Ekadashi, you shall reside in anna -- the staple grains. Those who seek My grace on this sacred day will abstain from them. Those who choose not to observe the vrata may eat as they wish, but My devotees shall leave those grains untouched.'\n\nFrom that day onward, the tradition says, grains became the temporary abode of Papa on Ekadashi. This is why the shastras advise devotees to avoid anna -- rice, wheat, barley and other grains -- on Ekadashi. If one cannot undertake a complete fast, the prescribed alternative is fruits, milk, roots, nuts, and other non-grain foods.\n\nThe idea is not that grains are impure. On every other day, they are revered as Anna Devata, a sacred gift that nourishes life. But on Ekadashi, setting them aside becomes an act of devotion -- a conscious reminder that, for one day, the soul is nourished before the body.\n\nTextual basis: The Brihan-Naradiya Purana states that all sins reside in grains on Hari-vasara (Ekadashi). The Papa Purusha story is a Puranic elaboration that transmits this injunction through narrative. Both the injunction and the narrative are preserved here without conflating them.\n\nRelated Pujans\n\nSawan Somwar Vrat\n\nSame Shravan month  |  Deity Cluster\n\nShravana Putrada Ekadashi\n\n23 August  |  Vrat Type Cluster \u2014 next Ekadashi\n\nNag Panchami\n\n17 August  |  Same Shravan window\n\n\ud83d\udcac  Get reminded before every festival   WhatsApp reminders - \u20b9499/yr  \u203a\n\nRITUAL CARD 6 OF 7\n\n\u0924\u092a\u094d\n\nKamika Ekadashi\n\n8 August 2026  |  Saturday  |  Shravana Krishna Ekadashi\n\nDATE\n\nTITHI\n\nFAST\n\nPARANA\n\n8 Aug\n\nSaturday\n\nShravana Krishna Ekadashi\n\nAll day\n\n8 Aug\n\n5:40 AM - 8:14 AM\n\n9 Aug (Dwadashi)\n\nSAMAGRI CHECKLIST\n\n\u2610  Tulsi leaves (fresh) \u2014 especially emphasised\n\n\u2610  Ganga Jal or clean water\n\n\u2610  Cow's milk\n\n\u2610  Panchamrit\n\n\u2610  Lotus or seasonal flowers\n\n\u2610  Ghee diya (keep burning through night)\n\n\u2610  Akshat\n\n\u2610  Fruits for Parana\n\n\u2610  Food for daan\n\nVIDHI \u2014 STEP BY STEP\n\nDashami \u2014 7 Aug (prep)\n\n1\n\nOne sattvic meal before noon. No grains after midday.\n\nEkadashi \u2014 8 Aug (the fast)\n\n2\n\nRise before sunrise and bathe\n\n3\n\nTake the Vrat Sankalp before Vishnu idol\n\n4\n\nPuja \u2014 panchamrit abhishek, tulsi (especially), flowers, ghee diya. Chant Om Namo Bhagavate Vasudevaya 108x\n\n5\n\nRecite the Vrat Katha (the warrior's redemption)\n\n6\n\nFast on phalahar. Light a ghee lamp \u2014 keep it burning through the night.\n\nDwadashi \u2014 9 Aug (Parana)\n\n7\n\nBreak fast between 5:40 AM and 8:14 AM. Begin with water/fruit. Complete with daan.\n\nMANTRA\n\n\u0950 \u0928\u092e\u094b \u092d\u0917\u0935\u0924\u0947 \u0935\u093e\u0938\u0941\u0926\u0947\u0935\u093e\u092f\n\nOm Namo Bhagavate Vasudevaya\n\n108 times, or 12 / 24 / 48\n\nFASTING\n\nAvoid: all grains, rice, wheat, lentils, regular salt.\n\nUse: fruits, milk, sabudana, sendha namak, nuts.\n\nGhee lamp offering carries special merit on Kamika Ekadashi.\n\n\u0924\u092a\u094d\n\nthetapaco.com\n\nSource: Drik Panchang, Delhi-NCR  |  2026\n\nThe Katha of the Warrior and His Redemption (Brahma Vaivarta Purana, narrated by Brahma to Narada)\n\nNarada asked: 'O Kamalasana, what is the name and merit of the Ekadashi that falls in the dark half of Shravana?'  Brahma replied:  'Listen carefully, Narada. This Ekadashi is called Kamika, and its merit is immeasurable.  In ancient times, there lived a warrior \u2014 brave in battle but ruthless in his conduct. Through years of violence, he had accumulated sins that weighed upon his soul like a mountain. As he aged, the weight became unbearable. He sought counsel from sages and was told: observe the Ekadashi that falls in Shravana Krishna Paksha. Fast with sincerity, offer tulsi to Lord Vishnu, light a ghee lamp that burns through the night, and recite Vishnu's names with a contrite heart.  The warrior did as he was told. On Kamika Ekadashi, he bathed at dawn, set up a simple altar with a Vishnu image, offered fresh tulsi leaves, lit a ghee lamp, and spent the day in fasting and prayer. He did not ask for wealth or victory. He asked only for release from the burden he carried.  By the grace of Lord Shridhar, the warrior's accumulated sins were dissolved. He lived the rest of his life in peace and, at death, attained Vishnu-loka.  This is the merit of Kamika Ekadashi. Whoever observes it with sincerity \u2014 fasting, offering tulsi, lighting the lamp \u2014 shall find that the desires of their heart, when turned toward the Divine, are fulfilled.'\n\nRecite the katha during the puja, ideally in the evening. Read it aloud or have it read while you listen with full attention.\n\nSamagri Checklist  (shared across all Ekadashis)\n\nITEM\n\nCLASSIFICATION\n\nNOTE\n\nTulsi leaves (fresh)\n\nDHARMA -- Mandatory\n\nVishnu's foremost offering. No Vishnu puja is complete without tulsi.\n\nGanga Jal or clean water\n\nDHARMA -- Mandatory\n\nFor panchamrit abhishek.\n\nCow's milk\n\nDHARMA -- Mandatory\n\nFor panchamrit abhishek.\n\nPanchamrit (milk, curd, ghee, honey, sugar)\n\nDHARMA -- Optional\n\nFull abhishek form. Simple water + milk sufficient.\n\nLotus flowers or seasonal flowers\n\nDHARMA -- Optional\n\nLotus is Vishnu's flower; any fresh flower accepted.\n\nAkshat (unbroken rice, turmeric-stained)\n\nDHARMA -- Optional\n\nStandard puja offering.\n\nDiya and ghee\n\nDHARMA -- Optional\n\nFor aarti and jagaran.\n\nFruits for Parana meal\n\nDHARMA -- For Parana\n\nBreak fast with fruits and light food first.\n\nFood for daan\n\nDHARMA -- Strongly recommended\n\nCompleting the fast with daan is part of the full observance.\n\nAvoid on Ekadashi fast day:\n\nGrains, rice, wheat, lentils and pulses, regular salt (use sendha namak / rock salt instead), onion, garlic, and non-vegetarian food. Consume only phalahar (fruits, milk, curd, nuts, sabudana, vrat-specific foods).",
    "steps": [
      {
        "order": 1,
        "title": "Eat one sattvic meal before noon on Dashami",
        "description": "Avoid grains, lentils, onion, garlic from midday onwards. Keep the rest of the day light. Sleep early. Maintain celibacy.",
        "note": "Dharma - mandatory prep"
      },
      {
        "order": 2,
        "title": "Rise before sunrise and bathe",
        "description": "Bathing at dawn on Ekadashi carries the merit of bathing in a sacred river. Wear clean clothes.",
        "note": "Dharma"
      },
      {
        "order": 3,
        "title": "Take the Vrat Sankalp",
        "description": "Sit before the Vishnu idol. Resolve: 'I observe Kamika Ekadashi with devotion, fasting until Dwadashi Parana, for the grace of Lord Shridhar.'",
        "note": "Dharma"
      },
      {
        "order": 4,
        "title": "Perform Vishnu puja - worship Lord Shridhar",
        "description": "Bathe the Vishnu idol or Shaligram with panchamrit. Offer fresh tulsi leaves (mandatory). Offer lotus or seasonal flowers, akshat, incense, and a lit ghee diya. Chant Om Namo Bhagavate Vasudevaya 108 times. Recite the Vishnu Sahasranama if time permits.",
        "note": "Dharma - core act]  [Brahma Vaivarta Purana"
      },
      {
        "order": 5,
        "title": "Recite the Vrat Katha",
        "description": "Read or listen to the katha of Kamika Ekadashi. The katha is not supplementary to the puja -- it is the puja's completion.",
        "note": "Dharma - mandatory]  [Brahma Vaivarta Purana"
      },
      {
        "order": 6,
        "title": "Keep the fast and observe jagaran if possible",
        "description": "Fast through the day on phalahar. Avoid all grains. If physically able, stay awake through part of the night in bhajan, reading, or quiet meditation.",
        "note": "Dharma - fasting]  [Jagaran - Pratha"
      },
      {
        "order": 7,
        "title": "Break the fast during the Parana window",
        "description": "On 9 Aug, break the fast during the prescribed Parana window (5:40 AM \u2013 8:14 AM, Delhi-NCR). Do not break during Hari Vasara. Begin with water or a small fruit. Offer food to a Brahmin or a family in need -- daan completes the observance.",
        "note": "Dharma - ritual-critical"
      }
    ],
    "samagriItems": [
      {
        "name": "Tulsi leaves",
        "function": "Offered with devotion in pujan",
        "order": 1
      },
      {
        "name": "Ganga Jal or clean water",
        "function": "Offered with devotion in pujan",
        "order": 2
      },
      {
        "name": "Cow's milk",
        "function": "Offered with devotion in pujan",
        "order": 3
      },
      {
        "name": "Panchamrit",
        "function": "Offered with devotion in pujan",
        "order": 4
      },
      {
        "name": "Lotus or seasonal flowers",
        "function": "Offered with devotion in pujan",
        "order": 5
      },
      {
        "name": "Ghee diya",
        "function": "Offered with devotion in pujan",
        "order": 6
      },
      {
        "name": "Akshat",
        "function": "Offered with devotion in pujan",
        "order": 7
      },
      {
        "name": "Fruits for Parana",
        "function": "Offered with devotion in pujan",
        "order": 8
      },
      {
        "name": "Food for daan",
        "function": "Offered with devotion in pujan",
        "order": 9
      }
    ],
    "mantras": [
      {
        "devanagari": "\u0950 \u0928\u092e\u094b \u092d\u0917\u0935\u0924\u0947 \u0935\u093e\u0938\u0941\u0926\u0947\u0935\u093e\u092f",
        "transliteration": "Om Namo Bhagavate Vasudevaya",
        "meaning": "108 times, or 12 / 24 / 48"
      }
    ],
    "dpbEntries": [
      {
        "elementName": "Myths",
        "tag": "BHRANTI",
        "confidenceScore": 4,
        "claim": "Myths",
        "correction": "",
        "sourceOfTruth": "Scriptures",
        "reviewStatus": "APPROVED"
      },
      {
        "elementName": "\"Kamika Ekadashi is only for a specific type of pe",
        "tag": "BHRANTI",
        "confidenceScore": 4,
        "claim": "\"Kamika Ekadashi is only for a specific type of person - if it doesn't match your situation, there is no point observing it.\"",
        "correction": "No text restricts any Ekadashi to a specific type of devotee. The katha may highlight a particular phala (Fulfilment of sincere desires, purification of accumulated karma, merit equal to Vajapeya yajna), but the Puranas consistently describe every Ekadashi as beneficial for any sincere observer. The fast purifies karma, the katha transmits merit, and the Parana completes the observance -- for everyone.",
        "sourceOfTruth": "Scriptures",
        "reviewStatus": "APPROVED"
      },
      {
        "elementName": "\"If you miss the Parana window on Dwadashi, the en",
        "tag": "BHRANTI",
        "confidenceScore": 4,
        "claim": "\"If you miss the Parana window on Dwadashi, the entire fast is wasted.\"",
        "correction": "The Parana timing matters and should be followed sincerely. But the tradition frames Hari Vasara and Dwadashi timing as a rule of propriety and spiritual precision, not a mechanism for punishment. An honest error does not 'reset' the fast's merit. If you miss the window through genuine circumstance, complete the fast with daan and pray with sincerity.",
        "sourceOfTruth": "Scriptures",
        "reviewStatus": "APPROVED"
      }
    ],
    "thumbnailUrl": "/uploads/kamika-ekadashi.png",
    "panchangObservance": "8 Aug (Saturday)",
    "panchangObservanceSub": "Shukla Paksha",
    "panchangMuhurta": "Morning",
    "panchangMuhurtaSub": "Auspicious timings",
    "panchangTithi": "Shravana Krishna Ekadashi",
    "panchangTithiSub": "Delhi-NCR",
    "panchangNote": "Timings and observances may vary slightly based on local sunset and city location. Check drikpanchang.com for local precision.",
    "sources": [
      {
        "name": "Bhavishya Purana",
        "reference": "Uttara Parva Ch.137",
        "type": "SHASTRA"
      }
    ],
    "relatedRitualGuides": [
      "shravana-putrada-ekadashi",
      "sawan-somwar",
      "nag-panchami"
    ]
  }
];

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

  // Seed Homepage Banner
  console.log("Seeding initial HomepageBanner...");
  const existingBanner = await db.homepageBanner.findFirst();
  if (!existingBanner) {
    await db.homepageBanner.create({
      data: {
        isActive: true,
        imageUrl: "/images/prebook_hero.jpg",
        orderByDate: new Date("2026-09-10T18:30:00.000Z"),
        festivalTitle: "DELIVERED BEFORE GANESH CHATURTHI",
        mainHeading: "Complete Ganesh Chaturthi",
        highlightedText: "Puja Kit",
        description: "Packaged and sealed at the source to ensure high-vibration purity. Sourced from organic, scripturally-aligned farms.",
        price: 1499.00,
        mrp: 1999.00,
        primaryCtaText: "Pre-book Kit now ›",
        primaryCtaLink: "/cart",
        secondaryCtaText: "View Kit Details",
        secondaryCtaLink: "/ritual-kits",
        festivalDate: new Date("2026-09-14T18:30:00.000Z"),
      }
    });
    console.log("✓ Seeded HomepageBanner successfully");
  } else {
    console.log("HomepageBanner already exists. Skipping.");
  }

  console.log("=== SEED PROCESS COMPLETED ===");
  process.exit(0);
}

main().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
