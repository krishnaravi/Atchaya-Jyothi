#!/usr/bin/env python3
import sys
import json
from datetime import datetime, timedelta
import swisseph as swe

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
    return swe.julday(dt.year, dt.month, dt.day, dt.hour + dt.minute/60.0 + dt.second/3600.0)

def get_nakshatra(jd_utc):
    """Calculate Nakshatra from Julian Day (UTC) using Swiss Ephemeris"""
    # Set Ayanamsa to Lahiri (standard for Vedic astrology)
    swe.set_sid_mode(swe.SIDM_LAHIRI)
    
    # Calculate Moon position (Sidereal)
    res, flag = swe.calc_ut(jd_utc, swe.MOON, swe.FLG_SIDEREAL)
    moon_lon = res[0]
    
    # Each nakshatra spans 13 degrees 20 minutes (13.3333 degrees)
    nakshatra_span = 13.333333333333334
    nakshatra_index = int(moon_lon / nakshatra_span)
    return nakshatras[nakshatra_index % 27]

def get_paksha(jd_utc):
    """Calculate Paksha (Waxing/Waning) from Julian Day (UTC)"""
    # Calculate Sun and Moon positions (Tropical is fine for relative distance)
    res_sun, flag = swe.calc_ut(jd_utc, swe.SUN)
    res_moon, flag = swe.calc_ut(jd_utc, swe.MOON)
    
    sun_lon = res_sun[0]
    moon_lon = res_moon[0]
    
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
            
        # For simplicity, assume IST (+5:30) if no timezone is provided
        # Professional implementation should use a timezone library
        dt_utc = dt_local - timedelta(hours=5, minutes=30)
        jd_utc = get_julian_day(dt_utc)
        
        # Calculate Nakshatra and Paksha using Swiss Ephemeris
        nakshatra = get_nakshatra(jd_utc)
        paksha = get_paksha(jd_utc)
        pakshi = get_pakshi_from_nakshatra(nakshatra, paksha)
        
        # Calculate Sunrise and Sunset for the given day/location
        # Using swisseph for sunrise/sunset
        # rise_trans(tjdut, body, rsmi, geopos, atpress=0.0, attemp=0.0, flags=FLG_SWIEPH)
        # rsmi: CALC_RISE=1, CALC_SET=2
        geopos = (longitude, latitude, 0.0)
        res, tret_rise = swe.rise_trans(jd_utc, swe.SUN, 1, geopos, 0, 0, swe.FLG_SWIEPH)
        res, tret_set = swe.rise_trans(jd_utc, swe.SUN, 2, geopos, 0, 0, swe.FLG_SWIEPH)
        
        # Convert JD back to local time
        def jd_to_local_str(jd_val):
            year, month, day, hour = swe.revjul(float(jd_val))
            h = int(hour)
            m = int((hour - h) * 60)
            # Adjust back to IST (+5:30)
            dt = datetime(year, month, day, h, m) + timedelta(hours=5, minutes=30)
            return dt.strftime("%H:%M")

        sunrise_str = jd_to_local_str(tret_rise[0])
        sunset_str = jd_to_local_str(tret_set[0])
        
        # Daily Pakshi Activities (Simplified placeholder)
        # In a real Pancha Pakshi system, activities change by day of the week
        # For now, keeping the structure compatible with existing UI
        daily_table = {
            'Vulture': {'J1': 'Eating', 'J2': 'Walking', 'J3': 'Ruling', 'J4': 'Sleeping', 'J5': 'Dying'},
            'Owl': {'J1': 'Walking', 'J2': 'Ruling', 'J3': 'Sleeping', 'J4': 'Dying', 'J5': 'Eating'},
            'Crow': {'J1': 'Ruling', 'J2': 'Sleeping', 'J3': 'Dying', 'J4': 'Eating', 'J5': 'Walking'},
            'Cock': {'J1': 'Sleeping', 'J2': 'Dying', 'J3': 'Eating', 'J4': 'Walking', 'J5': 'Ruling'},
            'Peacock': {'J1': 'Dying', 'J2': 'Eating', 'J3': 'Walking', 'J4': 'Ruling', 'J5': 'Sleeping'},
        }
        
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
