const express = require('express');
const router = express.Router();
const { getMahadasa, getBhukti, getAntara, getSukshma, getPrana, getPorutham } = require('../controllers/dasaController');
const { verifyToken } = require('../middleware/auth');

router.post('/mahadasa', verifyToken, getMahadasa);
router.post('/bhukti', verifyToken, getBhukti);
router.post('/antara', verifyToken, getAntara);
router.post('/sukshma', verifyToken, getSukshma);
router.post('/prana', verifyToken, getPrana);

router.post('/porutham', verifyToken, getPorutham);

module.exports = router;
