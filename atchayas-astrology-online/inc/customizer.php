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
		'default'           => 'Krishna',
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'atchaya_guru_name', array(
		'label'   => __( 'Guru Name', 'atchayas-astrology' ),
		'section' => 'atchaya_academy',
		'type'    => 'text',
	) );

	$wp_customize->add_setting( 'atchaya_guru_bio_en', array(
		'default'           => '',
		'sanitize_callback' => 'wp_kses_post',
	) );
	$wp_customize->add_control( 'atchaya_guru_bio_en', array(
		'label'   => __( 'Guru Bio (English)', 'atchayas-astrology' ),
		'section' => 'atchaya_academy',
		'type'    => 'textarea',
	) );

	$wp_customize->add_setting( 'atchaya_guru_bio_ta', array(
		'default'           => '',
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
