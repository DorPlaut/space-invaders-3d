import * as THREE from 'three';
import { degToRad, radToDeg } from '../utils.js';

class Bullet {
  constructor() {
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.2, 0.2),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    this.speed = 0.5;
  }

  update() {
    console.log('bullet is on screen');
    this.mesh.position.y += this.speed;
  }
}
export default Bullet;
