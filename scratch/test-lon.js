const { getPanchanga } = require('@bidyashish/panchang');
const date = new Date('2026-09-07T00:00:00.000Z');
const timezone = 'Asia/Kolkata';
try {
  // Let's test with longitude = -77.2090 (if West is positive)
  const p1 = getPanchanga(date, 28.6139, -77.2090, timezone);
  console.log("Testing with negative longitude (-77.2090):");
  console.log("Sunrise UTC:", p1.sunrise?.toISOString());
  console.log("Sunset UTC:", p1.sunset?.toISOString());

  // Let's test with longitude = 77.2090 (if East is positive)
  const p2 = getPanchanga(date, 28.6139, 77.2090, timezone);
  console.log("\nTesting with positive longitude (77.2090):");
  console.log("Sunrise UTC:", p2.sunrise?.toISOString());
  console.log("Sunset UTC:", p2.sunset?.toISOString());
} catch (e) {
  console.error("Error:", e);
}
