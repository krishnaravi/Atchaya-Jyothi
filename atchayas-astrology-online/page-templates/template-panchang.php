<?php
/**
 * Template Name: Panchang Page
 * Description: Full-width page for Atchaya Jyothi Panchang shortcode.
 *
 * @package Atchayas_Astrology
 */

get_header();
?>

<div class="container page-wrap tool-page panchang-page">
	<header class="page-header tool-header">
		<h1><?php echo esc_html( atchaya_str( 'panchang' ) ); ?></h1>
		<p><?php echo esc_html( atchaya_t(
			'Daily Tamil Panchang — Tithi, Nakshatra, Yoga, Karana, Gowri, Rahu Kalam & Rasi Chart.',
			'தினசரி தமிழ் பஞ்சாங்கம் — திதி, நட்சத்திரம், யோகம், கரணம், கௌரி, ராகு காலம் & ராசி சக்கரம்.'
		) ); ?></p>
	</header>

	<div class="tool-content">
		<?php
		while ( have_posts() ) :
			the_post();
			if ( has_shortcode( get_post()->post_content, 'atchaya_panchang' ) ) {
				the_content();
			} else {
				echo do_shortcode( '[atchaya_panchang place="Vellore" style="south"]' );
			}
		endwhile;
		?>
	</div>
</div>

<?php
get_footer();
