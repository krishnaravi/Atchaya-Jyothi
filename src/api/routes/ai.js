const express = require('express');
const router = express.Router();
const { getHoroscopeExplanation } = require('../controllers/aiController');
const { verifyToken } = require('../middleware/auth');

router.post('/horoscope', verifyToken, getHoroscopeExplanation);

module.exports = router;
