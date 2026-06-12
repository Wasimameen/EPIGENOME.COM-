/* ==========================================================================
   EPIGENOME.COM — the orb
   A glossy green liquid core morphing smoothly inside a chrome shell,
   with thin orbit wires — rendered live in Three.js over the hero.
   Mouse parallax, idle float, reduced-motion-safe, pauses off-screen.
   ========================================================================== */

(function () {
	'use strict';

	var canvas = document.getElementById('orb');
	if (!canvas || typeof THREE === 'undefined') {
		return;
	}

	var reduceMotion =
		window.matchMedia &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var isMobile = window.matchMedia && window.matchMedia('(max-width: 760px)').matches;

	var renderer;
	try {
		renderer = new THREE.WebGLRenderer({
			canvas: canvas,
			antialias: true,
			alpha: true,
			powerPreference: 'high-performance'
		});
	} catch (err) {
		canvas.style.display = 'none';
		return;
	}
	renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 1.75));
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1.0;
	renderer.setClearColor(0x000000, 0);

	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
	camera.position.set(0, 0, 5.4);

	/* ---- studio environment from a gradient equirect ---- */
	(function env() {
		try {
			var c = document.createElement('canvas');
			c.width = 256;
			c.height = 128;
			var x = c.getContext('2d');
			var g = x.createLinearGradient(0, 0, 0, 128);
			g.addColorStop(0, '#ffffff');
			g.addColorStop(0.45, '#dfe2e6');
			g.addColorStop(0.75, '#9aa0a8');
			g.addColorStop(1, '#5d6167');
			x.fillStyle = g;
			x.fillRect(0, 0, 256, 128);
			/* a couple of soft "softbox" hot spots for shapely highlights */
			[[60, 26, 42], [196, 38, 30]].forEach(function (s) {
				var rg = x.createRadialGradient(s[0], s[1], 0, s[0], s[1], s[2]);
				rg.addColorStop(0, 'rgba(255,255,255,0.95)');
				rg.addColorStop(1, 'rgba(255,255,255,0)');
				x.fillStyle = rg;
				x.fillRect(s[0] - s[2], s[1] - s[2], s[2] * 2, s[2] * 2);
			});
			var tex = new THREE.CanvasTexture(c);
			tex.mapping = THREE.EquirectangularReflectionMapping;
			var pmrem = new THREE.PMREMGenerator(renderer);
			scene.environment = pmrem.fromEquirectangular(tex).texture;
			pmrem.dispose();
		} catch (e) { /* lights still carry the scene */ }
	})();

	scene.add(new THREE.HemisphereLight(0xffffff, 0x777a80, 0.55));
	var key = new THREE.DirectionalLight(0xffffff, 0.7);
	key.position.set(3, 5, 6);
	scene.add(key);

	var group = new THREE.Group();
	scene.add(group);

	/* ---- green liquid core (morphing) ---- */
	var detail = isMobile ? 3 : 4;
	var coreGeo = new THREE.IcosahedronGeometry(1.02, detail);
	var basePos = coreGeo.attributes.position.array.slice();
	var core = new THREE.Mesh(
		coreGeo,
		new THREE.MeshPhysicalMaterial({
			color: 0x96d41e,
			roughness: 0.18,
			metalness: 0.0,
			clearcoat: 1.0,
			clearcoatRoughness: 0.08,
			envMapIntensity: 1.25
		})
	);
	group.add(core);

	function morph(t) {
		var pos = coreGeo.attributes.position;
		for (var i = 0; i < pos.count; i++) {
			var ix = i * 3;
			var x = basePos[ix];
			var y = basePos[ix + 1];
			var z = basePos[ix + 2];
			var n =
				Math.sin(x * 2.1 + t * 0.9) * 0.45 +
				Math.sin(y * 2.7 + t * 0.7 + 1.7) * 0.35 +
				Math.sin((x + z) * 1.7 + t * 1.15 + 3.1) * 0.4 +
				Math.sin((y + z) * 3.1 + t * 0.55 + 4.6) * 0.25;
			var d = 1 + n * 0.085;
			pos.array[ix] = x * d;
			pos.array[ix + 1] = y * d;
			pos.array[ix + 2] = z * d;
		}
		pos.needsUpdate = true;
		coreGeo.computeVertexNormals();
	}
	morph(0);

	/* ---- chrome shell band hugging the core ---- */
	var chrome = new THREE.MeshStandardMaterial({
		color: 0xd9dce1,
		metalness: 1.0,
		roughness: 0.16,
		envMapIntensity: 1.3
	});
	var band = new THREE.Mesh(
		new THREE.TorusGeometry(1.06, 0.34, isMobile ? 24 : 42, isMobile ? 64 : 110, Math.PI * 1.42),
		chrome
	);
	band.rotation.set(1.05, 0.45, 0.5);
	group.add(band);
	/* rounded shell ends */
	[0, Math.PI * 1.42].forEach(function (ang) {
		var cap = new THREE.Mesh(new THREE.SphereGeometry(0.34, isMobile ? 16 : 28, isMobile ? 16 : 28), chrome);
		cap.position.set(Math.cos(ang) * 1.06, Math.sin(ang) * 1.06, 0);
		band.add(cap);
	});

	/* ---- thin orbit wires ---- */
	var wireMat = new THREE.MeshStandardMaterial({
		color: 0xcdd1d7,
		metalness: 1.0,
		roughness: 0.22,
		envMapIntensity: 1.2
	});
	var wireA = new THREE.Mesh(new THREE.TorusGeometry(1.62, 0.013, 8, isMobile ? 80 : 160), wireMat);
	wireA.rotation.set(1.25, 0.2, 0);
	group.add(wireA);
	var wireB = new THREE.Mesh(new THREE.TorusGeometry(1.78, 0.01, 8, isMobile ? 80 : 160), wireMat);
	wireB.rotation.set(1.5, -0.5, 0.4);
	group.add(wireB);
	var wireC = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.008, 8, isMobile ? 64 : 130), wireMat);
	wireC.rotation.set(0.4, 0.9, 1.1);
	group.add(wireC);

	/* ---- interaction ---- */
	var mx = 0;
	var my = 0;
	if (window.matchMedia && window.matchMedia('(pointer: fine)').matches) {
		window.addEventListener('mousemove', function (e) {
			mx = (e.clientX / window.innerWidth - 0.5) * 2;
			my = (e.clientY / window.innerHeight - 0.5) * 2;
		});
	}

	function resize() {
		var w = canvas.clientWidth || canvas.parentElement.clientWidth;
		var h = canvas.clientHeight || canvas.parentElement.clientHeight;
		renderer.setSize(w, h, false);
		camera.aspect = w / Math.max(h, 1);
		camera.updateProjectionMatrix();
		if (reduceMotion) {
			renderer.render(scene, camera);
		}
	}
	window.addEventListener('resize', resize);

	var clock = new THREE.Clock();
	var paused = false;
	document.addEventListener('visibilitychange', function () {
		paused = document.hidden;
	});
	if ('IntersectionObserver' in window) {
		new IntersectionObserver(function (entries) {
			paused = document.hidden || !entries[0].isIntersecting;
		}).observe(canvas);
	}

	function animate() {
		requestAnimationFrame(animate);
		if (paused) { return; }
		var t = clock.getElapsedTime();

		morph(t);
		group.rotation.y += (mx * 0.35 - group.rotation.y) * 0.04 + 0.0012;
		group.rotation.x += (my * 0.22 - group.rotation.x) * 0.04;
		group.position.y = Math.sin(t * 0.8) * 0.05;
		wireA.rotation.z = t * 0.12;
		wireB.rotation.z = -t * 0.09;
		wireC.rotation.y = t * 0.07;

		renderer.render(scene, camera);
	}

	resize();
	if (reduceMotion) {
		renderer.render(scene, camera);
	} else {
		animate();
	}
})();
