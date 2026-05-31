<?php
/**
 * Single post template.
 *
 * @package Atchayas_Astrology
 */

get_header();
?>

<div class="container page-wrap blog-single-wrap">
	<div class="blog-layout">
		<article <?php post_class( 'single-post' ); ?>>
			<header class="entry-header">
				<h1><?php the_title(); ?></h1>
				<div class="entry-meta">
					<time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
					<span class="meta-sep">|</span>
					<span><?php the_author(); ?></span>
				</div>
			</header>
			<?php if ( has_post_thumbnail() ) : ?>
				<div class="featured-image"><?php the_post_thumbnail( 'large' ); ?></div>
			<?php endif; ?>
			<div class="entry-content">
				<?php the_content(); ?>
			</div>
		</article>
		<?php get_sidebar(); ?>
	</div>
</div>

<?php
get_footer();
