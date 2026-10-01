import { bind, compose, fieldRef, ref as VasilleRef, toFieldRef as VasilleToFieldRef, toDeepFieldRef as VasilleToDeepFieldRef } from "vasille-web";
const A = compose(Vasille => {});
const C = compose(Vasille => {
  const $obj = VasilleRef({
    a: 1,
    b: {
      a: 1
    }
  }, Vasille);
  const $ref1 = VasilleToFieldRef(Vasille, $obj, "a");
  const $ref2 = VasilleToDeepFieldRef(Vasille, $obj, ["b", "a"]);
  const $ref3 = VasilleToFieldRef(Vasille, $obj.V, "a");
  const $ref4 = VasilleToDeepFieldRef(Vasille, $obj.V, ["b", "a"]);
  const a = "a";
  const $ref5 = VasilleToFieldRef(Vasille, $obj, a);
  const $ref6 = VasilleToDeepFieldRef(Vasille, $obj, ["b", a]);
  const $ref7 = VasilleToFieldRef(Vasille, $obj.V, a);
  const $ref8 = VasilleToDeepFieldRef(Vasille, $obj.V, ["b", a]);
  A({
    "$a1": VasilleToFieldRef(Vasille, $obj, "a"),
    "$a2": VasilleToDeepFieldRef(Vasille, $obj, ["b", "a"])
  }, Vasille);
  A({
    "$a1": VasilleToFieldRef(Vasille, $obj, "a"),
    "$a2": VasilleToDeepFieldRef(Vasille, $obj, ["b", "a"])
  }, Vasille);
  A({
    "$a1": bind(Vasille, Vasille_0 => Vasille_0.a, [$obj]),
    "$a2": bind(Vasille, Vasille_0 => Vasille_0.b.a, [$obj])
  }, Vasille);
});