const express = require('express');
const router = express.Router();
const { getMuhurtham } = require('../controllers/muhurthamController');
const { verifyToken } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { muhurthamSchema } = require('../middleware/schemas');

router.post('/find', verifyToken, validate(muhurthamSchema), getMuhurtham);

module.exports = router;
