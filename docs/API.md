# AstroJyothi API Documentation

**Base URL:** `https://api.krishnalaya.cloud`

---

## Authentication

All endpoints (except `/api/matchmaking`) require a JWT Bearer token.

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

Obtain a token via `POST /api/auth/login`.

---

## Rate Limiting

`100 requests / 15 minutes` per IP across all `/api/*` routes.

**429 response:**
```json
{ "success": false, "message": "Too many requests, please try again later." }
```

---

## Common Field Formats

| Field | Format | Example |
|---|---|---|
| `date_of_birth` | `YYYY-MM-DD` | `"1990-06-15"` |
| `time_of_birth` | `HH:MM` or `HH:MM:SS` | `"06:30"` |
| `latitude` | number, `-90` to `90` | `13.0827` |
| `longitude` | number, `-180` to `180` | `80.2707` |
| `timezone` | IANA timezone | `"Asia/Kolkata"` |
| `lang` | `en` `ta` `te` `kn` `ml` `hi` | `"ta"` |
| `ayanamsa` | `lahiri` `raman` `krishnamurti` `yukteswar` | `"lahiri"` |

---

## Error Responses

| Status | Meaning |
|---|---|
| `400` | Validation error / bad input |
| `401` | Missing token |
| `403` | Invalid or expired token |
| `429` | Rate limit exceeded |
| `500` | Server error |

```json
{ "success": false, "message": "\"date_of_birth\" must be YYYY-MM-DD" }
```

---

## /api/chart

### POST /api/astro/chart
ஜாதக கணக்கீடு — கிரக நிலை, லக்னம், தசா, யோகம், அஷ்டகவர்க்கம்.

**Request**
```json
{
  "date_of_birth": "1990-06-15",
  "time_of_birth": "06:30",
  "latitude": 13.0827,
  "longitude": 80.2707,
  "timezone": "Asia/Kolkata",
  "name": "Ravi",
  "lang": "ta",
  "ayanamsa": "lahiri"
}
```

**Response `200`**
```json
{
  "success": true,
  "data": {
    "name": "Ravi",
    "lagna": {
      "rasi": "Aries",
      "degrees": 14.52,
      "nakshatra": "Bharani",
      "pada": 2
    },
    "planets": [
      {
        "planet": "Sun",
        "rasi": "Gemini",
        "rasi_number": 3,
        "degrees": 0.85,
        "nakshatra": "Mrigasira",
        "pada": 3,
        "is_retrograde": false
      }
    ],
    "upagrahas": [ ... ],
    "yogas": [ ... ],
    "present_yogas": [ "Gajakesari", "Budha-Aditya" ],
    "rasi_chart_svg": "<svg>...</svg>",
    "navamsa_chart_svg": "<svg>...</svg>",
    "varga_charts": { "D9": [...], "D10": [...] },
    "ashtakavarga": { ... },
    "shadbala": { ... },
    "current_dasa": { "planet": "Jupiter", "start_date": "2020-03-10", "end_date": "2036-03-10", "years": 16 },
    "current_bhukti": { "planet": "Saturn", "start_date": "2024-01-01", "end_date": "2026-07-01" },
    "all_dasas": [ ... ]
  }
}
```

---

### POST /api/astro/kuja-dosha
குஜ தோஷம் கணக்கீடு.

**Request** — Chart fields (same as above, `name`/`lang` optional)

**Response `200`**
```json
{
  "success": true,
  "data": {
    "has_dosha": true,
    "mars_house": 7,
    "severity": "High",
    "description": "Mars in 7th house causes Kuja Dosha"
  }
}
```

---

### POST /api/astro/porutham
திருமண பொருத்தம் — பிறந்த விவரங்கள் மூலம் Moon longitude கணக்கிட்டு பொருத்தம் பார்க்கும்.

**Request**
```json
{
  "boy": {
    "date_of_birth": "1990-06-15",
    "time_of_birth": "06:30",
    "latitude": 13.0827,
    "longitude": 80.2707,
    "timezone": "Asia/Kolkata"
  },
  "girl": {
    "date_of_birth": "1993-11-22",
    "time_of_birth": "14:15",
    "latitude": 11.0168,
    "longitude": 76.9558,
    "timezone": "Asia/Kolkata"
  }
}
```

