import { getScores, getHighScore, postScore } from './data';

// create main menu
export const showMainMenu = (handlePlayBtn) => {
  const mainMenu = document.createElement('div');
  mainMenu.id = 'main-menu';
  mainMenu.innerHTML = `     
    <h1>Space Invaders 3D</h1>
    <div class="menu-content">
      <p>
        Welcom to Space invaders 3D, a 3D shooter inspirde by the retro classic
        build with Three.JS
      </p>
      <button id="start-btn" class="btn">Play</button>
    </div>
    <span
      >Build by
      <a class="clickable" href="http://dorplaut.com" target="_blank"
        >Dor Plaut</a
      ></span
    >
      `;
  document.body.appendChild(mainMenu);
  // handle start button
  const startBtn = document.getElementById('start-btn');
  startBtn.addEventListener('click', () => handlePlayBtn(mainMenu));
};

// Create game over menu
export const showGameOverMenu = async (handlePlayBtn, score) => {
  const mainMenu = document.createElement('div');
  mainMenu.id = 'main-menu';
  mainMenu.innerHTML = `
   <h1>Game Over</h1>
    <div class="menu-content">
      <h2>Your score is ${score}</h2>
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
  startBtn.addEventListener('click', () => handlePlayBtn(mainMenu));
  //
  //

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

    const scoreData = {
      player_name: playerName,
      score: score,
    };

    try {
      const response = await postScore(scoreData);

      if (response) {
        alert('Score submitted successfully!');
      } else {
        alert('Failed to submit score. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting score:', error);
      alert('Failed to submit score. Please try again.');
    }
  });
};

export const createScoreBoards = async (score) => {
  // current game score board
  const scoreBoard = document.createElement('div');
  scoreBoard.id = 'score-board';
  scoreBoard.innerHTML = `<p>Score : ${score}</p>`;
  document.body.appendChild(scoreBoard);
  // all time score board
  const highestScoreContainer = document.createElement('div');
  highestScoreContainer.innerHTML =
    '<p id="leader-board">Highest Score: <span id="highest-score" >Loading...</span></p>';
  document.body.appendChild(highestScoreContainer);

  // Fetch highest score from server
  const highestScoreData = await getHighScore();
  const highestScoreElement = document.getElementById('highest-score');
  highestScoreElement.textContent = highestScoreData
    ? `${highestScoreData.player_name} - ${highestScoreData.score}`
    : 'N/A';
};

// Update score board
export const updateScore = (score) => {
  const scoreBoard = document.getElementById('score-board');
  scoreBoard.innerHTML = `<p>Score : ${score}</p>`;
};

export const createButton = (
  iconClass,
  className,
  touchStartAction,
  touchEndAction
) => {
  const button = document.createElement('button');
  const icon = document.createElement('i');
  icon.className = `fas ${iconClass}`; // Use Font Awesome classes
  button.appendChild(icon);
  button.className = className; // Assign the class
  button.addEventListener('touchstart', touchStartAction);
  button.addEventListener('touchend', touchEndAction);
  return button;
};
export const createMobileBtns = () => {
  const buttonContainer = document.createElement('div');
  buttonContainer.id = 'button-container';
  document.body.appendChild(buttonContainer);
  const buttonContainerInner = document.createElement('div');
  buttonContainerInner.id = 'button-container-inner';
  buttonContainer.appendChild(buttonContainerInner);
};
export const removeMobileBtns = () => {
  const buttonContainer = document.getElementById('button-container');
  buttonContainer.remove();
};
