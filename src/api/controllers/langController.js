const { getSupportedLanguages, translatePlanets } = require('../../utils/translations');
const { calculatePlanets, calculateLagna } = require('../../core/astrology/planets');
const { calculateDasa, calculateBhukti } = require('../../core/astrology/dasa');
const logger = require('../../utils/logger');

const getLanguages = async (req, res) => {
  res.json({ success: true, data: getSupportedLanguages() });
};

const getMultiLangChart = async (req, res) => {
  try {
    const { date_of_birth, time_of_birth, latitude, longitude, timezone, lang } = req.body;
    if(!date_of_birth || !time_of_birth || !latitude || !longitude || !timezone){
      return res.status(400).json({ success: false, message: 'All fields required' });
    }
    const language = lang || 'ta';
    const planets = calculatePlanets(date_of_birth, time_of_birth, timezone, 'en');
    const lagna = calculateLagna(planets.julDay, parseFloat(latitude), parseFloat(longitude), 'en');
    const translatedPlanets = translatePlanets(planets.positions, language);
    const moon = planets.positions.find(p => p.planet === 'Moon');
    const moonLong = (moon.rasi_number - 1) * 30 + moon.degrees;
    const dasas = calculateDasa(moonLong, date_of_birth);
    const currentDasa = dasas.find(d => new Date(d.start_date) <= new Date() && new Date(d.end_date) >= new Date());
    logger.info('MultiLang chart: ' + language);
    res.json({ success: true, language, data: { lagna, planets: translatedPlanets, current_dasa: currentDasa, all_dasas: dasas } });
  } catch(err) {
    logger.error(err);
    return res.status(500).json({ success: false, message: 'Chart calculation failed' });
  }
};

module.exports = { getLanguages, getMultiLangChart };
