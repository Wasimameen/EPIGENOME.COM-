<?php
/**
 * Header: floating white pill nav.
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
