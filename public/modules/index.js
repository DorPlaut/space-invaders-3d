import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createPlayer, StartNewGame, getPlayer } from './modules/player.js';
import {
  createLevel,
  resetLevelSettings,
  resetLevel,
  startLevel,
  getLevel,
} from './modules/level.js';
import { createMainMenu, createScoreBoard, updateScore } from './modules/ui.js';
import { createMobileControls } from './modules/mobile.js';

const isMobileDevice = () => {
  // Check for touch support
  const isTouchDevice =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;
  // Check if the user agent contains "Mobi"
  const isMobileUserAgent = window.navigator.userAgent
    .toLowerCase()
    .includes('mobi');

  return isTouchDevice || isMobileUserAgent;
};
let isMobile = isMobileDevice();

// / GAME SETUP

// THREEJS - 3D ELEMENT

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
// update window window size and camera aspect ratio on resize
window.addEventListener('resize', () => {
  isMobile = isMobileDevice();
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
// Position the camera
const cameraZoom = isMobile ? 90 : 50;
camera.position.set(0, 0, cameraZoom);

// add orbit controls
// let controls = new OrbitControls(camera, renderer.domElement);
// // controls.rotateSpeed(3);
// controls.autoRotate = true;
// controls.autoRotateSpeed = 30;

// LIGHT - create lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(-10, 3, -1);
const light2 = new THREE.DirectionalLight(0xffffff, 1);
light2.position.set(10, -3, -1);
const light3 = new THREE.DirectionalLight(0xffffff, 1);
light3.position.set(0, 0, 50);
// add lights to scene
scene.add(light, light2, light3);
scene.add(ambientLight);

// / GAME LOOP - (run for every frame)
const animate = () => {
  requestAnimationFrame(animate);
  // update score
  if (score != player.score) updateScore();
  // LEVEL
  level.update();
  // Check if the current level is cleared
  if (level.levelCleard) {
    // remove current level
    resetLevel();
    // if old level is removed, add new level with updated setting
    if (!scene.level) startLevel();
  }

  // PLAYER
  player.update();
  // // check if player is dead
  if (player.lives == 0) {
    scene.remove(player.mesh);
    // scene.remove(level.mesh);
    clearInterval(level.animationInterval);
    console.log('GAME OVER');
  }

  //
  // render scene
  renderer.render(scene, camera);
};

//

createLevel(camera, scene);
createPlayer(scene, getLevel());
createMainMenu();
createScoreBoard();

const startBtn = document.getElementById('start-btn');
startBtn.addEventListener('click', () => {
  document.body.removeChild(mainMenu);
  StartNewGame();
  //   getLevel().animate();
  animate();
});

if (isMobile) {
  createMobileControls();
}
