const express = require('express');
const router = express.Router();
const { getSpouseStar, getNakshatraCompatibility, getPulippaniAnalysis } = require('../controllers/researchController');
const { verifyToken } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { spouseStarSchema, nakshatraCompatibilitySchema, pulippaniSchema } = require('../middleware/schemas');

router.post('/spouse-star',    verifyToken, validate(spouseStarSchema),              getSpouseStar);
router.post('/compatibility',  verifyToken, validate(nakshatraCompatibilitySchema),  getNakshatraCompatibility);
router.post('/pulippani',      verifyToken, validate(pulippaniSchema),               getPulippaniAnalysis);

module.exports = router;
