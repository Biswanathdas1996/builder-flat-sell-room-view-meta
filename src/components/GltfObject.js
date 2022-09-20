import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export const gltfObject = (scale, position, gltfFile, scene) => {
  const loader = new GLTFLoader();

  loader.load(
    gltfFile,
    function (gltf) {
      gltf.scene.position.set(position[0], position[1], position[2]);
      gltf.scene.scale.set(scale[0], scale[1], scale[2]);
      scene.add(gltf.scene);
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );
};
