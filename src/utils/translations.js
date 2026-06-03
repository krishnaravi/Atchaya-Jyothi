const LANGUAGES = ['ta','en','te','kn','ml','hi'];

const TRANSLATIONS = {
  planets: {
    Sun:     {ta:'சூரியன்',  en:'Sun',     te:'సూర్యుడు', kn:'ಸೂರ್ಯ',   ml:'സൂര്യൻ',   hi:'सूर्य'},
    Moon:    {ta:'சந்திரன்', en:'Moon',    te:'చంద్రుడు', kn:'ಚಂದ್ರ',   ml:'ചന്ദ്രൻ',   hi:'चंद्र'},
    Mars:    {ta:'செவ்வாய்', en:'Mars',    te:'అంగారకుడు',kn:'ಮಂಗಳ',   ml:'ചൊവ്വ',    hi:'मंगल'},
    Mercury: {ta:'புதன்',    en:'Mercury', te:'బుధుడు',   kn:'ಬುಧ',     ml:'ബുധൻ',     hi:'बुध'},
    Jupiter: {ta:'குரு',     en:'Jupiter', te:'గురువు',   kn:'ಗುರು',    ml:'ഗുരു',     hi:'गुरु'},
    Venus:   {ta:'சுக்கிரன்',en:'Venus',   te:'శుక్రుడు', kn:'ಶುಕ್ರ',   ml:'ശുക്രൻ',   hi:'शुक्र'},
    Saturn:  {ta:'சனி',      en:'Saturn',  te:'శనిగ్రహం', kn:'ಶನಿ',     ml:'ശനി',      hi:'शनि'},
    Rahu:    {ta:'ராகு',     en:'Rahu',    te:'రాహువు',   kn:'ರಾಹು',    ml:'രാഹു',     hi:'राहु'},
    Ketu:    {ta:'கேது',     en:'Ketu',    te:'కేతువు',   kn:'ಕೇತು',    ml:'കേതു',     hi:'केतु'}
  },
  rasi: {
    Aries:       {ta:'மேஷம்',      en:'Aries',       te:'మేషం',      kn:'ಮೇಷ',      ml:'മേടം',      hi:'मेष'},
    Taurus:      {ta:'ரிஷபம்',     en:'Taurus',      te:'వృషభం',     kn:'ವೃಷಭ',     ml:'ഇടവം',      hi:'वृषभ'},
    Gemini:      {ta:'மிதுனம்',    en:'Gemini',      te:'మిధునం',    kn:'ಮಿಥುನ',    ml:'മിഥുനം',    hi:'मिथुन'},
    Cancer:      {ta:'கடகம்',      en:'Cancer',      te:'కర్కాటకం',  kn:'ಕರ್ಕಾಟಕ',  ml:'കർക്കടകം',  hi:'कर्क'},
    Leo:         {ta:'சிம்மம்',    en:'Leo',         te:'సింహం',     kn:'ಸಿಂಹ',     ml:'ചിങ്ങം',    hi:'सिंह'},
    Virgo:       {ta:'கன்னி',      en:'Virgo',       te:'కన్య',      kn:'ಕನ್ಯಾ',    ml:'കന്നി',     hi:'कन्या'},
    Libra:       {ta:'துலாம்',     en:'Libra',       te:'తుల',       kn:'ತುಲಾ',     ml:'തുലാം',     hi:'तुला'},
    Scorpio:     {ta:'விருச்சிகம்',en:'Scorpio',     te:'వృశ్చికం',  kn:'ವೃಶ್ಚಿಕ',  ml:'വൃശ്ചികം',  hi:'वृश्चिक'},
    Sagittarius: {ta:'தனுசு',      en:'Sagittarius', te:'ధనుస్సు',   kn:'ಧನು',      ml:'ധനു',       hi:'धनु'},
    Capricorn:   {ta:'மகரம்',      en:'Capricorn',   te:'మకరం',      kn:'ಮಕರ',      ml:'മകരം',      hi:'मकर'},
    Aquarius:    {ta:'கும்பம்',    en:'Aquarius',    te:'కుంభం',     kn:'ಕುಂಭ',     ml:'കുംഭം',     hi:'कुंभ'},
    Pisces:      {ta:'மீனம்',      en:'Pisces',      te:'మీనం',      kn:'ಮೀನ',      ml:'മീനം',      hi:'मीन'}
  }
};

const translate = (category, key, lang) => {
  const langCode = LANGUAGES.includes(lang) ? lang : 'en';
  if(TRANSLATIONS[category] && TRANSLATIONS[category][key]){
    return TRANSLATIONS[category][key][langCode] || key;
  }
  return key;
};

const translatePlanets = (planets, lang) => {
  return planets.map(p => ({
    ...p,
    planet_name: translate('planets', p.planet, lang),
    rasi_name: translate('rasi', p.rasi, lang)
  }));
};

const getSupportedLanguages = () => {
  return [
    {code:'ta', name:'Tamil', native:'தமிழ்'},
    {code:'en', name:'English', native:'English'},
    {code:'te', name:'Telugu', native:'తెలుగు'},
    {code:'kn', name:'Kannada', native:'ಕನ್ನಡ'},
    {code:'ml', name:'Malayalam', native:'മലയാളം'},
    {code:'hi', name:'Hindi', native:'हिंदी'}
  ];
};

module.exports = { translate, translatePlanets, getSupportedLanguages, TRANSLATIONS, LANGUAGES };
