
// ==================================
// DERiiLNAY LEGENDS
// 3D FANTASY MOBA ENGINE
// ==================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x101a30);
scene.fog = new THREE.Fog(0x101a30, 35, 100);

// CAMERA
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  200
);

camera.position.set(0, 24, 29);
camera.lookAt(0, 0, 0);

// RENDERER
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: "low-power"
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 1.5)
);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.domElement.style.position = "fixed";
renderer.domElement.style.inset = "0";
renderer.domElement.style.zIndex = "0";

document.body.appendChild(renderer.domElement);

document.getElementById("game").style.background = "transparent";

// LIGHTING
const ambient = new THREE.AmbientLight(
  0xffffff,
  1.1
);
scene.add(ambient);

const sun = new THREE.DirectionalLight(
  0xffe3b0,
  2
);

sun.position.set(-10, 25, 15);
sun.castShadow = true;
scene.add(sun);

// MATERIALS
const grassMat = new THREE.MeshStandardMaterial({
  color: 0x234c38,
  roughness: 0.9
});

const roadMat = new THREE.MeshStandardMaterial({
  color: 0x667080,
  roughness: 0.8
});

const blueMat = new THREE.MeshStandardMaterial({
  color: 0x168cff,
  metalness: 0.5,
  roughness: 0.3
});

const redMat = new THREE.MeshStandardMaterial({
  color: 0xff3434,
  metalness: 0.5,
  roughness: 0.3
});

const goldMat = new THREE.MeshStandardMaterial({
  color: 0xffc94d,
  metalness: 0.7,
  roughness: 0.25
});

// GROUND
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(65, 65),
  grassMat
);

ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.2;
ground.receiveShadow = true;
scene.add(ground);

// ARENA ROAD
function makeRoad(x, z, w, h) {
  const road = new THREE.Mesh(
    new THREE.BoxGeometry(w, 0.12, h),
    roadMat
  );

  road.position.set(x, -0.08, z);
  road.receiveShadow = true;
  scene.add(road);
}

makeRoad(0, 0, 7, 48);
makeRoad(0, 0, 48, 7);

// BASE
function makeBase(x, z, material) {
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(4, 5, 1.2, 8),
    material
  );

  base.position.set(x, 0.4, z);
  base.castShadow = true;
  scene.add(base);

  const crystal = new THREE.Mesh(
    new THREE.OctahedronGeometry(2),
    goldMat
  );

  crystal.position.set(x, 2.5, z);
  crystal.rotation.y = Math.PI / 4;
  scene.add(crystal);

  return crystal;
}

makeBase(0, 21, blueMat);
makeBase(0, -21, redMat);

// TURRETS
function makeTower(x, z, material) {
  const tower = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 1.2, 3, 8),
    material
  );

  body.position.y = 1.5;
  body.castShadow = true;
  tower.add(body);

  const crystal = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.8),
    goldMat
  );

  crystal.position.y = 3.5;
  tower.add(crystal);

  tower.position.set(x, 0, z);
  scene.add(tower);
}

makeTower(-5, 12, blueMat);
makeTower(5, 12, blueMat);
makeTower(-5, -12, redMat);
makeTower(5, -12, redMat);

// TREES
function makeTree(x, z) {
  const tree = new THREE.Group();

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.4, 2, 7),
    new THREE.MeshStandardMaterial({color: 0x65412b})
  );

  trunk.position.y = 1;
  tree.add(trunk);

  const leaves = new THREE.Mesh(
    new THREE.ConeGeometry(1.6, 4, 7),
    new THREE.MeshStandardMaterial({
      color: 0x176c51
    })
  );

  leaves.position.y = 3.5;
  tree.add(leaves);

  tree.position.set(x, 0, z);
  scene.add(tree);
}

for (let i = 0; i < 12; i++) {
  makeTree(-12, -20 + i * 3.5);
  makeTree(12, -20 + i * 3.5);
}

