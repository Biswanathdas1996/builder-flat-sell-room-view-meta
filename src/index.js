import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import "./styles.css";
import toilet from "./model/toilet.gltf";
import basin from "./model/basin.gltf";
import toiletDoor from "./model/toiletDoor.gltf";
import { VRButton } from "three/examples/jsm/webxr/VRButton.js";
import { wall } from "./components/Walls";
import { box } from "./components/Box";
import { floor } from "./components/Floor";
import { gltfObject } from "./components/GltfObject";
import { roomData } from "./RoomData";

document.body.appendChild(VRButton.createButton(renderer));
// console.log("----->renderer", renderer);
// renderer.xr.enabled = true;

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

function init() {
  const {
    topCilling,
    toiletWall,
    leftWall,
    entranceDoorImage,
    frontWindow,
    windowImageBack,
    sideWall,
    rightsideWall,
    floorImg,
  } = roomData();

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
  scene.add(wall([650, 2, 650], [0, 220, 0], topCilling));

  // Front wall
  scene.add(wall([650, 280, 8], [0, 100, -325], sideWall));

  // Back wall
  scene.add(wall([650, 280, 8], [0, 100, 325], sideWall));

  // Left wall
  scene.add(wall([8, 280, 650], [-325, 100, 0], leftWall));

  // Right wall
  scene.add(wall([8, 280, 650], [325, 100, 0], rightsideWall));

  // front door
  scene.add(box([250, 180, 15], [150, 60, -322], entranceDoorImage));

  // front window
  scene.add(box([150, 130, 15], [-150, 60, -322], frontWindow));

  // Back window
  scene.add(box([150, 150, 15], [200, 100, 322], windowImageBack));
  scene.add(box([100, 150, 15], [-250, 100, 322], windowImageBack));

  // Left partition wall
  scene.add(wall([8, 280, 250], [-180, 100, 200], toiletWall));
  scene.add(floor(floorImg));
  // toilet basin
  gltfObject([6, 6, 6], [-240, -30, 260], toilet, scene);
  // toilet basin
  gltfObject([6, 6, 6], [-305, -30, 120], basin, scene);
  // room basin
  gltfObject([6, 6, 6], [-160, -30, 120], basin, scene);

  // toilet Door
  gltfObject([9, 9, 9], [-260, -30, 90], toiletDoor, scene);

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
      velocity.x -= velocity.x * 2.0 * delta;
      velocity.z -= velocity.z * 2.0 * delta;
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
