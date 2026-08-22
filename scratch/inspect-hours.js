const { getPanchanga } = require('@bidyashish/panchang');
const timezone = 'Asia/Kolkata';
const lat = 28.6139;
const lon = 77.2090;

const hours = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
for (const h of hours) {
  const date = new Date(`2026-09-07T${h.toString().padStart(2, '0')}:00:00.000Z`);
  const p = getPanchanga(date, lat, lon, timezone);
  console.log(`Input hour: ${h} UTC | Sunrise: ${p.sunrise?.toISOString()} | Sunset: ${p.sunset?.toISOString()}`);
}
