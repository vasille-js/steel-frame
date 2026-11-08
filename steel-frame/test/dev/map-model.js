const VasilleFilePath = "steel-frame/test/dev/map-model.ts";
import { component, mapModel } from "steel-frame";
const C = component(Vasille => {
  const map = mapModel([VasilleFilePath, 4, 10, 4, 26], Vasille, void 0, void 0, "map");
}, [VasilleFilePath, 3, 10, 5, 2], "C");
