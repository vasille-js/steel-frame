import { compose, ref as VasilleRef } from "vasille-web";
const C = compose(Vasille => {
  const $a = VasilleRef("text", Vasille);
  Vasille.text("text text2");
  Vasille.text("text");
  Vasille.text($a);
  Vasille.tag("div", {});
  Vasille.text("text3");
});
