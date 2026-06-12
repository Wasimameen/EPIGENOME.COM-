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
* Contact email         — where the offer form delivers (defaults to admin email)
* Contact phone         — optional, shown in the footer
* Buy Now link          — your Escrow.com / Afternic / Dan checkout link;
                          when empty, Buy Now buttons open a pre-filled email
* Seller / broker name and affiliation
* Listing label         — the small "N° 01 — 2026" kicker in the hero

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

== The monument scene ==

The page floats over a scroll-driven Three.js journey: across a green
marble plain, through a monumental gateway, down a colonnade, beneath a
floating DNA-helix sculpture, through a gold ring, and up the grand
stairs to a temple where a gold diamond burns beside the asking price.
The camera position is tied to scroll progress; mouse movement adds a
gentle parallax.

== Performance / motion notes ==

* GSAP 3.13, ScrollTrigger, Lenis and Three.js r149 are bundled locally
  (no CDN dependency).
* Fonts load from Google Fonts (Bodoni Moda, Inter, IBM Plex Mono).
* The 3D scene drops detail on small screens, pauses in background tabs,
  and disappears gracefully when WebGL is unavailable (solid green
  backdrop remains).
* All animation respects prefers-reduced-motion: users who ask for less
  motion get an instant, fully readable page with a still scene frame.
* The intro preloader plays once per browser session.

== Credits ==

* GSAP & ScrollTrigger — gsap.com (standard "no charge" license)
* Three.js — threejs.org (MIT)
* Lenis smooth scroll — MIT, darkroom.engineering
* Fonts — Google Fonts (OFL)
