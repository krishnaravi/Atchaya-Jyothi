const express = require('express');
const router = express.Router();
const { getMatchmaking } = require('../controllers/matchmakingController');
const validate = require('../middleware/validate');
const { matchmakingSchema } = require('../middleware/schemas');

// Public endpoint — no auth required, calculation only
router.get('/', validate(matchmakingSchema, 'query'), getMatchmaking);

module.exports = router;
