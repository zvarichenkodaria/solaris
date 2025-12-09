// === БАЗА ДАННЫХ ПЛАНЕТ ===
const planets = [
    { key: 'sun', name: 'СОЛНЦЕ', type: 'Звезда G2V', texture: 'textures/sun.jpg', desc: 'Звезда главной последовательности класса G. Масса Солнца составляет 99,86 % от суммарной массы всей Солнечной системы.' },
    { key: 'mercury', name: 'МЕРКУРИЙ', type: 'Каменная планета', texture: 'textures/mercury.jpg', desc: 'Самая маленькая планета системы. Температура на поверхности колеблется от −173 °C до +427 °C.' },
    { key: 'venus', name: 'ВЕНЕРА', type: 'Токсичный мир', texture: 'textures/venus.jpg', desc: 'Вторая планета от Солнца. Имеет плотную атмосферу из углекислого газа, создающую невероятный парниковый эффект.' },
    { key: 'earth', name: 'ЗЕМЛЯ', type: 'Наш дом', texture: 'textures/earth.jpg', desc: 'Колыбель человечества. Единственное известное тело во Вселенной, населенное живыми организмами.' },
    { key: 'mars', name: 'МАРС', type: 'Красная планета', texture: 'textures/mars.jpg', desc: 'Планета с разряженной атмосферой. Особенности рельефа — ударные кратеры, вулканы, долины и пустыни.' },
    { key: 'jupiter', name: 'ЮПИТЕР', type: 'Газовый гигант', texture: 'textures/jupiter.jpg', desc: 'Крупнейшая планета Солнечной системы. Ряд атмосферных явлений на Юпитере — штормы, молнии, полярные сияния.' }
];

let currentPlanetIndex = 0;
let isExploring = false;

// === THREE.JS SETUP ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const planetGroup = new THREE.Group();
scene.add(planetGroup);

// ПЛАНЕТА: transparent: true обязателен для исчезновения
const geometry = new THREE.SphereGeometry(6, 64, 64);
const material = new THREE.MeshStandardMaterial({ 
    color: 0xffffff, roughness: 0.8, metalness: 0.1,
    transparent: true, opacity: 1 
});
const planetMesh = new THREE.Mesh(geometry, material);
planetGroup.add(planetMesh);

// Освещение
const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
sunLight.position.set(10, 10, 20); scene.add(sunLight);
const rimLight = new THREE.SpotLight(0x00d2ff, 2);
rimLight.position.set(-10, 10, -5); rimLight.lookAt(0,0,0); scene.add(rimLight);
const ambientLight = new THREE.AmbientLight(0x404040, 0.3); scene.add(ambientLight);

// Звездное поле
const starsGeometry = new THREE.BufferGeometry();
const starsCount = 5000;
const posArray = new Float32Array(starsCount * 3);
for(let i=0; i<starsCount*3; i++) posArray[i] = (Math.random() - 0.5) * 600;
starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const starsMaterial = new THREE.PointsMaterial({ size: 0.15, color: 0xffffff, transparent: true, opacity: 0.8 });
const starsMesh = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starsMesh);

camera.position.set(0, 0, 40);

// === СКРОЛЛ ЭФФЕКТ ===
window.addEventListener('scroll', () => {
    if (isExploring) return;

    const scrollY = window.scrollY;
    const fadeEnd = 400; // Через 400px планета исчезнет

    let opacity = 1 - (scrollY / fadeEnd);
    if (opacity < 0) opacity = 0;
    
    planetMesh.material.opacity = opacity;
    
    // Если прозрачность 0, выключаем рендеринг, чтобы не перекрывать клики
    if (opacity <= 0.05) {
        planetMesh.visible = false;
    } else {
        planetMesh.visible = true;
    }
});

// === СЛАЙДЕР ФАКТОВ ===
let currentSlide = 0;
const slides = document.querySelectorAll('.fact-slide');
const dots = document.querySelectorAll('.slider-dot');
let slideInterval;

function showSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => { d.classList.remove('active'); void d.offsetWidth; });
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
}

function nextSlide() {
    let next = currentSlide + 1;
    if (next >= slides.length) next = 0;
    showSlide(next);
}

function startSlider() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
}
// Глобальная функция для onclick
window.setSlide = function(index) {
    clearInterval(slideInterval);
    showSlide(index);
    startSlider();
}
startSlider();


// === УПРАВЛЕНИЕ UI 3D ===
const navDock = document.querySelector('.nav-dock');
planets.forEach((p, index) => {
    const btn = document.createElement('button');
    btn.className = 'planet-btn';
    if(index === 0) btn.classList.add('active');
    btn.title = p.name;
    btn.onclick = () => warpToPlanet(index);
    navDock.appendChild(btn);
});

