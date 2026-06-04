require('dotenv').config();

const REQUIRED_ENV = ['JWT_SECRET', 'REFRESH_TOKEN_SECRET', 'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missing = REQUIRED_ENV.filter(k => !process.env[k]);
if (missing.length) {
  console.error('FATAL: missing required environment variables:', missing.join(', '));
  process.exit(1);
}

const app = require('./src/app');
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('AstroJyothi API running on port ' + port);
  console.log('Environment: ' + (process.env.NODE_ENV || 'development'));
  console.log('Health check: http://localhost:' + port + '/health');
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});
