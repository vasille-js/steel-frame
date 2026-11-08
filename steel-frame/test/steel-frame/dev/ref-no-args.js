const VasilleFilePath = "steel-frame/test/steel-frame/dev/ref-no-args.ts";
import { component, ref } from "steel-frame";
const C = component(Vasille => {
  const $none = ref(void 0, Vasille, [VasilleFilePath, 4, 10, 4, 23], "$none");
}, [VasilleFilePath, 3, 10, 5, 2], "C");
