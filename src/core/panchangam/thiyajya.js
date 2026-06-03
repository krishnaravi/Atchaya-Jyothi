const { getMoonLongitude, jdToLocalTime } = require('./transit');

// Thiyajya - inauspicious period based on Nakshatra
// Each nakshatra has specific thiyajya ghatis from start
const THIYAJYA_GHATIS = {
  1:  [50,56], 2:  [13,19], 3:  [26,32], 4:  [26,32],
  5:  [4,10],  6:  [16,22], 7:  [20,26], 8:  [6,12],
  9:  [10,16], 10: [4,10],  11: [50,56], 12: [16,22],
  13: [26,32], 14: [4,10],  15: [6,12],  16: [46,52],
  17: [16,22], 18: [50,56], 19: [6,12],  20: [30,36],
  21: [16,22], 22: [4,10],  23: [26,32], 24: [14,20],
  25: [10,16], 26: [16,22], 27: [6,12]
};

const getThiyajyaTime = (nakshatraNumber, nakshatraStartJd, nakshatraEndJd, timezone) => {
  const ghatis = THIYAJYA_GHATIS[nakshatraNumber];
  if(!ghatis) return null;
  const totalDuration = nakshatraEndJd - nakshatraStartJd;
  const ghatiDuration = totalDuration / 60;
  const startJd = nakshatraStartJd + ghatis[0] * ghatiDuration;
  const endJd = nakshatraStartJd + ghatis[1] * ghatiDuration;
  return {
    start: jdToLocalTime(startJd, timezone),
    end: jdToLocalTime(endJd, timezone),
    nakshatra_number: nakshatraNumber
  };
};

// Tithi Thiyajya
const TITHI_THIYAJYA = {
  1:[26,30], 2:[46,50], 3:[16,20], 4:[56,60], 5:[36,40],
  6:[6,10],  7:[36,40], 8:[16,20], 9:[56,60], 10:[6,10],
  11:[26,30],12:[46,50],13:[16,20],14:[56,60],15:[36,40],
  16:[26,30],17:[46,50],18:[16,20],19:[56,60],20:[36,40],
  21:[6,10], 22:[36,40],23:[16,20],24:[56,60],25:[6,10],
  26:[26,30],27:[46,50],28:[16,20],29:[56,60],30:[36,40]
};

const getTithiThiyajya = (tithiNumber, tithiStartJd, tithiEndJd, timezone) => {
  const ghatis = TITHI_THIYAJYA[tithiNumber];
  if(!ghatis) return null;
  const totalDuration = tithiEndJd - tithiStartJd;
  const ghatiDuration = totalDuration / 60;
  const startJd = tithiStartJd + ghatis[0] * ghatiDuration;
  const endJd = tithiStartJd + ghatis[1] * ghatiDuration;
  return {
    start: jdToLocalTime(startJd, timezone),
    end: jdToLocalTime(endJd, timezone),
    tithi_number: tithiNumber
  };
};

module.exports = { getThiyajyaTime, getTithiThiyajya };
