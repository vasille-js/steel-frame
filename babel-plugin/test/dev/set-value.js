const VasilleFilePath = "babel-plugin-vasille/test/dev/set-value.ts";
import { component, set as VasilleSet, wrapFn as VasilleWrap, safe as VasilleSafe } from "steel-frame";
const C = component(Vasille => {
  const arr = {};
  VasilleSafe(VasilleWrap(() => {
    VasilleSet(arr, "$x", 1, Vasille, [VasilleFilePath, 7, 4, 7, 14]);
  }, [VasilleFilePath, 6, 14, 8, 3]))();
}, [VasilleFilePath, 3, 10, 9, 2], "C");