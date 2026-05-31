<?php
/**
 * Hero section.
 *
 * @package Atchayas_Astrology
 */
?>
<section class="hero-section">
	<div class="hero-bg" aria-hidden="true"></div>
	<div class="container hero-inner">
		<div class="hero-content">
			<p class="hero-eyebrow"><?php echo esc_html( atchaya_t( 'Vedic Astrology Academy', 'வேத ஜோதிட அகாடமி' ) ); ?></p>
			<h1 class="hero-title"><?php bloginfo( 'name' ); ?></h1>
			<p class="hero-tagline"><?php echo esc_html( atchaya_str( 'tagline' ) ); ?></p>
			<p class="hero-desc">
				<?php echo esc_html( atchaya_t(
					'Learn Jyotish in Tamil & English — from chart reading to Pancha Pakshi, Ashtakavarga, and Prasanna.',
					'ராசி கணிப்பு முதல் பஞ்ச பட்சி, அஷ்டகவர்க்கம், பிரசன்னம் வரை — தமிழிலும் ஆங்கிலத்திலும் ஜோதிடம் கற்றுக்கொள்ளுங்கள்.'
				) ); ?>
			</p>
			<div class="hero-actions">
				<a href="<?php echo esc_url( atchaya_courses_url() ); ?>" class="btn btn-gold btn-lg">
					<?php echo esc_html( atchaya_str( 'explore_courses' ) ); ?>
				</a>
				<a href="<?php echo esc_url( home_url( '/about/' ) ); ?>" class="btn btn-outline-light btn-lg">
					<?php echo esc_html( atchaya_str( 'about_academy' ) ); ?>
				</a>
			</div>
		</div>
		<div class="hero-visual">
			<div class="navagraha-wheel" aria-hidden="true">
				<div class="wheel-center">A</div>
				<?php for ( $i = 0; $i < 9; $i++ ) : ?>
					<span class="graha-dot" style="--i: <?php echo (int) $i; ?>"></span>
				<?php endfor; ?>
			</div>
		</div>
	</div>
</section>
