const express = require('express');
const router = express.Router();
const { getLanguages, getMultiLangChart } = require('../controllers/langController');
const { verifyToken } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { chartSchema } = require('../middleware/schemas');

router.get('/list', getLanguages);
router.post('/chart', verifyToken, validate(chartSchema), getMultiLangChart);

module.exports = router;
