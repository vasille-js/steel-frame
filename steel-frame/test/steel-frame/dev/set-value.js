const VasilleFilePath = "steel-frame/test/steel-frame/dev/set-value.ts";
import { component, set as VasilleSet, wrapFn as VasilleWrap, safe as VasilleSafe } from "steel-frame";
const C = component(Vasille => {
  const arr = {};
  VasilleSafe(VasilleWrap(() => {
    VasilleSet(arr, "$x", 1, Vasille, [VasilleFilePath, 7, 8, 7, 18]);
  }, [VasilleFilePath, 6, 16, 8, 5]))();
}, [VasilleFilePath, 3, 10, 9, 2], "C");
