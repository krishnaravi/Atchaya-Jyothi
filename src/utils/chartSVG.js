const generateRasiChartSVG = (planets, lagna, title = '') => {
  const size = 560;
  const cell = size / 4;

  const RASI_POSITIONS = {
    1:[0,1],2:[0,2],3:[0,3],4:[1,3],5:[2,3],6:[3,3],
    7:[3,2],8:[3,1],9:[3,0],10:[2,0],11:[1,0],12:[0,0]
  };

  const RASI_NAMES_TA = {
    1:'மேஷம்',2:'ரிஷபம்',3:'மிதுனம்',4:'கடகம்',
    5:'சிம்மம்',6:'கன்னி',7:'துலாம்',8:'விருச்சிகம்',
    9:'தனுசு',10:'மகரம்',11:'கும்பம்',12:'மீனம்'
  };

  const NAKSHATRA_SHORT = {
    1:'அஸ்வி',2:'பரணி',3:'கார்த்',4:'ரோகி',5:'மிருக',
    6:'திருவா',7:'புனர்',8:'பூசம்',9:'ஆயில்',10:'மகம்',
    11:'பூரம்',12:'உத்தி',13:'அஸ்தம்',14:'சித்தி',15:'சுவாதி',
    16:'விசா',17:'அனுஷ',18:'கேட்டை',19:'மூலம்',20:'பூராடம்',
    21:'உத்திராடம்',22:'திருவோணம்',23:'அவிட்டம்',24:'சதயம்',
    25:'பூரட்டாதி',26:'உத்திரட்டாதி',27:'ரேவதி'
  };

  const PLANET_SHORT_TA = {
    'Sun':'சூ','Moon':'ச','Mars':'செ','Mercury':'பு',
    'Jupiter':'கு','Venus':'சுக்','Saturn':'சனி',
    'Rahu':'ரா','Ketu':'கே',
    'Gulika':'கு.க','Mandi':'மாந்','Bhava':'பா'
  };

  const PLANET_COLORS = {
    'Sun':'#FF6B00','Moon':'#4A90D9','Mars':'#CC0000',
    'Mercury':'#009900','Jupiter':'#FF8C00','Venus':'#CC00CC',
    'Saturn':'#666699','Rahu':'#660033','Ketu':'#996633',
    'Gulika':'#336666','Mandi':'#663300','Bhava':'#003366'
  };

  const rasiPlanets = {};
  for(let i = 1; i <= 12; i++) rasiPlanets[i] = [];

  if(lagna) {
    rasiPlanets[lagna.rasi_number].push({
      short: 'லக்',
      color: '#000080',
      bold: true,
      degrees: lagna.degrees ? lagna.degrees.toFixed(1) + '°' : '',
      nakshatra: ''
    });
  }

  planets.forEach(p => {
    const short = PLANET_SHORT_TA[p.planet] || p.planet.substring(0,2);
    const color = PLANET_COLORS[p.planet] || '#333';
    const deg = p.degrees ? p.degrees.toFixed(1) + '°' : '';
    const NAKSHATRA_EN_MAP = {'Ashwini':1,'Bharani':2,'Krittika':3,'Rohini':4,'Mrigashira':5,'Ardra':6,'Punarvasu':7,'Pushya':8,'Ashlesha':9,'Magha':10,'Purva Phalguni':11,'Uttara Phalguni':12,'Hasta':13,'Chitra':14,'Swati':15,'Vishakha':16,'Anuradha':17,'Jyeshtha':18,'Mula':19,'Purva Ashadha':20,'Uttara Ashadha':21,'Shravana':22,'Dhanishta':23,'Shatabhisha':24,'Purva Bhadrapada':25,'Uttara Bhadrapada':26,'Revati':27};
    const nakNum = p.nakshatraIndex ? p.nakshatraIndex + 1 : (p.nakshatra_number || (p.nakshatra ? NAKSHATRA_EN_MAP[p.nakshatra] || 0 : 0));
    const nak = NAKSHATRA_SHORT[nakNum] || '';
    rasiPlanets[p.rasi_number].push({
      short: short + (p.is_retrograde ? '(வ)' : ''),
      color, bold: false,
      degrees: deg,
      nakshatra: nak,
      pada: p.pada || ''
    });
  });

  const titleHeight = title ? 35 : 5;
  const svgHeight = size + titleHeight;

  let svg = `<svg width="${size}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg" font-family="Arial,sans-serif">`;
  svg += `<rect width="${size}" height="${svgHeight}" fill="#FFFEF5" rx="8"/>`;

  if(title) {
    svg += `<text x="${size/2}" y="24" text-anchor="middle" font-size="16" font-weight="bold" fill="#8B4513">${title}</text>`;
  }

  for(let rasi = 1; rasi <= 12; rasi++){
    const [row, col] = RASI_POSITIONS[rasi];
    const x = col * cell;
    const y = row * cell + titleHeight;

    if((row === 1 || row === 2) && (col === 1 || col === 2)) continue;

    const isLagnaRasi = lagna && lagna.rasi_number === rasi;
    const bgColor = isLagnaRasi ? '#FFF3E0' : '#FFFEF5';
    svg += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="${bgColor}" stroke="#8B4513" stroke-width="1.5"/>`;

    // Rasi number small
    svg += `<text x="${x+4}" y="${y+13}" font-size="9" fill="#AAA">${rasi}</text>`;

    // Rasi name Tamil
    svg += `<text x="${x+cell/2}" y="${y+13}" font-size="9" fill="#CC9966" text-anchor="middle">${RASI_NAMES_TA[rasi]}</text>`;

    // Planets
    const planetsInRasi = rasiPlanets[rasi];
    planetsInRasi.forEach((p, i) => {
      const py = y + 26 + (i * 16);
      // Planet name
      svg += `<text x="${x+5}" y="${py}" font-size="12" font-weight="${p.bold ? 'bold' : 'normal'}" fill="${p.color}">${p.short}</text>`;
      // Degrees
      if(p.degrees) {
        svg += `<text x="${x+cell-5}" y="${py}" font-size="9" fill="#999" text-anchor="end">${p.degrees}</text>`;
      }
      // Nakshatra
      if(p.nakshatra) {
        svg += `<text x="${x+5}" y="${py+10}" font-size="7.5" fill="#AAA">${p.nakshatra}${p.pada ? '.' + p.pada : ''}</text>`;
      }
    });
  }

  // Center
  const cx = cell;
  const cy = cell + titleHeight;
  svg += `<rect x="${cx}" y="${cy}" width="${cell*2}" height="${cell*2}" fill="#FFF8E7" stroke="#8B4513" stroke-width="1.5"/>`;
  svg += `<line x1="${cx}" y1="${cy}" x2="${cx+cell*2}" y2="${cy+cell*2}" stroke="#E8C97A" stroke-width="1"/>`;
  svg += `<line x1="${cx+cell*2}" y1="${cy}" x2="${cx}" y2="${cy+cell*2}" stroke="#E8C97A" stroke-width="1"/>`;
  svg += `<text x="${cx+cell}" y="${cy+cell-8}" text-anchor="middle" font-size="14" fill="#8B4513" font-weight="bold">${title || 'ராசி'}</text>`;
  svg += `<text x="${cx+cell}" y="${cy+cell+12}" text-anchor="middle" font-size="12" fill="#8B4513" font-weight="bold">சக்கரம்</text>`;

  svg += '</svg>';
  return svg;
};

const generateNavamsaChartSVG = (vargaD9, lagna, title = 'நவாம்சம்') => {
  return generateRasiChartSVG(vargaD9, lagna, title);
};

module.exports = { generateRasiChartSVG, generateNavamsaChartSVG };
