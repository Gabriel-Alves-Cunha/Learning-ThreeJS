// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let renderer;
let controls;
let scene;
let mesh;

window.addEventListener("resize", onWindowResize);

function createControls() {

  controls = new THREE.OrbitControls( camera, container );

}

function init() {
  // Get a reference to the container element that will hold our scene
  container = document.querySelector("#scene-container");

  // create a Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x8fbcd4);

  createCamera();
  createLights();
  createMeshes();
  createControls();
  createRenderer();

//Start the animation loop
  renderer.setAnimationLoop(() => {
    update();
    render();
  });
}

function createCamera() {
  // set up the options for a perspective camera
  const fov = 35; // fov = Field Of View
  const aspect = container.clientWidth / container.clientHeight;

  const near = 0.1;
  const far = 100;

  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

  // every object is initially created at ( 0, 0, 0 )
  // we'll move the camera back a bit so that we can view the scene
  camera.position.set( -4, 4, 10 );
}

function createLights() {

  const ambientLight = new THREE.HemisphereLight(
    0xddeeff, // bright sky color
    0x202020, // dim ground color
    5, // intensity
  );

  const mainLight = new THREE.DirectionalLight( 0xffffff, 5 );
  mainLight.position.set( 10, 10, 10 );

  scene.add( ambientLight, mainLight );

}

function createMeshes() {
  // create a geometry
  const geometry = new THREE.BoxBufferGeometry(2, 2, 2);

  // create a texture loader.
  const textureLoader = new THREE.TextureLoader();

  // Load a texture. See the note in chapter 4 on working locally, or the page
  // https://threejs.org/docs/#manual/introduction/How-to-run-things-locally
  // if you run into problems here
  const texture = textureLoader.load("textures/uv_test_bw.png");

  // set the "color space" of the texture
  texture.encoding = THREE.sRGBEncoding;

  // reduce blurring at glancing angles
  texture.anisotropy = 16;

  // create a Standard material using the texture we just loaded as a color map
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    color: 0x800080
  });

  // create a Mesh containing the geometry and material
  mesh = new THREE.Mesh(geometry, material);

  // add the mesh to the scene object
  scene.add(mesh);
}

function createRenderer() {
  // create a WebGLRenderer and set its width and height
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);

  renderer.setPixelRatio(window.devicePixelRatio);

  // set the gamma correction so that output colors look
  // correct on our screens
  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;
  renderer.physicallyCorrectLights = true;

  // add the automatically created <canvas> element to the page
  container.appendChild(renderer.domElement);
}

// perform any updates to the scene, called once per frame
// avoid heavy computation here
function update() {
  //Don't delete this function
}

// render, or 'draw a still image', of the scene
function render() {
  renderer.render(scene, camera);
}

function play() {
  renderer.setAnimationLoop(() => {
    update();
    render();
  });
}

function stop() {
  renderer.setAnimationLoop(null);
}

// a function that will be called every time the window gets resized.
// It can get called a lot, so don't put any heavy computation in here!
function onWindowResize() {
  // set the aspect ratio to match the new browser window aspect ratio
  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  // update the size of the renderer AND the canvas
  renderer.setSize(container.clientWidth, container.clientHeight);
}

// call the init function to set everything up
init();

play();
