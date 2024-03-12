// ui.js
export const createMainMenu = () => {
  // / create main menu
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
  // handle start button
  const startBtn = document.getElementById('start-btn');
  startBtn.addEventListener('click', () => {
    // remove main menu
    document.body.removeChild(mainMenu);
    // start game
    StartNewGame();
    // level.animate();
    animate();
  });
};

export const createScoreBoard = () => {
  // / Create the score board
  let score = 0;
  const scoreBoard = document.createElement('div');
  scoreBoard.id = 'score-board';
  scoreBoard.innerHTML = `<p>Score : ${score}</p>`;
  document.body.appendChild(scoreBoard);
};

export const updateScore = (player) => {
  score = player.score;
  scoreBoard.innerHTML = `<p>Score : ${score}</p>`;
};
