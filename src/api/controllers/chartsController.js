const { v4: uuidv4 } = require('uuid');
const db = require('../../config/database');
const { buildChart } = require('../../utils/chartCalculator');
const logger = require('../../utils/logger');

// POST /api/charts — calculate and persist a chart for the logged-in user
const saveChart = async (req, res) => {
  try {
    const { name, date_of_birth, time_of_birth, latitude, longitude, timezone,
            place_of_birth, gender, lang, ayanamsa } = req.body;

    if (!name || !date_of_birth || !time_of_birth || !latitude || !longitude || !timezone)
      return res.status(400).json({ success: false, message: 'name, date_of_birth, time_of_birth, latitude, longitude, timezone required' });

    const userId   = req.user.id;
    const language = lang || 'en';

    const chartData = buildChart(date_of_birth, time_of_birth, parseFloat(latitude), parseFloat(longitude),
                                  timezone, name, language, ayanamsa || 'lahiri');

    const birthDetailId = uuidv4();
    await db.execute(
      `INSERT INTO birth_details
         (id, user_id, name, date_of_birth, time_of_birth, place_of_birth, latitude, longitude, timezone, gender)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [birthDetailId, userId, name, date_of_birth, time_of_birth,
       place_of_birth || `${latitude}, ${longitude}`,
       parseFloat(latitude), parseFloat(longitude), timezone, gender || null]
    );

    const reportId = uuidv4();
    await db.execute(
      `INSERT INTO horoscope_reports (id, user_id, birth_detail_id, report_type, language, report_data)
       VALUES (?, ?, ?, 'chart', ?, ?)`,
      [reportId, userId, birthDetailId, language, JSON.stringify(chartData)]
    );

    logger.info(`Chart saved: ${name} (${birthDetailId}) by user ${userId}`);
    res.status(201).json({
      success: true,
      data: {
        id:           birthDetailId,
        report_id:    reportId,
        name,
        date_of_birth,
        time_of_birth,
        place_of_birth: place_of_birth || `${latitude}, ${longitude}`,
        lagna:          chartData.lagna.rasi,
        current_dasa:   chartData.current_dasa?.planet || null
      }
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ success: false, message: 'Chart operation failed' });
  }
};

// GET /api/charts — list all saved charts for the logged-in user
const listCharts = async (req, res) => {
  try {
    const userId = req.user.id;
    const page   = Math.max(1, parseInt(req.query.page)  || 1);
    const limit  = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const offset = (page - 1) * limit;

    // LIMIT/OFFSET must be interpolated — mysql2 prepared statements reject integer params there
    const [rows] = await db.execute(
      `SELECT bd.id, bd.name, bd.date_of_birth, bd.time_of_birth,
              bd.place_of_birth, bd.gender, bd.created_at,
              hr.id AS report_id, hr.language
       FROM birth_details bd
       LEFT JOIN horoscope_reports hr
         ON hr.birth_detail_id = bd.id AND hr.report_type = 'chart'
       WHERE bd.user_id = ?
       ORDER BY bd.created_at DESC
       LIMIT ${limit} OFFSET ${offset}`,
      [userId]
    );

    const [[{ total }]] = await db.execute(
      'SELECT COUNT(*) AS total FROM birth_details WHERE user_id = ?',
      [userId]
    );

    res.json({
      success: true,
      data: rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ success: false, message: 'Chart operation failed' });
  }
};

// GET /api/charts/:id — get a saved chart with its full calculation data
const getChart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [rows] = await db.execute(
      `SELECT bd.id, bd.name, bd.date_of_birth, bd.time_of_birth,
              bd.place_of_birth, bd.latitude, bd.longitude, bd.timezone,
              bd.gender, bd.created_at,
              hr.id AS report_id, hr.language, hr.report_data
       FROM birth_details bd
       LEFT JOIN horoscope_reports hr
         ON hr.birth_detail_id = bd.id AND hr.report_type = 'chart'
       WHERE bd.id = ? AND bd.user_id = ?`,
      [id, userId]
    );

    if (rows.length === 0)
      return res.status(404).json({ success: false, message: 'Chart not found' });

    const row = rows[0];
    res.json({
      success: true,
      data: {
        id:            row.id,
        report_id:     row.report_id,
        name:          row.name,
        date_of_birth: row.date_of_birth,
        time_of_birth: row.time_of_birth,
        place_of_birth: row.place_of_birth,
        latitude:      row.latitude,
        longitude:     row.longitude,
        timezone:      row.timezone,
        gender:        row.gender,
        language:      row.language,
        created_at:    row.created_at,
        chart:         row.report_data || null  // mysql2 auto-parses JSON columns
      }
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ success: false, message: 'Chart operation failed' });
  }
};

// DELETE /api/charts/:id — delete a saved chart and its reports
const deleteChart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [rows] = await db.execute(
      'SELECT id FROM birth_details WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    if (rows.length === 0)
      return res.status(404).json({ success: false, message: 'Chart not found' });

    await db.execute('DELETE FROM horoscope_reports WHERE birth_detail_id = ?', [id]);
    await db.execute('DELETE FROM birth_details WHERE id = ?', [id]);

    logger.info(`Chart deleted: ${id} by user ${userId}`);
    res.json({ success: true, message: 'Chart deleted' });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ success: false, message: 'Chart operation failed' });
  }
};

module.exports = { saveChart, listCharts, getChart, deleteChart };
