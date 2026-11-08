const VasilleFilePath = "steel-frame/test/steel-frame/dev/awaited.ts";
import { awaited, component } from "steel-frame";
const C = component(Vasille => {
  const [$err, $data] = awaited(async () => {
    return 1;
  }, [[[VasilleFilePath, 4, 11, 4, 15], "$err"], [[VasilleFilePath, 4, 17, 4, 22], "$data"]], Vasille);
}, [VasilleFilePath, 3, 10, 7, 2], "C");
