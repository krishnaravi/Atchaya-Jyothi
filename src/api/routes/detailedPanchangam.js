const express = require('express');
const router = express.Router();
const { getDetailedPanchangam } = require('../controllers/detailedPanchangamController');
const { verifyToken } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { panchangamSchema } = require('../middleware/schemas');

router.post('/detailed', verifyToken, validate(panchangamSchema), getDetailedPanchangam);

module.exports = router;
