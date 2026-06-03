const express = require('express');
const router = express.Router();
const { generatePDF } = require('../controllers/pdfController');
const { verifyToken } = require('../middleware/auth');

router.post('/horoscope', verifyToken, generatePDF);

module.exports = router;