**Response `200`**
```json
{
  "success": true,
  "data": {
    "boy": { "nakshatra": "Rohini", "nakshatra_number": 4, "rasi": "Taurus" },
    "girl": { "nakshatra": "Swati", "nakshatra_number": 15, "rasi": "Libra" },
    "score": 7,
    "percentage": 70,
    "recommendation": "Good Match",
    "rajju_dosha": false,
    "poruthams": [
      { "name": "Dina", "match": true, "score": 1 },
      { "name": "Gana", "match": true, "score": 1 }
    ],
    "summary_tamil": "10ல் 7 பொருத்தங்கள் அமைந்துள்ளன. திருமணத்திற்கு நல்ல பொருத்தம்.",
    "summary_english": "7 out of 10 poruthams matched. Good match for marriage."
  }
}
```

---

### POST /api/astro/transit
கோச்சார (Transit) — நடப்பு கிரக நிலையை natal chart-உடன் ஒப்பிடும்.

**Request**
```json
{
  "date_of_birth": "1990-06-15",
  "time_of_birth": "06:30",
  "latitude": 13.0827,
  "longitude": 80.2707,
  "timezone": "Asia/Kolkata",
  "transit_date": "2026-06-04",
  "transit_time": "10:00",
  "ayanamsa": "lahiri"
}
```
> `transit_date` / `transit_time` இல்லாவிட்டால் today's date பயன்படும்.

**Response `200`**
```json
{
  "success": true,
  "data": {
    "natal": { "moon_rasi": "Taurus", "moon_nakshatra": "Rohini" },
    "transit_planets": [ ... ],
    "effects": [ ... ]
  }
}
```

---

### POST /api/astro/transit/ingress
ஒரு கிரகம் எந்தெந்த ராசிகளுக்கு எப்போது நுழைகிறது என்று காட்டும்.

**Request**
```json
{
  "planet": "Jupiter",
  "from_date": "2026-01-01",
  "to_date": "2027-01-01",
  "timezone": "Asia/Kolkata",
  "ayanamsa": "lahiri"
}
```
> `planet`: `Sun` `Moon` `Mars` `Mercury` `Jupiter` `Venus` `Saturn` `Rahu` `Ketu`
> Date range maximum: **2 years**

**Response `200`**
```json
{
  "success": true,
  "planet": "Jupiter",
  "from_date": "2026-01-01",
  "to_date": "2027-01-01",
  "count": 2,
  "data": [
    { "date": "2026-05-01", "from_rasi": "Aries", "to_rasi": "Taurus" },
    { "date": "2026-10-15", "from_rasi": "Taurus", "to_rasi": "Aries" }
  ]
}
```

---

## /api/dasa

### POST /api/dasa/mahadasa
விம்சோத்தரி மகாதசா பட்டியல்.

**Request**
```json
{
  "date_of_birth": "1990-06-15",
  "time_of_birth": "06:30",
  "latitude": 13.0827,
  "longitude": 80.2707,
  "timezone": "Asia/Kolkata"
}
```

**Response `200`**
```json
{
  "success": true,
  "data": {
    "dasas": [
      { "planet": "Moon", "start_date": "1990-06-15", "end_date": "2000-06-15", "years": 10 },
      { "planet": "Mars", "start_date": "2000-06-15", "end_date": "2007-06-15", "years": 7 }
    ],
    "current_dasa": {
      "planet": "Jupiter",
      "start_date": "2020-03-10",
      "end_date": "2036-03-10",
      "years": 16
    }
  }
}
```

---

### POST /api/dasa/bhukti
மகாதசாவில் அந்தர்தசா (Bhukti) பட்டியல்.

**Request** — Birth fields + `dasa_planet`
```json
{
  "date_of_birth": "1990-06-15",
  "time_of_birth": "06:30",
  "latitude": 13.0827,
  "longitude": 80.2707,
  "timezone": "Asia/Kolkata",
  "dasa_planet": "Jupiter"
}
```
> `dasa_planet`: `Ketu` `Venus` `Sun` `Moon` `Mars` `Rahu` `Jupiter` `Saturn` `Mercury`

**Response `200`**
```json
{
  "success": true,
  "data": {
    "dasa_planet": "Jupiter",
    "dasa_start": "2020-03-10",
    "dasa_end": "2036-03-10",
    "bhuktis": [
      { "planet": "Jupiter", "start_date": "2020-03-10", "end_date": "2022-03-10" },
      { "planet": "Saturn",  "start_date": "2022-03-10", "end_date": "2024-09-10" }
    ],
    "current_bhukti": { "planet": "Saturn", "start_date": "2022-03-10", "end_date": "2024-09-10" }
  }
}
```

