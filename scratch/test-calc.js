const { AstronomicalCalculator } = require('@bidyashish/panchang');
const date = new Date('2026-09-07T00:00:00.000Z');
const timezone = 'Asia/Kolkata';

async function test() {
  const calc = new AstronomicalCalculator();
  try {
    const sunrise = await calc.calculateSunrise(date, 28.6139, 77.2090, timezone);
    const sunset = await calc.calculateSunset(date, 28.6139, 77.2090, timezone);
    console.log("Sunrise:", sunrise.toISOString(), "Local:", sunrise.toLocaleString('en-US', { timeZone: timezone }));
    console.log("Sunset:", sunset.toISOString(), "Local:", sunset.toLocaleString('en-US', { timeZone: timezone }));
  } catch (e) {
    console.error("Error:", e);
  } finally {
    calc.cleanup();
  }
}
test();
