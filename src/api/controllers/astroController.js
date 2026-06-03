const { calculatePlanets, calculateLagna } = require('../../core/astrology/planets');
const { calculateDasa, calculateBhukti } = require('../../core/astrology/dasa');
const { calculatePorutham } = require('../../core/astrology/porutham');
const { calculateKujaDosha } = require('../../core/astrology/kujaDosha');
const { buildChart } = require('../../utils/chartCalculator');
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
    const { name, date_of_birth, time_of_birth, latitude, longitude, timezone, lang, ayanamsa } = req.body;
    if (!date_of_birth || !time_of_birth || !latitude || !longitude || !timezone)
      return res.status(400).json({ success: false, message: 'date_of_birth, time_of_birth, latitude, longitude, timezone required' });
    const data = buildChart(date_of_birth, time_of_birth, parseFloat(latitude), parseFloat(longitude), timezone, name, lang || 'en', ayanamsa || 'lahiri');
    logger.info('Chart calculated for: ' + (name || 'unknown'));
    res.json({ success: true, data });
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

const getKujaDosha = async (req, res) => {
  try {
    const { date_of_birth, time_of_birth, latitude, longitude, timezone, ayanamsa } = req.body;
    if (!date_of_birth || !time_of_birth || !latitude || !longitude || !timezone)
      return res.status(400).json({ success: false, message: 'date_of_birth, time_of_birth, latitude, longitude, timezone required' });
    const planets = calculatePlanets(date_of_birth, time_of_birth, timezone, 'en', ayanamsa || 'lahiri');
    const lagna   = calculateLagna(planets.julDay, parseFloat(latitude), parseFloat(longitude), 'en');
    const result  = calculateKujaDosha(planets.positions, lagna);
    logger.info('Kuja Dosha calculated for: ' + date_of_birth);
    res.json({ success: true, data: result });
  } catch (err) {
    logger.error('Kuja Dosha error: ' + err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getChart, getPorutham, getKujaDosha };
