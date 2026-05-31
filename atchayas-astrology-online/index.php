<?php
/**
 * Main template fallback.
 *
 * @package Atchayas_Astrology
 */

get_header();
?>

<div class="container page-wrap">
	<?php if ( have_posts() ) : ?>
		<div class="posts-grid">
			<?php
			while ( have_posts() ) :
				the_post();
				get_template_part( 'template-parts/content', 'card' );
			endwhile;
			?>
		</div>
		<?php the_posts_pagination(); ?>
	<?php else : ?>
		<div class="no-results">
			<h1><?php echo esc_html( atchaya_t( 'Nothing Found', 'எதுவும் கிடைக்கவில்லை' ) ); ?></h1>
		</div>
	<?php endif; ?>
</div>

<?php
get_footer();
