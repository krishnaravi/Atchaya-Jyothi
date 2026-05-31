
</main><!-- #main-content -->

<footer class="site-footer">
	<div class="footer-top container">
		<div class="footer-brand">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="footer-logo">
				<span class="logo-mark">A</span>
				<span><?php bloginfo( 'name' ); ?></span>
			</a>
			<p class="footer-desc"><?php echo esc_html( atchaya_str( 'footer_desc' ) ); ?></p>
			<?php
			$whatsapp = atchaya_get_option( 'whatsapp' );
			if ( $whatsapp ) :
				?>
				<a href="<?php echo esc_url( $whatsapp ); ?>" class="footer-whatsapp" target="_blank" rel="noopener noreferrer">
					<?php echo esc_html( atchaya_t( 'Join WhatsApp Community', 'வாட்ஸ்அப் சமூகத்தில் சேருங்கள்' ) ); ?>
				</a>
			<?php endif; ?>
		</div>

		<div class="footer-links">
			<h4><?php echo esc_html( atchaya_str( 'quick_links' ) ); ?></h4>
			<?php
			wp_nav_menu( array(
				'theme_location' => 'footer',
				'menu_class'     => 'footer-menu',
				'container'      => false,
				'fallback_cb'    => 'atchaya_fallback_menu',
				'depth'          => 1,
			) );
			?>
		</div>

		<div class="footer-contact">
			<h4><?php echo esc_html( atchaya_str( 'contact_us' ) ); ?></h4>
			<ul class="contact-list">
				<?php if ( atchaya_get_option( 'contact_email' ) ) : ?>
					<li>
						<a href="mailto:<?php echo esc_attr( atchaya_get_option( 'contact_email' ) ); ?>">
							<?php echo esc_html( atchaya_get_option( 'contact_email' ) ); ?>
						</a>
					</li>
				<?php endif; ?>
				<?php if ( atchaya_get_option( 'contact_phone' ) ) : ?>
					<li>
						<a href="tel:<?php echo esc_attr( preg_replace( '/\s+/', '', atchaya_get_option( 'contact_phone' ) ) ); ?>">
							<?php echo esc_html( atchaya_get_option( 'contact_phone' ) ); ?>
						</a>
					</li>
				<?php endif; ?>
			</ul>
		</div>

		<?php if ( is_active_sidebar( 'footer-1' ) || is_active_sidebar( 'footer-2' ) ) : ?>
			<div class="footer-widgets">
				<?php dynamic_sidebar( 'footer-1' ); ?>
				<?php dynamic_sidebar( 'footer-2' ); ?>
			</div>
		<?php endif; ?>
	</div>

	<div class="footer-bottom">
		<div class="container footer-bottom-inner">
			<p>&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> <?php bloginfo( 'name' ); ?>. <?php echo esc_html( atchaya_str( 'all_rights' ) ); ?></p>
			<nav class="footer-legal" aria-label="<?php esc_attr_e( 'Legal', 'atchayas-astrology' ); ?>">
				<a href="<?php echo esc_url( home_url( '/privacy-policy/' ) ); ?>"><?php echo esc_html( atchaya_str( 'privacy_policy' ) ); ?></a>
				<a href="<?php echo esc_url( home_url( '/terms/' ) ); ?>"><?php echo esc_html( atchaya_str( 'terms' ) ); ?></a>
				<span class="no-refund-note"><?php echo esc_html( atchaya_str( 'no_refund' ) ); ?></span>
			</nav>
		</div>
	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
