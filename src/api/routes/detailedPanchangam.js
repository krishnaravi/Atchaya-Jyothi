const express = require('express');
const router = express.Router();
const { getDetailedPanchangam } = require('../controllers/detailedPanchangamController');
const { verifyToken } = require('../middleware/auth');

router.post('/detailed', verifyToken, getDetailedPanchangam);

module.exports = router;
