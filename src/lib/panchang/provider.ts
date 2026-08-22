import * as PanchangLib from "@bidyashish/panchang";
const { getPanchanga, Ephemeris } = PanchangLib as any;

export interface PanchangData {
  tithi: string;
  tithiSub: string;
  paksha: string;
  pakshaSub: string;
  nakshatra: string;
  nakshatraSub?: string | null;
  sunrise: string;
  sunset?: string | null;
}

const CITY_COORDINATES: Record<string, { lat: number; lon: number; timezone: string }> = {
  "Delhi-NCR": { lat: 28.6139, lon: 77.2090, timezone: "Asia/Kolkata" },
};

// Auspicious nakshatras according to standard Vedic astrology
const AUSPICIOUS_NAKSHATRAS = new Set([
  "Ashwini",
  "Rohini",
  "Mrigashira",
  "Pushya",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Anuradha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishtha",
  "Shatabhisha",
  "Uttara Bhadrapada",
  "Revati",
]);

function getOrdinalSuffix(n: number): string {
  if (n >= 11 && n <= 13) return "th";
  switch (n % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

// NOAA Solar Calculator algorithm for precise sunrise and sunset times
function calculateSunriseSunsetNOAA(date: Date, latitude: number, longitude: number) {
  // Convert date to Julian Date and find days since J2000.0
  const jd = date.getTime() / 86400000 + 2440587.5;
  const d = jd - 2451545.0; // days since J2000.0

  // 1. Mean anomaly of the Sun
  const g = ((357.529 + 0.98560028 * d) * Math.PI) / 180;
  // 2. Mean longitude of the Sun
  const q = ((280.459 + 0.98564736 * d) * Math.PI) / 180;
  // 3. Geocentric ecliptic longitude of the Sun (approximate)
  const L = q + (1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * Math.PI / 180;

  // 4. Obliquity of the ecliptic
  const e = ((23.439 - 0.00000036 * d) * Math.PI) / 180;

  // 5. Sun's declination
  const dec = Math.asin(Math.sin(e) * Math.sin(L));

  // 6. Right ascension of the Sun
  let ra = Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L));
  if (ra < 0) ra += 2 * Math.PI;

  // 7. Equation of time
  let eqt = q - ra;
  while (eqt < -Math.PI) eqt += 2 * Math.PI;
  while (eqt > Math.PI) eqt -= 2 * Math.PI;

  // 8. Solar noon in UTC
  const transitOffset = 0.5 - longitude / 360 - eqt / (2 * Math.PI);

  // 9. Hour angle (H) for Sunrise/Sunset
  const h0 = (-0.833 * Math.PI) / 180; // standard refraction + disk size
  const latRad = (latitude * Math.PI) / 180;

  const cosH = (Math.sin(h0) - Math.sin(latRad) * Math.sin(dec)) / (Math.cos(latRad) * Math.cos(dec));

  if (cosH > 1 || cosH < -1) {
    return null; // Polar night / polar day
  }

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

// Apply runtime monkeypatching to fix the library's buggy astronomical calculations
if (typeof Ephemeris !== "undefined") {
  Ephemeris.prototype.calculateSunrise = function (date: Date, location: { latitude: number; longitude: number }) {
    const result = calculateSunriseSunsetNOAA(date, location.latitude, location.longitude);
    return result ? result.sunrise : new Date(date);
  };

  Ephemeris.prototype.calculateSunset = function (date: Date, location: { latitude: number; longitude: number }) {
    const result = calculateSunriseSunsetNOAA(date, location.latitude, location.longitude);
    return result ? result.sunset : new Date(date);
  };
}

export async function fetchPanchangData(date: Date, city: string): Promise<PanchangData> {
  const coords = CITY_COORDINATES[city] || CITY_COORDINATES["Delhi-NCR"];
  
  // Standardize target date to midnight of that day in UTC
  const targetDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

  // Call the library synchronously (it returns a promise in types but synchronously returns object)
  const p = await (getPanchanga(targetDate, coords.lat, coords.lon, coords.timezone) as any);

  if (!p) {
    throw new Error(`Failed to calculate Panchang data for date ${targetDate.toISOString()}`);
  }

  // Format sunrise/sunset to standard local time "HH:MM" (e.g. "05:28")
  const formatTime = (d: Date | string) => {
    const dateObj = typeof d === "string" ? new Date(d) : d;
    return dateObj.toLocaleTimeString("en-US", {
      timeZone: coords.timezone,
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const sunrise = formatTime(p.sunrise);
  const sunset = p.sunset ? formatTime(p.sunset) : null;

  const tithiName = p.tithi.name;
  const tithiNumber = p.tithi.number;
  const tithiSub = `${tithiNumber}${getOrdinalSuffix(tithiNumber)} day`;

  const paksha = p.tithi.paksha; // "Shukla" or "Krishna"
  const pakshaSub = paksha === "Shukla" ? "Waxing moon" : "Waning moon";

  const nakshatraName = p.nakshatra.name;
  const nakshatraSub = AUSPICIOUS_NAKSHATRAS.has(nakshatraName) ? "Auspicious" : null;

  return {
    tithi: tithiName,
    tithiSub,
    paksha,
    pakshaSub,
    nakshatra: nakshatraName,
    nakshatraSub,
    sunrise,
    sunset,
  };
}
