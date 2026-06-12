<?php
/**
 * Router for `php -S` preview: /theme/* serves theme assets, everything
 * else renders the landing page through the shim.
 */

$uri = parse_url( $_SERVER['REQUEST_URI'], PHP_URL_PATH );

if ( strpos( $uri, '/theme/' ) === 0 ) {
	$file = dirname( __DIR__ ) . '/epigenome-theme/' . substr( $uri, 7 );
	$real = realpath( $file );
	$base = realpath( dirname( __DIR__ ) . '/epigenome-theme' );
	if ( $real && strpos( $real, $base ) === 0 && is_file( $real ) ) {
		$types = array(
			'css'  => 'text/css',
			'js'   => 'application/javascript',
			'png'  => 'image/png',
			'jpg'  => 'image/jpeg',
			'jpeg' => 'image/jpeg',
			'svg'  => 'image/svg+xml',
			'woff2' => 'font/woff2',
		);
		$ext = strtolower( pathinfo( $real, PATHINFO_EXTENSION ) );
		header( 'Content-Type: ' . ( $types[ $ext ] ?? 'application/octet-stream' ) );
		readfile( $real );
		exit;
	}
	http_response_code( 404 );
	exit;
}

require __DIR__ . '/wp-shim.php';
