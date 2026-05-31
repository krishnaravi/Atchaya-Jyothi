<?php
/**
 * Front page template.
 *
 * @package Atchayas_Astrology
 */

get_header();
?>

<?php get_template_part( 'template-parts/hero' ); ?>

<section class="section categories-section">
	<div class="container">
		<div class="section-header">
			<h2><?php echo esc_html( atchaya_str( 'course_categories' ) ); ?></h2>
		</div>
		<div class="category-grid">
			<?php foreach ( atchaya_course_categories() as $slug => $labels ) : ?>
				<a href="<?php echo esc_url( add_query_arg( 'course-category', $slug, atchaya_courses_url() ) ); ?>" class="category-card">
					<span class="category-icon" aria-hidden="true">&#9733;</span>
					<span class="category-name"><?php echo esc_html( atchaya_t( $labels['en'], $labels['ta'] ) ); ?></span>
				</a>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<?php get_template_part( 'template-parts/courses', 'grid' ); ?>

<section class="section panchang-section">
	<div class="container">
		<div class="section-header">
			<h2><?php echo esc_html( atchaya_str( 'daily_panchang' ) ); ?></h2>
			<a href="<?php echo esc_url( atchaya_panchang_url() ); ?>" class="section-link">
				<?php echo esc_html( atchaya_t( 'Full Panchang', 'முழு பஞ்சாங்கம்' ) ); ?> &rarr;
			</a>
		</div>
		<div class="panchang-home-wrap">
			<?php
			if ( is_active_sidebar( 'homepage-panchang' ) ) {
				dynamic_sidebar( 'homepage-panchang' );
			} elseif ( shortcode_exists( 'atchaya_panchang' ) ) {
				echo do_shortcode( '[atchaya_panchang place="Vellore" style="south"]' );
			} else {
				echo '<div class="placeholder-box">';
				echo esc_html( atchaya_t(
					'Activate the Atchaya Jyothi Panchang plugin and add [atchaya_panchang] to the Homepage Panchang widget.',
					'Atchaya Jyothi Panchang plugin-ஐ செயல்படுத்தி Homepage Panchang widget-ல் [atchaya_panchang] சேர்க்கவும்.'
				) );
				echo '</div>';
			}
			?>
		</div>
	</div>
</section>

<section class="section about-section">
	<div class="container about-grid">
		<div class="about-content">
			<div class="section-header align-left">
				<h2><?php echo esc_html( atchaya_str( 'about_academy' ) ); ?></h2>
			</div>
			<p class="lead">
				<?php echo esc_html( atchaya_t(
					'Led by Founder Astrologer Ravichandran, Atchaya\'s Astrology Online brings Vedic Jyotish to seekers, students, and professionals—in clear Tamil and English.',
					'ஜோதிடர் ரவிச்சந்திரன் அவர்களின் வழிகாட்டுதலில், அட்சயா\'ஸ் Astrology Online தேடுபவர்கள், மாணவர்கள் மற்றும் தொழில்முறை ஜோதிடர்களுக்கு வேத ஜோதிடத்தை எளிய தமிழ் மற்றும் ஆங்கிலத்தில் வழங்குகிறது.'
				) ); ?>
			</p>
			<div class="about-actions">
				<a href="<?php echo esc_url( home_url( '/about/' ) ); ?>" class="btn btn-primary">
					<?php echo esc_html( atchaya_str( 'learn_more' ) ); ?>
				</a>
				<a href="<?php echo esc_url( atchaya_pakshi_url() ); ?>" class="btn btn-outline">
					<?php echo esc_html( atchaya_str( 'pancha_pakshi' ) ); ?>
				</a>
			</div>
		</div>
		<?php get_template_part( 'template-parts/guru', 'profile' ); ?>
	</div>
</section>

<section class="section blog-section">
	<div class="container">
		<div class="section-header">
			<h2><?php echo esc_html( atchaya_str( 'latest_articles' ) ); ?></h2>
			<a href="<?php echo esc_url( get_post_type_archive_link( 'post' ) ?: home_url( '/blog/' ) ); ?>" class="section-link">
				<?php echo esc_html( atchaya_t( 'View All', 'அனைத்தும்' ) ); ?> &rarr;
			</a>
		</div>
		<div class="blog-grid">
			<?php
			$blog_query = new WP_Query( array(
				'post_type'      => 'post',
				'posts_per_page' => 3,
				'post_status'    => 'publish',
			) );
			if ( $blog_query->have_posts() ) :
				while ( $blog_query->have_posts() ) :
					$blog_query->the_post();
					get_template_part( 'template-parts/content', 'card' );
				endwhile;
				wp_reset_postdata();
			else :
				?>
				<p class="no-posts"><?php echo esc_html( atchaya_t( 'Blog posts coming soon.', 'வலைப்பதிவு விரைவில்.' ) ); ?></p>
			<?php endif; ?>
		</div>
	</div>
</section>

<section class="section cta-section">
	<div class="container cta-inner">
		<h2><?php echo esc_html( atchaya_t( 'Begin Your Astrological Journey Today', 'இன்றே உங்கள் ஜோதிட பயணத்தை தொடங்குங்கள்' ) ); ?></h2>
		<p><?php echo esc_html( atchaya_t(
			'Structured courses from basics to advanced — for seekers, students, and professionals.',
			'தேடுபவர்கள், மாணவர்கள், தொழில்முறை ஜோதிடர்களுக்கான அடிப்படை முதல் மேம்பட்ட பாடநெறிகள்.'
		) ); ?></p>
		<a href="<?php echo esc_url( atchaya_courses_url() ); ?>" class="btn btn-gold btn-lg">
			<?php echo esc_html( atchaya_str( 'get_started' ) ); ?>
		</a>
	</div>
</section>

<?php
get_footer();
