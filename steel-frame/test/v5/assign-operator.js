import { compose, watch, set as VasilleSet } from "vasille-web";
const C = compose((Vasille, props) => {
  (() => {
    VasilleSet(Vasille, props, "$a", props.$a?.V + 1);
    VasilleSet(Vasille, props, "$a", 2);
  })();
  function update() {
    VasilleSet(Vasille, props, "$b", props.$b?.V && true);
    VasilleSet(Vasille, props, "$b", false);
  }
});