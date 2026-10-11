import { compose, ref as VasilleRef, expr as VasilleExpr, safe as VasilleSafe } from "vasille-web";
const C = compose(Vasille => {
  const $a = VasilleRef(2, Vasille);
  const $b = VasilleRef(3, Vasille);
  const $sum = VasilleExpr(Vasille, (Vasille_0, Vasille_1) => Vasille_0 + Vasille_1, [$a, $b]);
  VasilleSafe(() => console.log($sum.V))();
});
