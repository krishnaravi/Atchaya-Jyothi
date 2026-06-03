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
