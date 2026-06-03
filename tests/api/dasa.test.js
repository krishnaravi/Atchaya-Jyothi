const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');

const TOKEN = jwt.sign({ id: 1 }, process.env.JWT_SECRET || 'AstroJyothi_JWT_Super_Secret_2024', { expiresIn: '1h' });
const AUTH  = { Authorization: `Bearer ${TOKEN}` };

const VALID_BODY = {
  date_of_birth: '1990-05-15',
  time_of_birth: '06:30',
  latitude: 13.0827,
  longitude: 80.2707,
  timezone: 'Asia/Kolkata'
};

// ── /api/dasa/mahadasa ────────────────────────────────────────────────────

describe('POST /api/dasa/mahadasa', () => {
  test('401 without token', async () => {
    const res = await request(app).post('/api/dasa/mahadasa').send(VALID_BODY);
    expect(res.status).toBe(401);
  });

  test('400 with missing fields', async () => {
    const res = await request(app)
      .post('/api/dasa/mahadasa')
      .set(AUTH)
      .send({ date_of_birth: '1990-05-15' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('200 — returns 9 dasas and current_dasa', async () => {
    const res = await request(app).post('/api/dasa/mahadasa').set(AUTH).send(VALID_BODY);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.dasas).toHaveLength(9);
    expect(res.body.data).toHaveProperty('current_dasa');
  });

  test('current_dasa is Rahu for DOB 1990-05-15 in 2026', async () => {
    const res = await request(app).post('/api/dasa/mahadasa').set(AUTH).send(VALID_BODY);
    expect(res.body.data.current_dasa.planet).toBe('Rahu');
  });

  test('dasa years total 120', async () => {
    const res = await request(app).post('/api/dasa/mahadasa').set(AUTH).send(VALID_BODY);
    const total = res.body.data.dasas.reduce((sum, d) => sum + d.years, 0);
    expect(total).toBe(120);
  });
});

// ── /api/dasa/bhukti ──────────────────────────────────────────────────────

describe('POST /api/dasa/bhukti', () => {
  test('200 — returns 9 bhuktis for Rahu dasa', async () => {
    const res = await request(app)
      .post('/api/dasa/bhukti')
      .set(AUTH)
      .send({ ...VALID_BODY, dasa_planet: 'Rahu' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.bhuktis).toHaveLength(9);
  });

  test('each bhukti has planet, start_date, end_date', async () => {
    const res = await request(app)
      .post('/api/dasa/bhukti')
      .set(AUTH)
      .send({ ...VALID_BODY, dasa_planet: 'Jupiter' });
    res.body.data.bhuktis.forEach(b => {
      expect(b).toHaveProperty('planet');
      expect(b).toHaveProperty('start_date');
      expect(b).toHaveProperty('end_date');
    });
  });
});

// ── /api/dasa/antara ──────────────────────────────────────────────────────

describe('POST /api/dasa/antara', () => {
  test('200 — returns 9 antaras for Rahu/Jupiter', async () => {
    const res = await request(app)
      .post('/api/dasa/antara')
      .set(AUTH)
      .send({ ...VALID_BODY, dasa_planet: 'Rahu', bhukti_planet: 'Jupiter' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.antaras).toHaveLength(9);
  });
});
