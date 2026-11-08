import { compose, live, ref as VasilleRef, safeInit as VasilleSafeInit, safeLive as VasilleSafeExpr, safeState as VasilleSafeRef } from "vasille-web";
const C1 = compose((Vasille, props) => {
  Vasille.tag("div", {}, Vasille => {
    Vasille.text(props.required);
    Vasille.text(props.optional);
  });
});
function throwNow() {
  throw new Error("x");
}
const C2 = compose(Vasille => {
  const $a = VasilleRef(3, Vasille);
  C1({
    required: 1
  }, Vasille);
  C1({
    required: 1,
    optional: VasilleSafeInit(throwNow)
  }, Vasille);
  VasilleSafeInit(() => C1({
    required: throwNow(),
    optional: 1
  }, Vasille));
  VasilleSafeInit(() => C1({
    required: throwNow(),
    optional: VasilleSafeInit(throwNow)
  }, Vasille));
  C1({
    required: 1,
    "$optional": VasilleSafeExpr(Vasille, Vasille_0 => throwNow() + Vasille_0, [$a])
  }, Vasille);
  C1({
    required: 1,
    "$optional": VasilleSafeRef(() => throwNow() + 3, Vasille)
  }, Vasille);
  C1({
    required: 1,
    "$optional": VasilleSafeRef(() => throwNow(), Vasille)
  }, Vasille);
});