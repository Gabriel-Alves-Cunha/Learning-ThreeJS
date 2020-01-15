// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let controls;
let renderer;
let scene;
//let mesh;

const mixers = [];
const clock = new THREE.Clock();

function init() {
  // Get a reference to the container element that will hold our scene
  container = document.querySelector('#scene-container');

  // create a Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x8fbcd4);

  createCamera();
  createControls();
  createLights();
  loadModels();
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
  const aspect = (container.clientWidth / container.clientHeight);
  const near = 100;
  const far = 1000;

  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

  // every object is initially created at ( 0, 0, 0 )
  // we'll move the camera back a bit so that we can view the scene
  camera.position.set(-1.5, 1.5, 6.5);
}

function createControls() {
  controls = new THREE.OrbitControls( camera, container );
}

function createLights() {
  const ambientLight = new THREE.HemisphereLight(
    0xddeeff, // bright sky color
    0x202020, // dim ground color
    5 // intensity
  );

  const mainLight = new THREE.DirectionalLight(0xffffff, 5);
  mainLight.position.set(10, 10, 10);

  scene.add(ambientLight, mainLight);
}

function loadModels() {

  const loader = new THREE.GLTFLoader();

  //const url1 = '\models\Parrot.glb';

  //loader.load( url, onLoad);

  // A reusable function to set up the models. We're passing in a position parameter so that they can be individually placed around the scene

  const onLoad = (gltf, position) => {

    const model = gltf.scene.children[0];
    model.position.copy(position);

    const animation = gltf.animations[0];

    const mixer = new THREE.AnimationMixer(model);
    mixers.push(mixer);

    const action = mixer.clipAction(animation);
    action.play();

    scene.add(model);
  };

  // The loader will report the loading progress to this function
  const onProgress = () => {};

  // The loader will send any error messages to this function
  const onError = errorMessage => {
    console.log(errorMessage);
  };

  // load the first model. Each model is loaded asynchronously,
  // so don't make any assumption about which one will finish loading first
  const parrotPosition = new THREE.Vector3(0, 0, 2.5);
  loader.load(
    'models/Parrot.glb',
    gltf => onLoad(gltf, parrotPosition),
    onProgress,
    onError
  );

  const flamingoPosition = new THREE.Vector3(7.5, 0, -10);
  loader.load(
    'models/Flamingo.glb',
    gltf => onLoad(gltf, flamingoPosition),
    onProgress,
    onError
  );

  const storkPosition = new THREE.Vector3(0, -2.5, -10);
  loader.load(
    'models/Stork.glb',
    gltf => onLoad(gltf, storkPosition),
    onProgress,
    onError
  );
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

  const delta = clock.getDelta();

  for ( const mixer of mixers ) {

    mixer.update( delta );

  }
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

window.addEventListener('resize', onWindowResize);
// call the init function to set everything up
init();

;