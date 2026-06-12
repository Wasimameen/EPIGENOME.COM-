/* ==========================================================================
   EPIGENOME.COM — night city scene
   A scroll-driven Three.js flight over a futuristic Manhattan: the hero
   looks straight down on thousands of lit towers, then the camera dives
   and swings through the street canyons — banking on every turn — past
   neon EPIGENOME billboards, and climbs to a rooftop crown where a
   holographic DNA helix turns above the asking price.
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

	/* ---------------- palette ---------------- */
	var SKY = 0x070b14;
	var HAZE = 0x0c1424;
	var TEAL = 0x38e8d2;
	var GOLD = 0xe3c688;

	renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 1.75));
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1.1;

	var scene = new THREE.Scene();
	scene.background = new THREE.Color(SKY);
	scene.fog = new THREE.FogExp2(HAZE, isMobile ? 0.0052 : 0.0036);

	var camera = new THREE.PerspectiveCamera(50, 1, 0.5, 1600);

	/* ---------------- lights ---------------- */
	scene.add(new THREE.HemisphereLight(0x24395c, 0x04060c, 0.7));
	var moon = new THREE.DirectionalLight(0x7e8cc8, 0.3);
	moon.position.set(-60, 200, 80);
	scene.add(moon);
	var crownLight = new THREE.PointLight(GOLD, 0.0, 220);
	scene.add(crownLight);

	/* ---------------- facade textures (night windows) ---------------- */
	function makeFacade(litRatio, coolBias) {
		var c = document.createElement('canvas');
		c.width = 128;
		c.height = 256;
		var x = c.getContext('2d');
		x.fillStyle = '#0a1120';
		x.fillRect(0, 0, 128, 256);
		var cols = 8;
		var rows = 20;
		var cw = 128 / cols;
		var ch = 256 / rows;
		for (var r = 0; r < rows; r++) {
			for (var cc = 0; cc < cols; cc++) {
				var roll = Math.random();
				var col;
				if (roll < litRatio * 0.55) {
					col = Math.random() < coolBias ? 'rgba(150, 214, 255, 0.92)' : 'rgba(255, 219, 153, 0.92)';
				} else if (roll < litRatio) {
					col = Math.random() < coolBias ? 'rgba(94, 150, 200, 0.5)' : 'rgba(190, 160, 110, 0.5)';
				} else {
					col = 'rgba(16, 24, 40, 0.9)';
				}
				x.fillStyle = col;
				x.fillRect(cc * cw + cw * 0.18, r * ch + ch * 0.2, cw * 0.6, ch * 0.55);
			}
		}
		/* faint vertical piers */
		for (var p = 0; p <= cols; p++) {
			x.fillStyle = 'rgba(40, 56, 86, 0.55)';
			x.fillRect(p * cw - 1, 0, 2, 256);
		}
		var tx = new THREE.CanvasTexture(c);
		tx.wrapS = THREE.RepeatWrapping;
		tx.wrapT = THREE.RepeatWrapping;
		tx.anisotropy = 4;
		return tx;
	}

	function towerMaterialFromTex(tex) {
		return new THREE.MeshStandardMaterial({
			map: tex,
			emissive: 0xffffff,
			emissiveMap: tex,
			emissiveIntensity: 0.62,
			roughness: 0.72,
			metalness: 0.18
		});
	}

	/* ---------------- ground: street grid glow ---------------- */
	var groundTex = (function () {
		var c = document.createElement('canvas');
		c.width = 512;
		c.height = 512;
		var x = c.getContext('2d');
		x.fillStyle = '#05080f';
		x.fillRect(0, 0, 512, 512);
		x.strokeStyle = 'rgba(56, 120, 150, 0.5)';
		x.lineWidth = 2;
		var step = 512 / 8;
		for (var i = 0; i <= 8; i++) {
			x.beginPath();
			x.moveTo(i * step, 0);
			x.lineTo(i * step, 512);
			x.stroke();
			x.beginPath();
			x.moveTo(0, i * step);
			x.lineTo(512, i * step);
			x.stroke();
		}
		var tx = new THREE.CanvasTexture(c);
		tx.wrapS = THREE.RepeatWrapping;
		tx.wrapT = THREE.RepeatWrapping;
		tx.repeat.set(60, 60);
		return tx;
	})();
	var ground = new THREE.Mesh(
		new THREE.PlaneGeometry(3000, 3000),
		new THREE.MeshStandardMaterial({
			map: groundTex,
			emissive: 0xffffff,
			emissiveMap: groundTex,
			emissiveIntensity: 0.35,
			color: 0x060a12,
			roughness: 0.95
		})
	);
	ground.rotation.x = -Math.PI / 2;
	ground.position.set(0, 0, -350);
	scene.add(ground);

	/* ---------------- camera path: dive + canyon slalom + climb ----------- */
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

	/* sample the path so the city keeps a flight corridor clear */
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

	/* ---------------- the city: thousands of instanced towers ------------- */
	var facadeMats = [
		towerMaterialFromTex(makeFacade(0.42, 0.6)),
		towerMaterialFromTex(makeFacade(0.3, 0.35)),
		towerMaterialFromTex(makeFacade(0.5, 0.75))
	];
	var boxGeo = new THREE.BoxGeometry(1, 1, 1);
	boxGeo.translate(0, 0.5, 0); /* scale.y = height, base on ground */

	var lots = [];
	(function planCity() {
		var block = 34;
		var nx = isMobile ? 13 : 21;     /* blocks each side of the axis */
		var nz = isMobile ? 26 : 34;     /* blocks deep */
		for (var bx = -nx; bx <= nx; bx++) {
			for (var bz = 2; bz > -nz; bz--) {
				var cx = bx * block;
				var cz = bz * block - 60;
				if (Math.random() < 0.06) { continue; } /* plazas */
				/* distance to the flight axis shapes the skyline */
				var coreness = Math.max(0, 1 - Math.abs(cx) / (nx * block));
				var depth = Math.min(1, Math.max(0, (-cz - 40) / 560));
				var tallBoost = coreness * (0.5 + 0.7 * Math.sin(depth * Math.PI));
				/* two lots per block */
				for (var lot = 0; lot < 2; lot++) {
					var lx = cx + (lot === 0 ? -block * 0.22 : block * 0.24) + (Math.random() - 0.5) * 4;
					var lz = cz + (Math.random() - 0.5) * block * 0.4;
					if (!corridorClear(lx, lz, 26)) { continue; }
					var w = 8 + Math.random() * 9;
					var d = 8 + Math.random() * 9;
					var h = 12 + Math.random() * 30 + tallBoost * (40 + Math.random() * 95);
					lots.push({ x: lx, z: lz, w: w, d: d, h: h, v: (Math.random() * 3) | 0 });
				}
			}
		}
	})();

	var counts = [0, 0, 0];
	lots.forEach(function (l) { counts[l.v]++; });
	var cityMeshes = facadeMats.map(function (mat, vi) {
		return new THREE.InstancedMesh(boxGeo, mat, Math.max(counts[vi], 1));
	});
	(function placeCity() {
		var dummy = new THREE.Object3D();
		var idx = [0, 0, 0];
		var tint = new THREE.Color();
		lots.forEach(function (l) {
			dummy.position.set(l.x, 0, l.z);
			dummy.scale.set(l.w, l.h, l.d);
			dummy.rotation.y = 0;
			dummy.updateMatrix();
			var m = cityMeshes[l.v];
			m.setMatrixAt(idx[l.v], dummy.matrix);
			var b = 0.55 + Math.random() * 0.55;
			tint.setRGB(b, b * (0.96 + Math.random() * 0.08), b * (1 + Math.random() * 0.12));
			m.setColorAt(idx[l.v], tint);
			idx[l.v]++;
		});
		cityMeshes.forEach(function (m) {
			m.instanceMatrix.needsUpdate = true;
			if (m.instanceColor) { m.instanceColor.needsUpdate = true; }
			scene.add(m);
		});
	})();

	/* rooftop antennas + blinking beacons on the tall towers */
	var tallLots = lots.filter(function (l) { return l.h > 70; });
	var antGeo = new THREE.CylinderGeometry(0.25, 0.45, 9, 5);
	antGeo.translate(0, 4.5, 0);
	var antennas = new THREE.InstancedMesh(
		antGeo,
		new THREE.MeshStandardMaterial({ color: 0x2c3a55, roughness: 0.6, metalness: 0.5 }),
		Math.max(tallLots.length, 1)
	);
	var beaconGroups = [[], [], []];
	(function () {
		var dummy = new THREE.Object3D();
		tallLots.forEach(function (l, i) {
			dummy.position.set(l.x, l.h, l.z);
			dummy.scale.set(1, 1, 1);
			dummy.updateMatrix();
			antennas.setMatrixAt(i, dummy.matrix);
			beaconGroups[i % 3].push(new THREE.Vector3(l.x, l.h + 9.4, l.z));
		});
		antennas.instanceMatrix.needsUpdate = true;
		scene.add(antennas);
	})();
	var beaconMats = [];
	beaconGroups.forEach(function (pts, gi) {
		if (!pts.length) { return; }
		var g = new THREE.BufferGeometry().setFromPoints(pts);
		var mat = new THREE.PointsMaterial({
			color: 0xff5a4e,
			size: 2.6,
			transparent: true,
			opacity: 0.9,
			sizeAttenuation: true,
			depthWrite: false
		});
		mat.userData.phase = gi * 2.1;
		beaconMats.push(mat);
		scene.add(new THREE.Points(g, mat));
	});

	/* ---------------- swing-by towers: detailed, hugging the curve -------- */
	var heroTowerMat = towerMaterialFromTex(makeFacade(0.55, 0.7));
	var neonTrimMat = new THREE.MeshBasicMaterial({ color: TEAL });
	var neonTrimMat2 = new THREE.MeshBasicMaterial({ color: 0x9d8cff });
	(function swingTowers() {
		var spots = [0.34, 0.42, 0.5, 0.58, 0.66, 0.73];
		spots.forEach(function (t, i) {
			var p = path.getPointAt(t);
			var ahead = path.getPointAt(Math.min(t + 0.02, 1));
			var dirx = ahead.x - p.x;
			/* put the tower on the outside of the turn */
			var side = dirx > 0 ? -1 : 1;
			var x = p.x + side * (20 + Math.random() * 5);
			var z = p.z - 6;
			if (!corridorClear(x, z, 14)) { x += side * 10; }
			var w = 14 + Math.random() * 5;
			var h = Math.max(p.y + 38 + Math.random() * 30, 84);
			var tower = new THREE.Mesh(boxGeo.clone(), heroTowerMat);
			tower.position.set(x, 0, z);
			tower.scale.set(w, h, w);
			scene.add(tower);
			/* neon trim ring near the top */
			var trim = new THREE.Mesh(
				new THREE.BoxGeometry(w + 0.7, 0.55, w + 0.7),
				i % 2 ? neonTrimMat2 : neonTrimMat
			);
			trim.position.set(x, h * 0.92, z);
			scene.add(trim);
		});
	})();

	/* ---------------- neon billboards on the flight line ------------------ */
	function makeBillboardTex(line1, line2, hue) {
		var c = document.createElement('canvas');
		c.width = 512;
		c.height = 256;
		var x = c.getContext('2d');
		x.fillStyle = '#070d18';
		x.fillRect(0, 0, 512, 256);
		x.strokeStyle = hue;
		x.lineWidth = 6;
		x.strokeRect(10, 10, 492, 236);
		x.fillStyle = hue;
		x.font = '700 64px Cinzel, Georgia, serif';
		x.textAlign = 'center';
		x.shadowColor = hue;
		x.shadowBlur = 26;
		x.fillText(line1, 256, 118);
		x.font = '500 34px "IBM Plex Mono", monospace';
		x.fillText(line2, 256, 188);
		return new THREE.CanvasTexture(c);
	}
	function addBillboard(t, side, line1, line2, hue) {
		var p = path.getPointAt(t);
		var x = p.x + side * 24;
		var z = p.z - 14;
		var board = new THREE.Mesh(
			new THREE.PlaneGeometry(26, 13),
			new THREE.MeshBasicMaterial({
				map: makeBillboardTex(line1, line2, hue),
				transparent: true,
				side: THREE.DoubleSide
			})
		);
		board.position.set(x, p.y + 6, z);
		board.lookAt(p.x, p.y + 4, p.z + 30);
		scene.add(board);
	}
	addBillboard(0.38, 1, 'EPIGENOME.COM', 'THE CATEGORY NAME', '#38e8d2');
	addBillboard(0.54, -1, 'FOR SALE', 'ONE WORD · ONE .COM', '#e3c688');
	addBillboard(0.7, 1, 'EPIGENOME.COM', 'ABOVE THE GENOME', '#9d8cff');

	/* ---------------- traffic streaks on the avenues ---------------------- */
	var carGeo = new THREE.BoxGeometry(0.9, 0.5, 4.2);
	carGeo.translate(0, 0.25, 0);
	var nCars = isMobile ? 50 : 130;
	var carsTeal = new THREE.InstancedMesh(
		carGeo, new THREE.MeshBasicMaterial({ color: 0x9fe8ff }), nCars
	);
	var carsAmber = new THREE.InstancedMesh(
		carGeo, new THREE.MeshBasicMaterial({ color: 0xffb46a }), nCars
	);
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
		var n = isMobile ? 500 : 1200;
		var pos = new Float32Array(n * 3);
		for (var i = 0; i < n; i++) {
			pos[i * 3] = (Math.random() - 0.5) * 2400;
			pos[i * 3 + 1] = 260 + Math.random() * 600;
			pos[i * 3 + 2] = -900 + Math.random() * 1400;
		}
		var g = new THREE.BufferGeometry();
		g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
		scene.add(new THREE.Points(g, new THREE.PointsMaterial({
			color: 0xbfd2ee, size: 1.4, sizeAttenuation: true, transparent: true, opacity: 0.8
		})));
	})();

	/* ---------------- the crown: destination tower + holo helix ----------- */
	var crownBase = new THREE.Vector3(0, 0, -742);
	var holoGroup = new THREE.Group();
	var diamond;
	(function crown() {
		var h = 160;
		var tower = new THREE.Mesh(boxGeo.clone(), heroTowerMat);
		tower.position.set(crownBase.x, 0, crownBase.z);
		tower.scale.set(26, h, 26);
		scene.add(tower);
		var trim = new THREE.Mesh(new THREE.BoxGeometry(27.2, 0.8, 27.2), neonTrimMat);
		trim.position.set(crownBase.x, h - 3, crownBase.z);
		scene.add(trim);
		var pad = new THREE.Mesh(
			new THREE.CylinderGeometry(15, 16.5, 2.4, 24),
			new THREE.MeshStandardMaterial({ color: 0x121a2c, roughness: 0.8, metalness: 0.3 })
		);
		pad.position.set(crownBase.x, h + 1.2, crownBase.z);
		scene.add(pad);

		/* holographic DNA helix */
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
			color: TEAL, transparent: true, opacity: 0.55,
			blending: THREE.AdditiveBlending, depthWrite: false
		});
		var holoMat2 = new THREE.MeshBasicMaterial({
			color: 0x9d8cff, transparent: true, opacity: 0.5,
			blending: THREE.AdditiveBlending, depthWrite: false
		});
		holoGroup.add(new THREE.Mesh(
			new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ptsA), isMobile ? 50 : 90, 0.34, 8), holoMat
		));
		holoGroup.add(new THREE.Mesh(
			new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ptsB), isMobile ? 50 : 90, 0.34, 8), holoMat2
		));
		var rungMat = new THREE.MeshBasicMaterial({
			color: 0xbffbf2, transparent: true, opacity: 0.4,
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

		/* gold diamond inside the helix */
		diamond = new THREE.Mesh(
			new THREE.OctahedronGeometry(3.2),
			new THREE.MeshStandardMaterial({
				color: GOLD, roughness: 0.2, metalness: 0.75,
				emissive: 0xc9952e, emissiveIntensity: 0.7
			})
		);
		diamond.position.set(crownBase.x, h + 16, crownBase.z);
		scene.add(diamond);
		crownLight.position.set(crownBase.x, h + 18, crownBase.z + 8);
	})();

	/* ---------------- camera driving ---------------- */
	var camPos = new THREE.Vector3();
	var camTarget = new THREE.Vector3();
	var lastX = 0;
	var bank = 0;
	var progress = 0;
	var progressGoal = 0;
	var mouseX = 0;
	var mouseY = 0;
	var DOWN_BLEND_END = 0.1;

	function setCamera(p, dt) {
		var t = Math.min(Math.max(p, 0), 1);
		path.getPointAt(t, camPos);
		camera.position.set(
			camPos.x + mouseX * 2.2,
			camPos.y + -mouseY * 1.6,
			camPos.z
		);

		/* top view at the start, blending into flight view */
		var aheadT = Math.min(t + 0.03, 1);
		path.getPointAt(aheadT, camTarget);
		if (t < DOWN_BLEND_END) {
			var k = t / DOWN_BLEND_END;          /* 0 = straight down */
			k = k * k * (3 - 2 * k);
			var down = new THREE.Vector3(camPos.x, 0, camPos.z - 26);
			camTarget.lerpVectors(down, camTarget, k);
		}
		/* settle on the diamond at the very top */
		if (t > 0.93 && diamond) {
			camTarget.lerp(diamond.position, (t - 0.93) / 0.07);
		}
		camera.lookAt(camTarget);

		/* banking: roll into the lateral motion like a swing */
		var vx = (camPos.x - lastX) / Math.max(dt || 0.016, 0.001);
		lastX = camPos.x;
		var targetBank = THREE.MathUtils.clamp(-vx * 0.0035, -0.42, 0.42);
		/* only bank while inside the canyon run */
		if (t < 0.16 || t > 0.88) { targetBank = 0; }
		bank += (targetBank - bank) * Math.min((dt || 0.016) * 4, 1);
		camera.rotateZ(bank);
	}

	/* progress hook for main.js, with a scroll fallback */
	window.EPI_SCENE = {
		setProgress: function (p) { progressGoal = p; }
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

	function animate() {
		requestAnimationFrame(animate);
		if (hidden) { return; }
		if (!window.EPI_SCENE.driven) { readScrollFallback(); }
		var dt = Math.min(clock.getDelta(), 0.05);
		var et = clock.elapsedTime;

		progress += (progressGoal - progress) * Math.min(dt * 5.5, 1);
		setCamera(progress, dt);

		holoGroup.rotation.y = et * 0.5;
		if (diamond) {
			diamond.rotation.y = et * 0.7;
			diamond.position.y += Math.sin(et * 1.3) * 0.012;
		}
		for (var bi = 0; bi < beaconMats.length; bi++) {
			beaconMats[bi].opacity =
				0.25 + Math.abs(Math.sin(et * 1.8 + beaconMats[bi].userData.phase)) * 0.75;
		}
		crownLight.intensity = 0.5 + Math.max(0, progress - 0.7) * 5 + Math.sin(et * 2.4) * 0.1;
		updateCars(et);

		renderer.render(scene, camera);
	}

	function renderOnce() {
		updateCars(8);
		setCamera(0.05, 0.016);
		renderer.render(scene, camera);
	}

	resize();
	if (reduceMotion) {
		renderOnce();
	} else {
		animate();
	}
})();
