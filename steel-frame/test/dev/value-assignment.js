const VasilleFilePath = "steel-frame/test/dev/value-assignment.ts";
import { component, ref, setupPosition as VasilleSetupPosition, executionPosition as VasilleExePos, runFn as VasilleRun } from "steel-frame";
const C = component(Vasille => {
  const $a = ref(1, Vasille, [VasilleFilePath, 4, 8, 4, 14], "$a");
  const o = {
    $a: ref(1, Vasille, [VasilleFilePath, 5, 16, 5, 21]),
    c: 2
  };
  function update(...VasilleArgs) {
    return VasilleRun(a => {
      $a.up(a, VasilleExePos([VasilleFilePath, 8, 8, 8, 14]));
      o.$a.up(a, VasilleExePos([VasilleFilePath, 9, 8, 9, 16]));
      o.c = 3;
    }, VasilleArgs, [VasilleFilePath, 7, 4, 11, 5]);
  }
  VasilleSetupPosition(update, [VasilleFilePath, 7, 4, 11, 5])
}, [VasilleFilePath, 3, 10, 12, 2], "C");
let $b = ref(1, null, [VasilleFilePath, 14, 4, 14, 15]);
const obj = {
  $r: ref(1, null, [VasilleFilePath, 16, 4, 16, 14]),
  x: 2
};
function update1(...VasilleArgs) {
  return VasilleRun(a => {
    $b.up(a, VasilleExePos([VasilleFilePath, 21, 4, 21, 10]));
    obj.$r.up(2, VasilleExePos([VasilleFilePath, 22, 4, 22, 14]));
    obj.x = 3;
  }, VasilleArgs, [VasilleFilePath, 20, 0, 24, 1]);
}
VasilleSetupPosition(update1, [VasilleFilePath, 20, 0, 24, 1])
