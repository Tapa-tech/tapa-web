const { PrismaClient } = require("@prisma/client");
const PanchangLib = require("@bidyashish/panchang");
const { getPanchanga, Ephemeris } = PanchangLib;

const db = new PrismaClient();

const CITY = "Delhi-NCR";
const LAT = 28.6139;
const LON = 77.2090;
const TIMEZONE = "Asia/Kolkata";

// NOAA Solar Calculator algorithm for precise sunrise and sunset times
function calculateSunriseSunsetNOAA(date, latitude, longitude) {
  const jd = date.getTime() / 86400000 + 2440587.5;
  const d = jd - 2451545.0; // days since J2000.0

  const g = ((357.529 + 0.98560028 * d) * Math.PI) / 180;
  const q = ((280.459 + 0.98564736 * d) * Math.PI) / 180;
  const L = q + (1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * Math.PI / 180;
  const e = ((23.439 - 0.00000036 * d) * Math.PI) / 180;
  const dec = Math.asin(Math.sin(e) * Math.sin(L));

  let ra = Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L));
  if (ra < 0) ra += 2 * Math.PI;

  let eqt = q - ra;
  while (eqt < -Math.PI) eqt += 2 * Math.PI;
  while (eqt > Math.PI) eqt -= 2 * Math.PI;

  const transitOffset = 0.5 - longitude / 360 - eqt / (2 * Math.PI);
  const h0 = (-0.833 * Math.PI) / 180; // standard refraction + disk size
  const latRad = (latitude * Math.PI) / 180;

  const cosH = (Math.sin(h0) - Math.sin(latRad) * Math.sin(dec)) / (Math.cos(latRad) * Math.cos(dec));
  if (cosH > 1 || cosH < -1) return null;

  const H = Math.acos(cosH);
  const hFraction = H / (2 * Math.PI);

  const sunriseFraction = transitOffset - hFraction;
  const sunsetFraction = transitOffset + hFraction;

  const dateBase = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const baseMs = dateBase.getTime();

  return {
    sunrise: new Date(baseMs + sunriseFraction * 86400000),
    sunset: new Date(baseMs + sunsetFraction * 86400000),
  };
}

if (typeof Ephemeris !== "undefined") {
  Ephemeris.prototype.calculateSunrise = function (date, location) {
    const result = calculateSunriseSunsetNOAA(date, location.latitude, location.longitude);
    return result ? result.sunrise : new Date(date);
  };

  Ephemeris.prototype.calculateSunset = function (date, location) {
    const result = calculateSunriseSunsetNOAA(date, location.latitude, location.longitude);
    return result ? result.sunset : new Date(date);
  };
}

// Auspicious nakshatras
const AUSPICIOUS_NAKSHATRAS = new Set([
  "Ashwini", "Rohini", "Mrigashira", "Pushya", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Anuradha", "Uttara Ashadha",
  "Shravana", "Dhanishtha", "Shatabhisha", "Uttara Bhadrapada", "Revati"
]);

