<?php
/**
 * Template Name: Full Width (No Sidebar)
 *
 * @package Atchayas_Astrology
 */

get_header();
?>

<div class="page-wrap full-width-wrap">
	<?php while ( have_posts() ) : the_post(); ?>
		<article <?php post_class( 'page-content full-width-content' ); ?>>
			<header class="page-header">
				<h1 class="page-title"><?php the_title(); ?></h1>
			</header>
			<div class="entry-content">
				<?php the_content(); ?>
			</div>
		</article>
	<?php endwhile; ?>
</div>

<?php
get_footer();
