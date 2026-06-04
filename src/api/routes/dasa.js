const express = require('express');
const router = express.Router();
const { getMahadasa, getBhukti, getAntara, getSukshma, getPrana, getPorutham } = require('../controllers/dasaController');
const { verifyToken } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { mahadasaSchema, bhuktiSchema, antaraSchema, sukshmaSchema, pranaSchema, dasaPoruthamSchema } = require('../middleware/schemas');
const { cacheMiddleware } = require('../middleware/cache');

const DASA_TTL = 86400; // 24 hours

const birthKey = (req) =>
  `${req.body.date_of_birth}:${req.body.time_of_birth}:${req.body.latitude}:${req.body.longitude}:${req.body.timezone}`;

router.post('/mahadasa', verifyToken, validate(mahadasaSchema),
  cacheMiddleware(req => `dasa:mahadasa:${birthKey(req)}`, DASA_TTL),
  getMahadasa);

router.post('/bhukti',   verifyToken, validate(bhuktiSchema),
  cacheMiddleware(req => `dasa:bhukti:${birthKey(req)}:${req.body.dasa_planet}`, DASA_TTL),
  getBhukti);

router.post('/antara',   verifyToken, validate(antaraSchema),
  cacheMiddleware(req => `dasa:antara:${birthKey(req)}:${req.body.dasa_planet}:${req.body.bhukti_planet}`, DASA_TTL),
  getAntara);

router.post('/sukshma',  verifyToken, validate(sukshmaSchema),
  cacheMiddleware(req => `dasa:sukshma:${birthKey(req)}:${req.body.dasa_planet}:${req.body.bhukti_planet}:${req.body.antara_planet}`, DASA_TTL),
  getSukshma);

router.post('/prana',    verifyToken, validate(pranaSchema),
  cacheMiddleware(req => `dasa:prana:${birthKey(req)}:${req.body.dasa_planet}:${req.body.bhukti_planet}:${req.body.antara_planet}:${req.body.sukshma_planet}`, DASA_TTL),
  getPrana);

router.post('/porutham', verifyToken, validate(dasaPoruthamSchema),
  cacheMiddleware(req => `porutham:${req.body.boy_nakshatra}:${req.body.girl_nakshatra}`, DASA_TTL),
  getPorutham);

module.exports = router;
