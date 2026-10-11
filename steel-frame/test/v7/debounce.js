import { compose, debounced, ref as VasilleRef } from "vasille-web";
const C = compose(Vasille => {
  const $a = VasilleRef(1, Vasille);
  const $b = debounced(Vasille, $a, 1);
});