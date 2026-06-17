=== Epigenome — Premium Domain Listing ===
Contributors: tommccarthy
Requires at least: 6.0
Tested up to: 6.8
Requires PHP: 7.4
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

A cinematic, fully animated one-page landing theme built to sell EPIGENOME.COM.

== Installation ==

1. In WordPress admin go to Appearance → Themes → Add New Theme → Upload Theme.
2. Upload epigenome-theme.zip and click Install Now, then Activate.
3. That's it — the landing page renders on every front-end route, so no page
   setup is needed. (Setting a static front page is optional and changes nothing.)

== Configure the listing ==

Everything sale-related is under Appearance → Customize → Domain Listing:

* Domain name           — default EPIGENOME.COM
* Asking price          — default $14,888 (shown in nav, hero, comps verdict, terms)
* Lease-to-own          — optional checkbox + monthly figure; when enabled the
                          Terms section shows the dual lump-sum / monthly frame
* Contact email         — shown on the left of the top bar, and where the offer
                          form delivers (defaults to admin email)
* Contact phone         — shown on the left of the top bar and in the footer
* Top bar location       — right side of the top bar (e.g. "Worldwide · remote
                          transfer"); leave blank to hide
* Top bar availability   — right side of the top bar (e.g. "Available — replies
                          same day"); leave blank to hide
* Buy Now link          — your Escrow.com / Afternic / Dan checkout link;
                          when empty, Buy Now buttons open a pre-filled email
* Seller / broker name and affiliation
* Listing label         — the small "N° 01 — 2026" kicker in the hero

The top contact bar sits above the navigation: email and phone on the left,
availability and location on the right. It slides up out of the way as you
scroll down and returns at the top of the page. Any field left blank in the
Customizer is simply omitted, and its divider with it.

== Things you should edit before going live ==

* PROVENANCE (section N° 01): the copy ships with a deliberately general
  account of the name's history. Replace it with the real story — registration
  year, holder profile, why it is available now. Edit front-page.php.
* COMPARABLE SALES (section N° 03): the four comps (Insurance.com $35.6M,
  Voice.com $30M, HealthInsurance.com $8.13M, Medicare.com $4.8M) are
  widely reported public sales. Verify, reorder or swap them in the
  $epigenome_comps array at the top of front-page.php. Keep every figure at
  or above your asking price.

== Offer form delivery ==

The form posts through WordPress (admin-post.php) and emails the address set
in the Customizer using wp_mail. On shared hosts wp_mail can land in spam —
installing any SMTP plugin (e.g. WP Mail SMTP) fixes deliverability. A spam
honeypot is built in. Every submission also shows the buyer your direct email
as a fallback.

== Design & motion ==

Studio look: a dark top contact bar, silver stage, heavy black wordmark,
white pill nav, lime highlights, dark feature band and offer card, dotted
detailing.

The top contact bar fades in on load with a pulsing "available" indicator,
then tucks away as you scroll and slides back at the top. A slim lime
reading-progress line tracks how far down the page you are.

The hero centerpiece is a real-time 3D orb (Three.js): a glossy green
liquid core that morphs smoothly, wrapped in a chrome shell with thin
orbit wires, lit by a studio environment and a slow-drifting aurora glow.
It follows the mouse with gentle parallax, floats at idle, pauses
off-screen and renders a still frame for reduced-motion users. Lenis
smooth scrolling, soft reveals, animated counters, a rolling odometer
price and magnetic buttons complete the motion. All of it respects
prefers-reduced-motion.

== Performance / motion notes ==

* GSAP 3.13, ScrollTrigger, Lenis and Three.js r147 are bundled
  locally (no CDN dependency).
* Fonts are self-hosted in the theme (Cinzel, Cormorant Garamond, Inter,
  IBM Plex Mono) — no Google Fonts request, GDPR-friendly.
* All animation respects prefers-reduced-motion: users who ask for less
  motion get an instant, fully readable page.
* The intro preloader plays once per browser session.

== Credits ==

* GSAP & ScrollTrigger — gsap.com (standard "no charge" license)
* Lenis smooth scroll — MIT, darkroom.engineering
* Fonts — Archivo, Inter, IBM Plex Mono (OFL, self-hosted; Cinzel and
  Cormorant Garamond files remain bundled but unused)
* Three.js — threejs.org (MIT)
