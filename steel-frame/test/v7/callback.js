import { compose, ref as VasilleRef } from "vasille-web";
const C = compose(Vasille => {
  const $x = VasilleRef(1, Vasille);
  Vasille.tag("div", {
    k: div => {
      div.style.display = "none";
      return () => {
        div.style.display = "block";
      };
    }
  }, Vasille => {
    Vasille.text($x);
  });
  return {
    $x
  };
});
const C1 = compose(Vasille => {
  C({
    callback: obj => {
      obj.$x?.V;
      return () => {
        console.log("x", obj.$x?.V);
      };
    }
  }, Vasille);
});