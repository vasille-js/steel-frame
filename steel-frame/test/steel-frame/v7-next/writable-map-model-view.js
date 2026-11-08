import { compose, mapModel, MapModelView } from "vasille-web";
const C = compose(Vasille => {
  const model = mapModel(Vasille, [[1, "s"]]);
  MapModelView({
    of: model,
    slot: (Vasille, wr_item) => {
      Vasille.tag("div", {}, Vasille => {
        Vasille.text(wr_item);
      });
    },
    writable: true
  }, Vasille);
});
