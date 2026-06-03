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

// ── /api/astro/kuja-dosha ──────────────────────────────────────────────────

describe('POST /api/astro/kuja-dosha', () => {
  test('401 without token', async () => {
    const res = await request(app).post('/api/astro/kuja-dosha').send(VALID_BODY);
    expect(res.status).toBe(401);
  });

  test('400 with missing fields', async () => {
    const res = await request(app)
      .post('/api/astro/kuja-dosha')
      .set(AUTH)
      .send({ date_of_birth: '1990-05-15' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('200 with valid body — correct response shape', async () => {
    const res = await request(app).post('/api/astro/kuja-dosha').set(AUTH).send(VALID_BODY);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('has_dosha');
    expect(res.body.data).toHaveProperty('mars_position');
    expect(res.body.data).toHaveProperty('checks');
    expect(res.body.data.checks).toHaveProperty('from_lagna');
    expect(res.body.data.checks).toHaveProperty('from_moon');
    expect(res.body.data.checks).toHaveProperty('from_venus');
  });

  test('has_dosha is false for DOB 1990-05-15', async () => {
    const res = await request(app).post('/api/astro/kuja-dosha').set(AUTH).send(VALID_BODY);
    expect(res.body.data.has_dosha).toBe(false);
  });
});

// ── /api/astro/porutham ───────────────────────────────────────────────────

describe('POST /api/astro/porutham', () => {
  const BOY  = { date_of_birth: '1990-05-15', time_of_birth: '06:30', timezone: 'Asia/Kolkata' };
  const GIRL = { date_of_birth: '1993-08-22', time_of_birth: '10:00', timezone: 'Asia/Kolkata' };

  test('401 without token', async () => {
    const res = await request(app).post('/api/astro/porutham').send({ boy: BOY, girl: GIRL });
    expect(res.status).toBe(401);
  });

  test('400 when girl object is missing', async () => {
    const res = await request(app).post('/api/astro/porutham').set(AUTH).send({ boy: BOY });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/girl/i);
  });

  test('400 when boy object is missing', async () => {
    const res = await request(app).post('/api/astro/porutham').set(AUTH).send({ girl: GIRL });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/boy/i);
  });

  test('200 with valid body — correct response shape', async () => {
    const res = await request(app).post('/api/astro/porutham').set(AUTH).send({ boy: BOY, girl: GIRL });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('score');
    expect(res.body.data).toHaveProperty('percentage');
    expect(res.body.data).toHaveProperty('recommendation');
    expect(res.body.data).toHaveProperty('poruthams');
    expect(res.body.data).toHaveProperty('rajju_dosha');
    expect(res.body.data.poruthams).toHaveLength(10);
  });

  test('score is 6 and recommendation is Good Match for this pair', async () => {
    const res = await request(app).post('/api/astro/porutham').set(AUTH).send({ boy: BOY, girl: GIRL });
    expect(res.body.data.score).toBe(6);
    expect(res.body.data.recommendation).toBe('Good Match');
  });
});

// ── /api/astro/transit ────────────────────────────────────────────────────

describe('POST /api/astro/transit', () => {
  test('401 without token', async () => {
    const res = await request(app).post('/api/astro/transit').send(VALID_BODY);
    expect(res.status).toBe(401);
  });

  test('400 with missing timezone', async () => {
    const { timezone, ...body } = VALID_BODY;
    const res = await request(app).post('/api/astro/transit').set(AUTH).send(body);
    expect(res.status).toBe(400);
  });

  test('200 — returns natal + 9 transit planets', async () => {
    const res = await request(app)
      .post('/api/astro/transit')
      .set(AUTH)
      .send({ ...VALID_BODY, transit_date: '2026-06-03' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.natal.moon_rasi).toBe('Sagittarius');
    expect(res.body.data.planets).toHaveLength(9);
  });

  test('each transit planet has house_from_moon and favorable', async () => {
    const res = await request(app)
      .post('/api/astro/transit')
      .set(AUTH)
      .send({ ...VALID_BODY, transit_date: '2026-06-03' });
    res.body.data.planets.forEach(p => {
      expect(p).toHaveProperty('house_from_moon');
      expect(p).toHaveProperty('favorable');
    });
  });
});

// ── /api/astro/transit/ingress ────────────────────────────────────────────

describe('POST /api/astro/transit/ingress', () => {
  test('401 without token', async () => {
    const res = await request(app)
      .post('/api/astro/transit/ingress')
      .send({ planet: 'Jupiter', from_date: '2026-01-01', to_date: '2026-12-31', timezone: 'Asia/Kolkata' });
    expect(res.status).toBe(401);
  });

  test('400 for invalid planet name', async () => {
    const res = await request(app)
      .post('/api/astro/transit/ingress')
      .set(AUTH)
      .send({ planet: 'Pluto', from_date: '2026-01-01', to_date: '2026-12-31', timezone: 'Asia/Kolkata' });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/planet must be/);
  });

  test('400 when date range exceeds 2 years', async () => {
    const res = await request(app)
      .post('/api/astro/transit/ingress')
      .set(AUTH)
      .send({ planet: 'Saturn', from_date: '2020-01-01', to_date: '2026-12-31', timezone: 'Asia/Kolkata' });
    expect(res.status).toBe(400);
  });

  test('200 — Jupiter ingress returns 2 events in 2026', async () => {
    const res = await request(app)
      .post('/api/astro/transit/ingress')
      .set(AUTH)
      .send({ planet: 'Jupiter', from_date: '2026-01-01', to_date: '2026-12-31', timezone: 'Asia/Kolkata' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(2);
    expect(res.body.data).toHaveLength(2);
    res.body.data.forEach(i => {
      expect(i).toHaveProperty('from_rasi');
      expect(i).toHaveProperty('to_rasi');
      expect(i).toHaveProperty('datetime');
    });
  });
});
