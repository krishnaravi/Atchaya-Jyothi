const Redis = require('ioredis');
const logger = require('./logger');

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  retryStrategy: (times) => Math.min(times * 50, 2000)
});

redis.on('connect', () => logger.info('Redis Connected!'));
redis.on('error', (err) => logger.error('Redis Error: ' + err.message));

const setCache = async (key, data, ttl = 3600) => {
  try {
    await redis.setex(key, ttl, JSON.stringify(data));
    return true;
  } catch(err) {
    logger.error('Cache set error: ' + err.message);
    return false;
  }
};

const getCache = async (key) => {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch(err) {
    logger.error('Cache get error: ' + err.message);
    return null;
  }
};

const deleteCache = async (key) => {
  try {
    await redis.del(key);
    return true;
  } catch(err) {
    return false;
  }
};

const getCacheStats = async () => {
  try {
    const info = await redis.info('stats');
    const keys = await redis.dbsize();
    return { keys, info: info.split('\n').slice(0,5).join('\n') };
  } catch(err) {
    return { error: err.message };
  }
};

module.exports = { setCache, getCache, deleteCache, getCacheStats, redis };
