const express = require('express');
const router = express.Router();
const { getPanchangam } = require('../controllers/panchangamController');
const { verifyToken } = require('../middleware/auth');

router.post('/daily', verifyToken, getPanchangam);

module.exports = router;
