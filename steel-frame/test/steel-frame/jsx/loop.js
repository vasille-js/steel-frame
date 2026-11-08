import { For, compose, arrayModel, mapModel, safe as VasilleSafe } from "vasille-web";
const C = compose(Vasille => {
  const a = arrayModel(Vasille, [1, 2, 3]);
  const map = mapModel(Vasille, [["x", 1]]);
  For({
    of: a,
    slot: (Vasille, value) => {
      Vasille.text(value);
    }
  }, Vasille);
  For({
    of: map,
    slot: (Vasille, value, key) => {
      VasilleSafe(() => {
        console.log(value, key);
      })();
    }
  }, Vasille);
});