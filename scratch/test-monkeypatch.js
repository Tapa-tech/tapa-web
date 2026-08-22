const { getPanchanga, Ephemeris } = require('@bidyashish/panchang');
const timezone = 'Asia/Kolkata';
const lat = 28.6139;
const lon = 77.2090;

// Save original methods
const origSunrise = Ephemeris.prototype.calculateSunriseAccurate;
const origSunset = Ephemeris.prototype.calculateSunsetAccurate;

// Implement corrected versions
Ephemeris.prototype.calculateSunriseAccurate = function(date, location) {
  // 1. Force the date to be at 12:00:00 UTC (noon) to make Julian Date an integer
  const noonDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12, 0, 0));
  
  const n = this.dateToJulian(noonDate); // This is an integer, e.g. 2453986.0
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
  // Sunrise hour angle is -k, so local time is m - r - k
  const A = (m - r - k) / (2 * Math.PI); // fractional day in UTC since Greenwich noon
  
  // Normalize A to [0, 1]
  const A_normalized = (A % 1 + 1) % 1;
  // Since Julian Date starts at noon, JD fraction of 0.0 is 12:00 UTC.
  // So UTC hour = (A_normalized + 0.5) % 1.0 * 24
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
  // Sunset hour angle is +k, so local time is m - r + k
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

// Now test for Sep 7, 2026
const testDate = new Date('2026-09-07T00:00:00.000Z');
const p = getPanchanga(testDate, lat, lon, timezone);
console.log("Corrected outputs:");
console.log("Sunrise Local:", new Date(p.sunrise).toLocaleString('en-IN', { timeZone: timezone }));
console.log("Sunset Local:", new Date(p.sunset).toLocaleString('en-IN', { timeZone: timezone }));