// HERO
function makeHero(x, z, material) {
  const hero = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.8, 1.8, 8),
    material
  );

  body.position.y = 1.2;
  body.castShadow = true;
  hero.add(body);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 16, 16),
    new THREE.MeshStandardMaterial({
      color: 0xffd2a3
    })
  );

  head.position.y = 2.5;
  hero.add(head);

  const helmet = new THREE.Mesh(
    new THREE.ConeGeometry(0.65, 1, 8),
    goldMat
  );

  helmet.position.y = 3.3;
  hero.add(helmet);

  hero.position.set(x, 0, z);
  scene.add(hero);

  return hero;
}

const heroes = [];

heroes.push(makeHero(-2, 15, blueMat));
heroes.push(makeHero(2, -15, redMat));

// DECORATIVE CRYSTALS
for (let i = 0; i < 8; i++) {
  const crystal = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.5),
    goldMat
  );

  crystal.position.set(
    Math.sin(i * 1.2) * 10,
    1,
    Math.cos(i * 1.2) * 10
  );

  scene.add(crystal);
}

// ANIMATION
let clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const time = clock.getElapsedTime();
  updateHeroMovement();

  heroes.forEach((hero, i) => {
    hero.position.y = Math.sin(time * 2 + i) * 0.12;
    hero.rotation.y = Math.sin(time + i) * 0.15;
  });

  scene.children.forEach((obj) => {
    if (
      obj.geometry &&
      obj.geometry.type === "OctahedronGeometry"
    ) {
      obj.rotation.y += 0.008;
    }
  });

  renderer.render(scene, camera);
}

animate();

// RESIZE
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );
});

// START BUTTON

// START GAME
document.getElementById("start").onclick = () => {

  const game = document.getElementById("game");

  game.classList.add("playing");

  document.getElementById("brand").style.display = "none";
  document.getElementById("subtitle").style.display = "none";
  document.getElementById("hero-info").style.display = "none";
  document.getElementById("start").style.display = "none";
  document.getElementById("status").style.display = "none";

  camera.position.set(
    heroes[0].position.x,
    14,
    heroes[0].position.z + 18
  );

  camera.lookAt(
    heroes[0].position.x,
    0,
    heroes[0].position.z
  );

  console.log("BATTLE START!");
};


console.log("DERiiLNAY LEGENDS 3D READY");

/* =================================
   DERiiLNAY LEGENDS
   VIRTUAL JOYSTICK MOVEMENT
================================= */

const joystick = document.getElementById("joystick");
const stick = document.getElementById("stick");

let joyX = 0;
let joyY = 0;

let activePointer = null;

function moveJoystick(event) {
  const rect = joystick.getBoundingClientRect();

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  let dx = event.clientX - centerX;
  let dy = event.clientY - centerY;

  const maxDistance = 35;
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

joystick.addEventListener("pointerdown", (event) => {
  if (activePointer !== null) return;

  activePointer = event.pointerId;
  joystick.setPointerCapture(event.pointerId);

  moveJoystick(event);
});

joystick.addEventListener("pointermove", (event) => {
  if (event.pointerId !== activePointer) return;

  moveJoystick(event);
});

function resetJoystick(event) {
  if (event.pointerId !== activePointer) return;

  activePointer = null;
  joyX = 0;
  joyY = 0;

  stick.style.transform = "translate(0px, 0px)";
}

joystick.addEventListener("pointerup", resetJoystick);
joystick.addEventListener("pointercancel", resetJoystick);

/* HERO MOVEMENT */

function updateHeroMovement() {
  const hero = heroes[0];

  if (!hero) return;

  const speed = 0.13;

  hero.position.x += joyX * speed;
  hero.position.z += joyY * speed;

  hero.position.x = THREE.MathUtils.clamp(
    hero.position.x, -22, 22
  );

  hero.position.z = THREE.MathUtils.clamp(
    hero.position.z, -22, 22
  );

  if (Math.abs(joyX) + Math.abs(joyY) > 0.1) {
    hero.rotation.y = Math.atan2(joyX, joyY);
  }

  camera.position.x = hero.position.x;
  camera.position.z = hero.position.z + 22;

  camera.lookAt(
    hero.position.x,
    0,
    hero.position.z
  );
}

const oldAnimate = animate;
