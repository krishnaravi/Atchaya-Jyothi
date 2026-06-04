const express = require('express');
const router = express.Router();
const { getMatchmaking } = require('../controllers/matchmakingController');
const validate = require('../middleware/validate');
const { matchmakingSchema } = require('../middleware/schemas');
const { cacheMiddleware } = require('../middleware/cache');

const PORUTHAM_TTL = 86400; // 24 hours

// Public endpoint — no auth required, calculation only
router.get('/',
  validate(matchmakingSchema, 'query'),
  cacheMiddleware(req => `matchmaking:${req.query.boyNakshatra}:${req.query.girlNakshatra}`, PORUTHAM_TTL),
  getMatchmaking
);

module.exports = router;
