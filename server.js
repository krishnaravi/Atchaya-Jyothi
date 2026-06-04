require('dotenv').config();

const REQUIRED_ENV = ['JWT_SECRET', 'REFRESH_TOKEN_SECRET', 'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missing = REQUIRED_ENV.filter(k => !process.env[k]);
if (missing.length) {
  console.error('FATAL: missing required environment variables:', missing.join(', '));
  process.exit(1);
}

const app = require('./src/app');
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log('AstroJyothi API running on port ' + port);
  console.log('Environment: ' + (process.env.NODE_ENV || 'development'));
  console.log('Health check: http://localhost:' + port + '/health');
});

const shutdown = (signal) => {
  console.log(`${signal} received — shutting down gracefully`);
  server.close(async () => {
    try {
      const db = require('./src/config/database');
      const { redis } = require('./src/utils/cache');
      await db.end();
      await redis.quit();
    } catch (e) {
      console.error('Shutdown cleanup error:', e.message);
    }
    process.exit(0);
  });
  // Force exit if in-flight requests do not finish within 10 s
  setTimeout(() => { console.error('Forced exit after timeout'); process.exit(1); }, 10000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});
