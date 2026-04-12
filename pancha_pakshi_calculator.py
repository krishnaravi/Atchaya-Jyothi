#!/usr/bin/env python3
import sys
import json
from datetime import datetime, timedelta
import calendar

try:
    import swisseph as swe
    HAS_SWISSEPH = True
except ImportError:
    HAS_SWISSEPH = False

# Nakshatra names in order
nakshatras = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashirsha", "Ardra", "Punarvasu",
    "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta",
    "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Moola", "Purva Ashadha",
    "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
    "Uttara Bhadrapada", "Revati"
]

# Nakshatra to Pakshi mapping
nakshatra_pakshi_mapping = {
    'Ashwini': {'shukla': 'Vulture', 'krishna': 'Owl'},
    'Bharani': {'shukla': 'Owl', 'krishna': 'Vulture'},
    'Krittika': {'shukla': 'Crow', 'krishna': 'Peacock'},
    'Rohini': {'shukla': 'Peacock', 'krishna': 'Crow'},
    'Mrigashirsha': {'shukla': 'Cock', 'krishna': 'Vulture'},
    'Ardra': {'shukla': 'Vulture', 'krishna': 'Owl'},
    'Punarvasu': {'shukla': 'Owl', 'krishna': 'Vulture'},
    'Pushya': {'shukla': 'Crow', 'krishna': 'Peacock'},
    'Ashlesha': {'shukla': 'Peacock', 'krishna': 'Crow'},
    'Magha': {'shukla': 'Cock', 'krishna': 'Vulture'},
    'Purva Phalguni': {'shukla': 'Vulture', 'krishna': 'Owl'},
    'Uttara Phalguni': {'shukla': 'Owl', 'krishna': 'Vulture'},
    'Hasta': {'shukla': 'Crow', 'krishna': 'Peacock'},
    'Chitra': {'shukla': 'Peacock', 'krishna': 'Crow'},
    'Swati': {'shukla': 'Cock', 'krishna': 'Vulture'},
    'Vishakha': {'shukla': 'Vulture', 'krishna': 'Owl'},
    'Anuradha': {'shukla': 'Owl', 'krishna': 'Vulture'},
    'Jyeshtha': {'shukla': 'Crow', 'krishna': 'Peacock'},
    'Moola': {'shukla': 'Peacock', 'krishna': 'Crow'},
    'Purva Ashadha': {'shukla': 'Cock', 'krishna': 'Vulture'},
    'Uttara Ashadha': {'shukla': 'Vulture', 'krishna': 'Owl'},
    'Shravana': {'shukla': 'Owl', 'krishna': 'Vulture'},
    'Dhanishta': {'shukla': 'Crow', 'krishna': 'Peacock'},
    'Shatabhisha': {'shukla': 'Peacock', 'krishna': 'Crow'},
    'Purva Bhadrapada': {'shukla': 'Cock', 'krishna': 'Vulture'},
    'Uttara Bhadrapada': {'shukla': 'Vulture', 'krishna': 'Owl'},
    'Revati': {'shukla': 'Owl', 'krishna': 'Vulture'},
}

def get_julian_day(dt):
    """Convert datetime to Julian Day (UTC)"""
    if HAS_SWISSEPH:
        return swe.julday(dt.year, dt.month, dt.day, dt.hour + dt.minute/60.0 + dt.second/3600.0)
    
    # Fallback JD calculation
    a = (14 - dt.month) // 12
    y = dt.year + 4800 - a
    m = dt.month + 12 * a - 3
    jd = dt.day + (153 * m + 2) // 5 + 365 * y + y // 4 - y // 100 + y // 400 - 32045
    jd += (dt.hour - 12) / 24.0 + dt.minute / 1440.0 + dt.second / 86400.0
    return jd

def get_nakshatra(jd_utc):
    """Calculate Nakshatra from Julian Day (UTC)"""
    if HAS_SWISSEPH:
        swe.set_sid_mode(swe.SIDM_LAHIRI)
        res, flag = swe.calc_ut(jd_utc, swe.MOON, swe.FLG_SIDEREAL)
        moon_lon = res[0]
    else:
        # Very rough approximation for Moon longitude
        # Base Moon longitude at J2000.0: 218.316 degrees
        # Mean motion: 13.176396 degrees per day
        days_since_j2000 = jd_utc - 2451545.0
        moon_lon = (218.316 + 13.176396 * days_since_j2000) % 360

    nakshatra_span = 13.333333333333334
    nakshatra_index = int(moon_lon / nakshatra_span)
    return nakshatras[nakshatra_index % 27]

