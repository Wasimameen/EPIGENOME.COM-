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
				ScrollTrigger.refresh();
				if (typeof buildFlight === 'function') {
					buildFlight();
				}
				if (typeof placeDecor === 'function') {
					placeDecor();
				}
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

		/* ---- the sky: a detailed aircraft flying the page on scroll ---- */
		var flightSvg = document.querySelector('[data-flight]');
		var routePath = document.querySelector('[data-route]');
		var trailPath = document.querySelector('[data-trail]');
		var planeEl = document.querySelector('[data-plane]');
		var planeFlip = document.querySelector('[data-plane-flip]');
		var planeBob = document.querySelector('[data-plane-bob]');
		var propEl = document.querySelector('[data-prop]');
		var speedEl = document.querySelector('[data-speed]');
		var flightLen = 0;
		var planeTargetP = 0;
		var planeP = 0;
		var planeW = 0;
		var planeH = 0;
		var flipped = false;
		var propTween = null;

		function buildFlight() {
			if (!flightSvg || !routePath || !trailPath || !planeEl) {
				return;
			}
			var W = window.innerWidth;
			var H = Math.max(
				document.documentElement.scrollHeight,
				document.body.scrollHeight
			);
			var sky = document.querySelector('[data-sky]');
			if (sky) { sky.style.height = H + 'px'; }
			flightSvg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
			flightSvg.style.height = H + 'px';

			/* gentle rightward sweeps: the plane exits one side and re-enters
			   on the other, a little lower — tangents never go steep */
			var vh = window.innerHeight;
			var off = 170;
			var y = vh * 0.8;
			var drop = vh * 0.92;
			var d = '';
			while (y < H - vh * 0.35) {
				var y2 = Math.min(y + drop * 0.55, H - vh * 0.3);
				var wave = 30 + Math.random() * 30;
				d += ' M ' + (-off) + ' ' + y +
					' C ' + (W * 0.3) + ' ' + (y + wave) +
					', ' + (W * 0.62) + ' ' + (y2 - wave) +
					', ' + (W + off) + ' ' + y2;
				y = y2 + drop * 0.45;
			}

			routePath.setAttribute('d', d);
			trailPath.setAttribute('d', d);
			flightLen = trailPath.getTotalLength();
			trailPath.style.strokeDasharray = flightLen;
			trailPath.style.strokeDashoffset = flightLen * (1 - planeP);

			var rect = planeEl.getBoundingClientRect();
			planeW = rect.width;
			planeH = rect.height;
		}

		function placePlane(p) {
			if (!flightLen || !planeEl) {
				return;
			}
			var lenAt = flightLen * p;
			var pt = trailPath.getPointAtLength(lenAt);
			var ahead = trailPath.getPointAtLength(Math.min(lenAt + 22, flightLen));
			var behind = trailPath.getPointAtLength(Math.max(lenAt - 22, 0));
			var dx = ahead.x - behind.x;
			var dy = ahead.y - behind.y;
			var deg = (Math.atan2(dy, dx) * 180) / Math.PI;
			/* hysteresis keeps the flip from fluttering near vertical */
			var wantFlip = flipped
				? Math.abs(deg) > 80
				: Math.abs(deg) > 100;
			if (wantFlip !== flipped) {
				flipped = wantFlip;
				gsap.to(planeFlip, {
					scaleX: flipped ? -1 : 1,
					duration: 0.45,
					ease: 'power2.inOut',
					transformOrigin: '50% 50%'
				});
			}
			if (flipped) {
				deg = deg > 0 ? deg - 180 : deg + 180;
				deg = -deg;
			}
			deg = gsap.utils.clamp(-32, 32, deg);
			gsap.set(planeEl, {
				x: pt.x - planeW / 2,
				y: pt.y - planeH / 2,
				rotation: (flipped ? -deg : deg),
				transformOrigin: '50% 50%'
			});
			trailPath.style.strokeDashoffset = flightLen * (1 - p);
		}

		if (planeEl && flightSvg) {
			buildFlight();
			ScrollTrigger.create({
				start: 0,
				end: 'max',
				onUpdate: function (self) {
					planeTargetP = self.progress;
				}
			});
			gsap.ticker.add(function () {
				planeP += (planeTargetP - planeP) * 0.07;
				placePlane(Math.min(Math.max(planeP, 0), 1));
			});
			/* idle bob + the propeller never stops */
			if (planeBob) {
				gsap.to(planeBob, {
					y: 5,
					duration: 1.8,
					ease: 'sine.inOut',
					yoyo: true,
					repeat: -1
				});
			}
			if (propEl) {
				propTween = gsap.to(propEl, {
					rotation: 360,
					duration: 0.5,
					ease: 'none',
					repeat: -1,
					svgOrigin: '55 -1'
				});
			}
			if (lenis && speedEl) {
				var speedTo = gsap.quickTo(speedEl, 'opacity', {
					duration: 0.5,
					ease: 'power2.out'
				});
				lenis.on('scroll', function (e) {
					var v = Math.abs(e.velocity || 0);
					speedTo(gsap.utils.clamp(0, 0.7, v / 30));
					if (propTween) {
						propTween.timeScale(1 + Math.min(v / 25, 2.5));
					}
				});
			}
		}

		/* ---- decor: clouds, balloon, birds, rosette, helix ---- */
		function placeDecor() {
			var secTop = function (id) {
				var el = document.getElementById(id);
				return el ? el.offsetTop : 0;
			};
			var secH = function (id) {
				var el = document.getElementById(id);
				return el ? el.offsetHeight : 0;
			};
			var W = window.innerWidth;
			var place = function (sel, top, leftPct) {
				var el = document.querySelector(sel);
				if (el) {
					el.style.top = top + 'px';
					el.style.left = (W * leftPct) / 100 + 'px';
				}
				return el;
			};
			place('.sky__decor--rosette', window.innerHeight * 0.16, 80);
			place('.sky__decor--cloud-a', window.innerHeight * 0.34, 6);
			place('.sky__decor--cloud-b', secTop('comps') - 120, 74);
			place('.sky__decor--birds', secTop('word') - 160, 16);
			place('.sky__decor--balloon', secTop('word') + secH('word') * 0.42, 82);
			place('.sky__decor--helix', secTop('broker') + 60, 7);
		}
		placeDecor();

		/* gentle independent motion for each decor piece */
		gsap.to('[data-rosette-rays]', {
			rotation: 360,
			duration: 60,
			ease: 'none',
			repeat: -1,
			svgOrigin: '50 50'
		});
		document.querySelectorAll('.sky__decor--cloud').forEach(function (el, i) {
			gsap.to(el, {
				xPercent: i % 2 ? -16 : 16,
				duration: 16 + i * 5,
				ease: 'sine.inOut',
				yoyo: true,
				repeat: -1
			});
			gsap.to(el, {
				y: -70,
				ease: 'none',
				scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.2 }
			});
		});
		var birds = document.querySelector('.sky__decor--birds');
		if (birds) {
			gsap.to(birds, {
				x: 90,
				y: -26,
				duration: 12,
				ease: 'sine.inOut',
				yoyo: true,
				repeat: -1
			});
		}
		var balloon = document.querySelector('.sky__decor--balloon');
		if (balloon) {
			gsap.to(balloon, {
				y: -200,
				ease: 'none',
				scrollTrigger: { trigger: balloon, start: 'top bottom', end: 'bottom top', scrub: 1.4 }
			});
			gsap.to(balloon, {
				rotation: 3,
				duration: 5,
				ease: 'sine.inOut',
				yoyo: true,
				repeat: -1,
				transformOrigin: '50% 10%'
			});
		}
		var helixDecor = document.querySelector('.sky__decor--helix');
		if (helixDecor) {
			gsap.to(helixDecor, {
				y: -110,
				ease: 'none',
				scrollTrigger: { trigger: helixDecor, start: 'top bottom', end: 'bottom top', scrub: 1.2 }
			});
		}

		var skyTimer;
		window.addEventListener('resize', function () {
			clearTimeout(skyTimer);
			skyTimer = setTimeout(function () {
				buildFlight();
				placeDecor();
			}, 200);
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
