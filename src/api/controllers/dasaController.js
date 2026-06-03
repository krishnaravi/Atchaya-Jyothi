const { calculatePlanets } = require('../../core/astrology/planets');
const { calculateDasa, calculateBhukti, calculateAntara, calculateSukshma, calculatePrana, DASA_ORDER } = require('../../core/astrology/dasa');
const logger = require('../../utils/logger');

const BIRTH_FIELDS = 'date_of_birth, time_of_birth, latitude, longitude, timezone';

const getMoonLong = (date_of_birth, time_of_birth, timezone) => {
  const planets = calculatePlanets(date_of_birth, time_of_birth, timezone, 'en', 'lahiri');
  const moon = planets.positions.find(p => p.planet === 'Moon');
  return (moon.rasi_number - 1) * 30 + moon.degrees;
};

const validateBirth = (body) => {
  const { date_of_birth, time_of_birth, latitude, longitude, timezone } = body;
  if (!date_of_birth || !time_of_birth || !latitude || !longitude || !timezone) {
    return BIRTH_FIELDS + ' required';
  }
  return null;
};

const validatePlanet = (planet, field) => {
  if (!planet) return field + ' required';
  if (!DASA_ORDER.includes(planet)) return field + ' must be one of: ' + DASA_ORDER.join(', ');
  return null;
};

const findCurrentPeriod = (periods) =>
  periods.find(p => new Date(p.start_date) <= new Date() && new Date(p.end_date) >= new Date()) || null;

const getMahadasa = async (req, res) => {
  try {
    const err = validateBirth(req.body);
    if (err) return res.status(400).json({ success: false, message: err });
    const { date_of_birth, time_of_birth, latitude, longitude, timezone } = req.body;
    const moonLong = getMoonLong(date_of_birth, time_of_birth, timezone);
    const dasas = calculateDasa(moonLong, date_of_birth);
    const current_dasa = findCurrentPeriod(dasas);
    logger.info('Mahadasa calculated for: ' + date_of_birth);
    res.json({ success: true, data: { dasas, current_dasa } });
  } catch (err) {
    logger.error('Mahadasa error: ' + err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

const getBhukti = async (req, res) => {
  try {
    const birthErr = validateBirth(req.body);
    if (birthErr) return res.status(400).json({ success: false, message: birthErr });
    const planetErr = validatePlanet(req.body.dasa_planet, 'dasa_planet');
    if (planetErr) return res.status(400).json({ success: false, message: planetErr });
    const { date_of_birth, time_of_birth, latitude, longitude, timezone, dasa_planet } = req.body;
    const moonLong = getMoonLong(date_of_birth, time_of_birth, timezone);
    const dasas = calculateDasa(moonLong, date_of_birth);
    const dasa = dasas.find(d => d.planet === dasa_planet);
    if (!dasa) return res.status(400).json({ success: false, message: 'dasa_planet not found in calculated dasas' });
    const bhuktis = calculateBhukti(dasa_planet, dasa.start_date, dasa.end_date);
    const current_bhukti = findCurrentPeriod(bhuktis);
    logger.info('Bhukti calculated for dasa: ' + dasa_planet);
    res.json({ success: true, data: { dasa_planet, dasa_start: dasa.start_date, dasa_end: dasa.end_date, bhuktis, current_bhukti } });
  } catch (err) {
    logger.error('Bhukti error: ' + err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAntara = async (req, res) => {
  try {
    const birthErr = validateBirth(req.body);
    if (birthErr) return res.status(400).json({ success: false, message: birthErr });
    const dp = validatePlanet(req.body.dasa_planet, 'dasa_planet');
    if (dp) return res.status(400).json({ success: false, message: dp });
    const bp = validatePlanet(req.body.bhukti_planet, 'bhukti_planet');
    if (bp) return res.status(400).json({ success: false, message: bp });
    const { date_of_birth, time_of_birth, latitude, longitude, timezone, dasa_planet, bhukti_planet } = req.body;
    const moonLong = getMoonLong(date_of_birth, time_of_birth, timezone);
    const antaras = calculateAntara(moonLong, date_of_birth, dasa_planet, bhukti_planet);
    if (!antaras.length) return res.status(400).json({ success: false, message: 'Could not calculate antaras for given planet combination' });
    const current_antara = findCurrentPeriod(antaras);
    logger.info('Antara calculated for ' + dasa_planet + '/' + bhukti_planet);
    res.json({ success: true, data: { dasa_planet, bhukti_planet, antaras, current_antara } });
  } catch (err) {
    logger.error('Antara error: ' + err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

const getSukshma = async (req, res) => {
  try {
    const birthErr = validateBirth(req.body);
    if (birthErr) return res.status(400).json({ success: false, message: birthErr });
    for (const [val, field] of [[req.body.dasa_planet, 'dasa_planet'], [req.body.bhukti_planet, 'bhukti_planet'], [req.body.antara_planet, 'antara_planet']]) {
      const e = validatePlanet(val, field);
      if (e) return res.status(400).json({ success: false, message: e });
    }
    const { date_of_birth, time_of_birth, latitude, longitude, timezone, dasa_planet, bhukti_planet, antara_planet } = req.body;
    const moonLong = getMoonLong(date_of_birth, time_of_birth, timezone);
    const sukshmas = calculateSukshma(moonLong, date_of_birth, dasa_planet, bhukti_planet, antara_planet);
    if (!sukshmas.length) return res.status(400).json({ success: false, message: 'Could not calculate sukshmas for given planet combination' });
    const current_sukshma = findCurrentPeriod(sukshmas);
    logger.info('Sukshma calculated for ' + dasa_planet + '/' + bhukti_planet + '/' + antara_planet);
    res.json({ success: true, data: { dasa_planet, bhukti_planet, antara_planet, sukshmas, current_sukshma } });
  } catch (err) {
    logger.error('Sukshma error: ' + err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

const getPrana = async (req, res) => {
  try {
    const birthErr = validateBirth(req.body);
    if (birthErr) return res.status(400).json({ success: false, message: birthErr });
    for (const [val, field] of [[req.body.dasa_planet, 'dasa_planet'], [req.body.bhukti_planet, 'bhukti_planet'], [req.body.antara_planet, 'antara_planet'], [req.body.sukshma_planet, 'sukshma_planet']]) {
      const e = validatePlanet(val, field);
      if (e) return res.status(400).json({ success: false, message: e });
    }
    const { date_of_birth, time_of_birth, latitude, longitude, timezone, dasa_planet, bhukti_planet, antara_planet, sukshma_planet } = req.body;
    const moonLong = getMoonLong(date_of_birth, time_of_birth, timezone);
    const pranas = calculatePrana(moonLong, date_of_birth, dasa_planet, bhukti_planet, antara_planet, sukshma_planet);
    if (!pranas.length) return res.status(400).json({ success: false, message: 'Could not calculate pranas for given planet combination' });
    logger.info('Prana calculated for ' + dasa_planet + '/' + bhukti_planet + '/' + antara_planet + '/' + sukshma_planet);
    res.json({ success: true, data: { dasa_planet, bhukti_planet, antara_planet, sukshma_planet, pranas } });
  } catch (err) {
    logger.error('Prana error: ' + err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getMahadasa, getBhukti, getAntara, getSukshma, getPrana };
