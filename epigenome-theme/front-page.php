<?php
/**
 * The landing page. Section order mirrors the reference listing:
 * hero → provenance → the word → comparable sales → what it becomes
 * → terms → broker → offer form.
 *
 * @package Epigenome
 */

get_header();

$domain  = epigenome_opt( 'domain_name' );
$price   = epigenome_opt( 'price' );
$broker  = epigenome_opt( 'broker_name' );
$org     = epigenome_opt( 'broker_org' );
$first   = trim( strtok( $broker, ' ' ) );

/*
 * Comparable sales. EDIT HERE — keep every figure at or above the asking
 * price, name the sale, and let the reader do the multiple themselves.
 */
$epigenome_comps = array(
	array(
		'name'  => 'Insurance.com',
		'price' => '$35,600,000',
		'year'  => '2010',
		'note'  => 'The category noun for an industry. Still the benchmark for exact-match .com sales.',
	),
	array(
		'name'  => 'Voice.com',
		'price' => '$30,000,000',
		'year'  => '2019',
		'note'  => 'One word, one technology wave. Bought before the category finished forming.',
	),
	array(
		'name'  => 'HealthInsurance.com',
		'price' => '$8,130,000',
		'year'  => '2019',
		'note'  => 'The exact phrase a buyer types when they mean the category. Health DNA, like this name.',
	),
	array(
		'name'  => 'Medicare.com',
		'price' => '$4,800,000',
		'year'  => '2014',
		'note'  => 'A single health term, acquired by an operator who built on it for a decade.',
	),
);
?>

