import { compose, ArrayView, ref as VasilleRef } from "vasille-web";
const C = compose(Vasille => {
  const wr_arr = VasilleRef([1, 2], Vasille);
  ArrayView({
    r_of: wr_arr,
    key: i => i,
    slot: (Vasille, wr_item) => {
      Vasille.tag("div", {}, Vasille => {
        Vasille.text(wr_item);
      });
    },
    writable: true
  }, Vasille);
});
