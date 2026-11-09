import { compose, ref as VasilleRef, expr as VasilleExpr, Switch as VasilleSwitch } from "vasille-web";
const C = compose(Vasille => {
  const $a = VasilleRef(1, Vasille);
  VasilleSwitch({
    c: [{
      c: VasilleExpr(Vasille, Vasille_0 => Vasille_0 < 1, [$a]),
      l: Vasille => Vasille.text("smaller then 1")
    }, {
      c: VasilleExpr(Vasille, Vasille_0 => Vasille_0 > 2, [$a]),
      l: Vasille => Vasille.text("bigger then 2")
    }]
  }, Vasille);
  VasilleSwitch({
    c: [{
      c: VasilleExpr(Vasille, Vasille_0 => Vasille_0 < 1, [$a]),
      l: Vasille => VasilleSwitch({
        c: [{
          c: VasilleExpr(Vasille, Vasille_0 => Vasille_0 < -1, [$a]),
          l: Vasille => Vasille.text("smaler then -1 & 1")
        }]
      }, Vasille)
    }],
    d: Vasille => Vasille.text("bigger then 2")
  }, Vasille);
  VasilleSwitch({
    c: [{
      c: VasilleExpr(Vasille, Vasille_0 => Vasille_0 < 1, [$a]),
      l: Vasille => VasilleSwitch({
        c: [{
          c: VasilleExpr(Vasille, Vasille_0 => Vasille_0 < -10, [$a]),
          l: Vasille => Vasille.text("smaller then -10 & 1")
        }],
        d: Vasille => {
          Vasille.text("bigger then -10");
          Vasille.text("smaller then 1");
        }
      }, Vasille)
    }]
  }, Vasille);
});
