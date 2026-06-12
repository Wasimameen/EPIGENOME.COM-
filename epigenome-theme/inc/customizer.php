<?php
/**
 * Customizer: Appearance → Customize → Domain Listing.
 *
 * @package Epigenome
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register listing settings.
 *
 * @param WP_Customize_Manager $wp_customize Customizer instance.
 */
function epigenome_customize_register( $wp_customize ) {
	$wp_customize->add_section(
		'epigenome_listing',
		array(
			'title'       => __( 'Domain Listing', 'epigenome' ),
			'priority'    => 10,
			'description' => __( 'Everything about the sale: price, contact details, escrow link and lease-to-own terms.', 'epigenome' ),
		)
	);

	$fields = array(
		'domain_name'   => array( 'Domain name', 'text', 'EPIGENOME.COM' ),
		'price'         => array( 'Asking price (shown everywhere)', 'text', '$14,888' ),
		'lto_enabled'   => array( 'Show lease-to-own monthly terms', 'checkbox', '' ),
		'lto_monthly'   => array( 'Lease-to-own monthly figure', 'text', '$1,240 / month' ),
		'contact_email' => array( 'Contact email (offers are sent here)', 'email', get_option( 'admin_email' ) ),
		'contact_phone' => array( 'Contact phone (optional)', 'text', '' ),
		'buy_link'      => array( 'Buy Now link (Escrow.com / Afternic / Dan). Empty = email.', 'url', '' ),
		'broker_name'   => array( 'Seller / broker name', 'text', 'Tom McCarthy' ),
		'broker_org'    => array( 'Affiliation shown after the name', 'text', 'GoDaddy' ),
		'listing_no'    => array( 'Listing label (hero kicker)', 'text', 'N° 01 — 2026' ),
	);

	foreach ( $fields as $key => $field ) {
		list( $label, $type, $default ) = $field;

		$sanitize = 'sanitize_text_field';
		if ( 'email' === $type ) {
			$sanitize = 'sanitize_email';
		} elseif ( 'url' === $type ) {
			$sanitize = 'esc_url_raw';
		} elseif ( 'checkbox' === $type ) {
			$sanitize = 'epigenome_sanitize_checkbox';
		}

		$wp_customize->add_setting(
			'epigenome_' . $key,
			array(
				'default'           => $default,
				'sanitize_callback' => $sanitize,
			)
		);
		$wp_customize->add_control(
			'epigenome_' . $key,
			array(
				'label'   => $label,
				'section' => 'epigenome_listing',
				'type'    => $type,
			)
		);
	}
}
add_action( 'customize_register', 'epigenome_customize_register' );

/**
 * Checkbox sanitizer.
 *
 * @param mixed $value Raw value.
 * @return string
 */
function epigenome_sanitize_checkbox( $value ) {
	return ( ! empty( $value ) ) ? '1' : '';
}
