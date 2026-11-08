import { compose, ref as VasilleRef, expr as VasilleExpr, Switch as VasilleSwitch } from "vasille-web";
const C1 = compose((Vasille, props) => {
  Vasille.tag("div", {});
});
const C2 = compose(Vasille => {
  const $a = VasilleRef(1, Vasille);
  Vasille.tag("div", {}, Vasille => {
    C1({
      "$bool": VasilleRef(true, Vasille),
      "$a": VasilleRef(1, Vasille),
      "$b": VasilleRef(2, Vasille),
      "$c": VasilleRef("text", Vasille),
      str: "str"
    }, Vasille, (_VasilleWeb, Vasille) => {
      C1({
        ...{
          $a: VasilleRef(1, Vasille)
        },
        "$b": VasilleExpr(Vasille, Vasille_0 => Vasille_0 + 1, [$a]),
        "$bool": VasilleRef(true, Vasille)
      }, Vasille, (_VasilleWeb, Vasille) => {
        Vasille.tag("div", {});
        Vasille.tag("span", {}, Vasille => {
          Vasille.text("1");
        });
      });
    });
  });
  C1({
    slot: (_VasilleWeb, Vasille) => {
      C1({}, Vasille);
    }
  }, Vasille);
  VasilleSwitch({
    cases: [{
      $case: VasilleExpr(Vasille, Vasille_0 => Vasille_0 > 1, [$a]),
      slot: Vasille => {
        C1({}, Vasille);
      }
    }]
  }, Vasille);
});
