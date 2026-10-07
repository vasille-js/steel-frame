const VasilleFilePath = "babel-plugin-vasille/test/dev/safe.tsx";
import { compose, positionedText as VasillePosText, setupPosition as VasilleSetupPosition, runFn as VasilleRun, ref as VasilleRef, safeLive as VasilleSafeExpr, safeState as VasilleSafeRef, toFieldRef as VasilleToFieldRef, toDeepFieldRef as VasilleToDeepFieldRef } from "steel-frame";
const C1 = compose((Vasille, props) => {
  Vasille.tag("div", {
    usage: [VasilleFilePath, 4, 2, 4, 30]
  }, Vasille => {
    Vasille.text(VasillePosText(props.$optional, [VasilleFilePath, 4, 8, 4, 23]));
  });
}, [VasilleFilePath, 3, 11, 5, 2], "C1");
function throwNow() {
  return VasilleRun(() => {
    throw new Error("x");
  }, [], [VasilleFilePath, 7, 0, 9, 1]);
}
VasilleSetupPosition(throwNow, [VasilleFilePath, 7, 0, 9, 1])
const C2 = compose(Vasille => {
  const $a = VasilleRef(3, Vasille, [VasilleFilePath, 12, 6, 12, 12], "$a");
  const $o = VasilleRef({
    a: {
      b: 1
    },
    b: 1
  }, Vasille, [VasilleFilePath, 13, 6, 13, 32], "$o");
  C1({
    "$optional": VasilleSafeExpr(Vasille, Vasille_0 => throwNow() + Vasille_0, [$a], ["$a"], [VasilleFilePath, 15, 17, 15, 32])
  }, Vasille, void 0, [VasilleFilePath, 15, 2, 15, 36]);
  C1({
    "$optional": VasilleSafeRef(() => throwNow() + 3, Vasille, [VasilleFilePath, 16, 17, 16, 31])
  }, Vasille, void 0, [VasilleFilePath, 16, 2, 16, 35]);
  C1({
    "$optional": VasilleToFieldRef(Vasille, $o, "b", [VasilleFilePath, 17, 17, 17, 21])
  }, Vasille, void 0, [VasilleFilePath, 17, 2, 17, 25]);
  C1({
    "$optional": VasilleToDeepFieldRef(Vasille, $o, ["a", "b"], [VasilleFilePath, 18, 17, 18, 23])
  }, Vasille, void 0, [VasilleFilePath, 18, 2, 18, 27]);
}, [VasilleFilePath, 11, 11, 19, 2], "C2");