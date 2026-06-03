const swisseph = require('swisseph');

// Shadbala - Six-fold strength of planets
// 1. Sthana Bala (Positional Strength)
const EXALTATION = { Sun:10, Moon:33, Mars:298, Mercury:165, Jupiter:95, Venus:357, Saturn:200 };
const DEBILITATION = { Sun:190, Moon:213, Mars:118, Mercury:345, Jupiter:275, Venus:177, Saturn:20 };
const MOOLTRIKONA = { Sun:[120,140], Moon:[33,54], Mars:[0,12], Mercury:[155,170], Jupiter:[240,260], Venus:[180,195], Saturn:[300,320] };
const OWN_SIGNS = { Sun:[120,150], Moon:[90,120], Mars:[0,30,210,240], Mercury:[150,180], Jupiter:[240,270,330,360], Venus:[180,210], Saturn:[270,300,300,330] };

const getSthanaBala = (planet, longitude) => {
  let strength = 0;
  const exalt = EXALTATION[planet];
  if(exalt !== undefined){
    const diff = Math.abs(longitude - exalt);
    const minDiff = Math.min(diff, 360 - diff);
    if(minDiff <= 10) strength += 60;
    else if(minDiff <= 30) strength += 45;
    else strength += 30;
  }
  return strength;
};

// 2. Dig Bala (Directional Strength)
const DIG_BALA_BEST = { Sun: 270, Moon: 270, Mars: 90, Mercury: 0, Jupiter: 0, Venus: 270, Saturn: 90 };

const getDigBala = (planet, houses) => {
  const bestHouse = DIG_BALA_BEST[planet];
  if(bestHouse === undefined) return 30;
  const lagna = houses.ascendant;
  const bestLong = (lagna + bestHouse) % 360;
  return 30;
};

// Calculate basic Shadbala
const calculateShadbala = (planets, lagna) => {
  const result = [];
  const planetNames = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn'];
  
  planets.filter(p => planetNames.includes(p.planet)).forEach(p => {
    const longitude = (p.rasi_number - 1) * 30 + p.degrees;
    const sthana = getSthanaBala(p.planet, longitude);
    const dig = getDigBala(p.planet, { ascendant: (lagna.rasi_number - 1) * 30 + lagna.degrees });
    const kala = p.is_retrograde ? 30 : 60;
    const total = sthana + dig + kala;
    result.push({
      planet: p.planet,
      sthana_bala: sthana,
      dig_bala: dig,
      kala_bala: kala,
      total_shadbala: total,
      is_strong: total >= 100
    });
  });
  return result;
};

module.exports = { calculateShadbala, getSthanaBala };
