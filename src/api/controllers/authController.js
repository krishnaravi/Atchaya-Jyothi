const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const db = require('../../config/database');
const { hashPassword, comparePassword } = require('../../utils/password');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../../utils/jwt');
const logger = require('../../utils/logger');

const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const storeRefreshToken = async (userId, token) => {
  const expiresAt = new Date(Date.now() + REFRESH_TTL_MS);
  await db.execute(
    'INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)',
    [uuidv4(), userId, hashToken(token), expiresAt]
  );
  // Lazy cleanup: remove expired tokens for this user
  await db.execute(
    'DELETE FROM refresh_tokens WHERE user_id = ? AND expires_at < NOW()',
    [userId]
  );
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password required' });
    }
    const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }
    const id = uuidv4();
    const hashed = await hashPassword(password);
    const apiKey = uuidv4().replace(/-/g, '');
    await db.execute(
      'INSERT INTO users (id, name, email, password, api_key) VALUES (?, ?, ?, ?, ?)',
      [id, name, email, hashed, apiKey]
    );
    logger.info('New user registered: ' + email);
    res.status(201).json({ success: true, message: 'Registration successful', data: { id, name, email, api_key: apiKey } });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }
    const [users] = await db.execute('SELECT * FROM users WHERE email = ? AND is_active = 1', [email]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const user = users[0];
    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const accessToken  = generateAccessToken({ id: user.id, email: user.email, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email });
    await storeRefreshToken(user.id, refreshToken);
    logger.info('User logged in: ' + email);
    res.json({ success: true, message: 'Login successful', data: { accessToken, refreshToken, user: { id: user.id, name: user.name, email: user.email, role: user.role } } });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token required' });
    }

    // Verify JWT signature
    const decoded = verifyRefreshToken(refreshToken);

    // Check token is in DB and not expired/revoked
    const [tokens] = await db.execute(
      'SELECT id FROM refresh_tokens WHERE token_hash = ? AND expires_at > NOW()',
      [hashToken(refreshToken)]
    );
    if (tokens.length === 0) {
      return res.status(401).json({ success: false, message: 'Refresh token revoked or expired' });
    }

    const [users] = await db.execute('SELECT id, email, role FROM users WHERE id = ? AND is_active = 1', [decoded.id]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    const user = users[0];

    const newAccessToken  = generateAccessToken({ id: user.id, email: user.email, role: user.role });
    const newRefreshToken = generateRefreshToken({ id: user.id, email: user.email });

    // Rotate: delete old token, insert new
    await db.execute('DELETE FROM refresh_tokens WHERE token_hash = ?', [hashToken(refreshToken)]);
    await storeRefreshToken(user.id, newRefreshToken);

    logger.info('Token refreshed for: ' + user.email);
    res.json({ success: true, message: 'Token refreshed', data: { accessToken: newAccessToken, refreshToken: newRefreshToken } });
  } catch (err) {
    logger.error('Refresh token error: ' + err.message);
    res.status(403).json({ success: false, message: 'Invalid or expired refresh token' });
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await db.execute('DELETE FROM refresh_tokens WHERE token_hash = ?', [hashToken(refreshToken)]);
    }
    logger.info('User logged out');
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { register, login, refreshToken, logout };
