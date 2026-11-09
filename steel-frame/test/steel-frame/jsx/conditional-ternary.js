import { compose, ref as VasilleRef, expr as VasilleExpr, Switch as VasilleSwitch } from "vasille-web";
const C = compose(Vasille => {
  const $a = VasilleRef(1, Vasille);
  VasilleSwitch({
    c: [{
      c: VasilleExpr(Vasille, Vasille_0 => Vasille_0 < 1, [$a]),
      l: Vasille => Vasille.text("smaller then 1")
    }],
    d: Vasille => Vasille.text("bigger then 1")
  }, Vasille);
  VasilleSwitch({
    c: [{
      c: VasilleExpr(Vasille, Vasille_0 => Vasille_0 < 1 && Vasille_0 < 2, [$a]),
      l: Vasille => Vasille.text("smaller then 2")
    }],
    d: Vasille => Vasille.text("bigger then 2")
  }, Vasille);
});
