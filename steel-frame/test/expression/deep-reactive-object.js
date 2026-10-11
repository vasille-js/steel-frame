import { compose, ref as VasilleRef, expr as VasilleExpr } from "vasille-web";
const C = compose(Vasille => {
  const $a = VasilleRef(1, Vasille);
  const $obj = VasilleExpr(Vasille, Vasille_0 => ({
    a: 1,
    b: {
      a: 1,
      b: 2,
      c: {
        a: 1,
        b: Vasille_0 > 3 ? 1 : 0
      }
    }
  }), [$a]);
});