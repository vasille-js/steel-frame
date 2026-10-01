import { compose, safeBind, safeComputed, safeInit, safeRef, ref } from "vasille-web";
function throwNow() {
  throw new Error("test");
}
const A = compose(Vasille => {});
const C = compose(Vasille => {
  const a = safeInit(() => throwNow());
  const $b = safeRef(() => throwNow(), Vasille);
  const $c = safeRef(() => 2 + throwNow(), Vasille);
  const $d = safeBind(Vasille, Vasille_0 => (Vasille_0 ?? 2) + throwNow(), [$b]);
  const $e = safeComputed(Vasille, () => {
    return throwNow();
  }, []);
  A({
    "$a": ref(safeInit(() => throwNow()), Vasille)
  }, Vasille);
  A({
    "$a": safeRef(() => throwNow(), Vasille)
  }, Vasille);
  A({
    "$a": safeRef(() => 2 + throwNow(), Vasille)
  }, Vasille);
  A({
    "$a": safeBind(Vasille, Vasille_0 => (Vasille_0 ?? 2) + throwNow(), [$b])
  }, Vasille);
  A({
    "$a": safeComputed(Vasille, () => throwNow(), [])
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