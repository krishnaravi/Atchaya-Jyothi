const { calculatePanchangam } = require('../panchangam/panchangam');
const { calculatePlanets } = require('../astrology/planets');

const MUHURTHAM_RULES = {
  marriage: {
    suitable_tithis: [2,3,5,7,10,11,13],
    unsuitable_tithis: [1,4,6,8,9,12,14,15,30],
    suitable_nakshatras: [3,4,6,7,8,11,12,13,15,17,20,21,22,23,25,26,27],
    unsuitable_nakshatras: [1,2,5,9,10,14,16,18,19,24],
    suitable_days: [1,2,3,4,5],
    unsuitable_days: [0,6],
    avoid_rahu_kalam: true,
    avoid_yamagandam: true,
    avoid_gulikai: true
  },
  house_warming: {
    suitable_tithis: [2,3,5,7,10,11,13],
    unsuitable_tithis: [4,6,8,9,14,15,30],
    suitable_nakshatras: [3,4,6,7,8,11,12,13,15,17,20,21,22,25,26,27],
    unsuitable_nakshatras: [1,2,5,9,10,14,16,18,19,24],
    suitable_days: [1,3,4,5],
    unsuitable_days: [0,2,6],
    avoid_rahu_kalam: true,
    avoid_yamagandam: true,
    avoid_gulikai: false
  },
  vehicle: {
    suitable_tithis: [2,3,5,7,10,11,12,13],
    unsuitable_tithis: [4,6,8,9,14,15,30],
    suitable_nakshatras: [3,4,6,7,8,11,12,13,15,17,20,21,22,25,26,27],
    unsuitable_nakshatras: [1,2,5,9,10,14,16,18,19,24],
    suitable_days: [1,2,3,4,5],
    unsuitable_days: [0,6],
    avoid_rahu_kalam: true,
    avoid_yamagandam: false,
    avoid_gulikai: false
  },
  business: {
    suitable_tithis: [2,3,5,7,10,11,13],
    unsuitable_tithis: [4,6,8,9,14,15,30],
    suitable_nakshatras: [3,4,6,7,8,11,12,13,15,17,20,21,22,25,26,27],
    unsuitable_nakshatras: [1,2,5,9,10,14,16,18,19,24],
    suitable_days: [1,2,3,4,5],
    unsuitable_days: [0,6],
    avoid_rahu_kalam: true,
    avoid_yamagandam: true,
    avoid_gulikai: false
  },
  education: {
    suitable_tithis: [2,3,5,7,10,11,13],
    unsuitable_tithis: [4,6,8,9,14,15,30],
    suitable_nakshatras: [3,4,6,7,8,11,12,13,15,17,20,21,22,25,26,27],
    unsuitable_nakshatras: [1,2,5,9,10,14,16,18,19,24],
    suitable_days: [1,2,3,4,5],
    unsuitable_days: [0,6],
    avoid_rahu_kalam: true,
    avoid_yamagandam: false,
    avoid_gulikai: false
  }
};
const checkMuhurtham = (panchangam, occasionType, time) => {
  const rules = MUHURTHAM_RULES[occasionType];
  if(!rules) return { suitable: false, reason: 'Unknown occasion type' };
  const reasons = [];
  const good_points = [];
  const tithi = panchangam.tithi_number;
  const nakshatra = panchangam.nakshatra_number;
  const dayOfWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].indexOf(panchangam.day);
  if(rules.unsuitable_tithis.includes(tithi)){ reasons.push('Unsuitable Tithi: ' + panchangam.tithi); }
  else if(rules.suitable_tithis.includes(tithi)){ good_points.push('Suitable Tithi: ' + panchangam.tithi); }
  if(rules.unsuitable_nakshatras.includes(nakshatra)){ reasons.push('Unsuitable Nakshatra: ' + nakshatra); }
  else if(rules.suitable_nakshatras.includes(nakshatra)){ good_points.push('Suitable Nakshatra: ' + nakshatra); }
  if(rules.unsuitable_days.includes(dayOfWeek)){ reasons.push('Unsuitable Day: ' + panchangam.day); }
  else if(rules.suitable_days.includes(dayOfWeek)){ good_points.push('Suitable Day: ' + panchangam.day); }
  if(time && rules.avoid_rahu_kalam){
    const rk = panchangam.rahu_kalam;
    if(time >= rk.start && time <= rk.end){ reasons.push('Time falls in Rahu Kalam: ' + rk.start + '-' + rk.end); }
  }
  if(time && rules.avoid_yamagandam){
    const yg = panchangam.yamagandam;
    if(time >= yg.start && time <= yg.end){ reasons.push('Time falls in Yamagandam: ' + yg.start + '-' + yg.end); }
  }
  if(time && rules.avoid_gulikai){
    const gl = panchangam.gulikai;
    if(time >= gl.start && time <= gl.end){ reasons.push('Time falls in Gulikai: ' + gl.start + '-' + gl.end); }
  }
  const suitable = reasons.length === 0;
  const score = good_points.length;
  return { suitable, score, good_points, reasons };
};

const findMuhurthamDates = (startDate, endDate, occasionType, latitude, longitude, timezone, lang) => {
  const results = [];
  let current = new Date(startDate);
  const end = new Date(endDate);
  while(current <= end){
    const dateStr = current.toISOString().split('T')[0];
    const panchangam = calculatePanchangam(dateStr, latitude, longitude, timezone, lang||'en');
    const check = checkMuhurtham(panchangam, occasionType, null);
    if(check.suitable){
      results.push({ date: dateStr, day: panchangam.day, tithi: panchangam.tithi, nakshatra: panchangam.nakshatra_number, yoga: panchangam.yoga, score: check.score, good_points: check.good_points, rahu_kalam: panchangam.rahu_kalam, yamagandam: panchangam.yamagandam });
    }
    current.setDate(current.getDate() + 1);
  }
  return results;
};

module.exports = { checkMuhurtham, findMuhurthamDates, MUHURTHAM_RULES };
