const VasilleFilePath = "steel-frame/test/steel-frame/dev/array-model.ts";
import { arrayModel, component } from "steel-frame";
const C = component(Vasille => {
  const arr = arrayModel([VasilleFilePath, 4, 10, 4, 28], Vasille, void 0, void 0, "arr");
}, [VasilleFilePath, 3, 10, 5, 2], "C");
