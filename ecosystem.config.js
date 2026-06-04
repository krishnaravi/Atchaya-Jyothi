module.exports = {
  apps: [{
    name:               'astrojyothi',
    script:             './server.js',
    instances:          'max',
    exec_mode:          'cluster',
    max_memory_restart: '400M',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
