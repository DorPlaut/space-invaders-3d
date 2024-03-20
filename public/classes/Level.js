import * as THREE from 'three';
import Enemy from './Enemy';
import Bullet from './Bullet';
// level
class Level {
  constructor(
    camera,
    scene,
    gridWidth = 10,
    gridHeight = 3,
    speed = 1000,
    currentLevel
  ) {
    this.scene = scene;
    this.camera = camera;
    this.player = null;
    this.currentLevel = currentLevel;
    // grid
    this.gridHeight = gridHeight;
    this.gridWidth = gridWidth;
    this.grid = this.initializeGrid();
    // create enemies
    this.enemies = [];
    this.mesh = new THREE.Group();
    this.addEnemies();
    this.centerX = null;

    // level logic
    this.levelCleard = false;

    // shooting
    this.bullets = [];
    this.iShooting = false;

    // animation
    this.isAnimated = true;
    this.animationInterval = null;
    this.speed = speed;
    this.centerMesh();
    this.animate();
  }
  // create the grid
  initializeGrid() {
    return new Array(this.gridHeight)
      .fill()
      .map(() => new Array(this.gridWidth).fill(0));
  }

  // Create Enemy
  addEnemy(x, y, z, type) {
    this.enemies.push(new Enemy(this.camera, this.scene, this, type));
    const enemy = this.enemies[this.enemies.length - 1];
    // console.log(enemy.mesh);
    enemy.mesh.position.set(x, y, z);
    enemy.mesh.scale.multiplyScalar(0.1);
    this.mesh.add(enemy.mesh);
  }
  // Add all enemies
  addEnemies() {
    this.grid.map((row, i) => {
      row.map((cell, j) => {
        const vericalSpace = i * 2;
        const horizontalSpace = j * 2;
        i === 0 && this.addEnemy(horizontalSpace, vericalSpace, 0, 'squid');
        i >= 1 &&
          i < 3 &&
          this.addEnemy(horizontalSpace, vericalSpace, 0, 'crab');
        i >= 3 && this.addEnemy(horizontalSpace, vericalSpace, 0, 'octopus');
      });
    });
  }

  // shoot bullets
  // shooting
  fireBullet = () => {
    // if (!this.iShooting) return;
    this.bullets.push(
      new Bullet(this, this.bullets, this.bullets.length, 'enemy')
    );
    const bullet = this.bullets[this.bullets.length - 1];
    // get list of enemies thet didnt got hit
    const aliveEnemies = this.enemies.filter((enemy) => enemy.gotHit === false);
    const randomIndex = Math.floor(Math.random() * aliveEnemies.length);
    const randomEnemy = aliveEnemies[randomIndex];

    if (randomEnemy) {
      bullet.mesh.position.set(
        randomEnemy.mesh.position.x + this.mesh.position.x,
        randomEnemy.mesh.position.y + this.mesh.position.y,
        randomEnemy.mesh.position.z
      );
      this.scene.add(bullet.mesh);
    }

    this.iShooting = false; // Reset shooting flag
  };

  // center the grid
  centerMesh() {
    // Calculate the center position of the mesh
    let totalX = 0;
    this.mesh.children.forEach((child) => {
      totalX += child.position.x;
    });
    this.centerX = totalX / this.mesh.children.length;
    this.mesh.position.x = -this.centerX;
    this.mesh.position.y = 1;
  }

  // animate the enemies
  animate = () => {
    if (this.isAnimated && this.animationInterval === null) {
      let moveRight = true;
      let moveDown = false;
      let moveCounter = 0;

      this.animationInterval = setInterval(() => {
        // shoot
        const shootingInterval = setTimeout(() => {
          // console.log('bullet');
          this.fireBullet();
          clearInterval(shootingInterval);
        }, this.speed * 0.5);
        // move
        const centerX = this.centerX + this.mesh.position.x;
        const range = 2;
        //

        //
        // change side and move down
        if (moveRight && centerX >= range) {
          this.mesh.position.y -= 0.5;

          moveRight = false;
          moveDown = false;
          moveCounter++;
        }
        // If moving left and reached -range, move down and switch direction
        else if (!moveRight && centerX <= -range) {
          this.mesh.position.y -= 0.5;
          moveRight = true;
          moveDown = false;
          moveCounter++;
          // console.log(this.mesh.position.y);
        }
        // If not moving down, adjust x position based on direction
        else if (!moveDown) {
          if (moveRight) {
            this.mesh.position.x += 0.5;
          } else {
            this.mesh.position.x -= 0.5;
          }
        }

        // After moving right and left twice, reset the counter
        if (moveCounter >= 2) {
          moveCounter = 0;
        }
      }, this.speed);
    }
    if (!this.isAnimated) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
  };

  update() {
    // kill the player if enemies reach the player line
    if (this.mesh.position.y <= -6) {
      clearInterval(this.animationInterval);
    }
    // Update bullets
    this.bullets.map((bullet, index) => {
      this.bullets[index].update();
      // remove bullet when its out of screen
      const bulletPosY = this.bullets[index].mesh.position.y;
      if (bulletPosY < -20 || bullet.hasCollided) {
        // remove from array
        this.bullets.splice(index, 1);
        // remove from scene
        this.scene.remove(bullet.mesh);
      }
    });
    // check if all the enemies are dead by checking if they have a mesh
    if (this.mesh.children.length == 0) {
      clearInterval(this.animationInterval);
      // remove bullets
      this.bullets.map((bullet, index) => {
        this.scene.remove(bullet.mesh);
      });
      // remove player bullets
      this.player.bullets.map((bullet, index) => {
        this.scene.remove(bullet.mesh);
      });
      this.levelCleard = true;
    }
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
