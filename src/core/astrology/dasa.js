const DASA_YEARS = {Ketu:7,Venus:20,Sun:6,Moon:10,Mars:7,Rahu:18,Jupiter:16,Saturn:19,Mercury:17};
const DASA_ORDER = ['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury'];
const NAKSHATRA_LORDS = ['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury','Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury','Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury'];
const calculateDasa = (moonLongitude, birthDate) => {
  const nakshatraIndex = Math.floor(moonLongitude / (360/27));
  const nakshatraLord = NAKSHATRA_LORDS[nakshatraIndex];
  const nakshatraProgress = (moonLongitude % (360/27)) / (360/27);
  const dasaYears = DASA_YEARS[nakshatraLord];
  const elapsedYears = nakshatraProgress * dasaYears;
  const remainingYears = dasaYears - elapsedYears;
  const birth = new Date(birthDate);
  const dasaStart = new Date(birth.getTime() - elapsedYears * 365.25 * 24 * 3600 * 1000);
  const dasas = [];
  let currentDate = new Date(dasaStart);
  let startIndex = DASA_ORDER.indexOf(nakshatraLord);
  for(let i = 0; i < 9; i++){
    const planet = DASA_ORDER[(startIndex + i) % 9];
    const years = DASA_YEARS[planet];
    const endDate = new Date(currentDate.getTime() + years * 365.25 * 24 * 3600 * 1000);
    dasas.push({planet, start_date: currentDate.toISOString().split('T')[0], end_date: endDate.toISOString().split('T')[0], years});
    currentDate = endDate;
  }
  return dasas;
};
const calculateBhukti = (dasaPlanet, dasaStart, dasaEnd) => {
  const totalYears = DASA_YEARS[dasaPlanet];
  const bhuktis = [];
  let currentDate = new Date(dasaStart);
  const startIndex = DASA_ORDER.indexOf(dasaPlanet);
  for(let i = 0; i < 9; i++){
    const planet = DASA_ORDER[(startIndex + i) % 9];
    const bhuktiYears = (DASA_YEARS[planet] * totalYears) / 120;
    const endDate = new Date(currentDate.getTime() + bhuktiYears * 365.25 * 24 * 3600 * 1000);
    bhuktis.push({planet, start_date: currentDate.toISOString().split('T')[0], end_date: endDate.toISOString().split('T')[0]});
    currentDate = endDate;
  }
  return bhuktis;
};
const MS_PER_YEAR = 365.25 * 24 * 3600 * 1000;

const calculateAntara = (moonLongitude, birthDate, dasaPlanet, bhuktiPlanet) => {
  const dasas = calculateDasa(moonLongitude, birthDate);
  const dasa = dasas.find(d => d.planet === dasaPlanet);
  if (!dasa) return [];
  const bhuktis = calculateBhukti(dasaPlanet, dasa.start_date, dasa.end_date);
  const bhukti = bhuktis.find(b => b.planet === bhuktiPlanet);
  if (!bhukti) return [];
  const antaras = [];
  let currentMs = new Date(bhukti.start_date).getTime();
  const startIndex = DASA_ORDER.indexOf(bhuktiPlanet);
  for (let i = 0; i < 9; i++) {
    const planet = DASA_ORDER[(startIndex + i) % 9];
    const durationMs = (DASA_YEARS[dasaPlanet] * DASA_YEARS[bhuktiPlanet] * DASA_YEARS[planet] / 14400) * MS_PER_YEAR;
    const endMs = currentMs + durationMs;
    antaras.push({planet, start_date: new Date(currentMs).toISOString().split('T')[0], end_date: new Date(endMs).toISOString().split('T')[0]});
    currentMs = endMs;
  }
  return antaras;
};

const calculateSukshma = (moonLongitude, birthDate, dasaPlanet, bhuktiPlanet, antaraPlanet) => {
  const antaras = calculateAntara(moonLongitude, birthDate, dasaPlanet, bhuktiPlanet);
  const antara = antaras.find(a => a.planet === antaraPlanet);
  if (!antara) return [];
  const sukshmas = [];
  let currentMs = new Date(antara.start_date).getTime();
  const startIndex = DASA_ORDER.indexOf(antaraPlanet);
  for (let i = 0; i < 9; i++) {
    const planet = DASA_ORDER[(startIndex + i) % 9];
    const durationMs = (DASA_YEARS[dasaPlanet] * DASA_YEARS[bhuktiPlanet] * DASA_YEARS[antaraPlanet] * DASA_YEARS[planet] / 1728000) * MS_PER_YEAR;
    const endMs = currentMs + durationMs;
    sukshmas.push({planet, start_date: new Date(currentMs).toISOString().split('T')[0], end_date: new Date(endMs).toISOString().split('T')[0]});
    currentMs = endMs;
  }
  return sukshmas;
};

const calculatePrana = (moonLongitude, birthDate, dasaPlanet, bhuktiPlanet, antaraPlanet, sukshmaplanet) => {
  const sukshmas = calculateSukshma(moonLongitude, birthDate, dasaPlanet, bhuktiPlanet, antaraPlanet);
  const sukshma = sukshmas.find(s => s.planet === sukshmaplanet);
  if (!sukshma) return [];
  const pranas = [];
  let currentMs = new Date(sukshma.start_date).getTime();
  const startIndex = DASA_ORDER.indexOf(sukshmaplanet);
  for (let i = 0; i < 9; i++) {
    const planet = DASA_ORDER[(startIndex + i) % 9];
    const durationMs = (DASA_YEARS[dasaPlanet] * DASA_YEARS[bhuktiPlanet] * DASA_YEARS[antaraPlanet] * DASA_YEARS[sukshmaplanet] * DASA_YEARS[planet] / 207360000) * MS_PER_YEAR;
    const endMs = currentMs + durationMs;
    pranas.push({planet, start_date: new Date(currentMs).toISOString(), end_date: new Date(endMs).toISOString()});
    currentMs = endMs;
  }
  return pranas;
};

module.exports = { calculateDasa, calculateBhukti, calculateAntara, calculateSukshma, calculatePrana, DASA_ORDER, DASA_YEARS };
