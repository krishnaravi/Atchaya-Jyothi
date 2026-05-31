<?php
/**
 * Atchaya's Astrology Online Theme
 *
 * @package Atchayas_Astrology
 */

defined( 'ABSPATH' ) || exit;

define( 'ATCHAYA_THEME_VERSION', '1.0.0' );
define( 'ATCHAYA_THEME_DIR', get_template_directory() );
define( 'ATCHAYA_THEME_URI', get_template_directory_uri() );

require_once ATCHAYA_THEME_DIR . '/inc/theme-setup.php';
require_once ATCHAYA_THEME_DIR . '/inc/bilingual.php';
require_once ATCHAYA_THEME_DIR . '/inc/tutor-lms.php';
require_once ATCHAYA_THEME_DIR . '/inc/woocommerce.php';
require_once ATCHAYA_THEME_DIR . '/inc/customizer.php';

/**
 * Enqueue scripts and styles.
 */
function atchaya_enqueue_assets() {
	wp_enqueue_style(
		'atchaya-google-fonts',
		'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Noto+Sans+Tamil:wght@400;500;600;700&family=Source+Sans+3:wght@400;500;600;700&display=swap',
		array(),
		null
	);

	wp_enqueue_style(
		'atchaya-main',
		ATCHAYA_THEME_URI . '/assets/css/main.css',
		array( 'atchaya-google-fonts' ),
		ATCHAYA_THEME_VERSION
	);

	if ( atchaya_is_tutor_active() ) {
		wp_enqueue_style(
			'atchaya-tutor',
			ATCHAYA_THEME_URI . '/assets/css/tutor-lms.css',
			array( 'atchaya-main' ),
			ATCHAYA_THEME_VERSION
		);
	}

	if ( class_exists( 'WooCommerce' ) ) {
		wp_enqueue_style(
			'atchaya-woocommerce',
			ATCHAYA_THEME_URI . '/assets/css/woocommerce.css',
			array( 'atchaya-main' ),
			ATCHAYA_THEME_VERSION
		);
	}

	wp_enqueue_script(
		'atchaya-main',
		ATCHAYA_THEME_URI . '/assets/js/main.js',
		array(),
		ATCHAYA_THEME_VERSION,
		true
	);

	wp_localize_script( 'atchaya-main', 'atchayaTheme', array(
		'lang'    => atchaya_get_lang(),
		'ajaxUrl' => admin_url( 'admin-ajax.php' ),
	) );
}
add_action( 'wp_enqueue_scripts', 'atchaya_enqueue_assets' );

/**
 * Fallback primary menu when none assigned.
 */
function atchaya_fallback_menu() {
	$panchang_id = (int) atchaya_get_option( 'panchang_page_id' );
	$pakshi_id   = (int) atchaya_get_option( 'pakshi_page_id' );

	echo '<ul class="primary-menu fallback-menu">';
	echo '<li><a href="' . esc_url( home_url( '/' ) ) . '">' . esc_html( atchaya_str( 'home' ) ) . '</a></li>';
	echo '<li><a href="' . esc_url( home_url( '/about/' ) ) . '">' . esc_html( atchaya_str( 'about' ) ) . '</a></li>';
	echo '<li><a href="' . esc_url( atchaya_courses_url() ) . '">' . esc_html( atchaya_str( 'courses' ) ) . '</a></li>';
	echo '<li><a href="' . esc_url( get_post_type_archive_link( 'post' ) ?: home_url( '/blog/' ) ) . '">' . esc_html( atchaya_str( 'blog' ) ) . '</a></li>';
	if ( $panchang_id ) {
		echo '<li><a href="' . esc_url( get_permalink( $panchang_id ) ) . '">' . esc_html( atchaya_str( 'panchang' ) ) . '</a></li>';
	}
	if ( $pakshi_id ) {
		echo '<li><a href="' . esc_url( get_permalink( $pakshi_id ) ) . '">' . esc_html( atchaya_str( 'pancha_pakshi' ) ) . '</a></li>';
	}
	echo '<li><a href="' . esc_url( home_url( '/contact/' ) ) . '">' . esc_html( atchaya_str( 'contact' ) ) . '</a></li>';
	echo '</ul>';
}

/**
 * Plugin page URL helpers.
 */
function atchaya_panchang_url() {
	$page_id = (int) atchaya_get_option( 'panchang_page_id' );
	return $page_id ? get_permalink( $page_id ) : home_url( '/panchang/' );
}

function atchaya_pakshi_url() {
	$page_id = (int) atchaya_get_option( 'pakshi_page_id' );
	return $page_id ? get_permalink( $page_id ) : home_url( '/pancha-pakshi/' );
}

/**
 * Add theme meta for mobile.
 */
function atchaya_meta_viewport() {
	echo '<meta name="theme-color" content="#0a3d62">' . "\n";
}
add_action( 'wp_head', 'atchaya_meta_viewport', 1 );

/**
 * Page builder compatibility: do not strip shortcodes in content.
 */
add_filter( 'the_content', 'do_shortcode', 11 );
