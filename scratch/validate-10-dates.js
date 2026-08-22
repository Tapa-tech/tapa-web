const { getPanchanga, Ephemeris } = require('@bidyashish/panchang');
const timezone = 'Asia/Kolkata';
const lat = 28.6139;
const lon = 77.2090;

// Corrected Ephemeris methods
Ephemeris.prototype.calculateSunriseAccurate = function(date, location) {
  const noonDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12, 0, 0));
  const n = this.dateToJulian(noonDate);
  const t = location.latitude * Math.PI / 180;
  const r = location.longitude * Math.PI / 180;
  const i = n - 2451545;
  const s = (280.46 + 0.9856474 * i) * Math.PI / 180;
  const o = (357.528 + 0.9856003 * i) * Math.PI / 180;
  const l = s + (1.915 * Math.sin(o) + 0.02 * Math.sin(2 * o)) * Math.PI / 180;
  const m = Math.atan2(Math.cos(23.439 * Math.PI / 180) * Math.sin(l), Math.cos(l));
  const c = Math.asin(Math.sin(23.439 * Math.PI / 180) * Math.sin(l));
  const h = -0.8333 * Math.PI / 180;
  const p = (Math.sin(h) - Math.sin(t) * Math.sin(c)) / (Math.cos(t) * Math.cos(c));
  
  if (p > 1) {
    const y = new Date(noonDate);
    y.setUTCHours(6, 0, 0, 0);
    return y;
  }
  if (p < -1) {
    const y = new Date(noonDate);
    y.setUTCHours(0, 0, 0, 0);
    return y;
  }
  
  const k = Math.acos(p);
  const A = (m - r - k) / (2 * Math.PI);
  const A_normalized = (A % 1 + 1) % 1;
  const b = ((A_normalized + 0.5) % 1.0) * 24;
  
  const S = new Date(noonDate);
  const f = Math.floor(b);
  const T = Math.floor((b - f) * 60);
  const N = Math.floor(((b - f) * 60 - T) * 60);
  
  S.setUTCHours(f, T, N, 0);
  return S;
};

Ephemeris.prototype.calculateSunsetAccurate = function(date, location) {
  const noonDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12, 0, 0));
  const n = this.dateToJulian(noonDate);
  const t = location.latitude * Math.PI / 180;
  const r = location.longitude * Math.PI / 180;
  const i = n - 2451545;
  const s = (280.46 + 0.9856474 * i) * Math.PI / 180;
  const o = (357.528 + 0.9856003 * i) * Math.PI / 180;
  const l = s + (1.915 * Math.sin(o) + 0.02 * Math.sin(2 * o)) * Math.PI / 180;
  const m = Math.atan2(Math.cos(23.439 * Math.PI / 180) * Math.sin(l), Math.cos(l));
  const c = Math.asin(Math.sin(23.439 * Math.PI / 180) * Math.sin(l));
  const h = -0.8333 * Math.PI / 180;
  const p = (Math.sin(h) - Math.sin(t) * Math.sin(c)) / (Math.cos(t) * Math.cos(c));
  
  if (p > 1) {
    const y = new Date(noonDate);
    y.setUTCHours(18, 0, 0, 0);
    return y;
  }
  if (p < -1) {
    const y = new Date(noonDate);
    y.setUTCHours(23, 59, 59, 999);
    return y;
  }
  
  const k = Math.acos(p);
  const A = (m - r + k) / (2 * Math.PI);
  const A_normalized = (A % 1 + 1) % 1;
  const b = ((A_normalized + 0.5) % 1.0) * 24;
  
  const S = new Date(noonDate);
  const f = Math.floor(b);
  const T = Math.floor((b - f) * 60);
  const N = Math.floor(((b - f) * 60 - T) * 60);
  
  S.setUTCHours(f, T, N, 0);
  return S;
};

// 10 dates to check (Delhi coordinates)
const datesToCheck = [
  '2026-01-15', // Makar Sankranti period
  '2026-02-18',
  '2026-03-20', // Spring Equinox
  '2026-04-14', // Baisakhi / Solar New Year
  '2026-05-15',
  '2026-06-21', // Summer Solstice
  '2026-07-25',
  '2026-08-15', // Independence Day
  '2026-09-07', // Janmashtami/transition period
  '2026-12-21', // Winter Solstice
];

console.log("Date | Sunrise (Corrected) | Sunset (Corrected) | Tithi | Nakshatra");
console.log("---|---|---|---|---");
for (const dStr of datesToCheck) {
  const d = new Date(dStr + 'T00:00:00Z');
  const p = getPanchanga(d, lat, lon, timezone);
  const sr = new Date(p.sunrise).toLocaleTimeString('en-US', { hour12: true, timeZone: timezone, hour: '2-digit', minute: '2-digit' });
  const ss = new Date(p.sunset).toLocaleTimeString('en-US', { hour12: true, timeZone: timezone, hour: '2-digit', minute: '2-digit' });
  console.log(`${dStr} | ${sr} | ${ss} | ${p.tithi.name} (${p.tithi.paksha}) | ${p.nakshatra.name}`);
}
