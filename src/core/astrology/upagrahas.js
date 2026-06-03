const swisseph = require('swisseph');
const moment = require('moment-timezone');

// Upagraha lords for each weekday
const DAY_LORDS = {
  0: 'Sun', 1: 'Moon', 2: 'Mars', 3: 'Mercury',
  4: 'Jupiter', 5: 'Venus', 6: 'Saturn'
};

// Gulika starts at which part of day (8 parts)
const GULIKA_PART = { 0:6, 1:5, 2:4, 3:3, 4:2, 5:1, 6:0 };
const MANDI_PART  = { 0:7, 1:6, 2:5, 3:4, 4:3, 5:2, 6:1 };

const getUpagrahaLongitude = (julDay, part, sunrise, sunset, timezone) => {
  const sunriseMin = parseInt(sunrise.split(':')[0])*60 + parseInt(sunrise.split(':')[1]);
  const sunsetMin  = parseInt(sunset.split(':')[0])*60 + parseInt(sunset.split(':')[1]);
  const dayDuration = sunsetMin - sunriseMin;
  const partDuration = dayDuration / 8;
  const startMin = sunriseMin + part * partDuration;
  const midMin   = startMin + partDuration / 2;

  // Convert to JD
  
  const midJd = julDay + (midMin - sunriseMin) / 1440;

  swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);
  const moon = swisseph.swe_calc_ut(midJd, swisseph.SE_MOON, swisseph.SEFLG_SIDEREAL);
  return moon.longitude;
};

const RASI_NAMES = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const NAKSHATRA_NAMES = ['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishta','Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati'];

const calculateUpagrahas = (julDay, dayOfWeek, sunrise, sunset, timezone) => {
  const gulikaPart = GULIKA_PART[dayOfWeek];
  const mandiPart  = MANDI_PART[dayOfWeek];

  const gulikaLong = getUpagrahaLongitude(julDay, gulikaPart, sunrise, sunset, timezone);
  const mandiLong  = getUpagrahaLongitude(julDay, mandiPart,  sunrise, sunset, timezone);

  const toUpagraha = (long, name) => ({
    planet: name,
    longitude: long,
    rasi_number: Math.floor(long/30) + 1,
    rasi: RASI_NAMES[Math.floor(long/30)],
    degrees: parseFloat((long % 30).toFixed(4)),
    nakshatra: NAKSHATRA_NAMES[Math.floor(long/(360/27))],
    pada: Math.floor((long % (360/27)) / (360/27/4)) + 1,
    is_retrograde: false
  });

  return [
    toUpagraha(gulikaLong, 'Gulika'),
    toUpagraha(mandiLong,  'Mandi')
  ];
};

module.exports = { calculateUpagrahas, DAY_LORDS };
