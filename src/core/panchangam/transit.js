const swisseph = require('swisseph');
const moment = require('moment-timezone');
const { getJulianDay } = require('../astrology/planets');

// Find exact time when a value crosses a boundary
const findTransitTime = (julDay, targetValue, getValueFn, tolerance=0.0001) => {
  let low = julDay;
  let high = julDay + 1;
  for(let i = 0; i < 50; i++){
    const mid = (low + high) / 2;
    const val = getValueFn(mid);
    if(Math.abs(val - targetValue) < tolerance) return mid;
    if(val < targetValue) low = mid;
    else high = mid;
  }
  return (low + high) / 2;
};

const jdToLocalTime = (jd, timezone) => {
  return moment.utc((jd - 2440587.5) * 86400000).tz(timezone).format('HH:mm');
};

const jdToLocalDateTime = (jd, timezone) => {
  return moment.utc((jd - 2440587.5) * 86400000).tz(timezone).format('YYYY-MM-DD HH:mm');
};

// Get Moon-Sun difference
const getMoonSunDiff = (julDay) => {
  swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);
  const sun = swisseph.swe_calc_ut(julDay, swisseph.SE_SUN, swisseph.SEFLG_SIDEREAL);
  const moon = swisseph.swe_calc_ut(julDay, swisseph.SE_MOON, swisseph.SEFLG_SIDEREAL);
  let diff = moon.longitude - sun.longitude;
  if(diff < 0) diff += 360;
  return diff;
};

// Get Moon longitude
const getMoonLongitude = (julDay) => {
  swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);
  const moon = swisseph.swe_calc_ut(julDay, swisseph.SE_MOON, swisseph.SEFLG_SIDEREAL);
  return moon.longitude;
};

// Get Sun+Moon sum for Yoga
const getSunMoonSum = (julDay) => {
  swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);
  const sun = swisseph.swe_calc_ut(julDay, swisseph.SE_SUN, swisseph.SEFLG_SIDEREAL);
  const moon = swisseph.swe_calc_ut(julDay, swisseph.SE_MOON, swisseph.SEFLG_SIDEREAL);
  return (sun.longitude + moon.longitude) % 360;
};

module.exports = { findTransitTime, jdToLocalTime, jdToLocalDateTime, getMoonSunDiff, getMoonLongitude, getSunMoonSum };
