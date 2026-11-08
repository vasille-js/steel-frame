import { compose, set as VasilleSet, safe as VasilleSafe } from "vasille-web";
const C = compose((Vasille, props) => {
  function update() {
    VasilleSet(Vasille, props, "$b", props.$b?.V && true);
    VasilleSet(Vasille, props, "$b", false);
  }
  VasilleSafe(() => {
    VasilleSet(Vasille, props, "$a", props.$a?.V + 1);
    VasilleSet(Vasille, props, "$a", 2);
  })();
});