// Настройка сцены
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  alpha: true // Прозрачный фон
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// 1. Создание геометрической "Планеты" (Икосаэдр)
const geometry = new THREE.IcosahedronGeometry(10, 1); // Форма
const material = new THREE.MeshBasicMaterial({ 
    color: 0x00ffff, 
    wireframe: true // Сетка вместо сплошного цвета
});
const planet = new THREE.Mesh(geometry, material);
scene.add(planet);

// 2. Создание звездного фона
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  // Случайная позиция
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

// Создаем 200 звезд
Array(200).fill().forEach(addStar);

// Освещение (хотя для wireframe оно не обязательно, но пусть будет)
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Анимация
function animate() {
  requestAnimationFrame(animate);

  // Вращение планеты
  planet.rotation.x += 0.002;
  planet.rotation.y += 0.005;
  planet.rotation.z += 0.002;

  // Движение камеры (эффект полета)
  // camera.position.z -= 0.01; 

  renderer.render(scene, camera);
}

animate();

// Адаптивность при изменении размера окна
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
