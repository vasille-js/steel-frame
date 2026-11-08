const VasilleFilePath = "steel-frame/test/dev/calculate.ts";
import { calculate, component, ref as VasilleRef } from "steel-frame";
const C = component(Vasille => {
  const $a = VasilleRef(1, Vasille, [VasilleFilePath, 4, 8, 4, 14], "$a");
  const $b = calculate(Vasille, Vasille_0 => {
    return Vasille_0 + 1;
  }, [$a], ["$a"], [VasilleFilePath, 5, 10, 7, 6], "$b");
}, [VasilleFilePath, 3, 10, 8, 2], "C");
