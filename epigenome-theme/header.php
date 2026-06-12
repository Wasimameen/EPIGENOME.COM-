<?php
/**
 * Header: curtain preloader, cursor, progress hairline, minimal nav.
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
<noscript><style>.preloader{display:none}</style></noscript>

<div class="preloader" id="preloader" aria-hidden="true">
	<div class="preloader__panel preloader__panel--top" data-curtain-top></div>
	<div class="preloader__panel preloader__panel--bottom" data-curtain-bottom></div>
	<div class="preloader__center">
		<span class="preloader__word" data-preload-word><?php echo esc_html( epigenome_opt( 'domain_name' ) ); ?></span>
		<span class="preloader__count mono"><span data-preload-count>0</span>%</span>
	</div>
</div>

<div class="cursor" aria-hidden="true">
	<div class="cursor__dot" data-cursor-dot></div>
	<div class="cursor__ring" data-cursor-ring></div>
</div>

<div class="progress" aria-hidden="true"><span class="progress__fill" data-progress></span></div>

<a class="skip-link" href="#main"><?php esc_html_e( 'Skip to content', 'epigenome' ); ?></a>

<header class="nav" data-nav>
	<div class="container nav__inner">
		<a class="nav__brand mono" href="<?php echo esc_url( home_url( '/' ) ); ?>" data-magnetic>
			<span class="nav__brand-mark" aria-hidden="true">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M8 3c4 3 4 7 0 9 4 2 4 6 0 9M16 3c-4 3-4 7 0 9-4 2-4 6 0 9"/><path d="M9.2 6.5h5.6M9.2 17.5h5.6M8.4 12h7.2"/></svg>
			</span>
			<?php echo esc_html( epigenome_opt( 'domain_name' ) ); ?>
		</a>
		<nav class="nav__links mono" aria-label="<?php esc_attr_e( 'Listing', 'epigenome' ); ?>">
			<a href="#provenance" class="nav__link" data-magnetic><?php esc_html_e( 'Listing', 'epigenome' ); ?></a>
			<a href="#comps" class="nav__link" data-magnetic><?php esc_html_e( 'Comps', 'epigenome' ); ?></a>
			<span class="nav__price"><?php echo esc_html( epigenome_opt( 'price' ) ); ?></span>
			<a href="#offer" class="btn btn--ink btn--sm" data-magnetic>
				<span class="btn__label"><?php esc_html_e( 'Make an Offer', 'epigenome' ); ?></span>
			</a>
		</nav>
	</div>
</header>

<aside class="waypoints mono" aria-hidden="true" data-waypoints>
	<span class="waypoints__current" data-waypoint-now>01</span>
	<span class="waypoints__rule"><span class="waypoints__rule-fill" data-waypoint-fill></span></span>
	<span class="waypoints__total">07</span>
</aside>

<svg class="thread" data-thread aria-hidden="true" preserveAspectRatio="none"><path data-thread-path d="" fill="none"/></svg>
