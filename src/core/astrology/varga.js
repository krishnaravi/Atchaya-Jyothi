const swisseph = require('swisseph');
const { setAyanamsa } = require('./ayanamsa');

const RASI_NAMES = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];

const getVargaPosition = (longitude, division) => {
  const rasi = Math.floor(longitude / 30);
  const degInRasi = longitude % 30;
  const index = Math.floor(degInRasi / (30 / division));
  return (rasi * division + index) % 12;
};

const getNavamsaPosition = (longitude) => {
  const rasi = Math.floor(longitude / 30);
  const degInRasi = longitude % 30;
  const navamsaIndex = Math.floor(degInRasi / (30/9));
  const startRasi = [0,4,8,0,4,8,0,4,8,0,4,8];
  return (startRasi[rasi] + navamsaIndex) % 12;
};

const getSaptamsaPosition = (longitude) => {
  const rasi = Math.floor(longitude / 30);
  const degInRasi = longitude % 30;
  const index = Math.floor(degInRasi / (30/7));
  const isOdd = rasi % 2 === 0;
  return isOdd ? (rasi + index) % 12 : (rasi + 6 + index) % 12;
};

const getDashamsaPosition = (longitude) => {
  const rasi = Math.floor(longitude / 30);
  const degInRasi = longitude % 30;
  const index = Math.floor(degInRasi / 3);
  const isOdd = rasi % 2 === 0;
  return isOdd ? (rasi + index) % 12 : (rasi + 9 + index) % 12;
};

const calculateVargaCharts = (planets, ayanamsa='lahiri') => {
  setAyanamsa(ayanamsa);
  const varga = { D1:[], D2:[], D3:[], D4:[], D6:[], D7:[], D8:[], D9:[], D10:[], D11:[], D12:[], D16:[], D20:[], D24:[], D27:[], D30:[], D40:[], D45:[], D60:[], D81:[], D108:[], D120:[], D144:[] };
  planets.forEach(p => {
    const long = (p.rasi_number - 1) * 30 + p.degrees;
    const pos = (d) => ({ planet: p.planet, rasi_number: getVargaPosition(long, d)+1, rasi: RASI_NAMES[getVargaPosition(long, d)] });
    varga.D1.push({ planet: p.planet, rasi: p.rasi, rasi_number: p.rasi_number });
    varga.D2.push(pos(2));
    varga.D3.push(pos(3));
    varga.D4.push(pos(4));
    varga.D6.push(pos(6));
    varga.D7.push({ planet: p.planet, rasi_number: getSaptamsaPosition(long)+1, rasi: RASI_NAMES[getSaptamsaPosition(long)] });
    varga.D8.push(pos(8));
    varga.D9.push({ planet: p.planet, rasi_number: getNavamsaPosition(long)+1, rasi: RASI_NAMES[getNavamsaPosition(long)] });
    varga.D10.push({ planet: p.planet, rasi_number: getDashamsaPosition(long)+1, rasi: RASI_NAMES[getDashamsaPosition(long)] });
    varga.D11.push(pos(11));
    varga.D12.push(pos(12));
    varga.D16.push(pos(16));
    varga.D20.push(pos(20));
    varga.D24.push(pos(24));
    varga.D27.push(pos(27));
    varga.D30.push(pos(30));
    varga.D40.push(pos(40));
    varga.D45.push(pos(45));
    varga.D60.push(pos(60));
    varga.D81.push(pos(81));
    varga.D108.push(pos(108));
    varga.D120.push(pos(120));
    varga.D144.push(pos(144));
  });
  return varga;
};

module.exports = { calculateVargaCharts, getNavamsaPosition, RASI_NAMES };
