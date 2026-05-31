<?php
/**
 * Theme setup and supports.
 *
 * @package Atchayas_Astrology
 */

defined( 'ABSPATH' ) || exit;

/**
 * Register theme supports, menus, and image sizes.
 */
function atchaya_theme_setup() {
	load_theme_textdomain( 'atchayas-astrology', get_template_directory() . '/languages' );

	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
	add_theme_support( 'custom-logo', array(
		'height'      => 80,
		'width'       => 240,
		'flex-height' => true,
		'flex-width'  => true,
	) );
	add_theme_support( 'customize-selective-refresh-widgets' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'editor-styles' );
	add_editor_style( 'assets/css/editor.css' );

	register_nav_menus( array(
		'primary'   => __( 'Primary Menu', 'atchayas-astrology' ),
		'footer'    => __( 'Footer Menu', 'atchayas-astrology' ),
		'dashboard' => __( 'Dashboard Quick Links', 'atchayas-astrology' ),
	) );

	add_image_size( 'atchaya-course-card', 640, 400, true );
	add_image_size( 'atchaya-hero', 1920, 800, true );
	add_image_size( 'atchaya-guru', 600, 750, true );
}
add_action( 'after_setup_theme', 'atchaya_theme_setup' );

/**
 * Set content width.
 */
function atchaya_content_width() {
	$GLOBALS['content_width'] = 1200;
}
add_action( 'after_setup_theme', 'atchaya_content_width', 0 );

/**
 * Register widget areas.
 */
function atchaya_widgets_init() {
	register_sidebar( array(
		'name'          => __( 'Homepage Panchang', 'atchayas-astrology' ),
		'id'            => 'homepage-panchang',
		'description'   => __( 'Daily Panchang widget area on homepage.', 'atchayas-astrology' ),
		'before_widget' => '<div id="%1$s" class="widget panchang-widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h3 class="widget-title">',
		'after_title'   => '</h3>',
	) );

	register_sidebar( array(
		'name'          => __( 'Footer Column 1', 'atchayas-astrology' ),
		'id'            => 'footer-1',
		'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h4 class="footer-widget-title">',
		'after_title'   => '</h4>',
	) );

	register_sidebar( array(
		'name'          => __( 'Footer Column 2', 'atchayas-astrology' ),
		'id'            => 'footer-2',
		'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h4 class="footer-widget-title">',
		'after_title'   => '</h4>',
	) );

	register_sidebar( array(
		'name'          => __( 'Blog Sidebar', 'atchayas-astrology' ),
		'id'            => 'blog-sidebar',
		'before_widget' => '<div id="%1$s" class="sidebar-widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h3 class="sidebar-widget-title">',
		'after_title'   => '</h3>',
	) );
}
add_action( 'widgets_init', 'atchaya_widgets_init' );
