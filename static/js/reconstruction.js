/* ============================================================
   3D РЕКОНСТРУКЦИЯ — Three.js болжамды тарихи көрініс
   Мешіт · ескі ағаш · Каспий теңізі · жағалау · құдық · түйе
   НАЗАР: бұл фотограмметриялық көшірме ЕМЕС — болжамды бейне.
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var canvas = document.getElementById("recon-canvas");
    if (!canvas || typeof THREE === "undefined") return;

    var reduce = window.__REDUCE_MOTION__;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0f18);
    scene.fog = new THREE.Fog(0x0b0f18, 60, 190);

    var camera = new THREE.PerspectiveCamera(46, 1, 0.1, 400);
    camera.position.set(30, 12, 42);

    /* ---------------- Жарық ---------------- */
    var ambient = new THREE.AmbientLight(0x8a7a5c, 0.55);
    scene.add(ambient);

    var sun = new THREE.DirectionalLight(0xf0cf8f, 1.05);
    sun.position.set(-40, 38, 25);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -60;
    sun.shadow.camera.right = 60;
    sun.shadow.camera.top = 60;
    sun.shadow.camera.bottom = -60;
    scene.add(sun);

    var fill = new THREE.DirectionalLight(0x7fa8b8, 0.18);
    fill.position.set(30, 20, -30);
    scene.add(fill);

    /* ---------------- Материалдар ---------------- */
    var matSand = new THREE.MeshStandardMaterial({ color: 0x8a744f, roughness: 1 });
    var matWall = new THREE.MeshStandardMaterial({ color: 0xb59a6a, roughness: 0.9 });
    var matWallDark = new THREE.MeshStandardMaterial({ color: 0x8f7a52, roughness: 0.95 });
    var matDome = new THREE.MeshStandardMaterial({ color: 0x4d6d74, roughness: 0.55, metalness: 0.15 });
    var matTrunk = new THREE.MeshStandardMaterial({ color: 0x4a3a26, roughness: 1 });
    var matLeaves = new THREE.MeshStandardMaterial({ color: 0x5c6b3f, roughness: 1 });
    var matCamel = new THREE.MeshStandardMaterial({ color: 0x9a7a4e, roughness: 1 });
    var matWater = new THREE.MeshStandardMaterial({ color: 0x1d3a4a, roughness: 0.35, metalness: 0.3 });

    /* ---------------- Құмды жер ---------------- */
    var groundGeo = new THREE.PlaneGeometry(220, 140, 60, 40);
    groundGeo.rotateX(-Math.PI / 2);
    var pos = groundGeo.attributes.position;
    for (var i = 0; i < pos.count; i++) {
      var x = pos.getX(i), z = pos.getZ(i);
      // жұмсақ төбешіктер
      pos.setY(i, Math.sin(x * 0.08) * Math.cos(z * 0.09) * 0.8 + Math.sin(x * 0.02 + z * 0.03) * 1.2);
    }
    groundGeo.computeVertexNormals();
    var ground = new THREE.Mesh(groundGeo, matSand);
    ground.receiveShadow = true;
    scene.add(ground);

    /* ---------------- Каспий теңізі + жағалау ---------------- */
    var seaGeo = new THREE.PlaneGeometry(220, 90, 48, 24);
    seaGeo.rotateX(-Math.PI / 2);
    var sea = new THREE.Mesh(seaGeo, matWater);
    sea.position.set(0, -0.6, -95);
    sea.receiveShadow = true;
    scene.add(sea);
    var seaPos = seaGeo.attributes.position;
    var seaBase = [];
    for (var j = 0; j < seaPos.count; j++) seaBase.push(seaPos.getY(j));

    // Жағалау сызығы — жұқа жарқын жолақ
    var shore = new THREE.Mesh(
      new THREE.PlaneGeometry(220, 3),
      new THREE.MeshBasicMaterial({ color: 0xd9b36c, transparent: true, opacity: 0.22 })
    );
    shore.rotation.x = -Math.PI / 2;
    shore.position.set(0, -0.45, -50);
    scene.add(shore);

    /* ---------------- Мешіт (негізгі focal point) ---------------- */
    var mosque = new THREE.Group();

    var base = new THREE.Mesh(new THREE.BoxGeometry(16, 8, 12), matWall);
    base.position.y = 4;
    base.castShadow = true; base.receiveShadow = true;
    mosque.add(base);

    var upper = new THREE.Mesh(new THREE.BoxGeometry(11, 4.5, 9), matWallDark);
    upper.position.y = 10.2;
    upper.castShadow = true;
    mosque.add(upper);

    var dome = new THREE.Mesh(new THREE.SphereGeometry(4.6, 24, 18, 0, Math.PI * 2, 0, Math.PI / 2), matDome);
    dome.position.y = 12.4;
    dome.castShadow = true;
    mosque.add(dome);

    var finial = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.2, 8), new THREE.MeshStandardMaterial({ color: 0xd9b36c, metalness: 0.6, roughness: 0.3 }));
    finial.position.y = 17.8;
    mosque.add(finial);
    var crescent = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.09, 8, 20, Math.PI * 1.4), finial.material);
    crescent.position.y = 19.2;
    mosque.add(crescent);

    // Мұнара
    var minaret = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.5, 15, 10), matWall);
    minaret.position.set(10.5, 7.5, 3);
    minaret.castShadow = true;
    mosque.add(minaret);
    var minCap = new THREE.Mesh(new THREE.ConeGeometry(1.6, 3.2, 10), matDome);
    minCap.position.set(10.5, 16.6, 3);
    minCap.castShadow = true;
    mosque.add(minCap);

    // Есіктер/терезелер (жай доғал тесік бейнесі)
    var matDoor = new THREE.MeshStandardMaterial({ color: 0x2a2118, roughness: 1 });
    var door = new THREE.Mesh(new THREE.BoxGeometry(2.6, 4.4, 0.3), matDoor);
    door.position.set(0, 2.2, 6.05);
    mosque.add(door);
    [-5.2, 5.2].forEach(function (wx) {
      var win = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.6, 0.3), matDoor);
      win.position.set(wx, 4.4, 6.05);
      mosque.add(win);
    });

    mosque.position.set(0, 0.4, -8);
    scene.add(mosque);

    /* ---------------- Ескі ағаш ---------------- */
    var tree = new THREE.Group();
    var trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.9, 6, 8), matTrunk);
    trunk.position.y = 3;
    trunk.castShadow = true;
    tree.add(trunk);
    var crown = new THREE.Group();
    [[0, 7.4, 0, 3.1], [1.8, 6.6, 0.8, 2.2], [-1.7, 6.9, -0.6, 2.0], [0.4, 8.6, -1.1, 1.8]].forEach(function (c) {
      var leaf = new THREE.Mesh(new THREE.IcosahedronGeometry(c[3], 1), matLeaves);
      leaf.position.set(c[0], c[1], c[2]);
      leaf.castShadow = true;
      crown.add(leaf);
    });
    tree.add(crown);
    tree.position.set(-13, 0.2, -2);
    scene.add(tree);

    /* ---------------- Құдық (жағалауға жақын) ---------------- */
    var well = new THREE.Group();
    var wellWall = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.7, 1.4, 12, 1, true), matWallDark);
    wellWall.position.y = 0.7;
    wellWall.castShadow = true;
    well.add(wellWall);
    var wellRim = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.16, 8, 16), matWall);
    wellRim.rotation.x = Math.PI / 2;
    wellRim.position.y = 1.42;
    well.add(wellRim);
    var postL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.6, 6), matTrunk);
    postL.position.set(-1.3, 2.6, 0);
    var postR = postL.clone(); postR.position.x = 1.3;
    var beam = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3.2, 6), matTrunk);
    beam.rotation.z = Math.PI / 2;
    beam.position.y = 3.8;
    well.add(postL); well.add(postR); well.add(beam);
    well.position.set(9, 0.1, -34);
    scene.add(well);

    /* ---------------- Түйе ---------------- */
    var camel = new THREE.Group();
    var body = new THREE.Mesh(new THREE.SphereGeometry(1.7, 14, 10), matCamel);
    body.scale.set(1.6, 1, 1);
    body.position.y = 2.6;
    body.castShadow = true;
    camel.add(body);
    [0.7, -0.4].forEach(function (hx, i) {
      var hump = new THREE.Mesh(new THREE.SphereGeometry(0.75, 10, 8), matCamel);
      hump.position.set(hx, 3.6 + (i === 0 ? 0.15 : 0), 0);
      hump.castShadow = true;
      camel.add(hump);
    });
    var neck = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.45, 2.6, 8), matCamel);
    neck.position.set(2.6, 3.9, 0);
    neck.rotation.z = -0.5;
    neck.castShadow = true;
    camel.add(neck);
    var head = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.6, 0.5), matCamel);
    head.position.set(3.6, 5.1, 0);
    head.castShadow = true;
    camel.add(head);
    var legs = [];
    [[1.6, 0.7], [1.6, -0.7], [-1.4, 0.7], [-1.4, -0.7]].forEach(function (lp) {
      var leg = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 2.4, 6), matCamel);
      leg.position.set(lp[0], 1.2, lp[1]);
      leg.castShadow = true;
      camel.add(leg);
      legs.push(leg);
    });
    camel.position.set(16, 0.1, 8);
    camel.rotation.y = -0.6;
    scene.add(camel);

    /* ---------------- Аспан: күн дискісі + жұлдыздар ---------------- */
    var sunDisc = new THREE.Mesh(
      new THREE.CircleGeometry(6, 24),
      new THREE.MeshBasicMaterial({ color: 0xf0cf8f, transparent: true, opacity: 0.85, fog: false })
    );
    sunDisc.position.set(-70, 26, -140);
    sunDisc.lookAt(camera.position);
    scene.add(sunDisc);

    var starGeo = new THREE.BufferGeometry();
    var starVerts = [];
    for (var s = 0; s < 220; s++) {
      starVerts.push((Math.random() - 0.5) * 300, 40 + Math.random() * 120, -80 - Math.random() * 120);
    }
    starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starVerts, 3));
    var stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xf4f1ea, size: 0.7, transparent: true, opacity: 0.7, fog: false }));
    scene.add(stars);

    /* ---------------- Камера: slow cinematic ---------------- */
    var camTarget = new THREE.Vector3(0, 6, -8);
    var angle = 0;

    function resize() {
      var w = canvas.clientWidth || canvas.parentElement.clientWidth;
      var h = canvas.clientHeight || 480;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });

    var running = true;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { running = en.isIntersecting; });
    });
    io.observe(canvas);

    var clock = new THREE.Clock();
    var t = 0;

    function animate() {
      requestAnimationFrame(animate);
      if (!running) return;
      var dt = Math.min(clock.getDelta(), 0.05);
      t += dt;

      if (!reduce) {
        // камера — баяу айналу
        angle += dt * 0.045;
        camera.position.x = Math.sin(angle) * 44;
        camera.position.z = Math.cos(angle) * 44 + 6;
        camera.position.y = 11 + Math.sin(t * 0.12) * 2.2;
        camera.lookAt(camTarget);

        // теңіз толқыны
        for (var k = 0; k < seaPos.count; k++) {
          var sx = seaPos.getX(k), sz = seaPos.getZ(k);
          seaPos.setY(k, seaBase[k] + Math.sin(sx * 0.14 + t * 0.8) * 0.35 + Math.cos(sz * 0.18 + t * 0.6) * 0.25);
        }
        seaPos.needsUpdate = true;

        // ағаш жапырақтары — жеңіл қозғалыс
        crown.rotation.z = Math.sin(t * 0.7) * 0.03;
        crown.rotation.x = Math.cos(t * 0.5) * 0.02;

        // түйе — idle
        camel.position.y = 0.1 + Math.sin(t * 1.1) * 0.05;
        neck.rotation.z = -0.5 + Math.sin(t * 0.6) * 0.06;
        head.position.y = 5.1 + Math.sin(t * 0.6) * 0.12;
        legs.forEach(function (leg, li) {
          leg.rotation.x = Math.sin(t * 1.1 + li) * 0.04;
        });

        // жарық өте баяу өзгереді
        sun.intensity = 1.05 + Math.sin(t * 0.1) * 0.12;
        ambient.intensity = 0.55 + Math.sin(t * 0.07) * 0.05;
        sunDisc.material.opacity = 0.8 + Math.sin(t * 0.1) * 0.08;
      } else {
        camera.lookAt(camTarget);
      }

      renderer.render(scene, camera);
    }
    animate();
  });
})();
