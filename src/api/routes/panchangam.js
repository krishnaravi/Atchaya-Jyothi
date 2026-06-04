const express = require('express');
const router = express.Router();
const { getPanchangam } = require('../controllers/panchangamController');
const { verifyToken } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { panchangamSchema } = require('../middleware/schemas');
const { cacheMiddleware } = require('../middleware/cache');

const PANCHANGAM_TTL = 3600; // 1 hour

router.post('/daily',
  verifyToken,
  validate(panchangamSchema),
  cacheMiddleware(req => `panchangam:${req.body.date}:${req.body.latitude}:${req.body.longitude}:${req.body.lang || 'en'}`, PANCHANGAM_TTL),
  getPanchangam
);

module.exports = router;
