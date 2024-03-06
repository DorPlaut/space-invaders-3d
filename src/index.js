import * as THREE from 'three';
import Player from './classes/Player.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Level from './classes/Level.js';
import Enemy from './classes/Enemy.js';
import Bullet from './classes/Bullet.js';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  20,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// update window size on resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// controls
const controls = new OrbitControls(camera, renderer.domElement);

// Set up lights (ambient, directional, etc.)
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Position the camera
camera.position.set(0, 0, 50);

// MODELS and OBJECTS
// enemies
let levelX = 5;
let levelY = 2;
let levelSpeed = 2000;
let level = new Level(camera, scene, levelX, levelY, levelSpeed);
scene.add(level.mesh);

// Player
let player;
const createPlayer = () => {
  player = new Player(scene, level, (mesh) => {
    player.mesh.position.set(0, -6, 0);
    scene.add(mesh);
    level.player = player;
  });
};
createPlayer();
//

// reaset and start new level
const resetLevel = () => {
  scene.remove(level);
};

const startLevel = () => {
  // increase levelX and levelY
  levelX += 1;
  if (levelY < 4) levelY += 1;
  // reduce speed interval
  if (levelSpeed > 600) levelSpeed -= 100;
  if (levelSpeed > 200) levelSpeed -= 50;

  // Create a new level
  level = new Level(camera, scene, levelX, levelY, levelSpeed);
  scene.add(level.mesh);
  level.player = player;
  // update player data
  player.level = level;
};
// Game loop (animation)
const animate = () => {
  requestAnimationFrame(animate);
  // update elements
  player.update();
  level.update();

  // create now level when level is cleared
  // Check if the current level is cleared
  if (level.levelCleard) {
    resetLevel();
    if (!scene.level) startLevel();
  }
  // render scene
  renderer.render(scene, camera);
};
animate();

//
