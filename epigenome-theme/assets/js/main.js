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
		document.querySelectorAll('.film__video, [data-bgfilm]').forEach(function (v) {
			v.removeAttribute('autoplay');
			v.setAttribute('controls', 'controls');
			try { v.pause(); } catch (e) { /* not started */ }
		});
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
					gsap.delayedCall(1.8, sparkBurst);
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

		/* ---- flight physics: the plane chases a target on the route ----
		   spring-damper pursuit gives natural lag and overshoot; pitch
		   follows vertical speed; roll foreshortens through turns; gusty
		   turbulence layers on top; hard scroll bursts trigger a loop. */
		var sim = { x: 0, y: 0, vx: 0, vy: 0, alive: false, rot: 0 };
		var SPRING = 11;
		var DAMP = 5.6;
		var loop = { active: false, t: 0, r: 60 };
		var loopCooldownUntil = 0;
		var simTime = 0;

		function stepPlane(dt) {
			if (!flightLen || !planeEl) {
				return;
			}
			var p = Math.min(Math.max(planeP, 0), 1);
			var lenAt = flightLen * p;
			var target = trailPath.getPointAtLength(lenAt);
			trailPath.style.strokeDashoffset = flightLen * (1 - p);

			if (!sim.alive) {
				sim.x = target.x;
				sim.y = target.y;
				sim.alive = true;
			}
			simTime += dt;

			/* spring-damper pursuit */
			var ax = (target.x - sim.x) * SPRING - sim.vx * DAMP;
			var ay = (target.y - sim.y) * SPRING - sim.vy * DAMP;
			sim.vx += ax * dt;
			sim.vy += ay * dt;
			sim.x += sim.vx * dt;
			sim.y += sim.vy * dt;

			/* gusty turbulence — two incommensurate sines per axis */
			var speed = Math.hypot(sim.vx, sim.vy);
			var gust = 1 + Math.min(speed / 600, 1.6);
			var tx = (Math.sin(simTime * 1.7) + Math.sin(simTime * 2.9 + 1.3)) * 1.4 * gust;
			var ty = (Math.sin(simTime * 2.2 + 0.7) + Math.sin(simTime * 3.7 + 2.1)) * 2.1 * gust;

			/* heading from velocity; fall back to path tangent when slow */
			var hdgX = sim.vx;
			var hdgY = sim.vy;
			if (speed < 26) {
				var ahead = trailPath.getPointAtLength(Math.min(lenAt + 24, flightLen));
				hdgX = ahead.x - target.x;
				hdgY = ahead.y - target.y;
			}
			var deg = (Math.atan2(hdgY, Math.max(Math.abs(hdgX), 1) * (hdgX < 0 ? -1 : 1)) * 180) / Math.PI;
			/* pitch exaggeration from climb/dive rate */
			deg = gsap.utils.clamp(-38, 38, deg * 0.9 + sim.vy * 0.012);

			/* takeoff: resting at the start of the route */
			if (p < 0.004) {
				deg = 0;
			}
			/* landing flare at the end */
			if (p > 0.985) {
				deg *= (1 - p) / 0.015;
			}

			var px2 = sim.x + tx;
			var py2 = sim.y + ty;
			var rotOut;

			/* loop-the-loop overlay */
			if (loop.active) {
				loop.t += dt / 1.15;
				if (loop.t >= 1) {
					loop.active = false;
				} else {
					var e = loop.t < 0.5
						? 2 * loop.t * loop.t
						: 1 - Math.pow(-2 * loop.t + 2, 2) / 2;
					var ang = e * Math.PI * 2;
					px2 += Math.sin(ang) * loop.r * 0.55;
					py2 -= (1 - Math.cos(ang)) * loop.r * 0.5;
					rotOut = deg - e * 360;
				}
			}
			if (rotOut === undefined) {
				rotOut = deg;
			}

			/* roll foreshortening through heading changes */
			var turnRate = (rotOut - sim.rot) / Math.max(dt, 0.001);
			sim.rot = rotOut;
			var squash = loop.active
				? 1
				: 1 - Math.min(Math.abs(turnRate) * 0.00045, 0.14);

			gsap.set(planeEl, {
				x: px2 - planeW / 2,
				y: py2 - planeH / 2,
				rotation: rotOut,
				scaleY: squash,
				transformOrigin: '50% 50%'
			});
		}

		/* public hook: EPI_FLIGHT.stunt(strength) rolls a loop on demand */
		window.EPI_FLIGHT = {
			stunt: function (s) { triggerLoop(s || 70); }
		};

		function triggerLoop(strength) {
			var now = performance.now();
			if (loop.active || now < loopCooldownUntil) {
				return;
			}
			if (planeP < 0.05 || planeP > 0.92) {
				return;
			}
			loop.active = true;
			loop.t = 0;
			loop.r = gsap.utils.clamp(46, 110, 40 + strength * 0.7);
			loopCooldownUntil = now + 4200;
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
			var lastTick = 0;
			gsap.ticker.add(function (time) {
				var dt = Math.min(Math.max(time - lastTick, 0.001), 0.05);
				lastTick = time;
				planeP += (planeTargetP - planeP) * 0.07;
				stepPlane(dt);
			});
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
					if (v > 46) {
						triggerLoop(v);
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

		/* ---- aurora background: drifting nebula blobs on a fixed canvas ---- */
		(function aurora() {
			var cv = document.querySelector('[data-aurora]');
			if (!cv) { return; }
			var ctx = cv.getContext('2d');
			var blobs = [
				{ c: '56,232,210', r: 0.42, sx: 0.13, sy: 0.21, px: 0.82, py: 0.1, a: 0.10 },
				{ c: '126,96,255', r: 0.5, sx: 0.09, sy: 0.15, px: 0.12, py: 0.85, a: 0.10 },
				{ c: '217,179,92', r: 0.3, sx: 0.16, sy: 0.11, px: 0.55, py: 0.5, a: 0.06 },
				{ c: '56,160,255', r: 0.36, sx: 0.07, sy: 0.18, px: 0.3, py: 0.25, a: 0.07 }
			];
			function size() {
				cv.width = Math.floor(window.innerWidth / 2);
				cv.height = Math.floor(window.innerHeight / 2);
			}
			size();
			window.addEventListener('resize', size);
			gsap.ticker.add(function (time) {
				var w = cv.width;
				var h = cv.height;
				ctx.clearRect(0, 0, w, h);
				for (var i = 0; i < blobs.length; i++) {
					var b = blobs[i];
					var x = (b.px + Math.sin(time * b.sx + i * 2.1) * 0.16) * w;
					var y = (b.py + Math.cos(time * b.sy + i * 1.3) * 0.14) * h;
					var r = b.r * Math.min(w, h) * (1.5 + 0.2 * Math.sin(time * 0.11 + i));
					var g = ctx.createRadialGradient(x, y, 0, x, y, r);
					g.addColorStop(0, 'rgba(' + b.c + ',' + b.a + ')');
					g.addColorStop(1, 'rgba(' + b.c + ',0)');
					ctx.fillStyle = g;
					ctx.fillRect(x - r, y - r, r * 2, r * 2);
				}
			});
		})();

		/* ---- contrail: a silky fading ribbon behind the plane ---- */
		var trailPts = [];
		(function contrail() {
			var cv = document.querySelector('[data-contrail]');
			if (!cv || !planeEl) { return; }
			var ctx = cv.getContext('2d');
			function size() {
				cv.width = window.innerWidth;
				cv.height = window.innerHeight;
			}
			size();
			window.addEventListener('resize', size);
			gsap.ticker.add(function () {
				var m = planeEl.style.transform.match(/translate(?:3d)?\(([-0-9.]+)px[, ]+([-0-9.]+)px/);
				if (m) {
					trailPts.push({
						x: parseFloat(m[1]) + planeW * 0.12,
						y: parseFloat(m[2]) + planeH * 0.5,
						life: 1
					});
				}
				if (trailPts.length > 34) { trailPts.shift(); }
				ctx.clearRect(0, 0, cv.width, cv.height);
				var sy = window.scrollY || 0;
				for (var i = 1; i < trailPts.length; i++) {
					var p0 = trailPts[i - 1];
					var p1 = trailPts[i];
					p1.life *= 0.985;
					var t = i / trailPts.length;
					ctx.beginPath();
					ctx.moveTo(p0.x, p0.y - sy);
					ctx.lineTo(p1.x, p1.y - sy);
					ctx.strokeStyle = 'rgba(56,232,210,' + (0.34 * t * p1.life) + ')';
					ctx.lineWidth = 1 + t * 5;
					ctx.lineCap = 'round';
					ctx.stroke();
					ctx.strokeStyle = 'rgba(237,242,253,' + (0.18 * t * p1.life) + ')';
					ctx.lineWidth = 0.6 + t * 1.6;
					ctx.stroke();
				}
			});
		})();

		/* ---- foreground flybys: the plane buzzes the camera ---- */
		(function flybys() {
			var el = document.querySelector('[data-flyby]');
			if (!el) { return; }
			var busyUntil = 0;
			function flyby(dir) {
				var now = performance.now();
				if (now < busyUntil) { return; }
				busyUntil = now + 6500;
				var vw = window.innerWidth;
				var vh = window.innerHeight;
				var y0 = vh * (0.2 + Math.random() * 0.45);
				var y1 = y0 + (Math.random() - 0.5) * vh * 0.3;
				var w = el.getBoundingClientRect().width || 320;
				var rot = ((y1 - y0) / vw) * 40;
				gsap.set(el, {
					x: dir > 0 ? -w * 1.4 : vw + w * 0.4,
					y: y0,
					rotation: dir > 0 ? rot : -rot,
					scaleX: dir > 0 ? 1 : -1,
					opacity: 1
				});
				gsap.to(el, {
					x: dir > 0 ? vw + w * 0.4 : -w * 1.4,
					y: y1,
					duration: 1.9,
					ease: 'power1.in',
					onComplete: function () { gsap.set(el, { opacity: 0 }); }
				});
			}
			if (window.EPI_FLIGHT) {
				window.EPI_FLIGHT.flyby = function () { busyUntil = 0; flyby(Math.random() > 0.5 ? 1 : -1); };
			}
			var dirToggle = 1;
			document.querySelectorAll('#word, #becomes, #broker').forEach(function (sec) {
				ScrollTrigger.create({
					trigger: sec,
					start: 'top 60%',
					onEnter: function () {
						flyby(dirToggle);
						dirToggle *= -1;
					}
				});
			});
		})();

		/* ---- gold spark burst + shake when the price lands ---- */
		function sparkBurst() {
			var cv = document.querySelector('[data-sparks]');
			if (!cv) { return; }
			var ctx = cv.getContext('2d');
			cv.width = window.innerWidth;
			cv.height = window.innerHeight;
			var parts = [];
			var colors = ['217,179,92', '56,232,210', '237,242,253'];
			for (var i = 0; i < 90; i++) {
				var a = Math.random() * Math.PI * 2;
				var sp = 3 + Math.random() * 9;
				parts.push({
					x: cv.width / 2,
					y: cv.height * 0.42,
					vx: Math.cos(a) * sp,
					vy: Math.sin(a) * sp - 3,
					life: 1,
					c: colors[(Math.random() * 3) | 0],
					r: 1 + Math.random() * 2.4
				});
			}
			var tick = function () {
				ctx.clearRect(0, 0, cv.width, cv.height);
				var alive = false;
				for (var i = 0; i < parts.length; i++) {
					var p = parts[i];
					if (p.life <= 0) { continue; }
					alive = true;
					p.vy += 0.22;
					p.x += p.vx;
					p.y += p.vy;
					p.life -= 0.016;
					ctx.beginPath();
					ctx.arc(p.x, p.y, Math.max(p.r * p.life, 0.01), 0, Math.PI * 2);
					ctx.fillStyle = 'rgba(' + p.c + ',' + Math.max(p.life, 0) + ')';
					ctx.fill();
				}
				if (alive) { requestAnimationFrame(tick); }
				else { ctx.clearRect(0, 0, cv.width, cv.height); }
			};
			requestAnimationFrame(tick);
			gsap.fromTo('#terms .container',
				{ x: -7 },
				{ x: 7, duration: 0.06, repeat: 7, yoyo: true, clearProps: 'x', ease: 'none' });
			if (window.EPI_FLIGHT) { window.EPI_FLIGHT.stunt(80); }
		}

		/* ---- comps: ride sideways while pinned (wide screens) ---- */
		(function compsPin() {
			var rail = document.querySelector('[data-comps-rail]');
			var wrap = document.querySelector('[data-comps-pin]');
			if (!rail || !wrap || window.innerWidth < 1024) { return; }
			var dist = function () { return Math.max(rail.scrollWidth - window.innerWidth + 120, 0); };
			gsap.to(rail, {
				x: function () { return -dist(); },
				ease: 'none',
				scrollTrigger: {
					trigger: '#comps',
					start: 'top top',
					end: function () { return '+=' + (dist() + window.innerHeight * 0.4); },
					pin: true,
					scrub: 0.6,
					invalidateOnRefresh: true
				}
			});
		})();

		/* ---- hero HUD ticker + cursor-dodging title letters ---- */
		(function heroJuice() {
			var read = document.querySelector('[data-hud-read]');
			if (read) {
				var hdg = 42;
				setInterval(function () {
					hdg = (hdg + 1 + (Math.random() * 3 | 0)) % 360;
					read.textContent = 'ALT 14888 · HDG ' + String(hdg).padStart(3, '0') + ' · THE CATEGORY NAME';
				}, 1400);
			}
			var title = document.querySelector('.hero__title');
			if (!title || !finePointer || !heroChars) { return; }
			var movers = [];
			heroChars.forEach(function (ch) {
				movers.push({
					el: ch,
					xTo: gsap.quickTo(ch, 'x', { duration: 0.5, ease: 'power3.out' }),
					yTo: gsap.quickTo(ch, 'y', { duration: 0.5, ease: 'power3.out' })
				});
			});
			title.addEventListener('mousemove', function (e) {
				movers.forEach(function (m) {
					var r = m.el.getBoundingClientRect();
					var cx = r.left + r.width / 2;
					var cy = r.top + r.height / 2;
					var dx = cx - e.clientX;
					var dy = cy - e.clientY;
					var d = Math.hypot(dx, dy);
					var f = Math.max(0, 1 - d / 200);
					m.xTo(dx / Math.max(d, 1) * 26 * f);
					m.yTo(dy / Math.max(d, 1) * 18 * f);
				});
			});
			title.addEventListener('mouseleave', function () {
				movers.forEach(function (m) { m.xTo(0); m.yTo(0); });
			});
		})();

		/* ---- giant titles drift sideways with scroll (wide screens) ---- */
		if (window.innerWidth >= 1024) {
		gsap.utils.toArray('.section__title').forEach(function (el, i) {
			gsap.fromTo(el,
				{ x: i % 2 ? 50 : -50 },
				{
					x: i % 2 ? -50 : 50,
					ease: 'none',
					scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.1 }
				});
		});
		}

		/* the comps pin changes the page height — rebuild the route after refresh */
		ScrollTrigger.addEventListener('refresh', function () {
			if (typeof buildFlight === 'function') { buildFlight(); }
			if (typeof placeDecor === 'function') { placeDecor(); }
		});
		ScrollTrigger.refresh();

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
