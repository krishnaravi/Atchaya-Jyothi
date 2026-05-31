<?php
/**
 * Tutor LMS integration.
 *
 * @package Atchayas_Astrology
 */

defined( 'ABSPATH' ) || exit;

/**
 * Check if Tutor LMS is active.
 *
 * @return bool
 */
function atchaya_is_tutor_active() {
	return defined( 'TUTOR_VERSION' ) || function_exists( 'tutor' );
}

/**
 * Get Tutor dashboard URL.
 *
 * @return string
 */
function atchaya_dashboard_url() {
	if ( atchaya_is_tutor_active() && function_exists( 'tutor_utils' ) ) {
		return tutor_utils()->get_tutor_dashboard_page_permalink();
	}
	return home_url( '/dashboard/' );
}

/**
 * Get courses archive URL.
 *
 * @return string
 */
function atchaya_courses_url() {
	if ( atchaya_is_tutor_active() && function_exists( 'tutor_utils' ) ) {
		return tutor_utils()->course_archive_page();
	}
	return home_url( '/courses/' );
}

/**
 * Get featured Tutor courses.
 *
 * @param int $limit Number of courses.
 * @return WP_Post[]
 */
function atchaya_get_featured_courses( $limit = 6 ) {
	if ( ! atchaya_is_tutor_active() ) {
		return array();
	}

	$args = array(
		'post_type'      => tutor()->course_post_type,
		'posts_per_page' => $limit,
		'post_status'    => 'publish',
		'meta_query'     => array(
			array(
				'key'     => '_tutor_is_public_course',
				'value'   => 'yes',
				'compare' => '=',
			),
		),
	);

	$query = new WP_Query( $args );

	if ( ! $query->have_posts() ) {
		$args = array(
			'post_type'      => tutor()->course_post_type,
			'posts_per_page' => $limit,
			'post_status'    => 'publish',
		);
		$query = new WP_Query( $args );
	}

	return $query->posts;
}

/**
 * Render course price badge.
 *
 * @param int $course_id Course post ID.
 */
function atchaya_course_price_html( $course_id ) {
	if ( ! atchaya_is_tutor_active() || ! function_exists( 'tutor_utils' ) ) {
		echo '<span class="course-price free">' . esc_html( atchaya_str( 'free' ) ) . '</span>';
		return;
	}

	$price = tutor_utils()->get_course_price( $course_id );
	if ( empty( $price ) ) {
		echo '<span class="course-price free">' . esc_html( atchaya_str( 'free' ) ) . '</span>';
		return;
	}

	echo '<span class="course-price paid">' . wp_kses_post( $price ) . '</span>';
}

/**
 * Remove Tutor default styles on frontend if needed (keep functionality).
 */
function atchaya_tutor_setup() {
	if ( ! atchaya_is_tutor_active() ) {
		return;
	}

	add_filter( 'tutor_load_template_part_from_custom_location', '__return_true' );
}
add_action( 'after_setup_theme', 'atchaya_tutor_setup' );

/**
 * Add body class when on Tutor pages.
 *
 * @param string[] $classes Body classes.
 * @return string[]
 */
function atchaya_tutor_body_class( $classes ) {
	if ( atchaya_is_tutor_active() && function_exists( 'tutor_utils' ) ) {
		if ( is_singular( tutor()->course_post_type ) ) {
			$classes[] = 'atchaya-tutor-course';
		}
		if ( tutor_utils()->is_tutor_frontend_dashboard() ) {
			$classes[] = 'atchaya-tutor-dashboard';
		}
	}
	return $classes;
}
add_filter( 'body_class', 'atchaya_tutor_body_class' );

/**
 * Customize Tutor dashboard nav labels (bilingual).
 *
 * @param array $nav_items Dashboard nav items.
 * @return array
 */
function atchaya_tutor_dashboard_nav( $nav_items ) {
	if ( 'ta' !== atchaya_get_lang() ) {
		return $nav_items;
	}

	$translations = array(
		'Dashboard'          => 'டாஷ்போர்டு',
		'My Courses'         => 'என் பாடநெறிகள்',
		'Enrolled Courses'   => 'சேர்ந்த பாடநெறிகள்',
		'Wishlist'           => 'விருப்பப்பட்டியல்',
		'Reviews'            => 'மதிப்புரைகள்',
		'My Quiz Attempts'   => 'வினாடி வினா முயற்சிகள்',
		'Order History'      => 'ஆர்டர் வரலாறு',
		'Question & Answer'  => 'கேள்வி & பதில்',
		'Settings'           => 'அமைப்புகள்',
		'Logout'             => 'வெளியேறு',
	);

	foreach ( $nav_items as $key => &$item ) {
		if ( isset( $item['title'] ) && isset( $translations[ $item['title'] ] ) ) {
			$item['title'] = $translations[ $item['title'] ];
		}
	}

	return $nav_items;
}
add_filter( 'tutor_dashboard/nav_items', 'atchaya_tutor_dashboard_nav' );
