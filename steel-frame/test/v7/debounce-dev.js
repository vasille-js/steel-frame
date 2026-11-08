const VasilleFilePath = "steel-frame/test/v7/debounce-dev.ts";
import { compose, debounced, ref as VasilleRef } from "steel-frame";
const C = compose(Vasille => {
  const a = {
    $b: VasilleRef(1, Vasille, [VasilleFilePath, 4, 16, 4, 21])
  };
  const $b = debounced(Vasille, a.$b, 1, [VasilleFilePath, 5, 10, 5, 33], "$b");
}, [VasilleFilePath, 3, 10, 6, 2], "C");
