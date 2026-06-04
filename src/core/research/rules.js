const { calculatePlanets, calculateLagna } = require('../astrology/planets');
const { calculatePanchangam } = require('../panchangam/panchangam');

// Pulippani Siddhar Rules
const PULIPPANI_RULES = {
  benefic_planets: ['Jupiter','Venus','Mercury','Moon'],
  malefic_planets: ['Saturn','Mars','Rahu','Ketu','Sun'],
  benefic_nakshatras: [3,4,6,7,8,11,12,13,15,17,20,21,22,25,26,27],
  malefic_nakshatras: [1,2,5,9,10,14,16,18,19,24],
  strong_yogas: ['Siddha','Shubha','Vriddhi','Dhruva','Harshana'],
  weak_yogas: ['Vishkamba','Shula','Ganda','Vyaghata','Vajra','Vyatipata','Parigha','Vaidhriti']
};

// Rahu Kalam Research Rules
const RAHU_RESEARCH_RULES = {
  avoid_always: ['marriage','thread_ceremony','new_business','travel_start'],
  avoid_sometimes: ['house_warming','vehicle_purchase'],
  allowed: ['medical_treatment','legal_matters','government_work'],
  special_note: 'Rahu Kalam on Saturdays is most powerful - avoid at all costs'
};

// Nakshatra Linkage Rules
const NAKSHATRA_LINKS = {
  friendly: {1:[4,6,11],2:[5,7,12],3:[6,8,13],4:[7,9,14],5:[8,10,15],6:[9,11,16],7:[10,12,17],8:[11,13,18],9:[12,14,19],10:[13,15,20],11:[14,16,21],12:[15,17,22],13:[16,18,23],14:[17,19,24],15:[18,20,25],16:[19,21,26],17:[20,22,27],18:[21,23,1],19:[22,24,2],20:[23,25,3],21:[24,26,4],22:[25,27,5],23:[26,1,6],24:[27,2,7],25:[1,3,8],26:[2,4,9],27:[3,5,10]},
  enemy: {1:[9,14,19],2:[10,15,20],3:[11,16,21],4:[12,17,22],5:[13,18,23],6:[14,19,24],7:[15,20,25],8:[16,21,26],9:[17,22,27],10:[18,23,1],11:[19,24,2],12:[20,25,3],13:[21,26,4],14:[22,27,5],15:[23,1,6],16:[24,2,7],17:[25,3,8],18:[26,4,9],19:[27,5,10],20:[1,6,11],21:[2,7,12],22:[3,8,13],23:[4,9,14],24:[5,10,15],25:[6,11,16],26:[7,12,17],27:[8,13,18]}
};

// Spouse Star Prediction Rules
const SPOUSE_STAR_RULES = {
  male: {
    '1': [2,4,6], '2': [3,5,7], '3': [4,6,8], '4': [5,7,9],
    '5': [6,8,10], '6': [7,9,11], '7': [8,10,12], '8': [9,11,13],
    '9': [10,12,14], '10': [11,13,15], '11': [12,14,16], '12': [13,15,17],
    '13': [14,16,18], '14': [15,17,19], '15': [16,18,20], '16': [17,19,21],
    '17': [18,20,22], '18': [19,21,23], '19': [20,22,24], '20': [21,23,25],
    '21': [22,24,26], '22': [23,25,27], '23': [24,26,1], '24': [25,27,2],
    '25': [26,1,3], '26': [27,2,4], '27': [1,3,5]
  },
  female: {
    '1': [27,25,23], '2': [1,26,24], '3': [2,27,25], '4': [3,1,26],
    '5': [4,2,27], '6': [5,3,1], '7': [6,4,2], '8': [7,5,3],
    '9': [8,6,4], '10': [9,7,5], '11': [10,8,6], '12': [11,9,7],
    '13': [12,10,8], '14': [13,11,9], '15': [14,12,10], '16': [15,13,11],
    '17': [16,14,12], '18': [17,15,13], '19': [18,16,14], '20': [19,17,15],
    '21': [20,18,16], '22': [21,19,17], '23': [22,20,18], '24': [23,21,19],
    '25': [24,22,20], '26': [25,23,21], '27': [26,24,22]
  }
};
const predictSpouseStar = (nakshatraNumber, gender) => {
  const key = nakshatraNumber.toString();
  const rules = gender === 'male' ? SPOUSE_STAR_RULES.male : SPOUSE_STAR_RULES.female;
  const predicted = rules[key] || [];
  return { nakshatra: nakshatraNumber, gender, predicted_spouse_nakshatras: predicted };
};

const checkNakshatraCompatibility = (nakshatra1, nakshatra2) => {
  const friendly1 = NAKSHATRA_LINKS.friendly[nakshatra1] || [];
  const enemy1 = NAKSHATRA_LINKS.enemy[nakshatra1] || [];
  let compatibility = 'neutral';
  if(friendly1.includes(nakshatra2)) compatibility = 'friendly';
  if(enemy1.includes(nakshatra2)) compatibility = 'enemy';
  return { nakshatra1, nakshatra2, compatibility };
};

const analyzePulippani = (planets, panchangam) => {
  const analysis = { benefic_count: 0, malefic_count: 0, strong_yoga: false, observations: [] };
  for(const p of planets){
    if(PULIPPANI_RULES.benefic_planets.includes(p.planet)) analysis.benefic_count++;
    if(PULIPPANI_RULES.malefic_planets.includes(p.planet)) analysis.malefic_count++;
    const nakIdx = Math.floor(((p.rasi_number - 1) * 30 + p.degrees) / (360 / 27));
    if (PULIPPANI_RULES.benefic_nakshatras.includes(nakIdx + 1)) analysis.observations.push(p.planet + ' in benefic nakshatra');
  }
  if(PULIPPANI_RULES.strong_yogas.includes(panchangam.yoga)){ analysis.strong_yoga = true; analysis.observations.push('Strong Yoga: ' + panchangam.yoga); }
  if(PULIPPANI_RULES.weak_yogas.includes(panchangam.yoga)){ analysis.observations.push('Weak Yoga: ' + panchangam.yoga); }
  return analysis;
};

module.exports = { predictSpouseStar, checkNakshatraCompatibility, analyzePulippani, PULIPPANI_RULES, RAHU_RESEARCH_RULES, NAKSHATRA_LINKS, SPOUSE_STAR_RULES };
