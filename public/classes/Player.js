import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { degToRad, radToDeg } from '../utils.js';
import Bullet from './Bullet.js';
import PixelArt from './PixelArt.js';

class Player {
  constructor(scene, level, onModelLoaded, lives = 3) {
    this.scene = scene;
    this.level = level;
    this.collisionMesh = null;
    this.mesh = null;
    this.position = new THREE.Vector3(0, 0, 0);
    // Load the model
    this.loadModel(onModelLoaded);
    // handle movment
    this.movmentSpeed = 4;
    this.maxRotationAngle = degToRad(30); // Maximum rotation angle
    this.targetRotationZ = 0;
    this.isRotating = false;
    this.rotationLerpFactor = 0.15;
    // Life bar
    this.lives = lives;
    this.lifeBar = [];
    this.lifeBarMesh = new THREE.Group();
    this.scene.add(this.lifeBarMesh);
    this.populateLifebar();
    // handle fire/shooting
    // shooting
    this.bullets = [];
    this.lastShotTime = 0;
    this.shootingCooldown = 200;
    this.iShooting = false;
    // score
    this.score = 0;
    // Keyboard event listener
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  loadModel(onModelLoaded) {
    const loader = new GLTFLoader();
    loader.load(
      'models/Spaceship.gltf',
      (gltf) => {
        // Once loaded, set the mesh
        gltf.scene.scale.multiplyScalar(0.0025);
        gltf.scene.rotation.x = degToRad(90);
        gltf.scene.rotation.y = degToRad(180);
        this.mesh = gltf.scene;
        this.mesh.position.copy(this.position); // Set initial position
        if (onModelLoaded) {
          onModelLoaded(this.mesh);
          this.createCollisionMesh();
        }
      },
      (xhr) => {
        // console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.error('An error occurred while loading the model', error);
      }
    );
  }
  // collision box
  createCollisionMesh = () => {
    // Create a bounding box for collision
    const width = 400;
    const height = 600;
    const colGeometry = new THREE.BoxGeometry(width, 300, height);
    const colMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000, // #ff0000
      visible: false,
    });
    const collisionMesh = new THREE.Mesh(colGeometry, colMaterial);
    //  set collision mesh
    this.mesh.add(collisionMesh);
    this.collisionMesh = collisionMesh;
  };

  // shooting
  fireBullet() {
    if (this.lives > 0) {
      const currentTime = Date.now();
      if (
        !this.iShooting ||
        currentTime - this.lastShotTime < this.shootingCooldown
      )
        return;

      this.bullets.push(
        new Bullet(this.level, this.bullets, this.bullets.length)
      );
      const bullet = this.bullets[this.bullets.length - 1];
      bullet.mesh.position.set(
        this.mesh.position.x,
        this.mesh.position.y,
        this.mesh.position.z
      );
      this.scene.add(bullet.mesh);
      this.iShooting = false;
      this.lastShotTime = currentTime;
    }
  }

  //

  // PLAYER LIFE BAR
  // populate and set the life bar
  populateLifebar = () => {
    const heartSpacing = 15;
    // // add life
    const fullHeartsNeeded = Math.floor(this.lives / 2);
    const remainingLives = this.lives % 2;
    // Create full hearts
    for (let i = 0; i < fullHeartsNeeded; i++) {
      this.createHeart(true);
    }
    // Create a half heart if there's a remaining life
    if (remainingLives > 0) {
      this.createHeart(false);
    }
    // position the hearts
    this.lifeBarMesh.children.map((heart, index) => {
      const posX = (index + 1) * heartSpacing;
      heart.position.set(posX, 0, 0);
    });
    // this.lifeBarMesh.add(heart);
    this.lifeBarMesh.position.set(1, -7.5, 0);
    this.lifeBarMesh.scale.multiplyScalar(0.1);
  };
  // create heart and add life
  createHeart = (isFull) => {
    const halfHeartCoords = [
      // row 1
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      // row 2
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 4, y: 2 },
      { x: 5, y: 2 },
      // row 3
      { x: 1, y: 3 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 5, y: 3 },
      { x: 6, y: 3 },

      // row 4
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 3, y: 4 },
      { x: 4, y: 4 },
      { x: 5, y: 4 },
      { x: 6, y: 4 },
      // row 5
      { x: 2, y: 5 },
      { x: 3, y: 5 },
      { x: 4, y: 5 },
      { x: 5, y: 5 },
      { x: 6, y: 5 },
      // row 6
      { x: 3, y: 6 },
      { x: 4, y: 6 },
      { x: 5, y: 6 },
      { x: 6, y: 6 },
      // row 7
      { x: 4, y: 7 },
      { x: 5, y: 7 },
      { x: 6, y: 7 },
      // row 8
      { x: 5, y: 8 },
      { x: 6, y: 8 },
      // row 9
      { x: 6, y: 9 },
    ];
    const pixelSize = 1.1;
    const pixelSpacing = 0.1;
    const color = 0xff0000; //#ff0000
    const heart = new THREE.Mesh();
    let life;
    const half1 = new PixelArt(
      halfHeartCoords,
      0,
      pixelSize,
      pixelSpacing,
      color,
      1000,
      false
    );
    half1.mesh.position.set(0, 0, 0);
    life = half1;
    this.lifeBar.push(life);
    heart.add(half1.mesh);
    if (isFull) {
      const half2 = new PixelArt(
        halfHeartCoords,
        0,
        pixelSize,
        pixelSpacing,
        color,
        1000,
        false
      );
      life = half2;
      this.lifeBar.push(life);
      half2.mesh.rotation.set(0, 0, degToRad(180));
      half2.mesh.position.set(4.5, 0, 0);
      heart.add(half2.mesh);
    }
    // add the heart to lifebar
    this.lifeBarMesh.add(heart);
  };

  // got hit logic
  gotHit = () => {
    this.lives -= 1;
    this.lifeBar[this.lives].gotHit = true;
    setTimeout(() => {
      this.lifeBar.slice(this.lives, 1);
      this.lifeBarMesh.remove(this.lifeBar[this.lives].mesh);
    }, 1000);
  };

  // KEYBOARD CONTROLS
  handleKeyDown(event) {
    switch (event.key) {
      case 'a':
      case 'A':
      case 'ArrowLeft':
        this.isRotating = true;
        this.targetRotationZ = -this.maxRotationAngle;
        break;
      case 'd':
      case 'D':
      case 'ArrowRight':
        this.isRotating = true;
        this.targetRotationZ = this.maxRotationAngle;
        break;
      case ' ':
      case 'e':
      case 'E':
        this.iShooting = true;
        this.fireBullet();
        break;
    }
  }

  // back to 0
  handleKeyUp(event) {
    switch (event.key) {
      case 'a':
      case 'A':
      case 'ArrowLeft':
      case 'd':
      case 'D':
      case 'ArrowRight':
        this.isRotating = false;
        this.targetRotationZ = 0;
        break;
      case ' ':
      case 'e':
      case 'E':
        this.iShooting = false;
        break;
    }
  }
  // Method to simulate pressing a key
  simulateKeyPress(key) {
    // console.log('okey key');
    switch (key) {
      case 'ArrowLeft':
      case 'ArrowRight':
        this.isRotating = true;
        this.targetRotationZ =
          key === 'ArrowLeft' ? -this.maxRotationAngle : this.maxRotationAngle;
        break;
      case 'Space':
        this.iShooting = true;
        this.fireBullet();
        break;
      default:
        console.error(`Unsupported key: ${key}`);
    }
  }

  // Method to simulate releasing a key
  simulateKeyRelease(key) {
    switch (key) {
      case 'ArrowLeft':
      case 'ArrowRight':
        this.isRotating = false;
        this.targetRotationZ = 0;
        break;
      case 'Space':
        this.iShooting = false;
        break;
      default:
        console.error(`Unsupported key: ${key}`);
    }
  }

  update() {
    if (this.mesh) {
      if (this.isRotating) {
        // Smoothly rotate towards the target rotation
        this.mesh.rotation.z +=
          (this.targetRotationZ - this.mesh.rotation.z) *
          this.rotationLerpFactor;
        // move the player position
        const posX = this.targetRotationZ / this.movmentSpeed;
        this.mesh.position.x += posX;
      } else {
        // Smoothly rotate back to 0
        this.mesh.rotation.z +=
          (0 - this.mesh.rotation.z) * this.rotationLerpFactor;
      }
    }

    //
    // Update bullets
    this.bullets.map((bullet, index) => {
      this.bullets[index].update();
      // remove bullet when its out of screen
      const bulletPosY = this.bullets[index].mesh.position.y;
      if (bulletPosY > 20 || bullet.hasCollided) {
        // remove from array
        this.bullets.splice(index, 1);
        // remove from scene
        this.scene.remove(bullet.mesh);
      }
    });
    // update lifebar
    this.lifeBar.map((life, index) => {
      this.lifeBar[index].update();
    });
    // if (this.lives <= 0) {
    //   // disable shootimg
    //   this.iShooting = true;
    // }
  }
  // end game
}

export default Player;
