import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

class Text {
  constructor(scene, text = 'Hello world') {
    this.scene = scene;
    this.text = text;
    this.mesh = null;
    this.createMesh();
  }

  createMesh = async () => {
    const loader = new FontLoader();
    const text = this.text;
    let geometry;
    await loader.load('fonts/Pixelify Sans_Regular.json', function (font) {
      geometry = new TextGeometry('HELLLOOO', {
        font: font,
        size: 100,
        height: 100,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 10,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5,
      });
    });
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff }); // #ffffff
    this.mesh = new THREE.Mesh(geometry, material);
    console.log(this.mesh);
    this.scene.add(this.mesh);
    // return mesh;
  };
}
export default Text;
