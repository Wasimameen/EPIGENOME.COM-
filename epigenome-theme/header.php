<?php
/**
 * Header: scroll-progress line, top contact bar, floating white pill nav.
 *
 * @package Epigenome
 */
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="<?php echo esc_attr( epigenome_opt( 'domain_name' ) . ' is for sale. The category-defining name for epigenomics. Asking ' . epigenome_opt( 'price' ) . '.' ); ?>">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<script>(function(d){d.classList.add('js-anim');if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('reduce-motion');}}(document.documentElement));</script>

<a class="skip-link" href="#main"><?php esc_html_e( 'Skip to content', 'epigenome' ); ?></a>

<?php
$epigenome_email    = epigenome_opt( 'contact_email' );
$epigenome_phone    = epigenome_opt( 'contact_phone' );
$epigenome_location = epigenome_opt( 'contact_location' );
$epigenome_status   = epigenome_opt( 'contact_status' );
?>

<div class="scroll-progress" data-progress aria-hidden="true"></div>

<div class="topbar" data-topbar>
	<div class="topbar__inner">
		<div class="topbar__group topbar__group--left">
			<?php if ( $epigenome_email ) : ?>
				<a class="topbar__item" href="mailto:<?php echo esc_attr( antispambot( $epigenome_email ) ); ?>">
					<svg class="topbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
					<span><?php echo esc_html( antispambot( $epigenome_email ) ); ?></span>
				</a>
			<?php endif; ?>
			<?php if ( $epigenome_email && $epigenome_phone ) : ?>
				<span class="topbar__sep" aria-hidden="true"></span>
			<?php endif; ?>
			<?php if ( $epigenome_phone ) : ?>
				<a class="topbar__item" href="<?php echo esc_attr( epigenome_tel_href( $epigenome_phone ) ); ?>">
					<svg class="topbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h3.6l1.6 4.4-2.2 1.3a11.5 11.5 0 0 0 4.6 4.6l1.3-2.2 4.4 1.6V18a2 2 0 0 1-2.1 2A15.5 15.5 0 0 1 3 6.1 2 2 0 0 1 5 4z"/></svg>
					<span><?php echo esc_html( $epigenome_phone ); ?></span>
				</a>
			<?php endif; ?>
		</div>

		<div class="topbar__group topbar__group--right">
			<?php if ( $epigenome_status ) : ?>
				<span class="topbar__status">
					<span class="topbar__dot" aria-hidden="true"></span>
					<?php echo esc_html( $epigenome_status ); ?>
				</span>
			<?php endif; ?>
			<?php if ( $epigenome_status && $epigenome_location ) : ?>
				<span class="topbar__sep topbar__sep--sm-hide" aria-hidden="true"></span>
			<?php endif; ?>
			<?php if ( $epigenome_location ) : ?>
				<span class="topbar__item topbar__item--muted topbar__loc">
					<svg class="topbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.4"/></svg>
					<?php echo esc_html( $epigenome_location ); ?>
				</span>
			<?php endif; ?>
		</div>
	</div>
</div>

<header class="nav" data-nav>
	<div class="nav__pill">
		<a class="nav__brand" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php echo esc_html( epigenome_opt( 'domain_name' ) ); ?></a>
		<nav class="nav__links" aria-label="<?php esc_attr_e( 'Listing', 'epigenome' ); ?>">
			<a class="nav__link" href="#provenance"><?php esc_html_e( 'Listing', 'epigenome' ); ?></a>
			<a class="nav__link" href="#comps"><?php esc_html_e( 'Comps', 'epigenome' ); ?></a>
			<a class="nav__link" href="#terms"><?php esc_html_e( 'Terms', 'epigenome' ); ?></a>
			<a class="nav__link" href="#broker"><?php esc_html_e( 'About', 'epigenome' ); ?></a>
			<a class="nav__link" href="#offer"><?php esc_html_e( 'Contact', 'epigenome' ); ?></a>
		</nav>
		<div class="nav__cta">
			<span class="nav__price"><?php echo esc_html( epigenome_opt( 'price' ) ); ?></span>
			<a class="btn btn--dark btn--sm" href="#offer" data-magnetic>
				<span><?php esc_html_e( 'Make an Offer', 'epigenome' ); ?></span>
				<span class="btn__arrow" aria-hidden="true">&rarr;</span>
			</a>
		</div>
	</div>
</header>
