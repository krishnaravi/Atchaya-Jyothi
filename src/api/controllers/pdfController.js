const puppeteer = require('puppeteer');
const { calculatePlanets, calculateLagna } = require('../../core/astrology/planets');
const { calculateDasa, calculateBhukti } = require('../../core/astrology/dasa');
const { calculateUpagrahas } = require('../../core/astrology/upagrahas');
const { calculatePanchangam } = require('../../core/panchangam/panchangam');
const { generateRasiChartSVG } = require('../../utils/chartSVG');
const { calculateVargaCharts } = require('../../core/astrology/varga');
const moment = require('moment-timezone');
const logger = require('../../utils/logger');

const generatePDF = async (req, res) => {
  try {
    const { name, date_of_birth, time_of_birth, latitude, longitude, timezone, lang, ayanamsa } = req.body;
    if(!date_of_birth || !time_of_birth || !latitude || !longitude || !timezone){
      return res.status(400).json({ success: false, message: 'All fields required' });
    }

    const language = lang || 'en';
    const planets = calculatePlanets(date_of_birth, time_of_birth, timezone, language, ayanamsa || 'lahiri');
    const lagna = calculateLagna(planets.julDay, parseFloat(latitude), parseFloat(longitude), language);
    const moon = planets.positions.find(p => p.planet === 'Moon');
    const moonLong = (moon.rasi_number - 1) * 30 + moon.degrees;
    const dasas = calculateDasa(moonLong, date_of_birth);
    const currentDasa = dasas.find(d => new Date(d.start_date) <= new Date() && new Date(d.end_date) >= new Date());
    const dayOfWeek = moment.tz(date_of_birth, 'YYYY-MM-DD', timezone).day();
    const basic = calculatePanchangam(date_of_birth, parseFloat(latitude), parseFloat(longitude), timezone, language);
    const upagrahas = calculateUpagrahas(planets.julDay, dayOfWeek, basic.sunrise, basic.sunset, timezone);
    const allPlanets = [...planets.positions, ...upagrahas];
    const rasiSVG = generateRasiChartSVG(allPlanets, lagna, name || 'Horoscope');
    const varga = calculateVargaCharts(planets.positions, ayanamsa || 'lahiri');
    const navamsaPlanets = varga.D9.map((p,i) => ({...planets.positions[i], rasi: p.rasi, rasi_number: p.rasi_number}));
    const { generateNavamsaChartSVG } = require('../../utils/chartSVG');
    const navamsaSVG = generateNavamsaChartSVG(navamsaPlanets, lagna, 'நவாம்சம்');

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @font-face { font-family: 'NotoTamil'; src: local('Noto Sans Tamil'); } body { font-family: 'Noto Sans Tamil', 'Noto Sans', Arial, sans-serif; margin: 20px; color: #333; }
  h1 { color: #8B4513; text-align: center; border-bottom: 2px solid #e8c97a; padding-bottom: 10px; }
  h2 { color: #8B4513; margin-top: 20px; }
  table { width: 100%; border-collapse: collapse; margin: 10px 0; }
  th { background: #8B4513; color: white; padding: 8px; }
  td { padding: 6px 10px; border-bottom: 1px solid #eee; }
  tr:nth-child(even) { background: #fff8f0; }
  .chart-row { display: flex; gap: 20px; justify-content: center; }
  .chart-box { text-align: center; }
  .info-box { background: #fff8f0; border: 1px solid #e8c97a; padding: 15px; border-radius: 8px; margin: 10px 0; }
  .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
</style>
</head>
<body>
<h1>🪐 AstroJyothi - ஜாதக விவரம்</h1>
<div class="info-box">
  <table>
    <tr><td><b>பெயர்</b></td><td>${name || 'Unknown'}</td><td><b>பிறந்த தேதி</b></td><td>${date_of_birth}</td></tr>
    <tr><td><b>பிறந்த நேரம்</b></td><td>${time_of_birth}</td><td><b>லக்னம்</b></td><td>${lagna.rasi} ${lagna.degrees}°</td></tr>
    <tr><td><b>சூர்யோதயம்</b></td><td>${basic.sunrise}</td><td><b>சூர்யாஸ்தமனம்</b></td><td>${basic.sunset}</td></tr>
  </table>
</div>

<div class="chart-row">
  <div class="chart-box"><h2>ராசி சக்கரம்</h2>${rasiSVG}</div>
  <div class="chart-box"><h2>நவாம்சம்</h2>${navamsaSVG}</div>
</div>

<h2>கிரக நிலைகள்</h2>
<table>
  <tr><th>கிரகம்</th><th>ராசி</th><th>டிகிரி</th><th>நட்சத்திரம்</th><th>பாதம்</th><th>வக்ரம்</th></tr>
  ${planets.positions.map(p => `<tr><td>${p.planet}</td><td>${p.rasi}</td><td>${p.degrees}°</td><td>${p.nakshatra}</td><td>${p.pada}</td><td>${p.is_retrograde ? 'ஆம்' : '-'}</td></tr>`).join('')}
  ${upagrahas.map(p => `<tr><td>${p.planet}</td><td>${p.rasi}</td><td>${p.degrees}°</td><td>${p.nakshatra}</td><td>${p.pada}</td><td>-</td></tr>`).join('')}
</table>

<h2>தசா விவரம்</h2>
<table>
  <tr><th>தசா</th><th>தொடக்கம்</th><th>முடிவு</th><th>ஆண்டுகள்</th></tr>
  ${dasas.map(d => `<tr style="${currentDasa && currentDasa.planet === d.planet ? 'background:#fff3cd;font-weight:bold;' : ''}"><td>${d.planet}</td><td>${d.start_date}</td><td>${d.end_date}</td><td>${d.years}</td></tr>`).join('')}
</table>

<div class="footer">
  <p>AstroJyothi — atchayajyothi.com | Generated on ${new Date().toLocaleDateString('ta-IN')}</p>
</div>
</body></html>`;

    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' } });
    await browser.close();

    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="AstroJyothi_${name || 'Horoscope'}.pdf"` });
    res.send(pdf);
    logger.info('PDF generated for: ' + (name || 'unknown'));
  } catch(err) {
    logger.error(err);
    return res.status(500).json({ success: false, message: 'PDF generation failed' });
  }
};

module.exports = { generatePDF };
