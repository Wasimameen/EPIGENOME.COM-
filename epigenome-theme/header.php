<?php
/**
 * Header: preloader, cursor, scroll progress, floating nav.
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
	<div class="preloader__inner">
		<div class="preloader__word" data-preload-word><?php echo esc_html( epigenome_opt( 'domain_name' ) ); ?></div>
		<div class="preloader__bar"><span class="preloader__bar-fill" data-preload-bar></span></div>
		<div class="preloader__count" data-preload-count>00</div>
	</div>
</div>

<div class="cursor" aria-hidden="true">
	<div class="cursor__dot" data-cursor-dot></div>
	<div class="cursor__ring" data-cursor-ring></div>
</div>

<div class="progress" aria-hidden="true"><span class="progress__fill" data-progress></span></div>

<a class="skip-link" href="#main"><?php esc_html_e( 'Skip to content', 'epigenome' ); ?></a>

<header class="nav" data-nav>
	<div class="nav__inner">
		<a class="nav__brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" data-magnetic>
			<span class="nav__brand-mark" aria-hidden="true">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M8 3c4 3 4 7 0 9 4 2 4 6 0 9M16 3c-4 3-4 7 0 9-4 2-4 6 0 9"/><path d="M9.2 6.5h5.6M9.2 17.5h5.6M8.4 12h7.2"/></svg>
			</span>
			<span class="nav__brand-text"><?php echo esc_html( epigenome_opt( 'domain_name' ) ); ?></span>
		</a>
		<div class="nav__right">
			<span class="nav__price mono"><?php echo esc_html( epigenome_opt( 'price' ) ); ?></span>
			<a class="btn btn--gold btn--sm" href="#offer" data-magnetic>
				<span class="btn__label"><?php esc_html_e( 'Make an Offer', 'epigenome' ); ?></span>
				<span class="btn__arrow" aria-hidden="true">&rarr;</span>
			</a>
		</div>
	</div>
</header>
