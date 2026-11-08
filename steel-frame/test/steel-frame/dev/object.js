const VasilleFilePath = "steel-frame/test/steel-frame/dev/object.ts";
import { component, ref as VasilleRef } from "steel-frame";
const C = component(Vasille => {
  const o = {
    $a: VasilleRef(1, Vasille, [VasilleFilePath, 5, 8, 5, 13]),
    $b: VasilleRef(2, Vasille, [VasilleFilePath, 6, 8, 6, 13])
  };
}, [VasilleFilePath, 3, 10, 8, 2], "C");
