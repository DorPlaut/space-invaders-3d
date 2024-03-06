import * as THREE from 'three';
import { degToRad, radToDeg } from '../utils.js';

class Bullet {
  constructor(level, bullets, index) {
    this.level = level;
    this.bullets = bullets;
    this.bulletIndex = index;
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.2, 0.2),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    this.speed = 0.5;
    // collision
    this.raycaster = new THREE.Raycaster();
    this.hasCollided = false;
  }

  update() {
    if (this.hasCollided) return;
    // move bullet
    this.mesh.position.y += this.speed;
    // Update raycaster
    this.raycaster.set(this.mesh.position, new THREE.Vector3(0, -1, 0));
    // get the enemies
    const enemies = this.level.enemies;
    for (const enemy of enemies) {
      // stop shooting and update enemy action at collision
      const collisionBox = enemy.mesh.children[1];
      if (collisionBox) {
        const intersects = this.raycaster.intersectObjects(
          [collisionBox],
          true
        );
        if (intersects.length > 0) {
          // update enemy
          enemy.gotHit = true;
          enemy.pixelArt.gotHit = true;
          // update bullet
          this.hasCollided = true;
        }
      }
    }
  }
}
export default Bullet;
