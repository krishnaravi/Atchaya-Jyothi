<?php
/**
 * Featured courses grid.
 *
 * @package Atchayas_Astrology
 */

$courses = atchaya_get_featured_courses( 6 );
?>
<section class="section courses-section">
	<div class="container">
		<div class="section-header">
			<h2><?php echo esc_html( atchaya_str( 'featured_courses' ) ); ?></h2>
			<a href="<?php echo esc_url( atchaya_courses_url() ); ?>" class="section-link">
				<?php echo esc_html( atchaya_str( 'view_all_courses' ) ); ?> &rarr;
			</a>
		</div>

		<?php if ( ! empty( $courses ) ) : ?>
			<div class="courses-grid">
				<?php foreach ( $courses as $course ) : ?>
					<?php
					setup_postdata( $course );
					$course_id = $course->ID;
					?>
					<article class="course-card">
						<a href="<?php echo esc_url( get_permalink( $course_id ) ); ?>" class="course-card-link">
							<div class="course-thumb">
								<?php if ( has_post_thumbnail( $course_id ) ) : ?>
									<?php echo get_the_post_thumbnail( $course_id, 'atchaya-course-card' ); ?>
								<?php else : ?>
									<div class="course-thumb-placeholder">
										<span aria-hidden="true">&#9733;</span>
									</div>
								<?php endif; ?>
								<?php atchaya_course_price_html( $course_id ); ?>
							</div>
							<div class="course-body">
								<h3><?php echo esc_html( get_the_title( $course_id ) ); ?></h3>
								<?php if ( function_exists( 'get_tutor_course_level' ) ) : ?>
									<span class="course-level"><?php echo esc_html( get_tutor_course_level( $course_id ) ); ?></span>
								<?php endif; ?>
								<span class="course-enroll"><?php echo esc_html( atchaya_str( 'enroll_now' ) ); ?> &rarr;</span>
							</div>
						</a>
					</article>
				<?php endforeach; ?>
				<?php wp_reset_postdata(); ?>
			</div>
		<?php else : ?>
			<div class="courses-placeholder">
				<p><?php echo esc_html( atchaya_t(
					'Courses will appear here once you publish them in Tutor LMS.',
					'Tutor LMS-ல் பாடநெறிகளை வெளியிட்டவுடன் இங்கே காட்டப்படும்.'
				) ); ?></p>
				<a href="<?php echo esc_url( atchaya_courses_url() ); ?>" class="btn btn-primary">
					<?php echo esc_html( atchaya_str( 'view_all_courses' ) ); ?>
				</a>
			</div>
		<?php endif; ?>
	</div>
</section>
