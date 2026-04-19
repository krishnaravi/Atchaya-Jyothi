<?php
/**
 * Template for displaying the Panchang.
 */

if (!defined('ABSPATH')) {
    exit;
}

// Ensure $panchang_data is available
if (empty($panchang_data)) {
    echo '<p>Error: Panchang data not found.</p>';
    return;
}
?>

<div class="atchaya-panchang">
    <div class="atchaya-header">
        <h1>அட்சயஜோதி தின பஞ்சாங்கம்</h1>
        <p><?php echo date('d-m-Y', strtotime($panchang_data['date'])); ?> | <span id="current-place"><?php echo esc_html($panchang_data['place']); ?></span></p>
    </div>

    <div class="section">
        <div class="panchangam-container">
            <label>ஊர் பெயரை உள்ளிடவும்:</label>
            <input type="text" id="cityInput" placeholder="Ex: Vellore">
            <div id="results" style="border: 1px solid #ccc; display: none; position: absolute; background: #fff; z-index: 100;"></div>

            <div style="margin-top: 10px;">
                <span>Lat: <b id="latVal">-</b></span> | 
                <span>Long: <b id="lonVal">-</b></span>
            </div>
        </div>
    </div>

    <div class="section">
        <label for="date-picker">தேதி தேர்வு செய்யவும்:</label>
        <input type="date" id="date-picker" class="date-picker" value="<?php echo esc_attr($panchang_data["date"]); ?>">
    </div>

    <div class="section">
        <label for="lang-selector">மொழி தேர்வு செய்யவும்:</label>
        <select id="lang-selector" class="lang-selector">
            <option value="ta" <?php selected($panchang_data["lang"], "ta"); ?>>தமிழ்</option>
            <option value="en" <?php selected($panchang_data["lang"], "en"); ?>>English</option>
            <option value="te" <?php selected($panchang_data["lang"], "te"); ?>>తెలుగు</option>
            <option value="ka" <?php selected($panchang_data["lang"], "ka"); ?>>ಕನ್ನಡ</option>
            <option value="hi" <?php selected($panchang_data["lang"], "hi"); ?>>हिन्दी</option>
            <option value="ml" <?php selected($panchang_data["lang"], "ml"); ?>>മലയാളം</option>
        </select>
    </div>

    <div class="atchaya-panchang-dynamic-content">
        <div class="blue-banner">
            இன்றைய பஞ்சாங்கம்
        </div>

    <div class="panchang-grid">
        <div class="info-card">
            <h3>திதி (Tithi)</h3>
            <p class="tamil-text"><?php echo esc_html($panchang_data['tithi']['tamil']); ?></p>
            <p>முடிவு: <span class="time-value"><?php echo esc_html($panchang_data['tithi']['end_time']); ?></span></p>
        </div>

        <div class="info-card">
            <h3>நட்சத்திரம் (Nakshatra)</h3>
            <p class="tamil-text"><?php echo esc_html($panchang_data['nakshatra']['tamil']); ?></p>
            <p>முடிவு: <span class="time-value"><?php echo esc_html($panchang_data['nakshatra']['end_time']); ?></span></p>
        </div>

        <div class="info-card">
            <h3>யோகம் (Yoga)</h3>
            <p class="tamil-text"><?php echo esc_html($panchang_data['yoga']['tamil']); ?></p>
            <p>முடிவு: <span class="time-value"><?php echo esc_html($panchang_data['yoga']['end_time']); ?></span></p>
        </div>

        <div class="info-card">
            <h3>கரணம் (Karana)</h3>
            <p class="tamil-text"><?php echo esc_html($panchang_data['karana']['tamil']); ?></p>
            <p>முடிவு: <span class="time-value"><?php echo esc_html($panchang_data['karana']['end_time']); ?></span></p>
        </div>
    </div>

    <div class="section">
        <div class="blue-banner" style="margin-bottom: 20px;">முக்கிய நேரங்கள் (Auspicious & Inauspicious Times)</div>
        <table>
            <tr>
                <th>விவரம்</th>
                <th>நேரம்</th>
            </tr>
            <tr>
                <td>சூரிய உதயம் (Sunrise)</td>
                <td><span class="time-value"><?php echo esc_html($panchang_data['sunrise']); ?></span></td>
            </tr>
            <tr>
                <td>சூரிய அஸ்தமனம் (Sunset)</td>
                <td><span class="time-value"><?php echo esc_html($panchang_data['sunset']); ?></span></td>
            </tr>
            <tr>
                <td>ராகு காலம் (Rahu Kalam)</td>
                <td><span class="time-value"><?php echo esc_html($panchang_data['rahu_kalam']); ?></span></td>
            </tr>
            <tr>
                <td>குளிகை காலம் (Gulika Kalam)</td>
                <td><span class="time-value"><?php echo esc_html($panchang_data['gulika_kalam']); ?></span></td>
            </tr>
            <tr>
                <td>எமகண்டம் (Yamagandam)</td>
                <td><span class="time-value"><?php echo esc_html($panchang_data['yamagandam']); ?></span></td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="blue-banner" style="margin-bottom: 20px;">ராசி கட்டம் (Rasi Chart)</div>
        <div class="rasi-grid">
            <!-- Row 1 -->
            <div class="rasi-box">மீனம்<br><?php echo isset($panchang_data['rasi_chart']['12']) ? $panchang_data['rasi_chart']['12'] : ''; ?></div>
            <div class="rasi-box">மேஷம்<br><?php echo isset($panchang_data['rasi_chart']['1']) ? $panchang_data['rasi_chart']['1'] : ''; ?></div>
            <div class="rasi-box">ரிஷபம்<br><?php echo isset($panchang_data['rasi_chart']['2']) ? $panchang_data['rasi_chart']['2'] : ''; ?></div>
            <div class="rasi-box">மிதுனம்<br><?php echo isset($panchang_data['rasi_chart']['3']) ? $panchang_data['rasi_chart']['3'] : ''; ?></div>
            
            <!-- Row 2 -->
            <div class="rasi-box">கும்பம்<br><?php echo isset($panchang_data['rasi_chart']['11']) ? $panchang_data['rasi_chart']['11'] : ''; ?></div>
            <div class="rasi-center">ராசி</div>
            <div class="rasi-box">கடகம்<br><?php echo isset($panchang_data['rasi_chart']['4']) ? $panchang_data['rasi_chart']['4'] : ''; ?></div>
            
            <!-- Row 3 -->
            <div class="rasi-box">மகரம்<br><?php echo isset($panchang_data['rasi_chart']['10']) ? $panchang_data['rasi_chart']['10'] : ''; ?></div>
            <div class="rasi-box">சிம்மம்<br><?php echo isset($panchang_data['rasi_chart']['5']) ? $panchang_data['rasi_chart']['5'] : ''; ?></div>
            
            <!-- Row 4 -->
            <div class="rasi-box">தனுசு<br><?php echo isset($panchang_data['rasi_chart']['9']) ? $panchang_data['rasi_chart']['9'] : ''; ?></div>
            <div class="rasi-box">விருச்சிகம்<br><?php echo isset($panchang_data['rasi_chart']['8']) ? $panchang_data['rasi_chart']['8'] : ''; ?></div>
            <div class="rasi-box">துலாம்<br><?php echo isset($panchang_data['rasi_chart']['7']) ? $panchang_data['rasi_chart']['7'] : ''; ?></div>
            <div class="rasi-box">கன்னி<br><?php echo isset($panchang_data['rasi_chart']['6']) ? $panchang_data['rasi_chart']['6'] : ''; ?></div>
        </div>
    </div>
</div>
    </div>