---

### POST /api/dasa/antara
அந்தரதசாவில் சூட்சும தசா (Antara).

**Request** — Birth fields + `dasa_planet` + `bhukti_planet`

---

### POST /api/dasa/sukshma
Antara-வில் Sukshma தசா.

**Request** — Birth fields + `dasa_planet` + `bhukti_planet` + `antara_planet`

---

### POST /api/dasa/prana
Sukshma-வில் Prana தசா.

**Request** — Birth fields + `dasa_planet` + `bhukti_planet` + `antara_planet` + `sukshma_planet`

> Antara / Sukshma / Prana response format same as Bhukti — `data` array + `current_*` field.

---

### POST /api/dasa/porutham
நட்சத்திர எண் மூலம் நேரடி பொருத்தம்.

**Request**
```json
{
  "boy_nakshatra": 4,
  "girl_nakshatra": 15
}
```
> `0` – `26` (0 = Ashwini, 26 = Revati)

**Response `200`**
```json
{
  "success": true,
  "data": {
    "boy":  { "nakshatra": "Rohini", "nakshatra_number": 4 },
    "girl": { "nakshatra": "Swati",  "nakshatra_number": 15 },
    "score": 7,
    "percentage": 70,
    "recommendation": "Good Match",
    "rajju_dosha": false,
    "poruthams": [ ... ],
    "summary_tamil": "...",
    "summary_english": "..."
  }
}
```

---

## /api/panchangam

### POST /api/panchangam/daily
தினசரி பஞ்சாங்கம் — திதி, நட்சத்திரம், யோகம், கரணம், ராகுகாலம்.

**Request**
```json
{
  "date": "2026-06-04",
  "latitude": 13.0827,
  "longitude": 80.2707,
  "timezone": "Asia/Kolkata",
  "lang": "ta"
}
```

**Response `200`**
```json
{
  "success": true,
  "cached": false,
  "data": {
    "date": "2026-06-04",
    "day": "Wednesday",
    "sunrise": "05:58",
    "sunset": "18:32",
    "tithi": { "name": "Dasami", "number": 10, "end_time": "14:23" },
    "nakshatra": { "name": "Swati", "number": 15, "end_time": "09:45" },
    "yoga": { "name": "Siddhi", "number": 21 },
    "karana": { "name": "Bava", "number": 1 },
    "rahu_kalam": { "start": "12:00", "end": "13:30" },
    "yamagandam": { "start": "07:30", "end": "09:00" },
    "gulikai": { "start": "10:30", "end": "12:00" }
  }
}
```
> `cached: true` — Redis cache hit (24 hour TTL)

---

### POST /api/panchangam/detailed
விரிவான பஞ்சாங்கம் — லக்னம் timings, முஹூர்த்த நேரங்கள், வாரசூலை.

**Request** — Same as `/daily`

**Response `200`**
```json
{
  "success": true,
  "cached": false,
  "data": {
    "date": "2026-06-04",
    "day": "Wednesday",
    "sunrise": "05:58",
    "sunset": "18:32",
    "nakshatra": { "name": "Swati", "start_time": "...", "end_time": "09:45", "lord": "Rahu" },
    "tithi": { ... },
    "yoga": { ... },
    "karana": { ... },
    "rahu_kalam": { "start": "12:00", "end": "13:30" },
    "yamagandam": { "start": "07:30", "end": "09:00" },
    "gulikai": { "start": "10:30", "end": "12:00" },
    "lagna_timings": [
      { "rasi": "Aries", "start": "05:58", "end": "08:10" }
    ],
    "muhurtham_timings": [
      { "name": "Abhijit", "start": "11:52", "end": "12:44", "quality": "Excellent" }
    ],
    "varasoolai": "North",
    "nethram": "East",
    "jeevan": "South"
  }
}
```

---

## /api/muhurtham

### POST /api/muhurtham/find
நல்ல நேர தேதிகளை கண்டுபிடிக்கும்.

**Request**
```json
{
  "start_date": "2026-07-01",
  "end_date": "2026-08-31",
  "occasion": "marriage",
  "latitude": 13.0827,
  "longitude": 80.2707,
  "timezone": "Asia/Kolkata",
  "lang": "ta"
}
```
> `occasion`: `marriage` `house_warming` `vehicle` `business` `education`

