// Gochar (planetary transit) engine.
// Calculates current transit planet positions relative to a natal chart,
// and finds precise rasi ingress moments for any planet over a date range.

const swisseph = require('swisseph');
const moment = require('moment-timezone');
const { calculatePlanets, calculateLagna, getJulianDay, RASI_NAMES } = require('./planets');
const { setAyanamsa } = require('./ayanamsa');

// Classical Vedic favorability from natal Moon rasi (houses 1–12)
const FAVORABLE_HOUSES = {
  Sun:     new Set([3, 6, 10, 11]),
  Moon:    new Set([1, 3, 6, 7, 10, 11]),
  Mars:    new Set([3, 6, 11]),
  Mercury: new Set([2, 4, 6, 8, 10, 11]),
  Jupiter: new Set([2, 5, 7, 9, 11]),
  Venus:   new Set([1, 2, 3, 4, 5, 8, 9, 11, 12]),
  Saturn:  new Set([3, 6, 11]),
  Rahu:    new Set([3, 6, 11]),
  Ketu:    new Set([3, 6, 11])
};

const PLANET_IDS = {
  Sun:     swisseph.SE_SUN,
  Moon:    swisseph.SE_MOON,
  Mars:    swisseph.SE_MARS,
  Mercury: swisseph.SE_MERCURY,
  Jupiter: swisseph.SE_JUPITER,
  Venus:   swisseph.SE_VENUS,
  Saturn:  swisseph.SE_SATURN,
  Rahu:    swisseph.SE_MEAN_NODE,
  Ketu:    swisseph.SE_MEAN_NODE
};

// Scan step in days — sized to each planet's typical rasi stay
const SCAN_STEP = {
  Sun: 1, Moon: 0.5, Mars: 1, Mercury: 1,
  Jupiter: 5, Venus: 1, Saturn: 10, Rahu: 10, Ketu: 10
};

const houseFrom = (transitRasiNum, refRasiNum) =>
  ((transitRasiNum - refRasiNum + 12) % 12) + 1;

const getRasiAtJD = (jd, planetId, isKetu, ayanamsa) => {
  setAyanamsa(ayanamsa);
  const result = swisseph.swe_calc_ut(jd, planetId, swisseph.SEFLG_SIDEREAL);
  let lon = result.longitude;
  if (isKetu) lon = (lon + 180) % 360;
  return Math.floor(lon / 30); // 0-indexed rasi (0 = Aries)
};

const jdToLocalDateTime = (jd, timezone) =>
  moment.utc((jd - 2440587.5) * 86400000).tz(timezone).format('YYYY-MM-DD HH:mm');

const calculateGochar = (birthDate, birthTime, latitude, longitude, timezone, transitDate, transitTime, ayanamsa) => {
  const natal = calculatePlanets(birthDate, birthTime, timezone, 'en', ayanamsa);
  const natalLagna = calculateLagna(natal.julDay, latitude, longitude, 'en');
  const natalMoon = natal.positions.find(p => p.planet === 'Moon');

  const transit = calculatePlanets(transitDate, transitTime || '00:00', timezone, 'en', ayanamsa);

  const planets = transit.positions.map(tp => {
    const houseFromMoon  = houseFrom(tp.rasi_number, natalMoon.rasi_number);
    const houseFromLagna = houseFrom(tp.rasi_number, natalLagna.rasi_number);
    return {
      planet:          tp.planet,
      rasi:            tp.rasi,
      rasi_number:     tp.rasi_number,
      degrees:         tp.degrees,
      nakshatra:       tp.nakshatra,
      pada:            tp.pada,
      is_retrograde:   tp.is_retrograde,
      house_from_moon: houseFromMoon,
      house_from_lagna: houseFromLagna,
      favorable:       (FAVORABLE_HOUSES[tp.planet] || new Set()).has(houseFromMoon)
    };
  });

  return {
    natal: {
      moon_rasi:        natalMoon.rasi,
      moon_rasi_number: natalMoon.rasi_number,
      moon_nakshatra:   natalMoon.nakshatra,
      lagna_rasi:       natalLagna.rasi,
      lagna_rasi_number: natalLagna.rasi_number
    },
    transit_date: transitDate,
    transit_time: transitTime || '00:00',
    planets
  };
};

// Find all dates when a planet crosses into a new rasi within a date range.
// Uses binary search to locate the exact ingress moment to ~1-second precision.
const findPlanetIngresses = (planet, fromDate, toDate, timezone, ayanamsa) => {
  const isKetu   = planet === 'Ketu';
  const planetId = PLANET_IDS[planet];
  const step     = SCAN_STEP[planet] || 1;

  const fromJD = getJulianDay(fromDate, '00:00', timezone);
  const toJD   = getJulianDay(toDate,   '23:59', timezone);

  const ingresses = [];
  let jd       = fromJD;
  let prevRasi = getRasiAtJD(jd, planetId, isKetu, ayanamsa);

  while (jd <= toJD) {
    jd += step;
    const scanJD  = Math.min(jd, toJD);
    const currRasi = getRasiAtJD(scanJD, planetId, isKetu, ayanamsa);

    if (currRasi !== prevRasi) {
      // Binary search within [jd - step, scanJD] for the exact crossing
      let lo = jd - step;
      let hi = scanJD;
      for (let i = 0; i < 40; i++) {
        const mid = (lo + hi) / 2;
        getRasiAtJD(mid, planetId, isKetu, ayanamsa) === prevRasi ? (lo = mid) : (hi = mid);
      }
      ingresses.push({
        planet,
        from_rasi: RASI_NAMES.en[prevRasi],
        to_rasi:   RASI_NAMES.en[currRasi],
        datetime:  jdToLocalDateTime((lo + hi) / 2, timezone)
      });
      prevRasi = currRasi;
    }
  }

  return ingresses;
};

module.exports = { calculateGochar, findPlanetIngresses };
