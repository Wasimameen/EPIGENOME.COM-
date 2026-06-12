/* ==========================================================================
   EPIGENOME.COM — paper edition motion
   Lenis smooth scroll · curtain preloader · masked line/char reveals ·
   rolling odometer price · velocity-skewed marquee · self-drawing thread ·
   full-page ink inversion at the terms · magnetic buttons · ink cursor
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
		var pre = document.getElementById('preloader');
		if (pre) {
			pre.style.display = 'none';
		}
	}

	/* ---------------------------------------------------------------------
	   Splitting
	   --------------------------------------------------------------------- */
	function splitChars(el) {
		var text = el.textContent;
		el.setAttribute('aria-label', text);
		el.textContent = '';
		var frag = document.createDocumentFragment();
		text.split('').forEach(function (ch) {
			if (ch === ' ') {
				frag.appendChild(document.createTextNode(' '));
				return;
			}
			var mask = document.createElement('span');
			mask.className = 'char-mask';
			mask.setAttribute('aria-hidden', 'true');
			var inner = document.createElement('span');
			inner.className = 'char';
			inner.textContent = ch;
			mask.appendChild(inner);
			frag.appendChild(mask);
		});
		el.appendChild(frag);
		return el.querySelectorAll('.char');
	}

	/* split into visual lines (words grouped by their offsetTop) */
	function splitLines(el) {
		var text = el.textContent;
		el.setAttribute('aria-label', text);
		el.textContent = '';
		var words = text.split(/\s+/);
		words.forEach(function (w, i) {
			var span = document.createElement('span');
			span.textContent = w;
			span.style.display = 'inline-block';
			el.appendChild(span);
			if (i < words.length - 1) {
				el.appendChild(document.createTextNode(' '));
			}
		});
		var lines = [];
		var lastTop = null;
		Array.prototype.forEach.call(el.children, function (span) {
			var top = span.offsetTop;
			if (top !== lastTop) {
				lines.push([]);
				lastTop = top;
			}
			lines[lines.length - 1].push(span);
		});
		el.textContent = '';
		var lineEls = [];
		lines.forEach(function (lineWords) {
			var mask = document.createElement('span');
			mask.className = 'line-mask';
			mask.setAttribute('aria-hidden', 'true');
			var line = document.createElement('span');
			line.className = 'line';
			line.textContent = lineWords.map(function (s) { return s.textContent; }).join(' ');
			mask.appendChild(line);
			el.appendChild(mask);
			lineEls.push(line);
		});
		return lineEls;
	}

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
	   Scramble — labels decode through DNA bases
	   --------------------------------------------------------------------- */
	var BASES = 'ACGTACGTacgt';

	function scramble(el, duration) {
		var original = el.getAttribute('data-original') || el.textContent;
		el.setAttribute('data-original', original);
		var start = null;
		duration = duration || 900;

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
			var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
			el.textContent = target.toFixed(decimals);
		});
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
				duration: 1.18,
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
				lenis.scrollTo(target, { offset: -70 });
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

		/* ---- progress hairline + waypoints fill ---- */
		var progressFill = document.querySelector('[data-progress]');
		var waypointFill = document.querySelector('[data-waypoint-fill]');
		ScrollTrigger.create({
			start: 0,
			end: function () {
				return ScrollTrigger.maxScroll(window);
			},
			onUpdate: function (self) {
				if (progressFill) {
					progressFill.style.transform = 'scaleX(' + self.progress + ')';
				}
				if (waypointFill) {
					waypointFill.style.transform = 'scaleY(' + self.progress + ')';
				}
			}
		});

		/* ---- waypoint current number ---- */
		var wpNow = document.querySelector('[data-waypoint-now]');
		if (wpNow) {
			document.querySelectorAll('[data-section]').forEach(function (sec) {
				ScrollTrigger.create({
					trigger: sec,
					start: 'top 55%',
					end: 'bottom 55%',
					onToggle: function (self) {
						if (self.isActive) {
							wpNow.textContent = sec.getAttribute('data-section');
						}
					}
				});
			});
		}

		/* ---- nav: solid after hero, hide on scroll down ---- */
		var nav = document.querySelector('[data-nav]');
		if (nav) {
			var lastY = 0;
			ScrollTrigger.create({
				start: 0,
				end: 'max',
				onUpdate: function (self) {
					var y = self.scroll();
					nav.classList.toggle('nav--solid', y > 40);
					if (y > 160 && y > lastY + 4) {
						nav.classList.add('nav--hidden');
					} else if (y < lastY - 4 || y <= 160) {
						nav.classList.remove('nav--hidden');
					}
					lastY = y;
				}
			});
		}

		/* ---- the ink inversion at the terms ---- */
		document.querySelectorAll('[data-invert]').forEach(function (sec) {
			ScrollTrigger.create({
				trigger: sec,
				start: 'top 62%',
				end: 'bottom 40%',
				onToggle: function (self) {
					docEl.classList.toggle('inverted', self.isActive);
				}
			});
		});

		/* ---- hero title ---- */
		var heroChars = null;
		var fitTargets = [];
		document.querySelectorAll('[data-chars]').forEach(function (el) {
			var chars = splitChars(el);
			if (el.classList.contains('hero__title')) {
				heroChars = chars;
				fitTargets.push(el);
				fitText(el);
				gsap.set(chars, { yPercent: 112 });
				return;
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
						stagger: 0.035
					});
				}
			});
		});

		/* ---- masked line reveals for titles ---- */
		document.querySelectorAll('[data-lines]').forEach(function (el) {
			var lines = splitLines(el);
			gsap.set(lines, { yPercent: 115 });
			ScrollTrigger.create({
				trigger: el,
				start: 'top 84%',
				once: true,
				onEnter: function () {
					gsap.to(lines, {
						yPercent: 0,
						duration: 1.2,
						ease: 'power4.out',
						stagger: 0.09
					});
				}
			});
		});

		/* refit headlines on resize and once fonts land */
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
				buildThread();
				ScrollTrigger.refresh();
			});
		}

		/* ---- generic reveals ---- */
		document.querySelectorAll('[data-reveal]').forEach(function (el) {
			gsap.fromTo(
				el,
				{ autoAlpha: 0, y: 28 },
				{
					autoAlpha: 1,
					y: 0,
					duration: 1,
					ease: 'power3.out',
					scrollTrigger: { trigger: el, start: 'top 88%', once: true }
				}
			);
		});

		/* ---- ledger rows wipe in ---- */
		document.querySelectorAll('[data-ledger]').forEach(function (row, i) {
			gsap.fromTo(
				row,
				{ autoAlpha: 0, x: -24 },
				{
					autoAlpha: 1,
					x: 0,
					duration: 0.9,
					delay: (i % 5) * 0.06,
					ease: 'power3.out',
					scrollTrigger: { trigger: row, start: 'top 90%', once: true }
				}
			);
		});

		/* ---- section rules draw ---- */
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
				start: 'top 92%',
				once: true,
				onEnter: function () {
					scramble(el, 900);
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

		/* ---- odometer price ---- */
		document.querySelectorAll('[data-odometer]').forEach(function (el) {
			var strips = buildOdometer(el);
			ScrollTrigger.create({
				trigger: el,
				start: 'top 78%',
				once: true,
				onEnter: function () {
					strips.forEach(function (s, i) {
						gsap.fromTo(
							s.strip,
							{ yPercent: 0 },
							{
								yPercent: -s.target * 10,
								duration: 1.7 + i * 0.1,
								ease: 'power4.inOut'
							}
						);
					});
				}
			});
		});

		/* ---- marquee: loop + velocity skew ---- */
		var track = document.querySelector('[data-marquee-track]');
		if (track) {
			track.style.animation = 'none';
			var loop = gsap.to(track, {
				xPercent: -50,
				duration: 28,
				ease: 'none',
				repeat: -1
			});
			var skewSetter = gsap.quickTo(track, 'skewX', {
				duration: 0.5,
				ease: 'power2.out'
			});
			if (lenis) {
				lenis.on('scroll', function (e) {
					var v = e.velocity || 0;
					gsap.to(loop, {
						timeScale: 1 + Math.min(Math.abs(v) / 60, 2.6),
						duration: 0.4,
						overwrite: true
					});
					skewSetter(gsap.utils.clamp(-8, 8, -v * 0.18));
				});
			}
		}

		/* ---- the thread: a line drawing itself down the page ---- */
		var threadSvg = document.querySelector('[data-thread]');
		var threadPath = document.querySelector('[data-thread-path]');
		var threadTrigger = null;

		function buildThread() {
			if (!threadSvg || !threadPath) {
				return;
			}
			if (window.innerWidth < 1024) {
				return;
			}
			var H = Math.max(
				document.documentElement.scrollHeight,
				document.body.scrollHeight
			);
			threadSvg.setAttribute('viewBox', '0 0 120 ' + H);
			threadSvg.style.height = H + 'px';
			var d = 'M 60 0';
			var y = 0;
			var px = 60;
			var left = true;
			var seg = 300;
			while (y + seg < H - 160) {
				var nx = left ? 16 : 104;
				var ny = y + seg;
				d += ' C ' + px + ' ' + (y + seg * 0.5) + ', ' + nx + ' ' + (ny - seg * 0.5) + ', ' + nx + ' ' + ny;
				px = nx;
				y = ny;
				left = !left;
			}
			d += ' C ' + px + ' ' + (y + 90) + ', 60 ' + (H - 70) + ', 60 ' + (H - 8);
			threadPath.setAttribute('d', d);
			var len = threadPath.getTotalLength();
			threadPath.style.strokeDasharray = len;
			threadPath.style.strokeDashoffset = len;
			if (threadTrigger) {
				threadTrigger.kill();
			}
			threadTrigger = ScrollTrigger.create({
				start: 0,
				end: 'max',
				onUpdate: function (self) {
					threadPath.style.strokeDashoffset =
						len * (1 - self.progress);
				}
			});
		}
		buildThread();
		var threadTimer;
		window.addEventListener('resize', function () {
			clearTimeout(threadTimer);
			threadTimer = setTimeout(buildThread, 200);
		});

		/* ---- magnetic + cursor ---- */
		if (finePointer) {
			document.querySelectorAll('[data-magnetic]').forEach(function (el) {
				var strength = 18;
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

			var dot = document.querySelector('[data-cursor-dot]');
			var ring = document.querySelector('[data-cursor-ring]');
			var cursorWrap = document.querySelector('.cursor');
			if (dot && ring && cursorWrap) {
				var ringX = gsap.quickTo(ring, 'x', { duration: 0.4, ease: 'power3.out' });
				var ringY = gsap.quickTo(ring, 'y', { duration: 0.4, ease: 'power3.out' });
				var dotX = gsap.quickTo(dot, 'x', { duration: 0.07, ease: 'power2.out' });
				var dotY = gsap.quickTo(dot, 'y', { duration: 0.07, ease: 'power2.out' });
				window.addEventListener('mousemove', function (e) {
					dotX(e.clientX);
					dotY(e.clientY);
					ringX(e.clientX);
					ringY(e.clientY);
				});
				document
					.querySelectorAll('a, button, input, textarea, .ledger__row')
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

		/* ---- offer form pending state ---- */
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

		/* ---- intro: curtain ---- */
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
					y: -16,
					autoAlpha: 0,
					duration: 0.9,
					ease: 'power3.out'
				});
			}
			if (heroChars) {
				tl.to(
					heroChars,
					{
						yPercent: 0,
						duration: 1.25,
						ease: 'power4.out',
						stagger: 0.04
					},
					0.1
				);
			}
			return tl;
		}

		if (preloader && !seen) {
			try {
				sessionStorage.setItem('epi_seen', '1');
			} catch (err) { /* private mode */ }
			var count = preloader.querySelector('[data-preload-count]');
			var word = preloader.querySelector('[data-preload-word]');
			var center = preloader.querySelector('.preloader__center');
			var top = preloader.querySelector('[data-curtain-top]');
			var bottom = preloader.querySelector('[data-curtain-bottom]');
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
					letterSpacing: '0.5em',
					duration: 0.9,
					ease: 'power3.out'
				});
			}
			preTl.to(
				progress,
				{
					v: 100,
					duration: 1.3,
					ease: 'power2.inOut',
					onUpdate: function () {
						if (count) {
							count.textContent = Math.round(progress.v);
						}
					}
				},
				0.15
			);
			preTl.to(center, { autoAlpha: 0, duration: 0.35, ease: 'power2.in' });
			preTl.to(top, { yPercent: -101, duration: 0.85, ease: 'power4.inOut' }, '<0.1');
			preTl.to(bottom, { yPercent: 101, duration: 0.85, ease: 'power4.inOut' }, '<');
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
