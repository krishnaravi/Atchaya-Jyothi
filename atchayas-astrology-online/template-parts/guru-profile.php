<?php
/**
 * Guru profile card.
 *
 * @package Atchayas_Astrology
 */

$guru_name  = atchaya_get_option( 'guru_name', 'Krishna' );
$guru_photo = atchaya_get_option( 'guru_photo' );
$bio_en     = atchaya_get_option( 'guru_bio_en' );
$bio_ta     = atchaya_get_option( 'guru_bio_ta' );
$bio        = atchaya_t( $bio_en, $bio_ta );
?>
<aside class="guru-card">
	<div class="guru-photo-wrap">
		<?php if ( $guru_photo ) : ?>
			<img src="<?php echo esc_url( $guru_photo ); ?>" alt="<?php echo esc_attr( $guru_name ); ?>" class="guru-photo" loading="lazy">
		<?php else : ?>
			<div class="guru-photo-placeholder">
				<span aria-hidden="true">&#9788;</span>
			</div>
		<?php endif; ?>
	</div>
	<div class="guru-info">
		<p class="guru-label"><?php echo esc_html( atchaya_str( 'meet_guru' ) ); ?></p>
		<h3><?php echo esc_html( $guru_name ); ?></h3>
		<?php if ( $bio ) : ?>
			<p><?php echo wp_kses_post( wpautop( $bio ) ); ?></p>
		<?php else : ?>
			<p><?php echo esc_html( atchaya_t(
				'Experienced Vedic astrologer guiding students through authentic Jyotish traditions.',
				'அனுபவம் வாய்ந்த வேத ஜோதிடர் — பாரம்பரிய ஜோதிடத்தின் வழியாக மாணவர்களுக்கு வழிகாட்டுதல்.'
			) ); ?></p>
		<?php endif; ?>
	</div>
</aside>
