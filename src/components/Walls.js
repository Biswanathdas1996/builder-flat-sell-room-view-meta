import * as THREE from "three";

export const wall = (dimention, position, backgroundImg) => {
  const geometryS = new THREE.BoxGeometry(
    dimention[0],
    dimention[1],
    dimention[2]
  );
  const floorTexture = new THREE.TextureLoader().load(backgroundImg);
  const materialS = new THREE.MeshBasicMaterial({ map: floorTexture });
  const cube2 = new THREE.Mesh(geometryS, materialS);
  cube2.position.set(position[0], position[1], position[2]);
  return cube2;
};
