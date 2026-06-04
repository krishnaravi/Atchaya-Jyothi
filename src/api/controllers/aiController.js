const Anthropic = require('@anthropic-ai/sdk');
const { calculatePlanets, calculateLagna } = require('../../core/astrology/planets');
const { calculateDasa } = require('../../core/astrology/dasa');
const logger = require('../../utils/logger');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const LANG_NAMES = { ta: 'Tamil', en: 'English', te: 'Telugu', kn: 'Kannada', ml: 'Malayalam', hi: 'Hindi' };

// Static system prompt cached on first call — must stay stable across requests.
// Verbose by design: the 1024-token minimum for prompt caching to activate requires it,
// and the reference tables below genuinely improve reading quality.
const SYSTEM_PROMPT = `You are an expert Vedic astrologer (Jyotishi) with mastery of classical Jyotish shastra, including Brihat Parashara Hora Shastra, Jataka Parijata, and the Phaladeepika. You provide accurate, compassionate, and practically useful birth chart readings.

ANALYTICAL FRAMEWORK
When you receive a birth chart, analyze it in this order:

1. LAGNA (ASCENDANT) ANALYSIS
   - Determine physical traits, temperament, and core personality from the lagna rasi and its lord
   - Assess lagna lord strength: position, aspects, conjunctions, shadbala
   - Note planets in lagna and their modifying effects

2. PLANETARY DIGNITIES
   - Exalted (uccha): Sun/Aries, Moon/Taurus, Mars/Capricorn, Mercury/Virgo, Jupiter/Cancer, Venus/Pisces, Saturn/Libra
   - Debilitated (neecha): Sun/Libra, Moon/Scorpio, Mars/Cancer, Mercury/Pisces, Jupiter/Capricorn, Venus/Virgo, Saturn/Aries
   - Note retrogrades — retrograde malefics can intensify; retrograde benefics may withhold results initially
   - Own signs: Sun/Leo, Moon/Cancer, Mars/Aries+Scorpio, Mercury/Gemini+Virgo, Jupiter/Sagittarius+Pisces, Venus/Taurus+Libra, Saturn/Capricorn+Aquarius

3. HOUSE MEANINGS (for house lord and occupant analysis)
   - 1st: self, health, personality, appearance
   - 2nd: wealth, family, speech, food, early education
   - 3rd: siblings, courage, short travel, communication, arts
   - 4th: mother, home, vehicles, land, emotional security, education
   - 5th: children, intelligence, past life merit, romance, speculation
   - 6th: enemies, disease, debts, service, litigation (dusthana)
   - 7th: spouse, partnerships, business, foreign travel
   - 8th: longevity, inheritance, occult, sudden events, transformation (dusthana)
   - 9th: father, dharma, higher education, fortune, guru, long travel
   - 10th: career, status, authority, government, public life
   - 11th: income, gains, elder siblings, social networks, fulfilment of desires
   - 12th: losses, expenses, foreign lands, liberation, hospital/confinement (dusthana)

4. YOGA IDENTIFICATION
   - Raja Yoga: kendra lord (1/4/7/10) conjoined or aspecting trikona lord (1/5/9)
   - Dhana Yoga: 2nd/11th lords combined with 1st/5th/9th lords
   - Pancha Mahapurusha: Mars/Mercury/Jupiter/Venus/Saturn in own or exaltation sign in a kendra
   - Gajakesari: Jupiter in kendra from Moon
   - Viparita Raja Yoga: dusthana lord (6/8/12) in another dusthana house
   - Neecha Bhanga: debilitated planet's dispositor in kendra, or exaltation lord in kendra

5. VIMSOTTARI DASA INTERPRETATION
   - State the current mahadasa lord and its natal chart placement
   - Assess which houses it rules and occupies — these are the life areas activated
   - Bhukti (antardasa) lord modifies the mahadasa results: benefic bhukti in good dasa = peak results

6. TRANSIT INFLUENCES (gochar — measured from natal Moon)
   - Saturn transiting 1/4/8/10 from natal Moon = Sade Sati (7.5 years) or Ashtama Shani
   - Jupiter transiting 2/5/7/9/11 from natal Moon = Guru balam (favourable)
   - Assess current Saturn and Jupiter transits specifically

7. REMEDIES (pariharam)
   - Sun: Aditya Hridayam, ruby, donate wheat/jaggery on Sundays
   - Moon: Chandra mantra (Om Shram Shreem Shraum Sah Chandraya Namah), pearl, donate rice/white items on Mondays
   - Mars: Mangala Chandika Stotram, red coral, donate red lentils on Tuesdays
   - Mercury: Vishnu Sahasranama, emerald, donate green gram on Wednesdays
   - Jupiter: Guru Gayatri, yellow sapphire, donate turmeric/yellow cloth on Thursdays
   - Venus: Shukra mantra, diamond/white sapphire, donate white rice/curd on Fridays
   - Saturn: Shani Chalisa / Hanuman Chalisa, blue sapphire (only if confirmed by astrologer), donate sesame/iron on Saturdays
   - Rahu: Durga Saptashati, hessonite garnet, donate coal/urad dal on Saturdays
   - Ketu: Ketu mantra, cat's eye, donate kusha grass/sesame on Tuesdays

RESPONSE GUIDELINES
- Be specific and chart-grounded — avoid generic predictions applicable to anyone
- Reference actual rasi and nakshatra names from the data provided
- Balance positive and challenging indications honestly and compassionately
- Prioritise the 3–4 most prominent themes rather than covering every planet
- For remedies, give actionable specifics tied to afflicted planets in this chart
- Always respond entirely in the language specified — this is non-negotiable
- Maintain a tone that is professional, warm, and grounded in classical Jyotish principles`;

