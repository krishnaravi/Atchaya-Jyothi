const express = require('express');
const router = express.Router();
const { getLocation } = require('../controllers/locationController');

router.post('/search', getLocation);

module.exports = router;
