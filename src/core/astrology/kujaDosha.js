// Kuja (Mangal / Chevvai) Dosha calculation.
//
// Inputs follow the same shape used across this module:
//   planets : [{ planet, rasi_number:1..12, degrees, is_retrograde }, ...]
//   lagna   : { rasi_number:1..12, degrees, rasi }
//
// Checks Mars position from three reference points (Lagna, Moon, Venus).
// Primary dosha is from Lagna; Moon and Venus are secondary references.

const RASI_NAMES = [
  'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'
];

// Traditional Kuja Dosha houses
const DOSHA_HOUSES = new Set([1, 2, 4, 7, 8, 12]);

// Severity by house (before checking dosha_count)
const HOUSE_SEVERITY = { 7:'High', 8:'High', 1:'Medium', 4:'Medium', 2:'Low', 12:'Low' };

// Jupiter special aspects (in addition to universal 7th)
const JUPITER_ASPECTS = new Set([5, 7, 9]);

const houseOf = (planetRasi, refRasi) => (planetRasi - refRasi + 12) % 12 + 1;

const rasi = (n) => RASI_NAMES[n - 1]; // 1-indexed → name

const getCancellations = (marsRasi, houseFromLagna, planets) => {
  const found = [];

  // Mars in own sign (Aries=1, Scorpio=8)
  if (marsRasi === 1 || marsRasi === 8)
    found.push(`Mars in own sign (${rasi(marsRasi)}) — dosha neutralised`);

  // Mars exalted in Capricorn
  if (marsRasi === 10)
    found.push('Mars exalted in Capricorn — dosha neutralised');

  // House-specific sign exceptions (classical South Indian rules)
  if (houseFromLagna === 2 && (marsRasi === 3 || marsRasi === 6))
    found.push(`Mars in 2nd house in ${rasi(marsRasi)} (Mercury sign) — dosha cancelled`);

  if (houseFromLagna === 4 && marsRasi === 4)
    found.push('Mars in 4th house in Cancer (Moon sign / own house lord) — dosha cancelled');

  if (houseFromLagna === 7 && (marsRasi === 10 || marsRasi === 4))
    found.push(`Mars in 7th house in ${rasi(marsRasi)} (${marsRasi === 10 ? 'exalted' : 'debilitated'}) — dosha cancelled`);

  if (houseFromLagna === 8 && (marsRasi === 9 || marsRasi === 12))
    found.push(`Mars in 8th house in ${rasi(marsRasi)} (Jupiter sign) — dosha cancelled`);

  if (houseFromLagna === 12 && (marsRasi === 2 || marsRasi === 7))
    found.push(`Mars in 12th house in ${rasi(marsRasi)} (Venus sign) — dosha cancelled`);

  // Jupiter aspects Mars — benefic protection
  const jupiter = planets.find(p => p.planet === 'Jupiter');
  if (jupiter) {
    const jupiterToMars = houseOf(marsRasi, jupiter.rasi_number);
    if (JUPITER_ASPECTS.has(jupiterToMars))
      found.push(`Jupiter aspects Mars from ${rasi(jupiter.rasi_number)} — dosha reduced`);
  }

  return found;
};

const calculateKujaDosha = (planets, lagna) => {
  const mars  = planets.find(p => p.planet === 'Mars');
  const moon  = planets.find(p => p.planet === 'Moon');
  const venus = planets.find(p => p.planet === 'Venus');

  const marsRasi  = mars.rasi_number;
  const lagnaRasi = lagna.rasi_number;

  const houseFromLagna  = houseOf(marsRasi, lagnaRasi);
  const houseFromMoon   = houseOf(marsRasi, moon.rasi_number);
  const houseFromVenus  = houseOf(marsRasi, venus.rasi_number);

  const doshaFromLagna  = DOSHA_HOUSES.has(houseFromLagna);
  const doshaFromMoon   = DOSHA_HOUSES.has(houseFromMoon);
  const doshaFromVenus  = DOSHA_HOUSES.has(houseFromVenus);

  const cancellations = doshaFromLagna
    ? getCancellations(marsRasi, houseFromLagna, planets)
    : [];
  const is_cancelled = cancellations.length > 0;

  const dosha_count = [doshaFromLagna, doshaFromMoon, doshaFromVenus].filter(Boolean).length;
  const has_dosha   = doshaFromLagna && !is_cancelled;

  // Severity escalates when multiple reference points show dosha
  let severity = null;
  if (has_dosha) {
    severity = HOUSE_SEVERITY[houseFromLagna];
    if (dosha_count === 3) severity = 'Very High';
    else if (dosha_count === 2 && severity === 'High') severity = 'Very High';
  }

  return {
    has_dosha,
    mars_position: {
      rasi:        rasi(marsRasi),
      rasi_number: marsRasi,
      house:       houseFromLagna,
      degrees:     parseFloat(mars.degrees.toFixed(4))
    },
    checks: {
      from_lagna: { house: houseFromLagna, dosha: doshaFromLagna },
      from_moon:  { house: houseFromMoon,  dosha: doshaFromMoon  },
      from_venus: { house: houseFromVenus, dosha: doshaFromVenus }
    },
    dosha_count,
    severity,
    cancellations,
    is_cancelled
  };
};

module.exports = { calculateKujaDosha };
