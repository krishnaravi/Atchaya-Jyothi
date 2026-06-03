const moment = require('moment-timezone');

const MUHURTHAM_NAMES = [
  'Rudra','Ahi','Mitra','Pitru','Vasu','Vara','Vishwedeva',
  'Vidhi','Satamukhi','Puruhuta','Vahini','Naktanakara',
  'Varuna','Aryama','Bhaga','Girisha','Ajapada','Ahirbudhnya',
  'Pushya','Ashwini','Yama','Agni','Vidhatr','Kanda',
  'Aditi','Jiva','Vishnu','Dyumadgadyuti','Brahma','Samudram'
];

const DAY_MUHURTHAM = {
  0: [1,6,7,14,15,21,22,29,30],
  1: [2,6,10,14,18,22,26,30],
  2: [1,5,9,13,17,21,25,29],
  3: [3,7,11,15,19,23,27],
  4: [2,6,10,14,18,22,26,30],
  5: [4,8,12,16,20,24,28],
  6: [1,5,9,13,17,21,25,29]
};

const VARASOOLAI = {
  0: 'West', 1: 'North', 2: 'East', 3: 'South',
  4: 'West', 5: 'East', 6: 'South'
};

const NETHRAM = {
  0: 'Sun', 1: 'Moon', 2: 'Mars', 3: 'Mercury',
  4: 'Jupiter', 5: 'Venus', 6: 'Saturn'
};

const JEEVAN = {
  0: 'Saturn', 1: 'Jupiter', 2: 'Mars', 3: 'Sun',
  4: 'Venus', 5: 'Mercury', 6: 'Moon'
};

const getMuhurthamTimings = (dateStr, sunrise, sunset, dayOfWeek) => {
  const sunriseMin = parseInt(sunrise.split(':')[0])*60 + parseInt(sunrise.split(':')[1]);
  const sunsetMin = parseInt(sunset.split(':')[0])*60 + parseInt(sunset.split(':')[1]);
  const totalMin = sunsetMin - sunriseMin;
  const muhurthamMin = totalMin / 30;
  const muhurthams = [];
  for(let i = 0; i < 30; i++){
    const startMin = sunriseMin + i * muhurthamMin;
    const endMin = startMin + muhurthamMin;
    const toTime = (m) => Math.floor(m/60).toString().padStart(2,'0') + ':' + Math.round(m%60).toString().padStart(2,'0');
    muhurthams.push({
      number: i+1,
      name: MUHURTHAM_NAMES[i],
      start: toTime(startMin),
      end: toTime(endMin),
      is_good: DAY_MUHURTHAM[dayOfWeek] ? !DAY_MUHURTHAM[dayOfWeek].includes(i+1) : true
    });
  }
  return muhurthams;
};

const getDaySpecials = (dayOfWeek) => ({
  varasoolai: VARASOOLAI[dayOfWeek],
  nethram: NETHRAM[dayOfWeek],
  jeevan: JEEVAN[dayOfWeek]
});

module.exports = { getMuhurthamTimings, getDaySpecials, VARASOOLAI, NETHRAM, JEEVAN };
