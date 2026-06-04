const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};

const verifyApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || !process.env.API_KEY) {
    return res.status(401).json({ success: false, message: 'API Key required' });
  }
  const provided = crypto.createHash('sha256').update(apiKey).digest();
  const expected = crypto.createHash('sha256').update(process.env.API_KEY).digest();
  if (!crypto.timingSafeEqual(provided, expected)) {
    return res.status(403).json({ success: false, message: 'Invalid API Key' });
  }
  next();
};

module.exports = { verifyToken, verifyApiKey };
