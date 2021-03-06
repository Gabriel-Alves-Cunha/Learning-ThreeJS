let scene,
  portalLigh,
  sceneLight,
  cam,
  renderer,
  smokeParticles = [],
  clock,
  portalParticles = [];

function init() {
  scene = new THREE.Scene();

  sceneLight = new THREE.DirectionalLight(0xffffff, 0.5);
  sceneLight.position.set(0, 0, 1);
  scene.add(sceneLight);

  portalLigh = new THREE.PointLight(0x062d89, 30, 350, 1.7);
  portalLigh.position.set(0, 0, 250);
  scene.add(portalLigh);

  cam = new THREE.PerspectiveCamera(
    80,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  cam.position.z = 1000;
  scene.add(cam);

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x000000, 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  particleSetup();
}

function particleSetup() {
  let loader = new THREE.TextureLoader();

  loader.load("../Rain Effect/smoke.png", function(texture) {
    portalGeo = new THREE.PlaneBufferGeometry(350, 350);
    portalMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true
    });
    smokeGeo = new THREE.PlaneBufferGeometry(1000, 1000);
    smokeMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true
    });

    for (let p = 880; p > 250; p--) {
      let particle = new THREE.Mesh(portalGeo, portalMaterial);
      particle.position.set(
        0.5 * p * Math.cos((4 * p * Math.PI) / 180),
        0.5 * p * Math.sin((4 * p * Math.PI) / 180),
        0.1 * p
      );
      particle.rotation.z = Math.random() * 360;
      portalParticles.push(particle);
      scene.add(particle);
    }
    for (let p = 0; p < 40; p++) {
      let particle = new THREE.Mesh(smokeGeo, smokeMaterial);
      particle.position.set(
        Math.random() * 1000 - 500,
        Math.random() * 400 - 200,
        25
      );
      particle.rotation.z = Math.random() * 360;
      particle.material.opacity = 0.4;
      smokeParticles.push(particle);
      scene.add(particle);
    }
    clock = new THREE.Clock();
    animate();
  });
}

function animate() {
  let delta = clock.getDelta();
  portalParticles.forEach(p => {
    p.rotation.z -= delta * 1.5;
  });
  smokeParticles.forEach(p => {
    p.rotation.z -= delta * 0.2;
  });
  if (Math.random() > 0.9) {
    portalLigh.power = 350 + Math.random() * 500;
  }
  renderer.render(scene, cam);
  requestAnimationFrame(animate);
}

init();
