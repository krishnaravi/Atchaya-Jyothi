<?php
/**
 * Template Name: Pancha Pakshi Page
 * Description: Full-width page for Pancha Pakshi calculator shortcode.
 *
 * @package Atchayas_Astrology
 */

get_header();
?>

<div class="container page-wrap tool-page pakshi-page">
	<header class="page-header tool-header">
		<h1><?php echo esc_html( atchaya_str( 'pancha_pakshi' ) ); ?></h1>
		<p><?php echo esc_html( atchaya_t(
			'Calculate your Janma Pakshi and view daily Pancha Pakshi activity timings.',
			'உங்கள் ஜென்ம பட்சியை கணக்கிட்டு, தினசரி பஞ்ச பட்சி நேர அட்டவணையை பாருங்கள்.'
		) ); ?></p>
	</header>

	<div class="tool-content">
		<?php
		while ( have_posts() ) :
			the_post();
			if ( has_shortcode( get_post()->post_content, 'pancha_pakshi_calculator' ) ) {
				the_content();
			} else {
				echo do_shortcode( '[pancha_pakshi_calculator]' );
			}
		endwhile;
		?>
	</div>
</div>

<?php
get_footer();
