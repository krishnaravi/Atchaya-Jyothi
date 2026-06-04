const express = require('express');
const router = express.Router();
const { register, login, refreshToken } = require('../controllers/authController');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema, refreshSchema } = require('../middleware/schemas');

router.post('/register', validate(registerSchema), register);
router.post('/login',    validate(loginSchema),    login);
router.post('/refresh',  validate(refreshSchema),  refreshToken);

module.exports = router;
