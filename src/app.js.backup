const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./api/routes/auth');
const astroRoutes = require('./api/routes/astro');
const panchangamRoutes = require('./api/routes/panchangam');
const muhurthamRoutes = require('./api/routes/muhurtham');
const researchRoutes = require('./api/routes/research');
const langRoutes = require('./api/routes/lang');
const locationRoutes = require('./api/routes/location');
const detailedPanchangamRoutes = require('./api/routes/detailedPanchangam');
const aiRoutes = require('./api/routes/ai');
const pdfRoutes = require('./api/routes/pdf');
const dasaRoutes = require('./api/routes/dasa');
const matchmakingRoutes = require('./api/routes/matchmaking');
const chartsRoutes = require('./api/routes/charts');

const app = express();

app.use(helmet());

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'AstroJyothi API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/astro', astroRoutes);
app.use('/api/panchangam', panchangamRoutes);
app.use('/api/muhurtham', muhurthamRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/lang', langRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/panchangam', detailedPanchangamRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/dasa', dasaRoutes);
app.use('/api/matchmaking', matchmakingRoutes);
app.use('/api/charts', chartsRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

module.exports = app;
