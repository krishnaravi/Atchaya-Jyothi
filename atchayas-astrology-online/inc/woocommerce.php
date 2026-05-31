<?php
/**
 * WooCommerce integration for course payments.
 *
 * @package Atchayas_Astrology
 */

defined( 'ABSPATH' ) || exit;

/**
 * Declare WooCommerce support.
 */
function atchaya_woocommerce_setup() {
	add_theme_support( 'woocommerce' );
	add_theme_support( 'wc-product-gallery-zoom' );
	add_theme_support( 'wc-product-gallery-lightbox' );
	add_theme_support( 'wc-product-gallery-slider' );
}
add_action( 'after_setup_theme', 'atchaya_woocommerce_setup' );

/**
 * WooCommerce wrapper start.
 */
function atchaya_woocommerce_wrapper_start() {
	echo '<div class="atchaya-woocommerce-wrap container">';
}
add_action( 'woocommerce_before_main_content', 'atchaya_woocommerce_wrapper_start', 5 );

/**
 * WooCommerce wrapper end.
 */
function atchaya_woocommerce_wrapper_end() {
	echo '</div>';
}
add_action( 'woocommerce_after_main_content', 'atchaya_woocommerce_wrapper_end', 50 );

/**
 * Remove default WooCommerce wrappers (we use our own).
 */
remove_action( 'woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10 );
remove_action( 'woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10 );