<main id="main" class="site-main">

	<!-- ============================== HERO ============================== -->
	<section class="hero" id="top" data-section="01">
		<div class="hero__film" aria-hidden="true">
			<video class="hero__film-video" data-bgfilm autoplay muted loop playsinline preload="auto" poster="<?php echo esc_url( get_template_directory_uri() . '/assets/video/flight-poster.jpg' ); ?>">
				<source src="<?php echo esc_url( get_template_directory_uri() . '/assets/video/flight.mp4' ); ?>" type="video/mp4">
			</video>
			<div class="hero__film-shade"></div>
		</div>
		<div class="hero__hud mono" aria-hidden="true">
			<span class="hero__hud-corner hero__hud-corner--tl"></span>
			<span class="hero__hud-corner hero__hud-corner--tr"></span>
			<span class="hero__hud-corner hero__hud-corner--bl"></span>
			<span class="hero__hud-corner hero__hud-corner--br"></span>
			<span class="hero__hud-read" data-hud-read>ALT 14888 · HDG 042 · THE CATEGORY NAME</span>
		</div>
		<div class="container hero__inner">
			<p class="kicker mono" data-scramble><?php echo esc_html( __( 'Private listing', 'epigenome' ) . ' · ' . epigenome_opt( 'listing_no' ) ); ?></p>

			<h1 class="hero__title" data-chars aria-label="<?php echo esc_attr( $domain ); ?>"><?php echo esc_html( $domain ); ?></h1>

			<div class="hero__row" data-reveal>
				<p class="hero__sub">
					<?php esc_html_e( 'Above the genome sits the layer that decides which genes speak. The science is called epigenomics. This is its name — and for the first time, it is for sale.', 'epigenome' ); ?>
				</p>
				<div class="hero__cta">
					<a class="btn btn--ink" href="<?php echo esc_url( epigenome_buy_url() ); ?>" data-magnetic>
						<span class="btn__label"><?php echo esc_html__( 'Buy Now', 'epigenome' ) . ' — ' . esc_html( $price ); ?></span>
						<span class="btn__arrow" aria-hidden="true">&rarr;</span>
					</a>
					<a class="btn btn--line" href="#offer" data-magnetic>
						<span class="btn__label"><?php esc_html_e( 'Make an Offer', 'epigenome' ); ?></span>
						<span class="btn__arrow" aria-hidden="true">&rarr;</span>
					</a>
				</div>
			</div>

			<p class="hero__note mono" data-reveal><?php esc_html_e( 'Seller-authorized · Transfer in days via Escrow.com', 'epigenome' ); ?></p>
		</div>

		<a class="hero__scroll mono" href="#provenance" aria-label="<?php esc_attr_e( 'Scroll to the listing', 'epigenome' ); ?>">
			<span class="hero__scroll-line" aria-hidden="true"></span>
			<?php esc_html_e( 'Read the listing', 'epigenome' ); ?>
		</a>
	</section>

	<!-- ============================ MARQUEE ============================= -->
	<div class="marquee" aria-hidden="true" data-marquee>
		<div class="marquee__track" data-marquee-track>
			<?php for ( $i = 0; $i < 4; $i++ ) : ?>
				<span class="marquee__item"><?php echo esc_html( $domain ); ?></span>
				<span class="marquee__sep" aria-hidden="true"></span>
				<span class="marquee__item marquee__item--outline"><?php esc_html_e( 'The category name', 'epigenome' ); ?></span>
				<span class="marquee__sep" aria-hidden="true"></span>
			<?php endfor; ?>
		</div>
	</div>

	<!-- ========================== 01 PROVENANCE ========================= -->
	<section class="section" id="provenance" data-section="02">
		<div class="container">
			<header class="section__head" data-reveal>
				<span class="section__no mono" data-scramble>N&deg; 01</span>
				<span class="section__rule" aria-hidden="true"></span>
				<span class="section__label mono"><?php esc_html_e( 'Provenance', 'epigenome' ); ?></span>
			</header>

			<h2 class="section__title" data-lines><?php esc_html_e( 'Why this name is available at all', 'epigenome' ); ?></h2>

			<div class="prose prose--lead" data-reveal>
				<p><?php echo esc_html( sprintf( __( 'I don\'t write a page for every domain that crosses my desk. Most don\'t earn one. %s does, and the reason is simple: it is the one-word name of an entire scientific category, and names like that change hands once.', 'epigenome' ), $domain ) ); ?></p>
				<p><?php esc_html_e( 'This name has been held privately through the entire genomics build-out — through the sequencing boom, through the first epigenetic therapies reaching patients, through every cycle in which a buyer might have pried it loose. It was never developed, never flipped, never listed. The reason it is on the market now is not timing or trend. It is a specific change in the holder\'s situation, and I would rather walk you through it on a call than flatten it into a paragraph.', 'epigenome' ); ?></p>
				<p><?php esc_html_e( 'What I can put in writing: the seller has authorized one open listing, through me, at a number I considered defensible before I agreed to represent it.', 'epigenome' ); ?></p>
			</div>
		</div>
	</section>

	<!-- ============================ 02 THE WORD ========================== -->
	<section class="section" id="word" data-section="03">
		<div class="container">
			<header class="section__head" data-reveal>
				<span class="section__no mono" data-scramble>N&deg; 02</span>
				<span class="section__rule" aria-hidden="true"></span>
				<span class="section__label mono"><?php esc_html_e( 'The word', 'epigenome' ); ?></span>
			</header>

			<h2 class="section__title" data-lines><?php esc_html_e( 'The category is named after it', 'epigenome' ); ?></h2>

			<div class="prose" data-reveal>
				<p><?php esc_html_e( 'The genome was the last century\'s map. The epigenome is this century\'s control panel — the chemical layer that decides which genes are expressed, silenced or amplified. Drug programs, diagnostics, sequencing platforms and longevity clinics are converging on the same vocabulary, and the vocabulary converges on one word.', 'epigenome' ); ?></p>
				<p><?php esc_html_e( 'Type the science into any search engine, any grant database, any regulatory filing. The word is epigenome. There is exactly one .com that is the word itself, with nothing added and nothing to explain.', 'epigenome' ); ?></p>
			</div>

			<div class="word-break">
				<div class="word-break__row" data-reveal>
					<span class="word-break__part" data-chars>EPI</span>
					<span class="word-break__def mono"><?php esc_html_e( 'Greek — “above, upon”', 'epigenome' ); ?></span>
				</div>
				<div class="word-break__row" data-reveal>
					<span class="word-break__part word-break__part--dim" data-chars>GENOME</span>
					<span class="word-break__def mono"><?php esc_html_e( 'the complete set of DNA', 'epigenome' ); ?></span>
				</div>
				<div class="word-break__result" data-reveal>
					<span class="mono">=</span>
					<p><?php esc_html_e( '“The layer above the genome.” The name explains itself in one beat — no tagline required.', 'epigenome' ); ?></p>
				</div>
			</div>

			<div class="stats" role="list">
				<div class="stat" role="listitem" data-reveal>
					<span class="stat__value"><span data-counter="9" data-duration="1.4">0</span></span>
					<span class="stat__label mono"><?php esc_html_e( 'letters', 'epigenome' ); ?></span>
				</div>
				<div class="stat" role="listitem" data-reveal>
					<span class="stat__value"><span data-counter="1" data-duration="1.4">0</span></span>
					<span class="stat__label mono"><?php esc_html_e( 'word, exactly', 'epigenome' ); ?></span>
				</div>
				<div class="stat" role="listitem" data-reveal>
					<span class="stat__value"><span data-counter="0" data-duration="1.4">0</span></span>
					<span class="stat__label mono"><?php esc_html_e( 'hyphens, digits, compromises', 'epigenome' ); ?></span>
				</div>
				<div class="stat" role="listitem" data-reveal>
					<span class="stat__value">.com</span>
					<span class="stat__label mono"><?php esc_html_e( 'the only extension that needs no defense', 'epigenome' ); ?></span>
				</div>
			</div>
		</div>
	</section>

	<!-- ======================= 03 COMPARABLE SALES ====================== -->
	<section class="section" id="comps" data-section="04">
		<div class="container">
			<header class="section__head" data-reveal>
				<span class="section__no mono" data-scramble>N&deg; 03</span>
				<span class="section__rule" aria-hidden="true"></span>
				<span class="section__label mono"><?php esc_html_e( 'Comparable sales', 'epigenome' ); ?></span>
			</header>

			<h2 class="section__title" data-lines><?php esc_html_e( 'What category names trade for', 'epigenome' ); ?></h2>

			<div class="prose" data-reveal>
				<p><?php esc_html_e( 'Brokers say “category-defining” the way realtors say “charming.” I\'ll use the phrase once, and then show you the math instead. Below are disclosed, lump-sum sales of names that are — or contain — the exact word for their category.', 'epigenome' ); ?></p>
			</div>

			<div class="comps-pin" data-comps-pin>
			<div class="ledger comps-rail" role="list" data-comps-rail>
				<?php foreach ( $epigenome_comps as $i => $comp ) : ?>
					<div class="ledger__row" role="listitem" data-ledger>
						<span class="ledger__index mono">0<?php echo esc_html( $i + 1 ); ?></span>
						<span class="ledger__name"><?php echo esc_html( $comp['name'] ); ?></span>
						<span class="ledger__note"><?php echo esc_html( $comp['note'] ); ?></span>
						<span class="ledger__year mono"><?php echo esc_html( $comp['year'] ); ?></span>
						<span class="ledger__price"><?php echo esc_html( $comp['price'] ); ?></span>
					</div>
				<?php endforeach; ?>
				<div class="ledger__row ledger__row--this" data-ledger>
					<span class="ledger__index mono" aria-hidden="true">&rarr;</span>
					<span class="ledger__name"><?php echo esc_html( $domain ); ?></span>
					<span class="ledger__note"><?php esc_html_e( 'The entire category in one word. The comp set establishes a floor, not a ceiling.', 'epigenome' ); ?></span>
					<span class="ledger__year mono"><?php esc_html_e( 'now', 'epigenome' ); ?></span>
					<span class="ledger__price"><?php echo esc_html( $price ); ?></span>
				</div>
			</div>
			</div>

			<p class="comps__footnote mono" data-reveal><?php esc_html_e( 'All comparable figures are public, disclosed lump-sum sales. Do the multiple yourself. Scroll — the ledger rides sideways.', 'epigenome' ); ?></p>
		</div>
	</section>

	<!-- ======================= 04 WHAT IT BECOMES ======================= -->
	<section class="section" id="becomes" data-section="05">
		<div class="container">
			<header class="section__head" data-reveal>
				<span class="section__no mono" data-scramble>N&deg; 04</span>
				<span class="section__rule" aria-hidden="true"></span>
				<span class="section__label mono"><?php esc_html_e( 'What it becomes', 'epigenome' ); ?></span>
			</header>

			<h2 class="section__title" data-lines><?php esc_html_e( 'You are not buying a domain', 'epigenome' ); ?></h2>

			<div class="prose" data-reveal>
				<p><?php echo esc_html( sprintf( __( '%s is not nine letters and an extension. It is what owning the category\'s name makes possible — and what not owning it costs, quietly, every year a competitor holds it instead.', 'epigenome' ), $domain ) ); ?></p>
			</div>

			<figure class="film" data-reveal>
				<video class="film__video" autoplay muted loop playsinline preload="metadata" poster="<?php echo esc_url( get_template_directory_uri() . '/assets/video/flight-poster.jpg' ); ?>">
					<source src="<?php echo esc_url( get_template_directory_uri() . '/assets/video/flight.mp4' ); ?>" type="video/mp4">
				</video>
				<figcaption class="film__cap mono">
					<span><?php esc_html_e( 'Flight film — the name at altitude', 'epigenome' ); ?></span>
					<span><?php echo esc_html( $domain ); ?></span>
				</figcaption>
			</figure>

			<div class="scenes">
				<article class="scene" data-reveal>
					<span class="scene__no mono" data-scramble>SCENE — A</span>
					<h3 class="scene__title"><?php esc_html_e( 'The first slide', 'epigenome' ); ?></h3>
					<p><?php esc_html_e( 'The partners open your deck. The name is the category, so the first thirty seconds of credibility work are already done before anyone speaks. The meeting starts ahead of where it would have — every meeting does, for the next twenty years.', 'epigenome' ); ?></p>
				</article>
				<article class="scene" data-reveal>
					<span class="scene__no mono" data-scramble>SCENE — B</span>
					<h3 class="scene__title"><?php esc_html_e( 'The press release', 'epigenome' ); ?></h3>
					<p><?php esc_html_e( 'The headline writes itself, because the name is the noun the journalist was going to use anyway. Your competitor\'s announcement needs a second line to explain what they do. Yours doesn\'t.', 'epigenome' ); ?></p>
				</article>
				<article class="scene" data-reveal>
					<span class="scene__no mono" data-scramble>SCENE — C</span>
					<h3 class="scene__title"><?php esc_html_e( 'The call you receive', 'epigenome' ); ?></h3>
					<p><?php esc_html_e( 'Five years from now, the category leader\'s counsel asks what it would take to get the name from you. The answer is a number with more zeros than this page — and the leverage runs in your direction, permanently.', 'epigenome' ); ?></p>
				</article>
			</div>
		</div>
	</section>

	<!-- ============================ 05 TERMS ============================ -->
	<section class="section section--terms" id="terms" data-section="06" data-invert>
		<div class="container">
			<header class="section__head" data-reveal>
				<span class="section__no mono" data-scramble>N&deg; 05</span>
				<span class="section__rule" aria-hidden="true"></span>
				<span class="section__label mono"><?php esc_html_e( 'Terms', 'epigenome' ); ?></span>
			</header>

			<div class="terms__price" data-odometer aria-label="<?php echo esc_attr( $price ); ?>"><?php echo esc_html( $price ); ?></div>
			<p class="terms__currency mono" data-reveal><?php esc_html_e( 'USD · lump sum · full ownership', 'epigenome' ); ?></p>

			<div class="prose prose--center" data-reveal>
				<p><?php esc_html_e( 'One number, no auction theater. The transfer runs through Escrow.com: funds are held by a licensed third party and release only after the name is in your account — typically within days. No recurring fees, no renewal traps, nothing left to negotiate except whether you want it.', 'epigenome' ); ?></p>
				<?php if ( epigenome_opt( 'lto_enabled' ) ) : ?>
					<p><?php echo esc_html( sprintf( __( 'The seller has also approved monthly terms: own the category name from %1$s while you build the company that earns it, with the %2$s lump sum as the ceiling the comps above are measured against. The monthly figure is the access path, not the market value — the two travel together.', 'epigenome' ), epigenome_opt( 'lto_monthly' ), $price ) ); ?></p>
				<?php endif; ?>
			</div>

			<div class="terms__cta" data-reveal>
				<a class="btn btn--ink btn--lg" href="<?php echo esc_url( epigenome_buy_url() ); ?>" data-magnetic>
					<span class="btn__label"><?php echo esc_html__( 'Buy Now', 'epigenome' ) . ' — ' . esc_html( $price ); ?></span>
					<span class="btn__arrow" aria-hidden="true">&rarr;</span>
				</a>
				<a class="btn btn--line btn--lg" href="#offer" data-magnetic>
					<span class="btn__label"><?php esc_html_e( 'Make an Offer', 'epigenome' ); ?></span>
					<span class="btn__arrow" aria-hidden="true">&rarr;</span>
				</a>
			</div>
		</div>
	</section>

	<!-- =========================== 06 THE BROKER ======================== -->
	<section class="section" id="broker" data-section="07">
		<div class="container">
			<header class="section__head" data-reveal>
				<span class="section__no mono" data-scramble>N&deg; 06</span>
				<span class="section__rule" aria-hidden="true"></span>
				<span class="section__label mono"><?php esc_html_e( 'The broker', 'epigenome' ); ?></span>
			</header>

			<div class="broker__grid">
				<div class="broker__body">
					<h2 class="section__title section__title--sm" data-lines><?php echo esc_html( sprintf( __( 'Listed by %s', 'epigenome' ), $broker ) ); ?></h2>
					<div class="prose" data-reveal>
						<p><?php echo esc_html( sprintf( __( 'I broker ultra-premium names at %s. A handful cross that desk in a given year; fewer earn a page like this one. I have been wrong about a name before — it has been a while.', 'epigenome' ), $org ) ); ?></p>
						<p><?php esc_html_e( 'If you operate in genomics, diagnostics, therapeutics or longevity, you already know why the word matters. My job is simpler: tell you it is available, show you the math, and get out of the way of your decision.', 'epigenome' ); ?></p>
					</div>
					<p class="broker__sig" data-reveal><span class="broker__sig-name"><?php echo esc_html( $broker ); ?></span><span class="mono broker__sig-org"><?php echo esc_html( $org ); ?></span></p>
				</div>
			</div>
		</div>
	</section>

	<!-- ============================ 07 OFFER ============================ -->
	<section class="section section--offer" id="offer" data-section="07">
		<div class="container">
			<header class="section__head" data-reveal>
				<span class="section__no mono" data-scramble>N&deg; 07</span>
				<span class="section__rule" aria-hidden="true"></span>
				<span class="section__label mono"><?php esc_html_e( 'Make your offer', 'epigenome' ); ?></span>
			</header>

			<div class="offer">
				<div class="offer__copy">
					<h2 class="section__title" data-lines><?php esc_html_e( 'Fifteen minutes, this week or next', 'epigenome' ); ?></h2>
					<div class="prose" data-reveal>
						<p><?php esc_html_e( 'If the name is on your radar, the most efficient next step is a fifteen-minute call. I\'ll walk you through the full comp set, the seller\'s position, and where I think this lands in the next ninety days. You decide from there.', 'epigenome' ); ?></p>
						<p><?php esc_html_e( 'Written offers work too — the form routes directly to me, and I answer the serious ones the same day.', 'epigenome' ); ?></p>
					</div>
					<p class="offer__sig" data-reveal>
						<span class="offer__sig-dash" aria-hidden="true">&mdash;</span>
						<span><?php echo esc_html( $broker ); ?><span class="mono offer__sig-org"> · <?php echo esc_html( $org ); ?></span></span>
					</p>
				</div>

				<div class="offer__form-wrap" data-reveal>
					<?php if ( isset( $_GET['offer'] ) && 'sent' === $_GET['offer'] ) : // phpcs:ignore WordPress.Security.NonceVerification.Recommended ?>
						<div class="form-status form-status--ok" role="status"><?php echo esc_html( sprintf( __( 'Received. %s will reply to the address you left — usually the same day.', 'epigenome' ), $first ) ); ?></div>
					<?php elseif ( isset( $_GET['offer'] ) && 'error' === $_GET['offer'] ) : // phpcs:ignore WordPress.Security.NonceVerification.Recommended ?>
						<div class="form-status form-status--err" role="alert"><?php esc_html_e( 'Something was missing — name, a valid email and an offer amount are required.', 'epigenome' ); ?></div>
					<?php endif; ?>

					<form class="offer-form" method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
						<input type="hidden" name="action" value="epigenome_offer">
						<?php wp_nonce_field( 'epigenome_offer', 'epigenome_offer_nonce' ); ?>
						<p class="hp-field" aria-hidden="true"><label>Company website<input type="text" name="company_website" tabindex="-1" autocomplete="off"></label></p>

						<div class="field">
							<label class="mono" for="offer_name"><?php esc_html_e( 'Name', 'epigenome' ); ?></label>
							<input type="text" id="offer_name" name="offer_name" required autocomplete="name">
						</div>
						<div class="field">
							<label class="mono" for="offer_email"><?php esc_html_e( 'Email', 'epigenome' ); ?></label>
							<input type="email" id="offer_email" name="offer_email" required autocomplete="email">
						</div>
						<div class="field">
							<label class="mono" for="offer_company"><?php esc_html_e( 'Company or product', 'epigenome' ); ?></label>
							<input type="text" id="offer_company" name="offer_company" autocomplete="organization">
						</div>
						<div class="field">
							<label class="mono" for="offer_amount"><?php esc_html_e( 'Offer (USD)', 'epigenome' ); ?></label>
							<input type="text" id="offer_amount" name="offer_amount" required inputmode="numeric" placeholder="<?php echo esc_attr( $price ); ?>">
						</div>
						<div class="field field--full">
							<label class="mono" for="offer_message"><?php esc_html_e( 'Message (optional)', 'epigenome' ); ?></label>
							<textarea id="offer_message" name="offer_message" rows="4"></textarea>
						</div>
						<button type="submit" class="btn btn--ink btn--lg offer-form__submit" data-magnetic>
							<span class="btn__label"><?php echo esc_html( sprintf( __( 'Send Offer to %s', 'epigenome' ), $first ) ); ?></span>
							<span class="btn__arrow" aria-hidden="true">&rarr;</span>
						</button>
						<p class="offer-form__direct mono">
							<?php esc_html_e( 'Prefer email?', 'epigenome' ); ?>
							<a href="mailto:<?php echo esc_attr( antispambot( epigenome_opt( 'contact_email' ) ) ); ?>"><?php echo esc_html( antispambot( epigenome_opt( 'contact_email' ) ) ); ?></a>
						</p>
					</form>
				</div>
			</div>
		</div>
	</section>

</main>

<?php
get_footer();
