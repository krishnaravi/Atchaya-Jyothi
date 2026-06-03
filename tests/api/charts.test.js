const request = require('supertest');
const jwt     = require('jsonwebtoken');
const app     = require('../../src/app');
const db      = require('../../src/config/database');

const JWT_SECRET  = process.env.JWT_SECRET || 'AstroJyothi_JWT_Super_Secret_2024';
const TEST_USER_ID = '00000000-0000-4000-8000-000000000099'; // fixed UUID, won't collide with real users

let TOKEN;
let savedChartId; // filled in the save test, used by later tests

const BIRTH = {
  name:          'Test Person',
  date_of_birth: '1990-05-15',
  time_of_birth: '06:30',
  latitude:      13.0827,
  longitude:     80.2707,
  timezone:      'Asia/Kolkata',
  place_of_birth: 'Chennai, India'
};

beforeAll(async () => {
  await db.execute(
    'INSERT IGNORE INTO users (id, name, email, password, api_key) VALUES (?, ?, ?, ?, ?)',
    [TEST_USER_ID, 'Test Charts User', 'charts-test@astrojyothi.test', 'hashed', 'charts-test-api-key']
  );
  TOKEN = jwt.sign({ id: TEST_USER_ID, email: 'charts-test@astrojyothi.test', role: 'user' }, JWT_SECRET, { expiresIn: '1h' });
});

afterAll(async () => {
  await db.execute('DELETE FROM horoscope_reports WHERE user_id = ?', [TEST_USER_ID]);
  await db.execute('DELETE FROM birth_details WHERE user_id = ?',     [TEST_USER_ID]);
  await db.execute('DELETE FROM users WHERE id = ?',                  [TEST_USER_ID]);
  await db.pool.end();
});

const AUTH = () => ({ Authorization: `Bearer ${TOKEN}` });

// ── POST /api/charts ──────────────────────────────────────────────────────

describe('POST /api/charts', () => {
  test('401 without token', async () => {
    const res = await request(app).post('/api/charts').send(BIRTH);
    expect(res.status).toBe(401);
  });

  test('400 when name is missing', async () => {
    const { name, ...body } = BIRTH;
    const res = await request(app).post('/api/charts').set(AUTH()).send(body);
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/name/);
  });

  test('400 when timezone is missing', async () => {
    const { timezone, ...body } = BIRTH;
    const res = await request(app).post('/api/charts').set(AUTH()).send(body);
    expect(res.status).toBe(400);
  });

  test('201 — saves chart and returns summary', async () => {
    const res = await request(app).post('/api/charts').set(AUTH()).send(BIRTH);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data).toHaveProperty('report_id');
    expect(res.body.data.name).toBe('Test Person');
    expect(res.body.data.lagna).toBe('Gemini');
    expect(res.body.data.current_dasa).toBe('Rahu');
    savedChartId = res.body.data.id;
  });
});

// ── GET /api/charts ───────────────────────────────────────────────────────

describe('GET /api/charts', () => {
  test('401 without token', async () => {
    const res = await request(app).get('/api/charts');
    expect(res.status).toBe(401);
  });

  test('200 — returns list with pagination', async () => {
    const res = await request(app).get('/api/charts').set(AUTH());
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toHaveProperty('total');
    expect(res.body.pagination).toHaveProperty('page');
    expect(res.body.pagination).toHaveProperty('limit');
    expect(res.body.pagination).toHaveProperty('pages');
  });

  test('list contains the saved chart', async () => {
    const res = await request(app).get('/api/charts').set(AUTH());
    const ids = res.body.data.map(r => r.id);
    expect(ids).toContain(savedChartId);
  });

  test('pagination works — page=1 limit=1', async () => {
    const res = await request(app).get('/api/charts?page=1&limit=1').set(AUTH());
    expect(res.body.data.length).toBeLessThanOrEqual(1);
    expect(res.body.pagination.limit).toBe(1);
  });
});

// ── GET /api/charts/:id ───────────────────────────────────────────────────

describe('GET /api/charts/:id', () => {
  test('401 without token', async () => {
    const res = await request(app).get(`/api/charts/${savedChartId}`);
    expect(res.status).toBe(401);
  });

  test('404 for non-existent id', async () => {
    const res = await request(app).get('/api/charts/00000000-0000-0000-0000-000000000000').set(AUTH());
    expect(res.status).toBe(404);
  });

  test('200 — returns birth details + full chart data', async () => {
    const res = await request(app).get(`/api/charts/${savedChartId}`).set(AUTH());
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const d = res.body.data;
    expect(d.id).toBe(savedChartId);
    expect(d.name).toBe('Test Person');
    expect(d.place_of_birth).toBe('Chennai, India');
    expect(d).toHaveProperty('chart');
    expect(d.chart).toHaveProperty('planets');
    expect(d.chart).toHaveProperty('yogas');
    expect(d.chart).toHaveProperty('present_yogas');
    expect(d.chart).toHaveProperty('lagna');
    expect(d.chart).toHaveProperty('all_dasas');
  });

  test('chart data has 9 planets', async () => {
    const res = await request(app).get(`/api/charts/${savedChartId}`).set(AUTH());
    expect(res.body.data.chart.planets).toHaveLength(9);
  });
});

// ── DELETE /api/charts/:id ────────────────────────────────────────────────

describe('DELETE /api/charts/:id', () => {
  test('401 without token', async () => {
    const res = await request(app).delete(`/api/charts/${savedChartId}`);
    expect(res.status).toBe(401);
  });

  test('404 for non-existent id', async () => {
    const res = await request(app).delete('/api/charts/00000000-0000-0000-0000-000000000000').set(AUTH());
    expect(res.status).toBe(404);
  });

  test('200 — deletes the chart', async () => {
    const res = await request(app).delete(`/api/charts/${savedChartId}`).set(AUTH());
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('chart is gone after deletion', async () => {
    const res = await request(app).get(`/api/charts/${savedChartId}`).set(AUTH());
    expect(res.status).toBe(404);
  });
});
