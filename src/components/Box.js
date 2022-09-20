import * as THREE from "three";

export const box = (dimention, position, backgroundImg) => {
  const geometryC2 = new THREE.BoxGeometry(
    dimention[0],
    dimention[1],
    dimention[2]
  );
  const floorTexture = new THREE.TextureLoader().load(backgroundImg);
  const materialC2 = new THREE.MeshBasicMaterial({ map: floorTexture });
  const meshC2 = new THREE.Mesh(geometryC2, materialC2);
  meshC2.position.set(position[0], position[1], position[2]);
  return meshC2;
};
