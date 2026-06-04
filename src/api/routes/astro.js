const express = require('express');
const router = express.Router();
const { getChart, getPorutham, getKujaDosha } = require('../controllers/astroController');
const { getGochar, getPlanetIngress } = require('../controllers/transitController');
const { verifyToken } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { cacheMiddleware } = require('../middleware/cache');
const { chartSchema, astroPoruthamSchema, transitSchema, ingressSchema } = require('../middleware/schemas');

const chartKey = (req) => {
  const { date_of_birth, time_of_birth, latitude, longitude, timezone, lang, ayanamsa } = req.body;
  return `astro:chart:${date_of_birth}:${time_of_birth}:${parseFloat(latitude).toFixed(4)}:${parseFloat(longitude).toFixed(4)}:${timezone}:${lang||'en'}:${ayanamsa||'lahiri'}`;
};

const kujaKey = (req) => {
  const { date_of_birth, time_of_birth, latitude, longitude, timezone, ayanamsa } = req.body;
  return `astro:kuja:${date_of_birth}:${time_of_birth}:${parseFloat(latitude).toFixed(4)}:${parseFloat(longitude).toFixed(4)}:${timezone}:${ayanamsa||'lahiri'}`;
};

router.post('/chart',           verifyToken, validate(chartSchema),         cacheMiddleware(chartKey, 86400), getChart);
router.post('/porutham',        verifyToken, validate(astroPoruthamSchema),  getPorutham);
router.post('/kuja-dosha',      verifyToken, validate(chartSchema),         cacheMiddleware(kujaKey,  86400), getKujaDosha);
router.post('/transit',         verifyToken, validate(transitSchema),        getGochar);
router.post('/transit/ingress', verifyToken, validate(ingressSchema),        getPlanetIngress);

module.exports = router;
