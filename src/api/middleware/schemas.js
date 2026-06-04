const Joi = require('joi');
const moment = require('moment-timezone');

// ── Primitives ────────────────────────────────────────────────────────────────

const date = Joi.string()
  .pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)
  .custom((val, helpers) => {
    const d = new Date(val + 'T00:00:00');
    if (isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== val)
      return helpers.error('any.invalid');
    return val;
  })
  .messages({
    'string.pattern.base': '{{#label}} must be YYYY-MM-DD',
    'any.invalid': '{{#label}} is not a valid date',
  });

const time = Joi.string()
  .pattern(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/)
  .messages({ 'string.pattern.base': '{{#label}} must be HH:MM or HH:MM:SS' });

const latitude = Joi.number().min(-90).max(90)
  .messages({
    'number.base': '{{#label}} must be a number',
    'number.min': '{{#label}} must be between -90 and 90',
    'number.max': '{{#label}} must be between -90 and 90',
  });

const longitude = Joi.number().min(-180).max(180)
  .messages({
    'number.base': '{{#label}} must be a number',
    'number.min': '{{#label}} must be between -180 and 180',
    'number.max': '{{#label}} must be between -180 and 180',
  });

const timezone = Joi.string()
  .custom((val, helpers) => {
    if (!moment.tz.zone(val)) return helpers.error('any.invalid');
    return val;
  })
  .messages({ 'any.invalid': '{{#label}} must be a valid IANA timezone (e.g. Asia/Kolkata)' });

const lang = Joi.string().valid('en', 'ta', 'te', 'kn', 'ml', 'hi').default('en');
const ayanamsa = Joi.string().valid('lahiri', 'raman', 'krishnamurti', 'yukteswar', 'de_luce', 'fagan_bradley').default('lahiri');

const DASA_PLANETS = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
const TRANSIT_PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

// ── Reusable field groups ─────────────────────────────────────────────────────

const birthFields = {
  date_of_birth: date.required(),
  time_of_birth: time.required(),
  latitude:      latitude.required(),
  longitude:     longitude.required(),
  timezone:      timezone.required(),
};

const coordFields = {
  latitude:  latitude.required(),
  longitude: longitude.required(),
  timezone:  timezone.required(),
};

// ── Auth ──────────────────────────────────────────────────────────────────────

const registerSchema = Joi.object({
  name:     Joi.string().min(1).max(100).required(),
  email:    Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
});

const loginSchema = Joi.object({
  email:    Joi.string().email().required(),
  password: Joi.string().required(),
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

// ── Chart / horoscope ─────────────────────────────────────────────────────────

const chartSchema = Joi.object({
  ...birthFields,
  name:           Joi.string().max(100),
  place_of_birth: Joi.string().max(200),
  gender:         Joi.string().valid('male', 'female', 'other'),
  lang,
  ayanamsa,
});

// ── Astro / transit ───────────────────────────────────────────────────────────

// Porutham only needs date/time/timezone — latitude/longitude not used
const poruthamBirthFields = {
  date_of_birth: date.required(),
  time_of_birth: time.required(),
  timezone:      timezone.required(),
};

const astroPoruthamSchema = Joi.object({
  boy:  Joi.object(poruthamBirthFields).required(),
  girl: Joi.object(poruthamBirthFields).required(),
});

const transitSchema = Joi.object({
  ...birthFields,
  transit_date: date,
  transit_time: time,
  ayanamsa,
});

const ingressSchema = Joi.object({
  planet:    Joi.string().valid(...TRANSIT_PLANETS).required()
               .messages({ 'any.only': `planet must be one of: ${TRANSIT_PLANETS.join(', ')}` }),
  from_date: date.required(),
  to_date:   date.required(),
  timezone:  timezone.required(),
  ayanamsa,
});

// ── Dasa ──────────────────────────────────────────────────────────────────────

const dasaPlanet   = Joi.string().valid(...DASA_PLANETS).required();
const bhuktiPlanet = Joi.string().valid(...DASA_PLANETS).required();

const mahadasaSchema = Joi.object({ ...birthFields });

const bhuktiSchema = Joi.object({
  ...birthFields,
  dasa_planet: dasaPlanet,
});

const antaraSchema = Joi.object({
  ...birthFields,
  dasa_planet:   dasaPlanet,
  bhukti_planet: bhuktiPlanet,
});

const sukshmaSchema = Joi.object({
  ...birthFields,
  dasa_planet:   dasaPlanet,
  bhukti_planet: bhuktiPlanet,
  antara_planet: Joi.string().valid(...DASA_PLANETS).required(),
});

const pranaSchema = Joi.object({
  ...birthFields,
  dasa_planet:   dasaPlanet,
  bhukti_planet: bhuktiPlanet,
  antara_planet: Joi.string().valid(...DASA_PLANETS).required(),
  sukshma_planet: Joi.string().valid(...DASA_PLANETS).required(),
});

const dasaPoruthamSchema = Joi.object({
  boy_nakshatra:  Joi.number().integer().min(0).max(26).required(),
  girl_nakshatra: Joi.number().integer().min(0).max(26).required(),
});

// ── Panchangam ────────────────────────────────────────────────────────────────

const panchangamSchema = Joi.object({
  date: date.required(),
  ...coordFields,
  lang,
});

// ── Muhurtham ─────────────────────────────────────────────────────────────────

const muhurthamSchema = Joi.object({
  start_date: date.required(),
  end_date:   date.required(),
  occasion:   Joi.string().valid('marriage', 'house_warming', 'vehicle', 'business', 'education').required(),
  ...coordFields,
  lang,
});

// ── Matchmaking (query params) ────────────────────────────────────────────────

const matchmakingSchema = Joi.object({
  boyNakshatra:  Joi.number().integer().min(0).max(26).required(),
  girlNakshatra: Joi.number().integer().min(0).max(26).required(),
});

// ── Location ──────────────────────────────────────────────────────────────────

const locationSchema = Joi.object({
  query: Joi.string().min(2).max(200).required(),
});

// ── Research ──────────────────────────────────────────────────────────────────

const spouseStarSchema = Joi.object({
  nakshatra: Joi.number().integer().min(0).max(26).required(),
  gender:    Joi.string().valid('male', 'female').required(),
});

const nakshatraCompatibilitySchema = Joi.object({
  nakshatra1: Joi.number().integer().min(0).max(26).required(),
  nakshatra2: Joi.number().integer().min(0).max(26).required(),
});

const pulippaniSchema = Joi.object({ ...birthFields });

module.exports = {
  registerSchema,
  loginSchema,
  refreshSchema,
  chartSchema,
  astroPoruthamSchema,
  transitSchema,
  ingressSchema,
  mahadasaSchema,
  bhuktiSchema,
  antaraSchema,
  sukshmaSchema,
  pranaSchema,
  dasaPoruthamSchema,
  panchangamSchema,
  muhurthamSchema,
  matchmakingSchema,
  locationSchema,
  spouseStarSchema,
  nakshatraCompatibilitySchema,
  pulippaniSchema,
};
