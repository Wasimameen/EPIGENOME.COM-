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

<div class="sky" data-sky aria-hidden="true">
	<svg class="sky__flight" data-flight preserveAspectRatio="none">
		<path class="sky__route" data-route d="" fill="none"/>
		<path class="sky__trail" data-trail d="" fill="none"/>
	</svg>
	<svg class="sky__plane" data-plane viewBox="-74 -50 148 100">
		<g data-plane-flip>
			<g data-plane-bob>
				<!-- speed dashes -->
				<g data-speed stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0">
					<line x1="-70" y1="-10" x2="-58" y2="-10"/>
					<line x1="-74" y1="0" x2="-60" y2="0"/>
					<line x1="-70" y1="10" x2="-58" y2="10"/>
				</g>
				<g fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
					<!-- far wing (upper, behind fuselage) -->
					<path d="M 2 -7 L -20 -19 C -24 -21, -27 -19, -24 -16 L -2 -5"/>
					<path d="M -6 -8 L -18 -15" stroke-width="0.6"/>
					<!-- tail -->
					<path d="M -41 -1 L -55 -5 C -57 -5.5, -57 -3.5, -55 -2.5 L -42 1.5"/>
					<path d="M -44 -1 C -49 -8, -52 -15, -52 -21 C -49 -21, -44 -17, -41 -11 C -40 -7, -40 -4, -41 -1.5"/>
					<path d="M -45 -5 C -47 -9, -49 -13, -50 -17" stroke-width="0.7"/>
					<!-- fuselage -->
					<path d="M -50 0 C -36 -7, -8 -9, 12 -8 C 28 -7, 40 -5, 47 0 C 40 5, 26 7.5, 8 8 C -12 8.5, -38 5, -50 0 Z"/>
					<path d="M -26 -7 C -26 -2, -26 3, -25 6" stroke-width="0.6"/>
					<path d="M 20 -7.5 C 20 -2, 20 3, 19 6.5" stroke-width="0.6"/>
					<!-- canopy -->
					<path d="M -4 -8 C -2 -12.5, 6 -12.5, 8 -8"/>
					<path d="M 2 -12.2 L 2 -8" stroke-width="0.7"/>
					<!-- engine cowl -->
					<path d="M 44 -5 C 49 -4, 49 4, 44 5"/>
					<path d="M 45 -4.6 L 45 4.6" stroke-width="0.6"/>
					<path d="M 38 5.5 L 33 8.5" stroke-width="1"/>
					<!-- near wing (lower, toward viewer) -->
					<path d="M 4 1 L -18 17 C -22 20, -26 17, -23 13 L 0 -2"/>
					<path d="M -2 4 L -19 15" stroke-width="0.6"/>
					<path d="M 1 1.5 L -21 13.5" stroke-width="0.6"/>
					<!-- landing gear -->
					<path d="M 6 8 L 4 16 M 16 6.5 L 16 15" stroke-width="1"/>
					<path d="M 4 16 L 16 15" stroke-width="0.7"/>
					<circle cx="4" cy="18.5" r="3"/>
					<circle cx="16" cy="17.5" r="3"/>
					<circle cx="4" cy="18.5" r="0.7" fill="currentColor" stroke="none"/>
					<circle cx="16" cy="17.5" r="0.7" fill="currentColor" stroke="none"/>
				</g>
				<!-- roundel -->
				<circle cx="-16" cy="-1.5" r="4.5" fill="none" stroke="currentColor" stroke-width="1"/>
				<circle cx="-16" cy="-1.5" r="1.8" class="sky__gold"/>
				<!-- propeller -->
				<g data-prop>
					<ellipse cx="51" cy="-11" rx="1.7" ry="10" fill="none" stroke="currentColor" stroke-width="0.9"/>
					<ellipse cx="51" cy="9" rx="1.7" ry="10" fill="none" stroke="currentColor" stroke-width="0.9"/>
				</g>
				<circle cx="51" cy="-1" r="2" fill="currentColor"/>
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
