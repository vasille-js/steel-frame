import { compose, ref as VasilleRef, Switch as VasilleSwitch } from "vasille-web";
const C = compose(Vasille => {
  const $condition = VasilleRef(true, Vasille);
  VasilleSwitch({
    c: [{
      c: $condition,
      l: Vasille => {
        Vasille.text("if 1");
      }
    }]
  }, Vasille);
  VasilleSwitch({
    c: [{
      c: $condition,
      l: Vasille => Vasille.text("if 2")
    }]
  }, Vasille);
  VasilleSwitch({
    c: [{
      c: $condition,
      l: Vasille => {
        Vasille.text("if 3");
      }
    }],
    d: Vasille => {
      Vasille.text("else 3");
    }
  }, Vasille);
  VasilleSwitch({
    c: [{
      c: $condition,
      l: Vasille => Vasille.text("if 4")
    }],
    d: Vasille => Vasille.text("else 4")
  }, Vasille);
  VasilleSwitch({
    c: [{
      c: $condition,
      l: Vasille => {
        Vasille.text("if 5");
      }
    }, {
      c: $condition,
      l: Vasille => {
        Vasille.text("else if 5");
      }
    }],
    d: Vasille => {
      Vasille.text("else 5");
    }
  }, Vasille);
  VasilleSwitch({
    c: [{
      c: $condition,
      l: Vasille => Vasille.text("if 6")
    }, {
      c: $condition,
      l: Vasille => Vasille.text("else if 6")
    }],
    d: Vasille => Vasille.text("else 6")
  }, Vasille);
  VasilleSwitch({
    c: [{
      c: $condition,
      l: Vasille => {
        Vasille.text("if 7");
      }
    }]
  }, Vasille);
  Vasille.tag("div", {});
  VasilleSwitch({
    c: [{
      c: $condition,
      l: Vasille => {
        Vasille.text("if 8");
      }
    }]
  }, Vasille);
  Vasille.tag("div", {});
});
