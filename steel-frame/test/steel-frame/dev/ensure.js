const VasilleFilePath = "steel-frame/test/steel-frame/dev/ensure.ts";
import { component, ensure as VasilleEnsure } from "steel-frame";
const C = component(Vasille => {
  const o = {
    a: 1
  };
  const $b = VasilleEnsure(o, "$b", Vasille, [VasilleFilePath, 5, 10, 5, 19]);
  const $x = VasilleEnsure(o, "$b", Vasille, [VasilleFilePath, 6, 10, 6, 22]);
}, [VasilleFilePath, 3, 10, 7, 2], "C");
