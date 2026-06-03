const { calculatePanchangam } = require('../../core/panchangam/panchangam');
const { setCache, getCache } = require('../../utils/cache');
const logger = require('../../utils/logger');

const getPanchangam = async (req, res) => {
  try {
    const { date, latitude, longitude, timezone, lang } = req.body;
    if(!date || !latitude || !longitude || !timezone){
      return res.status(400).json({ success: false, message: 'date, latitude, longitude, timezone required' });
    }
    const cacheKey = 'panchangam:' + date + ':' + latitude + ':' + longitude + ':' + (lang||'en');
    const cached = await getCache(cacheKey);
    if(cached){
      logger.info('Panchangam from cache: ' + date);
      return res.json({ success: true, cached: true, data: cached });
    }
    const result = calculatePanchangam(date, parseFloat(latitude), parseFloat(longitude), timezone, lang||'en');
    await setCache(cacheKey, result, 86400);
    logger.info('Panchangam calculated: ' + date);
    res.json({ success: true, cached: false, data: result });
  } catch(err) {
    logger.error('Panchangam error: ' + err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getPanchangam };
