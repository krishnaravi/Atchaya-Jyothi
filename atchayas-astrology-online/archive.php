<?php
/**
 * Archive template.
 *
 * @package Atchayas_Astrology
 */

get_header();
?>

<div class="container page-wrap">
	<header class="archive-header">
		<h1><?php the_archive_title(); ?></h1>
		<?php the_archive_description( '<div class="archive-desc">', '</div>' ); ?>
	</header>

	<?php if ( have_posts() ) : ?>
		<div class="posts-grid blog-grid">
			<?php
			while ( have_posts() ) :
				the_post();
				get_template_part( 'template-parts/content', 'card' );
			endwhile;
			?>
		</div>
		<?php the_posts_pagination(); ?>
	<?php else : ?>
		<p><?php echo esc_html( atchaya_t( 'No posts found.', 'இடுகைகள் இல்லை.' ) ); ?></p>
	<?php endif; ?>
</div>

<?php
get_footer();