// ФУНКЦИИ ПЕРЕХОДОВ (GSAP)
window.startJourney = function() {
    isExploring = true;
    planetMesh.visible = true; planetMesh.material.opacity = 1; // Убедимся что видна
    
    const landing = document.getElementById('landing-screen');
    landing.classList.remove('active'); setTimeout(() => landing.classList.add('hidden'), 500);

    gsap.to(starsMesh.scale, { z: 5, duration: 1.5, ease: "power2.in" });
    gsap.to(camera.position, { z: 20, duration: 2, ease: "power2.inOut" });

    const overlay = document.getElementById('warp-overlay');
    setTimeout(() => {
        overlay.style.opacity = '1';
        loadPlanetData(0);
        document.getElementById('explorer-screen').classList.remove('hidden');
        setTimeout(() => document.getElementById('explorer-screen').classList.add('active'), 10);
        setTimeout(() => {
            overlay.style.opacity = '0';
            document.getElementById('info-panel').classList.add('visible');
            gsap.to(starsMesh.scale, { z: 1, duration: 2 });
        }, 500);
    }, 1500);
}

window.exitJourney = function() {
    isExploring = false;
    document.getElementById('info-panel').classList.remove('visible');
    const explorer = document.getElementById('explorer-screen');
    explorer.classList.remove('active'); setTimeout(() => explorer.classList.add('hidden'), 500);

    gsap.to(starsMesh.scale, { z: 5, duration: 1, ease: "power2.in" });
    const overlay = document.getElementById('warp-overlay');
    setTimeout(() => {
        overlay.style.opacity = '1';
        const landing = document.getElementById('landing-screen');
        landing.classList.remove('hidden'); setTimeout(() => landing.classList.add('active'), 10);
        
        gsap.to(camera.position, { z: 40, duration: 1.5, ease: "power2.out" });
        window.scrollTo(0,0); // Скролл наверх

        setTimeout(() => {
            overlay.style.opacity = '0';
            gsap.to(starsMesh.scale, { z: 1, duration: 2 });
        }, 500);
    }, 1000);
}

function warpToPlanet(index) {
    if (index === currentPlanetIndex) return;
    document.querySelectorAll('.planet-btn').forEach((b, i) => b.classList.toggle('active', i === index));
    currentPlanetIndex = index;
    const infoPanel = document.getElementById('info-panel');
    infoPanel.classList.remove('visible');

    gsap.to(planetMesh.scale, { x: 0.01, y: 0.01, z: 0.01, duration: 0.5, ease: "back.in(1.7)" });
    gsap.to(planetMesh.rotation, { y: planetMesh.rotation.y + 3, duration: 0.5 });

    setTimeout(() => {
        loadPlanetData(index);
        gsap.to(planetMesh.scale, { x: 1, y: 1, z: 1, duration: 1, ease: "elastic.out(1, 0.5)" });
        setTimeout(() => infoPanel.classList.add('visible'), 300);
    }, 500);
}

const textureLoader = new THREE.TextureLoader();
function loadPlanetData(index) {
    const data = planets[index];
    document.getElementById('p-name').innerText = data.name;
    document.getElementById('p-type').innerText = data.type;
    document.getElementById('p-desc').innerText = data.desc;
    
    textureLoader.load(data.texture, (tex) => {
        planetMesh.material.map = tex; planetMesh.material.needsUpdate = true;
    }, undefined, () => {
        planetMesh.material.color.setHex(0x555555); planetMesh.material.map = null; planetMesh.material.needsUpdate = true;
    });
}

function animate() {
    requestAnimationFrame(animate);
    planetMesh.rotation.y += 0.0015;
    if (isExploring) {
        starsMesh.position.z += 0.1; if(starsMesh.position.z > 200) starsMesh.position.z = -200;
        planetGroup.rotation.z = Math.sin(Date.now() * 0.0005) * 0.05;
    } else {
        starsMesh.rotation.y += 0.0002;
    }
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// === АНИМАЦИЯ ПОЯВЛЕНИЯ ЗАГОЛОВКОВ ===
const observerOptions = {
    threshold: 0.1 // Срабатывает, когда 10% элемента видно
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // observer.unobserve(entry.target); // Если хочешь, чтобы анимация была только один раз - раскомментируй
        }
    });
}, observerOptions);

document.querySelectorAll('.section-header').forEach(header => {
    observer.observe(header);
});

const headerObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // headerObserver.unobserve(e.target); // если надо один раз
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.section-header').forEach(h => headerObserver.observe(h));

// Фикс поворота подписей: держим их горизонтально
(function () {
  const tooltips = document.querySelectorAll('.planet-tooltip');

  if (!tooltips.length) return;

  function keepTooltipsFlat() {
    tooltips.forEach(t => {
      // полностью убираем любой rotate, оставляя только translate
      const base = 'translate(-50%, -120%)';
      t.style.transform = base;
    });
    requestAnimationFrame(keepTooltipsFlat);
  }

  requestAnimationFrame(keepTooltipsFlat);
})();
