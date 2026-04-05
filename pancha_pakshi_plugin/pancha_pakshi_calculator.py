#!/usr/bin/env python3
import sys
import json
from datetime import datetime
import ephem

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

def get_nakshatra(birth_datetime_utc):
    """Calculate Nakshatra from birth datetime (UTC)"""
    moon = ephem.Moon(birth_datetime_utc)
    moon_lon_deg = moon.ra * 180 / ephem.pi
    nakshatra_span = 13 + (20/60)
    nakshatra_index = int(moon_lon_deg / nakshatra_span)
    return nakshatras[nakshatra_index % 27]

def get_paksha(birth_datetime_utc):
    """Calculate Paksha (Waxing/Waning) from birth datetime (UTC)"""
    sun = ephem.Sun(birth_datetime_utc)
    moon = ephem.Moon(birth_datetime_utc)
    sun_lon = ephem.Ecliptic(sun).lon
    moon_lon = ephem.Ecliptic(moon).lon
    diff = (moon_lon - sun_lon + 2 * ephem.pi) % (2 * ephem.pi)
    diff_deg = diff * 180 / ephem.pi
    return 'shukla' if 0 <= diff_deg < 180 else 'krishna'

def get_pakshi_from_nakshatra(nakshatra_name, paksha):
    """Get Pakshi from Nakshatra and Paksha"""
    if nakshatra_name in nakshatra_pakshi_mapping:
        return nakshatra_pakshi_mapping[nakshatra_name].get(paksha)
    return None

def get_location_coordinates(city_name):
    """Get latitude and longitude for a given city (simplified)"""
    # This is a simple mapping; for production, use a proper geocoding API
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

def calculate_pancha_pakshi(birth_date, birth_time, birth_place, person_name, auto_location):
    """Main function to calculate Pancha Pakshi"""
    try:
        # Parse birth date and time
        date_obj = datetime.strptime(birth_date, "%Y-%m-%d")
        time_obj = datetime.strptime(birth_time, "%H:%M")
        
        # Combine date and time
        birth_datetime_local = datetime(
            date_obj.year, date_obj.month, date_obj.day,
            time_obj.hour, time_obj.minute, 0
        )
        
        # Get location coordinates
        lat, lon = get_location_coordinates(birth_place)
        
        # Create observer object
        obs = ephem.Observer()
        obs.lat = str(lat)
        obs.lon = str(lon)
        obs.date = birth_datetime_local
        
        # Calculate Nakshatra and Paksha
        nakshatra = get_nakshatra(obs.date)
        paksha = get_paksha(obs.date)
        pakshi = get_pakshi_from_nakshatra(nakshatra, paksha)
        
        # Return result as JSON
        result = {
            'status': 'success',
            'person_name': person_name,
            'birth_date': birth_date,
            'birth_time': birth_time,
            'birth_place': birth_place,
            'nakshatra': nakshatra,
            'paksha': paksha,
            'janma_pakshi': pakshi,
            'latitude': lat,
            'longitude': lon
        }
        
        return result
    except Exception as e:
        return {
            'status': 'error',
            'message': str(e)
        }

if __name__ == "__main__":
    if len(sys.argv) < 5:
        print(json.dumps({'status': 'error', 'message': 'Missing arguments'}))
        sys.exit(1)
    
    birth_date = sys.argv[1]
    birth_time = sys.argv[2]
    birth_place = sys.argv[3]
    person_name = sys.argv[4]
    auto_location = sys.argv[5] == '1' if len(sys.argv) > 5 else False
    
    result = calculate_pancha_pakshi(birth_date, birth_time, birth_place, person_name, auto_location)
    print(json.dumps(result))
