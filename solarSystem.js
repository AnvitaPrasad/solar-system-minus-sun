// Scene, camera, and renderer setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 100;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xaaaaaa, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xccccff, 2, 300);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// Load textures
const textureLoader = new THREE.TextureLoader();
const orbTexture = textureLoader.load('textures/orb.jpg'); // texture for central orb
const particleTexture = textureLoader.load('textures/particle.png');

// Skybox (Nebula)
const loader = new THREE.CubeTextureLoader();
const skyboxTexture = loader.load([
  'textures/nebula_skybox/px.jpg', 'textures/nebula_skybox/nx.jpg',
  'textures/nebula_skybox/py.jpg', 'textures/nebula_skybox/ny.jpg',
  'textures/nebula_skybox/pz.jpg', 'textures/nebula_skybox/nz.jpg'
]);
scene.background = skyboxTexture;

// Central Orb (Infinity Symbolism)
const orbGeometry = new THREE.SphereGeometry(8, 64, 64);
const orbMaterial = new THREE.MeshStandardMaterial({
  map: orbTexture,
  emissive: new THREE.Color(0x2222ff),
  emissiveIntensity: 0.5
});
const centralOrb = new THREE.Mesh(orbGeometry, orbMaterial);
scene.add(centralOrb);

// Planet data (size, distance, speed)
const planetData = [
  { name: "mercury", size: 0.5, distance: 12, texture: 'textures/mercury.jpg', speed: 0.04 },
  { name: "venus", size: 1.2, distance: 16, texture: 'textures/venus.jpg', speed: 0.015 },
  { name: "earth", size: 1.3, distance: 22, texture: 'textures/earth.jpg', speed: 0.01 },
  { name: "mars", size: 1, distance: 28, texture: 'textures/mars.jpg', speed: 0.008 },
  { name: "jupiter", size: 3, distance: 38, texture: 'textures/jupiter.jpg', speed: 0.004 },
  { name: "saturn", size: 2.5, distance: 50, texture: 'textures/saturn.jpg', speed: 0.003 },
  { name: "uranus", size: 2, distance: 60, texture: 'textures/uranus.jpg', speed: 0.002 },
  { name: "neptune", size: 1.8, distance: 70, texture: 'textures/neptune.jpg', speed: 0.0015 }
];

const planets = [];
planetData.forEach(planet => {
  const planetTexture = textureLoader.load(planet.texture);
  const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
  const material = new THREE.MeshStandardMaterial({ map: planetTexture });
  const mesh = new THREE.Mesh(geometry, material);
  
  mesh.position.x = planet.distance;
  scene.add(mesh);
  
  planets.push({ mesh, distance: planet.distance, speed: planet.speed, angle: 0 });
});

// Ambient Particle Effects
const particles = [];
for (let i = 0; i < 200; i++) {
  const particleGeometry = new THREE.PlaneGeometry(0.5, 0.5);
  const particleMaterial = new THREE.MeshBasicMaterial({
    map: particleTexture,
    transparent: true,
    opacity: Math.random() * 0.8 + 0.2
  });
  const particle = new THREE.Mesh(particleGeometry, particleMaterial);
  
  particle.position.set(
    (Math.random() - 0.5) * 80,
    (Math.random() - 0.5) * 80,
    (Math.random() - 0.5) * 80
  );
  scene.add(particle);
  particles.push(particle);
}

// Animation
function animate() {
  requestAnimationFrame(animate);

  // Rotate planets around central orb
  planets.forEach(planet => {
    planet.angle += planet.speed;
    planet.mesh.position.x = planet.distance * Math.cos(planet.angle);
    planet.mesh.position.z = planet.distance * Math.sin(planet.angle);
  });

  // Rotate particles gently around central orb
  particles.forEach(particle => {
    particle.rotation.z += 0.01;
    particle.position.x += Math.sin(particle.rotation.z) * 0.05;
  });

  renderer.render(scene, camera);
}

animate();
