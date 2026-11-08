const VasilleFilePath = "steel-frame/test/steel-frame/dev/set-model.ts";
import { component, setModel } from "steel-frame";
const C = component(Vasille => {
  const set = setModel([VasilleFilePath, 4, 10, 4, 26], Vasille, void 0, void 0, "set");
}, [VasilleFilePath, 3, 10, 5, 2], "C");
