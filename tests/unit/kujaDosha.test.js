const { calculateKujaDosha } = require('../../src/core/astrology/kujaDosha');
const { calculatePlanets, calculateLagna } = require('../../src/core/astrology/planets');

const DOSHA_HOUSES = new Set([1, 2, 4, 7, 8, 12]);

const getChart = (date, time) => {
  const planets = calculatePlanets(date, time, 'Asia/Kolkata', 'en', 'lahiri');
  const lagna   = calculateLagna(planets.julDay, 13.0827, 80.2707, 'en');
  return { positions: planets.positions, lagna };
};

describe('calculateKujaDosha', () => {
  // DOB 1990-05-15: Mars in Aquarius, house 9 from Gemini lagna → no dosha
  let result;

  beforeAll(() => {
    const { positions, lagna } = getChart('1990-05-15', '06:30');
    result = calculateKujaDosha(positions, lagna);
  });

  test('returns has_dosha boolean', () => {
    expect(typeof result.has_dosha).toBe('boolean');
  });

  test('mars_position has rasi, rasi_number, house, degrees', () => {
    expect(result.mars_position).toHaveProperty('rasi');
    expect(result.mars_position).toHaveProperty('rasi_number');
    expect(result.mars_position).toHaveProperty('house');
    expect(result.mars_position).toHaveProperty('degrees');
  });

  test('checks object has from_lagna, from_moon, from_venus', () => {
    expect(result.checks).toHaveProperty('from_lagna');
    expect(result.checks).toHaveProperty('from_moon');
    expect(result.checks).toHaveProperty('from_venus');
  });

  test('each check has house and dosha boolean', () => {
    ['from_lagna', 'from_moon', 'from_venus'].forEach(ref => {
      expect(typeof result.checks[ref].house).toBe('number');
      expect(typeof result.checks[ref].dosha).toBe('boolean');
    });
  });

  test('dosha_count matches number of true checks', () => {
    const count = Object.values(result.checks).filter(c => c.dosha).length;
    expect(result.dosha_count).toBe(count);
  });

  test('has_dosha is false when dosha_count < 2 for 1990-05-15', () => {
    expect(result.has_dosha).toBe(false);
  });

  test('Mars is NOT in a dosha house from lagna for 1990-05-15 (house 9)', () => {
    expect(DOSHA_HOUSES.has(result.checks.from_lagna.house)).toBe(false);
    expect(result.checks.from_lagna.dosha).toBe(false);
  });

  test('is_cancelled is boolean', () => {
    expect(typeof result.is_cancelled).toBe('boolean');
  });

  test('cancellations is an array', () => {
    expect(Array.isArray(result.cancellations)).toBe(true);
  });
});
