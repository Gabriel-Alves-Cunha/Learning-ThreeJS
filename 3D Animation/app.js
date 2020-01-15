// @ts-nocheck
// Variables for setup
let container, camera, renderer, scene, house;

function init() {
    container = document.querySelector(".scene");

    // Create scene
    scene = new THREE.Scene();

    const fov = 65;
    const aspect = container.clientWidth / container.clientHeight;
    const near = 0.1;
    const far = 5000;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    container.appendChild(renderer.domElement);

    // Camera setup
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, -50, 3650);

    const ambient = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambient);

    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(10, 10, 10);
    scene.add(light);

    // Load model
    let loader = new THREE.GLTFLoader();
    loader.load("./assets/scene.gltf", function(gltf) {
        scene.add(gltf.scene);
        house = gltf.scene.children[0];
        animate();
    });
}

function animate() {
    house.rotation.z += 0.005;
    renderer.render(scene, camera);
    //camera.position.z += 1;

    requestAnimationFrame(animate);
}

function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener("resize", onWindowResize);

init();
