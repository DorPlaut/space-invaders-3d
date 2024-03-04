import * as THREE from 'three';
import { degToRad, radToDeg } from '../utils.js';

class PixelArt {
  constructor(
    customCoordsPos1,
    customCoordsPos2,
    pixelSize,
    pixelSpacing,
    color,
    duration = 1500,
    isAnimted = true
  ) {
    this.customCoords = customCoordsPos1;
    this.customCoordsPos1 = customCoordsPos1;
    this.customCoordsPos2 = customCoordsPos2;
    this.pixelSize = pixelSize;
    this.pixelSpacing = pixelSpacing;
    this.color = color;

    this.duration = duration;
    this.isAnimated = isAnimted;

    // Create mesh
    this.mesh = this.createPixelArt();

    // Animate mesh
    if (this.isAnimated) this.animate();

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
    const material = new THREE.MeshBasicMaterial({ color: this.color });

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
    this.mesh.add(this.createPixelArt());
  }

  animate = () => {
    const animationInterval = setInterval(() => {
      this.updatePixelArt();
    }, this.duration);
  };

  update() {}
}

export default PixelArt;
