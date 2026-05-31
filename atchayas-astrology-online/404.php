<?php
/**
 * 404 template.
 *
 * @package Atchayas_Astrology
 */

get_header();
?>

<div class="container page-wrap error-404">
	<h1>404</h1>
	<h2><?php echo esc_html( atchaya_t( 'Page Not Found', 'பக்கம் கிடைக்கவில்லை' ) ); ?></h2>
	<p><?php echo esc_html( atchaya_t(
		'The page you are looking for may have moved or no longer exists.',
		'நீங்கள் தேடும் பக்கம் நகர்த்தப்பட்டிருக்கலாம் அல்லது இனி இல்லாமல் போயிருக்கலாம்.'
	) ); ?></p>
	<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="btn btn-primary">
		<?php echo esc_html( atchaya_str( 'home' ) ); ?>
	</a>
</div>

<?php
get_footer();
