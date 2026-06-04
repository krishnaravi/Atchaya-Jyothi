const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const requestId = require('./api/middleware/requestId');
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
app.use(requestId);

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

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many AI requests, please try again later.' }
});
app.use('/api/ai', aiLimiter);

const pdfLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many PDF requests, please try again later.' }
});
app.use('/api/pdf', pdfLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
morgan.token('request-id', (req) => req.requestId);
app.use(morgan(':request-id :method :url :status :res[content-length] - :response-time ms'));

app.get('/health', async (req, res) => {
  const db    = require('./config/database');
  const { redis } = require('./utils/cache');

  const checks = {};

  try {
    await db.execute('SELECT 1');
    checks.database = 'ok';
  } catch {
    checks.database = 'error';
  }

  try {
    const pong = await redis.ping();
    checks.cache = pong === 'PONG' ? 'ok' : 'error';
  } catch {
    checks.cache = 'error';
  }

  const allOk  = Object.values(checks).every(v => v === 'ok');
  const status = allOk ? 'healthy' : 'degraded';

  res.status(allOk ? 200 : 503).json({
    success: allOk,
    status,
    version: '1.0.0',
    uptime: Math.floor(process.uptime()),
    checks,
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    service: 'AstroJyothi API',
    version: '1.0.0',
    status: 'online',
    docs: '/docs'
  });
});

const openApiSpec = yaml.load(
  fs.readFileSync(path.join(__dirname, '../docs/openapi.yaml'), 'utf8')
);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec, {
  customSiteTitle: 'AstroJyothi API Docs',
  swaggerOptions: { persistAuthorization: true }
}));

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
  res.status(500).json({ success: false, message: 'Internal server error', requestId: req.requestId });
});

module.exports = app;
