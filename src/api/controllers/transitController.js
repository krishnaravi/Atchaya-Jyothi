const { calculateGochar, findPlanetIngresses } = require('../../core/astrology/gochar');
const logger = require('../../utils/logger');
const moment = require('moment-timezone');

const VALID_PLANETS = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'];

const getGochar = async (req, res) => {
  try {
    const { date_of_birth, time_of_birth, latitude, longitude, timezone,
            transit_date, transit_time, ayanamsa } = req.body;

    if (!date_of_birth || !time_of_birth || !latitude || !longitude || !timezone)
      return res.status(400).json({ success: false, message: 'date_of_birth, time_of_birth, latitude, longitude, timezone required' });

    const today = moment.tz(timezone).format('YYYY-MM-DD');
    const result = calculateGochar(
      date_of_birth, time_of_birth,
      parseFloat(latitude), parseFloat(longitude),
      timezone,
      transit_date || today,
      transit_time || '00:00',
      ayanamsa || 'lahiri'
    );

    logger.info(`Gochar: ${date_of_birth} → ${transit_date || today}`);
    res.json({ success: true, data: result });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ success: false, message: 'Chart calculation failed' });
  }
};

const getPlanetIngress = async (req, res) => {
  try {
    const { planet, from_date, to_date, timezone, ayanamsa } = req.body;

    if (!planet || !from_date || !to_date || !timezone)
      return res.status(400).json({ success: false, message: 'planet, from_date, to_date, timezone required' });

    if (!VALID_PLANETS.includes(planet))
      return res.status(400).json({ success: false, message: `planet must be one of: ${VALID_PLANETS.join(', ')}` });

    const from = new Date(from_date);
    const to   = new Date(to_date);
    if (isNaN(from) || isNaN(to) || to <= from)
      return res.status(400).json({ success: false, message: 'Invalid date range' });

    const TWO_YEARS = 2 * 365 * 24 * 60 * 60 * 1000;
    if (to - from > TWO_YEARS)
      return res.status(400).json({ success: false, message: 'Date range cannot exceed 2 years' });

    const ingresses = findPlanetIngresses(planet, from_date, to_date, timezone, ayanamsa || 'lahiri');

    logger.info(`Ingress: ${planet} ${from_date}→${to_date} (${ingresses.length} found)`);
    res.json({ success: true, planet, from_date, to_date, count: ingresses.length, data: ingresses });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ success: false, message: 'Chart calculation failed' });
  }
};

module.exports = { getGochar, getPlanetIngress };
