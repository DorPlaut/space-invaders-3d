import * as THREE from 'three';
import Player from './classes/Player.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Level from './classes/Level.js';
import Enemy from './classes/Enemy.js';
import Bullet from './classes/Bullet.js';
import Text from './classes/Text.js';
import { degToRad } from 'three/src/math/MathUtils.js';

// SPACE INVADERS 3D

// PAGE SETTINGS

// Check if user use mobile device
function isMobileDevice() {
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
}
let isMobile = isMobileDevice();
//

// GAME SETUP
let gameState = 'menu';
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
let controls = new OrbitControls(camera, renderer.domElement);
// controls.rotateSpeed(3);
controls.autoRotate = false;
controls.autoRotateSpeed = 58.7;
controls.enabled = false;
// controls.enableDamping = true;
//

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
// 3D elements:
// LEVEL
// set the level setting
let levelX = 5;
let levelY = 2;
let levelSpeed = 2000;
// create a level
let level;

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

// Strat level - create level and player
const StartNewGame = () => {
  resetLevelSettings();
  level = new Level(camera, scene, levelX, levelY, levelSpeed);
  scene.add(level.mesh);
  createPlayer();
};
//

// GAME LOGIC - LEVEL PROGRESSION

// reset level settings to initial settings
const resetLevelSettings = () => {
  levelX = 5;
  levelY = 2;
  levelSpeed = 2000;
};
// remove current level
const resetLevel = () => {
  scene.remove(level.mesh);
};

// updated settings and create the next level
const startLevel = () => {
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
  // setTimeout(() => {
  //   controls.autoRotate = false;
  // }, 1000);
};

// set the page and the game
// create main menu
const mainMenu = document.createElement('div');
mainMenu.id = 'main-menu';
mainMenu.innerHTML = `      <h1>Space Invaders 3D</h1>  <div class="menu-content" ><p>Welcom to Space invaders 3D, a 3D shooter inspirde by the retro classic build with Three.JS </p>       <button id="start-btn" class="btn">Start Level</button></div> 
      <span
        >Build by
        <a class="clickable" href="http://dorplaut.com" target="_blank"
          >Dor Plaut</a
        ></span
      >`;
document.body.appendChild(mainMenu);
// change main menu on gameover
// handle start button
const startBtn = document.getElementById('start-btn');
startBtn.addEventListener('click', () => {
  // Change game state to 'playing'
  gameState = 'playing';
  // remove main menu
  document.body.removeChild(mainMenu);
  // start game
  StartNewGame();
  // level.animate();
  animate();
});
const showGameOverMenu = async () => {
  mainMenu.innerHTML = `
   <h1>Game Over</h1>
    <div class="menu-content">
      <h2>Your score is ${player.score}</h2>
      <form action="">
        <span
          >Please enter your name to submit your score to the score board</span
        ><br />
        <input type="text" id="player-name-input" />
      </form>
      <br />

      <button class="btn" id="submit-btn">Submit Score</button>
      <button id="start-btn" class="btn">Play again</button>
    </div>
    <span
      >Build by
      <a class="clickable" href="http://dorplaut.com" target="_blank"
        >Dor Plaut</a
      ></span
    > `;

  document.body.appendChild(mainMenu);
  // handle start button
  const startBtn = document.getElementById('start-btn');
  startBtn.addEventListener('click', () => {
    // Change game state to 'playing'
    gameState = 'playing';
    // remove main menu
    document.body.removeChild(mainMenu);
    document.body.removeChild(highestScoreContainer);
    // start game
    StartNewGame();
    // level.animate();
    animate();
  });
  //
  //
  // Display highest score
  const highestScoreContainer = document.createElement('div');
  highestScoreContainer.innerHTML =
    '<p id="leader-board">Highest Score: <span id="highest-score" >Loading...</span></p>';
  document.body.appendChild(highestScoreContainer);

  try {
    // Fetch highest score from server
    const response = await fetch(
      `http://localhost:3000/api/score/getHighestScore`
    );
    const highestScoreData = await response.json();

    if (response.ok) {
      const highestScoreElement = document.getElementById('highest-score');
      highestScoreElement.textContent = highestScoreData
        ? highestScoreData.score
        : 'N/A';
    } else {
      console.error('Failed to fetch highest score:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching highest score:', error);
  }
  // SUBMIT SCORE
  const submitButton = document.getElementById('submit-btn');
  submitButton.addEventListener('click', async () => {
    const playerNameInput = document.getElementById('player-name-input');
    const playerName = playerNameInput.value;

    // Check if the player entered a name
    if (!playerName.trim()) {
      alert('Please enter your name before submitting the score.');
      return;
    }

    // Assuming 'score' is the variable holding the player's score
    const scoreData = {
      player_name: playerName,
      score: score,
    };

    try {
      // Assuming SERVER_URL is the environment variable holding the server URL
      const response = await fetch(
        `http://localhost:3000/api/score/submitScore`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(scoreData),
        }
      );

      if (response.ok) {
        alert('Score submitted successfully!');
      } else {
        alert('Failed to submit score. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting score:', error);
      alert('Failed to submit score. Please try again.');
    }
  });

  //
  //
};

//
// Create the score board
let score = 0;
const scoreBoard = document.createElement('div');
scoreBoard.id = 'score-board';
scoreBoard.innerHTML = `<p>Score : ${score}</p>`;
document.body.appendChild(scoreBoard);

// Update score board
const updateScore = () => {
  score = player.score;
  scoreBoard.innerHTML = `<p>Score : ${score}</p>`;
};
//
//

// MOBILE RESPONSIVITY
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

//
// GAME LOOP - (run for every frame)
const animate = () => {
  if (gameState === 'playing') {
    requestAnimationFrame(animate);
    // update score
    if (score != player.score) updateScore();
    // LEVEL
    level.update();
    // Check if the current level is cleared
    if (level.levelCleard) {
      // controls.autoRotate = true;

      // remove current level
      resetLevel();
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
      resetLevel();
      clearInterval(level.animationInterval);
      gameState = 'gameover';
      showGameOverMenu();
    }

    //
    // controls.update();
    // if (Math.round(camera.rotation.y) != 0) {
    //   controls.autoRotate = true;
    // }
    // if (Math.round(camera.rotation.y) == 0) {
    //   controls.autoRotate = false;
    // }
    // console.log(camera.rotation.y);
  }
  // render scene
  renderer.render(scene, camera);
};
