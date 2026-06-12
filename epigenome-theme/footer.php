<?php
/**
 * Footer.
 *
 * @package Epigenome
 */
?>
<footer class="footer">
	<div class="container footer__inner">
		<div class="footer__brand mono" data-scramble><?php echo esc_html( epigenome_opt( 'domain_name' ) ); ?></div>
		<div class="footer__meta">
			<span class="mono"><?php esc_html_e( 'Transfer via Escrow.com', 'epigenome' ); ?></span>
			<span class="footer__dot" aria-hidden="true"></span>
			<a class="footer__mail" href="mailto:<?php echo esc_attr( antispambot( epigenome_opt( 'contact_email' ) ) ); ?>"><?php echo esc_html( antispambot( epigenome_opt( 'contact_email' ) ) ); ?></a>
			<?php if ( epigenome_opt( 'contact_phone' ) ) : ?>
				<span class="footer__dot" aria-hidden="true"></span>
				<a class="footer__mail" href="tel:<?php echo esc_attr( preg_replace( '/[^0-9+]/', '', epigenome_opt( 'contact_phone' ) ) ); ?>"><?php echo esc_html( epigenome_opt( 'contact_phone' ) ); ?></a>
			<?php endif; ?>
		</div>
		<div class="footer__legal mono">&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> · <?php echo esc_html( epigenome_opt( 'broker_name' ) ); ?> · <?php esc_html_e( 'Serious inquiries only', 'epigenome' ); ?></div>
	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
