import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { degToRad, radToDeg } from '../utils.js';
import Bullet from './Bullet.js';

class Player {
  constructor(scene, level, onModelLoaded) {
    this.scene = scene;
    this.level = level;
    this.collisionMesh = null;
    this.mesh = null;
    this.gotHit = false;
    this.position = new THREE.Vector3(0, 0, 0);
    // Load the model
    this.loadModel(onModelLoaded);

    // handle movment
    this.movmentSpeed = 4;
    this.maxRotationAngle = degToRad(30); // Maximum rotation angle
    this.targetRotationZ = 0;
    this.isRotating = false;
    this.rotationLerpFactor = 0.15;
    // handle fire/shooting
    // shooting
    this.bullets = [];
    this.iShooting = false;
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
    // Create a bounding box for collision detection
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
    if (!this.iShooting) return;
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

    this.iShooting = false; // Reset shooting flag
  }

  //

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
      case 'spaceBar':
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
      case 'spaceBar':
      case 'e':
      case 'E':
        this.iShooting = false;
        break;
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
  }
}

export default Player;
