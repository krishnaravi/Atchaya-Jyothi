const https = require('https');
const logger = require('../../utils/logger');

const searchLocation = (query) => {
  return new Promise((resolve, reject) => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`;
    const options = { headers: { 'User-Agent': 'AstroJyothi/1.0' } };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
};

const getLocation = async (req, res) => {
  try {
    const { query } = req.body;
    if(!query) return res.status(400).json({ success: false, message: 'query required' });
    
    const results = await searchLocation(query);
    const locations = results.map(r => ({
      name: r.display_name,
      short_name: r.name,
      latitude: parseFloat(r.lat),
      longitude: parseFloat(r.lon),
      country: r.address?.country || '',
      state: r.address?.state || '',
      district: r.address?.county || r.address?.city_district || ''
    }));
    
    logger.info('Location search: ' + query);
    res.json({ success: true, data: locations });
  } catch(err) {
    logger.error(err);
    return res.status(500).json({ success: false, message: 'Location search failed' });
  }
};

module.exports = { getLocation };
