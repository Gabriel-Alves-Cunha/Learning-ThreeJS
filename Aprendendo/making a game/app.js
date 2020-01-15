/* import * as THREE from "./resources/three/r108/build/three.module.js";
import { OrbitControls } from "./resources/threejs/r108/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "./resources/threejs/r108/examples/jsm/loaders/GLTFLoader.js";
import { SkeletonUtils } from "./resources/threejs/r108/examples/jsm/utils/SkeletonUtils.js"; */

const mixerInfos = [];

function init() {
  // hide the loading bar
  const loadingElem = document.querySelector('#loading');
  loadingElem.style.display = 'none';

  prepModelsAndAnimations();

  Object.values(models).forEach((model, ndx) => {
    const clonedScene = SkeletonUtils.clone(model.gltf.scene);
    const root = new THREE.Object3D();
    root.add(clonedScene);
    scene.add(root);
    root.position.x = (ndx - 3) * 3;

    const mixer = new THREE.AnimationMixer(clonedScene);
    /* const firstClip = Object.values(model.animations)[0];
  const action = mixer.clipAction(firstClip);
  action.play();
  mixers.push(mixer); */
    const actions = Object.values(model.animations).map((clip) => {
      return mixer.clipAction(clip);
    });
    const mixerInfo = {
      mixer,
      actions,
      actionNdx: -1
    };
    mixerInfos.push(mixerInfo);
    playNextAction(mixerInfo);
  });
}

function playNextAction(mixerInfo) {
  const {actions, actionNdx} = mixerInfo;
  const nextActionNdx = (actionNdx + 1) % actions.length;
  mixerInfo.actionNdx = nextActionNdx;
  actions.forEach((action, ndx) => {
    const enabled = ndx === nextActionNdx;
    action.enabled = enabled;
    if (enabled) {
      action.play();
    }
  });
}

const manager = new THREE.LoadingManager();

manager.onLoad = init;

const models = {
  pig: { url: "models/Pig.gltf" },
  cow: { url: "models/Cow.gltf" },
  llama: { url: "models/Llama" },
  pug: { url: "models/Pug.gltf" },
  sheep: { url: "models/Sheep.gltf" },
  zebra: { url: "models/Zebra.gltf" },
  horse: { url: "models/Horse" },
  knight: { url: "models/knightCharacter.gltf" }
};
{
  const gltfLoader = new gltfLoader(manager);
  for (const model of Object.values(models)) {
    gltfLoader.load(model.url, (gltf) => {
      model.gltf = gltf;
    });
  }
}

const progressbarElem = document.querySelector('#progressbar');
manager.onProgress = (url, itemsLoaded, itemsTotal) => {
  progressbarElem.style.width = `${((itemsLoaded /
    itemsTotal) *
    100) |
    0}%`;
};

function prepModelsAndAnimations() {
  Object.values(models).forEach(model => {
    const animsByName = {};
    model.gltf.animation.forEach((clip) => {
      animsByName[clip.name] = clip;
    });
    model.animations = animsByName;
  });
}

let then = 0;

function render(now) {
  now *= 0.001; // convert to seconds
  const deltaTime = now - then;
  then = now;

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  for (const {mixer} of mixerInfos) {
    mixer.update(deltaTime);
  }

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}

window.addEventListener('keydown', (e) => {
  const mixerInfo = mixerInfos[e.keyCode - 49];
  if (!mixerInfo) {
    return;
  }
  playNextAction(mixerInfo);
});
