import * as THREE from 'three';
import { degToRad, radToDeg } from '../utils.js';
import FakeGlowMaterial from '../assets/materials/FakeGlowMaterial.js';

class PixelArt {
  constructor(
    customCoordsPos1,
    customCoordsPos2,
    pixelSize,
    pixelSpacing,
    color,
    duration = 1500,
    isAnimted = false,
    isGlowing = true
  ) {
    this.customCoords = customCoordsPos1;
    this.customCoordsPos1 = customCoordsPos1;
    this.customCoordsPos2 = customCoordsPos2;
    this.pixelSize = pixelSize;
    this.pixelSpacing = pixelSpacing;
    this.color = color;
    this.isGlowing = isGlowing;

    this.duration = duration;
    this.isAnimated = isAnimted;
    this.animationInterval = null;

    this.gotHit = false;

    // Create mesh
    this.mesh = this.createPixelArt();

    // Animate mesh
    // if (this.isAnimated) this.animate();

    // center mesh
    const centerOffset =
      ((1 + this.pixelSpacing) *
        this.customCoords.reduce((max, coord) => {
          return Math.max(max, coord.y);
        }, 0)) /
      2;
    this.mesh.position.set(0, centerOffset, 0);
    this.mesh.rotateX(degToRad(180));
  }

  createPixelArt() {
    // Create pixel art grid
    // Calculate width and height of the grid from the custom coords
    const width = this.customCoords.reduce((max, coord) => {
      return Math.max(max, coord.x);
    }, 0);
    const height = this.customCoords.reduce((max, coord) => {
      return Math.max(max, coord.y);
    }, 0);

    const mesh = new THREE.Group();
    const geometry = new THREE.BoxGeometry(
      this.pixelSize,
      this.pixelSize,
      this.pixelSize
    );
    const material = new THREE.MeshStandardMaterial({ color: this.color });
    let glowMesh;
    if (this.isGlowing) {
      glowMesh = new THREE.Mesh(
        new THREE.SphereGeometry(this.pixelSize * 5, 32, 16),
        new FakeGlowMaterial({
          falloff: 0.0,
          glowInternalRadius: 10.0,
          glowColor: this.color,
          glowSharpness: 0.5,
          opacity: 0.06,
          side: THREE.FrontSide,
          depthTest: true,
        })
      );
    }
    // this.mesh.add(this.glowMesh);

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const coord = { x: i + 1, y: j + 1 };
        const generatePixel = this.customCoords.some(
          (c) => c.x === coord.x && c.y === coord.y
        );
        if (generatePixel) {
          const pixel = new THREE.Mesh(geometry, material);
          // Position each pixel
          pixel.position.set(
            i * (1 + this.pixelSpacing) - (width / 2) * (1 + this.pixelSpacing),
            j * (1 + this.pixelSpacing),
            0
          );
          this.isGlowing && pixel.add(glowMesh.clone());
          mesh.add(pixel);
        }
      }
    }
    // Center the pixel art

    return mesh;
  }

  updatePixelArt() {
    if (this.customCoords === this.customCoordsPos1) {
      this.customCoords = this.customCoordsPos2;
    } else {
      this.customCoords = this.customCoordsPos1;
    }

    this.mesh.remove(...this.mesh.children);
    this.mesh.add(...this.createPixelArt().children);
  }

  //

  animate = () => {
    if (this.isAnimated && this.animationInterval === null) {
      this.animationInterval = setInterval(() => {
        this.updatePixelArt();
      }, this.duration);
    }
    if (!this.isAnimated) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
  };

  update() {
    // console.log(this.gotHit);
    if (this.gotHit) {
      clearInterval(this.animationInterval);
      this.isAnimated = false;
      // Iterate over each pixel in the mesh
      this.mesh.children.forEach((pixel) => {
        // Define a random direction and speed for the explosion
        const direction = new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).normalize();
        const speed = Math.random() * 5; // Adjust speed as needed

        // Update the pixel's position
        pixel.position.add(direction.multiplyScalar(speed));

        // Check if the pixel is out of the screen
        if (pixel.position.length() > 10) {
          this.mesh.remove(pixel);
        }
      });
    }
    this.animate();
  }
}

export default PixelArt;
