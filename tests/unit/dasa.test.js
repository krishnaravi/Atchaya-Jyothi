const { calculateDasa, calculateBhukti } = require('../../src/core/astrology/dasa');
const { calculatePlanets } = require('../../src/core/astrology/planets');

const DASA_ORDER = ['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury'];

const moonLongFor = (date, time) => {
  const { positions } = calculatePlanets(date, time, 'Asia/Kolkata', 'en', 'lahiri');
  const moon = positions.find(p => p.planet === 'Moon');
  return (moon.rasi_number - 1) * 30 + moon.degrees;
};

describe('calculateDasa', () => {
  let dasas;

  beforeAll(() => {
    dasas = calculateDasa(moonLongFor('1990-05-15', '06:30'), '1990-05-15');
  });

  test('returns exactly 9 dasas', () => {
    expect(dasas).toHaveLength(9);
  });

  test('total years sum to 120', () => {
    const total = dasas.reduce((sum, d) => sum + d.years, 0);
    expect(total).toBe(120);
  });

  test('each dasa has planet, start_date, end_date, years', () => {
    dasas.forEach(d => {
      expect(d).toHaveProperty('planet');
      expect(d).toHaveProperty('start_date');
      expect(d).toHaveProperty('end_date');
      expect(d).toHaveProperty('years');
      expect(DASA_ORDER).toContain(d.planet);
    });
  });

  test('dasa dates are contiguous — no gaps between periods', () => {
    for (let i = 1; i < dasas.length; i++) {
      expect(dasas[i].start_date).toBe(dasas[i - 1].end_date);
    }
  });

  test('current dasa on 2026-06-03 is Rahu for DOB 1990-05-15', () => {
    const today = new Date('2026-06-03');
    const current = dasas.find(d =>
      new Date(d.start_date) <= today && new Date(d.end_date) >= today
    );
    expect(current).toBeDefined();
    expect(current.planet).toBe('Rahu');
  });

  test('Rahu dasa spans 18 years', () => {
    const rahu = dasas.find(d => d.planet === 'Rahu');
    expect(rahu.years).toBe(18);
  });
});

describe('calculateBhukti', () => {
  test('returns 9 bhuktis', () => {
    const bhuktis = calculateBhukti('Rahu', '2012-11-09', '2030-11-10');
    expect(bhuktis).toHaveLength(9);
  });

  test('each bhukti has planet, start_date, end_date', () => {
    const bhuktis = calculateBhukti('Jupiter', '2030-11-10', '2046-11-10');
    bhuktis.forEach(b => {
      expect(b).toHaveProperty('planet');
      expect(b).toHaveProperty('start_date');
      expect(b).toHaveProperty('end_date');
      expect(DASA_ORDER).toContain(b.planet);
    });
  });

  test('bhukti dates are contiguous', () => {
    const bhuktis = calculateBhukti('Sun', '2000-01-01', '2006-01-01');
    for (let i = 1; i < bhuktis.length; i++) {
      expect(bhuktis[i].start_date).toBe(bhuktis[i - 1].end_date);
    }
  });

  test('first bhukti of a dasa belongs to that dasa lord', () => {
    const bhuktis = calculateBhukti('Moon', '1995-11-10', '2005-11-10');
    expect(bhuktis[0].planet).toBe('Moon');
  });
});
