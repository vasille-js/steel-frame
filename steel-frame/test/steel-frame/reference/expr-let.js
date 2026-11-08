import { compose, ref as VasilleRef, safe as VasilleSafe } from "vasille-web";
const C = compose(Vasille => {
  const $a = VasilleRef(2, Vasille);
  const $b = VasilleRef(3, Vasille);
  const $c = VasilleRef(4, Vasille);
  const $sum = VasilleRef($a.V + $b.V, Vasille);
  VasilleSafe(() => console.log($sum.V))();
  VasilleSafe(() => $sum.V = $b.V)();
  VasilleSafe(() => $sum.V = $b.V + $c.V)();
});
