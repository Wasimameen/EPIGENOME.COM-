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

	/* ---- New York skyline — detailed art-deco towers flanking the route ----
	   stepped setbacks, cornices, pier-and-spandrel facades, gold crowns,
	   rooftop water towers; each tower rises as the camera approaches */
	var towers = [];
	var beacons = [];

	/* pier-and-spandrel facade: vertical ivory ribs, recessed window
	   columns, a share of warm lit panes — three variants for variety */
	function makeFacadeTexture() {
		var c = document.createElement('canvas');
		c.width = 128;
		c.height = 256;
		var x = c.getContext('2d');
		x.fillStyle = '#e9e2cf';
		x.fillRect(0, 0, 128, 256);
		var cols = 7;
		var rows = 16;
		var cw = 128 / cols;
		var ch = 256 / rows;
		/* recessed window strips between piers */
		for (var cc = 0; cc < cols; cc++) {
			x.fillStyle = 'rgba(26, 40, 31, 0.18)';
			x.fillRect(cc * cw + cw * 0.18, 0, cw * 0.64, 256);
		}
		for (var r = 0; r < rows; r++) {
			for (var c2 = 0; c2 < cols; c2++) {
				var roll = Math.random();
				var litGold = roll < 0.12;
				var litWarm = !litGold && roll < 0.2;
				x.fillStyle = litGold
					? 'rgba(218, 173, 86, 0.95)'
					: litWarm
						? 'rgba(214, 196, 150, 0.85)'
						: 'rgba(24, 38, 29, ' + (0.5 + Math.random() * 0.25) + ')';
				x.fillRect(c2 * cw + cw * 0.24, r * ch + ch * 0.2, cw * 0.52, ch * 0.52);
			}
			/* spandrel shadow line under each window row */
			x.fillStyle = 'rgba(26, 40, 31, 0.12)';
			x.fillRect(0, r * ch + ch * 0.78, 128, 2);
		}
		/* pier highlights */
		for (var p = 0; p <= cols; p++) {
			x.fillStyle = 'rgba(255, 252, 240, 0.5)';
			x.fillRect(p * cw - 1, 0, 2, 256);
		}
		var tx = new THREE.CanvasTexture(c);
		tx.wrapS = THREE.RepeatWrapping;
		tx.wrapT = THREE.RepeatWrapping;
		tx.anisotropy = 4;
		return tx;
	}
	var facades = [makeFacadeTexture(), makeFacadeTexture(), makeFacadeTexture()];

	function towerMaterial(wSeg, hSeg) {
		var tex = facades[(Math.random() * facades.length) | 0].clone();
		tex.needsUpdate = true;
		tex.repeat.set(Math.max(1, Math.round(wSeg)), Math.max(1, Math.round(hSeg)));
		return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8, metalness: 0.04 });
	}

	var mBeacon = new THREE.MeshStandardMaterial({
		color: 0xd8ab55,
		emissive: 0xd8ab55,
		emissiveIntensity: 1
	});

	function registerTower(group, z, appear) {
		group.scale.y = 0.001;
		world.add(group);
		towers.push({ g: group, z: z, appear: appear || 70 });
	}

	function addBeacon(g, y, size) {
		var b = new THREE.Mesh(new THREE.SphereGeometry(size || 0.16, 8, 8), mBeacon.clone());
		b.position.y = y;
		g.add(b);
		beacons.push(b);
		return b;
	}

	/* tiny NYC rooftop water tower: tank, conical lid, stilts */
	function addWaterTower(g, x, y, z) {
		var tank = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.62, 1.1, 9), mIvoryDim);
		tank.position.set(x, y + 1.0, z);
		g.add(tank);
		var lid = new THREE.Mesh(new THREE.ConeGeometry(0.68, 0.55, 9), mGold);
		lid.position.set(x, y + 1.83, z);
		g.add(lid);
		var legs = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.58, 0.5, 6, 1, true), mIvoryDim);
		legs.position.set(x, y + 0.25, z);
		g.add(legs);
	}

	/* a cornice lip + optional gold trim line at a setback */
	function addCornice(g, w, y, gold) {
		var lip = new THREE.Mesh(new THREE.BoxGeometry(w + 0.55, 0.34, w + 0.55), mIvoryDim);
		lip.position.y = y;
		g.add(lip);
		if (gold) {
			var trim = new THREE.Mesh(new THREE.BoxGeometry(w + 0.62, 0.09, w + 0.62), mGold);
			trim.position.y = y - 0.22;
			g.add(trim);
		}
	}

	/* generic stepped-setback tower (the Manhattan staple) */
	function buildTower(xPos, zPos, baseW, totalH, detail) {
		var g = new THREE.Group();
		/* street podium with entrance */
		var podW = baseW * 1.25;
		var pod = new THREE.Mesh(new THREE.BoxGeometry(podW, 2.2, podW), towerMaterial(podW / 2.2, 1));
		pod.position.y = 1.1;
		g.add(pod);
		addCornice(g, podW, 2.35, detail > 0.4);
		var door = new THREE.Mesh(new THREE.BoxGeometry(baseW * 0.32, 1.5, 0.2), mGold);
		door.position.set(0, 0.75, podW / 2 + 0.02);
		g.add(door);

		var levels = 2 + ((Math.random() * 2) | 0);
		var w = baseW;
		var y = 2.2;
		var rem = totalH - 2.2;
		for (var i = 0; i < levels; i++) {
			var lh = i === levels - 1 ? rem : rem * (0.42 + Math.random() * 0.18);
			var mesh = new THREE.Mesh(
				new THREE.BoxGeometry(w, lh, w),
				towerMaterial(w / 2.2, lh / 2.4)
			);
			mesh.position.y = y + lh / 2;
			g.add(mesh);
			y += lh;
			rem -= lh;
			addCornice(g, w, y + 0.1, i === 0 && detail > 0.35);
			w *= 0.66 + Math.random() * 0.1;
		}

		/* crown: mast / gold ziggurat / pyramid cap */
		var crownRoll = Math.random();
		if (crownRoll < 0.38) {
			var spire = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.16, totalH * 0.22, 6), mGold);
			spire.position.y = y + totalH * 0.11;
			g.add(spire);
			addBeacon(g, y + totalH * 0.22 + 0.2);
		} else if (crownRoll < 0.66) {
			var zw = w * 1.15;
			for (var zi = 0; zi < 3; zi++) {
				var zig = new THREE.Mesh(new THREE.BoxGeometry(zw, 0.6, zw), zi === 2 ? mGold : mIvory);
				zig.position.y = y + 0.3 + zi * 0.6;
				g.add(zig);
				zw *= 0.62;
			}
		} else {
			var cap = new THREE.Mesh(new THREE.ConeGeometry(w * 0.78, w * 0.9, 4), detail > 0.5 ? mGold : mIvoryDim);
			cap.rotation.y = Math.PI / 4;
			cap.position.y = y + w * 0.45;
			g.add(cap);
		}

		/* rooftop water tower on the first setback */
		if (detail > 0.45 && levels > 1) {
			addWaterTower(g, baseW * 0.28, 2.2 + (totalH - 2.2) * 0.46, -baseW * 0.22);
		}

		g.position.set(xPos, 0, zPos);
		registerTower(g, zPos);
		return g;
	}

	/* Empire State silhouette — five setbacks, cornices, mast, antenna */
	function buildEmpire(xPos, zPos) {
		var g = new THREE.Group();
		var widths = [9.4, 7.6, 6.1, 4.7, 3.3];
		var heights = [10, 9, 9, 8, 6];
		var y = 0;
		for (var i = 0; i < widths.length; i++) {
			var mesh = new THREE.Mesh(
				new THREE.BoxGeometry(widths[i], heights[i], widths[i]),
				towerMaterial(widths[i] / 2.2, heights[i] / 2.4)
			);
			mesh.position.y = y + heights[i] / 2;
			g.add(mesh);
			y += heights[i];
			addCornice(g, widths[i], y + 0.1, i < 2);
		}
		var mast = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.95, 3.4, 10), mIvoryDim);
		mast.position.y = y + 1.7;
		g.add(mast);
		var antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 7, 6), mGold);
		antenna.position.y = y + 3.4 + 3.5;
		g.add(antenna);
		addBeacon(g, y + 3.4 + 7.2, 0.2);
		addWaterTower(g, 2.6, 19, 2.4);
		g.position.set(xPos, 0, zPos);
		registerTower(g, zPos, 90);
		return g;
	}

	/* Chrysler silhouette — setback shaft, radiant gold crown, needle */
	function buildChrysler(xPos, zPos) {
		var g = new THREE.Group();
		var shaftW = [7.4, 6.2, 5.2];
		var shaftH = [12, 9, 7];
		var y = 0;
		for (var i = 0; i < shaftW.length; i++) {
			var level = new THREE.Mesh(
				new THREE.BoxGeometry(shaftW[i], shaftH[i], shaftW[i]),
				towerMaterial(shaftW[i] / 2.2, shaftH[i] / 2.4)
			);
			level.position.y = y + shaftH[i] / 2;
			g.add(level);
			y += shaftH[i];
			addCornice(g, shaftW[i], y + 0.1, i === 0);
		}
		/* radiant tiered crown */
		var r = 4.4;
		for (var t = 0; t < 6; t++) {
			var crown = new THREE.Mesh(new THREE.ConeGeometry(r, 1.9, 9), t % 2 === 0 ? mGold : mIvory);
			crown.position.y = y + 0.95;
			g.add(crown);
			y += 1.35;
			r *= 0.7;
		}
		var needle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.12, 5.5, 6), mGold);
		needle.position.y = y + 2.4;
		g.add(needle);
		addBeacon(g, y + 5.0, 0.14);
		g.position.set(xPos, 0, zPos);
		registerTower(g, zPos, 90);
		return g;
	}

	/* district layout — clear of the processional corridor (|x| ≥ 19) */
	(function buildSkyline() {
		var rnd = function (a, b) { return a + Math.random() * (b - a); };
		var nPerSide = isMobile ? 9 : 20;
		for (var s = -1; s <= 1; s += 2) {
			for (var i = 0; i < nPerSide; i++) {
				var z = -24 - i * (300 / nPerSide) - rnd(0, 8);
				/* keep the two icon plots free */
				if (s === -1 && z < -136 && z > -168) { continue; }
				if (s === 1 && z < -186 && z > -218) { continue; }
				var x = s * rnd(20, 48);
				var h = rnd(13, 34) + (z < -120 && z > -240 ? 8 : 0);
				buildTower(x, z, rnd(4.5, 8.5), h, Math.random());
			}
		}
		buildEmpire(-27, -152);
		buildChrysler(26, -202);
		/* distant backdrop slabs for skyline depth */
		var nBack = isMobile ? 6 : 12;
		for (var b = 0; b < nBack; b++) {
			var bs = b % 2 === 0 ? -1 : 1;
			var bz = -40 - b * (280 / nBack);
			var bx = bs * rnd(54, 80);
			var bw = rnd(8, 14);
			var bh = rnd(24, 48);
			var bg = new THREE.Group();
			var slab = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bw), mIvoryDim);
			slab.position.y = bh / 2;
			bg.add(slab);
			var slabCap = new THREE.Mesh(new THREE.BoxGeometry(bw * 0.62, 1.6, bw * 0.62), mIvory);
			slabCap.position.y = bh + 0.8;
			bg.add(slabCap);
			bg.position.set(bx, 0, 0);
			bg.position.z = bz;
			registerTower(bg, bz, 110);
		}
	})();

	/* towers grow in as the camera approaches */
	function updateTowers(camZ) {
		for (var i = 0; i < towers.length; i++) {
			var t = towers[i];
			var f = 1 - Math.min(Math.max((camZ - t.z - t.appear) / 60, 0), 1);
			f = f * f * (3 - 2 * f); /* smoothstep */
			t.g.scale.y = Math.max(f, 0.001);
		}
	}

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
		updateTowers(camera.position.z);
		for (var bi = 0; bi < beacons.length; bi++) {
			beacons[bi].material.emissiveIntensity =
				0.55 + Math.abs(Math.sin(et * 1.6 + bi * 1.3)) * 0.9;
		}

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
		updateTowers(camera.position.z);
		renderer.render(scene, camera);
	}

	resize();
	if (reduceMotion) {
		renderOnce();
	} else {
		animate();
	}
})();
