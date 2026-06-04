const express = require('express');
const router = express.Router();
const { getPanchangam } = require('../controllers/panchangamController');
const { verifyToken } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { panchangamSchema } = require('../middleware/schemas');

router.post('/daily', verifyToken, validate(panchangamSchema), getPanchangam);

module.exports = router;