**Response `200`**
```json
{
  "success": true,
  "occasion": "marriage",
  "total": 5,
  "data": [
    {
      "date": "2026-07-12",
      "day": "Sunday",
      "nakshatra": "Rohini",
      "tithi": "Panchami",
      "muhurtham": "Abhijit",
      "start_time": "11:52",
      "end_time": "12:44",
      "quality": "Excellent",
      "notes": "சூரியன் உத்தரம் — திருமணத்திற்கு சிறந்தது"
    }
  ]
}
```

---

## /api/matchmaking

### GET /api/matchmaking
நட்சத்திர எண் மூலம் திருமண பொருத்தம். (**Auth தேவையில்லை**)

**Query Params**
```
GET /api/matchmaking?boyNakshatra=4&girlNakshatra=15
```
> `boyNakshatra`, `girlNakshatra`: `0` – `26`

**Response `200`**
```json
{
  "success": true,
  "data": {
    "boy":  { "nakshatra": "Rohini", "nakshatra_number": 4, "rasi": "Taurus" },
    "girl": { "nakshatra": "Swati",  "nakshatra_number": 15, "rasi": "Libra" },
    "score": 7,
    "percentage": 70,
    "recommendation": "Good Match",
    "poruthams": [
      { "name": "Dina",      "match": true,  "score": 1 },
      { "name": "Gana",      "match": true,  "score": 1 },
      { "name": "Mahendra",  "match": false, "score": 0 },
      { "name": "Sthree Dheerga", "match": true, "score": 1 },
      { "name": "Yoni",      "match": true,  "score": 1 },
      { "name": "Rasi",      "match": true,  "score": 1 },
      { "name": "Rasyadhipa","match": false, "score": 0 },
      { "name": "Vasya",     "match": true,  "score": 1 },
      { "name": "Rajju",     "match": true,  "score": 0 },
      { "name": "Vedha",     "match": true,  "score": 1 }
    ],
    "rajjuDosha": false,
    "summaryTamil": "10ல் 7 பொருத்தங்கள் அமைந்துள்ளன. திருமணத்திற்கு நல்ல பொருத்தம்.",
    "summaryEnglish": "7 out of 10 poruthams matched. Good match for marriage."
  }
}
```

**Recommendation values**

| Score | `rajjuDosha` | Recommendation |
|---|---|---|
| ≥ 8 | false | `Excellent Match` |
| ≥ 6 | false | `Good Match` |
| ≥ 4 | false | `Average Match` |
| any | true or < 4 | `Not Recommended` |

---

## /api/pdf

### POST /api/pdf/horoscope
முழு ஜாதகம் PDF ஆக download செய்யும் — ராசி சக்கரம், நவாம்சம், கிரக நிலை, தசா அட்டவணை.

**Request**
```json
{
  "date_of_birth": "1990-06-15",
  "time_of_birth": "06:30",
  "latitude": 13.0827,
  "longitude": 80.2707,
  "timezone": "Asia/Kolkata",
  "name": "Ravi",
  "lang": "ta",
  "ayanamsa": "lahiri"
}
```

**Response `200`**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="AstroJyothi_Ravi.pdf"

<binary PDF data>
```

> PDF-ல் உள்ளவை: ஜாதக விவரம், ராசி சக்கரம் (SVG), நவாம்சம் (SVG), கிரக நிலை அட்டவணை, உபகிரகங்கள், தசா பட்டியல்.

---

## Nakshatra Index

| # | நட்சத்திரம் | | # | நட்சத்திரம் | | # | நட்சத்திரம் |
|---|---|---|---|---|---|---|---|---|
| 0 | Ashwini | | 9 | Aslesha | | 18 | Jyeshtha |
| 1 | Bharani | | 10 | Magha | | 19 | Moola |
| 2 | Krittika | | 11 | Purva Phalguni | | 20 | Purva Ashadha |
| 3 | Rohini | | 12 | Uttara Phalguni | | 21 | Uttara Ashadha |
| 4 | Mrigasira | | 13 | Hasta | | 22 | Shravana |
| 5 | Ardra | | 14 | Chitra | | 23 | Dhanishtha |
| 6 | Punarvasu | | 15 | Swati | | 24 | Shatabhisha |
| 7 | Pushya | | 16 | Vishakha | | 25 | Purva Bhadra |
| 8 | Ashlesha | | 17 | Anuradha | | 26 | Revati |
