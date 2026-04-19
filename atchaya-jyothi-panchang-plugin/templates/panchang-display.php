<?php
/**
 * Template for displaying the Panchang.
 */

if (!defined('ABSPATH')) {
    exit;
}

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
            <label>ஊர் பெயரை உள்ளிடவும் (Search Place):</label>
            <input type="text" id="cityInput" placeholder="Ex: Vellore" autocomplete="off">
            <div id="results" style="border: 1px solid #ccc; display: none; position: absolute; background: #fff; z-index: 100; width: 100%; max-height: 200px; overflow-y: auto;"></div>

            <div style="margin-top: 10px; font-size: 0.9em; color: #666;">
                <span>Lat: <b id="latVal">-</b></span> | 
                <span>Long: <b id="lonVal">-</b></span>
            </div>
        </div>
    </div>

    <div class="section-grid">
        <div class="section">
            <label for="date-picker">தேதி (Date):</label>
            <input type="date" id="date-picker" class="date-picker" value="<?php echo esc_attr($panchang_data["date"]); ?>">
        </div>

        <div class="section">
            <label for="lang-selector">மொழி (Language):</label>
            <select id="lang-selector" class="lang-selector">
                <option value="ta" <?php selected($panchang_data["lang"], "ta"); ?>>தமிழ்</option>
                <option value="en" <?php selected($panchang_data["lang"], "en"); ?>>English</option>
                <option value="te" <?php selected($panchang_data["lang"], "te"); ?>>తెలుగు</option>
                <option value="ka" <?php selected($panchang_data["lang"], "ka"); ?>>ಕನ್ನಡ</option>
                <option value="hi" <?php selected($panchang_data["lang"], "hi"); ?>>हिन्दी</option>
                <option value="ml" <?php selected($panchang_data["lang"], "ml"); ?>>മലയാളം</option>
            </select>
        </div>
    </div>

    <div class="atchaya-panchang-dynamic-content">
        <div class="blue-banner">இன்றைய பஞ்சாங்கம் (Daily Panchang)</div>

        <div class="panchang-grid">
            <div class="info-card">
                <h3>திதி (Tithi)</h3>
                <p class="main-val"><?php echo esc_html($panchang_data['tithi']['name']); ?></p>
            </div>

            <div class="info-card">
                <h3>நட்சத்திரம் (Nakshatra)</h3>
                <p class="main-val"><?php echo esc_html($panchang_data['nakshatra']['name']); ?> - <?php echo esc_html($panchang_data['nakshatra']['pada']); ?> பாதம்</p>
            </div>

            <div class="info-card">
                <h3>யோகம் (Yoga)</h3>
                <p class="main-val"><?php echo esc_html($panchang_data['yoga']['name']); ?></p>
            </div>

            <div class="info-card">
                <h3>கரணம் (Karana)</h3>
                <p class="main-val"><?php echo esc_html($panchang_data['karana']['name']); ?></p>
            </div>
        </div>

        <div class="section">
            <div class="blue-banner" style="margin-bottom: 20px;">முக்கிய நேரங்கள் (Auspicious & Inauspicious Times)</div>
            <table class="panchang-table">
                <tr><th>விவரம்</th><th>நேரம்</th></tr>
                <tr><td>சூரிய உதயம் (Sunrise)</td><td><?php echo esc_html($panchang_data['sunrise']); ?></td></tr>
                <tr><td>சூரிய அஸ்தமனம் (Sunset)</td><td><?php echo esc_html($panchang_data['sunset']); ?></td></tr>
                <tr><td>ராகு காலம் (Rahu Kalam)</td><td><?php echo esc_html($panchang_data['rahu_kalam']); ?></td></tr>
                <tr><td>குளிகை காலம் (Gulika Kalam)</td><td><?php echo esc_html($panchang_data['gulika_kalam']); ?></td></tr>
                <tr><td>எமகண்டம் (Yamagandam)</td><td><?php echo esc_html($panchang_data['yamagandam']); ?></td></tr>
            </table>
        </div>

        <div class="rasi-section">
            <div class="rasi-container">
                <div class="blue-banner" style="margin-bottom: 20px;">ராசி கட்டம் (Rasi Chart)</div>
                <div class="rasi-grid">
                    <div class="rasi-box"><span>12</span><div class="planets"><?php echo $panchang_data['rasi_chart']['12']; ?></div></div>
                    <div class="rasi-box"><span>1</span><div class="planets"><?php echo $panchang_data['rasi_chart']['1']; ?></div></div>
                    <div class="rasi-box"><span>2</span><div class="planets"><?php echo $panchang_data['rasi_chart']['2']; ?></div></div>
                    <div class="rasi-box"><span>3</span><div class="planets"><?php echo $panchang_data['rasi_chart']['3']; ?></div></div>
                    <div class="rasi-box"><span>11</span><div class="planets"><?php echo $panchang_data['rasi_chart']['11']; ?></div></div>
                    <div class="rasi-center">ராசி<br>CHART</div>
                    <div class="rasi-box"><span>4</span><div class="planets"><?php echo $panchang_data['rasi_chart']['4']; ?></div></div>
                    <div class="rasi-box"><span>10</span><div class="planets"><?php echo $panchang_data['rasi_chart']['10']; ?></div></div>
                    <div class="rasi-box"><span>5</span><div class="planets"><?php echo $panchang_data['rasi_chart']['5']; ?></div></div>
                    <div class="rasi-box"><span>9</span><div class="planets"><?php echo $panchang_data['rasi_chart']['9']; ?></div></div>
                    <div class="rasi-box"><span>8</span><div class="planets"><?php echo $panchang_data['rasi_chart']['8']; ?></div></div>
                    <div class="rasi-box"><span>7</span><div class="planets"><?php echo $panchang_data['rasi_chart']['7']; ?></div></div>
                    <div class="rasi-box"><span>6</span><div class="planets"><?php echo $panchang_data['rasi_chart']['6']; ?></div></div>
                </div>
            </div>

            <div class="planet-details-container">
                <div class="blue-banner" style="margin-bottom: 20px;">கிரக நிலைகள் (Planetary Positions)</div>
                <table class="panchang-table">
                    <tr>
                        <th>கிரகம்</th>
                        <th>ராசி</th>
                        <th>பாகை</th>
                        <th>நட்சத்திரம்</th>
                    </tr>
                    <?php foreach ($panchang_data['planets'] as $p): ?>
                    <tr>
                        <td><?php echo esc_html($p['planet_name']); ?></td>
                        <td><?php echo esc_html($p['rasi_name']); ?></td>
                        <td><?php echo number_format($p['degree'], 2); ?>°</td>
                        <td><?php echo esc_html($p['nakshatra_name']); ?> (<?php echo $p['pada']; ?>)</td>
                    </tr>
                    <?php endforeach; ?>
                </table>
            </div>
        </div>
    </div>
</div>
