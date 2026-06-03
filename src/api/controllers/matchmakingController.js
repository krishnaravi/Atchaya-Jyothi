const { calculatePorutham } = require('../../core/astrology/porutham');
const logger = require('../../utils/logger');

const NAKSHATRA_COUNT = 27;
const NAK_SPAN = 360 / NAKSHATRA_COUNT;

const getRecommendation = (score, rajjuDosha) => {
  if (rajjuDosha || score < 4) return 'Not Recommended';
  if (score >= 8) return 'Excellent Match';
  if (score >= 6) return 'Good Match';
  return 'Average Match';
};

const generateSummary = (score, rajjuDosha, recommendation) => {
  const rajjuTamil = rajjuDosha ? 'ரஜ்ஜு தோஷம் உள்ளது.' : 'ரஜ்ஜு தோஷம் இல்லை.';
  const rajjuEn = rajjuDosha ? 'Rajju dosha detected.' : 'No Rajju dosha detected.';

  const recMap = {
    'Excellent Match': ['திருமணத்திற்கு மிகவும் சிறந்த பொருத்தம்.', 'Excellent match for marriage.'],
    'Good Match':      ['திருமணத்திற்கு நல்ல பொருத்தம்.',         'Good match for marriage.'],
    'Average Match':   ['சராசரி பொருத்தம். மேலும் ஆலோசனை தேவை.', 'Average compatibility. Further analysis recommended.'],
    'Not Recommended': ['திருமணம் பரிந்துரைக்கப்படவில்லை.',       'This match is not recommended for marriage.'],
  };

  const [recTamil, recEn] = recMap[recommendation];
  return {
    tamil:   `10ல் ${score} பொருத்தங்கள் அமைந்துள்ளன. ${rajjuTamil} ${recTamil}`,
    english: `${score} out of 10 poruthams matched. ${rajjuEn} ${recEn}`
  };
};

const getMatchmaking = async (req, res) => {
  try {
    const boyIdx  = parseInt(req.query.boyNakshatra,  10);
    const girlIdx = parseInt(req.query.girlNakshatra, 10);

    if (isNaN(boyIdx) || isNaN(girlIdx) || boyIdx < 0 || boyIdx > 26 || girlIdx < 0 || girlIdx > 26) {
      return res.status(400).json({ success: false, message: 'boyNakshatra and girlNakshatra must be integers 0–26' });
    }

    // Use midpoint of each nakshatra span as the representative moon longitude
    const boyMoonLong  = (boyIdx  + 0.5) * NAK_SPAN;
    const girlMoonLong = (girlIdx + 0.5) * NAK_SPAN;

    const result       = calculatePorutham(boyMoonLong, girlMoonLong);
    const recommendation = getRecommendation(result.score, result.rajju_dosha);
    const { tamil, english } = generateSummary(result.score, result.rajju_dosha, recommendation);

    logger.info(`Matchmaking: nak ${boyIdx} × ${girlIdx} → ${result.score}/10`);

    res.json({
      success: true,
      data: {
        boy:            result.boy,
        girl:           result.girl,
        score:          result.score,
        percentage:     Math.round((result.score / 10) * 100),
        recommendation,
        poruthams:      result.results,
        rajjuDosha:     result.rajju_dosha,
        summaryTamil:   tamil,
        summaryEnglish: english
      }
    });
  } catch (err) {
    logger.error('Matchmaking error: ' + err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getMatchmaking };
