import * as THREE from 'three';
import { degToRad, radToDeg } from '../utils.js';
import PixelArt from './PixelArt.js';

class Enemy {
  constructor(camera, scene, enemyType = 1) {
    this.scene = scene;
    this.camera = camera;
    this.player = null;
    this.pixelArt = null;
    this.mesh = new THREE.Group();
    if (enemyType === 1) this.pixelArt = this.createEnemyType1();
    if (enemyType === 2) this.pixelArt = this.createEnemyType2();
    // collisions
    this.collisionMesh = null;
    this.gotHit = false;
  }

  createCollisionMesh(coords, pixelSize) {
    const width = coords.reduce((max, coord) => {
      return Math.max(max, coord.x);
    }, 0);
    const height = coords.reduce((max, coord) => {
      return Math.max(max, coord.y);
    }, 0);
    // handle collision mesh
    // Create a bounding box for collision detection
    const colGeometry = new THREE.BoxGeometry(
      width * pixelSize,
      height * pixelSize,
      pixelSize
    );
    const colMaterial = new THREE.MeshBasicMaterial({
      color: 0x332200,
      visible: false,
    });
    const collisionMesh = new THREE.Mesh(colGeometry, colMaterial);
    collisionMesh.position.x -= pixelSize / 2;
    collisionMesh.position.y += pixelSize / 2;
    // Set the collision mesh in the Enemy instance
    this.mesh.add(collisionMesh);
    this.collisionMesh = collisionMesh;
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
      color,
      1000,
      true
    );
    this.mesh.add(pixelArt.mesh);
    this.createCollisionMesh(customCoordsPos1, pixelSize);
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
      1500,
      true
    );
    this.mesh.add(pixelArt.mesh);
    this.createCollisionMesh(customCoordsPos1, pixelSize);
    return pixelArt;
  };

  update() {
    // this.pixelArt.update();
  }
}

export default Enemy;
