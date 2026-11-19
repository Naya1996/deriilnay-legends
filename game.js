
// ==========================================
// DERiiLNAY LEGENDS
// 3D FANTASY MOBA - GAME ENGINE
// ==========================================

(() => {
  "use strict";

  const game = document.getElementById("game");
  const startButton = document.getElementById("start");
  const joystick = document.getElementById("joystick");
  const stick = document.getElementById("stick");
  const skillButtons = document.querySelectorAll("#skills button");

  if (!window.THREE) {
    alert("Three.js gagal dimuat. Periksa koneksi internet.");
    return;
  }

  // SCENE
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x101a30);
  scene.fog = new THREE.Fog(0x101a30, 35, 100);

  // CAMERA
  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    200
  );

  camera.position.set(0, 25, 30);
  camera.lookAt(0, 0, 0);

  // RENDERER
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "low-power"
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  renderer.domElement.style.position = "fixed";
  renderer.domElement.style.inset = "0";
  renderer.domElement.style.zIndex = "0";

  document.body.appendChild(renderer.domElement);
  game.style.background = "transparent";

  // LIGHTING
  scene.add(new THREE.HemisphereLight(0xa9d7ff, 0x24331b, 2));

  const sun = new THREE.DirectionalLight(0xffe0a0, 2.2);
  sun.position.set(-15, 30, 15);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  scene.add(sun);

  // MATERIALS
  const grassMat = new THREE.MeshStandardMaterial({
    color: 0x315b37,
    roughness: 1
  });

  const roadMat = new THREE.MeshStandardMaterial({
    color: 0x77716a,
    roughness: 1
  });

  const blueMat = new THREE.MeshStandardMaterial({
    color: 0x167dff,
    metalness: 0.35,
    roughness: 0.35
  });

  const redMat = new THREE.MeshStandardMaterial({
    color: 0xe63745,
    metalness: 0.35,
    roughness: 0.35
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xffc94d,
    metalness: 0.65,
    roughness: 0.25
  });

  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0x69758b,
    roughness: 0.85
  });

  // OBJECT HELPER
  function addBox(x, y, z, w, h, d, material) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      material
    );

    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    return mesh;
  }

  function addCylinder(x, y, z, radius, height, material) {
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, height, 12),
      material
    );

    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    scene.add(mesh);
    return mesh;
  }

  // ARENA GROUND
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(65, 65),
    grassMat
  );

  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // BATTLE ROADS
  addBox(0, 0.025, 0, 7, 0.05, 55, roadMat);
  addBox(0, 0.03, 0, 55, 0.05, 7, roadMat);

  // ROAD CENTER LINE
  for (let i = -24; i <= 24; i += 6) {
    addBox(0, 0.07, i, 0.18, 0.03, 2, goldMat);
  }

  // BASES
  function createBase(z, material) {
    const base = new THREE.Group();

    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(5, 6, 1, 8),
      stoneMat
    );
    platform.position.y = 0.5;
    base.add(platform);

    const crystal = new THREE.Mesh(
      new THREE.OctahedronGeometry(2.1, 1),
      material
    );
    crystal.position.y = 3;
    crystal.castShadow = true;
    base.add(crystal);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3, 0.12, 8, 32),
      goldMat
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 1.2;
    base.add(ring);

    base.position.z = z;
    scene.add(base);

    return crystal;
  }

  const blueCrystal = createBase(22, blueMat);
  const redCrystal = createBase(-22, redMat);

  // TOWERS
  function createTower(x, z, material) {
    addCylinder(x, 1, z, 1.15, 2, stoneMat);
    addCylinder(x, 2.5, z, 0.85, 1.2, material);
    addCylinder(x, 3.25, z, 0.45, 0.5, goldMat);

    const light = new THREE.PointLight(material.color, 1.5, 8);
    light.position.set(x, 4, z);
    scene.add(light);
  }

  [-12, -5, 5, 12].forEach(z => {
    createTower(-5, z, blueMat);
    createTower(5, -z, redMat);
  });

  // TREES
  const treeMat = new THREE.MeshStandardMaterial({
    color: 0x1c783e,
    roughness: 1
  });

  for (let z = -24; z <= 24; z += 8) {
    [-1, 1].forEach(side => {
      const x = side * 14;

      addCylinder(x, 1, z, 0.45, 2, stoneMat);

      const leaves = new THREE.Mesh(
        new THREE.ConeGeometry(2.3, 5, 7),
        treeMat
      );

      leaves.position.set(x, 4, z);
      leaves.castShadow = true;
      scene.add(leaves);
    });
  }

  // HERO CREATION
  function makeHero(x, z, material, isPlayer = false) {
    const hero = new THREE.Group();

    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.65, 0.85, 1.8, 10),
      material
    );
    body.position.y = 1.2;
    body.castShadow = true;
    hero.add(body);

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xffd0a0 })
    );
    head.position.y = 2.45;
    hero.add(head);

    const helmet = new THREE.Mesh(
      new THREE.ConeGeometry(0.65, 0.9, 8),
      goldMat
    );
    helmet.position.y = 3.15;
    hero.add(helmet);

    const sword = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 1.7, 0.25),
      goldMat
    );
    sword.position.set(0.95, 1.5, 0);
    sword.rotation.z = -0.3;
    hero.add(sword);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.95, 0.06, 6, 24),
      isPlayer ? goldMat : material
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.12;
    hero.add(ring);

    hero.position.set(x, 0, z);
    hero.userData.isPlayer = isPlayer;
    hero.userData.baseY = 0;

    scene.add(hero);
    return hero;
  }

  const heroes = [];

  // PLAYER HERO
  const player = makeHero(0, 15, blueMat, true);
  heroes.push(player);

  // BLUE TEAM
  heroes.push(makeHero(-3, 18, blueMat));
  heroes.push(makeHero(3, 18, blueMat));
  heroes.push(makeHero(-5, 13, blueMat));
  heroes.push(makeHero(5, 13, blueMat));

  // RED TEAM
  heroes.push(makeHero(0, -15, redMat));
  heroes.push(makeHero(-3, -18, redMat));
  heroes.push(makeHero(3, -18, redMat));
  heroes.push(makeHero(-5, -13, redMat));
  heroes.push(makeHero(5, -13, redMat));

  // DECORATIVE CRYSTALS
  const crystals = [];

  for (let i = 0; i < 12; i++) {
    const crystal = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.65),
      i % 2 ? blueMat : redMat
    );

    crystal.position.set(
      (Math.random() - 0.5) * 42,
      1.1,
      (Math.random() - 0.5) * 42
    );

    scene.add(crystal);
    crystals.push(crystal);
  }

  // GAME STATE
  let battleStarted = false;
  let joyX = 0;
  let joyY = 0;
  let activePointer = null;
  let skillCooldown = false;

  // JOYSTICK
  function moveJoystick(event) {
    const rect = joystick.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let dx = event.clientX - centerX;
    let dy = event.clientY - centerY;

    const maxDistance = rect.width * 0.34;
    const distance = Math.hypot(dx, dy);

    if (distance > maxDistance) {
      dx = dx / distance * maxDistance;
      dy = dy / distance * maxDistance;
    }

    joyX = dx / maxDistance;
    joyY = dy / maxDistance;

    stick.style.transform =
      `translate(${dx}px, ${dy}px)`;
  }

  joystick.addEventListener("pointerdown", event => {
    if (!battleStarted) return;

    activePointer = event.pointerId;
    joystick.setPointerCapture(activePointer);
    moveJoystick(event);
  });

  joystick.addEventListener("pointermove", event => {
    if (event.pointerId !== activePointer) return;
    moveJoystick(event);
  });

  function releaseJoystick(event) {
    if (event.pointerId !== activePointer) return;

    activePointer = null;
    joyX = 0;
    joyY = 0;
    stick.style.transform = "translate(0,0)";
  }

  joystick.addEventListener("pointerup", releaseJoystick);
  joystick.addEventListener("pointercancel", releaseJoystick);

  // START BATTLE
  startButton.addEventListener("click", () => {
    battleStarted = true;

    document.getElementById("brand").style.display = "none";
    document.getElementById("subtitle").style.display = "none";
    document.getElementById("hero-info").style.display = "none";
    startButton.style.display = "none";
    document.getElementById("status").style.display = "none";

    camera.position.set(
  player.position.x,
  10,
  player.position.z + 8
);

camera.lookAt(
  player.position.x,
  1,
  player.position.z - 3
);
  });

  // SKILL BUTTONS
  skillButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      if (!battleStarted || skillCooldown) return;

      skillCooldown = true;

      const effect = new THREE.Mesh(
        new THREE.SphereGeometry(1.2, 16, 16),
        new THREE.MeshBasicMaterial({
          color: [0xffd34d, 0xff4c20, 0x42dfff, 0xffffff][index]
        })
      );

      effect.position.copy(player.position);
      effect.position.y = 1.5;
      scene.add(effect);

      let scale = 1;

      const effectTimer = setInterval(() => {
        scale += 0.18;
        effect.scale.setScalar(scale);

        if (scale > 3) {
          scene.remove(effect);
          effect.geometry.dispose();
          clearInterval(effectTimer);
        }
      }, 35);

      setTimeout(() => {
        skillCooldown = false;
      }, 700);
    });
  });

  // MOVEMENT AND CAMERA
  function updateHeroMovement() {
    if (!battleStarted) return;

    const speed = 0.15;

    player.position.x += joyX * speed;
    player.position.z += joyY * speed;

    player.position.x = THREE.MathUtils.clamp(
      player.position.x, -23, 23
    );

    player.position.z = THREE.MathUtils.clamp(
      player.position.z, -23, 23
    );

    if (Math.abs(joyX) + Math.abs(joyY) > 0.05) {
      player.rotation.y = Math.atan2(joyX, joyY);
    }

    camera.position.x +=
      (player.position.x - camera.position.x) * 0.12;

    camera.position.z +=
      (player.position.z + 18 - camera.position.z) * 0.12;

    camera.lookAt(player.position.x, 0, player.position.z);
  }

  // ANIMATION LOOP
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    updateHeroMovement();

    heroes.forEach((hero, index) => {
      if (!hero.userData.isPlayer) {
        hero.position.y = Math.sin(time * 2 + index) * 0.08;
      }
    });

    crystals.forEach((crystal, index) => {
      crystal.rotation.y += 0.012;
      crystal.position.y =
        1.1 + Math.sin(time * 2 + index) * 0.2;
    });

    blueCrystal.rotation.y += 0.012;
    redCrystal.rotation.y -= 0.012;

    renderer.render(scene, camera);
  }

  // RESPONSIVE SCREEN
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  });

  // START ENGINE LAST
  animate();

  console.log("DERiiLNAY LEGENDS: 3D ENGINE READY");
})();
