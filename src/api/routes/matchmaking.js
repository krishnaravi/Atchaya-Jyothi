const express = require('express');
const router = express.Router();
const { getMatchmaking } = require('../controllers/matchmakingController');

// Public endpoint — no auth required, calculation only
router.get('/', getMatchmaking);

module.exports = router;