def get_paksha(jd_utc):
    """Calculate Paksha (Waxing/Waning) from Julian Day (UTC)"""
    if HAS_SWISSEPH:
        res_sun, flag = swe.calc_ut(jd_utc, swe.SUN)
        res_moon, flag = swe.calc_ut(jd_utc, swe.MOON)
        sun_lon = res_sun[0]
        moon_lon = res_moon[0]
    else:
        # Rough approximation for Sun and Moon
        days_since_j2000 = jd_utc - 2451545.0
        sun_lon = (280.460 + 0.9856474 * days_since_j2000) % 360
        moon_lon = (218.316 + 13.176396 * days_since_j2000) % 360
    
    diff = (moon_lon - sun_lon + 360) % 360
    return 'shukla' if 0 <= diff < 180 else 'krishna'

def get_pakshi_from_nakshatra(nakshatra_name, paksha):
    """Get Pakshi from Nakshatra and Paksha"""
    if nakshatra_name in nakshatra_pakshi_mapping:
        return nakshatra_pakshi_mapping[nakshatra_name].get(paksha)
    return None

def get_location_coordinates(city_name):
    """Fallback coordinates for common cities"""
    cities = {
        'Chennai': (13.0827, 80.2707),
        'சென்னை': (13.0827, 80.2707),
        'Delhi': (28.7041, 77.1025),
        'Mumbai': (19.0760, 72.8777),
        'Bangalore': (12.9716, 77.5946),
        'Hyderabad': (17.3850, 78.4867),
        'Kolkata': (22.5726, 88.3639),
    }
    return cities.get(city_name, (13.0827, 80.2707))  # Default to Chennai

