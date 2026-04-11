# Pancha Pakshi Calculator Plugin - Installation & Fix Guide

## Problem Diagnosis
The Server Error (500) was caused by a **missing Python dependency**: the `pyswisseph` library was not installed on the server.

### Root Cause
- The `pancha_pakshi_calculator.py` script requires `swisseph` (Swiss Ephemeris)
- When the AJAX call is made from the frontend, the PHP plugin executes the Python script via `shell_exec()`
- If `swisseph` is not installed, Python throws `ModuleNotFoundError: No module named 'swisseph'`
- This error is captured by the PHP error handler and returned as a 500 error

## Solution: Install Required Dependencies

### Step 1: Install Python 3.6+ (if not already installed)
```bash
sudo apt-get update
sudo apt-get install python3 python3-pip
```

### Step 2: Install the Swiss Ephemeris Library
```bash
sudo pip3 install pyswisseph
```

This installs the `swisseph` module that the Python calculator script needs.

### Step 3: Verify Installation
Test the Python script directly:
```bash
python3 /path/to/plugin/pancha_pakshi_calculator.py "TestName" "1990-01-01" "12:00" "Chennai"
```

Expected output: A JSON object with calculated Pancha Pakshi data.

### Step 4: Ensure File Permissions
Make sure the Python script is readable and executable:
```bash
chmod 755 /path/to/plugin/pancha_pakshi_calculator.py
```

### Step 5: Verify WordPress Plugin Activation
1. Log in to WordPress Admin Dashboard
2. Go to **Plugins**
3. Locate "Pancha Pakshi Calculator"
4. Click **Activate** (if not already active)

## Testing the Plugin

### Frontend Test
1. Create or edit a WordPress page
2. Add the shortcode: `[pancha_pakshi_calculator]`
3. Publish and view the page
4. Fill in the form with sample data:
   - Name: Atchaya
   - Birth Date: 1960-01-01
   - Birth Time: 12:00
   - Birth Place: Chennai
5. Click "Calculate" button
6. Verify that results are displayed without errors

### Backend Test (via PHP WP-CLI)
```bash
wp eval 'do_action("wp_ajax_pancha_pakshi_calculate");'
```

## Troubleshooting

### Error: "Python script is not executable"
**Solution**: Run `chmod 755 /path/to/plugin/pancha_pakshi_calculator.py`

### Error: "ModuleNotFoundError: No module named 'swisseph'"
**Solution**: Run `sudo pip3 install pyswisseph`

### Error: "AJAX Error: Unable to calculate Pancha Pakshi"
**Solution**: 
1. Check WordPress debug logs: `/wp-content/debug.log`
2. Check server error logs: `/var/log/apache2/error.log` or `/var/log/nginx/error.log`
3. Verify Python script permissions and dependencies

### Error: "Calculation failed. Raw output: ..."
**Solution**: The raw output in the error message will show the exact Python error. Common issues:
- Missing `pyswisseph` library
- Invalid date/time format
- Unsupported city name

## System Requirements

| Requirement | Version |
|-------------|---------|
| PHP | 7.2+ |
| WordPress | 5.0+ |
| Python | 3.6+ |
| pyswisseph | 2.10+ |

## Plugin Features

- ✅ Vedic Astrology Pancha Pakshi Calculation
- ✅ Nakshatra and Paksha Determination
- ✅ Daily Pancha Pakshi Activity Table
- ✅ Sunrise/Sunset Calculation
- ✅ Auto-location Detection (with browser geolocation)
- ✅ City Autocomplete
- ✅ Responsive Design (Mobile-friendly)
- ✅ Divi & Elementor Page Builder Compatible
- ✅ Inline CSS/JS (No external dependencies)

## Support

For additional help, check:
- WordPress Plugin Documentation
- Swiss Ephemeris Documentation: https://www.astro.com/swisseph/
- GitHub Repository: https://github.com/krishnaravi/Atchaya-Jyothi

---
**Last Updated**: April 11, 2026
**Plugin Version**: 2.3
