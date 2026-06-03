const { predictSpouseStar, checkNakshatraCompatibility, analyzePulippani } = require('../../core/research/rules');
const { calculatePlanets } = require('../../core/astrology/planets');
const { calculatePanchangam } = require('../../core/panchangam/panchangam');
const logger = require('../../utils/logger');

const getSpouseStar = async (req, res) => {
  try {
    const { nakshatra, gender } = req.body;
    if(!nakshatra || !gender) return res.status(400).json({ success: false, message: 'nakshatra and gender required' });
    const result = predictSpouseStar(parseInt(nakshatra), gender);
    res.json({ success: true, data: result });
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getNakshatraCompatibility = async (req, res) => {
  try {
    const { nakshatra1, nakshatra2 } = req.body;
    if(!nakshatra1 || !nakshatra2) return res.status(400).json({ success: false, message: 'nakshatra1 and nakshatra2 required' });
    const result = checkNakshatraCompatibility(parseInt(nakshatra1), parseInt(nakshatra2));
    res.json({ success: true, data: result });
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getPulippaniAnalysis = async (req, res) => {
  try {
    const { date_of_birth, time_of_birth, latitude, longitude, timezone } = req.body;
    if(!date_of_birth || !time_of_birth || !latitude || !longitude || !timezone) return res.status(400).json({ success: false, message: 'All fields required' });
    const planetsData = calculatePlanets(date_of_birth, time_of_birth, timezone, 'en');
    const panchangam = calculatePanchangam(date_of_birth, parseFloat(latitude), parseFloat(longitude), timezone, 'en');
    const analysis = analyzePulippani(planetsData.positions, panchangam);
    res.json({ success: true, data: { analysis, planets: planetsData.positions, panchangam } });
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getSpouseStar, getNakshatraCompatibility, getPulippaniAnalysis };
