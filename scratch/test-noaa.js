const timezone = 'Asia/Kolkata';
const lat = 28.6139; // Delhi lat
const lon = 77.2090; // Delhi lon

function calculateSunriseSunsetNOAA(date, latitude, longitude) {
  // Convert date to Julian Date (or days since J2000.0)
  // J2000.0 is Jan 1, 2000 at 12:00 UTC.
  const jd = (date.getTime() / 86400000) + 2440587.5;
  const d = jd - 2451545.0; // days since J2000.0

  // 1. Mean anomaly of the Sun
  const g = (357.529 + 0.98560028 * d) * Math.PI / 180;
  // 2. Mean longitude of the Sun
  const q = (280.459 + 0.98564736 * d) * Math.PI / 180;
  // 3. Geocentric ecliptic longitude of the Sun (approximate)
  const L = q + (1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * Math.PI / 180;
  
  // 4. Obliquity of the ecliptic
  const e = (23.439 - 0.00000036 * d) * Math.PI / 180;

  // 5. Sun's declination
  const dec = Math.asin(Math.sin(e) * Math.sin(L));

  // 6. Right ascension of the Sun
  let ra = Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L));
  if (ra < 0) ra += 2 * Math.PI;

  // 7. Equation of time (in radians)
  // EqT = mean_longitude - right_ascension
  // Let's normalize it to [-PI, PI]
  let eqt = q - ra;
  while (eqt < -Math.PI) eqt += 2 * Math.PI;
  while (eqt > Math.PI) eqt -= 2 * Math.PI;

  // 8. Solar noon in UTC (fraction of day)
  // solarNoon = (0.5 - longitude/360 - eqt/(2*PI))
  const lonRad = longitude * Math.PI / 180;
  const transitOffset = 0.5 - (longitude / 360) - (eqt / (2 * Math.PI));
  
  // 9. Hour angle (H) for Sunrise/Sunset
  // cos(H) = (sin(h0) - sin(lat) * sin(dec)) / (cos(lat) * cos(dec))
  // where h0 is -0.833 degrees (refraction and disk size)
  const h0 = -0.833 * Math.PI / 180;
  const latRad = latitude * Math.PI / 180;
  
  const cosH = (Math.sin(h0) - Math.sin(latRad) * Math.sin(dec)) / (Math.cos(latRad) * Math.cos(dec));
  
  if (cosH > 1) {
    // Polar night
    return { sunrise: null, sunset: null };
  }
  if (cosH < -1) {
    // Polar day
    return { sunrise: null, sunset: null };
  }
  
  const H = Math.acos(cosH); // in radians
  const hFraction = H / (2 * Math.PI); // fraction of day
  
  const sunriseFraction = transitOffset - hFraction;
  const sunsetFraction = transitOffset + hFraction;

  // Convert fractions of day to Date objects for the same day
  const dateBase = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const baseMs = dateBase.getTime();

  const sunriseTime = new Date(baseMs + sunriseFraction * 86400000);
  const sunsetTime = new Date(baseMs + sunsetFraction * 86400000);

  return { sunrise: sunriseTime, sunset: sunsetTime };
}

// Test the NOAA calculations
const datesToCheck = [
  '2026-01-15',
  '2026-02-18',
  '2026-03-20',
  '2026-04-14',
  '2026-05-15',
  '2026-06-21',
  '2026-07-25',
  '2026-08-15',
  '2026-09-07',
  '2026-12-21',
];

console.log("Date | Sunrise (NOAA) | Sunset (NOAA)");
console.log("---|---|---");
for (const dStr of datesToCheck) {
  const d = new Date(dStr + 'T00:00:00Z');
  const { sunrise, sunset } = calculateSunriseSunsetNOAA(d, lat, lon);
  const sr = sunrise ? sunrise.toLocaleTimeString('en-US', { hour12: true, timeZone: timezone, hour: '2-digit', minute: '2-digit' }) : 'N/A';
  const ss = sunset ? sunset.toLocaleTimeString('en-US', { hour12: true, timeZone: timezone, hour: '2-digit', minute: '2-digit' }) : 'N/A';
  console.log(`${dStr} | ${sr} | ${ss}`);
}
