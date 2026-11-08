import { compose, watch, ref as VasilleRef } from "vasille-web";
const C = compose(Vasille => {
  const a = 3;
  const $b = VasilleRef(4, Vasille);
  let c = 5;
  watch(Vasille, Vasille_0 => {
    c = a + Vasille_0;
  }, [$b]);
});