import { compose, safeInit as VasilleSafeInit } from "vasille-web";
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
});