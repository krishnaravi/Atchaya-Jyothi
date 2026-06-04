const swisseph = require('swisseph');

const AYANAMSA_MODES = {
  lahiri:        { id: swisseph.SE_SIDM_LAHIRI,          name: 'Lahiri',            ta: 'லாஹிரி' },
  kp:            { id: swisseph.SE_SIDM_KRISHNAMURTI,    name: 'KP (Krishnamurti)', ta: 'கே.பி' },
  krishnamurti:  { id: swisseph.SE_SIDM_KRISHNAMURTI,    name: 'KP (Krishnamurti)', ta: 'கே.பி' },
  raman:         { id: swisseph.SE_SIDM_RAMAN,           name: 'Raman',             ta: 'ராமன்' },
  yukteswar:     { id: swisseph.SE_SIDM_YUKTESHWAR,      name: 'Yukteswar',         ta: 'யுக்தேஸ்வர்' },
  fagan_bradley: { id: swisseph.SE_SIDM_FAGAN_BRADLEY,   name: 'Fagan-Bradley',     ta: 'ஃபேகன்-பிராட்லி' },
  thirukanidham: { id: swisseph.SE_SIDM_LAHIRI,          name: 'Thirukanidham',     ta: 'திருகணிதம்' },
  vakkiya:       { id: swisseph.SE_SIDM_LAHIRI,          name: 'Vakkiya Kanidham',  ta: 'வாக்கிய கணிதம்' }
};

const setAyanamsa = (mode) => {
  const ayanamsa = AYANAMSA_MODES[mode] || AYANAMSA_MODES.lahiri;
  swisseph.swe_set_sid_mode(ayanamsa.id, 0, 0);
  return ayanamsa;
};

const getAyanamsaValue = (julDay, mode) => {
  setAyanamsa(mode);
  const value = swisseph.swe_get_ayanamsa_ut(julDay);
  return { mode, value: parseFloat(value.toFixed(6)) };
};

module.exports = { setAyanamsa, getAyanamsaValue, AYANAMSA_MODES };
