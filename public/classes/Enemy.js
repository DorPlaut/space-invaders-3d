import * as THREE from 'three';
import { degToRad, radToDeg } from '../utils.js';
import PixelArt from './PixelArt.js';

class Enemy {
  constructor(camera, scene, level, enemyType = 'squid') {
    this.scene = scene;
    this.camera = camera;
    this.player = null;
    this.pixelArt = null;
    this.level = level;
    this.mesh = new THREE.Group();
    if (enemyType === 'squid') this.pixelArt = this.createSquid();
    if (enemyType === 'crab') this.pixelArt = this.createCrab();
    if (enemyType === 'octopus') this.pixelArt = this.createOctopus();
    this.points = 0;
    if (enemyType === 'squid') this.points = 10;
    if (enemyType === 'crab') this.points = 20;
    if (enemyType === 'octopus') this.points = 30;
    // collisions
    this.collisionMesh = null;
    this.gotHit = false;
    // jumping
    this.jumping = false;
    this.falling = false;
    this.jumpInterval = null;
    this.fallTimeout = null;

    if (this.level.currentLevel % 3 == 0) {
      this.activateJumpTimer();
    } else {
      clearInterval(this.jumpInterval);
    }
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
      color: 0xff0000, // #ff0000
      visible: false,
    });
    const collisionMesh = new THREE.Mesh(colGeometry, colMaterial);
    collisionMesh.position.x -= pixelSize / 2;
    collisionMesh.position.y += pixelSize / 2;
    // Set the collision mesh in the Enemy instance
    this.mesh.add(collisionMesh);
    this.collisionMesh = collisionMesh;
  }

  // create enemy types
  createSquid = () => {
    const customCoordsPos1 = [
      // row 1
      { x: 4, y: 1 },
      { x: 5, y: 1 },
      // row 2
      { x: 3, y: 2 },
      { x: 4, y: 2 },
      { x: 5, y: 2 },
      { x: 6, y: 2 },
      // row 3
      { x: 2, y: 3 },
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 5, y: 3 },
      { x: 6, y: 3 },
      { x: 7, y: 3 },
      // row 4
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 4, y: 4 },
      { x: 5, y: 4 },
      { x: 7, y: 4 },
      { x: 8, y: 4 },
      // row 5
      { x: 1, y: 5 },
      { x: 2, y: 5 },
      { x: 3, y: 5 },
      { x: 4, y: 5 },
      { x: 5, y: 5 },
      { x: 6, y: 5 },
      { x: 7, y: 5 },
      { x: 8, y: 5 },
      // row 6
      { x: 3, y: 6 },
      { x: 6, y: 6 },
      // row 7
      { x: 2, y: 7 },
      { x: 4, y: 7 },
      { x: 5, y: 7 },
      { x: 7, y: 7 },
      // row 8
      { x: 1, y: 8 },
      { x: 3, y: 8 },
      { x: 6, y: 8 },
      { x: 8, y: 8 },
    ];
    const customCoordsPos2 = [
      // row 1
      { x: 4, y: 1 },
      { x: 5, y: 1 },
      // row 2
      { x: 3, y: 2 },
      { x: 4, y: 2 },
      { x: 5, y: 2 },
      { x: 6, y: 2 },
      // row 3
      { x: 2, y: 3 },
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 5, y: 3 },
      { x: 6, y: 3 },
      { x: 7, y: 3 },
      // row 4
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 4, y: 4 },
      { x: 5, y: 4 },
      { x: 7, y: 4 },
      { x: 8, y: 4 },
      // row 5
      { x: 1, y: 5 },
      { x: 2, y: 5 },
      { x: 3, y: 5 },
      { x: 4, y: 5 },
      { x: 5, y: 5 },
      { x: 6, y: 5 },
      { x: 7, y: 5 },
      { x: 8, y: 5 },
      // row 6
      { x: 2, y: 6 },
      { x: 4, y: 6 },
      { x: 5, y: 6 },
      { x: 7, y: 6 },
      // row 7
      { x: 1, y: 7 },
      { x: 8, y: 7 },
      // row 8
      { x: 2, y: 8 },
      { x: 7, y: 8 },
    ];
    const pixelSize = 1.1;
    const pixelSpacing = 0.1;
    const color = 0x33ff00; //#33ff00
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
  //
  //
  createOctopus = () => {
    const customCoordsPos1 = [
      // row 1
      { x: 5, y: 1 },
      { x: 6, y: 1 },
      { x: 7, y: 1 },
      { x: 8, y: 1 },
      // row 2
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 4, y: 2 },
      { x: 5, y: 2 },
      { x: 6, y: 2 },
      { x: 7, y: 2 },
      { x: 8, y: 2 },
      { x: 9, y: 2 },
      { x: 10, y: 2 },
      { x: 11, y: 2 },
      // row 3
      { x: 1, y: 3 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 5, y: 3 },
      { x: 6, y: 3 },
      { x: 7, y: 3 },
      { x: 8, y: 3 },
      { x: 9, y: 3 },
      { x: 10, y: 3 },
      { x: 11, y: 3 },
      { x: 12, y: 3 },
      // row 4
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 3, y: 4 },
      { x: 6, y: 4 },
      { x: 7, y: 4 },
      { x: 10, y: 4 },
      { x: 11, y: 4 },
      { x: 12, y: 4 },
      // row 5
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
      { x: 12, y: 5 },
      // row 6
      { x: 4, y: 6 },
      { x: 5, y: 6 },
      { x: 8, y: 6 },
      { x: 9, y: 6 },
      // row 7
      { x: 3, y: 7 },
      { x: 4, y: 7 },
      { x: 6, y: 7 },
      { x: 7, y: 7 },
      { x: 9, y: 7 },
      { x: 10, y: 7 },
      // row 8
      { x: 1, y: 8 },
      { x: 2, y: 8 },
      { x: 11, y: 8 },
      { x: 12, y: 8 },
    ];
    const customCoordsPos2 = [
      // row 1
      { x: 5, y: 1 },
      { x: 6, y: 1 },
      { x: 7, y: 1 },
      { x: 8, y: 1 },
      // row 2
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 4, y: 2 },
      { x: 5, y: 2 },
      { x: 6, y: 2 },
      { x: 7, y: 2 },
      { x: 8, y: 2 },
      { x: 9, y: 2 },
      { x: 10, y: 2 },
      { x: 11, y: 2 },
      // row 3
      { x: 1, y: 3 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 5, y: 3 },
      { x: 6, y: 3 },
      { x: 7, y: 3 },
      { x: 8, y: 3 },
      { x: 9, y: 3 },
      { x: 10, y: 3 },
      { x: 11, y: 3 },
      { x: 12, y: 3 },

      // row 4
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 3, y: 4 },
      { x: 6, y: 4 },
      { x: 7, y: 4 },
      { x: 10, y: 4 },
      { x: 11, y: 4 },
      { x: 12, y: 4 },

      // row 5
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
      { x: 12, y: 5 },
      // row 6
      { x: 3, y: 6 },
      { x: 4, y: 6 },
      { x: 5, y: 6 },
      { x: 8, y: 6 },
      { x: 9, y: 6 },
      { x: 10, y: 6 },
      // row 7
      { x: 2, y: 7 },
      { x: 3, y: 7 },
      { x: 6, y: 7 },
      { x: 7, y: 7 },
      { x: 10, y: 7 },
      { x: 11, y: 7 },
      // row 8
      { x: 3, y: 8 },
      { x: 4, y: 8 },
      { x: 9, y: 8 },
      { x: 10, y: 8 },
    ];
    const pixelSize = 1.1;
    const pixelSpacing = 0.1;
    const color = 0xffee00; //#ffee00
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

  createCrab = () => {
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
    const color = 0xff00aa; //#ff00aa
    const pixelArt = new PixelArt(
      customCoordsPos1,
      customCoordsPos2,
      pixelSize,
      pixelSpacing,
      color,
      1250,
      true
    );
    this.mesh.add(pixelArt.mesh);
    this.createCollisionMesh(customCoordsPos1, pixelSize);
    return pixelArt;
  };

  handleJumping = () => {
    if (this.jumping) {
      if (this.mesh.position.z >= 1) {
        this.jumping = false;
        this.fallTimeout = setTimeout(() => {
          this.falling = true;
        }, 2000);
      }
    }

    if (this.falling) {
      if (this.mesh.position.z <= 0) {
        clearInterval(this.fallTimeout);
        this.falling = false;
      }
    }
    // if (this.mesh.position.z >= 1) {
    //   this.jumping = false;
    //   this.fallTimeout = setTimeout(() => {
    //     this.falling = true;
    //   }, 2000);
    // }
    // if (this.mesh.position.z <= 0 && this.falling) {
    //   clearInterval(this.fallTimeout);
    //   this.jumping = false;
    //   this.falling = false;
    // }
  };

  // trigger jumping randomly
  activateJumpTimer = () => {
    this.jumpInterval = setInterval(() => {
      console.log('jump');
      this.jumping = true;
    }, Math.floor(Math.random() * 10000) + 1000);
  };
  // clear jumpInterval
  clearJumpInterval() {
    clearInterval(this.jumpInterval);
  }
  // handle enemy rotation (face the camera )
  handleEnemyRotation() {
    switch (this.level.currentLevel % 3) {
      case 1: // Level 1
        if (this.mesh.rotation.x > degToRad(0)) this.mesh.rotation.x -= 0.1;
        break;
      case 2: // Level 2
        if (this.mesh.rotation.x < degToRad(45)) this.mesh.rotation.x += 0.1;
        break;
      case 0: // Level 3
        if (this.mesh.rotation.x < degToRad(90)) this.mesh.rotation.x += 0.1;
        this.handleJumping();
        break;
      default:
        break;
    }
  }

  update() {
    this.handleEnemyRotation();

    if (this.jumping) {
      this.mesh.position.z += 0.1; // Increase z position while jumping
    }
    if (this.falling) {
      this.mesh.position.z -= 0.1; // Decrease z position while falling
    }

    if (this.mesh.position.z <= 0) {
      this.jumping = false;
      this.falling = false;
    }

    if (this.level.currentLevel % 3 != 0) {
      this.clearJumpInterval();
    }
    if (this.gotHit) {
      this.clearJumpInterval();
      clearInterval(this.fallTimeout);
    }
  }
}

export default Enemy;
