import math
import sys
import json
from datetime import datetime, timezone, timedelta

# Simple algorithms for planetary positions (low precision but sufficient for general use)
# Reference: Jean Meeus, "Astronomical Algorithms"

def get_julian_date(year, month, day, hour=0, minute=0, second=0):
    if month <= 2:
        year -= 1
        month += 12
    A = math.floor(year / 100)
    B = 2 - A + math.floor(A / 4)
    jd = math.floor(365.25 * (year + 4716)) + math.floor(30.6001 * (month + 1)) + day + B - 1524.5
    jd += (hour + minute / 60.0 + second / 3600.0) / 24.0
    return jd

def get_planetary_positions(jd):
    # Time in Julian centuries from J2000.0
    T = (jd - 2451545.0) / 36525.0
    
    # Lahiri Ayanamsa (approximate)
    ayanamsa = 23.0 + 51.0/60.0 + 11.0/3600.0 + (50.27/3600.0) * (jd - 2415020.0) / 365.25
    
    def normalize(angle):
        return angle % 360.0

    # Sun (Mean Longitude)
    L0 = normalize(280.46646 + 36000.76983 * T)
    M = normalize(357.52911 + 35999.05029 * T)
    sun_long = normalize(L0 + 1.914602 * math.sin(math.radians(M)) + 0.019993 * math.sin(math.radians(2*M)))
    
    # Moon (Mean Longitude)
    L_moon = normalize(218.31644 + 481267.88123 * T)
    M_moon = normalize(134.96339 + 477198.86750 * T)
    D = normalize(297.85019 + 445267.11140 * T)
    moon_long = normalize(L_moon + 6.288774 * math.sin(math.radians(M_moon)) + 1.274027 * math.sin(math.radians(2*D - M_moon)))
    
    # Sidereal Longitudes (Lahiri)
    sun_sidereal = normalize(sun_long - ayanamsa)
    moon_sidereal = normalize(moon_long - ayanamsa)
    
    # Simplified positions for other planets (just mean longitudes for demonstration)
    planets = {
        "Sun": sun_sidereal,
        "Moon": moon_sidereal,
        "Mars": normalize(355.45332 + 19140.30268 * T - ayanamsa),
        "Mercury": normalize(252.25084 + 149472.67411 * T - ayanamsa),
        "Jupiter": normalize(34.35142 + 3034.74612 * T - ayanamsa),
        "Venus": normalize(181.97973 + 58517.81464 * T - ayanamsa),
        "Saturn": normalize(50.07747 + 1222.11379 * T - ayanamsa),
        "Rahu": normalize(125.04452 - 1934.13626 * T - ayanamsa),
        "Ketu": normalize(125.04452 - 1934.13626 * T - ayanamsa + 180.0)
    }
    
    return planets, ayanamsa

def get_panchang(sun_long, moon_long):
    # Tithi: (Moon - Sun) / 12
    diff = (moon_long - sun_long) % 360.0
    tithi_num = math.floor(diff / 12.0) + 1
    
    # Nakshatra: Moon / 13.3333
    nak_num = math.floor(moon_long / (360.0 / 27.0)) + 1
    pada = math.floor((moon_long % (360.0 / 27.0)) / (360.0 / 108.0)) + 1
    
    # Yoga: (Sun + Moon) / 13.3333
    yoga_num = math.floor(((sun_long + moon_long) % 360.0) / (360.0 / 27.0)) + 1
    
    # Karana: Tithi / 2
    karana_num = math.floor(diff / 6.0) + 1
    
    return {
        "tithi": tithi_num,
        "nakshatra": nak_num,
        "pada": pada,
        "yoga": yoga_num,
        "karana": karana_num
    }

def get_rasi(longitude):
    return math.floor(longitude / 30.0) + 1

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.argv[1])
        date_str = input_data.get("date", datetime.now().strftime("%Y-%m-%d"))
        dt = datetime.strptime(date_str, "%Y-%m-%d")
        
        jd = get_julian_date(dt.year, dt.month, dt.day, 12, 0, 0) # Noon UTC
        planets, ayanamsa = get_planetary_positions(jd)
        panchang = get_panchang(planets["Sun"], planets["Moon"])
        
        rasi_chart = {}
        planet_details = []
        for p, lon in planets.items():
            r = get_rasi(lon)
            deg = lon % 30.0
            rasi_chart[str(r)] = rasi_chart.get(str(r), []) + [p]
            planet_details.append({
                "planet": p,
                "longitude": lon,
                "rasi": r,
                "degree": deg,
                "nakshatra": math.floor(lon / (360.0 / 27.0)) + 1,
                "pada": math.floor((lon % (360.0 / 27.0)) / (360.0 / 108.0)) + 1
            })
            
        result = {
            "date": date_str,
            "ayanamsa": ayanamsa,
            "panchang": panchang,
            "planets": planet_details,
            "rasi_chart": rasi_chart
        }
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
