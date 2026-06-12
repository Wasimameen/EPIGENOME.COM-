/* ==========================================================================
   EPIGENOME.COM — night city, cinematic cut
   Scroll-driven Three.js flight over a realistic future Manhattan:
   top-down hero over thousands of towers, a banked swing through the
   canyons past neon billboards, and a climb to a rooftop crown where a
   holographic DNA helix turns above the asking price.
   Realism stack: per-floor facade lighting, IBL glass reflections,
   gradient sky dome, wet streets, searchlights, aircraft, and an
   UnrealBloom post pass with gamma-corrected output.
   ========================================================================== */

(function () {
	'use strict';

	var canvas = document.getElementById('scene');
	if (!canvas || typeof THREE === 'undefined') {
		return;
	}

	var reduceMotion =
		window.matchMedia &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var isMobile = window.matchMedia && window.matchMedia('(max-width: 760px)').matches;
	var lowQuality =
		isMobile || /[?&]epi_quality=low/.test(window.location.search);

	var renderer;
	try {
		renderer = new THREE.WebGLRenderer({
			canvas: canvas,
			antialias: true,
			alpha: false,
			powerPreference: 'high-performance'
		});
	} catch (err) {
		canvas.style.display = 'none';
		return;
	}

	var TEAL = 0x38e8d2;
	var GOLD = 0xe3c688;

	renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowQuality ? 1.5 : 1.75));
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1.12;

	var scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0x0a1322, lowQuality ? 0.0052 : 0.0034);

	var camera = new THREE.PerspectiveCamera(54, 1, 0.5, 2000);

	/* ---------------- post: bloom + gamma (desktop only) ------------------ */
	var composer = null;
	var bloomPass = null;
	if (!lowQuality && THREE.EffectComposer && THREE.UnrealBloomPass) {
		renderer.outputEncoding = THREE.LinearEncoding;
		composer = new THREE.EffectComposer(renderer);
		composer.addPass(new THREE.RenderPass(scene, camera));
		bloomPass = new THREE.UnrealBloomPass(
			new THREE.Vector2(window.innerWidth, window.innerHeight),
			0.5,   /* strength */
			0.72,  /* radius */
			0.74   /* threshold */
		);
		composer.addPass(bloomPass);
		composer.addPass(new THREE.ShaderPass(THREE.GammaCorrectionShader));
	} else {
		renderer.outputEncoding = THREE.sRGBEncoding;
	}

	/* ---------------- sky dome + image-based lighting --------------------- */
	(function sky() {
		var c = document.createElement('canvas');
		c.width = 4;
		c.height = 256;
		var x = c.getContext('2d');
		var g = x.createLinearGradient(0, 0, 0, 256);
		g.addColorStop(0, '#04060d');
		g.addColorStop(0.55, '#0a1322');
		g.addColorStop(0.82, '#1a2c47');
		g.addColorStop(0.94, '#3a3f46');
		g.addColorStop(1, '#54483a');
		x.fillStyle = g;
		x.fillRect(0, 0, 4, 256);
		var tex = new THREE.CanvasTexture(c);
		var dome = new THREE.Mesh(
			new THREE.SphereGeometry(1400, 24, 18),
			new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide, fog: false })
		);
		dome.position.set(0, 0, -350);
		scene.add(dome);
	})();

	(function ibl() {
		/* a tiny gradient cubemap run through PMREM gives every standard
		   material soft sky reflections — the cheap key to "real glass" */
		try {
			var faces = [];
			for (var i = 0; i < 6; i++) {
				var c = document.createElement('canvas');
				c.width = 16;
				c.height = 16;
				var x = c.getContext('2d');
				var g = x.createLinearGradient(0, 0, 0, 16);
				if (i === 2) {        /* +Y sky */
					g.addColorStop(0, '#0a1428');
					g.addColorStop(1, '#0a1428');
				} else if (i === 3) { /* -Y ground glow */
					g.addColorStop(0, '#2c2a20');
					g.addColorStop(1, '#2c2a20');
				} else {
					g.addColorStop(0, '#070c18');
					g.addColorStop(0.75, '#22304a');
					g.addColorStop(1, '#4a4030');
				}
				x.fillStyle = g;
				x.fillRect(0, 0, 16, 16);
				faces.push(c);
			}
			var cube = new THREE.CubeTexture(faces);
			cube.needsUpdate = true;
			var pmrem = new THREE.PMREMGenerator(renderer);
			scene.environment = pmrem.fromCubemap(cube).texture;
			pmrem.dispose();
		} catch (e) { /* IBL is optional polish */ }
	})();

	/* ---------------- lights ---------------- */
	scene.add(new THREE.HemisphereLight(0x223a5e, 0x05070c, 0.55));
	var moon = new THREE.DirectionalLight(0x8da4d8, 0.32);
	moon.position.set(-80, 240, 60);
	scene.add(moon);
	var crownLight = new THREE.PointLight(GOLD, 0.0, 240);
	scene.add(crownLight);

	/* ---------------- facade textures: per-floor realism ------------------ */
	function makeFacade(opts) {
		var c = document.createElement('canvas');
		c.width = 256;
		c.height = 512;
		var x = c.getContext('2d');
		x.fillStyle = opts.body || '#0a0f1c';
		x.fillRect(0, 0, 256, 512);

		var cols = 10;
		var rows = 30;
		var cw = 256 / cols;
		var ch = 512 / rows;

		for (var r = 0; r < rows; r++) {
			/* whole floors go dark after hours; lit floors light in runs */
			var floorLit = Math.random() < opts.floorRatio;
			var run = false;
			for (var cc = 0; cc < cols; cc++) {
				if (Math.random() < 0.3) { run = floorLit && Math.random() < 0.75; }
				var lit = floorLit && (run || Math.random() < 0.12);
				var warm = Math.random() < opts.warmth;
				var col;
				if (lit) {
					var bright = 0.55 + Math.random() * 0.45;
					col = warm
						? 'rgba(255, ' + ((200 + Math.random() * 30) | 0) + ', 140, ' + bright + ')'
						: 'rgba(168, 214, 255, ' + bright + ')';
				} else {
					col = 'rgba(10, 16, 30, ' + (0.75 + Math.random() * 0.25) + ')';
				}
				x.fillStyle = col;
				x.fillRect(cc * cw + cw * 0.16, r * ch + ch * 0.18, cw * 0.66, ch * 0.58);
			}
			/* slab line between floors */
			x.fillStyle = 'rgba(28, 38, 60, 0.8)';
			x.fillRect(0, r * ch + ch * 0.86, 256, ch * 0.14);
		}
		/* mechanical floors at the very top read dark */
		x.fillStyle = 'rgba(8, 12, 22, 0.92)';
		x.fillRect(0, 0, 256, ch * 1.6);
		/* glowing double-height lobby */
		var lg = x.createLinearGradient(0, 512 - ch * 2.4, 0, 512);
		lg.addColorStop(0, 'rgba(255, 205, 140, 0)');
		lg.addColorStop(1, 'rgba(255, 205, 140, 0.75)');
		x.fillStyle = lg;
		x.fillRect(6, 512 - ch * 2.4, 244, ch * 2.4);
		/* vertical piers */
		for (var p = 0; p <= cols; p++) {
			x.fillStyle = 'rgba(34, 46, 72, 0.6)';
			x.fillRect(p * cw - 1, 0, 2, 512);
		}
		var tx = new THREE.CanvasTexture(c);
		tx.wrapS = THREE.RepeatWrapping;
		tx.wrapT = THREE.RepeatWrapping;
		tx.anisotropy = 8;
		return tx;
	}

	function facadeMaterial(tex, glass) {
		return new THREE.MeshStandardMaterial({
			map: tex,
			emissive: 0xffffff,
			emissiveMap: tex,
			emissiveIntensity: glass ? 0.5 : 0.62,
			roughness: glass ? 0.18 : 0.62,
			metalness: glass ? 0.7 : 0.22,
			envMapIntensity: glass ? 1.1 : 0.35
		});
	}

	var facadeMats = [
		facadeMaterial(makeFacade({ floorRatio: 0.62, warmth: 0.55 }), false),
		facadeMaterial(makeFacade({ floorRatio: 0.42, warmth: 0.3 }), false),
		facadeMaterial(makeFacade({ floorRatio: 0.7, warmth: 0.75, body: '#0b1322' }), false),
		facadeMaterial(makeFacade({ floorRatio: 0.5, warmth: 0.25, body: '#0d1526' }), true)
	];

	/* ---------------- wet streets ---------------- */
	var groundTex = (function () {
		var c = document.createElement('canvas');
		c.width = 512;
		c.height = 512;
		var x = c.getContext('2d');
		x.fillStyle = '#05070d';
		x.fillRect(0, 0, 512, 512);
		x.strokeStyle = 'rgba(70, 130, 160, 0.4)';
		x.lineWidth = 2;
		var step = 512 / 8;
		for (var i = 0; i <= 8; i++) {
			x.beginPath(); x.moveTo(i * step, 0); x.lineTo(i * step, 512); x.stroke();
			x.beginPath(); x.moveTo(0, i * step); x.lineTo(512, i * step); x.stroke();
		}
		var tx = new THREE.CanvasTexture(c);
		tx.wrapS = THREE.RepeatWrapping;
		tx.wrapT = THREE.RepeatWrapping;
		tx.repeat.set(60, 60);
		return tx;
	})();
	var ground = new THREE.Mesh(
		new THREE.PlaneGeometry(3200, 3200),
		new THREE.MeshStandardMaterial({
			map: groundTex,
			emissive: 0xffffff,
			emissiveMap: groundTex,
			emissiveIntensity: 0.22,
			color: 0x0a0e16,
			roughness: 0.32,        /* rain-slick */
			metalness: 0.5,
			envMapIntensity: 0.9
		})
	);
	ground.rotation.x = -Math.PI / 2;
	ground.position.set(0, 0, -350);
	scene.add(ground);

	/* ---------------- camera path ---------------- */
	var path = new THREE.CatmullRomCurve3([
		new THREE.Vector3(0, 330, 30),
		new THREE.Vector3(36, 235, -50),
		new THREE.Vector3(-44, 150, -140),
		new THREE.Vector3(30, 78, -215),
		new THREE.Vector3(-34, 50, -300),
		new THREE.Vector3(34, 44, -385),
		new THREE.Vector3(-32, 48, -470),
		new THREE.Vector3(10, 58, -545),
		new THREE.Vector3(0, 92, -625),
		new THREE.Vector3(0, 152, -688),
		new THREE.Vector3(0, 176, -706)
	]);
	var corridor = [];
	(function () {
		for (var i = 0; i <= 160; i++) {
			corridor.push(path.getPointAt(i / 160));
		}
	})();
	function corridorClear(x, z, radius) {
		for (var i = 0; i < corridor.length; i++) {
			var p = corridor[i];
			var dx = p.x - x;
			var dz = p.z - z;
			if (dx * dx + dz * dz < radius * radius) {
				return false;
			}
		}
		return true;
	}

	/* ---------------- the city ---------------- */
	var boxGeo = new THREE.BoxGeometry(1, 1, 1);
	boxGeo.translate(0, 0.5, 0);

	var lots = [];
	(function planCity() {
		var block = 34;
		var nx = lowQuality ? 13 : 21;
		var nz = lowQuality ? 26 : 34;
		for (var bx = -nx; bx <= nx; bx++) {
			for (var bz = 2; bz > -nz; bz--) {
				var cx = bx * block;
				var cz = bz * block - 60;
				if (Math.random() < 0.06) { continue; }
				var coreness = Math.max(0, 1 - Math.abs(cx) / (nx * block));
				var depth = Math.min(1, Math.max(0, (-cz - 40) / 560));
				var tallBoost = coreness * (0.5 + 0.7 * Math.sin(depth * Math.PI));
				for (var lot = 0; lot < 2; lot++) {
					var lx = cx + (lot === 0 ? -block * 0.22 : block * 0.24) + (Math.random() - 0.5) * 4;
					var lz = cz + (Math.random() - 0.5) * block * 0.4;
					if (!corridorClear(lx, lz, 26)) { continue; }
					var w = 8 + Math.random() * 9;
					var d = 8 + Math.random() * 9;
					var h = 12 + Math.random() * 30 + tallBoost * (40 + Math.random() * 95);
					lots.push({
						x: lx, z: lz, w: w, d: d, h: h,
						v: (Math.random() * facadeMats.length) | 0,
						setback: Math.random() < 0.48,
						mech: Math.random() < 0.4
					});
				}
			}
		}
	})();

	(function buildCity() {
		var counts = facadeMats.map(function () { return 0; });
		lots.forEach(function (l) { counts[l.v]++; });
		var meshes = facadeMats.map(function (mat, vi) {
			return new THREE.InstancedMesh(boxGeo, mat, Math.max(counts[vi], 1));
		});
		var nSet = lots.filter(function (l) { return l.setback; }).length;
		var nMech = lots.filter(function (l) { return l.mech; }).length;
		var setMesh = new THREE.InstancedMesh(boxGeo, facadeMats[0], Math.max(nSet, 1));
		var mechMesh = new THREE.InstancedMesh(
			boxGeo,
			new THREE.MeshStandardMaterial({ color: 0x161e30, roughness: 0.85, metalness: 0.2 }),
			Math.max(nMech, 1)
		);
		var dummy = new THREE.Object3D();
		var tint = new THREE.Color();
		var idx = facadeMats.map(function () { return 0; });
		var si = 0;
		var mi = 0;
		lots.forEach(function (l) {
			dummy.position.set(l.x, 0, l.z);
			dummy.scale.set(l.w, l.h, l.d);
			dummy.updateMatrix();
			var m = meshes[l.v];
			m.setMatrixAt(idx[l.v], dummy.matrix);
			var b = 0.55 + Math.random() * 0.55;
			tint.setRGB(b, b * (0.96 + Math.random() * 0.08), b * (1 + Math.random() * 0.12));
			m.setColorAt(idx[l.v], tint);
			idx[l.v]++;
			if (l.setback) {
				/* upper tier for a stepped, Manhattan silhouette */
				dummy.position.set(l.x, l.h, l.z);
				dummy.scale.set(l.w * 0.62, l.h * (0.22 + Math.random() * 0.14), l.d * 0.62);
				dummy.updateMatrix();
				setMesh.setMatrixAt(si, dummy.matrix);
				setMesh.setColorAt(si, tint);
				si++;
				l.topY = l.h + l.h * 0.3;
			} else {
				l.topY = l.h;
			}
			if (l.mech) {
				/* dark rooftop mechanical penthouse */
				dummy.position.set(l.x + l.w * 0.12, l.topY, l.z - l.d * 0.1);
				dummy.scale.set(l.w * 0.3, 2.6, l.d * 0.3);
				dummy.updateMatrix();
				mechMesh.setMatrixAt(mi, dummy.matrix);
				mi++;
			}
		});
		meshes.concat([setMesh, mechMesh]).forEach(function (m) {
			m.instanceMatrix.needsUpdate = true;
			if (m.instanceColor) { m.instanceColor.needsUpdate = true; }
			scene.add(m);
		});
	})();

	/* rooftop antennas + blinking beacons */
	var tallLots = lots.filter(function (l) { return l.h > 70; });
	var antGeo = new THREE.CylinderGeometry(0.22, 0.4, 9, 5);
	antGeo.translate(0, 4.5, 0);
	var antennas = new THREE.InstancedMesh(
		antGeo,
		new THREE.MeshStandardMaterial({ color: 0x222c44, roughness: 0.55, metalness: 0.6 }),
		Math.max(tallLots.length, 1)
	);
	var beaconGroups = [[], [], []];
	(function () {
		var dummy = new THREE.Object3D();
		tallLots.forEach(function (l, i) {
			dummy.position.set(l.x, l.topY, l.z);
			dummy.updateMatrix();
			antennas.setMatrixAt(i, dummy.matrix);
			beaconGroups[i % 3].push(new THREE.Vector3(l.x, l.topY + 9.4, l.z));
		});
		antennas.instanceMatrix.needsUpdate = true;
		scene.add(antennas);
	})();
	var beaconMats = [];
	beaconGroups.forEach(function (pts, gi) {
		if (!pts.length) { return; }
		var g = new THREE.BufferGeometry().setFromPoints(pts);
		var mat = new THREE.PointsMaterial({
			color: 0xff4a3e,
			size: 2.4,
			transparent: true,
			opacity: 0.9,
			sizeAttenuation: true,
			depthWrite: false
		});
		mat.userData.phase = gi * 2.1;
		beaconMats.push(mat);
		scene.add(new THREE.Points(g, mat));
	});

	/* ---------------- swing-by towers (glass, neon trims) ----------------- */
	var neonTrimMat = new THREE.MeshBasicMaterial({ color: TEAL });
	var neonTrimMat2 = new THREE.MeshBasicMaterial({ color: 0x9d8cff });
	(function swingTowers() {
		var spots = [0.34, 0.42, 0.5, 0.58, 0.66, 0.73];
		spots.forEach(function (t, i) {
			var p = path.getPointAt(t);
			var ahead = path.getPointAt(Math.min(t + 0.02, 1));
			var side = (ahead.x - p.x) > 0 ? -1 : 1;
			var x = p.x + side * (20 + Math.random() * 5);
			var z = p.z - 6;
			if (!corridorClear(x, z, 14)) { x += side * 10; }
			var w = 14 + Math.random() * 5;
			var h = Math.max(p.y + 38 + Math.random() * 30, 84);
			var tower = new THREE.Mesh(boxGeo.clone(), facadeMats[3]);
			tower.position.set(x, 0, z);
			tower.scale.set(w, h, w);
			scene.add(tower);
			var trim = new THREE.Mesh(
				new THREE.BoxGeometry(w + 0.7, 0.55, w + 0.7),
				i % 2 ? neonTrimMat2 : neonTrimMat
			);
			trim.position.set(x, h * 0.92, z);
			scene.add(trim);
		});
	})();

	/* ---------------- neon billboards ---------------- */
	function makeBillboardTex(line1, line2, hue) {
		var c = document.createElement('canvas');
		c.width = 512;
		c.height = 256;
		var x = c.getContext('2d');
		x.fillStyle = '#060b15';
		x.fillRect(0, 0, 512, 256);
		x.strokeStyle = hue;
		x.lineWidth = 6;
		x.strokeRect(10, 10, 492, 236);
		x.fillStyle = hue;
		x.font = '700 60px Cinzel, Georgia, serif';
		x.textAlign = 'center';
		x.shadowColor = hue;
		x.shadowBlur = 26;
		x.fillText(line1, 256, 116);
		x.font = '500 32px "IBM Plex Mono", monospace';
		x.fillText(line2, 256, 186);
		return new THREE.CanvasTexture(c);
	}
	function addBillboard(t, side, line1, line2, hue) {
		var p = path.getPointAt(t);
		var board = new THREE.Mesh(
			new THREE.PlaneGeometry(26, 13),
			new THREE.MeshBasicMaterial({
				map: makeBillboardTex(line1, line2, hue),
				transparent: true,
				side: THREE.DoubleSide
			})
		);
		board.position.set(p.x + side * 24, p.y + 6, p.z - 14);
		board.lookAt(p.x, p.y + 4, p.z + 30);
		scene.add(board);
	}
	addBillboard(0.38, 1, 'EPIGENOME.COM', 'THE CATEGORY NAME', '#38e8d2');
	addBillboard(0.54, -1, 'FOR SALE', 'ONE WORD · ONE .COM', '#e3c688');
	addBillboard(0.7, 1, 'EPIGENOME.COM', 'ABOVE THE GENOME', '#9d8cff');

	/* ---------------- searchlights sweeping the sky ----------------------- */
	var searchlights = [];
	(function () {
		var beamGeo = new THREE.CylinderGeometry(0.6, 9, 150, 14, 1, true);
		beamGeo.translate(0, 75, 0);
		var spots = [
			{ x: -90, z: -250, h: 60, tilt: 0.5, speed: 0.22 },
			{ x: 110, z: -420, h: 80, tilt: 0.42, speed: -0.16 },
			{ x: -60, z: -560, h: 70, tilt: 0.55, speed: 0.19 }
		];
		spots.forEach(function (s) {
			var pivot = new THREE.Group();
			pivot.position.set(s.x, s.h, s.z);
			var beam = new THREE.Mesh(beamGeo, new THREE.MeshBasicMaterial({
				color: 0xcfe0ff,
				transparent: true,
				opacity: 0.055,
				blending: THREE.AdditiveBlending,
				depthWrite: false,
				side: THREE.DoubleSide,
				fog: false
			}));
			beam.rotation.x = s.tilt;
			pivot.add(beam);
			pivot.userData.speed = s.speed;
			scene.add(pivot);
			searchlights.push(pivot);
		});
	})();

	/* ---------------- aircraft crossing the sky --------------------------- */
	var aircraft = [];
	(function () {
		for (var i = 0; i < 3; i++) {
			var m = new THREE.Mesh(
				new THREE.SphereGeometry(0.9, 6, 6),
				new THREE.MeshBasicMaterial({
					color: i % 2 ? 0xffb2a8 : 0xbfe2ff,
					transparent: true,
					fog: false
				})
			);
			m.userData = {
				y: 230 + i * 50,
				r: 500 + i * 160,
				speed: (i % 2 ? -1 : 1) * (0.018 + i * 0.006),
				phase: i * 2.3
			};
			scene.add(m);
			aircraft.push(m);
		}
	})();

	/* ---------------- traffic ---------------- */
	var carGeo = new THREE.BoxGeometry(0.9, 0.5, 4.2);
	carGeo.translate(0, 0.25, 0);
	var nCars = lowQuality ? 50 : 130;
	var carsTeal = new THREE.InstancedMesh(carGeo, new THREE.MeshBasicMaterial({ color: 0x9fe8ff }), nCars);
	var carsAmber = new THREE.InstancedMesh(carGeo, new THREE.MeshBasicMaterial({ color: 0xffb46a }), nCars);
	var carData = [];
	(function () {
		var lanes = [-119, -85, -51, -17, 17, 51, 85, 119, 153, -153];
		for (var i = 0; i < nCars * 2; i++) {
			carData.push({
				lane: lanes[(Math.random() * lanes.length) | 0] + (Math.random() - 0.5) * 3,
				z: -700 + Math.random() * 760,
				speed: 28 + Math.random() * 40,
				dir: i % 2 ? 1 : -1
			});
		}
	})();
	scene.add(carsTeal);
	scene.add(carsAmber);
	function updateCars(et) {
		var dummy = new THREE.Object3D();
		for (var i = 0; i < carData.length; i++) {
			var cd = carData[i];
			var z = cd.z + ((et * cd.speed * cd.dir) % 760);
			if (z > 60) { z -= 760; }
			if (z < -700) { z += 760; }
			dummy.position.set(cd.lane, 0, z);
			dummy.updateMatrix();
			if (i < nCars) {
				carsTeal.setMatrixAt(i, dummy.matrix);
			} else {
				carsAmber.setMatrixAt(i - nCars, dummy.matrix);
			}
		}
		carsTeal.instanceMatrix.needsUpdate = true;
		carsAmber.instanceMatrix.needsUpdate = true;
	}

	/* ---------------- stars ---------------- */
	(function stars() {
		var n = lowQuality ? 500 : 1200;
		var pos = new Float32Array(n * 3);
		for (var i = 0; i < n; i++) {
			pos[i * 3] = (Math.random() - 0.5) * 2400;
			pos[i * 3 + 1] = 280 + Math.random() * 600;
			pos[i * 3 + 2] = -900 + Math.random() * 1400;
		}
		var g = new THREE.BufferGeometry();
		g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
		scene.add(new THREE.Points(g, new THREE.PointsMaterial({
			color: 0xbfd2ee, size: 1.3, sizeAttenuation: true, transparent: true, opacity: 0.75, fog: false
		})));
	})();

	/* ---------------- the crown ---------------- */
	var crownBase = new THREE.Vector3(0, 0, -742);
	var holoGroup = new THREE.Group();
	var diamond;
	(function crown() {
		var h = 160;
		var tower = new THREE.Mesh(boxGeo.clone(), facadeMats[3]);
		tower.position.set(crownBase.x, 0, crownBase.z);
		tower.scale.set(26, h, 26);
		scene.add(tower);
		var trim = new THREE.Mesh(new THREE.BoxGeometry(27.2, 0.8, 27.2), neonTrimMat);
		trim.position.set(crownBase.x, h - 3, crownBase.z);
		scene.add(trim);
		var pad = new THREE.Mesh(
			new THREE.CylinderGeometry(15, 16.5, 2.4, 24),
			new THREE.MeshStandardMaterial({ color: 0x10182a, roughness: 0.6, metalness: 0.4 })
		);
		pad.position.set(crownBase.x, h + 1.2, crownBase.z);
		scene.add(pad);

		var turns = 2.2;
		var len = 26;
		var rad = 6;
		var ptsA = [];
		var ptsB = [];
		for (var i = 0; i <= 70; i++) {
			var t = i / 70;
			var ang = t * Math.PI * 2 * turns;
			var y = t * len;
			ptsA.push(new THREE.Vector3(Math.cos(ang) * rad, y, Math.sin(ang) * rad));
			ptsB.push(new THREE.Vector3(Math.cos(ang + Math.PI) * rad, y, Math.sin(ang + Math.PI) * rad));
		}
		var holoMat = new THREE.MeshBasicMaterial({
			color: TEAL, transparent: true, opacity: 0.5,
			blending: THREE.AdditiveBlending, depthWrite: false
		});
		var holoMat2 = new THREE.MeshBasicMaterial({
			color: 0x9d8cff, transparent: true, opacity: 0.45,
			blending: THREE.AdditiveBlending, depthWrite: false
		});
		holoGroup.add(new THREE.Mesh(
			new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ptsA), lowQuality ? 50 : 90, 0.34, 8), holoMat
		));
		holoGroup.add(new THREE.Mesh(
			new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ptsB), lowQuality ? 50 : 90, 0.34, 8), holoMat2
		));
		var rungMat = new THREE.MeshBasicMaterial({
			color: 0xbffbf2, transparent: true, opacity: 0.35,
			blending: THREE.AdditiveBlending, depthWrite: false
		});
		for (var rr = 0; rr < 11; rr++) {
			var tr = rr / 10;
			var angR = tr * Math.PI * 2 * turns;
			var rung = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, rad * 2, 6), rungMat);
			rung.position.y = tr * len;
			rung.rotation.z = Math.PI / 2;
			rung.rotation.y = -angR;
			holoGroup.add(rung);
		}
		holoGroup.position.set(crownBase.x, h + 3, crownBase.z);
		scene.add(holoGroup);

		diamond = new THREE.Mesh(
			new THREE.OctahedronGeometry(3.2),
			new THREE.MeshStandardMaterial({
				color: GOLD, roughness: 0.18, metalness: 0.85,
				emissive: 0xc9952e, emissiveIntensity: 0.8, envMapIntensity: 1.2
			})
		);
		diamond.position.set(crownBase.x, h + 16, crownBase.z);
		scene.add(diamond);
		crownLight.position.set(crownBase.x, h + 18, crownBase.z + 8);
	})();

	/* ---------------- cinematic camera ---------------- */
	var camPos = new THREE.Vector3();
	var camTarget = new THREE.Vector3();
	var lastX = 0;
	var bank = 0;
	var progress = 0;
	var progressGoal = 0;
	var mouseX = 0;
	var mouseY = 0;
	var DOWN_BLEND_END = 0.1;

	function setCamera(p, dt, et) {
		var t = Math.min(Math.max(p, 0), 1);
		path.getPointAt(t, camPos);

		/* handheld drift while inside the canyon */
		var canyon = t > 0.16 && t < 0.88 ? 1 : 0;
		var shake = canyon * (reduceMotion ? 0 : 1);
		camera.position.set(
			camPos.x + mouseX * 2.2 + Math.sin(et * 1.1) * 0.5 * shake,
			camPos.y + -mouseY * 1.6 + Math.sin(et * 1.7 + 2) * 0.35 * shake,
			camPos.z
		);

		var aheadT = Math.min(t + 0.03, 1);
		path.getPointAt(aheadT, camTarget);
		if (t < DOWN_BLEND_END) {
			var k = t / DOWN_BLEND_END;
			k = k * k * (3 - 2 * k);
			var down = new THREE.Vector3(camPos.x, 0, camPos.z - 26);
			camTarget.lerpVectors(down, camTarget, k);
		}
		if (t > 0.93 && diamond) {
			camTarget.lerp(diamond.position, (t - 0.93) / 0.07);
		}
		camera.lookAt(camTarget);

		/* bank into the lateral motion */
		var vx = (camPos.x - lastX) / Math.max(dt || 0.016, 0.001);
		lastX = camPos.x;
		var targetBank = THREE.MathUtils.clamp(-vx * 0.0035, -0.42, 0.42);
		if (t < 0.16 || t > 0.88) { targetBank = 0; }
		bank += (targetBank - bank) * Math.min((dt || 0.016) * 4, 1);
		camera.rotateZ(bank + Math.sin(et * 0.9) * 0.004 * shake);

		/* anamorphic feel: wider above the city, tighter in the canyon */
		var fovTarget = t < 0.12 ? 58 : t > 0.86 ? 50 : 46;
		if (Math.abs(camera.fov - fovTarget) > 0.05) {
			camera.fov += (fovTarget - camera.fov) * Math.min((dt || 0.016) * 2, 1);
			camera.updateProjectionMatrix();
		}
	}

	window.EPI_SCENE = {
		setProgress: function (p) { progressGoal = p; },
		snap: function (p) { progressGoal = p; progress = p; }
	};
	function readScrollFallback() {
		var max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
		progressGoal = (window.scrollY || window.pageYOffset || 0) / max;
	}

	if (window.matchMedia && window.matchMedia('(pointer: fine)').matches) {
		window.addEventListener('mousemove', function (e) {
			mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
			mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
		});
	}

	function resize() {
		var w = window.innerWidth;
		var h = window.innerHeight;
		renderer.setSize(w, h, false);
		if (composer) { composer.setSize(w, h); }
		camera.aspect = w / h;
		camera.updateProjectionMatrix();
		if (reduceMotion) { renderOnce(); }
	}
	window.addEventListener('resize', resize);

	var clock = new THREE.Clock();
	var hidden = false;
	document.addEventListener('visibilitychange', function () {
		hidden = document.hidden;
	});

	function renderFrame() {
		if (composer) {
			composer.render();
		} else {
			renderer.render(scene, camera);
		}
	}

	function animate() {
		requestAnimationFrame(animate);
		if (hidden) { return; }
		if (!window.EPI_SCENE.driven) { readScrollFallback(); }
		var dt = Math.min(clock.getDelta(), 0.05);
		var et = clock.elapsedTime;

		progress += (progressGoal - progress) * Math.min(dt * 5.5, 1);
		setCamera(progress, dt, et);

		holoGroup.rotation.y = et * 0.5;
		if (diamond) {
			diamond.rotation.y = et * 0.7;
			diamond.position.y += Math.sin(et * 1.3) * 0.012;
		}
		for (var bi = 0; bi < beaconMats.length; bi++) {
			beaconMats[bi].opacity =
				0.25 + Math.abs(Math.sin(et * 1.8 + beaconMats[bi].userData.phase)) * 0.75;
		}
		for (var si = 0; si < searchlights.length; si++) {
			searchlights[si].rotation.y = et * searchlights[si].userData.speed;
		}
		for (var ai = 0; ai < aircraft.length; ai++) {
			var a = aircraft[ai].userData;
			aircraft[ai].position.set(
				Math.cos(et * a.speed + a.phase) * a.r,
				a.y,
				-350 + Math.sin(et * a.speed + a.phase) * a.r
			);
			aircraft[ai].material.opacity = 0.4 + Math.abs(Math.sin(et * 3 + a.phase)) * 0.6;
		}
		crownLight.intensity = 0.5 + Math.max(0, progress - 0.7) * 5 + Math.sin(et * 2.4) * 0.1;
		updateCars(et);

		renderFrame();
	}

	function renderOnce() {
		updateCars(8);
		setCamera(0.05, 0.016, 8);
		renderFrame();
	}

	resize();
	if (reduceMotion) {
		renderOnce();
	} else {
		animate();
	}
})();
