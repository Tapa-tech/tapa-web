const { getPanchanga } = require('@bidyashish/panchang');
const date = new Date('2026-09-07T12:00:00.000Z');
const timezone = 'Asia/Kolkata';
try {
  const p = getPanchanga(date, 28.6139, 77.2090, timezone);
  console.log("Full Panchanga Object:");
  console.log(JSON.stringify(p, null, 2));
} catch (e) {
  console.error("Error:", e);
}
