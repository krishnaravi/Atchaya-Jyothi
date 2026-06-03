const express = require('express');
const router = express.Router();
const { getSpouseStar, getNakshatraCompatibility, getPulippaniAnalysis } = require('../controllers/researchController');
const { verifyToken } = require('../middleware/auth');

router.post('/spouse-star', verifyToken, getSpouseStar);
router.post('/compatibility', verifyToken, getNakshatraCompatibility);
router.post('/pulippani', verifyToken, getPulippaniAnalysis);

module.exports = router;
