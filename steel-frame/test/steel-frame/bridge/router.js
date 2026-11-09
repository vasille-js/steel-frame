import { calculate, compose, ref as VasilleRef, safe as VasilleSafe } from "vasille-web";
const C = compose(Vasille => {
  const $a = VasilleRef(2, Vasille);
  const $b = calculate(Vasille, Vasille_0 => {
    Vasille.r.r?.goTo("/1");
    return Vasille_0 + 1;
  }, [$a]);
  function goNext() {
    Vasille.r.r?.goTo("/x");
  }
  VasilleSafe(() => Vasille.r.r?.goTo("/"))();
  VasilleSafe(() => Vasille.r.r)();
});
