import { compose, debounced, live, ref, expr as VasilleExpr, toFieldRef as VasilleToFieldRef, toDeepFieldRef as VasilleToDeepFieldRef } from "vasille-web";
const C = compose(Vasille => {
  const wr$1 = ref(1, Vasille);
  const wr$2 = ref(2, Vasille);
  const wr$3 = ref(3, Vasille);
  const r$4 = VasilleExpr(Vasille, Vasille_0 => Vasille_0 + 1, [wr$3]);
  const r$5 = live(Vasille, Vasille_0 => Vasille_0 + 1, [r$4]);
  const wr$obj = ref({
    a: {
      b: 1
    }
  }, Vasille);
  const wr$6 = VasilleToFieldRef(Vasille, wr$obj, "a");
  const wr$7 = VasilleToFieldRef(Vasille, wr$obj.V, "a");
  const wr$8 = VasilleToDeepFieldRef(Vasille, wr$obj.V, ["a", "b"]);
  const r$9 = debounced(Vasille, wr$8, 100);
});
const D = compose(Vasille => {
  const wr$ = ref(1, Vasille);
  const r$ = VasilleExpr(Vasille, Vasille_0 => Vasille_0 + 1, [wr$]);
  C({
    "wr$1": wr$,
    "r$2": wr$,
    "r$3": r$
  }, Vasille);
});