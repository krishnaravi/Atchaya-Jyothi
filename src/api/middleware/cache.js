const { setCache, getCache } = require('../../utils/cache');
const logger = require('../../utils/logger');

/**
 * Express middleware factory for Redis caching.
 * @param {Function} keyFn  - (req) => string cache key
 * @param {number}   ttl    - TTL in seconds
 */
const cacheMiddleware = (keyFn, ttl) => async (req, res, next) => {
  const key = keyFn(req);

  const cached = await getCache(key);
  if (cached) {
    logger.info(`Cache HIT: ${key}`);
    return res.json({ success: true, cached: true, data: cached });
  }

  const originalJson = res.json.bind(res);
  res.json = function (body) {
    res.json = originalJson;
    if (body && body.success === true && body.data !== undefined) {
      setCache(key, body.data, ttl).catch(err =>
        logger.warn('Cache store failed: ' + err.message)
      );
      body.cached = false;
      logger.info(`Cache SET: ${key} (ttl=${ttl}s)`);
    }
    return originalJson(body);
  };

  next();
};

module.exports = { cacheMiddleware };
