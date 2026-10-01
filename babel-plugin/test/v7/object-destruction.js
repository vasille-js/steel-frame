import { compose, ref as VasilleRef, toFieldRef as VasilleToFieldRef } from "vasille-web";
const C = compose(Vasille => {
  const $obj = VasilleRef({
    a: 1,
    b: 2
  }, Vasille);
  const $a = VasilleToFieldRef(Vasille, $obj, "a");
  const $a1 = VasilleToFieldRef(Vasille, $obj, "a");
  const $b1 = VasilleToFieldRef(Vasille, $obj, "b");
});