const swisseph = require('swisseph');
const { jdToLocalTime } = require('./transit');

const RASI_NAMES_EN = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];

const getLagnaTimings = (julDay, latitude, longitude, timezone) => {
  swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);
  const lagnas = [];
  let searchJd = julDay;
  const houses = swisseph.swe_houses(searchJd, latitude, longitude, 'P');
  const currentLagna = Math.floor(houses.ascendant / 30);
  for(let i = 0; i < 12; i++){
    const rasiIndex = (currentLagna + i) % 12;
    const targetDeg = rasiIndex * 30;
    let startJd = searchJd;
    let endJd = searchJd + 0.1;
    for(let j = 0; j < 1440; j++){
      endJd = startJd + (j+1)/1440;
      const h = swisseph.swe_houses(endJd, latitude, longitude, 'P');
      const lagna = Math.floor(h.ascendant / 30);
      if(lagna !== rasiIndex) break;
    }
    lagnas.push({
      rasi: RASI_NAMES_EN[rasiIndex],
      rasi_number: rasiIndex + 1,
      start_time: jdToLocalTime(startJd, timezone),
      end_time: jdToLocalTime(endJd, timezone)
    });
    searchJd = endJd;
  }
  return lagnas;
};

module.exports = { getLagnaTimings, RASI_NAMES_EN };