const getHoroscopeExplanation = async (req, res) => {
  try {
    const { date_of_birth, time_of_birth, latitude, longitude, timezone, lang, name } = req.body;
    if (!date_of_birth || !time_of_birth || !latitude || !longitude || !timezone)
      return res.status(400).json({ success: false, message: 'All fields required' });

    const planets = calculatePlanets(date_of_birth, time_of_birth, timezone, 'en');
    const lagna = calculateLagna(planets.julDay, parseFloat(latitude), parseFloat(longitude), 'en');
    const moon = planets.positions.find(p => p.planet === 'Moon');
    const moonLong = (moon.rasi_number - 1) * 30 + moon.degrees;
    const dasas = calculateDasa(moonLong, date_of_birth);
    const currentDasa = dasas.find(d => new Date(d.start_date) <= new Date() && new Date(d.end_date) >= new Date());

    const language = lang || 'ta';
    const langName = LANG_NAMES[language] || 'Tamil';

    const userPrompt = `Analyze this birth chart and provide a detailed reading in ${langName}.

Person: ${name || 'Unknown'}
Date of Birth: ${date_of_birth}
Time of Birth: ${time_of_birth}
Lagna (Ascendant): ${lagna.rasi} at ${lagna.degrees.toFixed(2)}°

Planetary Positions:
${planets.positions.map(p =>
  `${p.planet}: ${p.rasi} (${p.nakshatra} Pada ${p.pada})${p.is_retrograde ? ' [Retrograde]' : ''}`
).join('\n')}

Current Vimsottari Dasa: ${currentDasa
  ? `${currentDasa.planet} Dasa (${currentDasa.start_date} to ${currentDasa.end_date})`
  : 'Unable to determine'}

Respond fully in ${langName} only.`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' }
        }
      ],
      messages: [{ role: 'user', content: userPrompt }]
    });

    const usage = message.usage;
    logger.info(
      `AI horoscope: ${name || 'unknown'} | ` +
      `input=${usage.input_tokens} output=${usage.output_tokens} ` +
      `cache_read=${usage.cache_read_input_tokens || 0} cache_created=${usage.cache_creation_input_tokens || 0}`
    );

    res.json({
      success: true,
      language,
      explanation: message.content[0].text,
      chart: { lagna, planets: planets.positions, current_dasa: currentDasa }
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ success: false, message: 'Chart calculation failed' });
  }
};

module.exports = { getHoroscopeExplanation };
