<?php
/**
 * Sidebar.
 *
 * @package Atchayas_Astrology
 */

if ( ! is_active_sidebar( 'blog-sidebar' ) ) {
	return;
}
?>
<aside class="blog-sidebar" role="complementary">
	<?php dynamic_sidebar( 'blog-sidebar' ); ?>
</aside>
