# Pancha Pakshi Calculator - WordPress Plugin

## பஞ்ச பட்சி கால்குலேட்டர் - WordPress Plugin

ஒரு முழுமையான பஞ்ச பட்சி (Pancha Pakshi) கணக்கீட்டு WordPress Plugin, இது பிறந்த நட்சத்திரம் மூலம் ஜென்ம பட்சியைக் கண்டறிந்து, அன்றைய நாளின் 5 பட்சிகளுக்கான அட்டவணையை வழங்குகிறது.

## Features / அம்சங்கள்

1. **Janma Pakshi Calculator** - பிறந்த தேதி, நேரம், ஊர் கொடுத்தால் ஜென்ம பட்சியைக் கண்டறிதல்
2. **Daily Pancha Pakshi Table** - அன்றைய நாளின் 5 பட்சிகளுக்கான பகல் மற்றும் இரவு நேர அட்டவணை
3. **Auto Location Support** - பிரவுசர் Geolocation API மூலம் தற்போதைய இடத்தைப் பயன்படுத்துதல்
4. **Offline Support** - தரவுத்தளம் உள்வாங்கப்பட்டுள்ளதால் offline-ல் வேலை செய்தல்
5. **Responsive Design** - Desktop, Tablet, Mobile-ல் சரியாகக் காட்டுதல்

## Installation / நிறுவல்

### Step 1: Copy Plugin Files
```bash
# WordPress plugins directory-ல் folder உருவாக்கவும்
mkdir -p /path/to/wordpress/wp-content/plugins/pancha-pakshi/

# Plugin files-ஐ copy செய்யவும்
cp -r /home/ubuntu/pancha_pakshi_plugin/* /path/to/wordpress/wp-content/plugins/pancha-pakshi/
```

### Step 2: Activate Plugin
1. WordPress Admin Panel-ல் login செய்யவும்
2. Plugins → Installed Plugins-ல் செல்லவும்
3. "Pancha Pakshi Calculator" plugin-ஐ Activate செய்யவும்

### Step 3: Add Shortcode to Page
```
[pancha_pakshi_calculator]
```

## Usage / பயன்பாடு

### For Users / பயனர்களுக்கு
1. பெயர் உள்ளிடவும்
2. பிறந்த தேதி (YYYY-MM-DD) உள்ளிடவும்
3. பிறந்த நேரம் (HH:MM) உள்ளிடவும்
4. பிறந்த ஊர் உள்ளிடவும்
5. "கணக்கிடு / Calculate" பொத்தாம் அழுத்தவும்
6. ஜென்ம பட்சி மற்றும் அன்றைய நாளின் அட்டவணை பெறவும்

## System Requirements / கணினி தேவைகள்

- WordPress 5.0+
- PHP 7.4+
- Python 3.6+ (Server-ல் installed)
- PyEphem library (Python)

## Installation of Dependencies / சார்புகளை நிறுவல்

```bash
# Python dependencies
pip3 install ephem

# WordPress-ல் plugin folder permissions
chmod 755 /path/to/wordpress/wp-content/plugins/pancha-pakshi/
```

## File Structure / கோப்பு அமைப்பு

```
pancha-pakshi/
├── pancha-pakshi-plugin.php          # Main plugin file
├── pancha-pakshi-script.js           # JavaScript (AJAX & UI)
├── pancha-pakshi-style.css           # Styling
├── pancha_pakshi_calculator.py       # Python calculator
├── pancha_pakshi_logic.py            # Core astrological logic
├── pancha_pakshi_activities.py       # Daily activities data
└── README.md                         # This file
```

## How It Works / எப்படி வேலை செய்கிறது

1. **User Input** - பயனர் பிறந்த தேதி, நேரம், ஊர் உள்ளிடுகிறார்
2. **AJAX Request** - JavaScript மூலம் WordPress AJAX endpoint-க்கு request அனுப்பப்படுகிறது
3. **Python Calculation** - PHP script Python calculator-ஐ call செய்கிறது
4. **Nakshatra & Paksha** - PyEphem library மூலம் சந்திரன்ின் நிலையைக் கணக்கிடுகிறது
5. **Pakshi Mapping** - நட்சத்திரம் மற்றும் பக்ஷத்திலிருந்து பட்சி கண்டறியப்படுகிறது
6. **Display Results** - ফলாফல் HTML table-ல் display செய்யப்படுகிறது

## Nakshatra to Pakshi Mapping / நட்சத்திரம் முதல் பட்சி மாப்பிங்

| Nakshatra | Shukla Paksha | Krishna Paksha |
|-----------|---------------|----------------|
| Ashwini | Vulture | Owl |
| Bharani | Owl | Vulture |
| Krittika | Crow | Peacock |
| Rohini | Peacock | Crow |
| ... | ... | ... |

(முழுமையான list pancha_pakshi_logic.py-ல் உள்ளது)

## Pancha Pakshi Activities / பஞ்ச பட்சி தொழில்கள்

ஒவ்வொரு பட்சிக்கும் 5 தொழில்கள் உள்ளன:
- **ஊண் (Eating)** - உணவு உண்ணும் நேரம்
- **நடை (Walking)** - நடக்கும் நேரம்
- **அரசு (Ruling)** - ஆட்சி செய்யும் நேரம்
- **துயில் (Sleeping)** - தூங்கும் நேரம்
- **சாவு (Death)** - மரணம் (பிறப்பு) நேரம்

## Troubleshooting / பிரச்சனை தீர்க்கல்

### Issue: "AJAX Error: Unable to calculate Pancha Pakshi"
**Solution:** 
- Python 3 மற்றும் ephem library installed உள்ளதா சரிபார்க்கவும்
- Plugin folder permissions சரிபார்க்கவும் (755)
- WordPress error logs check செய்யவும்

### Issue: "Calculation failed"
**Solution:**
- Birth date/time format சரிபார்க்கவும் (YYYY-MM-DD, HH:MM)
- City name சரிபார்க்கவும் (supported cities list-ல் உள்ளதா)

## Future Enhancements / எதிர்கால மேம்பாடுகள்

1. Divisional Charts (D60, D120, D144) support
2. Nakshatra Pada (Quarter) calculations
3. Advanced Jaimini astrology features
4. Multi-language support (Tamil, English, Hindi)
5. Database caching for faster calculations
6. REST API for external integrations

## Support / உதவி

பிரச்சனைகள் அல்லது பரிந்துரைகளுக்கு, தயவுசெய்து contact செய்யவும்:
- Email: support@atchayajyothi.com
- Website: https://atchayajyothi.com

## License / உரிமம்

GPL v2 or later

---

**Version:** 1.0  
**Author:** Manus AI  
**Last Updated:** 2024-04-04
