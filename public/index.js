import * as THREE from 'three';
import Player from './classes/Player.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Level from './classes/Level.js';
import {
  showMainMenu,
  showGameOverMenu,
  createScoreBoards,
  updateScore,
  createMobileBtns,
  createButton,
  removeMobileBtns,
} from './modules/ui.js';
import { isMobileDevice } from './utils.js';

// SPACE INVADERS 3D
// Game state
let gameState = 'menu';
// Is user use mobile device
let isMobile = isMobileDevice();

// Create scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  20,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
// Set up the scene, camera, and renderer
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Update renderer size and camera aspect ratio on resize
window.addEventListener('resize', () => {
  isMobile = isMobileDevice();
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
// Set the camera
const cameraZAxis = isMobile ? 90 : 50;
camera.position.set(0, 0, cameraZAxis);

// // add orbit controls
// let controls = new OrbitControls(camera, renderer.domElement);

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

// GAME LOGIC

// PLAYER
// create the player
let player;
const createPlayer = () => {
  player = new Player(scene, level, (mesh) => {
    player.mesh.position.set(0, -6, 0);
    scene.add(mesh);
    level.player = player;
  });
};

// LEVEL
// level settings
let currentLevel = 1;
let levelX = 5;
let levelY = 2;
let levelSpeed = 2000;
let level;
// Strat level - create level and player and add them to the scene
const startNewGame = () => {
  resetLevelSettings();
  handelMobile();
  level = new Level(camera, scene, levelX, levelY, levelSpeed);
  scene.add(level.mesh);
  createPlayer();
};
//

//LEVEL PROGRESSION
// reset level settings to initial settings
const resetLevelSettings = () => {
  currentLevel = 1;
  levelX = 5;
  levelY = 2;
  levelSpeed = 2000;
};
// remove current level
const removeLevel = () => {
  scene.remove(level.mesh);
};

// updated settings and create the next level
const startLevel = () => {
  currentLevel += 1;
  // increase levelX and levelY
  if (levelX < (isMobile ? 7 : 8)) levelX += 1;
  if (levelY < (isMobile ? 5 : 4)) levelY += 1;
  // reduce speed interval to make the game faster
  if (levelSpeed > 600) levelSpeed -= 100;
  if (levelSpeed > 200 && levelSpeed <= 600) levelSpeed -= 50;
  // Create a new level
  level = new Level(camera, scene, levelX, levelY, levelSpeed);
  // level.animate();
  scene.add(level.mesh);
  level.player = player;
  // update player data
  player.level = level;
};

//
// GAME LOOP - (run for every frame)
const animate = () => {
  if (gameState === 'playing') {
    requestAnimationFrame(animate);
    // update score
    if (score != player.score) updateScore(player.score);
    // LEVEL
    level.update();
    // Check if the current level is cleared
    if (level.levelCleard) {
      // remove current level
      removeLevel();
      // if old level is removed, add new level with updated setting
      if (!scene.level) startLevel();
    }

    // PLAYER
    player.update();
    // // check if player is dead
    if (player.lives == 0) {
      scene.clear();
      scene.add(light, light2, light3);
      scene.add(ambientLight);
      removeLevel();
      clearInterval(level.animationInterval);
      gameState = 'gameover';
      showGameOverMenu(handlePlayBtn, player.score);
      removeMobileBtns();
    }
  }
  // render scene
  renderer.render(scene, camera);
};

// NON 3D ELEMENTS (ui menus, leaderboard, etc...)
// handle main manu
const handlePlayBtn = (element) => {
  // Change game state to 'playing'
  gameState = 'playing';
  // remove main menu
  document.body.removeChild(element);
  // start game
  startNewGame();
  // level.animate();
  animate();
};
showMainMenu(handlePlayBtn);
let score = 0;
createScoreBoards(score);

// MOBILE RESPONSIVITY
// Buttons control for mobile devices

const handelMobile = () => {
  // Create buttons for mobile controls
  createMobileBtns();
  const leftIconClass = 'fa-arrow-left';
  const rightIconClass = 'fa-arrow-right';
  const shootIconClass = 'fa-rocket';

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
  const buttonContainer = document.getElementById('button-container');
  const buttonContainerInner = document.getElementById(
    'button-container-inner'
  );
  // append only if not appended before

  buttonContainerInner.appendChild(leftButton);
  buttonContainerInner.appendChild(rightButton);
  buttonContainer.appendChild(shootButton);
};
