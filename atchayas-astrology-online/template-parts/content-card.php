<?php
/**
 * Blog post card.
 *
 * @package Atchayas_Astrology
 */
?>
<article <?php post_class( 'blog-card' ); ?>>
	<a href="<?php the_permalink(); ?>" class="blog-card-link">
		<?php if ( has_post_thumbnail() ) : ?>
			<div class="blog-thumb"><?php the_post_thumbnail( 'medium_large' ); ?></div>
		<?php endif; ?>
		<div class="blog-body">
			<time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
			<h3><?php the_title(); ?></h3>
			<p><?php echo esc_html( wp_trim_words( get_the_excerpt(), 18 ) ); ?></p>
			<span class="read-more"><?php echo esc_html( atchaya_str( 'read_more' ) ); ?> &rarr;</span>
		</div>
	</a>
</article>
