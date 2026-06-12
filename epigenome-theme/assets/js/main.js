/* ==========================================================================
   EPIGENOME.COM — studio edition motion
   Lenis smooth scroll · soft reveals · counters · rolling odometer price ·
   magnetic buttons · pill-nav behavior · hero word fit and parallax
   ========================================================================== */

(function () {
	'use strict';

	var docEl = document.documentElement;
	var reduceMotion =
		window.matchMedia &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var finePointer =
		window.matchMedia && window.matchMedia('(pointer: fine)').matches;

	function failSafe() {
		docEl.classList.remove('js-anim');
	}

	/* Scale a nowrap headline down until it fits its container. */
	function fitText(el) {
		el.style.fontSize = '';
		var size = parseFloat(getComputedStyle(el).fontSize);
		var avail = el.parentElement.clientWidth * 0.94;
		if (el.scrollWidth > avail && el.scrollWidth > 0) {
			el.style.fontSize = size * (avail / el.scrollWidth) + 'px';
		}
	}

	/* ---------------------------------------------------------------------
	   Odometer — every digit rolls to its place
	   --------------------------------------------------------------------- */
	function buildOdometer(el) {
		var text = el.textContent;
		el.textContent = '';
		var strips = [];
		text.split('').forEach(function (ch) {
			if (/[0-9]/.test(ch)) {
				var odo = document.createElement('span');
				odo.className = 'odo';
				odo.setAttribute('aria-hidden', 'true');
				var strip = document.createElement('span');
				strip.className = 'odo__strip';
				for (var d = 0; d <= 9; d++) {
					var cell = document.createElement('span');
					cell.textContent = String(d);
					strip.appendChild(cell);
				}
				odo.appendChild(strip);
				el.appendChild(odo);
				strips.push({ strip: strip, target: parseInt(ch, 10) });
			} else {
				var plain = document.createElement('span');
				plain.textContent = ch;
				plain.setAttribute('aria-hidden', 'true');
				el.appendChild(plain);
			}
		});
		return strips;
	}

	/* ---------------------------------------------------------------------
	   Reduced-motion path
	   --------------------------------------------------------------------- */
	function finalizeStatic() {
		document.querySelectorAll('[data-counter]').forEach(function (el) {
			var target = parseFloat(el.getAttribute('data-counter')) || 0;
			el.textContent = target.toFixed(0);
		});
		var word = document.querySelector('[data-fit]');
		if (word) {
			fitText(word);
		}
	}

	/* ---------------------------------------------------------------------
	   Boot
	   --------------------------------------------------------------------- */
	function boot() {
		if (reduceMotion || typeof gsap === 'undefined') {
			if (typeof gsap === 'undefined') {
				failSafe();
			}
			finalizeStatic();
			return;
		}

		gsap.registerPlugin(ScrollTrigger);

		/* ---- smooth scroll ---- */
		var lenis = null;
		var LenisCtor = window.Lenis;
		if (LenisCtor) {
			lenis = new LenisCtor({
				duration: 1.15,
				easing: function (t) {
					return Math.min(1, 1.001 - Math.pow(2, -10 * t));
				}
			});
			lenis.on('scroll', ScrollTrigger.update);
			gsap.ticker.add(function (t) {
				lenis.raf(t * 1000);
			});
			gsap.ticker.lagSmoothing(0);
		}

		function scrollTo(target) {
			if (lenis) {
				lenis.scrollTo(target, { offset: -90 });
			} else if (typeof target !== 'number') {
				target.scrollIntoView({ behavior: 'smooth' });
			}
		}
		document.querySelectorAll('a[href^="#"]').forEach(function (link) {
			link.addEventListener('click', function (e) {
				var id = link.getAttribute('href');
				if (id.length < 2) {
					return;
				}
				var target = document.querySelector(id);
				if (target) {
					e.preventDefault();
					scrollTo(target);
				}
			});
		});

		/* ---- nav hide on scroll down ---- */
		var nav = document.querySelector('[data-nav]');
		if (nav) {
			var lastY = 0;
			ScrollTrigger.create({
				start: 0,
				end: 'max',
				onUpdate: function (self) {
					var y = self.scroll();
					if (y > 220 && y > lastY + 5) {
						nav.classList.add('nav--hidden');
					} else if (y < lastY - 5 || y <= 220) {
						nav.classList.remove('nav--hidden');
					}
					lastY = y;
				}
			});
		}

		/* ---- hero word: fit, fade in, gentle parallax ---- */
		var word = document.querySelector('[data-fit]');
		if (word) {
			fitText(word);
			gsap.fromTo(word,
				{ autoAlpha: 0, y: 26, scale: 0.985 },
				{ autoAlpha: 1, y: 0, scale: 1, duration: 1.3, ease: 'power3.out', delay: 0.15 });
			gsap.to(word, {
				yPercent: -16,
				ease: 'none',
				scrollTrigger: {
					trigger: '.hero',
					start: 'top top',
					end: 'bottom top',
					scrub: 0.8
				}
			});
			var fitTimer;
			window.addEventListener('resize', function () {
				clearTimeout(fitTimer);
				fitTimer = setTimeout(function () { fitText(word); }, 120);
			});
			if (document.fonts && document.fonts.ready) {
				document.fonts.ready.then(function () {
					fitText(word);
					ScrollTrigger.refresh();
				});
			}
		}

		/* ---- generic reveals ---- */
		document.querySelectorAll('[data-reveal]').forEach(function (el) {
			gsap.fromTo(
				el,
				{ autoAlpha: 0, y: 30 },
				{
					autoAlpha: 1,
					y: 0,
					duration: 1,
					ease: 'power3.out',
					scrollTrigger: { trigger: el, start: 'top 88%', once: true }
				}
			);
		});

		/* ---- counters ---- */
		document.querySelectorAll('[data-counter]').forEach(function (el) {
			var target = parseFloat(el.getAttribute('data-counter')) || 0;
			var duration = parseFloat(el.getAttribute('data-duration') || '1.6');
			var state = { v: 0 };
			ScrollTrigger.create({
				trigger: el,
				start: 'top 88%',
				once: true,
				onEnter: function () {
					gsap.to(state, {
						v: target,
						duration: duration,
						ease: 'power2.out',
						onUpdate: function () {
							el.textContent = Math.round(state.v);
						}
					});
				}
			});
		});

		/* ---- odometer price ---- */
		document.querySelectorAll('[data-odometer]').forEach(function (el) {
			var strips = buildOdometer(el);
			ScrollTrigger.create({
				trigger: el,
				start: 'top 80%',
				once: true,
				onEnter: function () {
					strips.forEach(function (s, i) {
						gsap.fromTo(
							s.strip,
							{ yPercent: 0 },
							{
								yPercent: -s.target * 10,
								duration: 1.6 + i * 0.1,
								ease: 'power4.inOut'
							}
						);
					});
				}
			});
		});

		/* ---- magnetic buttons ---- */
		if (finePointer) {
			document.querySelectorAll('[data-magnetic]').forEach(function (el) {
				var strength = 16;
				el.addEventListener('mousemove', function (e) {
					var b = el.getBoundingClientRect();
					gsap.to(el, {
						x: ((e.clientX - b.left - b.width / 2) / b.width) * strength,
						y: ((e.clientY - b.top - b.height / 2) / b.height) * strength,
						duration: 0.4,
						ease: 'power2.out'
					});
				});
				el.addEventListener('mouseleave', function () {
					gsap.to(el, {
						x: 0,
						y: 0,
						duration: 0.7,
						ease: 'elastic.out(1, 0.45)'
					});
				});
			});
		}

		/* ---- offer form pending state ---- */
		var offerForm = document.querySelector('.offer-form');
		if (offerForm) {
			offerForm.addEventListener('submit', function () {
				var btn = offerForm.querySelector('.offer-form__submit');
				if (btn) {
					btn.setAttribute('disabled', 'disabled');
					var label = btn.querySelector('span');
					if (label) {
						label.textContent = 'Sending…';
					}
				}
			});
		}
	}

	try {
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', function () {
				try {
					boot();
				} catch (err) {
					failSafe();
				}
			});
		} else {
			boot();
		}
	} catch (err) {
		failSafe();
	}
})();
