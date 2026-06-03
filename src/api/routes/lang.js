const express = require('express');
const router = express.Router();
const { getLanguages, getMultiLangChart } = require('../controllers/langController');
const { verifyToken } = require('../middleware/auth');

router.get('/list', getLanguages);
router.post('/chart', verifyToken, getMultiLangChart);

module.exports = router;
