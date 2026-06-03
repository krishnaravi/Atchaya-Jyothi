const NAKSHATRA_NAMES = [
  'Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra',
  'Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni',
  'Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha',
  'Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishtha',
  'Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati'
];

const RASI_NAMES = [
  'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'
];

// Gana: Deva / Manushya / Rakshasa for each nakshatra (0–26)
const GANA = [
  'Deva','Manushya','Rakshasa','Manushya','Deva','Manushya',
  'Deva','Deva','Rakshasa','Rakshasa','Manushya','Manushya',
  'Deva','Rakshasa','Deva','Rakshasa','Deva','Rakshasa',
  'Rakshasa','Manushya','Manushya','Deva','Rakshasa','Rakshasa',
  'Manushya','Manushya','Deva'
];

// Yoni (animal) for each nakshatra
const YONI = [
  'Horse','Elephant','Sheep','Serpent','Serpent','Dog',
  'Cat','Sheep','Cat','Rat','Rat','Cow',
  'Buffalo','Tiger','Buffalo','Tiger','Deer','Deer',
  'Dog','Monkey','Mongoose','Monkey','Lion','Horse',
  'Lion','Cow','Elephant'
];

// Hostile yoni pairs — marriage between these animals is inauspicious
const YONI_ENEMIES = [
  ['Horse','Buffalo'],['Elephant','Lion'],['Sheep','Monkey'],
  ['Serpent','Mongoose'],['Dog','Deer'],['Cat','Rat'],['Cow','Tiger']
];

// Rajju group for each nakshatra — same group = Rajju dosha
const RAJJU = [
  'Pada','Kati','Nabhi','Kanta','Shiro','Kanta',
  'Nabhi','Kati','Pada','Pada','Kati','Nabhi',
  'Kanta','Shiro','Kanta','Nabhi','Kati','Pada',
  'Pada','Kati','Nabhi','Kanta','Shiro','Kanta',
  'Nabhi','Kati','Pada'
];

// Vetham (Vedham) hostile star pairs — 13 pairs; Dhanishtha(22) has none
const VETHAM_PAIRS = [
  [0,17],[1,16],[2,15],[3,14],[4,13],[5,12],
  [6,11],[7,10],[8,9],[18,26],[19,25],[20,24],[21,23]
];

// Rasi lord (0=Aries … 11=Pisces)
const RASI_LORD = [
  'Mars','Venus','Mercury','Moon','Sun','Mercury',
  'Venus','Mars','Jupiter','Saturn','Saturn','Jupiter'
];

const PLANET_FRIENDS = {
  Sun:     ['Moon','Mars','Jupiter'],
  Moon:    ['Sun','Mercury'],
  Mars:    ['Sun','Moon','Jupiter'],
  Mercury: ['Sun','Venus'],
  Jupiter: ['Sun','Moon','Mars'],
  Venus:   ['Mercury','Saturn'],
  Saturn:  ['Mercury','Venus']
};

const PLANET_ENEMIES = {
  Sun:     ['Venus','Saturn'],
  Moon:    [],
  Mars:    ['Mercury'],
  Mercury: ['Moon'],
  Jupiter: ['Mercury','Venus'],
  Venus:   ['Sun','Moon'],
  Saturn:  ['Sun','Moon','Mars']
};

// Vasiyam: rasi → list of rasis it magnetically attracts
const VASIYAM = {
  0:[4,7],  1:[3,6],  2:[5,8],  3:[7,8],
  4:[6,3],  5:[11,2], 6:[9,5],  7:[3,5],
  8:[11,0], 9:[10,0], 10:[0,9], 11:[9,2]
};

// ─── individual checks ──────────────────────────────────────────────────────

const checkDinam = (bn, gn) => {
  const d = (bn - gn + 27) % 27;
  const rem = d % 9;
  // odd remainder (and 0 = 9th position = Parama Mitra) are auspicious
  const compatible = rem === 0 || rem % 2 === 1;
  return { name:'Dinam', compatible,
    description: compatible ? 'Day-star count is favourable' : 'Day-star count is unfavourable' };
};

const checkGanam = (bn, gn) => {
  const bg = GANA[bn], gg = GANA[gn];
  // Rakshasa is incompatible with Deva or Manushya; like pairs are always ok
  const compatible = bg === gg || (bg !== 'Rakshasa' && gg !== 'Rakshasa');
  return { name:'Ganam', compatible, description:`Boy: ${bg}, Girl: ${gg}` };
};

