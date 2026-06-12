<?php
/**
 * Epigenome — Premium Domain Listing theme.
 *
 * @package Epigenome
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'EPIGENOME_VERSION', '1.0.0' );

require get_template_directory() . '/inc/customizer.php';

/**
 * Theme supports.
 */
function epigenome_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'html5', array( 'search-form', 'style', 'script' ) );
	add_theme_support( 'custom-logo' );
}
add_action( 'after_setup_theme', 'epigenome_setup' );

/**
 * Assets.
 */
function epigenome_assets() {
	$uri = get_template_directory_uri();

	wp_enqueue_style(
		'epigenome-fonts',
		'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap',
		array(),
		null
	);
	wp_enqueue_style( 'epigenome-main', $uri . '/assets/css/main.css', array(), EPIGENOME_VERSION );

	wp_enqueue_script( 'epigenome-gsap', $uri . '/assets/js/vendor/gsap.min.js', array(), '3.13.0', true );
	wp_enqueue_script( 'epigenome-scrolltrigger', $uri . '/assets/js/vendor/ScrollTrigger.min.js', array( 'epigenome-gsap' ), '3.13.0', true );
	wp_enqueue_script( 'epigenome-lenis', $uri . '/assets/js/vendor/lenis.min.js', array(), '1.3.8', true );
	wp_enqueue_script(
		'epigenome-main',
		$uri . '/assets/js/main.js',
		array( 'epigenome-gsap', 'epigenome-scrolltrigger', 'epigenome-lenis' ),
		EPIGENOME_VERSION,
		true
	);
}
add_action( 'wp_enqueue_scripts', 'epigenome_assets' );

/**
 * Preconnect for Google Fonts.
 */
function epigenome_resource_hints( $hints, $relation ) {
	if ( 'preconnect' === $relation ) {
		$hints[] = array(
			'href'        => 'https://fonts.gstatic.com',
			'crossorigin' => 'anonymous',
		);
	}
	return $hints;
}
add_filter( 'wp_resource_hints', 'epigenome_resource_hints', 10, 2 );

/**
 * Listing option helper.
 *
 * @param string $key Option key.
 * @return string
 */
function epigenome_opt( $key ) {
	$defaults = array(
		'domain_name'   => 'EPIGENOME.COM',
		'price'         => '$295,000',
		'lto_enabled'   => '',
		'lto_monthly'   => '$4,900 / month',
		'contact_email' => get_option( 'admin_email' ),
		'contact_phone' => '',
		'buy_link'      => '',
		'broker_name'   => 'Tom McCarthy',
		'broker_org'    => 'GoDaddy',
		'listing_no'    => 'N° 01 — 2026',
	);
	$default  = isset( $defaults[ $key ] ) ? $defaults[ $key ] : '';
	return get_theme_mod( 'epigenome_' . $key, $default );
}

/**
 * Buy-now URL: escrow/marketplace link if set, otherwise mailto.
 *
 * @return string
 */
function epigenome_buy_url() {
	$link = epigenome_opt( 'buy_link' );
	if ( ! empty( $link ) ) {
		return esc_url( $link );
	}
	$subject = rawurlencode( epigenome_opt( 'domain_name' ) . ' — Buy Now at ' . epigenome_opt( 'price' ) );
	return 'mailto:' . antispambot( epigenome_opt( 'contact_email' ) ) . '?subject=' . $subject;
}

/**
 * Offer form handler (admin-post.php).
 */
function epigenome_handle_offer() {
	$redirect = wp_get_referer() ? wp_get_referer() : home_url( '/' );
	$redirect = remove_query_arg( array( 'offer' ), $redirect );

	if ( ! isset( $_POST['epigenome_offer_nonce'] ) || ! wp_verify_nonce( sanitize_key( $_POST['epigenome_offer_nonce'] ), 'epigenome_offer' ) ) {
		wp_safe_redirect( add_query_arg( 'offer', 'error', $redirect ) . '#offer' );
		exit;
	}

	// Honeypot: real visitors never fill this field.
	if ( ! empty( $_POST['company_website'] ) ) {
		wp_safe_redirect( add_query_arg( 'offer', 'sent', $redirect ) . '#offer' );
		exit;
	}

	$name    = isset( $_POST['offer_name'] ) ? sanitize_text_field( wp_unslash( $_POST['offer_name'] ) ) : '';
	$email   = isset( $_POST['offer_email'] ) ? sanitize_email( wp_unslash( $_POST['offer_email'] ) ) : '';
	$company = isset( $_POST['offer_company'] ) ? sanitize_text_field( wp_unslash( $_POST['offer_company'] ) ) : '';
	$amount  = isset( $_POST['offer_amount'] ) ? sanitize_text_field( wp_unslash( $_POST['offer_amount'] ) ) : '';
	$message = isset( $_POST['offer_message'] ) ? sanitize_textarea_field( wp_unslash( $_POST['offer_message'] ) ) : '';

	if ( empty( $name ) || empty( $email ) || ! is_email( $email ) || empty( $amount ) ) {
		wp_safe_redirect( add_query_arg( 'offer', 'error', $redirect ) . '#offer' );
		exit;
	}

	$domain  = epigenome_opt( 'domain_name' );
	$to      = epigenome_opt( 'contact_email' );
	$subject = sprintf( '[%s] Offer: %s from %s', $domain, $amount, $name );
	$body    = "New offer received via {$domain}\n\n"
		. "Name:    {$name}\n"
		. "Email:   {$email}\n"
		. "Company: {$company}\n"
		. "Offer:   {$amount}\n\n"
		. "Message:\n{$message}\n";
	$headers = array( 'Reply-To: ' . $name . ' <' . $email . '>' );

	wp_mail( $to, $subject, $body, $headers );

	wp_safe_redirect( add_query_arg( 'offer', 'sent', $redirect ) . '#offer' );
	exit;
}
add_action( 'admin_post_epigenome_offer', 'epigenome_handle_offer' );
add_action( 'admin_post_nopriv_epigenome_offer', 'epigenome_handle_offer' );
