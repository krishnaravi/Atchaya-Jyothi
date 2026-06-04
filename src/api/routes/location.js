const express = require('express');
const router = express.Router();
const { getLocation } = require('../controllers/locationController');
const validate = require('../middleware/validate');
const { locationSchema } = require('../middleware/schemas');

router.post('/search', validate(locationSchema), getLocation);

module.exports = router;
