<?php
/**
 * Plugin Name:       AtchayaJyothi - அட்சயஜோதி தின பஞ்சாங்கம்
 * Plugin URI:        https://krishnalaya.cloud
 * Description:       Full Dynamic Tamil Panchangam with Swiss Ephemeris / Prokerala API support. Includes Tithi, Nakshatra, Yoga, Karana, Gowri, Rahu Kalam, Pancha Pakshi, South Indian Rasi Chart & more. Perfect for Krishnalaya.Cloud.
 * Version:           1.0.0
 * Author:            Krishnalaya.Cloud (with Grok)
 * Author URI:        https://krishnalaya.cloud
 * License:           GPL-2.0+
 * Text Domain:       atchaya-jyothi-panchang
 * Domain Path:       /languages
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

define('ATCHAYA_VERSION', '1.0.0');
define('ATCHAYA_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('ATCHAYA_PLUGIN_URL', plugin_dir_url(__FILE__));

class Atchaya_Jyothi_Panchang {

    public function __construct() {
        load_plugin_textdomain(
            'atchaya-jyothi-panchang',
            false,
            dirname(plugin_basename(__FILE__)) . '/languages'
        );
        add_action('wp_enqueue_scripts', [$this, 'enqueue_assets']);
        add_shortcode('atchaya_panchang', [$this, 'render_panchang']);
        add_action('wp_ajax_atchaya_get_panchang', [$this, 'get_panchang_ajax']);
        add_action('wp_ajax_nopriv_atchaya_get_panchang', [$this, 'get_panchang_ajax']);
    }

    public function enqueue_assets() {
        wp_enqueue_style('atchaya-style', ATCHAYA_PLUGIN_URL . 'assets/css/style.css', [], ATCHAYA_VERSION);
        wp_enqueue_script('atchaya-script', ATCHAYA_PLUGIN_URL . 'assets/js/script.js', ['jquery'], ATCHAYA_VERSION, true);
        
        // Pass data to JS
        wp_localize_script('atchaya-script', 'atchayaAjax', [
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce'   => wp_create_nonce('atchaya_nonce'),
            'currentLang' => get_locale() // Pass current locale to JS
        ]);
    }

    public function render_panchang($atts) {
        $atts = shortcode_atts([
            'place'     => 'Vellore',
            'date'      => date('Y-m-d'),
            'lang'      => get_locale(), // Default to WordPress locale
            'style'     => 'south',           // south / north / east
            'show_gowri' => 'yes',
            'show_panchapakshi' => 'yes'
        ], $atts);

        // Include the calculator class
        require_once ATCHAYA_PLUGIN_DIR . 'includes/class-panchang-calculator.php';
        $calculator = new Atchaya_Panchang_Calculator();
        $panchang_data = $calculator->get_panchang_data($atts['date'], $atts['place'], $atts['lang']);

        ob_start();
        include ATCHAYA_PLUGIN_DIR . 'templates/panchang-display.php';
        return ob_get_clean();
    }

    public function get_panchang_ajax() {
        check_ajax_referer(\'atchaya_nonce\', \'nonce\');

        $date = sanitize_text_field($_POST['date'] ?? date('Y-m-d'));
        $place = sanitize_text_field($_POST['place'] ?? 'Vellore');

        require_once ATCHAYA_PLUGIN_DIR . 'includes/class-panchang-calculator.php';
        $calculator = new Atchaya_Panchang_Calculator();
        $lang = sanitize_text_field($_POST['lang'] ?? get_locale());
        $panchang_data = $calculator->get_panchang_data($date, $place, $lang);

        ob_start();
        include ATCHAYA_PLUGIN_DIR . 'templates/panchang-display.php';
        $html = ob_get_clean();

        wp_send_json_success(['html' => $html]);
    }
}

// Initialize Plugin
new Atchaya_Jyothi_Panchang();
