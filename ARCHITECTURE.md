# Architecture — Panchang Data Integration

This document outlines the architecture for the dynamic Panchang data integration in TAPA.

## Data Source Strategy

We selected **Option B** (Self-hosted npm calculation library: `@bidyashish/panchang`) for the following reasons:
1. **Zero External API Cost**: No recurring API subscription costs (DivineAPI/Vedika require paid plans).
2. **Offline Resilience**: The calculation runs entirely in-process in Node.js, removing runtime dependency on third-party API availability.
3. **Swiss Ephemeris Accuracy**: The library uses the high-precision Swiss Ephemeris for astronomical body positions (Tithi, Nakshatra, Yoga, Karana).

## Astronomical Calculation Corrections

During evaluation of the `@bidyashish/panchang` library, a major bug was identified in its internal sunrise/sunset manual formula:
- The library calculation was offset by **up to 12 hours depending on the season** (e.g. sunrise at 5 PM in September) and shifted dynamically based on the UTC hour of the input Date object.
- Because Tithi, Nakshatra, and other variables are calculated exactly at the time of sunrise, this caused downstream Panchang attributes to be calculated at the wrong times (often a full day off).

### The Fix: NOAA Solar Calculator Monkeypatch
To resolve this, we override the `Ephemeris` prototype methods at runtime using the standard NOAA Solar Calculator algorithm. This algorithm accurately computes the Equation of Time and Hour Angle to find the true UTC transit, sunrise, and sunset times.

By forcing the date reference to local noon (to maintain integer Julian Days) and correcting the Julian-to-UTC time mapping, the calculations match reference data (e.g. Drik Panchang) to within a 1-minute tolerance.
