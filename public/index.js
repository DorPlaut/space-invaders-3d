import * as THREE from 'three';
import Player from './classes/Player.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Level from './classes/Level.js';
import Enemy from './classes/Enemy.js';
import Bullet from './classes/Bullet.js';
import Text from './classes/Text.js';

// page sttings
function isMobileDevice() {
  // Check for touch support (feature detection)
  const isTouchDevice =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;

  // Check if the user agent contains "Mobi" (user agent string check)
  const isMobileUserAgent = window.navigator.userAgent
    .toLowerCase()
    .includes('mobi');

  // Combine both checks
  return isTouchDevice || isMobileUserAgent;
}
let isMobile = isMobileDevice();
//

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
  isMobile = isMobileDevice();
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// controls
let controls;
if (isMobile) controls = new OrbitControls(camera, renderer.domElement);

// Set up lights (ambient, directional, etc.)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(-10, 3, -1);
const light2 = new THREE.DirectionalLight(0xffffff, 1);
light2.position.set(10, -3, -1);
const light3 = new THREE.DirectionalLight(0xffffff, 1);
light3.position.set(0, 0, 50);
scene.add(light, light2, light3);
scene.add(ambientLight);

// Position the camera
camera.position.set(0, 0, 50);
if (isMobile) camera.position.set(0, 0, 90);

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
  if (levelX < 9) levelX += 1;
  if (levelY < 4) levelY += 1;
  // reduce speed interval
  if (levelSpeed > 600) levelSpeed -= 100;
  if (levelSpeed > 200 && levelSpeed <= 600) levelSpeed -= 50;

  // Create a new level
  level = new Level(camera, scene, levelX, levelY, levelSpeed);
  scene.add(level.mesh);
  level.player = player;
  // update player data
  player.level = level;
};
// titles and text
// const title = new Text(scene, 'HLELLO WORLDL');
// scene.add(title.mesh);

// score board
let score = 0;
const scoreBoard = document.createElement('div');
scoreBoard.id = 'score-board';
scoreBoard.innerHTML = `<p>Score : ${score}</p>`;
document.body.appendChild(scoreBoard);

// update score
const updateScore = () => {
  score = player.score;
  scoreBoard.innerHTML = `<p>Score : ${score}</p>`;
};
//

// Game loop (animation)
const animate = () => {
  requestAnimationFrame(animate);
  // update elements
  player.update();
  level.update();

  // update score
  if (score != player.score) updateScore();

  // create now level when level is cleared
  // Check if the current level is cleared
  if (level.levelCleard) {
    resetLevel();
    if (!scene.level) startLevel();
  }

  // // check if player is dead
  if (player.lives == 0) {
    scene.remove(player.mesh);
    // scene.remove(level.mesh);
    clearInterval(level.animationInterval);
    console.log('GAME OVER');
  }
  // render scene
  renderer.render(scene, camera);
};
animate();

// END OF THREE JS

// Buttons control for mobile devices
if (isMobile) {
  // Create buttons for mobile controls
  const buttonContainer = document.createElement('div');
  buttonContainer.id = 'button-container';
  document.body.appendChild(buttonContainer);
  const buttonContainerInner = document.createElement('div');
  buttonContainerInner.id = 'button-container-inner';
  buttonContainer.appendChild(buttonContainerInner);
  function createButton(
    iconClass,
    className,
    touchStartAction,
    touchEndAction
  ) {
    const button = document.createElement('button');
    const icon = document.createElement('i');
    icon.className = `fas ${iconClass}`; // Use Font Awesome classes
    button.appendChild(icon);
    button.className = className; // Assign the class
    button.addEventListener('touchstart', touchStartAction);
    button.addEventListener('touchend', touchEndAction);
    return button;
  }

  const leftIconClass = 'fa-arrow-left';
  const rightIconClass = 'fa-arrow-right';
  const shootIconClass = 'fa-rocket';

  // <i class="fa-solid fa-rocket"></i>;
  // Create left button
  const leftButton = createButton(
    leftIconClass,
    'control-btn',
    () => {
      player.simulateKeyPress('ArrowLeft');
    },
    () => {
      player.simulateKeyRelease('ArrowLeft');
    }
  );

  // Create right button
  const rightButton = createButton(
    rightIconClass,
    'control-btn',
    () => {
      player.simulateKeyPress('ArrowRight');
    },
    () => {
      player.simulateKeyRelease('ArrowRight');
    }
  );

  // Create shoot button
  const shootButton = createButton(
    shootIconClass,
    'control-btn',
    () => {
      player.simulateKeyPress('Space');
    },
    () => {
      player.simulateKeyRelease('Space');
    }
  );

  // Append buttons to the container
  buttonContainerInner.appendChild(leftButton);
  buttonContainerInner.appendChild(rightButton);
  buttonContainer.appendChild(shootButton);
}
