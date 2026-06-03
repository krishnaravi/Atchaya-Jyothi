const swisseph = require('swisseph');
const moment = require('moment-timezone');
const { getJulianDay } = require('../astrology/planets');
const { jdToLocalTime, getMoonSunDiff, getMoonLongitude, getSunMoonSum } = require('./transit');

const TITHI_NAMES = ['Prathama','Dvitiya','Tritiya','Chaturthi','Panchami','Shashthi','Saptami','Ashtami','Navami','Dashami','Ekadashi','Dwadashi','Trayodashi','Chaturdashi','Purnima','Prathama','Dvitiya','Tritiya','Chaturthi','Panchami','Shashthi','Saptami','Ashtami','Navami','Dashami','Ekadashi','Dwadashi','Trayodashi','Chaturdashi','Amavasya'];
const NAKSHATRA_NAMES_EN = ['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishta','Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati'];
const YOGA_NAMES_EN = ['Vishkamba','Preeti','Ayushman','Saubhagya','Shobhana','Atiganda','Sukarma','Dhriti','Shula','Ganda','Vriddhi','Dhruva','Vyaghata','Harshana','Vajra','Siddhi','Vyatipata','Variyan','Parigha','Shiva','Siddha','Sadhya','Shubha','Shukla','Brahma','Indra','Vaidhriti'];
const KARANA_NAMES_EN = ['Bava','Balava','Kaulava','Taitila','Gara','Vanija','Vishti','Shakuni','Chatushpada','Naga','Kimstughna'];

const getNakshatraDetails = (julDay, timezone) => {
  swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);
  const moonLong = getMoonLongitude(julDay);
  const nakshatraSize = 360 / 27;
  const index = Math.floor(moonLong / nakshatraSize);
  const pada = Math.floor((moonLong % nakshatraSize) / (nakshatraSize / 4)) + 1;
  const endLong = (index + 1) * nakshatraSize;
  let endJd = julDay;
  for(let i = 0; i < 1440; i++){
    endJd += 1/1440;
    if(getMoonLongitude(endJd) >= endLong) break;
  }
  return { name: NAKSHATRA_NAMES_EN[index], number: index+1, pada, end_time: jdToLocalTime(endJd, timezone) };
};

const getTithiDetails = (julDay, timezone) => {
  const diff = getMoonSunDiff(julDay);
  const index = Math.floor(diff / 12);
  const endDiff = (index + 1) * 12;
  let endJd = julDay;
  for(let i = 0; i < 1440; i++){
    endJd += 1/1440;
    if(getMoonSunDiff(endJd) >= endDiff) break;
  }
  return { name: TITHI_NAMES[index], number: index+1, end_time: jdToLocalTime(endJd, timezone) };
};

const getYogaDetails = (julDay, timezone) => {
  const sum = getSunMoonSum(julDay);
  const yogaSize = 360 / 27;
  const index = Math.floor(sum / yogaSize);
  const endSum = (index + 1) * yogaSize;
  let endJd = julDay;
  for(let i = 0; i < 1440; i++){
    endJd += 1/1440;
    if(getSunMoonSum(endJd) >= endSum) break;
  }
  return { name: YOGA_NAMES_EN[index], number: index+1, end_time: jdToLocalTime(endJd, timezone) };
};

const getKaranaDetails = (julDay, timezone) => {
  const diff = getMoonSunDiff(julDay);
  const index = Math.floor(diff / 6) % 11;
  const endDiff = (Math.floor(diff / 6) + 1) * 6;
  let endJd = julDay;
  for(let i = 0; i < 720; i++){
    endJd += 1/1440;
    if(getMoonSunDiff(endJd) >= endDiff) break;
  }
  return { name: KARANA_NAMES_EN[index], number: index+1, end_time: jdToLocalTime(endJd, timezone) };
};

module.exports = { getNakshatraDetails, getTithiDetails, getYogaDetails, getKaranaDetails };
