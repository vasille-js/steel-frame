const VasilleFilePath = "steel-frame/test/steel-frame/dev/bind-2.ts";
import { bind, component, ref as VasilleRef } from "steel-frame";
const C = component(Vasille => {
  const $a = VasilleRef(1, Vasille, [VasilleFilePath, 4, 8, 4, 14], "$a");
  const $b = bind(Vasille, Vasille_0 => Vasille_0 + 1, [$a], ["$a"], [VasilleFilePath, 5, 10, 5, 27], "$b");
}, [VasilleFilePath, 3, 10, 6, 2], "C");
