const express = require('express');
const router = express.Router();
const { getChart, getPorutham } = require('../controllers/astroController');
const { verifyToken } = require('../middleware/auth');

router.post('/chart', verifyToken, getChart);
router.post('/porutham', verifyToken, getPorutham);

module.exports = router;

router.post('/chart-svg', async (req, res) => {
  try {
    const { calculatePlanets, calculateLagna } = require('../../core/astrology/planets');
    const { calculateUpagrahas } = require('../../core/astrology/upagrahas');
    const { calculatePanchangam } = require('../../core/panchangam/panchangam');
    const { generateRasiChartSVG, generateNavamsaChartSVG } = require('../../utils/chartSVG');
    const { calculateVargaCharts } = require('../../core/astrology/varga');
    const moment = require('moment-timezone');
    const { date_of_birth, time_of_birth, latitude, longitude, timezone, lang, name, ayanamsa } = req.body;
    const tz = timezone || 'Asia/Kolkata';
    const planets = calculatePlanets(date_of_birth, time_of_birth, tz, 'en', ayanamsa || 'lahiri');
    const lagna = calculateLagna(planets.julDay, parseFloat(latitude), parseFloat(longitude), 'en');
    const dayOfWeek = moment.tz(date_of_birth, 'YYYY-MM-DD', tz).day();
    const basic = calculatePanchangam(date_of_birth, parseFloat(latitude), parseFloat(longitude), tz, 'en');
    const upagrahas = calculateUpagrahas(planets.julDay, dayOfWeek, basic.sunrise, basic.sunset, tz);
    const allPlanets = [...planets.positions, ...upagrahas];
    const rasiSVG = generateRasiChartSVG(allPlanets, lagna, name || 'Horoscope');
    const varga = calculateVargaCharts(planets.positions, ayanamsa || 'lahiri');
    const navamsaPlanets = varga.D9.map((p,i) => ({...planets.positions[i], rasi: p.rasi, rasi_number: p.rasi_number}));
    const navamsaSVG = generateNavamsaChartSVG(navamsaPlanets, lagna, 'நவாம்சம்');
    res.json({ success: true, rasi_chart_svg: rasiSVG, navamsa_chart_svg: navamsaSVG });
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
