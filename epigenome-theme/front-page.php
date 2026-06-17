<?php
/**
 * The landing page — studio cut: silver stage, orb hero, dark feature
 * band, then the listing (provenance → word → comps → becomes → terms
 * → broker → offer).
 *
 * @package Epigenome
 */

get_header();

$domain  = epigenome_opt( 'domain_name' );
$price   = epigenome_opt( 'price' );
$broker  = epigenome_opt( 'broker_name' );
$org     = epigenome_opt( 'broker_org' );
$first   = trim( strtok( $broker, ' ' ) );
$word    = trim( strtok( $domain, '.' ) );

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
	<section class="hero" id="top">
		<div class="hero__stage">
			<div class="hero__aurora" aria-hidden="true"></div>
			<h1 class="hero__word" data-fit aria-label="<?php echo esc_attr( $domain ); ?>"><?php echo esc_html( $word ); ?><span class="hero__word-dot">.</span></h1>

			<div class="hero__orb">
				<canvas id="orb" aria-hidden="true"></canvas>
			</div>

			<div class="hero__meta hero__meta--left" data-reveal>
				<div class="hero__chips" aria-hidden="true">
					<span class="chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M8 3c4 3 4 7 0 9 4 2 4 6 0 9M16 3c-4 3-4 7 0 9-4 2-4 6 0 9"/></svg></span>
					<span class="chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c3 2.5 3 13.5 0 16M12 4c-3 2.5-3 13.5 0 16"/></svg></span>
					<span class="chip chip--lime"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
				</div>
				<div class="hero__meta-big"><?php echo esc_html( epigenome_opt( 'listing_no' ) ); ?></div>
				<div class="hero__meta-small"><?php esc_html_e( 'Private listing — seller authorized', 'epigenome' ); ?></div>
			</div>

			<div class="hero__meta hero__meta--right" data-reveal>
				<div class="hero__index">
					<span><?php esc_html_e( 'One word', 'epigenome' ); ?><em>/01</em></span>
					<span><?php esc_html_e( 'Exact category', 'epigenome' ); ?><em>/02</em></span>
					<span><?php esc_html_e( 'Dot com', 'epigenome' ); ?><em>/03</em></span>
				</div>
			</div>

			<div class="hero__meta hero__meta--tagline" data-reveal>
				<p><?php esc_html_e( 'The name that keeps your story straight — above the genome, ahead of the market.', 'epigenome' ); ?></p>
				<span class="dotted" aria-hidden="true"></span>
			</div>

			<a class="hero__go" href="#provenance" data-magnetic>
				<span class="hero__go-icon" aria-hidden="true">&#9654;</span>
				<span><?php esc_html_e( 'Read the listing', 'epigenome' ); ?></span>
			</a>
		</div>
	</section>

	<!-- ======================== DARK FEATURE BAND ======================= -->
	<section class="band" id="band">
		<div class="container">
			<h2 class="band__title" data-lines-safe>
				<?php esc_html_e( 'All the must-haves of a', 'epigenome' ); ?><br>
				<span class="hl"><?php esc_html_e( 'category name.', 'epigenome' ); ?></span>
			</h2>

			<div class="band__cards">
				<article class="bcard" data-reveal>
					<div class="bcard__chips"><span class="bchip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 3v18M5 8l7-5 7 5M7 21V10M17 21V10"/></svg></span></div>
					<h3><?php esc_html_e( 'Held, never flipped', 'epigenome' ); ?></h3>
					<p class="dotted-text"><?php esc_html_e( 'Privately held through the entire genomics build-out. One open listing, through one broker.', 'epigenome' ); ?></p>
				</article>
				<article class="bcard" data-reveal>
					<div class="bcard__chips"><span class="bchip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 19V5M4 19h16M8 15l4-6 4 3 4-7"/></svg></span></div>
					<h3><?php esc_html_e( 'Comps in the millions', 'epigenome' ); ?></h3>
					<p class="dotted-text"><?php esc_html_e( 'Disclosed category-name sales cluster between $4.8M and $35.6M. Do the multiple yourself.', 'epigenome' ); ?></p>
				</article>
				<article class="bcard" data-reveal>
					<div class="bcard__chips"><span class="bchip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M8 3c4 3 4 7 0 9 4 2 4 6 0 9M16 3c-4 3-4 7 0 9-4 2-4 6 0 9M9 6.5h6M9 17.5h6"/></svg></span></div>
					<h3><?php esc_html_e( 'The word itself', 'epigenome' ); ?></h3>
					<p class="dotted-text"><?php esc_html_e( 'Epi — “above.” Genome — the code. The science is converging on one word, and this is its .com.', 'epigenome' ); ?></p>
				</article>
				<article class="bcard" data-reveal>
					<div class="bcard__chips"><span class="bchip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M8 8V6a4 4 0 0 1 8 0v2M12 13v3"/></svg></span></div>
					<h3><?php esc_html_e( 'Escrow in days', 'epigenome' ); ?></h3>
					<p class="dotted-text"><?php esc_html_e( 'Funds held by a licensed third party, released only after the name is in your account.', 'epigenome' ); ?></p>
				</article>
			</div>
		</div>
	</section>

	<!-- ========================== 01 PROVENANCE ========================= -->
	<section class="section" id="provenance">
		<div class="container">
			<header class="section__head" data-reveal>
				<span class="tag">N&deg; 01 &mdash; <?php esc_html_e( 'Provenance', 'epigenome' ); ?></span>
			</header>
			<h2 class="section__title" data-reveal><?php esc_html_e( 'Why this name is available at all', 'epigenome' ); ?></h2>

			<div class="prose prose--lead" data-reveal>
				<p><?php echo esc_html( sprintf( __( 'I don\'t write a page for every domain that crosses my desk. Most don\'t earn one. %s does, and the reason is simple: it is the one-word name of an entire scientific category, and names like that change hands once.', 'epigenome' ), $domain ) ); ?></p>
				<p><?php esc_html_e( 'This name has been held privately through the entire genomics build-out — through the sequencing boom, through the first epigenetic therapies reaching patients, through every cycle in which a buyer might have pried it loose. It was never developed, never flipped, never listed. The reason it is on the market now is not timing or trend. It is a specific change in the holder\'s situation, and I would rather walk you through it on a call than flatten it into a paragraph.', 'epigenome' ); ?></p>
				<p><?php esc_html_e( 'What I can put in writing: the seller has authorized one open listing, through me, at a number I considered defensible before I agreed to represent it.', 'epigenome' ); ?></p>
			</div>
		</div>
	</section>

	<!-- ============================ 02 THE WORD ========================== -->
	<section class="section section--tint" id="word">
		<div class="container">
			<header class="section__head" data-reveal>
				<span class="tag">N&deg; 02 &mdash; <?php esc_html_e( 'The word', 'epigenome' ); ?></span>
			</header>
			<h2 class="section__title" data-reveal><?php esc_html_e( 'The category is named after it', 'epigenome' ); ?></h2>

			<div class="prose" data-reveal>
				<p><?php esc_html_e( 'The genome was the last century\'s map. The epigenome is this century\'s control panel — the chemical layer that decides which genes are expressed, silenced or amplified. Drug programs, diagnostics, sequencing platforms and longevity clinics are converging on the same vocabulary, and the vocabulary converges on one word.', 'epigenome' ); ?></p>
				<p><?php esc_html_e( 'Type the science into any search engine, any grant database, any regulatory filing. The word is epigenome. There is exactly one .com that is the word itself, with nothing added and nothing to explain.', 'epigenome' ); ?></p>
			</div>

			<div class="stats">
				<div class="stat" data-reveal>
					<span class="stat__value"><span data-counter="9" data-duration="1.4">0</span></span>
					<span class="stat__label dotted-text"><?php esc_html_e( 'letters', 'epigenome' ); ?></span>
				</div>
				<div class="stat" data-reveal>
					<span class="stat__value"><span data-counter="1" data-duration="1.4">0</span></span>
					<span class="stat__label dotted-text"><?php esc_html_e( 'word, exactly', 'epigenome' ); ?></span>
				</div>
				<div class="stat" data-reveal>
					<span class="stat__value"><span data-counter="0" data-duration="1.4">0</span></span>
					<span class="stat__label dotted-text"><?php esc_html_e( 'hyphens, digits, compromises', 'epigenome' ); ?></span>
				</div>
				<div class="stat" data-reveal>
					<span class="stat__value">.com</span>
					<span class="stat__label dotted-text"><?php esc_html_e( 'needs no defense', 'epigenome' ); ?></span>
				</div>
			</div>
		</div>
	</section>

	<!-- ======================= 03 COMPARABLE SALES ====================== -->
	<section class="section" id="comps">
		<div class="container">
			<header class="section__head" data-reveal>
				<span class="tag">N&deg; 03 &mdash; <?php esc_html_e( 'Comparable sales', 'epigenome' ); ?></span>
			</header>
			<h2 class="section__title" data-reveal><?php esc_html_e( 'What category names trade for', 'epigenome' ); ?></h2>

			<div class="prose" data-reveal>
				<p><?php esc_html_e( 'Brokers say “category-defining” the way realtors say “charming.” I\'ll use the phrase once, and then show you the math instead. Below are disclosed, lump-sum sales of names that are — or contain — the exact word for their category.', 'epigenome' ); ?></p>
			</div>

			<div class="ledger" role="list">
				<?php foreach ( $epigenome_comps as $i => $comp ) : ?>
					<div class="ledger__row" role="listitem" data-reveal>
						<span class="ledger__index">0<?php echo esc_html( $i + 1 ); ?></span>
						<span class="ledger__name"><?php echo esc_html( $comp['name'] ); ?></span>
						<span class="ledger__note"><?php echo esc_html( $comp['note'] ); ?></span>
						<span class="ledger__year"><?php echo esc_html( $comp['year'] ); ?></span>
						<span class="ledger__price"><?php echo esc_html( $comp['price'] ); ?></span>
					</div>
				<?php endforeach; ?>
				<div class="ledger__row ledger__row--this" data-reveal>
					<span class="ledger__index" aria-hidden="true">&rarr;</span>
					<span class="ledger__name"><?php echo esc_html( $domain ); ?></span>
					<span class="ledger__note"><?php esc_html_e( 'The entire category in one word. The comp set establishes a floor, not a ceiling.', 'epigenome' ); ?></span>
					<span class="ledger__year"><?php esc_html_e( 'now', 'epigenome' ); ?></span>
					<span class="ledger__price"><?php echo esc_html( $price ); ?></span>
				</div>
			</div>
		</div>
	</section>

	<!-- ======================= 04 WHAT IT BECOMES ======================= -->
	<section class="section section--tint" id="becomes">
		<div class="container">
			<header class="section__head" data-reveal>
				<span class="tag">N&deg; 04 &mdash; <?php esc_html_e( 'What it becomes', 'epigenome' ); ?></span>
			</header>
			<h2 class="section__title" data-reveal><?php esc_html_e( 'You are not buying a domain', 'epigenome' ); ?></h2>

			<div class="prose" data-reveal>
				<p><?php echo esc_html( sprintf( __( '%s is not nine letters and an extension. It is what owning the category\'s name makes possible — and what not owning it costs, quietly, every year a competitor holds it instead.', 'epigenome' ), $domain ) ); ?></p>
			</div>

			<div class="scenes">
				<article class="scene" data-reveal>
					<span class="scene__no">A</span>
					<h3 class="scene__title"><?php esc_html_e( 'The first slide', 'epigenome' ); ?></h3>
					<p class="dotted-text"><?php esc_html_e( 'The partners open your deck. The name is the category, so the first thirty seconds of credibility work are already done before anyone speaks. The meeting starts ahead of where it would have — every meeting does, for the next twenty years.', 'epigenome' ); ?></p>
				</article>
				<article class="scene" data-reveal>
					<span class="scene__no">B</span>
					<h3 class="scene__title"><?php esc_html_e( 'The press release', 'epigenome' ); ?></h3>
					<p class="dotted-text"><?php esc_html_e( 'The headline writes itself, because the name is the noun the journalist was going to use anyway. Your competitor\'s announcement needs a second line to explain what they do. Yours doesn\'t.', 'epigenome' ); ?></p>
				</article>
				<article class="scene" data-reveal>
					<span class="scene__no">C</span>
					<h3 class="scene__title"><?php esc_html_e( 'The call you receive', 'epigenome' ); ?></h3>
					<p class="dotted-text"><?php esc_html_e( 'Five years from now, the category leader\'s counsel asks what it would take to get the name from you. The answer is a number with more zeros than this page — and the leverage runs in your direction, permanently.', 'epigenome' ); ?></p>
				</article>
			</div>
		</div>
	</section>

	<!-- ============================ 05 TERMS ============================ -->
	<section class="section section--terms" id="terms">
		<div class="container">
			<header class="section__head section__head--center" data-reveal>
				<span class="tag">N&deg; 05 &mdash; <?php esc_html_e( 'Terms', 'epigenome' ); ?></span>
			</header>

			<div class="terms__price" data-odometer aria-label="<?php echo esc_attr( $price ); ?>"><?php echo esc_html( $price ); ?></div>
			<p class="terms__sub" data-reveal><span class="hl hl--sm"><?php esc_html_e( 'USD · lump sum · full ownership', 'epigenome' ); ?></span></p>

			<div class="prose prose--center" data-reveal>
				<p><?php esc_html_e( 'One number, no auction theater. The transfer runs through Escrow.com: funds are held by a licensed third party and release only after the name is in your account — typically within days. No recurring fees, no renewal traps, nothing left to negotiate except whether you want it.', 'epigenome' ); ?></p>
				<?php if ( epigenome_opt( 'lto_enabled' ) ) : ?>
					<p><?php echo esc_html( sprintf( __( 'The seller has also approved monthly terms: own the category name from %1$s while you build the company that earns it, with the %2$s lump sum as the ceiling the comps above are measured against. The monthly figure is the access path, not the market value — the two travel together.', 'epigenome' ), epigenome_opt( 'lto_monthly' ), $price ) ); ?></p>
				<?php endif; ?>
			</div>

			<div class="terms__cta" data-reveal>
				<a class="btn btn--dark btn--lg" href="<?php echo esc_url( epigenome_buy_url() ); ?>" data-magnetic>
					<span><?php echo esc_html__( 'Buy Now', 'epigenome' ) . ' — ' . esc_html( $price ); ?></span>
					<span class="btn__arrow" aria-hidden="true">&rarr;</span>
				</a>
				<a class="btn btn--line btn--lg" href="#offer" data-magnetic>
					<span><?php esc_html_e( 'Make an Offer', 'epigenome' ); ?></span>
					<span class="btn__arrow" aria-hidden="true">&rarr;</span>
				</a>
			</div>
		</div>
	</section>

	<!-- =========================== 06 THE BROKER ======================== -->
	<section class="section section--tint" id="broker">
		<div class="container">
			<header class="section__head" data-reveal>
				<span class="tag">N&deg; 06 &mdash; <?php esc_html_e( 'The broker', 'epigenome' ); ?></span>
			</header>
			<h2 class="section__title" data-reveal><?php echo esc_html( sprintf( __( 'Listed by %s', 'epigenome' ), $broker ) ); ?></h2>
			<div class="prose" data-reveal>
				<p><?php echo esc_html( sprintf( __( 'I broker ultra-premium names at %s. A handful cross that desk in a given year; fewer earn a page like this one. I have been wrong about a name before — it has been a while.', 'epigenome' ), $org ) ); ?></p>
				<p><?php esc_html_e( 'If you operate in genomics, diagnostics, therapeutics or longevity, you already know why the word matters. My job is simpler: tell you it is available, show you the math, and get out of the way of your decision.', 'epigenome' ); ?></p>
			</div>
			<p class="broker__sig" data-reveal><span class="broker__sig-name"><?php echo esc_html( $broker ); ?></span><span class="broker__sig-org"><?php echo esc_html( $org ); ?></span></p>
		</div>
	</section>

	<!-- ============================ 07 OFFER ============================ -->
	<section class="section section--offer" id="offer">
		<div class="container">
			<div class="offer">
				<div class="offer__copy">
					<span class="tag tag--light" data-reveal>N&deg; 07 &mdash; <?php esc_html_e( 'Make your offer', 'epigenome' ); ?></span>
					<h2 class="offer__title" data-reveal>
						<?php esc_html_e( 'Fifteen minutes,', 'epigenome' ); ?><br>
						<span class="hl"><?php esc_html_e( 'this week or next.', 'epigenome' ); ?></span>
					</h2>
					<div class="prose prose--ondark" data-reveal>
						<p><?php esc_html_e( 'If the name is on your radar, the most efficient next step is a fifteen-minute call. I\'ll walk you through the full comp set, the seller\'s position, and where I think this lands in the next ninety days. You decide from there.', 'epigenome' ); ?></p>
						<p><?php esc_html_e( 'Written offers work too — the form routes directly to me, and I answer the serious ones the same day.', 'epigenome' ); ?></p>
					</div>
					<p class="offer__sig" data-reveal>&mdash; <?php echo esc_html( $broker ); ?> · <?php echo esc_html( $org ); ?></p>
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
							<label for="offer_name"><?php esc_html_e( 'Name', 'epigenome' ); ?></label>
							<input type="text" id="offer_name" name="offer_name" required autocomplete="name">
						</div>
						<div class="field">
							<label for="offer_email"><?php esc_html_e( 'Email', 'epigenome' ); ?></label>
							<input type="email" id="offer_email" name="offer_email" required autocomplete="email">
						</div>
						<div class="field">
							<label for="offer_company"><?php esc_html_e( 'Company or product', 'epigenome' ); ?></label>
							<input type="text" id="offer_company" name="offer_company" autocomplete="organization">
						</div>
						<div class="field">
							<label for="offer_amount"><?php esc_html_e( 'Offer (USD)', 'epigenome' ); ?></label>
							<input type="text" id="offer_amount" name="offer_amount" required inputmode="numeric" placeholder="<?php echo esc_attr( $price ); ?>">
						</div>
						<div class="field field--full">
							<label for="offer_message"><?php esc_html_e( 'Message (optional)', 'epigenome' ); ?></label>
							<textarea id="offer_message" name="offer_message" rows="4"></textarea>
						</div>
						<button type="submit" class="btn btn--lime btn--lg offer-form__submit" data-magnetic>
							<span><?php echo esc_html( sprintf( __( 'Send Offer to %s', 'epigenome' ), $first ) ); ?></span>
							<span class="btn__arrow" aria-hidden="true">&rarr;</span>
						</button>
						<p class="offer-form__direct">
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
