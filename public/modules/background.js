import gsap from 'gsap';
import * as THREE from 'three';

let player;
let level;
let animationSpeed = 2000;
let animationSpeedObject = { value: animationSpeed };
let lastFrameTime = performance.now(); // Initialize the last frame time

export const updatePlayer = (element) => {
  player = element;
};
export const updateLevel = (element) => {
  level = element;
};

// update animation speed

export const updateAnimationSpeed = (targetSpeed) => {
  const duration = 1;
  gsap.to(animationSpeedObject, {
    value: targetSpeed,
    duration: duration,
    ease: 'easeInOutCubic',
  });
};

// Function to create and render the scene with custom fragment shader
export const renderCustomShader = async () => {
  const fragmentShaderCode = await fetch('/assets/shaders/fragment.glsl')
    .then((response) => response.text())
    .catch((error) => console.error('Error loading fragment shader:', error));

  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.top = '0';
  container.style.left = '0';
  container.style.zIndex = '-1'; // Make sure it's behind the canvas
  container.style.width = '100%';
  container.style.height = '100%';
  document.body.appendChild(container);

  // Scene setup
  const scene = new THREE.Scene();

  // Geometry
  // const geometry = new THREE.BufferGeometry();
  const geometry = new THREE.PlaneGeometry(2, 2); // Square geometry

  // Custom shader material
  const customMaterial = new THREE.ShaderMaterial({
    uniforms: {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2() },
      u_mouse: { value: new THREE.Vector2() },
      u_player: { value: new THREE.Vector2() },
      u_level: { value: new THREE.Vector2() },
    },
    vertexShader: `
            varying vec2 vUv;

            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1.0);
            }
        `,
    fragmentShader: fragmentShaderCode,
  });

  // Mesh
  const mesh = new THREE.Mesh(geometry, customMaterial);
  scene.add(mesh);

  // Camera
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 1;

  // Renderer
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Render loop
  function animate(time) {
    requestAnimationFrame(animate);
    //
    const elapsedTime = (time - lastFrameTime) / 2000; // Time in seconds
    lastFrameTime = time;
    //
    if (player) {
      const playerPosition = new THREE.Vector2(
        (player.positionOnScreen.x / window.innerWidth) * 2 - 1,
        -(player.positionOnScreen.y / window.innerHeight) * 2 + 1
      );
      customMaterial.uniforms.u_player.value.copy(playerPosition);
      // console.log(playerPosition);
    }
    //
    if (level) {
      // set the level position
      const levelPosition = new THREE.Vector2(
        (level.centerPositionOnScreen.x / window.innerWidth) * 2 - 1,
        -(level.centerPositionOnScreen.y / window.innerHeight) * 2 + 1
      );
      customMaterial.uniforms.u_level.value.copy(levelPosition);
    }

    //
    customMaterial.uniforms.u_time.value +=
      elapsedTime / (animationSpeedObject.value / 1000);

    // customMaterial.uniforms.u_time.value = time / animationSpeedObject.value; // Update time uniform
    customMaterial.uniforms.u_resolution.value.x = window.innerWidth; // Update resolution uniform
    customMaterial.uniforms.u_resolution.value.y = window.innerHeight;

    renderer.render(scene, camera);
  }
  animate(0);

  // Handle window resize
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    customMaterial.uniforms.u_resolution.value.x = window.innerWidth;
    customMaterial.uniforms.u_resolution.value.y = window.innerHeight;
  });

  // Handle mouse move to update mouse position
  window.addEventListener('mousemove', (event) => {
    const mousePosition = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    customMaterial.uniforms.u_mouse.value.copy(mousePosition);
  });
};
