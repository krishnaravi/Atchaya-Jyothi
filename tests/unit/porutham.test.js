const { calculatePorutham } = require('../../src/core/astrology/porutham');
const { calculatePlanets } = require('../../src/core/astrology/planets');

const PORUTHAM_NAMES = [
  'Dinam','Ganam','Mahendram','Sthree Dhirgham','Yoni',
  'Rasi','Rasiyathipathi','Rajju','Vetham','Vasiyam'
];

const moonLongFor = (date, time) => {
  const { positions } = calculatePlanets(date, time, 'Asia/Kolkata', 'en', 'lahiri');
  const moon = positions.find(p => p.planet === 'Moon');
  return (moon.rasi_number - 1) * 30 + moon.degrees;
};

describe('calculatePorutham', () => {
  // Verified via live API: boy=Uttara Ashadha/Sagittarius, girl=Chitra/Libra, score=6, rajju=false
  let result;
  let boyLong;
  let girlLong;

  beforeAll(() => {
    boyLong  = moonLongFor('1990-05-15', '06:30');
    girlLong = moonLongFor('1993-08-22', '10:00');
    result = calculatePorutham(boyLong, girlLong);
  });

  test('returns boy and girl with nakshatra and rasi', () => {
    expect(result.boy).toHaveProperty('nakshatra');
    expect(result.boy).toHaveProperty('rasi');
    expect(result.girl).toHaveProperty('nakshatra');
    expect(result.girl).toHaveProperty('rasi');
  });

  test('boy nakshatra is Uttara Ashadha', () => {
    expect(result.boy.nakshatra).toBe('Uttara Ashadha');
  });

  test('girl nakshatra is Chitra', () => {
    expect(result.girl.nakshatra).toBe('Chitra');
  });

  test('returns 10 porutham results', () => {
    expect(result.results).toHaveLength(10);
  });

  test('all 10 expected porutham names are present', () => {
    const names = result.results.map(r => r.name);
    PORUTHAM_NAMES.forEach(n => expect(names).toContain(n));
  });

  test('each result has name, compatible (bool), description', () => {
    result.results.forEach(r => {
      expect(r).toHaveProperty('name');
      expect(typeof r.compatible).toBe('boolean');
      expect(r).toHaveProperty('description');
    });
  });

  test('score equals count of compatible poruthams', () => {
    const compatible = result.results.filter(r => r.compatible).length;
    expect(result.score).toBe(compatible);
  });

  test('score is 6 for this known pair', () => {
    expect(result.score).toBe(6);
  });

  test('total is always 10', () => {
    expect(result.total).toBe(10);
  });

  test('rajju_dosha is false for this pair (different Rajju groups)', () => {
    expect(result.rajju_dosha).toBe(false);
  });

  test('does NOT return recommendation — controller owns that logic', () => {
    expect(result).not.toHaveProperty('recommendation');
  });

  test('same person always has rajju_dosha = true', () => {
    const same = calculatePorutham(boyLong, boyLong);
    expect(same.rajju_dosha).toBe(true);
  });

  test('score is between 0 and 10 for any input', () => {
    const r = calculatePorutham(0, 180);
    expect(r.score).toBeGreaterThanOrEqual(0);
    expect(r.score).toBeLessThanOrEqual(10);
  });
});
