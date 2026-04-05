
import ephem
from datetime import datetime

# Nakshatra names in order
nakshatras = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashirsha", "Ardra", "Punarvasu",
    "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta",
    "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Moola", "Purva Ashadha",
    "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
    "Uttara Bhadrapada", "Revati"
]

def get_nakshatra(birth_datetime_utc):
    moon = ephem.Moon(birth_datetime_utc)
    # Moon's longitude in degrees
    moon_lon_deg = moon.ra * 180 / ephem.pi # Convert radians to degrees

    # Each nakshatra spans 13 degrees 20 minutes (13.3333 degrees)
    nakshatra_span = 13 + (20/60)
    nakshatra_index = int(moon_lon_deg / nakshatra_span)
    return nakshatras[nakshatra_index % 27]

def get_paksha(birth_datetime_utc):
    sun = ephem.Sun(birth_datetime_utc)
    moon = ephem.Moon(birth_datetime_utc)

    # Calculate the angular distance between Sun and Moon
    # New Moon is 0 degrees, Full Moon is 180 degrees
    # Waxing (Shukla) is 0-180, Waning (Krishna) is 180-360 (or -180 to 0)
    sun_lon = ephem.Ecliptic(sun).lon
    moon_lon = ephem.Ecliptic(moon).lon

    diff = (moon_lon - sun_lon + 2 * ephem.pi) % (2 * ephem.pi)
    diff_deg = diff * 180 / ephem.pi

    if 0 <= diff_deg < 180:
        return 'shukla' # Waxing Moon
    else:
        return 'krishna' # Waning Moon

# Example usage for Nakshatra and Paksha:
# obs = ephem.Observer()
# obs.lat = '13.0827' # Chennai Latitude
# obs.lon = '80.2707' # Chennai Longitude
# obs.date = datetime(2024, 4, 4, 10, 30, 0) # Example UTC datetime
# print(get_nakshatra(obs.date))
# print(get_paksha(obs.date))



def get_pakshi_from_nakshatra(nakshatra_name, paksha): # paksha: 'shukla' (waxing) or 'krishna' (waning)
    nakshatra_pakshi_mapping = {
        # Shukla Paksha (Waxing Moon)
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

    if nakshatra_name in nakshatra_pakshi_mapping:
        return nakshatra_pakshi_mapping[nakshatra_name].get(paksha)
    return None

# Example usage:
# print(get_pakshi_from_nakshatra('Ashwini', 'shukla')) # Expected: Vulture
# print(get_pakshi_from_nakshatra('Ashwini', 'krishna')) # Expected: Owl


if __name__ == "__main__":
    # Test with sample data (Chennai, April 4, 2024, 10:30 AM UTC)
    # Note: For accurate results, convert local time to UTC and provide correct lat/lon.
    obs = ephem.Observer()
    obs.lat = '13.0827'  # Chennai Latitude
    obs.lon = '80.2707'  # Chennai Longitude
    obs.date = datetime(2024, 4, 4, 10, 30, 0)  # Example UTC datetime

    nakshatra = get_nakshatra(obs.date)
    paksha = get_paksha(obs.date)
    pakshi = get_pakshi_from_nakshatra(nakshatra, paksha)

    print(f"Birth Date/Time (UTC): {obs.date}")
    print(f"Nakshatra: {nakshatra}")
    print(f"Paksha: {paksha}")
    print(f"Janma Pakshi: {pakshi}")
