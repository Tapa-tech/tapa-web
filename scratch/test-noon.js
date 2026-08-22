const { getPanchanga } = require('@bidyashish/panchang');
const timezone = 'Asia/Kolkata';
const lat = 28.6139;
const lon = 77.2090;

const testDates = [
  '2026-09-07',
  '2026-01-01',
  '2026-06-21',
  '2026-12-25'
];

for (const dStr of testDates) {
  // Set date to local noon (06:30:00 UTC)
  const date = new Date(`${dStr}T06:30:00.000Z`);
  const p = getPanchanga(date, lat, lon, timezone);
  
  // Format the outputs to local time strings
  const sunriseStr = p.sunrise ? new Date(p.sunrise).toLocaleString('en-IN', { timeZone: timezone }) : 'N/A';
  const sunsetStr = p.sunset ? new Date(p.sunset).toLocaleString('en-IN', { timeZone: timezone }) : 'N/A';
  
  console.log(`Date: ${dStr} (Input: ${date.toISOString()})`);
  console.log(`  Tithi: ${p.tithi.name} | Paksha: ${p.tithi.paksha}`);
  console.log(`  Nakshatra: ${p.nakshatra.name}`);
  console.log(`  Sunrise: ${sunriseStr}`);
  console.log(`  Sunset: ${sunsetStr}`);
}
