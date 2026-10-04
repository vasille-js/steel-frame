import { compose, safeLive, safeInit, safeState, ref as VasilleRef } from "vasille-web";
function throwNow() {
  throw new Error("test");
}
const A = compose(Vasille => {});
const C = compose(Vasille => {
  const a = safeInit(() => throwNow());
  const $b = safeState(() => throwNow(), Vasille);
  const $c = safeState(() => 2 + throwNow(), Vasille);
  const $d = safeLive(Vasille, Vasille_0 => (Vasille_0 ?? 2) + throwNow(), [$b]);
  const $e = safeState(() => () => {
    return throwNow();
  }, Vasille);
  A({
    "$a": VasilleRef(safeInit(() => throwNow()), Vasille)
  }, Vasille);
  A({
    "$a": safeState(() => throwNow(), Vasille)
  }, Vasille);
  A({
    "$a": safeState(() => 2 + throwNow(), Vasille)
  }, Vasille);
  A({
    "$a": safeLive(Vasille, Vasille_0 => (Vasille_0 ?? 2) + throwNow(), [$b])
  }, Vasille);
  Vasille.tag("canvas", {
    a: {
      width: safeInit(() => throwNow())
    }
  });
  Vasille.tag("div", {}, Vasille => {
    Vasille.sText(() => throwNow());
  });
});