const { calculatePanchangam } = require('../../core/panchangam/panchangam');
const logger = require('../../utils/logger');

const getPanchangam = async (req, res) => {
  try {
    const { date, latitude, longitude, timezone, lang } = req.body;
    if (!date || !latitude || !longitude || !timezone) {
      return res.status(400).json({ success: false, message: 'date, latitude, longitude, timezone required' });
    }
    const result = calculatePanchangam(date, parseFloat(latitude), parseFloat(longitude), timezone, lang || 'en');
    logger.info('Panchangam calculated: ' + date);
    res.json({ success: true, data: result });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ success: false, message: 'Panchangam calculation failed' });
  }
};

module.exports = { getPanchangam };
