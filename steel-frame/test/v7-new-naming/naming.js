import { compose, debounced, live, ref, toFieldRef as VasilleToFieldRef, toDeepFieldRef as VasilleToDeepFieldRef } from "vasille-web";
const C = compose(Vasille => {
  const wr_1 = ref(1, Vasille);
  const wr_2 = ref(2, Vasille);
  const wr_3 = ref(3, Vasille);
  const r_4 = live(Vasille, Vasille_0 => Vasille_0 + 1, [wr_3]);
  const r_5 = live(Vasille, Vasille_0 => Vasille_0 + 1, [r_4]);
  const wr_obj = ref({
    a: {
      b: 1
    }
  }, Vasille);
  const wr_6 = VasilleToFieldRef(Vasille, wr_obj, "a");
  const wr_7 = VasilleToFieldRef(Vasille, wr_obj.V, "a");
  const wr_8 = VasilleToDeepFieldRef(Vasille, wr_obj.V, ["a", "b"]);
  const r_9 = debounced(Vasille, wr_8, 100);
});
const D = compose(Vasille => {
  const wr_ = ref(1, Vasille);
  const r_ = live(Vasille, Vasille_0 => Vasille_0 + 1, [wr_]);
  C({
    wr_1: wr_,
    r_2: wr_,
    r_3: r_
  }, Vasille);
});