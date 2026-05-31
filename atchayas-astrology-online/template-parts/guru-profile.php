<?php
/**
 * Guru profile card.
 *
 * @package Atchayas_Astrology
 */

$guru_name  = atchaya_guru_name();
$guru_title = atchaya_guru_title();
$guru_photo = atchaya_get_option( 'guru_photo' );
$bio        = atchaya_guru_bio_short();
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
		<p class="guru-label"><?php echo esc_html( $guru_title ); ?></p>
		<h3><?php echo esc_html( $guru_name ); ?></h3>
		<blockquote class="guru-quote guru-quote-sm">
			<p>&ldquo;<?php echo esc_html( atchaya_guru_short_quote() ); ?>&rdquo;</p>
		</blockquote>
		<p><?php echo wp_kses_post( wpautop( $bio ) ); ?></p>
		<a href="<?php echo esc_url( home_url( '/about/' ) ); ?>" class="guru-more-link">
			<?php echo esc_html( atchaya_str( 'learn_more' ) ); ?> &rarr;
		</a>
	</div>
</aside>
