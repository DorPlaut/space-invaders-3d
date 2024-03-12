import Level from '../classes/Level.js';

let level;
let levelX = 5;
let levelY = 2;
let levelSpeed = 2000;

export const createLevel = (camera, scene) => {
  level = new Level(camera, scene, levelX, levelY, levelSpeed);
};

export const resetLevelSettings = () => {
  levelX = 5;
  levelY = 2;
  levelSpeed = 2000;
};

export const resetLevel = () => {
  scene.remove(level);
};

export const startLevel = () => {
  if (levelX < 9) levelX += 1;
  if (levelY < 4) levelY += 1;
  if (levelSpeed > 600) levelSpeed -= 100;
  if (levelSpeed > 200 && levelSpeed <= 600) levelSpeed -= 50;

  level = new Level(camera, scene, levelX, levelY, levelSpeed);
  level.animate();
  scene.add(level.mesh);
  level.player = getPlayer();
};

export const getLevel = () => level;
