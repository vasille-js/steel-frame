import { compose, Slot, ref as VasilleRef, safe as VasilleSafe } from "vasille-web";
const C = compose((Vasille, {
  slot02
}) => {
  Slot({
    model: slot02,
    "$a": VasilleRef(1, Vasille),
    "$b": VasilleRef(2, Vasille)
  }, Vasille);
});
const C1 = compose(Vasille => {
  C({
    slot01: ({
      a,
      b
    }) => {
      console.log(a, b);
    },
    slot02: ({
      $a = VasilleRef(void 0, Vasille),
      $b = VasilleRef(void 0, Vasille)
    }, Vasille) => {
      Vasille.tag("div", {});
      VasilleSafe(() => console.log($a.V, $b.V))();
    },
    slot03: (_VasilleWeb, Vasille) => Vasille.tag("div", {})
  }, Vasille);
});
