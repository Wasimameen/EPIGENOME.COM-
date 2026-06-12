<?php
/**
 * Minimal WordPress shim — renders the theme outside WP for visual preview.
 * Dev tooling only; not part of the theme.
 */

define( 'ABSPATH', __DIR__ . '/' );
define( 'THEME_DIR', dirname( __DIR__ ) . '/epigenome-theme' );

$GLOBALS['shim_actions'] = array();
$GLOBALS['shim_filters'] = array();
$GLOBALS['shim_styles']  = array();
$GLOBALS['shim_scripts'] = array();

function add_action( $hook, $cb, $prio = 10, $args = 1 ) {
	$GLOBALS['shim_actions'][ $hook ][] = $cb;
}
function add_filter( $hook, $cb, $prio = 10, $args = 1 ) {
	$GLOBALS['shim_filters'][ $hook ][] = $cb;
}
function do_action_shim( $hook ) {
	if ( ! empty( $GLOBALS['shim_actions'][ $hook ] ) ) {
		foreach ( $GLOBALS['shim_actions'][ $hook ] as $cb ) {
			call_user_func( $cb );
		}
	}
}
function add_theme_support() {}
function get_template_directory() {
	return THEME_DIR;
}
function get_template_directory_uri() {
	return '/theme';
}
function wp_enqueue_style( $handle, $src = '', $deps = array(), $ver = false ) {
	$GLOBALS['shim_styles'][] = $src ? $src . ( $ver ? '?ver=' . $ver : '' ) : '';
}
function wp_enqueue_script( $handle, $src = '', $deps = array(), $ver = false, $footer = false ) {
	$GLOBALS['shim_scripts'][] = $src . ( $ver ? '?ver=' . $ver : '' );
}
function language_attributes() {
	echo 'lang="en-US"';
}
function bloginfo( $key ) {
	echo 'charset' === $key ? 'UTF-8' : 'EPIGENOME.COM';
}
function wp_head() {
	echo "<title>EPIGENOME.COM — The Category Name Is For Sale</title>\n";
	do_action_shim( 'wp_enqueue_scripts' );
	foreach ( $GLOBALS['shim_styles'] as $src ) {
		if ( $src ) {
			echo '<link rel="stylesheet" href="' . $src . "\">\n";
		}
	}
}
function wp_footer() {
	foreach ( $GLOBALS['shim_scripts'] as $src ) {
		echo '<script src="' . $src . "\"></script>\n";
	}
}
function body_class() {
	echo 'class="home page"';
}
function wp_body_open() {}
function get_header() {
	require THEME_DIR . '/header.php';
}
function get_footer() {
	require THEME_DIR . '/footer.php';
}
function get_theme_mod( $key, $default = '' ) {
	return $default;
}
function get_option( $key ) {
	return 'admin_email' === $key ? 'tom@determined.com' : '';
}
function home_url( $path = '' ) {
	return '/' . ltrim( $path, '/' );
}
function admin_url( $path = '' ) {
	return '/' . $path;
}
function antispambot( $str ) {
	return $str;
}
function wp_nonce_field( $action, $name ) {
	echo '<input type="hidden" name="' . $name . '" value="previewnonce">';
}
function esc_html( $t ) {
	return htmlspecialchars( (string) $t, ENT_QUOTES );
}
function esc_attr( $t ) {
	return htmlspecialchars( (string) $t, ENT_QUOTES );
}
function esc_url( $t ) {
	return $t;
}
function __( $t, $d = null ) {
	return $t;
}
function esc_html__( $t, $d = null ) {
	return esc_html( $t );
}
function esc_html_e( $t, $d = null ) {
	echo esc_html( $t );
}
function esc_attr_e( $t, $d = null ) {
	echo esc_attr( $t );
}

require THEME_DIR . '/functions.php';
require THEME_DIR . '/front-page.php';
