const { getPanchanga, Ephemeris } = require('@bidyashish/panchang');
const timezone = 'Asia/Kolkata';
const lat = 28.6139;
const lon = 77.2090;

function calculateSunriseSunsetNOAA(date, latitude, longitude) {
  const jd = (date.getTime() / 86400000) + 2440587.5;
  const d = jd - 2451545.0;

  const g = (357.529 + 0.98560028 * d) * Math.PI / 180;
  const q = (280.459 + 0.98564736 * d) * Math.PI / 180;
  const L = q + (1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * Math.PI / 180;
  const e = (23.439 - 0.00000036 * d) * Math.PI / 180;
  const dec = Math.asin(Math.sin(e) * Math.sin(L));

  let ra = Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L));
  if (ra < 0) ra += 2 * Math.PI;

  let eqt = q - ra;
  while (eqt < -Math.PI) eqt += 2 * Math.PI;
  while (eqt > Math.PI) eqt -= 2 * Math.PI;

  const transitOffset = 0.5 - (longitude / 360) - (eqt / (2 * Math.PI));
  const h0 = -0.833 * Math.PI / 180;
  const latRad = latitude * Math.PI / 180;
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
    sunset: new Date(baseMs + sunsetFraction * 86400000)
  };
}

// Override
Ephemeris.prototype.calculateSunrise = function(date, location) {
  const result = calculateSunriseSunsetNOAA(date, location.latitude, location.longitude);
  return result ? result.sunrise : new Date(date);
};

Ephemeris.prototype.calculateSunset = function(date, location) {
  const result = calculateSunriseSunsetNOAA(date, location.latitude, location.longitude);
  return result ? result.sunset : new Date(date);
};

// 10 dates to check
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

console.log("Date | Sunrise (NOAA) | Sunset (NOAA) | Tithi | Nakshatra");
console.log("---|---|---|---|---");
for (const dStr of datesToCheck) {
  const d = new Date(dStr + 'T00:00:00Z');
  const p = getPanchanga(d, lat, lon, timezone);
  const sr = new Date(p.sunrise).toLocaleTimeString('en-US', { hour12: true, timeZone: timezone, hour: '2-digit', minute: '2-digit' });
  const ss = new Date(p.sunset).toLocaleTimeString('en-US', { hour12: true, timeZone: timezone, hour: '2-digit', minute: '2-digit' });
  console.log(`${dStr} | ${sr} | ${ss} | ${p.tithi.name} (${p.tithi.paksha}) | ${p.nakshatra.name}`);
}
