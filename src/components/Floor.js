import * as THREE from "three";

export const floor = (floor) => {
  const geometry = new THREE.BoxGeometry(650, 20, 650); //i use box geometry to setup the floor
  const floorTexture = new THREE.TextureLoader().load(floor);
  const material = new THREE.MeshBasicMaterial({ map: floorTexture });
  const cube = new THREE.Mesh(geometry, material); //the mesh is made with the values assigned for its geometry material
  cube.position.set(0, -35, 0); // specifying positions allows me to move things around, following a layout of an art gallery
  return cube;
};
