<?php
/**
 * About page template — Guru Ravichandran profile.
 *
 * @package Atchayas_Astrology
 */

get_header();

$blocks = atchaya_about_content_blocks();
?>
<div class="container page-wrap about-page">
	<header class="about-page-hero">
		<div class="about-page-hero-grid">
			<div class="about-page-photo">
				<?php
				$guru_photo = atchaya_get_option( 'guru_photo' );
				if ( $guru_photo ) :
					?>
					<img src="<?php echo esc_url( $guru_photo ); ?>" alt="<?php echo esc_attr( atchaya_guru_name() ); ?>" loading="lazy">
				<?php else : ?>
					<div class="guru-photo-placeholder about-placeholder">
						<span aria-hidden="true">&#9788;</span>
					</div>
				<?php endif; ?>
			</div>
			<div class="about-page-intro">
				<p class="guru-label"><?php echo esc_html( atchaya_guru_title() ); ?></p>
				<h1><?php echo esc_html( atchaya_guru_name() ); ?></h1>
				<blockquote class="guru-quote">
					<p>&ldquo;<?php echo esc_html( atchaya_guru_short_quote() ); ?>&rdquo;</p>
				</blockquote>
				<p class="about-lead"><?php echo esc_html( atchaya_guru_bio_short() ); ?></p>
				<a href="<?php echo esc_url( atchaya_courses_url() ); ?>" class="btn btn-gold">
					<?php echo esc_html( atchaya_str( 'explore_courses' ) ); ?>
				</a>
			</div>
		</div>
	</header>

	<?php foreach ( $blocks as $key => $block ) : ?>
		<?php if ( 'promise' === $key ) { continue; } ?>
		<section class="about-block">
			<h2><?php echo esc_html( atchaya_t( $block['title_en'], $block['title_ta'] ) ); ?></h2>
			<div class="about-block-body">
				<?php echo wp_kses_post( atchaya_t( $block['body_en'], $block['body_ta'] ) ); ?>
			</div>
		</section>
	<?php endforeach; ?>

	<section class="about-block about-promise">
		<div class="promise-card">
			<h2><?php echo esc_html( atchaya_t( $blocks['promise']['title_en'], $blocks['promise']['title_ta'] ) ); ?></h2>
			<p class="promise-text">&ldquo;<?php echo esc_html( atchaya_t( $blocks['promise']['body_en'], $blocks['promise']['body_ta'] ) ); ?>&rdquo;</p>
			<p class="promise-signature">— <?php echo esc_html( atchaya_guru_name() ); ?></p>
		</div>
	</section>
</div>

<?php
get_footer();