def calculate_pancha_pakshi(birth_date, birth_time, birth_place, person_name, lat=None, lon=None):
    """Main function to calculate Pancha Pakshi using Swiss Ephemeris"""
    try:
        # Parse birth date and time
        date_obj = datetime.strptime(birth_date, "%Y-%m-%d")
        time_obj = datetime.strptime(birth_time, "%H:%M")
        
        # Combine date and time (Local)
        dt_local = datetime(
            date_obj.year, date_obj.month, date_obj.day,
            time_obj.hour, time_obj.minute, 0
        )
        
        # Determine coordinates
        if lat is not None and lon is not None:
            latitude, longitude = float(lat), float(lon)
        else:
            latitude, longitude = get_location_coordinates(birth_place)
            
        # Assume IST (+5:30)
        dt_utc = dt_local - timedelta(hours=5, minutes=30)
        jd_utc = get_julian_day(dt_utc)
        
        # Swiss Ephemeris needs to be reset for each calculation to be safe
        if HAS_SWISSEPH:
            swe.set_ephe_path(None) # Use built-in ephemeris if files not found
        
        # Calculate Nakshatra and Paksha using Swiss Ephemeris
        nakshatra = get_nakshatra(jd_utc)
        paksha = get_paksha(jd_utc)
        pakshi = get_pakshi_from_nakshatra(nakshatra, paksha)
        
        # Calculate Sunrise and Sunset
        if HAS_SWISSEPH:
            geopos = (longitude, latitude, 0.0)
            res, tret_rise = swe.rise_trans(jd_utc, swe.SUN, 1, geopos, 0, 0, swe.FLG_SWIEPH)
            res, tret_set = swe.rise_trans(jd_utc, swe.SUN, 2, geopos, 0, 0, swe.FLG_SWIEPH)
            
            def jd_to_local_str(jd_val):
                year, month, day, hour = swe.revjul(float(jd_val))
                total_minutes = int(hour * 60)
                h = total_minutes // 60
                m = total_minutes % 60
                dt = datetime(year, month, day, h, m) + timedelta(hours=5, minutes=30)
                return dt.strftime("%H:%M")

            sunrise_str = jd_to_local_str(tret_rise[0])
            sunset_str = jd_to_local_str(tret_set[0])
        else:
            # Simple fallback for Sunrise/Sunset (roughly 6 AM / 6 PM)
            sunrise_str = "06:15"
            sunset_str = "18:20"
        
        # Get day of week (0=Monday, 6=Sunday)
        day_of_week = dt_local.weekday()
        
        # Activity mapping for Shukla Paksha (Waxing)
        # Order of activities for each day: Eating, Walking, Ruling, Sleeping, Dying
        # Day: Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6
        # Birds: Vulture, Owl, Crow, Cock, Peacock
        
        birds = ['Vulture', 'Owl', 'Crow', 'Cock', 'Peacock']
        
        # Shukla Paksha Day-wise sequence (Standard Vedic)
        # Weekday: Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6
        shukla_day_order = {
            6: [0, 1, 2, 3, 4], # Sunday: V, O, Cr, Co, P
            0: [1, 2, 3, 4, 0], # Monday: O, Cr, Co, P, V
            1: [2, 3, 4, 0, 1], # Tuesday: Cr, Co, P, V, O
            2: [3, 4, 0, 1, 2], # Wednesday: Co, P, V, O, Cr
            3: [4, 0, 1, 2, 3], # Thursday: P, V, O, Cr, Co
            4: [0, 1, 2, 3, 4], # Friday: V, O, Cr, Co, P
            5: [1, 2, 3, 4, 0], # Saturday: O, Cr, Co, P, V
        }
        
        # Krishna Paksha Day-wise sequence (Standard Vedic)
        krishna_day_order = {
            6: [3, 4, 0, 1, 2], # Sunday: Co, P, V, O, Cr
            0: [4, 0, 1, 2, 3], # Monday: P, V, O, Cr, Co
            1: [0, 1, 2, 3, 4], # Tuesday: V, O, Cr, Co, P
            2: [1, 2, 3, 4, 0], # Wednesday: O, Cr, Co, P, V
            3: [2, 3, 4, 0, 1], # Thursday: Cr, Co, P, V, O
            4: [3, 4, 0, 1, 2], # Friday: Co, P, V, O, Cr
            5: [4, 0, 1, 2, 3], # Saturday: P, V, O, Cr, Co
        }
        
        order_map = shukla_day_order if paksha == 'shukla' else krishna_day_order
        today_order = order_map.get(day_of_week, [0, 1, 2, 3, 4])
        
        activities = ['Eating', 'Walking', 'Ruling', 'Sleeping', 'Dying']
        tamil_activities = ['ஊண் (Eating)', 'நடை (Walking)', 'அரசு (Ruling)', 'துயில் (Sleeping)', 'சாவு (Dying)']
        
        daily_table = {}
        for i, bird_idx in enumerate(today_order):
            bird_name = birds[bird_idx]
            # Rotate activities based on position
            bird_activities = {}
            for j in range(5):
                act_idx = (i + j) % 5
                bird_activities[f'J{j+1}'] = tamil_activities[act_idx]
            daily_table[bird_name] = bird_activities
        
        result = {
            'success': True,
            'name': person_name,
            'birth_date': birth_date,
            'birth_time': birth_time,
            'birth_place': birth_place,
            'nakshatra': nakshatra,
            'paksha': paksha.capitalize(),
            'janma_pakshi': pakshi,
            'sunrise': sunrise_str,
            'sunset': sunset_str,
            'latitude': latitude,
            'longitude': longitude,
            'daily_pakshi_table': daily_table
        }
        
        return result
    except Exception as e:
        return {
            'success': False,
            'data': str(e)
        }

if __name__ == "__main__":
    if len(sys.argv) < 5:
        print(json.dumps({'success': False, 'data': 'Missing arguments'}))
        sys.exit(1)
    
    person_name = sys.argv[1]
    birth_date = sys.argv[2]
    birth_time = sys.argv[3]
    birth_place = sys.argv[4]
    
    # Optional lat/lon
    lat = sys.argv[5] if len(sys.argv) > 5 and sys.argv[5] != "" else None
    lon = sys.argv[6] if len(sys.argv) > 6 and sys.argv[6] != "" else None
    
    result = calculate_pancha_pakshi(birth_date, birth_time, birth_place, person_name, lat, lon)
    print(json.dumps(result))
