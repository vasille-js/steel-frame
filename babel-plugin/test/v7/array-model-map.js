import { arrayModel, compose, ArrayModelView as VasilleArrayModelView } from "vasille-web";
const C = compose(Vasille => {
  const a = arrayModel(Vasille, [{
    x: 1
  }, {
    x: 2
  }]);
  Vasille.tag("div", {}, Vasille => {
    VasilleArrayModelView({
      of: a,
      slot: item => Vasille.tag("div", {}, Vasille => {
        Vasille.text(item.x);
      })
    }, Vasille);
  });
});