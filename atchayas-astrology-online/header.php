<!DOCTYPE html>
<html <?php language_attributes(); ?> data-atchaya-lang="<?php echo esc_attr( atchaya_get_lang() ); ?>">
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="profile" href="https://gmpg.org/xfn/11">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<a class="skip-link screen-reader-text" href="#main-content">
	<?php echo esc_html( atchaya_t( 'Skip to content', 'உள்ளடக்கத்திற்கு செல்' ) ); ?>
</a>

<header class="site-header" id="site-header">
	<div class="header-inner container">
		<div class="site-branding">
			<?php if ( has_custom_logo() ) : ?>
				<?php the_custom_logo(); ?>
			<?php else : ?>
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="site-logo-text" rel="home">
					<span class="logo-mark" aria-hidden="true">A</span>
					<span class="logo-text">
						<span class="logo-name"><?php bloginfo( 'name' ); ?></span>
						<span class="logo-tagline"><?php echo esc_html( atchaya_str( 'tagline' ) ); ?></span>
					</span>
				</a>
			<?php endif; ?>
		</div>

		<nav class="primary-navigation" id="primary-navigation" aria-label="<?php esc_attr_e( 'Primary Navigation', 'atchayas-astrology' ); ?>">
			<button class="menu-toggle" id="menu-toggle" aria-expanded="false" aria-controls="primary-menu">
				<span class="menu-toggle-bar"></span>
				<span class="menu-toggle-bar"></span>
				<span class="menu-toggle-bar"></span>
				<span class="screen-reader-text"><?php echo esc_html( atchaya_t( 'Menu', 'மெனு' ) ); ?></span>
			</button>
			<?php
			wp_nav_menu( array(
				'theme_location' => 'primary',
				'menu_id'        => 'primary-menu',
				'menu_class'     => 'primary-menu',
				'container'      => false,
				'fallback_cb'    => 'atchaya_fallback_menu',
			) );
			?>
		</nav>

		<div class="header-actions">
			<div class="lang-switcher" role="group" aria-label="<?php esc_attr_e( 'Language', 'atchayas-astrology' ); ?>">
				<button type="button" class="lang-btn <?php echo 'en' === atchaya_get_lang() ? 'is-active' : ''; ?>" data-lang="en">EN</button>
				<button type="button" class="lang-btn <?php echo 'ta' === atchaya_get_lang() ? 'is-active' : ''; ?>" data-lang="ta">தமிழ்</button>
			</div>

			<?php if ( is_user_logged_in() ) : ?>
				<a href="<?php echo esc_url( atchaya_dashboard_url() ); ?>" class="btn btn-outline btn-sm header-dashboard">
					<?php echo esc_html( atchaya_str( 'dashboard' ) ); ?>
				</a>
			<?php else : ?>
				<a href="<?php echo esc_url( wp_login_url( atchaya_dashboard_url() ) ); ?>" class="btn btn-outline btn-sm">
					<?php echo esc_html( atchaya_str( 'login' ) ); ?>
				</a>
				<a href="<?php echo esc_url( wp_registration_url() ); ?>" class="btn btn-primary btn-sm">
					<?php echo esc_html( atchaya_str( 'register' ) ); ?>
				</a>
			<?php endif; ?>
		</div>
	</div>
</header>

<main id="main-content" class="site-main">
