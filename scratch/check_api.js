const { getPanchanga } = require('@bidyashish/panchang');

const date = new Date('2026-09-07T00:00:00.000Z');
const timezone = 'Asia/Kolkata';

try {
  const p = getPanchanga(date, 28.6139, 77.2090, timezone);
  console.log("Input Date:", date.toISOString());
  console.log("Sunrise UTC:", p.sunrise.toISOString(), "Local:", p.sunrise.toLocaleString('en-US', { timeZone: timezone }));
  console.log("Sunset UTC:", p.sunset.toISOString(), "Local:", p.sunset.toLocaleString('en-US', { timeZone: timezone }));
} catch (e) {
  console.error("Error:", e);
}
