<?php
/**
 * Bilingual (Tamil / English) string helper.
 *
 * @package Atchayas_Astrology
 */

defined( 'ABSPATH' ) || exit;

/**
 * Get current UI language code.
 *
 * @return string 'en' or 'ta'.
 */
function atchaya_get_lang() {
	if ( isset( $_COOKIE['atchaya_lang'] ) && in_array( $_COOKIE['atchaya_lang'], array( 'en', 'ta' ), true ) ) {
		return sanitize_key( wp_unslash( $_COOKIE['atchaya_lang'] ) );
	}

	$locale = determine_locale();
	if ( 0 === strpos( $locale, 'ta' ) ) {
		return 'ta';
	}

	return 'en';
}

/**
 * Translate theme string based on active language.
 *
 * @param string $en English text.
 * @param string $ta Tamil text.
 * @return string
 */
function atchaya_t( $en, $ta ) {
	return ( 'ta' === atchaya_get_lang() ) ? $ta : $en;
}

/**
 * Theme string dictionary.
 *
 * @return array<string, array{en: string, ta: string}>
 */
function atchaya_strings() {
	return array(
		'tagline'           => array(
			'en' => 'Unlocking Cosmic Wisdom, Empowering Your Journey.',
			'ta' => 'பிரபஞ்ச ஞானம் அறிவோம், வாழ்வை வளமாக்குவோம்.',
		),
		'home'              => array(
			'en' => 'Home',
			'ta' => 'முகப்பு',
		),
		'about'             => array(
			'en' => 'About',
			'ta' => 'எங்களை பற்றி',
		),
		'courses'           => array(
			'en' => 'Courses',
			'ta' => 'பாடநெறிகள்',
		),
		'blog'              => array(
			'en' => 'Blog',
			'ta' => 'வலைப்பதிவு',
		),
		'panchang'          => array(
			'en' => 'Panchang',
			'ta' => 'பஞ்சாங்கம்',
		),
		'pancha_pakshi'     => array(
			'en' => 'Pancha Pakshi',
			'ta' => 'பஞ்ச பட்சி',
		),
		'contact'           => array(
			'en' => 'Contact',
			'ta' => 'தொடர்பு',
		),
		'login'             => array(
			'en' => 'Login',
			'ta' => 'உள்நுழை',
		),
		'dashboard'         => array(
			'en' => 'Dashboard',
			'ta' => 'டாஷ்போர்டு',
		),
		'register'          => array(
			'en' => 'Register',
			'ta' => 'பதிவு',
		),
		'explore_courses'   => array(
			'en' => 'Explore Courses',
			'ta' => 'பாடநெறிகளை ஆராயுங்கள்',
		),
		'learn_more'        => array(
			'en' => 'Learn More',
			'ta' => 'மேலும் அறிய',
		),
		'view_all_courses'  => array(
			'en' => 'View All Courses',
			'ta' => 'அனைத்து பாடநெறிகள்',
		),
		'daily_panchang'    => array(
			'en' => 'Today\'s Panchang',
			'ta' => 'இன்றைய பஞ்சாங்கம்',
		),
		'featured_courses'  => array(
			'en' => 'Featured Courses',
			'ta' => 'சிறப்பு பாடநெறிகள்',
		),
		'about_academy'     => array(
			'en' => 'About the Academy',
			'ta' => 'அகாடமி பற்றி',
		),
		'meet_guru'         => array(
			'en' => 'Meet Your Guru',
			'ta' => 'உங்கள் குருவை சந்தியுங்கள்',
		),
		'student_stories'   => array(
			'en' => 'What Students Say',
			'ta' => 'மாணவர்களின் கருத்துகள்',
		),
		'get_started'       => array(
			'en' => 'Get Started',
			'ta' => 'தொடங்குங்கள்',
		),
		'free'              => array(
			'en' => 'Free',
			'ta' => 'இலவசம்',
		),
		'enroll_now'        => array(
			'en' => 'Enroll Now',
			'ta' => 'இப்போது சேருங்கள்',
		),
		'privacy_policy'    => array(
			'en' => 'Privacy Policy',
			'ta' => 'தனியுரிமைக் கொள்கை',
		),
		'terms'             => array(
			'en' => 'Terms & Conditions',
			'ta' => 'விதிமுறைகள்',
		),
		'no_refund'         => array(
			'en' => 'No Refund Policy',
			'ta' => 'பணம் திரும்பக் கொள்கை இல்லை',
		),
		'footer_desc'       => array(
			'en' => 'Premier bilingual academy dedicated to demystifying Vedic astrology through structured online courses in Tamil and English.',
			'ta' => 'வேத ஜோதிடத்தை தமிழ் மற்றும் ஆங்கிலத்தில் கற்பிக்கும் முன்னணி இருமொழி ஆன்லைன் அகாடமி.',
		),
		'quick_links'       => array(
			'en' => 'Quick Links',
			'ta' => 'விரைவு இணைப்புகள்',
		),
		'contact_us'        => array(
			'en' => 'Contact Us',
			'ta' => 'எங்களை தொடர்பு கொள்ளுங்கள்',
		),
		'all_rights'        => array(
			'en' => 'All rights reserved.',
			'ta' => 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
		),
		'search'            => array(
			'en' => 'Search',
			'ta' => 'தேடு',
		),
		'read_more'         => array(
			'en' => 'Read More',
			'ta' => 'மேலும் படிக்க',
		),
		'latest_articles'   => array(
			'en' => 'Latest Articles',
			'ta' => 'சமீபத்திய கட்டுரைகள்',
		),
		'course_categories' => array(
			'en' => 'Course Categories',
			'ta' => 'பாடப்பிரிவுகள்',
		),
	);
}

/**
 * Get a named theme string.
 *
 * @param string $key Dictionary key.
 * @return string
 */
function atchaya_str( $key ) {
	$strings = atchaya_strings();
	if ( ! isset( $strings[ $key ] ) ) {
		return $key;
	}
	return atchaya_t( $strings[ $key ]['en'], $strings[ $key ]['ta'] );
}

/**
 * Course category labels (bilingual).
 *
 * @return array<string, array{en: string, ta: string}>
 */
function atchaya_course_categories() {
	return array(
		'basics'        => array( 'en' => 'Astrology – Basics', 'ta' => 'ஜோதிடம் – அடிப்படை' ),
		'intermediate'  => array( 'en' => 'Intermediate', 'ta' => 'இடைநிலை' ),
		'higher'        => array( 'en' => 'Higher', 'ta' => 'மேம்பட்ட' ),
		'vargachakra'   => array( 'en' => 'Vargachakra', 'ta' => 'வர்க்கசக்கரம்' ),
		'astavarga'     => array( 'en' => 'Ashtakavarga', 'ta' => 'அஷ்டகவர்க்கம்' ),
		'prasanna'      => array( 'en' => 'Prasanna', 'ta' => 'பிரசன்னம்' ),
		'panjapakshi'   => array( 'en' => 'Pancha Pakshi', 'ta' => 'பஞ்ச பட்சி' ),
		'seventh_bava'  => array( 'en' => '7th Bava', 'ta' => '7வது பாவம்' ),
	);
}

/**
 * Enqueue language switcher script.
 */
function atchaya_lang_switcher_assets() {
	wp_enqueue_script(
		'atchaya-lang-switcher',
		get_template_directory_uri() . '/assets/js/lang-switcher.js',
		array(),
		ATCHAYA_THEME_VERSION,
		true
	);
}
add_action( 'wp_enqueue_scripts', 'atchaya_lang_switcher_assets' );
