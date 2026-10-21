import { bind, compose, ref as VasilleRef, toFieldRef as VasilleToFieldRef, toDeepFieldRef as VasilleToDeepFieldRef } from "vasille-web";
const A = compose(Vasille => {});
const C = compose(Vasille => {
  const wr_obj = VasilleRef({
    a: 1,
    b: {
      a: 1
    }
  }, Vasille);
  const wr_ref1 = VasilleToFieldRef(Vasille, wr_obj, "a");
  const wr_ref2 = VasilleToDeepFieldRef(Vasille, wr_obj, ["b", "a"]);
  const wr_ref3 = VasilleToFieldRef(Vasille, wr_obj.V, "a");
  const wr_ref4 = VasilleToDeepFieldRef(Vasille, wr_obj.V, ["b", "a"]);
  const a = "a";
  const wr_ref5 = VasilleToFieldRef(Vasille, wr_obj, a);
  const wr_ref6 = VasilleToDeepFieldRef(Vasille, wr_obj, ["b", a]);
  const wr_ref7 = VasilleToFieldRef(Vasille, wr_obj.V, a);
  const wr_ref8 = VasilleToDeepFieldRef(Vasille, wr_obj.V, ["b", a]);
  A({
    r_a: bind(Vasille, Vasille_0 => Vasille_0.a, [wr_obj]),
    wr_a: VasilleToFieldRef(Vasille, wr_obj, "a")
  }, Vasille);
  A({
    r_a: bind(Vasille, Vasille_0 => Vasille_0.b.a, [wr_obj]),
    wr_a: VasilleToDeepFieldRef(Vasille, wr_obj, ["b", "a"])
  }, Vasille);
  A({
    r_a: bind(Vasille, Vasille_0 => Vasille_0.a, [wr_obj]),
    wr_a: VasilleToFieldRef(Vasille, wr_obj, "a")
  }, Vasille);
  A({
    r_a: bind(Vasille, Vasille_0 => Vasille_0.b.a, [wr_obj]),
    wr_a: VasilleToDeepFieldRef(Vasille, wr_obj, ["b", "a"])
  }, Vasille);
});