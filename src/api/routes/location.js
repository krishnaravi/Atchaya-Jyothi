const express = require('express');
const router = express.Router();
const { getLocation, saveLocation } = require('../controllers/locationController');
const { verifyToken } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { locationSchema, saveLocationSchema } = require('../middleware/schemas');

router.post('/search', validate(locationSchema), getLocation);
router.post('/village', verifyToken, validate(saveLocationSchema), saveLocation);

module.exports = router;
