import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import "./styles.css";
import toilet from "./model/toilet.gltf";
import { VRButton } from "three/examples/jsm/webxr/VRButton.js";
import { wall } from "./components/Walls";
import { box } from "./components/Box";
import { floor } from "./components/Floor";
import { gltfObject } from "./components/GltfObject";
import { roomData, ifFurnished } from "./RoomData";
import { refrigeratorObject } from "./components/Refrigerator";

import bedSheet from "./img/White-Background-Images-pics-hd-for-download-scaled.jpg";

// import basin from "./model/basin.gltf";
import furnishedWall from "./img/floor2.jpg";
import falseCilling from "./img/tekstura-fon-abstraktsiia-abstract-texture-background-rose-g.jpg";

document.body.appendChild(VRButton.createButton(renderer));
console.log("----->renderer", renderer);

let controls;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
let scene, camera, renderer; // creates the camera that is setup for looking around
let colour, intensity, light;
let ambientLight; //sets the lighting in the scene
let sceneHeight, sceneWidth; // sets parameters for canvas size
let clock, delta, interval;
let startButton = document.getElementById("startButton");

startButton.addEventListener("click", init);
document.addEventListener("click", function (e) {
  console.log("click", e);
});

async function init() {
  const {
    topCilling,
    toiletWall,
    leftWall,
    entranceDoorImage,
    frontWindow,
    windowImageBack,
    frontWall,
    backWall,
    rightWall,
    floorImg,
    refrigerator,
    ac,
    almirah,
    bedWood,
  } = await roomData();

  let furnished = await ifFurnished();

  let overlay = document.getElementById("overlay");
  overlay.remove();
  clock = new THREE.Clock();
  delta = 0;
  interval = 1 / 25;
  sceneWidth = window.innerWidth;
  sceneHeight = window.innerHeight;
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdedede);
  // scene.fog = new THREE.Fog(0xffffff, 0, 750);

  // lighting
  colour = 0xffffff;
  intensity = 0;
  light = new THREE.DirectionalLight(colour, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);
  ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
  scene.add(ambientLight);
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.5,
    1000
  );
  camera.position.x = 0;
  camera.position.y = 150;
  camera.position.z = -60;
  renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  controls = new PointerLockControls(camera, renderer.domElement);
  controls.lock();
  scene.add(controls.getObject());
  const onKeyDown = function (event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = true;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = true;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = true;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = true;
        break;
    }
  };

  const onKeyUp = function (event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = false;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = false;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = false;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = false;
        break;
    }
  };

  document.addEventListener("keydown", onKeyDown); //upon lifting or pressing these keys, the events mentioned above will occur
  document.addEventListener("keyup", onKeyUp);

  window.addEventListener("resize", onWindowResize, false); //resize callback

  document.addEventListener("click", function (e) {
    console.log("click", e);
  });

  // cilling
  scene.add(wall([650, 2, 650], [0, 220, 0], falseCilling));
  scene.add(wall([500, 20, 320], [70, 210, 160], topCilling));
  // Front wall
  scene.add(wall([650, 280, 8], [0, 100, -325], frontWall));
  // Back wall
  scene.add(wall([650, 280, 8], [0, 100, 325], backWall));

  // Left wall
  scene.add(wall([8, 280, 650], [-325, 100, 0], leftWall));
  // Right wall
  scene.add(wall([8, 280, 650], [325, 100, 0], rightWall));
  // front door
  scene.add(box([250, 180, 15], [150, 60, -322], entranceDoorImage));
  // front window
  scene.add(box([150, 130, 15], [-150, 60, -322], frontWindow));
  // Back window
  scene.add(box([180, 100, 15], [200, 80, 322], windowImageBack));
  scene.add(box([100, 120, 15], [-250, 100, 322], windowImageBack));
  // Left partition wall
  scene.add(wall([8, 280, 250], [-180, 100, 200], toiletWall));

  scene.add(floor(floorImg));

  // toilet
  gltfObject([6, 6, 6], [-240, -30, 260], toilet, scene);

  const appliances = furnished?.appliances;

  // ----------------------bed--------------------
  if (appliances?.includes("wooden_bed")) {
    scene.add(wall([95, 15, 250], [200, 0, 160], bedWood));
    scene.add(wall([95, 5, 250], [200, 10, 160], bedSheet));
    scene.add(wall([100, 100, 15], [200, -20, 275], bedWood));
    scene.add(wall([100, 70, 15], [200, -20, 40], bedWood));
  }

  // ----------------------Friz--------------------

  refrigeratorObject(scene, refrigerator);

  // ----------------------AC--------------------
  if (appliances?.includes("ac")) {
    scene.add(wall([100, 40, 20], [200, 180, 310], ac));
  }

  // ------------------------almirah ---------------------
  if (appliances?.includes("almirah")) {
    scene.add(wall([30, 170, 180], [-140, 60, 200], almirah));
  }

  // // toilet basin
  // if (appliances?.includes("toilet_basins")) {
  //   gltfObject([6, 6, 6], [-305, -30, 120], basin, scene);
  // }

  // // room basin
  // if (appliances?.includes("bedroom_basins")) {
  //   gltfObject([6, 6, 6], [-160, -30, 120], basin, scene);
  // }

  if (furnished?.furnished) {
    // middle wall
    scene.add(wall([210, 280, 8], [220, 100, 0], furnishedWall));
    scene.add(wall([210, 280, 8], [-80, 100, 0], furnishedWall));
    scene.add(wall([90, 100, 8], [70, 170, 0], furnishedWall));
    scene.add(wall([8, 100, 80], [-180, 170, 40], furnishedWall));
    // toilet top
    scene.add(wall([150, 100, 8], [-250, 170, 80], furnishedWall));
    scene.add(wall([60, 240, 8], [-210, 0, 80], furnishedWall));
  }

  play();
}

// simple render function
function render() {
  renderer.render(scene, camera);
}

function play() {
  //using the new setAnimationLoop method which means we are WebXR ready if need be
  renderer.setAnimationLoop(() => {
    update();
    render();
  });
}

function update() {
  // orbit.update();
  delta += clock.getDelta();
  if (delta > interval) {
    const time = performance.now();
    if (controls.isLocked === true) {
      const delta = (time - prevTime) / 1000;
      //sets speed values along the axis of which the camera is directed
      velocity.x -= velocity.x * 3.0 * delta;
      velocity.z -= velocity.z * 3.0 * delta;
      velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
      direction.z = Number(moveForward) - Number(moveBackward);
      direction.x = Number(moveRight) - Number(moveLeft);
      direction.normalize(); // this ensures consistent movements in all directions
      if (moveForward || moveBackward)
        velocity.z -= direction.z * 400.0 * delta;
      if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;
      controls.moveRight(-velocity.x * delta);
      controls.moveForward(-velocity.z * delta);
      controls.getObject().position.y += velocity.y * delta; // new behavior
      if (controls.getObject().position.y < 10) {
        velocity.y = 0;
        controls.getObject().position.y = 10;
      }
    }
    prevTime = time;
    renderer.render(scene, camera);
  }
}

function onWindowResize() {
  //resize & align
  sceneHeight = window.innerHeight;
  sceneWidth = window.innerWidth;
  renderer.setSize(sceneWidth, sceneHeight);
  camera.aspect = sceneWidth / sceneHeight;
  camera.updateProjectionMatrix();
}
