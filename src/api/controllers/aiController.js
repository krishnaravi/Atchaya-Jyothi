const Anthropic = require('@anthropic-ai/sdk');
const { calculatePlanets, calculateLagna } = require('../../core/astrology/planets');
const { calculateDasa, calculateBhukti } = require('../../core/astrology/dasa');
const { calculatePanchangam } = require('../../core/panchangam/panchangam');
const logger = require('../../utils/logger');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const getHoroscopeExplanation = async (req, res) => {
  try {
    const { date_of_birth, time_of_birth, latitude, longitude, timezone, lang, name } = req.body;
    if(!date_of_birth || !time_of_birth || !latitude || !longitude || !timezone){
      return res.status(400).json({ success: false, message: 'All fields required' });
    }
    const planets = calculatePlanets(date_of_birth, time_of_birth, timezone, 'en');
    const lagna = calculateLagna(planets.julDay, parseFloat(latitude), parseFloat(longitude), 'en');
    const moon = planets.positions.find(p => p.planet === 'Moon');
    const moonLong = (moon.rasi_number - 1) * 30 + moon.degrees;
    const dasas = calculateDasa(moonLong, date_of_birth);
    const currentDasa = dasas.find(d => new Date(d.start_date) <= new Date() && new Date(d.end_date) >= new Date());
    const language = lang || 'ta';
    const langNames = {ta:'Tamil',en:'English',te:'Telugu',kn:'Kannada',ml:'Malayalam',hi:'Hindi'};
    const prompt = `You are an expert Vedic astrologer. Analyze this birth chart and provide a detailed explanation in ${langNames[language] || 'Tamil'}.

Person: ${name || 'Unknown'}
Date of Birth: ${date_of_birth}
Time of Birth: ${time_of_birth}
Lagna (Ascendant): ${lagna.rasi} at ${lagna.degrees}°

Planetary Positions:
${planets.positions.map(p => p.planet + ': ' + p.rasi + ' (' + p.nakshatra + ' Pada ' + p.pada + ')' + (p.is_retrograde ? ' [Retrograde]' : '')).join('\n')}

Current Dasa: ${currentDasa ? currentDasa.planet + ' Dasa (' + currentDasa.start_date + ' to ' + currentDasa.end_date + ')' : 'Unknown'}

Please provide:
1. Overall personality based on Lagna
2. Key planetary influences
3. Current Dasa effects
4. General predictions for next 1 year
5. Remedies if needed

Respond in ${langNames[language] || 'Tamil'} language only.`;

    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }]
    });

    logger.info('AI horoscope generated for: ' + (name || 'unknown'));
    res.json({ success: true, language, explanation: message.content[0].text, chart: { lagna, planets: planets.positions, current_dasa: currentDasa } });
  } catch(err) {
    logger.error('AI error: ' + err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getHoroscopeExplanation };
