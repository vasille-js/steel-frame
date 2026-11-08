const VasilleFilePath = "steel-frame/test/dev/bind.ts";
import { component, ref as VasilleRef, expr as VasilleExpr } from "steel-frame";
const C = component(Vasille => {
  const $a = VasilleRef(1, Vasille, [VasilleFilePath, 4, 8, 4, 14], "$a");
  const $b = VasilleExpr(Vasille, Vasille_0 => Vasille_0 + 1, [$a], ["$a"], [VasilleFilePath, 5, 15, 5, 21], "$b");
}, [VasilleFilePath, 3, 10, 6, 2], "C");
