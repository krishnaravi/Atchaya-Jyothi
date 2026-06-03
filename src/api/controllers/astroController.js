const { v4: uuidv4 } = require('uuid');
const db = require('../../config/database');
const { calculatePlanets, calculateLagna } = require('../../core/astrology/planets');
const { calculateVargaCharts } = require('../../core/astrology/varga');
const { generateRasiChartSVG, generateNavamsaChartSVG } = require('../../utils/chartSVG');
const { calculateUpagrahas } = require('../../core/astrology/upagrahas');
const { detectYogas } = require('../../core/astrology/yogas');
const { calculateAshtakavarga } = require('../../core/astrology/ashtakavarga');
const { calculateShadbala } = require('../../core/astrology/shadbala');
const { calculateDasa, calculateBhukti } = require('../../core/astrology/dasa');
const { calculatePorutham } = require('../../core/astrology/porutham');
const logger = require('../../utils/logger');

const extractMoonLong = (date_of_birth, time_of_birth, timezone) => {
  const planets = calculatePlanets(date_of_birth, time_of_birth, timezone, 'en', 'lahiri');
  const moon = planets.positions.find(p => p.planet === 'Moon');
  return (moon.rasi_number - 1) * 30 + moon.degrees;
};

const validatePartner = (data, prefix) => {
  if (!data) return `${prefix} object required`;
  const { date_of_birth, time_of_birth, timezone } = data;
  if (!date_of_birth || !time_of_birth || !timezone)
    return `${prefix}.date_of_birth, ${prefix}.time_of_birth, ${prefix}.timezone required`;
  return null;
};

const poruthamsRecommendation = (score, rajjuDosha) => {
  if (rajjuDosha || score < 4) return 'Not Recommended';
  if (score >= 8) return 'Excellent Match';
  if (score >= 6) return 'Good Match';
  return 'Average Match';
};

const poruthamsummary = (score, rajjuDosha, recommendation) => {
  const rajjuTamil = rajjuDosha ? 'ரஜ்ஜு தோஷம் உள்ளது.' : 'ரஜ்ஜு தோஷம் இல்லை.';
  const rajjuEn    = rajjuDosha ? 'Rajju dosha detected.' : 'No Rajju dosha detected.';
  const recMap = {
    'Excellent Match': ['திருமணத்திற்கு மிகவும் சிறந்த பொருத்தம்.', 'Excellent match for marriage.'],
    'Good Match':      ['திருமணத்திற்கு நல்ல பொருத்தம்.',          'Good match for marriage.'],
    'Average Match':   ['சராசரி பொருத்தம். மேலும் ஆலோசனை தேவை.',  'Average compatibility. Further analysis recommended.'],
    'Not Recommended': ['திருமணம் பரிந்துரைக்கப்படவில்லை.',        'This match is not recommended for marriage.'],
  };
  const [recTamil, recEn] = recMap[recommendation];
  return {
    tamil:   `10ல் ${score} பொருத்தங்கள் அமைந்துள்ளன. ${rajjuTamil} ${recTamil}`,
    english: `${score} out of 10 poruthams matched. ${rajjuEn} ${recEn}`
  };
};

const getChart = async (req, res) => {
  try {
    const { name, date_of_birth, time_of_birth, place_of_birth, latitude, longitude, timezone, lang, ayanamsa } = req.body;
    if(!date_of_birth || !time_of_birth || !latitude || !longitude || !timezone){
      return res.status(400).json({ success: false, message: 'date_of_birth, time_of_birth, latitude, longitude, timezone required' });
    }
    const language = lang || 'en';
    const planets = calculatePlanets(date_of_birth, time_of_birth, timezone, language, ayanamsa || 'lahiri');
    const lagna = calculateLagna(planets.julDay, parseFloat(latitude), parseFloat(longitude), language);
    const moon = planets.positions.find(p => p.planet === 'Moon');
    const moonLong = (moon.rasi_number - 1) * 30 + moon.degrees;
    const dasas = calculateDasa(moonLong, date_of_birth);
    const currentDasa = dasas.find(d => new Date(d.start_date) <= new Date() && new Date(d.end_date) >= new Date());
    const bhuktis = currentDasa ? calculateBhukti(currentDasa.planet, currentDasa.start_date, currentDasa.end_date) : [];
    const currentBhukti = bhuktis.find(b => new Date(b.start_date) <= new Date() && new Date(b.end_date) >= new Date());
    const varga = calculateVargaCharts(planets.positions, ayanamsa || 'lahiri');
    const ashtakavarga = calculateAshtakavarga(planets.positions, lagna);
    const shadbala = calculateShadbala(planets.positions, lagna);
    const moment2 = require('moment-timezone');
    const dayOfWeek = moment2.tz(date_of_birth, 'YYYY-MM-DD', timezone || 'Asia/Kolkata').day();
    const { calculatePanchangam } = require('../../core/panchangam/panchangam');
    const basicP = calculatePanchangam(date_of_birth, parseFloat(latitude), parseFloat(longitude), timezone || 'Asia/Kolkata', language);
    const upagrahas = calculateUpagrahas(planets.julDay, dayOfWeek, basicP.sunrise, basicP.sunset, timezone || 'Asia/Kolkata');
    const yogas = detectYogas(planets.positions, lagna);
    const allPlanets = [...planets.positions, ...upagrahas];
    const rasiSVG = generateRasiChartSVG(allPlanets, lagna, name || 'Horoscope');
    const navamsaPlanets = varga.D9.map((p,i) => ({...planets.positions[i], rasi: p.rasi, rasi_number: p.rasi_number}));
    const navamsaSVG = generateNavamsaChartSVG(navamsaPlanets, lagna, 'நவாம்சம்');
    logger.info('Chart calculated for: ' + (name || 'unknown'));
    res.json({ success: true, data: { name, lagna, planets: planets.positions, upagrahas: upagrahas, yogas: yogas, rasi_chart_svg: rasiSVG, navamsa_chart_svg: navamsaSVG, varga_charts: varga, ashtakavarga, shadbala, current_dasa: currentDasa, current_bhukti: currentBhukti, all_dasas: dasas } });
  } catch(err) {
    logger.error('Chart error: ' + err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

const getPorutham = async (req, res) => {
  try {
    const boyErr  = validatePartner(req.body.boy,  'boy');
    if (boyErr)  return res.status(400).json({ success: false, message: boyErr });
    const girlErr = validatePartner(req.body.girl, 'girl');
    if (girlErr) return res.status(400).json({ success: false, message: girlErr });

    const { boy, girl } = req.body;
    const boyMoonLong  = extractMoonLong(boy.date_of_birth,  boy.time_of_birth,  boy.timezone);
    const girlMoonLong = extractMoonLong(girl.date_of_birth, girl.time_of_birth, girl.timezone);

    const result         = calculatePorutham(boyMoonLong, girlMoonLong);
    const recommendation = poruthamsRecommendation(result.score, result.rajju_dosha);
    const { tamil, english } = poruthamsummary(result.score, result.rajju_dosha, recommendation);

    logger.info(`Astro porutham: ${boy.date_of_birth} × ${girl.date_of_birth} → ${result.score}/10`);
    res.json({
      success: true,
      data: {
        boy:  result.boy,
        girl: result.girl,
        score:          result.score,
        percentage:     Math.round((result.score / 10) * 100),
        recommendation,
        poruthams:      result.results,
        rajju_dosha:    result.rajju_dosha,
        summary_tamil:  tamil,
        summary_english: english
      }
    });
  } catch (err) {
    logger.error('Astro porutham error: ' + err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getChart, getPorutham };
