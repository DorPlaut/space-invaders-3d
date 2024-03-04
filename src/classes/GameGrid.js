import * as THREE from 'three';
import Enemy from './Enemy';

class GameGrid {
  constructor(gridHeight = 6, gridWidth = 15) {
    this.gridHeight = gridHeight;
    this.gridWidth = gridWidth;
    // create the grid
    this.grid = this.initializeGrid();
    this.mesh = new THREE.Group();
    // fill the grid enemies
    this.fillGrid();
    // Center the mesh after filling the grid
    this.centerMesh();
  }
  // create the grid
  initializeGrid() {
    return new Array(this.gridHeight)
      .fill()
      .map(() => new Array(this.gridWidth).fill(0));
  }
  // fill grid with enemies.
  fillGrid() {
    this.grid.map((row, y) => {
      row.map((cell, x) => {
        // enemy
        let enemy;
        if (y % 2 == 0) enemy = new Enemy(1);
        if (y % 2 != 0) enemy = new Enemy(2);

        enemy.createEnemyType1();
        enemy.mesh.position.set(x * 1.5, y * 1.5, 0);
        enemy.mesh.scale.multiplyScalar(0.1);
        this.mesh.add(enemy.mesh);
      });
    });
  }
  // center the grid
  centerMesh() {
    // Calculate the center position of the mesh
    let totalX = 0;
    this.mesh.children.forEach((child) => {
      totalX += child.position.x;
    });
    const centerX = totalX / this.mesh.children.length;
    this.mesh.position.x = -centerX;
  }
  update() {}
}

export default GameGrid;
