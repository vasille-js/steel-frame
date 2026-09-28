import { Slot, compose, ref as VasilleRef, safe as VasilleSafe } from "vasille-web";
const C1 = compose((Vasille, props) => {
  const {
    slot
  } = props;
  const $a = VasilleRef(0, Vasille);
  Vasille.tag("div", {}, Vasille => {
    Slot({
      model: slot,
      "$a": $a
    }, Vasille);
  });
});
const C2 = compose(Vasille => {
  const $a = VasilleRef(2, Vasille);
  C1({
    slot: (props, Vasille) => {
      const {
        $a = VasilleRef(void 0, Vasille)
      } = props;
      VasilleSafe(() => console.log($a.V))();
    }
  }, Vasille);
  C1({
    slot: (props, Vasille) => {
      const {
        $a = VasilleRef(void 0, Vasille)
      } = props;
      VasilleSafe(() => console.log($a.V))();
      Vasille.text($a);
    }
  }, Vasille);
  C1({
    slot: (_VasilleWeb, Vasille) => {
      Vasille.tag("div", {});
    }
  }, Vasille);
  VasilleSafe(() => console.log($a.V))();
});
