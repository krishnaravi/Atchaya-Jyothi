const { getJulianDay } = require('../../core/astrology/planets');
const { getNakshatraDetails, getTithiDetails, getYogaDetails, getKaranaDetails } = require('../../core/panchangam/detailed');
const { getLagnaTimings } = require('../../core/panchangam/lagna');
const { getMuhurthamTimings, getDaySpecials } = require('../../core/panchangam/muhurtham_times');
const { calculatePanchangam } = require('../../core/panchangam/panchangam');
const { setCache, getCache } = require('../../utils/cache');
const logger = require('../../utils/logger');
const moment = require('moment-timezone');

const getDetailedPanchangam = async (req, res) => {
  try {
    const { date, latitude, longitude, timezone, lang } = req.body;
    if(!date || !latitude || !longitude || !timezone){
      return res.status(400).json({ success: false, message: 'date, latitude, longitude, timezone required' });
    }

    const cacheKey = 'detailed_panchangam:' + date + ':' + latitude + ':' + longitude;
    const cached = await getCache(cacheKey);
    if(cached) return res.json({ success: true, cached: true, data: cached });

    const julDay = getJulianDay(date, '06:00', timezone);
    const dt = moment.tz(date, 'YYYY-MM-DD', timezone);
    const dayOfWeek = dt.day();

    const basic = calculatePanchangam(date, parseFloat(latitude), parseFloat(longitude), timezone, lang||'en');
    const nakshatra = getNakshatraDetails(julDay, timezone);
    const tithi = getTithiDetails(julDay, timezone);
    const yoga = getYogaDetails(julDay, timezone);
    const karana = getKaranaDetails(julDay, timezone);
    const lagnas = getLagnaTimings(julDay, parseFloat(latitude), parseFloat(longitude), timezone);
    const muhurthams = getMuhurthamTimings(date, basic.sunrise, basic.sunset, dayOfWeek);
    const specials = getDaySpecials(dayOfWeek);

    const result = {
      date, day: basic.day,
      sunrise: basic.sunrise, sunset: basic.sunset,
      nakshatra: { ...nakshatra },
      tithi: { ...tithi },
      yoga: { ...yoga },
      karana: { ...karana },
      rahu_kalam: basic.rahu_kalam,
      yamagandam: basic.yamagandam,
      gulikai: basic.gulikai,
      lagna_timings: lagnas,
      muhurtham_timings: muhurthams,
      varasoolai: specials.varasoolai,
      nethram: specials.nethram,
      jeevan: specials.jeevan
    };

    await setCache(cacheKey, result, 86400);
    logger.info('Detailed Panchangam: ' + date);
    res.json({ success: true, cached: false, data: result });
  } catch(err) {
    logger.error(err);
    return res.status(500).json({ success: false, message: 'Panchangam calculation failed' });
  }
};

module.exports = { getDetailedPanchangam };
