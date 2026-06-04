const express = require('express');
const router = express.Router();
const { generatePDF } = require('../controllers/pdfController');
const { verifyToken } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { chartSchema } = require('../middleware/schemas');

router.post('/horoscope', verifyToken, validate(chartSchema), generatePDF);

module.exports = router;
