import * as THREE from 'three';
import Enemy from './Enemy';
// level
class Level {
  constructor(camera, scene, gridWidth = 10, gridHeight = 3) {
    this.scene = scene;
    this.camera = camera;
    this.player = null;

    // grid
    this.gridHeight = gridHeight;
    this.gridWidth = gridWidth;
    this.grid = this.initializeGrid();
    // create enemies
    this.enemies = [];
    this.mesh = new THREE.Group();
    this.addEnemies();
    this.centerMesh();

    // level logic
    this.levelCleard = false;
  }
  // create the grid
  initializeGrid() {
    return new Array(this.gridHeight)
      .fill()
      .map(() => new Array(this.gridWidth).fill(0));
  }

  addEnemy(x, y, z, type) {
    this.enemies.push(new Enemy(this.camera, this.scene, type));
    const enemy = this.enemies[this.enemies.length - 1];
    // console.log(enemy.mesh);
    enemy.mesh.position.set(x, y, z);
    enemy.mesh.scale.multiplyScalar(0.1);
    this.mesh.add(enemy.mesh);
  }
  // add all enemies
  addEnemies() {
    this.grid.map((row, i) => {
      row.map((cell, j) => {
        const vericalSpace = i * 2;
        const horizontalSpace = j * 2;
        i % 2 == 0
          ? this.addEnemy(horizontalSpace, vericalSpace, 0, 1)
          : this.addEnemy(horizontalSpace, vericalSpace, 0, 2);
      });
    });
  }

  // remove enemy

  // center the grid
  centerMesh() {
    // Calculate the center position of the mesh
    let totalX = 0;
    this.mesh.children.forEach((child) => {
      totalX += child.position.x;
    });
    const centerX = totalX / this.mesh.children.length;
    this.mesh.position.x = -centerX;
    this.mesh.position.y = 1;
  }

  update() {
    // check if all the enemies are dead by checking if they have a mesh
    if (this.mesh.children.length == 0) {
      this.levelCleard = true;
    }
    // if (this.player) console.log(this.player.bullets);
    this.enemies.map((enemy, index) => {
      this.enemies[index].update();
      this.enemies[index].pixelArt.update();
      if (this.player) enemy.player = this.player;
      if (enemy.gotHit) {
        this.enemies[index].mesh.children.splice(1, 1);
        setTimeout(() => {
          // this.enemies.splice(index, 1);
          this.mesh.remove(enemy.mesh);
        }, 1000);
      }
    });
  }
}

export default Level;
