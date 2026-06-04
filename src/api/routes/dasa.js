const express = require('express');
const router = express.Router();
const { getMahadasa, getBhukti, getAntara, getSukshma, getPrana, getPorutham } = require('../controllers/dasaController');
const { verifyToken } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { mahadasaSchema, bhuktiSchema, antaraSchema, sukshmaSchema, pranaSchema, dasaPoruthamSchema } = require('../middleware/schemas');

router.post('/mahadasa', verifyToken, validate(mahadasaSchema),     getMahadasa);
router.post('/bhukti',   verifyToken, validate(bhuktiSchema),       getBhukti);
router.post('/antara',   verifyToken, validate(antaraSchema),       getAntara);
router.post('/sukshma',  verifyToken, validate(sukshmaSchema),      getSukshma);
router.post('/prana',    verifyToken, validate(pranaSchema),        getPrana);
router.post('/porutham', verifyToken, validate(dasaPoruthamSchema), getPorutham);

module.exports = router;
