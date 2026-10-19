const VasilleFilePath = "steel-frame/test/v7/Hmr.ts";
import { component, ref as VasilleRef } from "steel-frame";
export let Hmr = component(Vasille => {
  const $a = VasilleRef(1, Vasille, [VasilleFilePath, 4, 8, 4, 14], "$a");
}, [VasilleFilePath, 3, 19, 5, 2], "Hmr");
export let C1 = 1;
export let C2 = 2;
import.meta.hot.accept(VasilleNewModule => {
  if (VasilleNewModule) try {
    VasilleNewModule.Hmr.recompose(Hmr.fragments);
    C1 = VasilleNewModule.C1;
    C2 = VasilleNewModule.C2;
  } catch (e) {
    import.meta.hot.invalidate(`${e}`);
  }
});
