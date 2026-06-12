/* ==========================================================================
   EPIGENOME.COM — monument scene
   A scroll-driven Three.js journey: across a green marble plain, through
   a monumental gateway, down a colonnade, through a floating DNA-helix
   sculpture and a gold ring, up the stairs to the peak where a gold
   diamond burns above the terms.
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
	var GREEN_BG = 0x1d2f24;
	var GREEN_DEEP = 0x16251c;
	var IVORY = 0xece6d4;
	var IVORY_DIM = 0xd6cfba;
	var GOLD = 0xc9a45c;

	renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 1.75));
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1.05;

	var scene = new THREE.Scene();
	scene.background = new THREE.Color(GREEN_BG);
	scene.fog = new THREE.Fog(GREEN_BG, 18, isMobile ? 95 : 130);

	var camera = new THREE.PerspectiveCamera(46, 1, 0.1, 400);

	/* ---------------- lights ---------------- */
	var hemi = new THREE.HemisphereLight(0xf4eedd, 0x0f1d15, 0.85);
	scene.add(hemi);
	var key = new THREE.DirectionalLight(0xfff3da, 1.15);
	key.position.set(-14, 26, 10);
	scene.add(key);
	var rim = new THREE.DirectionalLight(0xbfd8c2, 0.35);
	rim.position.set(18, 10, -30);
	scene.add(rim);
	var peakGlow = new THREE.PointLight(0xd8ab55, 0, 60);
	peakGlow.position.set(0, 14, -298);
	scene.add(peakGlow);

	/* ---------------- materials ---------------- */
	var mIvory = new THREE.MeshStandardMaterial({ color: IVORY, roughness: 0.62, metalness: 0.04 });
	var mIvoryDim = new THREE.MeshStandardMaterial({ color: IVORY_DIM, roughness: 0.72, metalness: 0.03 });
	var mGold = new THREE.MeshStandardMaterial({ color: GOLD, roughness: 0.28, metalness: 0.85 });
	var mGoldGlow = new THREE.MeshStandardMaterial({
		color: GOLD,
		roughness: 0.2,
		metalness: 0.7,
		emissive: 0xb98c33,
		emissiveIntensity: 0.55
	});
	var mGround = new THREE.MeshStandardMaterial({ color: GREEN_DEEP, roughness: 0.95, metalness: 0 });

	/* ---------------- world ---------------- */
	var world = new THREE.Group();
	scene.add(world);

	/* ground plain */
	var ground = new THREE.Mesh(new THREE.PlaneGeometry(600, 800), mGround);
	ground.rotation.x = -Math.PI / 2;
	ground.position.set(0, 0, -200);
	world.add(ground);

	/* processional pathway — a long, slightly raised ivory walkway */
	var walkway = new THREE.Mesh(new THREE.BoxGeometry(7, 0.3, 340), mIvoryDim);
	walkway.position.set(0, 0.15, -150);
	world.add(walkway);

	function addBox(w, h, d, x, y, z, mat, parent) {
		var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat || mIvory);
		m.position.set(x, y, z);
		(parent || world).add(m);
		return m;
	}

	/* ---- monumental gateway (station 1, z ≈ -58) ---- */
	function buildGate(z, scale) {
		var g = new THREE.Group();
		var s = scale || 1;
		addBox(3.2 * s, 13 * s, 3.2 * s, -6.4 * s, 6.5 * s, 0, mIvory, g);
		addBox(3.2 * s, 13 * s, 3.2 * s, 6.4 * s, 6.5 * s, 0, mIvory, g);
		addBox(17.2 * s, 2.4 * s, 3.6 * s, 0, 14.2 * s, 0, mIvory, g);
		addBox(15 * s, 1.1 * s, 3.0 * s, 0, 16 * s, 0, mIvoryDim, g);
		/* steps */
		addBox(22 * s, 0.5, 7 * s, 0, 0.25, 0, mIvoryDim, g);
		addBox(19 * s, 0.5, 5.6 * s, 0, 0.75, 0, mIvoryDim, g);
		/* gold seal on the lintel */
		var seal = new THREE.Mesh(new THREE.OctahedronGeometry(0.9 * s), mGold);
		seal.position.set(0, 14.2 * s, 1.9 * s);
		g.add(seal);
		g.position.z = z;
		world.add(g);
		return g;
	}
	buildGate(-58, 1);

	/* ---- colonnade (station 2, z ≈ -85 → -165) ---- */
	var colGeo = new THREE.CylinderGeometry(0.85, 1.0, 12, isMobile ? 10 : 16);
	var capGeo = new THREE.BoxGeometry(2.6, 0.7, 2.6);
	var baseGeo = new THREE.BoxGeometry(2.8, 0.6, 2.8);
	var nCols = isMobile ? 7 : 10;
	var cols = new THREE.InstancedMesh(colGeo, mIvory, nCols * 2);
	var caps = new THREE.InstancedMesh(capGeo, mIvoryDim, nCols * 2);
	var bases = new THREE.InstancedMesh(baseGeo, mIvoryDim, nCols * 2);
	var dummy = new THREE.Object3D();
	var ci = 0;
	for (var side = -1; side <= 1; side += 2) {
		for (var c = 0; c < nCols; c++) {
			var cz = -85 - c * (80 / (nCols - 1));
			dummy.position.set(side * 9.5, 6, cz);
			dummy.updateMatrix();
			cols.setMatrixAt(ci, dummy.matrix);
			dummy.position.set(side * 9.5, 12.35, cz);
			dummy.updateMatrix();
			caps.setMatrixAt(ci, dummy.matrix);
			dummy.position.set(side * 9.5, 0.3, cz);
			dummy.updateMatrix();
			bases.setMatrixAt(ci, dummy.matrix);
			ci++;
		}
	}
	world.add(cols);
	world.add(caps);
	world.add(bases);

	/* architrave beams above the columns */
	addBox(2.2, 1.0, 84, -9.5, 13.2, -125, mIvoryDim);
	addBox(2.2, 1.0, 84, 9.5, 13.2, -125, mIvoryDim);

	/* ---- DNA helix sculpture, floating over the colonnade (z ≈ -118) ----
	   the camera passes directly beneath/through its lower arc */
	var helixGroup = new THREE.Group();
	(function buildHelix() {
		var turns = 2.4;
		var length = 30;
		var radius = 4.2;
		var ptsA = [];
		var ptsB = [];
		for (var i = 0; i <= 80; i++) {
			var t = i / 80;
			var ang = t * Math.PI * 2 * turns;
			var z = -length / 2 + t * length;
			ptsA.push(new THREE.Vector3(Math.cos(ang) * radius, Math.sin(ang) * radius, z));
			ptsB.push(new THREE.Vector3(Math.cos(ang + Math.PI) * radius, Math.sin(ang + Math.PI) * radius, z));
		}
		var tubeA = new THREE.Mesh(
			new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ptsA), isMobile ? 60 : 120, 0.32, isMobile ? 6 : 10),
			mIvory
		);
		var tubeB = new THREE.Mesh(
			new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ptsB), isMobile ? 60 : 120, 0.32, isMobile ? 6 : 10),
			mIvory
		);
		helixGroup.add(tubeA);
		helixGroup.add(tubeB);
		/* rungs */
		var nR = 13;
		var rungGeo = new THREE.CylinderGeometry(0.13, 0.13, radius * 2, 8);
		var rungs = new THREE.InstancedMesh(rungGeo, mGold, nR);
		for (var r = 0; r < nR; r++) {
			var tr = r / (nR - 1);
			var angR = tr * Math.PI * 2 * turns;
			var zr = -length / 2 + tr * length;
			dummy.position.set(0, 0, zr);
			dummy.rotation.set(0, 0, angR + Math.PI / 2);
			dummy.updateMatrix();
			rungs.setMatrixAt(r, dummy.matrix);
		}
		helixGroup.add(rungs);
	})();
	helixGroup.position.set(0, 7.5, -118);
	world.add(helixGroup);

	/* ---- gold ring gate (station 3, z ≈ -172) — camera flies through ---- */
	var ring = new THREE.Mesh(new THREE.TorusGeometry(5.2, 0.28, 12, isMobile ? 40 : 72), mGold);
	ring.position.set(0, 5, -172);
	world.add(ring);
	var ringInner = new THREE.Mesh(new THREE.TorusGeometry(4.4, 0.08, 8, isMobile ? 32 : 60), mIvoryDim);
	ringInner.position.copy(ring.position);
	world.add(ringInner);

	/* ---- hall of comps: four obelisks (station 4, z ≈ -195 → -225) ---- */
	for (var o = 0; o < 4; o++) {
		var ox = (o % 2 === 0 ? -1 : 1) * 8.5;
		var oz = -196 - Math.floor(o / 2) * 22;
		addBox(2.4, 0.8, 2.4, ox, 0.4, oz, mIvoryDim);
		var shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.95, 9, 4), mIvory);
		shaft.position.set(ox, 5.2, oz);
		shaft.rotation.y = Math.PI / 4;
		world.add(shaft);
		var tip = new THREE.Mesh(new THREE.ConeGeometry(0.62, 1.4, 4), mGold);
		tip.position.set(ox, 10.4, oz);
		tip.rotation.y = Math.PI / 4;
		world.add(tip);
	}

	/* ---- grand stairs to the peak (station 5, z ≈ -252 → -276) ---- */
	var nSteps = 9;
	for (var st = 0; st < nSteps; st++) {
		addBox(26 - st * 1.4, 0.9, 3.4, 0, 0.45 + st * 0.9, -252 - st * 3, mIvoryDim);
	}

	/* ---- peak temple + burning diamond (station 6, z ≈ -296) ---- */
	var diamond;
	(function buildPeak() {
		var py = nSteps * 0.9;
		addBox(20, 1.2, 18, 0, py + 0.6, -296, mIvory);
		for (var pc = 0; pc < 4; pc++) {
			var px = pc % 2 === 0 ? -7 : 7;
			var pz = -290 - Math.floor(pc / 2) * 12;
			var col = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.85, 9, 14), mIvory);
			col.position.set(px, py + 5.7, pz);
			world.add(col);
		}
		addBox(17.4, 1.1, 15, 0, py + 10.8, -296, mIvoryDim);
		/* pediment */
		var ped = new THREE.Mesh(new THREE.CylinderGeometry(0.001, 9.2, 3.4, 4), mIvory);
		ped.rotation.y = Math.PI / 4;
		ped.scale.z = 0.62;
		ped.position.set(0, py + 13.1, -296);
		world.add(ped);
		/* the diamond */
		diamond = new THREE.Mesh(new THREE.OctahedronGeometry(1.9), mGoldGlow);
		diamond.position.set(0, py + 6.4, -296);
		world.add(diamond);
		peakGlow.position.set(0, py + 6.4, -294);
	})();

	/* ---- dust motes ---- */
	var dustN = isMobile ? 260 : 700;
	var dustGeo = new THREE.BufferGeometry();
	var dustPos = new Float32Array(dustN * 3);
	for (var dp = 0; dp < dustN; dp++) {
		dustPos[dp * 3] = (Math.random() - 0.5) * 70;
		dustPos[dp * 3 + 1] = Math.random() * 18 + 0.5;
		dustPos[dp * 3 + 2] = -Math.random() * 320 + 10;
	}
	dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
	var dustTex = (function () {
		var c = document.createElement('canvas');
		c.width = 64;
		c.height = 64;
		var x = c.getContext('2d');
		var g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
		g.addColorStop(0, 'rgba(240,232,210,1)');
		g.addColorStop(0.4, 'rgba(240,232,210,0.45)');
		g.addColorStop(1, 'rgba(240,232,210,0)');
		x.fillStyle = g;
		x.fillRect(0, 0, 64, 64);
		var tx = new THREE.CanvasTexture(c);
		return tx;
	})();
	var dust = new THREE.Points(
		dustGeo,
		new THREE.PointsMaterial({
			size: 0.5,
			map: dustTex,
			transparent: true,
			opacity: 0.5,
			depthWrite: false,
			sizeAttenuation: true
		})
	);
	world.add(dust);

	/* ---------------- camera path ---------------- */
	var path = new THREE.CatmullRomCurve3([
		new THREE.Vector3(0, 4.2, 16),
		new THREE.Vector3(0, 3.8, -18),
		new THREE.Vector3(0, 3.6, -45),
		new THREE.Vector3(0, 3.4, -61),   /* through the gate */
		new THREE.Vector3(1.6, 3.6, -96),
		new THREE.Vector3(-1.4, 4.2, -130), /* under the helix */
		new THREE.Vector3(0, 5.0, -172),  /* through the gold ring */
		new THREE.Vector3(0, 3.8, -206),  /* obelisk hall */
		new THREE.Vector3(0, 4.6, -242),
		new THREE.Vector3(0, 9.5, -266),  /* climbing the stairs */
		new THREE.Vector3(0, 13.4, -283)  /* the peak */
	]);
	var lookAhead = 0.035;
	var camPos = new THREE.Vector3();
	var camTarget = new THREE.Vector3();

	var progress = 0;       /* smoothed */
	var progressGoal = 0;   /* raw from scroll */
	var mouseX = 0;
	var mouseY = 0;

	function setCamera(p) {
		var t = Math.min(Math.max(p, 0), 1);
		path.getPointAt(t, camPos);
		path.getPointAt(Math.min(t + lookAhead, 1), camTarget);
		camera.position.copy(camPos);
		camera.position.x += mouseX * 0.6;
		camera.position.y += -mouseY * 0.4;
		/* at the very end, look at the diamond */
		if (t > 0.94 && diamond) {
			camTarget.lerp(diamond.position, (t - 0.94) / 0.06);
		}
		camera.lookAt(camTarget);
	}

	/* expose progress hook for main.js / fallback to window scroll */
	window.EPI_SCENE = {
		setProgress: function (p) {
			progressGoal = p;
		}
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
		if (reduceMotion) {
			renderOnce();
		}
	}
	window.addEventListener('resize', resize);

	var clock = new THREE.Clock();
	var hidden = false;
	document.addEventListener('visibilitychange', function () {
		hidden = document.hidden;
	});

	function animate() {
		requestAnimationFrame(animate);
		if (hidden) {
			return;
		}
		if (!window.EPI_SCENE.driven) {
			readScrollFallback();
		}
		var dt = Math.min(clock.getDelta(), 0.05);
		var et = clock.elapsedTime;

		progress += (progressGoal - progress) * Math.min(dt * 5.5, 1);
		setCamera(progress);

		helixGroup.rotation.z += dt * 0.25;
		ring.rotation.z += dt * 0.2;
		ringInner.rotation.z -= dt * 0.3;
		if (diamond) {
			diamond.rotation.y += dt * 0.6;
			diamond.position.y += Math.sin(et * 1.4) * 0.004;
		}
		dust.rotation.y = et * 0.004;
		/* the peak light breathes awake near the end */
		peakGlow.intensity = 0.25 + Math.max(0, progress - 0.7) * 6 + Math.sin(et * 2.2) * 0.08;

		renderer.render(scene, camera);
	}

	function renderOnce() {
		setCamera(0.08);
		renderer.render(scene, camera);
	}

	resize();
	if (reduceMotion) {
		renderOnce();
	} else {
		animate();
	}
})();
