<?php
/**
 * WooCommerce + Razorpay payment gateway notes.
 *
 * @package Atchayas_Astrology
 */

defined( 'ABSPATH' ) || exit;

/**
 * Add admin notice when WooCommerce is active but no payment gateway configured.
 */
function atchaya_payment_gateway_admin_notice() {
	if ( ! current_user_can( 'manage_options' ) || ! class_exists( 'WooCommerce' ) ) {
		return;
	}

	$gateways = WC()->payment_gateways()->payment_gateways();
	$enabled  = false;
	foreach ( $gateways as $gateway ) {
		if ( 'yes' === $gateway->enabled ) {
			$enabled = true;
			break;
		}
	}

	if ( $enabled ) {
		return;
	}

	echo '<div class="notice notice-info"><p>';
	echo esc_html__( 'Atchaya Theme: Enable Razorpay (or similar) in WooCommerce → Settings → Payments for UPI, Credit/Debit cards, and Netbanking.', 'atchayas-astrology' );
	echo ' <a href="' . esc_url( admin_url( 'admin.php?page=wc-settings&tab=checkout' ) ) . '">';
	echo esc_html__( 'Configure payments', 'atchayas-astrology' );
	echo '</a></p></div>';
}
add_action( 'admin_notices', 'atchaya_payment_gateway_admin_notice' );

/**
 * Payment methods label for checkout (bilingual footer note).
 *
 * @return string
 */
function atchaya_payment_methods_label() {
	return atchaya_t(
		'We accept UPI, Credit/Debit cards, and Netbanking.',
		'UPI, கிரெடிட்/டெபிட் கார்டு மற்றும் நெட்பேங்கிங் மூலம் பணம் செலுத்தலாம்.'
	);
}

/**
 * Show payment methods on WooCommerce cart/checkout.
 */
function atchaya_checkout_payment_note() {
	if ( ! class_exists( 'WooCommerce' ) ) {
		return;
	}
	if ( ! is_cart() && ! is_checkout() ) {
		return;
	}
	echo '<p class="atchaya-payment-note">' . esc_html( atchaya_payment_methods_label() ) . '</p>';
}
add_action( 'woocommerce_after_cart_totals', 'atchaya_checkout_payment_note' );
add_action( 'woocommerce_checkout_before_customer_details', 'atchaya_checkout_payment_note' );
