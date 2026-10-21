const VasilleFilePath = "steel-frame/test/dev/safe.tsx";
import { compose, positionedText as VasillePosText, setupPosition as VasilleSetupPosition, runFn as VasilleRun, ref as VasilleRef, safeLive as VasilleSafeExpr, safeState as VasilleSafeRef, toFieldRef as VasilleToFieldRef, toDeepFieldRef as VasilleToDeepFieldRef } from "steel-frame";
const C1 = compose((Vasille, props) => {
  Vasille.tag("div", {
    usage: [VasilleFilePath, 4, 4, 4, 32]
  }, Vasille => {
    Vasille.text(VasillePosText(props.$optional, [VasilleFilePath, 4, 10, 4, 25]));
  });
}, [VasilleFilePath, 3, 11, 5, 2], "C1");
function throwNow() {
  return VasilleRun(() => {
    throw new Error("x");
  }, [], [VasilleFilePath, 7, 0, 9, 1]);
}
VasilleSetupPosition(throwNow, [VasilleFilePath, 7, 0, 9, 1])
const C2 = compose(Vasille => {
  const $a = VasilleRef(3, Vasille, [VasilleFilePath, 12, 8, 12, 14], "$a");
  const $o = VasilleRef({
    a: {
      b: 1
    },
    b: 1
  }, Vasille, [VasilleFilePath, 13, 8, 13, 34], "$o");
  C1({
    "$optional": VasilleSafeExpr(Vasille, Vasille_0 => throwNow() + Vasille_0, [$a], ["$a"], [VasilleFilePath, 15, 19, 15, 34])
  }, Vasille, void 0, [VasilleFilePath, 15, 4, 15, 38]);
  C1({
    "$optional": VasilleSafeRef(() => throwNow() + 3, Vasille, [VasilleFilePath, 16, 19, 16, 33])
  }, Vasille, void 0, [VasilleFilePath, 16, 4, 16, 37]);
  C1({
    "$optional": VasilleToFieldRef(Vasille, $o, "b", [VasilleFilePath, 17, 8, 17, 31])
  }, Vasille, void 0, [VasilleFilePath, 17, 4, 17, 34]);
  C1({
    "$optional": VasilleToDeepFieldRef(Vasille, $o, ["a", "b"], [VasilleFilePath, 18, 8, 18, 33])
  }, Vasille, void 0, [VasilleFilePath, 18, 4, 18, 36]);
}, [VasilleFilePath, 11, 11, 19, 2], "C2");