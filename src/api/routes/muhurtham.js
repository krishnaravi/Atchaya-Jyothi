const express = require('express');
const router = express.Router();
const { getMuhurtham } = require('../controllers/muhurthamController');
const { verifyToken } = require('../middleware/auth');

router.post('/find', verifyToken, getMuhurtham);

module.exports = router;
