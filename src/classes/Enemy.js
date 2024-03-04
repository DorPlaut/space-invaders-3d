import * as THREE from 'three';
import { degToRad, radToDeg } from '../utils.js';
import PixelArt from './PixelArt.js';

class Enemy {
  constructor(enemyType = 1) {
    if (enemyType === 1) this.pixelArt = this.createEnemyType1();
    if (enemyType === 2) this.pixelArt = this.createEnemyType2();
    this.mesh = new THREE.Group();
    this.mesh.add(this.pixelArt.mesh);
    // this.mesh = this.createEnemyType1();
  }
  createEnemyType1 = () => {
    const customCoordsPos1 = [
      { x: 3, y: 1 },
      { x: 9, y: 1 },
      { x: 4, y: 2 },
      { x: 8, y: 2 },
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 5, y: 3 },
      { x: 6, y: 3 },
      { x: 7, y: 3 },
      { x: 8, y: 3 },
      { x: 9, y: 3 },
      { x: 2, y: 4 },
      { x: 3, y: 4 },
      { x: 5, y: 4 },
      { x: 6, y: 4 },
      { x: 7, y: 4 },
      { x: 9, y: 4 },
      { x: 10, y: 4 },
      { x: 1, y: 5 },
      { x: 2, y: 5 },
      { x: 3, y: 5 },
      { x: 4, y: 5 },
      { x: 5, y: 5 },
      { x: 6, y: 5 },
      { x: 7, y: 5 },
      { x: 8, y: 5 },
      { x: 9, y: 5 },
      { x: 10, y: 5 },
      { x: 11, y: 5 },
      { x: 1, y: 6 },
      { x: 3, y: 6 },
      { x: 4, y: 6 },
      { x: 5, y: 6 },
      { x: 6, y: 6 },
      { x: 7, y: 6 },
      { x: 8, y: 6 },
      { x: 9, y: 6 },
      { x: 11, y: 6 },
      { x: 1, y: 7 },
      { x: 3, y: 7 },
      { x: 9, y: 7 },
      { x: 11, y: 7 },
      { x: 4, y: 8 },
      { x: 5, y: 8 },
      { x: 7, y: 8 },
      { x: 8, y: 8 },
    ];
    const customCoordsPos2 = [
      { x: 3, y: 1 },
      { x: 9, y: 1 },
      { x: 1, y: 2 },
      { x: 4, y: 2 },
      { x: 8, y: 2 },
      { x: 11, y: 2 },
      { x: 1, y: 3 },
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 5, y: 3 },
      { x: 6, y: 3 },
      { x: 7, y: 3 },
      { x: 8, y: 3 },
      { x: 9, y: 3 },
      { x: 11, y: 3 },
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 3, y: 4 },
      { x: 5, y: 4 },
      { x: 6, y: 4 },
      { x: 7, y: 4 },
      { x: 9, y: 4 },
      { x: 10, y: 4 },
      { x: 11, y: 4 },
      { x: 1, y: 5 },
      { x: 2, y: 5 },
      { x: 3, y: 5 },
      { x: 4, y: 5 },
      { x: 5, y: 5 },
      { x: 6, y: 5 },
      { x: 7, y: 5 },
      { x: 8, y: 5 },
      { x: 9, y: 5 },
      { x: 10, y: 5 },
      { x: 11, y: 5 },
      { x: 2, y: 6 },
      { x: 3, y: 6 },
      { x: 4, y: 6 },
      { x: 5, y: 6 },
      { x: 6, y: 6 },
      { x: 7, y: 6 },
      { x: 8, y: 6 },
      { x: 9, y: 6 },
      { x: 10, y: 6 },
      { x: 3, y: 7 },
      { x: 9, y: 7 },
      { x: 2, y: 8 },
      { x: 10, y: 8 },
    ];
    const pixelSize = 1.1;
    const pixelSpacing = 0.1;
    const color = 0x33ff00;
    const pixelArt = new PixelArt(
      customCoordsPos1,
      customCoordsPos2,
      pixelSize,
      pixelSpacing,
      color
    );
    // fix this!
    // pixelArt.update();
    const mesh = new THREE.Group();
    mesh.add(pixelArt.mesh);
    return pixelArt;
  };

  createEnemyType2 = () => {
    const customCoordsPos1 = [
      { x: 3, y: 1 },
      { x: 9, y: 1 },
      { x: 4, y: 2 },
      { x: 8, y: 2 },
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 5, y: 3 },
      { x: 6, y: 3 },
      { x: 7, y: 3 },
      { x: 8, y: 3 },
      { x: 9, y: 3 },
      { x: 2, y: 4 },
      { x: 3, y: 4 },
      { x: 5, y: 4 },
      { x: 6, y: 4 },
      { x: 7, y: 4 },
      { x: 9, y: 4 },
      { x: 10, y: 4 },
      { x: 1, y: 5 },
      { x: 2, y: 5 },
      { x: 3, y: 5 },
      { x: 4, y: 5 },
      { x: 5, y: 5 },
      { x: 6, y: 5 },
      { x: 7, y: 5 },
      { x: 8, y: 5 },
      { x: 9, y: 5 },
      { x: 10, y: 5 },
      { x: 11, y: 5 },
      { x: 1, y: 6 },
      { x: 3, y: 6 },
      { x: 4, y: 6 },
      { x: 5, y: 6 },
      { x: 6, y: 6 },
      { x: 7, y: 6 },
      { x: 8, y: 6 },
      { x: 9, y: 6 },
      { x: 11, y: 6 },
      { x: 1, y: 7 },
      { x: 3, y: 7 },
      { x: 9, y: 7 },
      { x: 11, y: 7 },
      { x: 4, y: 8 },
      { x: 5, y: 8 },
      { x: 7, y: 8 },
      { x: 8, y: 8 },
    ];
    const customCoordsPos2 = [
      { x: 3, y: 1 },
      { x: 9, y: 1 },
      { x: 1, y: 2 },
      { x: 4, y: 2 },
      { x: 8, y: 2 },
      { x: 11, y: 2 },
      { x: 1, y: 3 },
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 5, y: 3 },
      { x: 6, y: 3 },
      { x: 7, y: 3 },
      { x: 8, y: 3 },
      { x: 9, y: 3 },
      { x: 11, y: 3 },
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 3, y: 4 },
      { x: 5, y: 4 },
      { x: 6, y: 4 },
      { x: 7, y: 4 },
      { x: 9, y: 4 },
      { x: 10, y: 4 },
      { x: 11, y: 4 },
      { x: 1, y: 5 },
      { x: 2, y: 5 },
      { x: 3, y: 5 },
      { x: 4, y: 5 },
      { x: 5, y: 5 },
      { x: 6, y: 5 },
      { x: 7, y: 5 },
      { x: 8, y: 5 },
      { x: 9, y: 5 },
      { x: 10, y: 5 },
      { x: 11, y: 5 },
      { x: 2, y: 6 },
      { x: 3, y: 6 },
      { x: 4, y: 6 },
      { x: 5, y: 6 },
      { x: 6, y: 6 },
      { x: 7, y: 6 },
      { x: 8, y: 6 },
      { x: 9, y: 6 },
      { x: 10, y: 6 },
      { x: 3, y: 7 },
      { x: 9, y: 7 },
      { x: 2, y: 8 },
      { x: 10, y: 8 },
    ];
    const pixelSize = 1.1;
    const pixelSpacing = 0.1;
    const color = 0xff00b3;
    // #ff00b3;
    const pixelArt = new PixelArt(
      customCoordsPos1,
      customCoordsPos2,
      pixelSize,
      pixelSpacing,
      color,
      2000,
      true
    );
    // fix this!
    // pixelArt.update();
    const mesh = new THREE.Group();
    mesh.add(pixelArt.mesh);
    return pixelArt;
  };

  update() {
    this.pixelArt.update();
  }
}

export default Enemy;
