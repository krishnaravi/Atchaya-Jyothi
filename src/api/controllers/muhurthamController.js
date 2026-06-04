const { findMuhurthamDates, checkMuhurtham } = require('../../core/muhurtham/muhurtham');
const { calculatePanchangam } = require('../../core/panchangam/panchangam');
const logger = require('../../utils/logger');

const getMuhurtham = async (req, res) => {
  try {
    const { start_date, end_date, occasion, latitude, longitude, timezone, lang } = req.body;
    if(!start_date || !end_date || !occasion || !latitude || !longitude || !timezone){
      return res.status(400).json({ success: false, message: 'start_date, end_date, occasion, latitude, longitude, timezone required' });
    }
    const occasions = ['marriage','house_warming','vehicle','business','education'];
    if(!occasions.includes(occasion)){
      return res.status(400).json({ success: false, message: 'occasion must be: ' + occasions.join(', ') });
    }
    const results = findMuhurthamDates(start_date, end_date, occasion, parseFloat(latitude), parseFloat(longitude), timezone, lang||'en');
    logger.info('Muhurtham calculated: ' + occasion + ' ' + start_date + ' to ' + end_date);
    res.json({ success: true, occasion, total: results.length, data: results });
  } catch(err) {
    logger.error(err);
    return res.status(500).json({ success: false, message: 'Muhurtham calculation failed' });
  }
};

module.exports = { getMuhurtham };
