import frizBack from "../img/lloyd-gldf213sbbt2pb-3s-single-door-bb-side-back.jpg";
import { wall } from "../components/Walls";

export const refrigeratorObject = (scene, refrigerator) => {
  if (refrigerator) {
    scene.add(wall([50, 120, 30], [70, 35, 250], refrigerator));
    scene.add(wall([50, 120, 4], [70, 35, 265], frizBack));
  }
};