function getOrdinalSuffix(n) {
  if (n >= 11 && n <= 13) return "th";
  switch (n % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

const formatTime = (d) => {
  const dateObj = typeof d === "string" ? new Date(d) : d;
  return dateObj.toLocaleTimeString("en-US", {
    timeZone: TIMEZONE,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
};

const EKADASHI_NAMES = {
  0: { Krishna: "Saphala Ekadashi", Shukla: "Pausha Putrada Ekadashi" },
  1: { Krishna: "Shattila Ekadashi", Shukla: "Jaya Ekadashi" },
  2: { Krishna: "Vijaya Ekadashi", Shukla: "Amalaki Ekadashi" },
  3: { Krishna: "Papmochani Ekadashi", Shukla: "Kamada Ekadashi" },
  4: { Krishna: "Varuthini Ekadashi", Shukla: "Mohini Ekadashi" },
  5: { Krishna: "Apara Ekadashi", Shukla: "Nirjala Ekadashi" },
  6: { Krishna: "Yogini Ekadashi", Shukla: "Devshayani Ekadashi" },
  7: { Krishna: "Kamika Ekadashi", Shukla: "Shravana Putrada Ekadashi" },
  8: { Krishna: "Aja Ekadashi", Shukla: "Parsva Ekadashi" },
  9: { Krishna: "Indira Ekadashi", Shukla: "Papankusha Ekadashi" },
  10: { Krishna: "Rama Ekadashi", Shukla: "Devutthana Ekadashi" },
  11: { Krishna: "Utpanna Ekadashi", Shukla: "Mokshada Ekadashi" },
};

const RITUAL_GUIDE_LINKS = {
  "Kamika Ekadashi": "kamika-ekadashi",
  "Shravana Putrada Ekadashi": "shravana-putrada-ekadashi",
  "Aja Ekadashi": "aja-ekadashi",
  "Parsva Ekadashi": "parsva-ekadashi",
  "Ganesh Chaturthi": "ganesh-chaturthi-10day",
  "Hariyali Teej": "hariyali-teej",
  "Kajari Teej": "kajari-teej",
  "Hartalika Teej": "hartalika-teej",
  "Nag Panchami": "nag-panchami",
  "Sawan Somwar Vrat": "sawan-somwar",
  "Raksha Bandhan": "rakshabandhan",
  "Krishna Janmashtami": "krishna-janmashtami",
  "Radha Ashtami": "radha-ashtami",
  "Satyanarayan Puja": "satyanarayan-katha",
};

async function main() {
  console.log("Emptying existing Panchang and Vrat tables...");
  await db.panchangEntry.deleteMany({});
  await db.vratEntry.deleteMany({});

  const startDate = new Date(Date.UTC(2026, 0, 1));
  const endDate = new Date(Date.UTC(2026, 11, 31));

  let count = 0;
  let vratCount = 0;

  for (let d = new Date(startDate); d <= endDate; d.setUTCDate(d.getUTCDate() + 1)) {
    const dateOnly = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    
    // Calculate panchang
    let p;
    try {
      p = getPanchanga(dateOnly, LAT, LON, TIMEZONE);
    } catch (err) {
      console.error(`Error calculating panchang for ${dateOnly.toISOString().split("T")[0]}:`, err);
      continue;
    }

    if (!p) continue;

    const sunrise = formatTime(p.sunrise);
    const sunset = p.sunset ? formatTime(p.sunset) : null;

    const tithiName = p.tithi.name;
    const tithiNumber = p.tithi.number;
    const tithiSub = `${tithiNumber}${getOrdinalSuffix(tithiNumber)} day`;

    const paksha = p.tithi.paksha; // "Shukla" or "Krishna"
    const pakshaSub = paksha === "Shukla" ? "Waxing moon" : "Waning moon";

    const nakshatraName = p.nakshatra.name;
    const nakshatraSub = AUSPICIOUS_NAKSHATRAS.has(nakshatraName) ? "Auspicious" : null;

    // Create panchang entry
    await db.panchangEntry.create({
      data: {
        date: dateOnly,
        city: CITY,
        tithi: tithiName,
        tithiSub,
        paksha,
        pakshaSub,
        nakshatra: nakshatraName,
        nakshatraSub,
        sunrise,
        sunset,
        dataSource: "AUTO_SYNCED",
        syncedAt: new Date(),
      }
    });
    count++;

    // Check and create VratEntries
    const monthIndex = dateOnly.getUTCMonth();
    const isMonday = dateOnly.getUTCDay() === 1;

    // 1. Sawan Somwar (Every Monday in August 2026)
    if (isMonday && monthIndex === 7) {
      await db.vratEntry.create({
        data: {
          name: "Sawan Somwar Vrat",
          date: dateOnly,
          category: "Ekadashi", // Add to general list
          description: "Holy Monday vow dedicated to Lord Shiva",
          linkedGuideId: RITUAL_GUIDE_LINKS["Sawan Somwar Vrat"]
        }
      });
      vratCount++;
    }

    // 2. Ekadashi
    if (tithiNumber === 11) {
      const name = EKADASHI_NAMES[monthIndex][paksha] || `${paksha} Ekadashi`;
      await db.vratEntry.create({
        data: {
          name,
          date: dateOnly,
          category: "Ekadashi",
          description: `Auspicious ${paksha} Ekadashi fast`,
          linkedGuideId: RITUAL_GUIDE_LINKS[name] || null
        }
      });
      vratCount++;
    }

    // 3. Pradosh
    if (tithiNumber === 13) {
      await db.vratEntry.create({
        data: {
          name: `${paksha} Pradosh Vrat`,
          date: dateOnly,
          category: "Pradosh",
          description: "Twilight fast dedicated to Lord Shiva",
        }
      });
      vratCount++;
    }

    // 4. Chaturthi
    if (tithiNumber === 4) {
      let name = paksha === "Krishna" ? "Sankashti Chaturthi" : "Vinayaka Chaturthi";
      let linkedGuideId = null;

      // Special: Ganesh Chaturthi (Ashwin/Bhadrapada Shukla Chaturthi) - September Shukla Chaturthi
      if (paksha === "Shukla" && monthIndex === 8) {
        name = "Ganesh Chaturthi";
        linkedGuideId = RITUAL_GUIDE_LINKS["Ganesh Chaturthi"];
      }

      await db.vratEntry.create({
        data: {
          name,
          date: dateOnly,
          category: "Chaturthi",
          description: paksha === "Krishna" ? "Fast seeking Lord Ganesha's blessings to remove obstacles" : "Lord Ganesha worship",
          linkedGuideId
        }
      });
      vratCount++;
    }

    // 5. Purnima
    if (tithiNumber === 15 && paksha === "Shukla") {
      let name = "Purnima Vrat";
      let linkedGuideId = null;

      // Shravan Purnima (August) - Raksha Bandhan
      if (monthIndex === 7) {
        name = "Raksha Bandhan";
        linkedGuideId = RITUAL_GUIDE_LINKS["Raksha Bandhan"];
      }

      await db.vratEntry.create({
        data: {
          name,
          date: dateOnly,
          category: "Purnima",
          description: "Full moon fast and worship",
          linkedGuideId
        }
      });
      vratCount++;
    }

    // 6. Amavasya
    if (tithiNumber === 15 && paksha === "Krishna") {
      await db.vratEntry.create({
        data: {
          name: "Amavasya Vrat",
          date: dateOnly,
          category: "Amavasya",
          description: "New moon day dedicated to ancestors",
        }
      });
      vratCount++;
    }

    // 7. Special Festivals:
    // Hariyali Teej: August Shukla Tritiya (month index 7, paksha Shukla, tithi 3)
    if (monthIndex === 7 && paksha === "Shukla" && tithiNumber === 3) {
      await db.vratEntry.create({
        data: {
          name: "Hariyali Teej",
          date: dateOnly,
          category: "Pradosh",
          description: "Marital devotion and union dedicated to Goddess Parvati",
          linkedGuideId: RITUAL_GUIDE_LINKS["Hariyali Teej"]
        }
      });
      vratCount++;
    }

    // Kajari Teej: August Krishna Tritiya (month index 7, paksha Krishna, tithi 3)
    if (monthIndex === 7 && paksha === "Krishna" && tithiNumber === 3) {
      await db.vratEntry.create({
        data: {
          name: "Kajari Teej",
          date: dateOnly,
          category: "Pradosh",
          description: "Fasting and singing for family well-being",
          linkedGuideId: RITUAL_GUIDE_LINKS["Kajari Teej"]
        }
      });
      vratCount++;
    }

    // Hartalika Teej: September Shukla Tritiya (month index 8, paksha Shukla, tithi 3)
    if (monthIndex === 8 && paksha === "Shukla" && tithiNumber === 3) {
      await db.vratEntry.create({
        data: {
          name: "Hartalika Teej",
          date: dateOnly,
          category: "Pradosh",
          description: "Strictest Teej fast and worship",
          linkedGuideId: RITUAL_GUIDE_LINKS["Hartalika Teej"]
        }
      });
      vratCount++;
    }

    // Nag Panchami: August Shukla Panchami (month index 7, paksha Shukla, tithi 5)
    if (monthIndex === 7 && paksha === "Shukla" && tithiNumber === 5) {
      await db.vratEntry.create({
        data: {
          name: "Nag Panchami",
          date: dateOnly,
          category: "Chaturthi",
          description: "Honoring serpent deities",
          linkedGuideId: RITUAL_GUIDE_LINKS["Nag Panchami"]
        }
      });
      vratCount++;
    }

    // Krishna Janmashtami: September Krishna Ashtami (month index 8, paksha Krishna, tithi 8)
    if (monthIndex === 8 && paksha === "Krishna" && tithiNumber === 8) {
      await db.vratEntry.create({
        data: {
          name: "Krishna Janmashtami",
          date: dateOnly,
          category: "Ekadashi",
          description: "Birth celebration of Lord Krishna",
          linkedGuideId: RITUAL_GUIDE_LINKS["Krishna Janmashtami"]
        }
      });
      vratCount++;
    }

    // Radha Ashtami: September Shukla Ashtami (month index 8, paksha Shukla, tithi 8)
    if (monthIndex === 8 && paksha === "Shukla" && tithiNumber === 8) {
      await db.vratEntry.create({
        data: {
          name: "Radha Ashtami",
          date: dateOnly,
          category: "Ekadashi",
          description: "Birth celebration of Sri Radha Rani",
          linkedGuideId: RITUAL_GUIDE_LINKS["Radha Ashtami"]
        }
      });
      vratCount++;
    }
  }

  console.log(`Success! Seeded ${count} Panchang entries and ${vratCount} Vrat entries for 2026.`);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
