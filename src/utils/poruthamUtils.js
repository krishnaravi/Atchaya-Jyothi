const getRecommendation = (score, rajjuDosha) => {
  if (rajjuDosha || score < 4) return 'Not Recommended';
  if (score >= 8) return 'Excellent Match';
  if (score >= 6) return 'Good Match';
  return 'Average Match';
};

const getSummary = (score, rajjuDosha, recommendation) => {
  const rajjuTamil = rajjuDosha ? 'ரஜ்ஜு தோஷம் உள்ளது.' : 'ரஜ்ஜு தோஷம் இல்லை.';
  const rajjuEn    = rajjuDosha ? 'Rajju dosha detected.' : 'No Rajju dosha detected.';
  const recMap = {
    'Excellent Match': ['திருமணத்திற்கு மிகவும் சிறந்த பொருத்தம்.', 'Excellent match for marriage.'],
    'Good Match':      ['திருமணத்திற்கு நல்ல பொருத்தம்.',          'Good match for marriage.'],
    'Average Match':   ['சராசரி பொருத்தம். மேலும் ஆலோசனை தேவை.',  'Average compatibility. Further analysis recommended.'],
    'Not Recommended': ['திருமணம் பரிந்துரைக்கப்படவில்லை.',        'This match is not recommended for marriage.'],
  };
  const [recTamil, recEn] = recMap[recommendation];
  return {
    tamil:   `10ல் ${score} பொருத்தங்கள் அமைந்துள்ளன. ${rajjuTamil} ${recTamil}`,
    english: `${score} out of 10 poruthams matched. ${rajjuEn} ${recEn}`
  };
};

const buildPoruthamResponse = (result) => {
  const recommendation = getRecommendation(result.score, result.rajju_dosha);
  const { tamil, english } = getSummary(result.score, result.rajju_dosha, recommendation);
  return {
    boy:             result.boy,
    girl:            result.girl,
    score:           result.score,
    percentage:      Math.round((result.score / 10) * 100),
    recommendation,
    poruthams:       result.results,
    rajju_dosha:     result.rajju_dosha,
    summary_tamil:   tamil,
    summary_english: english
  };
};

module.exports = { getRecommendation, getSummary, buildPoruthamResponse };
