// player.js
import Player from '../classes/Player';

let player;

export const createPlayer = (scene, level) => {
  player = new Player(scene, level, (mesh) => {
    player.mesh.position.set(0, -6, 0);
    scene.add(mesh);
    level.player = player;
  });
};

export const getPlayer = () => player;

export const StartNewGame = () => {
  resetLevelSettings();
  scene.add(level.mesh);
  createPlayer();
};
