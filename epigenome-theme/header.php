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

<canvas class="aurora-bg" data-aurora aria-hidden="true"></canvas>
<canvas class="contrail" data-contrail aria-hidden="true"></canvas>
<canvas class="sparks" data-sparks aria-hidden="true"></canvas>

<div class="flyby" data-flyby aria-hidden="true">
	<img class="flyby__plane" src="<?php echo esc_url( get_template_directory_uri() . '/assets/img/plane-sprite.png' ); ?>" alt="">
	<div class="flyby__streaks"></div>
</div>

<div class="sky" data-sky aria-hidden="true">
	<svg class="sky__flight" data-flight preserveAspectRatio="none">
		<path class="sky__route" data-route d="" fill="none"/>
		<path class="sky__trail" data-trail d="" fill="none"/>
	</svg>
	<svg class="sky__plane" data-plane viewBox="-66 -42 132 84">
		<g data-plane-flip>
			<g data-plane-bob>
				<g data-speed stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity="0">
					<line x1="-64" y1="-12" x2="-50" y2="-12"/>
					<line x1="-66" y1="0" x2="-52" y2="0"/>
					<line x1="-64" y1="12" x2="-50" y2="12"/>
				</g>
				<image x="-66" y="-42" width="132" height="84" href="<?php echo esc_url( get_template_directory_uri() . '/assets/img/plane-sprite.png' ); ?>"/>
			</g>
		</g>
	</svg>

	<div class="sky__decor sky__decor--rosette" data-decor="rosette">
		<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1">
			<circle cx="50" cy="50" r="16"/>
			<circle cx="50" cy="50" r="22" stroke-dasharray="2 4"/>
			<g data-rosette-rays>
				<?php for ( $r = 0; $r < 12; $r++ ) : ?>
					<path transform="rotate(<?php echo esc_attr( $r * 30 ); ?> 50 50)" d="M 50 22 L 47 12 L 53 12 Z"/>
				<?php endfor; ?>
			</g>
			<circle cx="50" cy="50" r="3" fill="currentColor" stroke="none"/>
		</svg>
	</div>

	<div class="sky__decor sky__decor--cloud sky__decor--cloud-a" data-decor="cloud">
		<svg viewBox="0 0 160 70" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round">
			<path d="M 18 52 C 8 52, 4 44, 8 37 C 4 30, 12 22, 22 25 C 24 14, 40 10, 48 18 C 56 8, 74 10, 78 20 C 90 14, 104 22, 100 32 C 110 34, 112 46, 102 50 C 96 56, 84 56, 78 52 C 70 58, 54 58, 46 52 C 38 57, 26 57, 18 52 Z"/>
			<path d="M 26 44 H 56 M 64 44 H 88 M 34 36 H 50 M 60 36 H 80" stroke-width="0.8"/>
		</svg>
	</div>
	<div class="sky__decor sky__decor--cloud sky__decor--cloud-b" data-decor="cloud">
		<svg viewBox="0 0 160 70" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round">
			<path d="M 24 50 C 12 50, 8 40, 14 34 C 10 26, 20 18, 30 22 C 34 12, 52 10, 58 20 C 68 12, 84 16, 86 26 C 98 24, 106 34, 100 42 C 104 48, 96 54, 88 52 C 78 58, 58 58, 48 52 C 40 56, 30 55, 24 50 Z"/>
			<path d="M 30 42 H 52 M 60 42 H 84 M 38 34 H 70" stroke-width="0.8"/>
		</svg>
	</div>

	<div class="sky__decor sky__decor--birds" data-decor="birds">
		<svg viewBox="0 0 120 60" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
			<path d="M 10 30 C 14 26, 18 26, 22 30 C 26 26, 30 26, 34 30"/>
			<path d="M 48 18 C 51 15, 54 15, 57 18 C 60 15, 63 15, 66 18"/>
			<path d="M 56 40 C 59 37, 62 37, 65 40 C 68 37, 71 37, 74 40"/>
			<path d="M 88 26 C 90 24, 92 24, 94 26 C 96 24, 98 24, 100 26"/>
			<path d="M 96 46 C 98 44, 100 44, 102 46 C 104 44, 106 44, 108 46"/>
		</svg>
	</div>

	<div class="sky__decor sky__decor--balloon" data-decor="balloon">
		<svg viewBox="0 0 90 130" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
			<path d="M 45 6 C 70 6, 82 26, 80 46 C 78 64, 62 76, 53 84 L 37 84 C 28 76, 12 64, 10 46 C 8 26, 20 6, 45 6 Z"/>
			<path d="M 45 6 C 56 18, 58 60, 51 84 M 45 6 C 34 18, 32 60, 39 84 M 45 6 C 64 14, 70 50, 60 80 M 45 6 C 26 14, 20 50, 30 80" stroke-width="0.8"/>
			<path d="M 37 84 L 35 96 M 53 84 L 55 96 M 41 85 L 41 96 M 49 85 L 49 96" stroke-width="0.9"/>
			<path d="M 34 96 H 56 L 54 110 H 36 Z"/>
			<path d="M 34 101 H 56" stroke-width="0.8"/>
		</svg>
	</div>

	<div class="sky__decor sky__decor--helix" data-decor="helix">
		<svg viewBox="0 0 80 320" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round">
			<path d="M 20 0 C 64 40, 64 60, 20 100 C -8 128, -8 152, 20 180 C 64 220, 64 240, 20 280 C 6 294, 4 306, 12 320" transform="translate(10 0)"/>
			<path d="M 60 0 C 16 40, 16 60, 60 100 C 88 128, 88 152, 60 180 C 16 220, 16 240, 60 280 C 74 294, 76 306, 68 320" transform="translate(-10 0)"/>
			<path d="M 26 22 H 56 M 22 50 H 60 M 26 78 H 56 M 30 130 H 52 M 26 158 H 56 M 26 202 H 56 M 22 230 H 60 M 26 258 H 56" stroke-width="0.8"/>
		</svg>
	</div>
</div>
