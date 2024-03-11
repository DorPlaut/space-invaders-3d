import * as THREE from 'three';
import { degToRad, radToDeg } from '../utils.js';
import FakeGlowMaterial from '../materials/FakeGlowMaterial.js';

class Bullet {
  constructor(level, bullets, index, type = 'player') {
    this.level = level;
    this.bullets = bullets;
    this.bulletIndex = index;
    this.type = type;
    this.color = type === 'player' ? 0x30bdff : 0xff0101; //#30bdff #ff0101
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.2, 0.2),
      // new THREE.SphereGeometry(0.2, 32, 16),
      new THREE.MeshBasicMaterial({
        color: this.color,
      })
    );
    this.speed = 0.5;
    // collision
    this.raycaster = new THREE.Raycaster();
    this.hasCollided = false;
    // glow mesh
    this.glowMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 16),
      new FakeGlowMaterial({
        falloff: 0.2,
        glowInternalRadius: 10,
        glowColor: this.color,
        glowSharpness: 0,
        opacity: 1,
        side: THREE.FrontSide,
        depthTest: true,
      })
    );
    this.mesh.add(this.glowMesh);
  }

  update() {
    if (this.hasCollided) return;
    // move bullet
    if (this.type == 'player') this.mesh.position.y += this.speed;
    if (this.type == 'enemy') this.mesh.position.y -= this.speed * 0.5;
    // Update raycaster
    this.raycaster.set(
      this.mesh.position,
      new THREE.Vector3(0, this.type == 'player' ? -1 : 1, 0)
    );

    // check if enemy bullet or player bullet
    if (this.type == 'player') {
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
            // * bug. somthimse detect collision on bullet exit screen - temporery solution  *
            // * detect false hit
            const flaseHit = intersects[0].distance > 1;
            // * end
            // update enemy
            if (!flaseHit && enemy) {
              this.hasCollided = true;
              enemy.gotHit = true;
              enemy.pixelArt.gotHit = true;
            }
            // update bullet
          }
        }
      }
    } else {
      const collisionBox = this.level.player.mesh.children[1];
      // console.log(this.level.player.mesh.position);
      const intersects = this.raycaster.intersectObjects([collisionBox], true);

      if (intersects.length > 0) {
        const flaseHit = intersects[0].distance > 1;
        if (!flaseHit && this.level.player.lives > 0) {
          console.log('bullet hit the player');
          this.hasCollided = true;
          this.level.player.gotHit();
          this.hasCollided = true;
        }
      }
    }
  }
}
export default Bullet;
