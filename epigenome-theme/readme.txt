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

== The night-city scene ==

The page floats over a scroll-driven Three.js flight above a futuristic
Manhattan at night. The hero looks straight down on thousands of
instanced towers with lit windows; scrolling dives the camera into the
street canyons, where it swings left and right between buildings —
banking into every turn — past neon EPIGENOME.COM billboards, animated
avenue traffic and blinking rooftop beacons, then climbs to the crown
of the tallest tower, where a holographic DNA helix rotates around a
gold diamond beside the asking price. Mouse movement adds parallax.

Cinematic realism stack: per-floor window lighting baked into the
facades (lit floors in runs, dark after-hours floors, glowing lobbies,
dark mechanical tops), stepped setbacks and rooftop penthouses,
image-based sky reflections on glass towers and rain-slick streets, a
gradient sky dome, sweeping searchlights, blinking aircraft, and an
UnrealBloom post-processing pass with gamma-corrected output (desktop
only). Add ?epi_quality=low to the address to force the lighter
mobile-grade scene on any device.

== Performance / motion notes ==

* GSAP 3.13, ScrollTrigger, Lenis, Three.js r147 and its bloom
  post-processing passes are bundled locally
  (no CDN dependency).
* Fonts are self-hosted in the theme (Cinzel, Cormorant Garamond, Inter,
  IBM Plex Mono) — no Google Fonts request, GDPR-friendly.
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
* Fonts — Cinzel, Cormorant Garamond, Inter, IBM Plex Mono (OFL, self-hosted)