const checkMahendram = (bn, gn) => {
  const count = (bn - gn + 27) % 27 + 1;
  const compatible = [4,7,10,13,16,19,22,25].includes(count);
  return { name:'Mahendram', compatible,
    description: compatible ? `Star count ${count} bestows prosperity` : `Star count ${count} is inauspicious` };
};

const checkSthreeDhirgham = (bn, gn) => {
  const count = (bn - gn + 27) % 27 + 1;
  const compatible = count > 7;
  return { name:'Sthree Dhirgham', compatible,
    description: compatible ? `Star count ${count} ensures long life for the bride` : `Star count ${count} is too short` };
};

const checkYoni = (bn, gn) => {
  const by = YONI[bn], gy = YONI[gn];
  const hostile = YONI_ENEMIES.some(([a,b]) => (a===by&&b===gy)||(a===gy&&b===by));
  return { name:'Yoni', compatible:!hostile,
    description:`Boy: ${by}, Girl: ${gy}${hostile?' (hostile pair)':by===gy?' (same — excellent)':''}` };
};

const checkRasi = (br, gr) => {
  const count = (br - gr + 12) % 12 + 1;
  // Boy's rasi within 6 signs forward from girl's is favourable
  const compatible = count <= 6;
  return { name:'Rasi', compatible,
    description:`${RASI_NAMES[gr]} → ${RASI_NAMES[br]}: position ${count}` };
};

const checkRasiAthipathi = (br, gr) => {
  const bl = RASI_LORD[br], gl = RASI_LORD[gr];
  if (bl === gl) return { name:'Rasiyathipathi', compatible:true, description:`Both ruled by ${bl}` };
  const hostile = PLANET_ENEMIES[bl].includes(gl) || PLANET_ENEMIES[gl].includes(bl);
  const friendly = PLANET_FRIENDS[bl].includes(gl) || PLANET_FRIENDS[gl].includes(bl);
  return { name:'Rasiyathipathi', compatible:!hostile,
    description:`Boy lord: ${bl}, Girl lord: ${gl} (${hostile?'enemies':friendly?'friends':'neutral'})` };
};

const checkRajju = (bn, gn) => {
  const br = RAJJU[bn], gr = RAJJU[gn];
  const compatible = br !== gr;
  return { name:'Rajju', compatible, critical:true,
    description: compatible
      ? `Boy: ${br} Rajju, Girl: ${gr} Rajju`
      : `Both in ${br} Rajju — Rajju dosha (critical)` };
};

const checkVetham = (bn, gn) => {
  const isVetham = VETHAM_PAIRS.some(([a,b]) => (a===bn&&b===gn)||(a===gn&&b===bn));
  return { name:'Vetham', compatible:!isVetham,
    description: isVetham
      ? `${NAKSHATRA_NAMES[bn]} & ${NAKSHATRA_NAMES[gn]} are a Vetham pair`
      : 'No Vetham obstruction' };
};

const checkVasiyam = (br, gr) => {
  const compatible = !!(VASIYAM[gr]?.includes(br) || VASIYAM[br]?.includes(gr));
  return { name:'Vasiyam', compatible,
    description: compatible ? 'Magnetic attraction exists between the signs' : 'No Vasiyam attraction' };
};

// ─── main function ───────────────────────────────────────────────────────────

const calculatePorutham = (boyMoonLong, girlMoonLong) => {
  const bn = Math.floor(boyMoonLong / (360 / 27));
  const gn = Math.floor(girlMoonLong / (360 / 27));
  const br = Math.floor(boyMoonLong / 30);
  const gr = Math.floor(girlMoonLong / 30);

  const results = [
    checkDinam(bn, gn),
    checkGanam(bn, gn),
    checkMahendram(bn, gn),
    checkSthreeDhirgham(bn, gn),
    checkYoni(bn, gn),
    checkRasi(br, gr),
    checkRasiAthipathi(br, gr),
    checkRajju(bn, gn),
    checkVetham(bn, gn),
    checkVasiyam(br, gr)
  ];

  const score = results.filter(r => r.compatible).length;
  const rajjuOk = results.find(r => r.name === 'Rajju').compatible;

  return {
    boy:  { nakshatra: NAKSHATRA_NAMES[bn], rasi: RASI_NAMES[br] },
    girl: { nakshatra: NAKSHATRA_NAMES[gn], rasi: RASI_NAMES[gr] },
    results,
    score,
    total: 10,
    rajju_dosha: !rajjuOk
  };
};

module.exports = { calculatePorutham };
