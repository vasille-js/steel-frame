import { compose, debounceRef, ref as VasilleRef } from "vasille-web";
const C = compose(Vasille => {
  const $a = VasilleRef(1, Vasille);
  const $b = debounceRef(Vasille, $a, 1);
});