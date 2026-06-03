// Shared chart calculation — used by astroController (on-the-fly) and
// chartsController (calculate-then-persist). Keep in sync with the DB
// report_data shape stored in horoscope_reports.
const moment = require('moment-timezone');
const { calculatePlanets, calculateLagna } = require('../core/astrology/planets');
const { calculateDasa, calculateBhukti } = require('../core/astrology/dasa');
const { calculateVargaCharts } = require('../core/astrology/varga');
const { calculateAshtakavarga } = require('../core/astrology/ashtakavarga');
const { calculateShadbala } = require('../core/astrology/shadbala');
const { calculateUpagrahas } = require('../core/astrology/upagrahas');
const { detectYogas } = require('../core/astrology/yogas');
const { calculatePanchangam } = require('../core/panchangam/panchangam');
const { generateRasiChartSVG, generateNavamsaChartSVG } = require('./chartSVG');

const buildChart = (date_of_birth, time_of_birth, latitude, longitude, timezone, name, lang, ayanamsa) => {
  const language = lang  || 'en';
  const ayan     = ayanamsa || 'lahiri';
  const tz       = timezone || 'Asia/Kolkata';

  const planets  = calculatePlanets(date_of_birth, time_of_birth, tz, language, ayan);
  const lagna    = calculateLagna(planets.julDay, parseFloat(latitude), parseFloat(longitude), language);

  const moon     = planets.positions.find(p => p.planet === 'Moon');
  const moonLong = (moon.rasi_number - 1) * 30 + moon.degrees;

  const dasas        = calculateDasa(moonLong, date_of_birth);
  const currentDasa  = dasas.find(d => new Date(d.start_date) <= new Date() && new Date(d.end_date) >= new Date());
  const bhuktis      = currentDasa ? calculateBhukti(currentDasa.planet, currentDasa.start_date, currentDasa.end_date) : [];
  const currentBhukti = bhuktis.find(b => new Date(b.start_date) <= new Date() && new Date(b.end_date) >= new Date());

  const varga        = calculateVargaCharts(planets.positions, ayan);
  const ashtakavarga = calculateAshtakavarga(planets.positions, lagna);
  const shadbala     = calculateShadbala(planets.positions, lagna);

  const dayOfWeek = moment.tz(date_of_birth, 'YYYY-MM-DD', tz).day();
  const basicP    = calculatePanchangam(date_of_birth, parseFloat(latitude), parseFloat(longitude), tz, language);
  const upagrahas = calculateUpagrahas(planets.julDay, dayOfWeek, basicP.sunrise, basicP.sunset, tz);

  const { yogas, present: present_yogas } = detectYogas(planets.positions, lagna);

  const allPlanets   = [...planets.positions, ...upagrahas];
  const rasiSVG      = generateRasiChartSVG(allPlanets, lagna, name || 'Horoscope');
  const navamsaPlanets = varga.D9.map((p, i) => ({ ...planets.positions[i], rasi: p.rasi, rasi_number: p.rasi_number }));
  const navamsaSVG   = generateNavamsaChartSVG(navamsaPlanets, lagna, 'நவாம்சம்');

  return {
    name,
    lagna,
    planets:          planets.positions,
    upagrahas,
    yogas,
    present_yogas,
    rasi_chart_svg:   rasiSVG,
    navamsa_chart_svg: navamsaSVG,
    varga_charts:     varga,
    ashtakavarga,
    shadbala,
    current_dasa:     currentDasa,
    current_bhukti:   currentBhukti,
    all_dasas:        dasas
  };
};

module.exports = { buildChart };
