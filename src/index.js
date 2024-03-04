import * as THREE from 'three';
import Player from './classes/Player.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GameGrid from './classes/GameGrid.js';
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

// controls
const controls = new OrbitControls(camera, renderer.domElement);

// Set up lights (ambient, directional, etc.)
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Position the camera
// camera.position.z = 5;
camera.position.set(0, 0, 50);

const gameGrid = new GameGrid();
scene.add(gameGrid.mesh);

// Player
const player = new Player(scene, (mesh) => {
  player.mesh.position.set(0, -6, 0);

  scene.add(mesh);
});

// bullet
// const bullet = new Bullet();
// scene.add(bullet.mesh);

//
// Game loop (animation)
const animate = () => {
  requestAnimationFrame(animate);
  // update elements
  player.update();
  gameGrid.update();
  // render scene
  renderer.render(scene, camera);
};
animate();

//
