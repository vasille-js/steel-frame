import { compose, arrayModel, ArrayModelView } from "vasille-web";
const C = compose(Vasille => {
  const model = arrayModel(Vasille, [1, 2]);
  ArrayModelView({
    of: model,
    slot: (Vasille, wr_item) => {
      Vasille.tag("div", {}, Vasille => {
        Vasille.text(wr_item);
      });
    },
    writable: true
  }, Vasille);
});
