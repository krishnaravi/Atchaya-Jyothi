<?php
/**
 * Theme Customizer settings.
 *
 * @package Atchayas_Astrology
 */

defined( 'ABSPATH' ) || exit;

/**
 * Register customizer settings.
 *
 * @param WP_Customize_Manager $wp_customize Customizer instance.
 */
function atchaya_customize_register( $wp_customize ) {
	$wp_customize->add_section( 'atchaya_academy', array(
		'title'    => __( 'Academy Settings', 'atchayas-astrology' ),
		'priority' => 30,
	) );

	$wp_customize->add_setting( 'atchaya_guru_name', array(
		'default'           => 'Astrologer Ravichandran',
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'atchaya_guru_name', array(
		'label'   => __( 'Guru Name (English)', 'atchayas-astrology' ),
		'section' => 'atchaya_academy',
		'type'    => 'text',
	) );

	$wp_customize->add_setting( 'atchaya_guru_name_ta', array(
		'default'           => 'ஜோதிடர் ரவிச்சந்திரன்',
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'atchaya_guru_name_ta', array(
		'label'   => __( 'Guru Name (Tamil)', 'atchayas-astrology' ),
		'section' => 'atchaya_academy',
		'type'    => 'text',
	) );

	$wp_customize->add_setting( 'atchaya_guru_title', array(
		'default'           => 'Founder & Lead Instructor',
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'atchaya_guru_title', array(
		'label'   => __( 'Guru Title (English)', 'atchayas-astrology' ),
		'section' => 'atchaya_academy',
		'type'    => 'text',
	) );

	$wp_customize->add_setting( 'atchaya_guru_title_ta', array(
		'default'           => 'நிறுவனர் & முதன்மைப் பயிற்றுவிப்பாளர்',
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'atchaya_guru_title_ta', array(
		'label'   => __( 'Guru Title (Tamil)', 'atchayas-astrology' ),
		'section' => 'atchaya_academy',
		'type'    => 'text',
	) );

	$wp_customize->add_setting( 'atchaya_guru_bio_en', array(
		'default'           => 'Founder of Atchaya\'s Astrology Online with years of deep Jyotish research and precise predictions. He teaches timeless Vedic methods in clear Tamil and English.',
		'sanitize_callback' => 'wp_kses_post',
	) );
	$wp_customize->add_control( 'atchaya_guru_bio_en', array(
		'label'   => __( 'Guru Bio (English)', 'atchayas-astrology' ),
		'section' => 'atchaya_academy',
		'type'    => 'textarea',
	) );

	$wp_customize->add_setting( 'atchaya_guru_bio_ta', array(
		'default'           => 'பல ஆண்டுகால ஆழ்ந்த ஜோதிட ஆராய்ச்சி மற்றும் துல்லியமான கணிப்புகளில் அனுபவம் பெற்ற நிறுவனர். தொன்மையான வேத ஜோதிட முறைகளை எளிய தமிழ் மற்றும் ஆங்கிலத்தில் கற்பிப்பதில் வல்லவர்.',
		'sanitize_callback' => 'wp_kses_post',
	) );
	$wp_customize->add_control( 'atchaya_guru_bio_ta', array(
		'label'   => __( 'Guru Bio (Tamil)', 'atchayas-astrology' ),
		'section' => 'atchaya_academy',
		'type'    => 'textarea',
	) );

	$wp_customize->add_setting( 'atchaya_guru_photo', array(
		'default'           => '',
		'sanitize_callback' => 'esc_url_raw',
	) );
	$wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'atchaya_guru_photo', array(
		'label'   => __( 'Guru Photo', 'atchayas-astrology' ),
		'section' => 'atchaya_academy',
	) ) );

	$wp_customize->add_setting( 'atchaya_contact_email', array(
		'default'           => 'support@atchayakrishna.com',
		'sanitize_callback' => 'sanitize_email',
	) );
	$wp_customize->add_control( 'atchaya_contact_email', array(
		'label'   => __( 'Contact Email', 'atchayas-astrology' ),
		'section' => 'atchaya_academy',
		'type'    => 'email',
	) );

	$wp_customize->add_setting( 'atchaya_contact_phone', array(
		'default'           => '',
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'atchaya_contact_phone', array(
		'label'   => __( 'Contact Phone', 'atchayas-astrology' ),
		'section' => 'atchaya_academy',
		'type'    => 'text',
	) );

	$wp_customize->add_setting( 'atchaya_whatsapp', array(
		'default'           => '',
		'sanitize_callback' => 'esc_url_raw',
	) );
	$wp_customize->add_control( 'atchaya_whatsapp', array(
		'label'   => __( 'WhatsApp Group Link', 'atchayas-astrology' ),
		'section' => 'atchaya_academy',
		'type'    => 'url',
	) );

	$wp_customize->add_setting( 'atchaya_panchang_page_id', array(
		'default'           => 0,
		'sanitize_callback' => 'absint',
	) );
	$wp_customize->add_control( 'atchaya_panchang_page_id', array(
		'label'   => __( 'Panchang Page', 'atchayas-astrology' ),
		'section' => 'atchaya_academy',
		'type'    => 'dropdown-pages',
	) );

	$wp_customize->add_setting( 'atchaya_pakshi_page_id', array(
		'default'           => 0,
		'sanitize_callback' => 'absint',
	) );
	$wp_customize->add_control( 'atchaya_pakshi_page_id', array(
		'label'   => __( 'Pancha Pakshi Page', 'atchayas-astrology' ),
		'section' => 'atchaya_academy',
		'type'    => 'dropdown-pages',
	) );
}
add_action( 'customize_register', 'atchaya_customize_register' );

/**
 * Get customizer option with fallback.
 *
 * @param string $key     Setting key (without prefix).
 * @param mixed  $default Default value.
 * @return mixed
 */
function atchaya_get_option( $key, $default = '' ) {
	return get_theme_mod( 'atchaya_' . $key, $default );
}
