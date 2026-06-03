const { detectYogas } = require('../../src/core/astrology/yogas');
const { calculatePlanets, calculateLagna } = require('../../src/core/astrology/planets');

describe('detectYogas', () => {
  // DOB 1990-05-15 — verified: 17 yogas, present includes Raja Yoga and Gajakesari Yoga
  let result;

  beforeAll(() => {
    const planets = calculatePlanets('1990-05-15', '06:30', 'Asia/Kolkata', 'en', 'lahiri');
    const lagna   = calculateLagna(planets.julDay, 13.0827, 80.2707, 'en');
    result = detectYogas(planets.positions, lagna);
  });

  test('returns { yogas, present } — no double-nesting', () => {
    expect(result).toHaveProperty('yogas');
    expect(result).toHaveProperty('present');
    expect(Array.isArray(result.yogas)).toBe(true);
    expect(Array.isArray(result.present)).toBe(true);
    expect(result).not.toHaveProperty('yogas.yogas');
  });

  test('yogas array has 17 entries (one per classical yoga checked)', () => {
    expect(result.yogas).toHaveLength(17);
  });

  test('each yoga has name, present (bool), description', () => {
    result.yogas.forEach(y => {
      expect(y).toHaveProperty('name');
      expect(typeof y.present).toBe('boolean');
      expect(y).toHaveProperty('description');
    });
  });

  test('present contains only names that appear in yogas', () => {
    const allNames = new Set(result.yogas.map(y => y.name));
    result.present.forEach(name => expect(allNames.has(name)).toBe(true));
  });

  test('present matches yogas filtered to present=true', () => {
    const expected = result.yogas.filter(y => y.present).map(y => y.name).sort();
    expect(result.present.slice().sort()).toEqual(expected);
  });

  test('detects Raja Yoga for this chart', () => {
    expect(result.present).toContain('Raja Yoga');
  });

  test('detects Gajakesari Yoga for this chart', () => {
    expect(result.present).toContain('Gajakesari Yoga');
  });

  test('yoga names are unique', () => {
    const names = result.yogas.map(y => y.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
