const express = require('express');
const router = express.Router();
const { getChart, getPorutham, getKujaDosha } = require('../controllers/astroController');
const { getGochar, getPlanetIngress } = require('../controllers/transitController');
const { verifyToken } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { chartSchema, astroPoruthamSchema, transitSchema, ingressSchema } = require('../middleware/schemas');

router.post('/chart',           verifyToken, validate(chartSchema),          getChart);
router.post('/porutham',        verifyToken, validate(astroPoruthamSchema),   getPorutham);
router.post('/kuja-dosha',      verifyToken, validate(chartSchema),           getKujaDosha);
router.post('/transit',         verifyToken, validate(transitSchema),         getGochar);
router.post('/transit/ingress', verifyToken, validate(ingressSchema),         getPlanetIngress);

module.exports = router;
