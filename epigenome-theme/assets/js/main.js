/* ==========================================================================
   EPIGENOME.COM — animation engine
   Lenis smooth scroll · GSAP ScrollTrigger · DNA helix canvas ·
   scramble labels · counters · magnetic buttons · tilt cards · cursor
   ========================================================================== */

(function () {
	'use strict';

	var docEl = document.documentElement;
	var reduceMotion =
		window.matchMedia &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var finePointer =
		window.matchMedia && window.matchMedia('(pointer: fine)').matches;

	/* If anything goes wrong, never leave content hidden. */
	function failSafe() {
		docEl.classList.remove('js-anim');
		var pre = document.getElementById('preloader');
		if (pre) {
			pre.style.display = 'none';
		}
	}

	/* ---------------------------------------------------------------------
	   Text splitting
	   --------------------------------------------------------------------- */
	function splitText(el, mode) {
		var text = el.textContent;
		el.setAttribute('aria-label', text);
		el.textContent = '';
		var frag = document.createDocumentFragment();
		var parts = mode === 'words' ? text.split(/(\s+)/) : text.split('');

		parts.forEach(function (part) {
			if (/^\s+$/.test(part)) {
				frag.appendChild(document.createTextNode(' '));
				return;
			}
			if (part === '') {
				return;
			}
			var mask = document.createElement('span');
			mask.className = 'char-mask';
			mask.setAttribute('aria-hidden', 'true');
			var inner = document.createElement('span');
			inner.className = mode === 'words' ? 'word' : 'char';
			inner.textContent = part === ' ' ? ' ' : part;
			mask.appendChild(inner);
			frag.appendChild(mask);
			if (mode === 'chars' && part === ' ') {
				frag.appendChild(document.createTextNode(' '));
			}
		});
		el.appendChild(frag);
		return el.querySelectorAll(mode === 'words' ? '.word' : '.char');
	}

	/* ---------------------------------------------------------------------
	   Gradient text across split chars.
	   background-clip:text on a parent doesn't reach into the overflow-
	   hidden char masks, so each char gets the gradient sized to the full
	   element and offset to its own position — then a shared shimmer loop
	   slides all of them together.
	   --------------------------------------------------------------------- */
	function gradientChars(el, chars, gradient) {
		var width = 1;

		function layout() {
			var elRect = el.getBoundingClientRect();
			width = Math.max(el.offsetWidth, 1);
			chars.forEach(function (c) {
				var off = c.getBoundingClientRect().left - elRect.left;
				c.setAttribute('data-goff', off);
				c.style.backgroundImage = gradient;
				c.style.backgroundSize = width + 'px 100%';
				c.style.backgroundRepeat = 'repeat-x';
				c.style.webkitBackgroundClip = 'text';
				c.style.backgroundClip = 'text';
				c.style.webkitTextFillColor = 'transparent';
				c.style.color = 'transparent';
			});
		}

		var proxy = { s: 0 };
		function paint() {
			var shift = proxy.s * width;
			chars.forEach(function (c) {
				c.style.backgroundPositionX =
					-(parseFloat(c.getAttribute('data-goff')) + shift) + 'px';
			});
		}

		layout();
		paint();
		gsap.to(proxy, {
			s: 1,
			duration: 9,
			ease: 'none',
			repeat: -1,
			onUpdate: paint
		});

		var resizeTimer;
		window.addEventListener('resize', function () {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(function () {
				layout();
				paint();
			}, 150);
		});
	}

	var GRADIENT_HERO =
		'linear-gradient(105deg, #f4f9ff 30%, #34e0c8 50%, #f4f9ff 62%, #a78bfa 88%)';
	var GRADIENT_GOLD =
		'linear-gradient(120deg, #f0cd8a, #e2b25f 45%, #fff2d9 60%, #e2b25f 80%)';

	/* Scale a nowrap headline down until it fits its container. */
	function fitText(el) {
		el.style.fontSize = '';
		var size = parseFloat(getComputedStyle(el).fontSize);
		if (el.scrollWidth > el.clientWidth && el.scrollWidth > 0) {
			el.style.fontSize =
				size * (el.clientWidth / el.scrollWidth) * 0.97 + 'px';
		}
	}

	/* ---------------------------------------------------------------------
	   Scramble — labels decode through DNA bases before resolving
	   --------------------------------------------------------------------- */
	var BASES = 'ACGTACGTacgt';

	function scramble(el, duration) {
		var original = el.getAttribute('data-original') || el.textContent;
		el.setAttribute('data-original', original);
		var start = null;
		duration = duration || 900;

		/* guarantee resolution even if rAF is throttled or interrupted */
		setTimeout(function () {
			el.textContent = original;
		}, duration + 300);

		function frame(now) {
			if (!start) {
				start = now;
			}
			var p = Math.min((now - start) / duration, 1);
			var out = '';
			for (var i = 0; i < original.length; i++) {
				var ch = original[i];
				if (!/[A-Za-z0-9]/.test(ch)) {
					out += ch;
				} else if (i / original.length < p) {
					out += ch;
				} else {
					out += BASES[(Math.random() * BASES.length) | 0];
				}
			}
			el.textContent = out;
			if (p < 1) {
				requestAnimationFrame(frame);
			} else {
				el.textContent = original;
			}
		}
		requestAnimationFrame(frame);
	}

	/* ---------------------------------------------------------------------
	   DNA helix canvas
	   --------------------------------------------------------------------- */
	function initHelix(canvas) {
		var ctx = canvas.getContext('2d');
		if (!ctx) {
			return;
		}
		var dpr = Math.min(window.devicePixelRatio || 1, 2);
		var w = 0;
		var h = 0;
		var time = 0;
		var velocityBoost = 0;
		var mouseX = 0.5;
		var mouseY = 0.5;
		var running = !reduceMotion;
		var ambient = [];

		function resize() {
			w = canvas.offsetWidth;
			h = canvas.offsetHeight;
			canvas.width = w * dpr;
			canvas.height = h * dpr;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			seedAmbient();
			if (!running) {
				draw();
			}
		}

		function seedAmbient() {
			ambient = [];
			var count = Math.round(Math.min(w / 28, 60));
			for (var i = 0; i < count; i++) {
				ambient.push({
					x: Math.random() * w,
					y: Math.random() * h,
					r: Math.random() * 1.6 + 0.4,
					s: Math.random() * 0.25 + 0.05,
					tw: Math.random() * Math.PI * 2
				});
			}
		}

		function strandColor(which, alpha) {
			return which === 0
				? 'rgba(52, 224, 200, ' + alpha + ')'
				: 'rgba(167, 139, 250, ' + alpha + ')';
		}

		function draw() {
			ctx.clearRect(0, 0, w, h);

			var cy = h * 0.52 + (mouseY - 0.5) * 26;
			var amp = Math.min(h * 0.17, 150);
			var step = 13;
			var freq = 0.012;
			var tilt = (mouseX - 0.5) * 0.55;

			/* ambient drifting particles */
			for (var a = 0; a < ambient.length; a++) {
				var pt = ambient[a];
				pt.y -= pt.s;
				pt.tw += 0.02;
				if (pt.y < -4) {
					pt.y = h + 4;
					pt.x = Math.random() * w;
				}
				ctx.beginPath();
				ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
				ctx.fillStyle =
					'rgba(234, 242, 251, ' +
					(0.05 + Math.abs(Math.sin(pt.tw)) * 0.1) +
					')';
				ctx.fill();
			}

			/* rungs first (behind strands) */
			var i;
			var phase;
			var y1;
			var y2;
			var depth;
			for (i = -20; i <= w + 20; i += step * 4) {
				phase = i * freq + time + tilt;
				y1 = cy + Math.sin(phase) * amp;
				y2 = cy + Math.sin(phase + Math.PI) * amp;
				depth = (Math.cos(phase) + 1) / 2;
				ctx.beginPath();
				ctx.moveTo(i, y1);
				ctx.lineTo(i, y2);
				ctx.strokeStyle =
					'rgba(234, 242, 251, ' + (0.03 + depth * 0.07) + ')';
				ctx.lineWidth = 1;
				ctx.stroke();
			}

			/* two strands of "nucleotide" dots */
			for (var s = 0; s < 2; s++) {
				for (i = -20; i <= w + 20; i += step) {
					phase = i * freq + time + tilt + s * Math.PI;
					var y = cy + Math.sin(phase) * amp;
					depth = (Math.cos(phase) + 1) / 2; /* 0 back — 1 front */
					var r = 1.1 + depth * 2.1;
					var alpha = 0.12 + depth * 0.55;

					/* halo */
					ctx.beginPath();
					ctx.arc(i, y, r * 2.6, 0, Math.PI * 2);
					ctx.fillStyle = strandColor(s, alpha * 0.16);
					ctx.fill();
					/* core */
					ctx.beginPath();
					ctx.arc(i, y, r, 0, Math.PI * 2);
					ctx.fillStyle = strandColor(s, alpha);
					ctx.fill();
				}
			}
		}

		function tick() {
			if (!running) {
				return;
			}
			time += 0.011 + velocityBoost;
			velocityBoost *= 0.92;
			draw();
			requestAnimationFrame(tick);
		}

		window.addEventListener('resize', resize);
		if (finePointer) {
			window.addEventListener('mousemove', function (e) {
				mouseX = e.clientX / window.innerWidth;
				mouseY = e.clientY / window.innerHeight;
			});
		}

		resize();
		if (running) {
			requestAnimationFrame(tick);
		} else {
			draw();
		}

		return {
			kick: function (v) {
				velocityBoost = Math.min(Math.abs(v) * 0.00035, 0.05);
			},
			pause: function () {
				running = false;
			},
			resume: function () {
				if (!running && !reduceMotion) {
					running = true;
					requestAnimationFrame(tick);
				}
			}
		};
	}

	/* ---------------------------------------------------------------------
	   Reduced-motion path: show everything, set final values, bail out
	   --------------------------------------------------------------------- */
	function finalizeStatic() {
		document.querySelectorAll('[data-counter]').forEach(function (el) {
			var target = parseFloat(el.getAttribute('data-counter')) || 0;
			var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
			el.textContent = target.toFixed(decimals);
		});
		var canvas = document.querySelector('[data-helix]');
		if (canvas) {
			initHelix(canvas); /* draws a single static frame */
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

		/* anchor links ride the smooth scroller */
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

		/* ---- helix ---- */
		var helix = null;
		var helixCanvas = document.querySelector('[data-helix]');
		if (helixCanvas) {
			helix = initHelix(helixCanvas);
			if (lenis && helix) {
				lenis.on('scroll', function (e) {
					helix.kick(e.velocity || 0);
				});
			}
			ScrollTrigger.create({
				trigger: '.hero',
				start: 'top bottom',
				end: 'bottom top',
				onEnter: function () { helix.resume(); },
				onEnterBack: function () { helix.resume(); },
				onLeave: function () { helix.pause(); },
				onLeaveBack: function () { helix.pause(); }
			});
		}

		/* ---- scroll progress bar ---- */
		var progressFill = document.querySelector('[data-progress]');
		if (progressFill) {
			ScrollTrigger.create({
				start: 0,
				end: function () {
					return ScrollTrigger.maxScroll(window);
				},
				onUpdate: function (self) {
					progressFill.style.transform = 'scaleX(' + self.progress + ')';
				}
			});
		}

		/* ---- nav hide / reveal ---- */
		var nav = document.querySelector('[data-nav]');
		if (nav) {
			var lastY = 0;
			ScrollTrigger.create({
				start: 0,
				end: 'max',
				onUpdate: function (self) {
					var y = self.scroll();
					if (y > 140 && y > lastY + 4) {
						nav.classList.add('nav--hidden');
					} else if (y < lastY - 4 || y <= 140) {
						nav.classList.remove('nav--hidden');
					}
					lastY = y;
				}
			});
		}

		/* ---- split headings ---- */
		var heroChars = null;
		var fitTargets = [];
		document.querySelectorAll('[data-chars]').forEach(function (el) {
			var chars = splitText(el, 'chars');
			if (el.classList.contains('hero__title')) {
				heroChars = chars;
				fitTargets.push(el);
				fitText(el);
				gradientChars(el, Array.prototype.slice.call(chars), GRADIENT_HERO);
				gsap.set(chars, { yPercent: 112 });
				return;
			}
			if (el.classList.contains('terms__price')) {
				fitTargets.push(el);
				fitText(el);
				gradientChars(el, Array.prototype.slice.call(chars), GRADIENT_GOLD);
			}
			gsap.set(chars, { yPercent: 112 });
			ScrollTrigger.create({
				trigger: el,
				start: 'top 86%',
				once: true,
				onEnter: function () {
					gsap.to(chars, {
						yPercent: 0,
						duration: 1.1,
						ease: 'power4.out',
						stagger: 0.03
					});
				}
			});
		});

		/* refit headlines on resize (before the gradient relayout at 150ms)
		   and once the display font finishes loading */
		var fitTimer;
		window.addEventListener('resize', function () {
			clearTimeout(fitTimer);
			fitTimer = setTimeout(function () {
				fitTargets.forEach(fitText);
			}, 100);
		});
		if (document.fonts && document.fonts.ready) {
			document.fonts.ready.then(function () {
				fitTargets.forEach(fitText);
				window.dispatchEvent(new Event('resize'));
				ScrollTrigger.refresh();
			});
		}

		document.querySelectorAll('[data-words]').forEach(function (el) {
			var words = splitText(el, 'words');
			gsap.set(words, { yPercent: 112 });
			ScrollTrigger.create({
				trigger: el,
				start: 'top 86%',
				once: true,
				onEnter: function () {
					gsap.to(words, {
						yPercent: 0,
						duration: 1,
						ease: 'power4.out',
						stagger: 0.06
					});
				}
			});
		});

		/* ---- generic reveals ---- */
		document.querySelectorAll('[data-reveal]').forEach(function (el) {
			var delay =
				parseFloat(getComputedStyle(el).getPropertyValue('--d')) || 0;
			gsap.fromTo(
				el,
				{ autoAlpha: 0, y: 36 },
				{
					autoAlpha: 1,
					y: 0,
					duration: 1,
					delay: delay,
					ease: 'power3.out',
					scrollTrigger: { trigger: el, start: 'top 87%', once: true }
				}
			);
		});

		/* ---- section rules ---- */
		document.querySelectorAll('.section__rule').forEach(function (el) {
			gsap.to(el, {
				scaleX: 1,
				duration: 1.3,
				ease: 'power3.inOut',
				scrollTrigger: { trigger: el, start: 'top 88%', once: true }
			});
		});

		/* ---- scramble labels ---- */
		document.querySelectorAll('[data-scramble]').forEach(function (el) {
			ScrollTrigger.create({
				trigger: el,
				start: 'top 90%',
				once: true,
				onEnter: function () {
					scramble(el, 950);
				}
			});
		});

		/* ---- counters ---- */
		document.querySelectorAll('[data-counter]').forEach(function (el) {
			var target = parseFloat(el.getAttribute('data-counter')) || 0;
			var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
			var duration = parseFloat(el.getAttribute('data-duration') || '2');
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
							el.textContent = state.v.toFixed(decimals);
						}
					});
				}
			});
		});

		/* ---- hero parallax ---- */
		if (helixCanvas) {
			gsap.to(helixCanvas, {
				yPercent: 18,
				ease: 'none',
				scrollTrigger: {
					trigger: '.hero',
					start: 'top top',
					end: 'bottom top',
					scrub: true
				}
			});
		}
		var heroInner = document.querySelector('.hero__inner');
		if (heroInner) {
			gsap.to(heroInner, {
				yPercent: -8,
				autoAlpha: 0.25,
				ease: 'none',
				scrollTrigger: {
					trigger: '.hero',
					start: 'top top',
					end: 'bottom 30%',
					scrub: true
				}
			});
		}

		/* ---- aurora drift ---- */
		gsap.utils.toArray('.aurora').forEach(function (el, i) {
			gsap.to(el, {
				xPercent: i % 2 ? -14 : 14,
				yPercent: i % 2 ? 10 : -10,
				scale: 1.15,
				duration: 16 + i * 5,
				ease: 'sine.inOut',
				yoyo: true,
				repeat: -1
			});
		});

		/* ---- marquee (GSAP-driven, reacts to scroll velocity) ---- */
		var track = document.querySelector('[data-marquee-track]');
		if (track) {
			track.style.animation = 'none';
			var loop = gsap.to(track, {
				xPercent: -50,
				duration: 26,
				ease: 'none',
				repeat: -1
			});
			if (lenis) {
				lenis.on('scroll', function (e) {
					var ts = 1 + Math.min(Math.abs(e.velocity || 0) / 60, 3);
					gsap.to(loop, {
						timeScale: ts,
						duration: 0.4,
						overwrite: true
					});
				});
			}
		}

		/* ---- tilt cards + pointer glow ---- */
		if (finePointer) {
			document.querySelectorAll('[data-tilt]').forEach(function (card) {
				var bounds = null;
				card.addEventListener('mouseenter', function () {
					bounds = card.getBoundingClientRect();
				});
				card.addEventListener('mousemove', function (e) {
					if (!bounds) {
						return;
					}
					var px = (e.clientX - bounds.left) / bounds.width;
					var py = (e.clientY - bounds.top) / bounds.height;
					card.style.setProperty('--mx', px * 100 + '%');
					card.style.setProperty('--my', py * 100 + '%');
					gsap.to(card, {
						rotateY: (px - 0.5) * 7,
						rotateX: (0.5 - py) * 7,
						transformPerspective: 700,
						duration: 0.45,
						ease: 'power2.out'
					});
				});
				card.addEventListener('mouseleave', function () {
					gsap.to(card, {
						rotateX: 0,
						rotateY: 0,
						duration: 0.7,
						ease: 'elastic.out(1, 0.55)'
					});
				});
			});

			/* ---- magnetic buttons ---- */
			document.querySelectorAll('[data-magnetic]').forEach(function (el) {
				var strength = 22;
				el.addEventListener('mousemove', function (e) {
					var b = el.getBoundingClientRect();
					var relX = e.clientX - b.left - b.width / 2;
					var relY = e.clientY - b.top - b.height / 2;
					gsap.to(el, {
						x: (relX / b.width) * strength,
						y: (relY / b.height) * strength,
						duration: 0.4,
						ease: 'power2.out'
					});
				});
				el.addEventListener('mouseleave', function () {
					gsap.to(el, {
						x: 0,
						y: 0,
						duration: 0.8,
						ease: 'elastic.out(1, 0.4)'
					});
				});
			});

			/* ---- custom cursor ---- */
			var dot = document.querySelector('[data-cursor-dot]');
			var ring = document.querySelector('[data-cursor-ring]');
			var cursorWrap = document.querySelector('.cursor');
			if (dot && ring && cursorWrap) {
				var ringX = gsap.quickTo(ring, 'x', {
					duration: 0.45,
					ease: 'power3.out'
				});
				var ringY = gsap.quickTo(ring, 'y', {
					duration: 0.45,
					ease: 'power3.out'
				});
				var dotX = gsap.quickTo(dot, 'x', {
					duration: 0.08,
					ease: 'power2.out'
				});
				var dotY = gsap.quickTo(dot, 'y', {
					duration: 0.08,
					ease: 'power2.out'
				});
				window.addEventListener('mousemove', function (e) {
					dotX(e.clientX);
					dotY(e.clientY);
					ringX(e.clientX);
					ringY(e.clientY);
				});
				document
					.querySelectorAll('a, button, [data-tilt], input, textarea')
					.forEach(function (el) {
						el.addEventListener('mouseenter', function () {
							cursorWrap.classList.add('cursor--active');
						});
						el.addEventListener('mouseleave', function () {
							cursorWrap.classList.remove('cursor--active');
						});
					});
			}
		}

		/* ---- offer form: pending state ---- */
		var offerForm = document.querySelector('.offer-form');
		if (offerForm) {
			offerForm.addEventListener('submit', function () {
				var btn = offerForm.querySelector('.offer-form__submit');
				if (btn) {
					btn.setAttribute('disabled', 'disabled');
					var label = btn.querySelector('.btn__label');
					if (label) {
						label.textContent = 'Sending…';
					}
				}
			});
		}

		/* ---- intro: preloader → hero ---- */
		var preloader = document.getElementById('preloader');
		var seen = false;
		try {
			seen = sessionStorage.getItem('epi_seen') === '1';
		} catch (err) {
			seen = false;
		}

		function heroIntro() {
			var tl = gsap.timeline();
			if (nav) {
				tl.from(nav, {
					yPercent: -160,
					autoAlpha: 0,
					duration: 1,
					ease: 'power3.out'
				});
			}
			if (heroChars) {
				tl.to(
					heroChars,
					{
						yPercent: 0,
						duration: 1.2,
						ease: 'power4.out',
						stagger: 0.035
					},
					0.15
				);
			}
			return tl;
		}

		if (preloader && !seen) {
			try {
				sessionStorage.setItem('epi_seen', '1');
			} catch (err) {
				/* private mode — fine */
			}
			var bar = preloader.querySelector('[data-preload-bar]');
			var count = preloader.querySelector('[data-preload-count]');
			var word = preloader.querySelector('[data-preload-word]');
			var progress = { v: 0 };

			var preTl = gsap.timeline({
				onComplete: function () {
					preloader.style.display = 'none';
					heroIntro();
				}
			});
			if (word) {
				preTl.from(word, {
					autoAlpha: 0,
					y: 24,
					duration: 0.7,
					ease: 'power3.out'
				});
			}
			preTl.to(
				progress,
				{
					v: 100,
					duration: 1.5,
					ease: 'power2.inOut',
					onUpdate: function () {
						if (bar) {
							bar.style.transform =
								'scaleX(' + progress.v / 100 + ')';
						}
						if (count) {
							count.textContent =
								(progress.v < 10 ? '0' : '') +
								Math.round(progress.v);
						}
					}
				},
				0.2
			);
			preTl.to(preloader, {
				yPercent: -100,
				duration: 0.9,
				ease: 'power4.inOut',
				delay: 0.15
			});
		} else {
			if (preloader) {
				preloader.style.display = 'none';
			}
			heroIntro();
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
